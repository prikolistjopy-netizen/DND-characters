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
const goals = ['prevent immediate harm', 'prove a hidden truth', 'finish a dangerous duty', 'protect someone dependent'];
const obstacles = ['locked threshold', 'frightened witness', 'unstable weather', 'hostile suspicion', 'failing structure'];
const risks = ['public panic', 'harmful power exposure', 'lost evidence', 'community blame', 'physical injury'];
const pressures = ['time is narrowing', 'someone is watching', 'the room is losing trust', 'weather is worsening'];

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
      contradiction: pick(vnextFacts.psychology.contradictions, rng, 'psychology.contradiction', scoreTrace),
      copingStrategy: pick(vnextFacts.psychology.coping, rng, 'psychology.coping', scoreTrace),
      emotionalRestraint: pick(vnextFacts.psychology.restraint, rng, 'psychology.restraint', scoreTrace),
      relationshipToPower: classId === 'warlock' ? 'bargains with power while limiting what it can claim' : classId === 'cleric' ? 'serves power as responsibility rather than spectacle' : 'trusts training before supernatural answers',
    },
    life: {
      profession: profession.label,
      dailyHabit,
      learnedSkill: classFact.evidence[0],
      bodyHabit: dailyHabit,
      socialResponsibility: responsibility,
      livedInTrace: profession.wear[0],
      materialHistory: culture.materials[0],
      personalObject: tool,
    },
    currentMoment: {
      currentAction: scene,
      goal: pick(goals, rng, 'moment.goal', scoreTrace),
      obstacle: pick(obstacles, rng, 'moment.obstacle', scoreTrace),
      risk: pick(risks, rng, 'moment.risk', scoreTrace),
      pressure: pick(pressures, rng, 'moment.pressure', scoreTrace),
      targetOfAttention: responsibility,
      urgency: 'immediate but controlled',
      consequenceOfFailure: `the ${responsibility} fails and the community pays the cost`,
    },
    power: {
      source: source.label,
      sourceId: source.id,
      relationshipToSource: classId === 'warlock' ? 'private bargain with strict boundaries' : classId === 'cleric' ? 'witnessed obligation' : 'mundane discipline',
      visibility,
      intensity: visibility === 'none' ? 'none' : visibility === 'full_apparition' ? 'high' : 'low',
      control: visibility === 'full_apparition' ? 'unstable and rare' : 'contained by action',
      cost: classId === 'warlock' ? 'attention pulled toward the bargain' : classId === 'cleric' ? 'personal exhaustion after mercy' : 'physical fatigue',
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
      secondaryAnchor: `${profession.label} handling of ${tool}`,
      focalHierarchy: ['face and action', tool, 'profession wear', 'power only if visible', 'environment secondary'],
      detailBudget: 'controlled',
      mood: `${input.noveltyMode === 'strong' ? 'unusual but grounded' : 'restrained cinematic'} pressure`,
      compositionIntent: 'full-body character concept caught in a specific working moment',
    },
    scoreTrace,
    appliedRules: ruleResult.applied,
    rejectedCandidates: scoreTrace.filter((entry) => entry.rejected),
    qaFlags: ruleResult.blockingErrors.length ? ruleResult.blockingErrors : ['hard-rules-passed', 'profession-influences-tool', 'deterministic-seed'],
  };
  return seed;
}
