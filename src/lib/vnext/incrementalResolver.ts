import type { AgeBand, ConflictCarrier, GenderPresentation, PilotClassId, PilotSpeciesId, PowerVisibility, ProfessionSalience, SceneStrategy, ScoreTraceEntry, SemanticAnchor, SemanticSeed, VNextInput } from './contracts';
import { evaluateRules } from './ruleEngine';
import { getProfession, vnextAffordances, vnextFacts, vnextSemanticFacts } from './facts';
import { affinityWeight, professionAffinityFor } from './affinity';

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223 >>> 0;
    return state / 4294967296;
  };
}

function pick<T extends { id?: string } | string>(items: T[], rng: () => number, step: string, trace: ScoreTraceEntry[], scoreBoost: (item: T) => number = () => 0) {
  let best = items[0];
  let bestScore = -Infinity;
  for (const item of items) {
    const id = typeof item === 'string' ? item : item.id ?? JSON.stringify(item);
    const score = Math.round(rng() * 100) + scoreBoost(item);
    trace.push({ step, candidateId: id, score, reasons: [`seeded score ${score}`] });
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

const ageBands: AgeBand[] = ['young_adult', 'adult', 'middle_aged', 'elder'];
const genders: GenderPresentation[] = ['masculine', 'feminine', 'androgynous'];
const socialRoles = ['trusted practical expert', 'uneasy community witness', 'quiet problem solver', 'responsible outsider'];
const goals = ['prevent immediate harm', 'prove a hidden truth', 'finish a dangerous duty', 'protect someone dependent', 'keep an agreement from collapsing', 'solve a practical problem before it becomes violence'];
const obstacles = ['locked threshold', 'frightened witness', 'unstable weather', 'hostile suspicion', 'failing structure', 'contradictory evidence', 'crowd expectation'];
const risks = ['public panic', 'harmful power exposure', 'lost evidence', 'community blame', 'physical injury', 'broken trust', 'a dependent person abandoned'];
const pressures = ['time is narrowing', 'someone is watching', 'the room is losing trust', 'weather is worsening', 'authority is arriving', 'the tool may fail'];
const motionStates = ['contained forward motion', 'braced stillness', 'measured crouch', 'controlled turn toward the threat', 'hands moving faster than the body', 'balanced step into pressure', 'interrupted recovery', 'quiet lateral repositioning', 'public stillness under pressure', 'tool-led forward lean'];

const salienceWeights: Array<{ id: ProfessionSalience; weight: number }> = [
  { id: 'background', weight: 20 },
  { id: 'trace', weight: 30 },
  { id: 'secondary', weight: 35 },
  { id: 'strong', weight: 12 },
  { id: 'dominant', weight: 3 },
];

function weightedPick<T extends string>(items: Array<{ id: T; weight: number }>, rng: () => number) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = rng() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item.id;
  }
  return items[items.length - 1].id;
}

function selectProfession(classId: PilotClassId, explicitId: string | undefined, rng: () => number, trace: ScoreTraceEntry[], preferences: string[] = []) {
  const locked = explicitId ? getProfession(explicitId) : undefined;
  if (locked) return locked;
  return pick(vnextAffordances.professions, rng, 'identity.profession', trace, (item) => {
    const affinity = professionAffinityFor(classId, item.id);
    const preferenceBoost = preferences.includes(item.id) ? 25 : 0;
    return affinityWeight(affinity) * 3 + preferenceBoost;
  });
}

function selectProfessionSalience(input: VNextInput, affinity: ReturnType<typeof professionAffinityFor>, rng: () => number, trace: ScoreTraceEntry[]): ProfessionSalience {
  const locked = input.professionSalience ?? input.locks?.professionSalience;
  if (locked) {
    trace.push({ step: 'life.professionSalience', candidateId: locked, score: 200, reasons: ['locked salience'] });
    return locked;
  }
  const weights = salienceWeights.map((item) => ({ ...item }));
  if (affinity === 'rare_contrast') {
    for (const item of weights) {
      if (item.id === 'background' || item.id === 'trace') item.weight *= 1.7;
      if (item.id === 'strong') item.weight *= 0.45;
      if (item.id === 'dominant') item.weight *= 0.15;
    }
  }
  const salience = weightedPick(weights, rng);
  trace.push({ step: 'life.professionSalience', candidateId: salience, score: Math.round(rng() * 100), reasons: [`affinity ${affinity}`, 'weighted salience'] });
  return salience;
}

const classPremises: Record<string, string[]> = {
  warlock: ['refuse a bargain payment while someone vulnerable waits nearby', 'hide the cost of borrowed power during a public decision', 'break a promise to the source before it claims another witness'],
  paladin: ['choose mercy where the law expects punishment', 'hold an oath steady while a frightened crowd demands certainty', 'stand between public duty and private harm'],
  barbarian: ['withhold force long enough to protect the wrongfully accused', 'turn rage into shelter while the real threat draws closer', 'carry pain without letting it decide the next action'],
  fighter: ['hold the line while a practical failure threatens someone behind them', 'read the threat before anyone else understands its angle', 'recover from a blow while keeping another person shielded'],
  cleric: ['offer aid where doctrine gives no easy answer', 'protect a dependent person while a sacred duty becomes ambiguous', 'keep a community ritual from turning into judgment'],
  rogue: ['protect someone without revealing the escape route', 'use precision to prevent violence before the room notices', 'hide the useful truth until it can save the right person'],
  wizard: ['test a dangerous pattern while refusing the obvious shortcut', 'prove what failed before the evidence is destroyed', 'hold a fragile conclusion against public pressure'],
  druid: ['answer a living system under stress while people demand control', 'protect a boundary that is ecological before it is legal', 'read a natural warning before the community panics'],
  bard: ['redirect a crowd with timing instead of spectacle', 'turn a public accusation into a moment of listening', 'keep a fragile agreement alive with one measured gesture'],
  monk: ['absorb pressure without letting it become violence', 'redirect a threat while keeping a student or dependent calm', 'choose stillness where force would be easier'],
  ranger: ['guide someone through danger while the terrain changes underfoot', 'read a distant threat before it reaches the dependent person', 'choose the safe route that looks wrong to everyone else'],
  sorcerer: ['contain a bodily surge while protecting the nearest witness', 'make one careful choice before innate power answers too loudly', 'keep fear from becoming the trigger everyone expects'],
  artificer: ['repair the only practical option before panic breaks it', 'trust one field device while people demand a miracle', 'keep heat and failure contained inside the work'],
};

function pickDramaticScene(classId: string, professionId: string, salience: ProfessionSalience, profession: { scenes: string[] }, rng: () => number, trace: ScoreTraceEntry[]) {
  if (salience === 'dominant') return pick(profession.scenes, rng, 'currentMoment.scene', trace);
  if (salience === 'strong' && rng() > 0.45) return pick(profession.scenes, rng, 'currentMoment.scene', trace);
  const premise = pick(classPremises[classId] ?? goals, rng, 'currentMoment.dramaticPremise', trace);
  if (salience === 'trace' && professionId === 'lamplighter') return `${premise}; a soot mark at one cuff hints at lamp work without setting the scene`;
  return premise;
}


const anchorInterpretations: Record<SemanticAnchor, string[]> = {
  forbidden_power: ['concealment', 'negotiation', 'accidental exposure', 'reluctant use', 'refusal', 'containment', 'transfer', 'aftermath', 'dependency', 'social suspicion'],
  personal_contradiction: ['public restraint', 'private hesitation', 'divided loyalty', 'role reversal', 'protective choice', 'self-sabotage', 'ritual conflict', 'practical compromise', 'delayed decision', 'visible consequence'],
  social_duty: ['protection', 'mediation', 'instruction', 'judgment', 'repair', 'escort', 'testimony', 'distribution', 'containment', 'public failure'],
  current_danger: ['approach', 'aftermath', 'warning', 'evacuation', 'rescue', 'pursuit', 'concealment', 'preparation', 'standoff', 'recovery'],
  relationship: ['dependence', 'mistrust', 'obligation', 'rivalry', 'mentorship', 'protection', 'negotiation', 'grief', 'accusation', 'reconciliation'],
  class_conflict: ['trained restraint', 'failed expectation', 'improvised discipline', 'public competence', 'private cost', 'class pressure', 'reframed skill', 'withheld display'],
  profession: ['direct work', 'public work', 'contested work', 'failed work', 'witnessed work', 'dangerous work', 'interrupted work', 'necessary work'],
  species_presence: ['scale tension', 'adapted clothing', 'reach problem', 'gait pressure', 'body mechanics', 'spatial mismatch', 'social gaze', 'material fit'],
};

const sceneStrategies: SceneStrategy[] = ['direct_action', 'interrupted_action', 'aftermath', 'anticipation', 'social_exchange', 'hidden_observation', 'protective_interposition', 'object_examination', 'spatial_blockage', 'movement_through_space', 'public_role', 'private_decision'];
const conflictCarriers: ConflictCarrier[] = ['body', 'relationship', 'object', 'environment', 'institution', 'time_pressure', 'public_judgment', 'physical_obstacle', 'internal_hesitation'];

function pickPriorityElement<T extends string>(items: T[], rng: () => number, step: string, trace: ScoreTraceEntry[], saltBoost = 0) {
  const picked = pick(items, rng, step, trace, (_item) => saltBoost);
  return picked;
}

function priorityFor(classId: string, salience: ProfessionSalience, visibility: PowerVisibility, roleContradiction: string, rng: () => number, trace: ScoreTraceEntry[]): { dominant: SemanticAnchor; anchorInterpretation: string; sceneStrategy: SceneStrategy; conflictCarrier: ConflictCarrier; supporting: SemanticAnchor; minor: SemanticAnchor | 'profession_trace' | 'none'; suppressed: string[] } {
  const anchorCandidates: Array<{ id: SemanticAnchor; weight: number }> = [
    { id: 'personal_contradiction', weight: 24 },
    { id: 'forbidden_power', weight: visibility !== 'none' ? 22 : 9 },
    { id: 'social_duty', weight: /protect|responsibility|community/i.test(roleContradiction) ? 20 : 13 },
    { id: 'current_danger', weight: 16 },
    { id: 'relationship', weight: 14 },
    { id: 'class_conflict', weight: 13 },
    { id: 'species_presence', weight: 6 },
  ];
  if (salience === 'dominant') anchorCandidates.push({ id: 'profession', weight: 35 });
  const dominant = weightedPick(anchorCandidates, rng);
  const supportingPool = (['class_conflict', 'social_duty', 'forbidden_power', 'relationship', 'current_danger'] as SemanticAnchor[])
    .filter((anchor) => anchor !== dominant)
    .filter((anchor) => !(anchor === 'profession' && salience !== 'dominant'));
  const supporting = pickPriorityElement(supportingPool, rng, 'priority.supportingAnchor', trace);
  const anchorInterpretation = pickPriorityElement(anchorInterpretations[dominant], rng, 'priority.anchorInterpretation', trace);
  const sceneStrategy = pickPriorityElement(sceneStrategies, rng, 'priority.sceneStrategy', trace);
  const conflictCarrier = pickPriorityElement(conflictCarriers, rng, 'priority.conflictCarrier', trace);
  const minor = salience === 'background' ? 'none' : salience === 'trace' ? 'profession_trace' : 'profession';
  const suppressed = salience === 'background' ? ['profession_scene', 'profession_tool', 'profession_title', 'profession_environment', 'profession_composition'] : salience === 'trace' ? ['profession_scene', 'profession_tool_as_primary', 'profession_title', 'profession_environment', 'profession_composition'] : salience === 'secondary' ? ['profession_environment', 'profession_composition', 'profession_title_when_not_needed'] : [];
  return { dominant, anchorInterpretation, sceneStrategy, conflictCarrier, supporting, minor, suppressed };
}


function relationshipToPower(classId: string) {
  const relationships: Record<string, string> = {
    warlock: 'bargains with power while limiting what it can claim',
    cleric: 'serves power as responsibility rather than spectacle',
    paladin: 'carries power as a public oath with private doubts',
    wizard: 'treats power as a dangerous structure that must be proven',
    druid: 'negotiates with living systems rather than commanding them',
    bard: 'uses attention, timing, and shared feeling as leverage',
    sorcerer: 'contains innate pressure before it spills into the room',
    artificer: 'channels power through materials, repairs, and field devices',
    monk: 'keeps power in breath, discipline, and redirection',
    ranger: 'trusts trained attention to terrain before visible magic',
    rogue: 'uses skill and timing before letting power be seen',
    barbarian: 'turns endurance and fury into protection rather than display',
    fighter: 'trusts training before supernatural answers',
  };
  return relationships[classId] ?? 'keeps power subordinate to the immediate task';
}

function pickPowerCost(classId: string) {
  const costs: Record<string, string> = {
    warlock: 'attention pulled toward the bargain',
    cleric: 'personal exhaustion after mercy',
    paladin: 'public certainty straining against private doubt',
    wizard: 'mental strain from holding a pattern stable',
    druid: 'pain carried through the local living world',
    bard: 'voice or confidence spent at the wrong moment',
    sorcerer: 'body pressure rising too fast to hide',
    artificer: 'device heat and failing calibration',
    monk: 'breath control stretched thin',
    barbarian: 'physical fatigue sharpened into restraint',
  };
  return costs[classId] ?? 'physical fatigue';
}

export function resolveSemanticSeed(input: VNextInput): SemanticSeed {
  const deterministicSeed = String(input.rngSeed);
  const rng = createRng(deterministicSeed);
  const scoreTrace: ScoreTraceEntry[] = [];
  const lockedFields: string[] = [];

  const classId = input.classId ?? input.locks?.classId ?? (pick(vnextFacts.classes, rng, 'identity.class', scoreTrace).id);
  if (input.classId || input.locks?.classId) lockedFields.push('classId');
  const speciesId = input.speciesId ?? input.locks?.speciesId ?? (pick(vnextFacts.species, rng, 'identity.species', scoreTrace).id);
  if (input.speciesId || input.locks?.speciesId) lockedFields.push('speciesId');
  const profession = selectProfession(classId as PilotClassId, input.professionId ?? input.locks?.professionId, rng, scoreTrace, input.preferences);
  if (input.professionId || input.locks?.professionId) lockedFields.push('professionId');
  const professionAffinity = professionAffinityFor(classId as PilotClassId, profession.id);
  const professionSalience = selectProfessionSalience(input, professionAffinity, rng, scoreTrace);
  if (input.professionSalience || input.locks?.professionSalience) lockedFields.push('professionSalience');

  const ageBand = input.locks?.ageBand ?? pick(ageBands, rng, 'identity.age', scoreTrace);
  const genderPresentation = input.locks?.genderPresentation ?? pick(genders, rng, 'identity.gender', scoreTrace);
  const classFact = vnextFacts.classes.find((item) => item.id === classId)!;
  const speciesFact = vnextFacts.species.find((item) => item.id === speciesId)!;
  const culture = pick(vnextFacts.cultures, rng, 'world.culture', scoreTrace);
  const environment = pick(vnextFacts.environments, rng, 'world.environment', scoreTrace);
  const source = vnextFacts.powerSources.find((item) => item.classes.includes(classId)) ?? vnextFacts.powerSources[0];
  const visibility = input.locks?.visibility ?? pick(source.visibility, rng, 'power.visibility', scoreTrace, (item) => item === 'full_apparition' ? -80 : 0) as PowerVisibility;
  if (input.locks?.visibility) lockedFields.push('visibility');

  const state = { classId, speciesId, professionId: profession.id, powerSourceId: source.id, powerVisibility: visibility, professionToolSelected: true };
  const ruleResult = evaluateRules(state);
  const dailyHabit = pick(profession.habits, rng, 'life.dailyHabit', scoreTrace);
  const tool = pick(profession.tools, rng, 'life.tool', scoreTrace, (item) => {
    if (profession.id !== 'courtier') return 0;
    if (item === 'folded petition' || item === 'signet ribbon') return 45;
    if (item === 'thin ceremonial blade') return -35;
    return 0;
  });
  const responsibility = pick(profession.responsibilities, rng, 'life.responsibility', scoreTrace);
  const sceneArchetypePool = professionSalience === 'dominant' ? profession.sceneArchetypes : vnextFacts.sceneArchetypes.map((item) => item.id);
  const sceneArchetypeId = pick(sceneArchetypePool, rng, 'currentMoment.sceneArchetype', scoreTrace);
  const sceneArchetype = vnextFacts.sceneArchetypes.find((item) => item.id === sceneArchetypeId) ?? vnextFacts.sceneArchetypes[0];
  const scene = pickDramaticScene(classId, profession.id, professionSalience, profession, rng, scoreTrace);
  const professionTension = pick(profession.tensions, rng, 'tension.profession', scoreTrace);
  const matchingContradiction = vnextFacts.tensionTemplates.roleContradictions.find((item) => item.includes(classId) && item.includes(profession.id.replace(/_/g, ' ')));
  const roleContradiction = matchingContradiction ?? (professionAffinity === 'rare_contrast' ? `${classFact.label.toLowerCase()} carrying a rare ${profession.label.toLowerCase()} history without letting it define the scene` : `${classFact.label.toLowerCase()} balancing ${professionTension}`);
  scoreTrace.push({ step: 'tension.roleContradiction', candidateId: roleContradiction, score: matchingContradiction ? 135 : 85, reasons: [matchingContradiction ? 'matched explicit role contradiction' : 'composed from class and profession tension'] });
  const socialTension = pick([...vnextFacts.tensionTemplates.socialTensions, ...culture.tensions, ...profession.tensions], rng, 'tension.social', scoreTrace);
  const innerConflict = pick(vnextFacts.tensionTemplates.innerConflicts, rng, 'tension.innerConflict', scoreTrace);
  const sacredVsProfane = pick(vnextFacts.tensionTemplates.sacredProfane, rng, 'tension.sacredProfane', scoreTrace);
  const expectationVsBehavior = pick(vnextFacts.tensionTemplates.expectations, rng, 'tension.expectation', scoreTrace);
  const goal = pick(goals, rng, 'moment.goal', scoreTrace);
  const obstacle = pick([...sceneArchetype.obstacles, ...obstacles], rng, 'moment.obstacle', scoreTrace, (item) => profession.id === 'courtier' && item === 'locked threshold' ? 55 : 0);
  const risk = pick(risks, rng, 'moment.risk', scoreTrace);
  const pressure = pick(pressures, rng, 'moment.pressure', scoreTrace);
  const motionEnergy = pick(motionStates, rng, 'moment.motionEnergy', scoreTrace);

  const priority = priorityFor(classId, professionSalience, visibility, roleContradiction, rng, scoreTrace);

  const seed: SemanticSeed = {
    schemaVersion: vnextSemanticFacts.schemaVersion,
    deterministicSeed,
    lockedFields,
    selectedFactIds: [classId, speciesId, profession.id, professionSalience, professionAffinity, culture.id, environment.id, source.id, visibility],
    identity: {
      classId: classId as PilotClassId,
      speciesId: speciesId as PilotSpeciesId,
      professionId: profession.id,
      profession: profession.label,
      ageBand,
      genderPresentation,
      socialRole: pick(socialRoles, rng, 'identity.socialRole', scoreTrace),
      culturalContext: culture.label,
    },
    psychology: {
      dominantDrive: pick(vnextFacts.psychology.drives, rng, 'psychology.drive', scoreTrace),
      value: pick(vnextFacts.psychology.values, rng, 'psychology.value', scoreTrace),
      fear: pick(vnextFacts.psychology.fears, rng, 'psychology.fear', scoreTrace),
      contradiction: professionTension,
      copingStrategy: pick(vnextFacts.psychology.coping, rng, 'psychology.coping', scoreTrace),
      emotionalRestraint: pick(vnextFacts.psychology.restraint, rng, 'psychology.restraint', scoreTrace),
      relationshipToPower: relationshipToPower(classId),
    },
    life: {
      profession: profession.label,
      dailyHabit,
      learnedSkill: classFact.evidence[0],
      bodyHabit: dailyHabit,
      socialResponsibility: responsibility,
      livedInTrace: profession.wear[0],
      materialHistory: profession.materials[0] ?? culture.materials[0],
      personalObject: tool,
      professionSalience,
      professionAffinity,
      professionEvidenceChannels: professionSalience === 'background' ? [] : professionSalience === 'trace' ? ['wear'] : professionSalience === 'secondary' ? ['habit', 'wear'] : professionSalience === 'strong' ? ['skill', 'habit', 'wear', 'tool'] : ['skill', 'habit', 'wear', 'tool', 'direct work scene'],
      reputation: professionAffinity === 'rare_contrast' ? `known for unlikely ${profession.label.toLowerCase()} experience` : `known locally as a ${profession.label.toLowerCase()}`,
    },
    tension: {
      roleContradiction,
      socialTension,
      innerConflict,
      dutyVsInstinct: innerConflict,
      sacredVsProfane,
      professionClassFriction: professionTension,
      expectationVsBehavior,
    },
    currentMoment: {
      sceneArchetype: sceneArchetype.id,
      currentAction: scene,
      immediateTask: scene,
      goal,
      obstacle,
      stakes: `if ${goal} fails, ${risk} follows`,
      dependent: responsibility,
      risk,
      pressure,
      hiddenPressure: profession.id === 'courtier' ? `${socialTension}; a sealed order in the witness hand marks the private threat` : socialTension,
      targetOfAttention: profession.id === 'courtier' ? `${responsibility}, a witness, and the person harmed by the law` : responsibility,
      urgency: 'immediate but controlled',
      failurePoint: `${sceneArchetype.label} fails because the ${tool} or ${dailyHabit} gives way`,
      motionEnergy,
      narrativeIntent: `${scene}; the image should make ${roleContradiction} visible through ${sceneArchetype.gesture[0]} and ${dailyHabit}`,
      visualConsequence: profession.id === 'courtier' ? 'courtier work requires a social gesture, witness relation, status material, and threshold composition' : `${sceneArchetype.label} requires ${sceneArchetype.posture[0]}, ${sceneArchetype.gesture[0]}, and ${sceneArchetype.composition[0]}`,
      consequenceOfFailure: `the ${responsibility} fails and the community pays the cost`,
    },
    power: {
      source: source.label,
      sourceId: source.id,
      relationshipToSource: relationshipToPower(classId),
      visibility,
      intensity: visibility === 'none' ? 'none' : visibility === 'full_apparition' ? 'high' : 'low',
      control: visibility === 'full_apparition' ? 'unstable and rare' : 'contained by action',
      cost: pickPowerCost(classId),
      manifestationCarrier: visibility === 'object' ? tool : visibility === 'shadow' ? 'single shadow echo' : visibility === 'environmental' ? environment.weather : visibility,
      sourcePhysicallyVisible: visibility === 'full_apparition',
    },
    world: {
      environment: environment.label,
      environmentId: environment.id,
      culture: culture.label,
      cultureId: culture.id,
      community: culture.label,
      weather: environment.weather,
      architecture: environment.architecture,
      socialTension: culture.tensions[0],
      currentScene: scene,
    },
    priorityPlan: {
      dominant: priority.dominant,
      anchorInterpretation: priority.anchorInterpretation,
      sceneStrategy: priority.sceneStrategy,
      conflictCarrier: priority.conflictCarrier,
      supporting: priority.supporting,
      minor: priority.minor,
      suppressed: priority.suppressed,
      professionSalience,
      professionAffinity,
    },
    visualIntent: {
      silhouettePrinciple: `${speciesFact.markers[0]} shaped by ${classFact.affordances[0]}`,
      primaryAnchor: scene,
      secondaryAnchor: professionSalience === 'dominant' ? `${profession.label} work controls the immediate action` : `${classFact.label} evidence and ${relationshipToPower(classId)} shape the decision`,
      focalHierarchy: sceneArchetype.focalOrder,
      detailBudget: 'controlled',
      mood: `${input.noveltyMode === 'strong' ? 'unusual but grounded' : 'restrained cinematic'} pressure shaped by ${roleContradiction}`,
      compositionIntent: sceneArchetype.composition[0],
    },
    scoreTrace,
    appliedRules: ruleResult.applied,
    rejectedCandidates: scoreTrace.filter((entry) => entry.rejected),
    qaFlags: ruleResult.blockingErrors.length ? ruleResult.blockingErrors : ['hard-rules-passed', 'deterministic-seed', `profession-salience:${professionSalience}`, `profession-affinity:${professionAffinity}`, 'priority-plan-applied'],
  };
  return seed;
}
