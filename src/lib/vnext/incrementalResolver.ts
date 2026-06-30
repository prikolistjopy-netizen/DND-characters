import type { AgeBand, GenderPresentation, PilotClassId, PilotSpeciesId, PowerVisibility, ScoreTraceEntry, SemanticSeed, VNextInput } from './contracts';
import { evaluateRules } from './ruleEngine';
import { getProfession, vnextAffordances, vnextFacts, vnextSemanticFacts } from './facts';

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
const motionStates = ['contained forward motion', 'braced stillness', 'measured crouch', 'controlled turn toward the threat', 'hands moving faster than the body', 'balanced step into pressure'];

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
  const profession = getProfession(input.professionId ?? input.locks?.professionId ?? '') ?? pick(vnextAffordances.professions, rng, 'identity.profession', scoreTrace, (item) => input.preferences?.includes(item.id) ? 25 : 0);
  if (input.professionId || input.locks?.professionId) lockedFields.push('professionId');

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
  const tool = pick(profession.tools, rng, 'life.tool', scoreTrace);
  const responsibility = pick(profession.responsibilities, rng, 'life.responsibility', scoreTrace);
  const scene = pick(profession.scenes, rng, 'currentMoment.scene', scoreTrace);
  const professionTension = pick(profession.tensions, rng, 'tension.profession', scoreTrace);
  const matchingContradiction = vnextFacts.tensionTemplates.roleContradictions.find((item) => item.includes(classId) && item.includes(profession.id.replace(/_/g, ' ')));
  const roleContradiction = matchingContradiction ?? `${classFact.label.toLowerCase()} ${profession.label} balancing ${professionTension}`;
  scoreTrace.push({ step: 'tension.roleContradiction', candidateId: roleContradiction, score: matchingContradiction ? 135 : 85, reasons: [matchingContradiction ? 'matched explicit role contradiction' : 'composed from class and profession tension'] });
  const socialTension = pick([...vnextFacts.tensionTemplates.socialTensions, ...culture.tensions, ...profession.tensions], rng, 'tension.social', scoreTrace);
  const innerConflict = pick(vnextFacts.tensionTemplates.innerConflicts, rng, 'tension.innerConflict', scoreTrace);
  const sacredVsProfane = pick(vnextFacts.tensionTemplates.sacredProfane, rng, 'tension.sacredProfane', scoreTrace);
  const expectationVsBehavior = pick(vnextFacts.tensionTemplates.expectations, rng, 'tension.expectation', scoreTrace);
  const goal = pick(goals, rng, 'moment.goal', scoreTrace);
  const obstacle = pick(obstacles, rng, 'moment.obstacle', scoreTrace);
  const risk = pick(risks, rng, 'moment.risk', scoreTrace);
  const pressure = pick(pressures, rng, 'moment.pressure', scoreTrace);
  const motionEnergy = pick(motionStates, rng, 'moment.motionEnergy', scoreTrace);

  const seed: SemanticSeed = {
    schemaVersion: vnextSemanticFacts.schemaVersion,
    deterministicSeed,
    lockedFields,
    selectedFactIds: [classId, speciesId, profession.id, culture.id, environment.id, source.id, visibility],
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
      currentAction: scene,
      immediateTask: scene,
      goal,
      obstacle,
      stakes: `if ${goal} fails, ${risk} follows`,
      dependent: responsibility,
      risk,
      pressure,
      hiddenPressure: socialTension,
      targetOfAttention: responsibility,
      urgency: 'immediate but controlled',
      failurePoint: `the ${tool} or ${dailyHabit} fails under pressure`,
      motionEnergy,
      narrativeIntent: `${scene}; the image should show ${roleContradiction} through ${dailyHabit}`,
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
    visualIntent: {
      silhouettePrinciple: `${speciesFact.markers[0]} shaped by ${classFact.affordances[0]}`,
      primaryAnchor: scene,
      secondaryAnchor: `${profession.label} handling of ${tool} while ${professionTension}`,
      focalHierarchy: ['face and action', tool, 'profession wear', 'power only if visible', 'environment secondary'],
      detailBudget: 'controlled',
      mood: `${input.noveltyMode === 'strong' ? 'unusual but grounded' : 'restrained cinematic'} pressure shaped by ${roleContradiction}`,
      compositionIntent: 'full-body character concept caught in a specific working moment',
    },
    scoreTrace,
    appliedRules: ruleResult.applied,
    rejectedCandidates: scoreTrace.filter((entry) => entry.rejected),
    qaFlags: ruleResult.blockingErrors.length ? ruleResult.blockingErrors : ['hard-rules-passed', 'profession-influences-tool', 'deterministic-seed'],
  };
  return seed;
}
