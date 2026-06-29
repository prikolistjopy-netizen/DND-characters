import pilotFactsDocument from '../../data/vnext/facts.json';
import semanticFactsDocument from '../../data/vnext/semantic-facts.json';
import rulesDocument from '../../data/vnext/rules.json';
import type {
  ConstraintRule,
  FactRef,
  GenerationTraceEntry,
  InfluenceRule,
  LibraryFact,
  SemanticScores,
  SemanticSeedVNext,
} from './contracts';
import type { SemanticLocks } from './resolverControlled';

type PilotClassId = 'class.warlock' | 'class.fighter' | 'class.cleric';
type PilotSpeciesId = 'species.human' | 'species.dwarf' | 'species.tiefling';

type IncrementalResolverOptions = {
  rngSeed: string | number;
  classId?: PilotClassId;
  speciesId?: PilotSpeciesId;
  professionId?: string;
  novelty?: 'low' | 'balanced' | 'high';
  beamWidth?: number;
  branchFactor?: number;
  locks?: SemanticLocks;
  repetitionHistory?: string[];
};

type FactDocument = { facts: LibraryFact[] };
type RulesDocument = { influences: InfluenceRule[]; constraints: ConstraintRule[] };
type Candidate = {
  selected: Record<string, LibraryFact>;
  trace: GenerationTraceEntry[];
  score: number;
  appliedRules: string[];
  conflictPenalty: number;
};

type FieldName =
  | 'ageBand'
  | 'desire'
  | 'fear'
  | 'belief'
  | 'contradiction'
  | 'copingStrategy'
  | 'status'
  | 'obligation'
  | 'powerSource'
  | 'powerRelationship'
  | 'powerControl'
  | 'powerVisibility'
  | 'powerCost'
  | 'economicCondition'
  | 'toolFamiliarity'
  | 'goal'
  | 'obstacle'
  | 'action'
  | 'pressure';

const pilotFacts = (pilotFactsDocument as FactDocument).facts;
const semanticFacts = (semanticFactsDocument as FactDocument).facts;
const allFacts = [...pilotFacts, ...semanticFacts];
const rules = rulesDocument as RulesDocument;

const classFacts = pilotFacts.filter((fact) => fact.domain === 'class');
const speciesFacts = pilotFacts.filter((fact) => fact.domain === 'species');
const professionFacts = pilotFacts.filter((fact) => fact.domain === 'profession');

const fieldPrefixes: Record<FieldName, string> = {
  ageBand: 'age.',
  desire: 'desire.',
  fear: 'fear.',
  belief: 'belief.',
  contradiction: 'contradiction.',
  copingStrategy: 'coping.',
  status: 'status.',
  obligation: 'obligation.',
  powerSource: 'power-source.',
  powerRelationship: 'power-relationship.',
  powerControl: 'power-control.',
  powerVisibility: 'power-visibility.',
  powerCost: 'power-cost.',
  economicCondition: 'economic.',
  toolFamiliarity: 'tool-familiarity.',
  goal: 'goal.',
  obstacle: 'obstacle.',
  action: 'action.',
  pressure: 'pressure.',
};

const generationOrder: FieldName[] = [
  'ageBand',
  'desire',
  'fear',
  'belief',
  'contradiction',
  'copingStrategy',
  'status',
  'obligation',
  'powerSource',
  'powerRelationship',
  'powerControl',
  'powerVisibility',
  'powerCost',
  'economicCondition',
  'toolFamiliarity',
  'goal',
  'obstacle',
  'action',
  'pressure',
];

const lockByField: Partial<Record<FieldName, keyof SemanticLocks>> = {
  desire: 'desireId',
  fear: 'fearId',
  belief: 'beliefId',
  contradiction: 'contradictionId',
  powerRelationship: 'powerRelationshipId',
  powerVisibility: 'powerVisibilityId',
  goal: 'goalId',
  obstacle: 'obstacleId',
  action: 'actionId',
  pressure: 'pressureId',
};

function hashSeed(value: string | number): number {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function toRef(fact: LibraryFact): FactRef {
  return { id: fact.id, domain: fact.domain, label: fact.label };
}

function chooseLockedOrRandom(pool: LibraryFact[], id: string | undefined, random: () => number): LibraryFact {
  if (id) {
    const fact = pool.find((item) => item.id === id);
    if (!fact) throw new Error(`Unknown locked fact: ${id}`);
    return fact;
  }
  return pool[Math.floor(random() * pool.length)];
}

function signalsFor(selected: Record<string, LibraryFact>, candidate?: LibraryFact): Set<string> {
  const facts = candidate ? [...Object.values(selected), candidate] : Object.values(selected);
  const signals = new Set<string>();
  for (const fact of facts) {
    signals.add(fact.id);
    signals.add(`domain.${fact.domain}`);
    for (const tag of fact.tags) signals.add(tag);
  }
  if (selected.goal && selected.obstacle && selected.action && selected.pressure) signals.add('current-moment.complete');
  return signals;
}

function allMatch(values: string[], signals: Set<string>): boolean {
  return values.every((value) => signals.has(value));
}

function evaluateRuleDelta(selected: Record<string, LibraryFact>, candidate: LibraryFact): {
  delta: number;
  hardConflict: boolean;
  applied: string[];
  reasons: string[];
} {
  const signals = signalsFor(selected, candidate);
  let delta = 0;
  let hardConflict = false;
  const applied: string[] = [];
  const reasons: string[] = [];

  for (const rule of rules.influences) {
    if (!allMatch(rule.when, signals)) continue;
    if (!rule.targets.some((target) => signals.has(target))) continue;
    delta += rule.weight;
    applied.push(rule.id);
    reasons.push(`${rule.id}:${rule.weight >= 0 ? '+' : ''}${rule.weight}`);
  }

  for (const rule of rules.constraints) {
    if (!allMatch(rule.when, signals)) continue;
    if (!rule.targets.some((target) => signals.has(target))) continue;
    applied.push(rule.id);
    reasons.push(`${rule.id}:hard`);
    if (rule.kind === 'excludes' || rule.kind === 'conflicts') hardConflict = true;
  }

  return { delta, hardConflict, applied, reasons };
}

function semanticConsistency(selected: Record<string, LibraryFact>, candidate: LibraryFact): {
  delta: number;
  hardConflict: boolean;
  reasons: string[];
} {
  const classId = selected.class.id;
  const powerSourceId = candidate.id.startsWith('power-source.') ? candidate.id : selected.powerSource?.id;
  const visibilityId = candidate.id.startsWith('power-visibility.') ? candidate.id : selected.powerVisibility?.id;
  const relationshipId = candidate.id.startsWith('power-relationship.') ? candidate.id : selected.powerRelationship?.id;
  let delta = 0;
  let hardConflict = false;
  const reasons: string[] = [];

  if (classId === 'class.warlock') {
    if (candidate.id === 'power-source.external-intelligence') { delta += 2.4; reasons.push('warlock-external-source'); }
    if (['power-relationship.transactional', 'power-relationship.coerced', 'power-relationship.inherited'].includes(candidate.id)) { delta += 1.4; reasons.push('warlock-meaningful-relationship'); }
    if (candidate.id === 'power-source.none') { hardConflict = true; reasons.push('warlock-requires-power-source'); }
    if (candidate.id === 'power-visibility.full-apparition') { delta -= 3.2; reasons.push('warlock-apparition-stereotype-penalty'); }
  }

  if (classId === 'class.fighter') {
    if (candidate.id === 'power-source.none' || candidate.id === 'power-source.internal-discipline') { delta += 2; reasons.push('fighter-grounded-power'); }
    if (candidate.id === 'power-relationship.self-reliant') { delta += 1.5; reasons.push('fighter-self-reliance'); }
    if (candidate.id === 'power-visibility.full-apparition') { hardConflict = true; reasons.push('fighter-apparition-conflict'); }
  }

  if (classId === 'class.cleric') {
    if (candidate.id === 'power-source.institutional-faith') { delta += 2.4; reasons.push('cleric-institutional-faith'); }
    if (candidate.id === 'power-relationship.service') { delta += 1.7; reasons.push('cleric-service-relationship'); }
    if (candidate.id === 'power-source.none') { hardConflict = true; reasons.push('cleric-requires-power-source'); }
    if (candidate.id === 'power-visibility.full-apparition') { delta -= 2.2; reasons.push('cleric-apparition-penalty'); }
  }

  if (powerSourceId === 'power-source.none') {
    if (candidate.id.startsWith('power-cost.')) { hardConflict = true; reasons.push('no-power-no-cost'); }
    if (['power-visibility.object-based', 'power-visibility.reflected', 'power-visibility.full-apparition'].includes(candidate.id)) {
      hardConflict = true;
      reasons.push('no-power-visibility-conflict');
    }
    if (relationshipId && relationshipId !== 'power-relationship.self-reliant') {
      hardConflict = true;
      reasons.push('no-power-relationship-conflict');
    }
  }

  if (visibilityId === 'power-visibility.full-apparition') {
    delta -= (candidate.stereotypeRisk ?? 0) * 3;
  }

  return { delta, hardConflict, reasons };
}

function tagCoherence(selected: Record<string, LibraryFact>, candidate: LibraryFact): number {
  const tags = new Set(Object.values(selected).flatMap((fact) => fact.tags));
  return candidate.tags.filter((tag) => tags.has(tag)).length * 0.24;
}

function noveltyWeight(fact: LibraryFact, novelty: IncrementalResolverOptions['novelty']): number {
  const rarity = fact.rarity ?? 0.2;
  if (novelty === 'high') return rarity * 1.25;
  if (novelty === 'low') return -rarity * 0.55;
  return rarity * 0.25;
}

function professionInfluence(selected: Record<string, LibraryFact>, candidate: LibraryFact): number {
  const profession = selected.profession;
  if (!profession) return 0;
  const shared = candidate.tags.filter((tag) => profession.tags.includes(tag)).length;
  const affordanceText = [...(profession.narrativeAffordances ?? []), ...(profession.visualAffordances ?? [])].join(' ').toLowerCase();
  let affordanceBoost = 0;
  for (const tag of candidate.tags) {
    if (affordanceText.includes(tag.replace(/-/g, ' '))) affordanceBoost += 0.25;
  }
  return shared * 0.45 + affordanceBoost;
}

function lockedValueFor(field: FieldName, locks: SemanticLocks | undefined): string | undefined {
  const lockName = lockByField[field];
  return lockName && locks ? locks[lockName] : undefined;
}

function choicesForField(field: FieldName, locks: SemanticLocks | undefined): LibraryFact[] {
  const pool = semanticFacts.filter((fact) => fact.id.startsWith(fieldPrefixes[field]));
  const lockedId = lockedValueFor(field, locks);
  if (!lockedId) return pool;
  const locked = pool.find((fact) => fact.id === lockedId);
  if (!locked) throw new Error(`Unknown lock for ${field}: ${lockedId}`);
  return [locked];
}

function weightedOrder(items: Array<{ fact: LibraryFact; weight: number }>, random: () => number): LibraryFact[] {
  return items
    .map(({ fact, weight }) => ({
      fact,
      key: -Math.log(Math.max(random(), Number.EPSILON)) / Math.max(0.0001, weight),
    }))
    .sort((left, right) => left.key - right.key)
    .map(({ fact }) => fact);
}

function signature(candidate: Candidate): string {
  return [
    candidate.selected.profession?.id,
    candidate.selected.contradiction?.id,
    candidate.selected.powerRelationship?.id,
    candidate.selected.powerVisibility?.id,
    candidate.selected.goal?.id,
    candidate.selected.action?.id,
  ].filter(Boolean).join('|');
}

function repetitionPenalty(candidate: Candidate, history: string[]): number {
  const current = signature(candidate);
  const exact = history.filter((item) => item === current).length;
  const parts = new Set(current.split('|'));
  const near = history.filter((item) => item.split('|').filter((part) => parts.has(part)).length >= 5).length;
  return exact * 3 + near * 0.3;
}

function keepDiverse(candidates: Candidate[], limit: number): Candidate[] {
  const sorted = [...candidates].sort((left, right) => right.score - left.score);
  const kept: Candidate[] = [];
  const seen = new Set<string>();
  for (const candidate of sorted) {
    const key = signature(candidate);
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(candidate);
    if (kept.length >= limit) break;
  }
  return kept.length ? kept : sorted.slice(0, limit);
}

function buildScores(candidate: Candidate, repetition: number): SemanticScores {
  const facts = Object.values(candidate.selected);
  const tags = facts.flatMap((fact) => fact.tags);
  const counts = new Map<string, number>();
  for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  const coherence = [...counts.values()].filter((count) => count > 1).length * 0.42;
  const profession = candidate.selected.profession;
  const professionIntegration = facts.filter((fact) => fact !== profession && fact.tags.some((tag) => profession.tags.includes(tag))).length * 0.55;
  const contradiction = candidate.selected.contradiction;
  const contradictionQuality = contradiction
    ? facts.filter((fact) => fact !== contradiction && fact.tags.some((tag) => contradiction.tags.includes(tag))).length * 0.55
    : 0;
  const stereotypePenalty = facts.reduce((sum, fact) => sum + (fact.stereotypeRisk ?? 0), 0);
  const narrativePotential = [candidate.selected.goal, candidate.selected.obstacle, candidate.selected.action, candidate.selected.pressure].filter(Boolean).length * 0.65;
  const total = candidate.score - repetition;
  return {
    coherence,
    classReadability: 2,
    speciesReadability: 1.5,
    professionIntegration,
    contradictionQuality,
    narrativePotential,
    novelty: facts.reduce((sum, fact) => sum + (fact.rarity ?? 0.2), 0) / Math.max(1, facts.length),
    stereotypePenalty,
    repetitionPenalty: repetition,
    conflictPenalty: candidate.conflictPenalty,
    userPreferenceMatch: 0,
    total,
  };
}

export function generateIncrementalSemanticSeedVNext(options: IncrementalResolverOptions): SemanticSeedVNext {
  const normalized = {
    novelty: 'balanced' as const,
    beamWidth: 18,
    branchFactor: 5,
    repetitionHistory: [] as string[],
    ...options,
  };
  const random = mulberry32(hashSeed(normalized.rngSeed));
  const selectedClass = chooseLockedOrRandom(classFacts, normalized.classId, random);
  const selectedSpecies = chooseLockedOrRandom(speciesFacts, normalized.speciesId, random);
  const selectedProfession = chooseLockedOrRandom(professionFacts, normalized.professionId, random);

  let beam: Candidate[] = [{
    selected: { class: selectedClass, species: selectedSpecies, profession: selectedProfession },
    trace: [{
      stage: 'identity',
      decision: `${selectedSpecies.label} ${selectedClass.label}, ${selectedProfession.label}`,
      selectedFactIds: [selectedSpecies.id, selectedClass.id, selectedProfession.id],
      reasons: ['seeded identity selection', 'incremental resolver'],
    }],
    score: selectedClass.baseWeight + selectedSpecies.baseWeight + selectedProfession.baseWeight,
    appliedRules: [],
    conflictPenalty: 0,
  }];

  for (const field of generationOrder) {
    const expanded: Candidate[] = [];
    for (const candidate of beam) {
      const scored = choicesForField(field, normalized.locks).map((fact) => {
        const rule = evaluateRuleDelta(candidate.selected, fact);
        const consistency = semanticConsistency(candidate.selected, fact);
        const hardConflict = rule.hardConflict || consistency.hardConflict;
        const weight = Math.max(
          0.0001,
          fact.baseWeight +
          noveltyWeight(fact, normalized.novelty) +
          tagCoherence(candidate.selected, fact) +
          professionInfluence(candidate.selected, fact) +
          rule.delta +
          consistency.delta -
          (fact.stereotypeRisk ?? 0) * 1.6,
        );
        return { fact, weight, rule, consistency, hardConflict };
      }).filter((item) => !item.hardConflict);

      const ordered = weightedOrder(scored.map(({ fact, weight }) => ({ fact, weight })), random)
        .slice(0, normalized.branchFactor);

      for (const fact of ordered) {
        const detail = scored.find((item) => item.fact.id === fact.id)!;
        const nextSelected = { ...candidate.selected, [field]: fact };
        expanded.push({
          selected: nextSelected,
          score: candidate.score + detail.weight,
          appliedRules: [...candidate.appliedRules, ...detail.rule.applied],
          conflictPenalty: candidate.conflictPenalty,
          trace: [...candidate.trace, {
            stage: field,
            decision: fact.label,
            selectedFactIds: [fact.id],
            rejectedFactIds: scored.filter((item) => item.fact.id !== fact.id).slice(0, 4).map((item) => item.fact.id),
            scoreDelta: detail.weight,
            reasons: [
              `baseWeight=${fact.baseWeight}`,
              `ruleDelta=${detail.rule.delta.toFixed(2)}`,
              `professionInfluence=${professionInfluence(candidate.selected, fact).toFixed(2)}`,
              `tagCoherence=${tagCoherence(candidate.selected, fact).toFixed(2)}`,
              ...detail.rule.reasons,
              ...detail.consistency.reasons,
              ...(lockedValueFor(field, normalized.locks) ? ['locked-by-user'] : []),
            ],
          }],
        });
      }
    }
    if (!expanded.length) throw new Error(`No valid candidates remain at field ${field}`);
    beam = keepDiverse(expanded, normalized.beamWidth);
  }

  const ranked = beam.map((candidate) => {
    const repetition = repetitionPenalty(candidate, normalized.repetitionHistory);
    return { candidate, repetition, finalScore: candidate.score - repetition };
  }).sort((left, right) => right.finalScore - left.finalScore);

  const winner = ranked[0];
  const selected = winner.candidate.selected;
  const scores = buildScores(winner.candidate, winner.repetition);
  const id = `semantic-inc-${hashSeed(`${normalized.rngSeed}:${signature(winner.candidate)}`).toString(36)}`;

  return {
    id,
    rngSeed: String(normalized.rngSeed),
    identity: {
      species: toRef(selected.species),
      class: toRef(selected.class),
      profession: toRef(selected.profession),
      ageBand: toRef(selected.ageBand),
    },
    psychology: {
      desire: toRef(selected.desire),
      fear: toRef(selected.fear),
      belief: toRef(selected.belief),
      contradiction: toRef(selected.contradiction),
      copingStrategy: toRef(selected.copingStrategy),
    },
    social: {
      status: toRef(selected.status),
      obligation: toRef(selected.obligation),
    },
    power: {
      source: toRef(selected.powerSource),
      relationship: toRef(selected.powerRelationship),
      control: toRef(selected.powerControl),
      visibility: toRef(selected.powerVisibility),
      cost: selected.powerCost ? toRef(selected.powerCost) : undefined,
    },
    materialLife: {
      economicCondition: toRef(selected.economicCondition),
      toolFamiliarity: toRef(selected.toolFamiliarity),
    },
    currentMoment: {
      goal: toRef(selected.goal),
      obstacle: toRef(selected.obstacle),
      action: toRef(selected.action),
      pressure: toRef(selected.pressure),
    },
    trace: {
      version: 2,
      entries: [...winner.candidate.trace, {
        stage: 'final-selection',
        decision: `Selected incremental candidate from beam of ${beam.length}`,
        selectedFactIds: [...new Set(winner.candidate.appliedRules)],
        rejectedFactIds: ranked.slice(1, 5).map((item) => signature(item.candidate)),
        scoreDelta: -winner.repetition,
        reasons: [
          `rawScore=${winner.candidate.score.toFixed(2)}`,
          `repetitionPenalty=${winner.repetition.toFixed(2)}`,
          `finalScore=${winner.finalScore.toFixed(2)}`,
        ],
      }],
    },
    scores,
    qaFlags: [
      ...(selected.powerVisibility.id === 'power-visibility.full-apparition' ? ['rare-full-apparition-review'] : []),
      ...(winner.candidate.appliedRules.length === 0 ? ['no-data-driven-rules-applied'] : []),
    ],
  };
}

export type { IncrementalResolverOptions };
