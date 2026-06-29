import pilotFactsDocument from '../../data/vnext/facts.json';
import semanticFactsDocument from '../../data/vnext/semantic-facts.json';
import type {
  FactRef,
  GenerationTraceEntry,
  LibraryFact,
  SemanticScores,
  SemanticSeedVNext,
} from './contracts';

type PilotClassId = 'class.warlock' | 'class.fighter' | 'class.cleric';
type PilotSpeciesId = 'species.human' | 'species.dwarf' | 'species.tiefling';

type ResolverOptions = {
  rngSeed: string | number;
  classId?: PilotClassId;
  speciesId?: PilotSpeciesId;
  professionId?: string;
  novelty?: 'low' | 'balanced' | 'high';
  beamWidth?: number;
  candidateCount?: number;
};

type Candidate = {
  selected: Record<string, LibraryFact>;
  trace: GenerationTraceEntry[];
  scores: SemanticScores;
};

type FactDocument = { facts: LibraryFact[] };

const pilotFacts = (pilotFactsDocument as FactDocument).facts;
const semanticFacts = (semanticFactsDocument as FactDocument).facts;
const allFacts = [...pilotFacts, ...semanticFacts];
const byId = new Map(allFacts.map((fact) => [fact.id, fact]));

const classFacts = pilotFacts.filter((fact) => fact.domain === 'class');
const speciesFacts = pilotFacts.filter((fact) => fact.domain === 'species');
const professionFacts = pilotFacts.filter((fact) => fact.domain === 'profession');

const fieldPrefixes: Record<string, string> = {
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

const generationOrder = [
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
] as const;

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

function getFactsByPrefix(prefix: string): LibraryFact[] {
  return semanticFacts.filter((fact) => fact.id.startsWith(prefix));
}

function tagsOf(candidate: Candidate): Set<string> {
  return new Set(Object.values(candidate.selected).flatMap((fact) => fact.tags));
}

function countSharedTags(fact: LibraryFact, existingTags: Set<string>): number {
  return fact.tags.reduce((count, tag) => count + (existingTags.has(tag) ? 1 : 0), 0);
}

function classCompatibility(candidate: Candidate, fact: LibraryFact): number {
  const classId = candidate.selected.class.id;
  if (classId === 'class.warlock') {
    if (fact.id === 'power-source.external-intelligence') return 2.4;
    if (fact.id === 'power-relationship.transactional' || fact.id === 'power-relationship.coerced' || fact.id === 'power-relationship.inherited') return 1.5;
    if (fact.id === 'power-visibility.object-based' || fact.id === 'power-visibility.behavioral' || fact.id === 'power-visibility.reflected' || fact.id === 'power-visibility.latent') return 1.2;
    if (fact.id === 'power-visibility.full-apparition') return -2.8;
    if (fact.id === 'power-source.none') return -5;
    if (fact.id === 'contradiction.borrowed-power-independent-mind') return 1.4;
    if (fact.id === 'fear.become-instrument') return 1.2;
  }
  if (classId === 'class.fighter') {
    if (fact.id === 'power-source.none' || fact.id === 'power-source.internal-discipline') return 2;
    if (fact.id === 'power-relationship.self-reliant') return 1.8;
    if (fact.id === 'power-visibility.none' || fact.id === 'power-visibility.latent') return 1.4;
    if (fact.id === 'action.interpose') return 1.4;
    if (fact.id === 'contradiction.protector-fears-contact') return 1.1;
    if (fact.id === 'power-source.external-intelligence') return -2;
    if (fact.id === 'power-visibility.full-apparition') return -2.5;
  }
  if (classId === 'class.cleric') {
    if (fact.id === 'power-source.institutional-faith') return 2.4;
    if (fact.id === 'power-relationship.service') return 1.8;
    if (fact.id === 'obligation.professional-oath' || fact.id === 'obligation.community-role') return 1.2;
    if (fact.id === 'goal.keep-oath') return 1.4;
    if (fact.id === 'power-visibility.latent' || fact.id === 'power-visibility.object-based' || fact.id === 'power-visibility.behavioral') return 0.8;
    if (fact.id === 'power-visibility.full-apparition') return -1.8;
    if (fact.id === 'power-source.none') return -3;
  }
  return 0;
}

function professionCompatibility(candidate: Candidate, fact: LibraryFact): number {
  const professionId = candidate.selected.profession.id;
  const boosts: Record<string, Record<string, number>> = {
    'profession.physician': {
      'goal.diagnose-anomaly': 2.2,
      'action.examine': 2,
      'pressure.controlled-alarm': 1,
      'contradiction.healer-harmful-power': 1.8,
      'obligation.professional-oath': 1.2,
    },
    'profession.archivist': {
      'goal.verify-evidence': 1.8,
      'action.compare': 1.8,
      'obstacle.trusted-person-implicated': 0.8,
      'contradiction.truth-seeker-keeps-secret': 1.4,
    },
    'profession.ferryman': {
      'goal.protect-crossing': 2.2,
      'action.interpose': 1,
      'pressure.controlled-alarm': 0.8,
    },
    'profession.locksmith': {
      'obstacle.tool-behaves-wrongly': 1.8,
      'action.examine': 1.4,
      'goal.verify-evidence': 0.8,
    },
    'profession.court-translator': {
      'obstacle.authority-demands-speed': 1.4,
      'pressure.public-scrutiny': 1.2,
      'action.refuse-order': 1,
      'contradiction.truth-seeker-keeps-secret': 1.2,
    },
    'profession.undertaker': {
      'pressure.controlled-alarm': 1,
      'belief.mercy-needs-boundaries': 1,
      'obligation.professional-oath': 1,
    },
    'profession.guard-captain': {
      'action.interpose': 1.8,
      'obstacle.authority-demands-speed': 1,
      'contradiction.public-authority-private-doubt': 1.5,
    },
    'profession.investigator': {
      'goal.verify-evidence': 2,
      'action.compare': 2,
      'obstacle.trusted-person-implicated': 1.2,
      'belief.proof-before-trust': 1.4,
    },
    'profession.mason': {
      'obstacle.tool-behaves-wrongly': 1,
      'action.examine': 1,
      'belief.proof-before-trust': 0.8,
    },
    'profession.stage-performer': {
      'pressure.public-scrutiny': 1.6,
      'status.respected-distrusted': 0.8,
      'contradiction.public-authority-private-doubt': 0.8,
    },
  };
  return boosts[professionId]?.[fact.id] ?? 0;
}

function hardConflict(candidate: Candidate, fact: LibraryFact): boolean {
  const classId = candidate.selected.class.id;
  if (classId === 'class.fighter' && fact.id === 'power-relationship.coerced' && candidate.selected.powerSource?.id === 'power-source.none') return true;
  if (classId !== 'class.warlock' && fact.id === 'contradiction.borrowed-power-independent-mind' && candidate.selected.powerSource?.id === 'power-source.none') return true;
  if (candidate.selected.powerSource?.id === 'power-source.none') {
    if (fact.id.startsWith('power-cost.')) return true;
    if (fact.id === 'power-visibility.full-apparition' || fact.id === 'power-visibility.reflected' || fact.id === 'power-visibility.object-based') return true;
  }
  if (candidate.selected.powerVisibility?.id === 'power-visibility.none' && fact.id.startsWith('power-cost.') && classId === 'class.fighter') return true;
  return false;
}

function optionWeight(candidate: Candidate, fact: LibraryFact, novelty: ResolverOptions['novelty']): number {
  const existingTags = tagsOf(candidate);
  const shared = countSharedTags(fact, existingTags);
  const coherenceBoost = shared * 0.22;
  const rarity = fact.rarity ?? 0.25;
  const noveltyMultiplier = novelty === 'high' ? 1 + rarity * 0.9 : novelty === 'low' ? 1 - rarity * 0.5 : 1 + rarity * 0.15;
  const stereotypePenalty = (fact.stereotypeRisk ?? 0) * 1.8;
  const compatibility = classCompatibility(candidate, fact) + professionCompatibility(candidate, fact);
  return Math.max(0.0001, fact.baseWeight * noveltyMultiplier + coherenceBoost + compatibility - stereotypePenalty);
}

function emptyScores(): SemanticScores {
  return {
    coherence: 0,
    classReadability: 0,
    speciesReadability: 0,
    professionIntegration: 0,
    contradictionQuality: 0,
    narrativePotential: 0,
    novelty: 0,
    stereotypePenalty: 0,
    repetitionPenalty: 0,
    conflictPenalty: 0,
    userPreferenceMatch: 0,
    total: 0,
  };
}

function scoreCandidate(candidate: Candidate, novelty: ResolverOptions['novelty']): SemanticScores {
  const facts = Object.values(candidate.selected);
  const tags = facts.flatMap((fact) => fact.tags);
  const tagCounts = new Map<string, number>();
  for (const tag of tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  const linkedTags = [...tagCounts.values()].filter((count) => count > 1).length;
  const profession = candidate.selected.profession;
  const professionLinks = facts.filter((fact) => fact !== profession && fact.tags.some((tag) => profession.tags.includes(tag))).length;
  const contradiction = candidate.selected.contradiction;
  const contradictionLinks = contradiction ? facts.filter((fact) => fact !== contradiction && fact.tags.some((tag) => contradiction.tags.includes(tag))).length : 0;
  const stereotypePenalty = facts.reduce((sum, fact) => sum + (fact.stereotypeRisk ?? 0), 0);
  const rarityAverage = facts.reduce((sum, fact) => sum + (fact.rarity ?? 0.2), 0) / Math.max(1, facts.length);
  const powerVisibility = candidate.selected.powerVisibility?.id;
  const classId = candidate.selected.class.id;
  const classReadability = classId === 'class.warlock'
    ? (candidate.selected.powerSource?.id === 'power-source.external-intelligence' ? 2.5 : 0.5)
    : classId === 'class.cleric'
      ? (candidate.selected.powerSource?.id === 'power-source.institutional-faith' ? 2.5 : 0.5)
      : (candidate.selected.powerSource?.id === 'power-source.none' || candidate.selected.powerSource?.id === 'power-source.internal-discipline' ? 2.3 : 0.5);
  const apparitionPenalty = powerVisibility === 'power-visibility.full-apparition' ? 1.6 : 0;
  const coherence = linkedTags * 0.45;
  const professionIntegration = Math.min(3, professionLinks * 0.65);
  const contradictionQuality = Math.min(2.5, contradictionLinks * 0.7);
  const narrativePotential = Math.min(3, [candidate.selected.goal, candidate.selected.obstacle, candidate.selected.action, candidate.selected.pressure].filter(Boolean).length * 0.65);
  const noveltyScore = rarityAverage * (novelty === 'high' ? 3 : novelty === 'low' ? 1 : 2);
  const total = coherence + classReadability + 1.5 + professionIntegration + contradictionQuality + narrativePotential + noveltyScore - stereotypePenalty - apparitionPenalty;
  return {
    coherence,
    classReadability,
    speciesReadability: 1.5,
    professionIntegration,
    contradictionQuality,
    narrativePotential,
    novelty: noveltyScore,
    stereotypePenalty: stereotypePenalty + apparitionPenalty,
    repetitionPenalty: 0,
    conflictPenalty: 0,
    userPreferenceMatch: 0,
    total,
  };
}

function weightedShuffle<T>(items: T[], weights: number[], random: () => number): T[] {
  return items
    .map((item, index) => ({ item, key: -Math.log(Math.max(random(), Number.EPSILON)) / Math.max(weights[index], 0.0001) }))
    .sort((left, right) => left.key - right.key)
    .map(({ item }) => item);
}

function expandField(candidate: Candidate, field: string, options: ResolverOptions, random: () => number): Candidate[] {
  const prefix = fieldPrefixes[field];
  const choices = getFactsByPrefix(prefix).filter((fact) => !hardConflict(candidate, fact));
  const weights = choices.map((fact) => optionWeight(candidate, fact, options.novelty));
  const ordered = weightedShuffle(choices, weights, random).slice(0, Math.min(5, choices.length));
  return ordered.map((fact) => {
    const next: Candidate = {
      selected: { ...candidate.selected, [field]: fact },
      trace: [...candidate.trace, {
        stage: field,
        decision: fact.label,
        selectedFactIds: [fact.id],
        rejectedFactIds: choices.filter((choice) => choice.id !== fact.id).slice(0, 4).map((choice) => choice.id),
        reasons: [
          `baseWeight=${fact.baseWeight}`,
          `classCompatibility=${classCompatibility(candidate, fact).toFixed(2)}`,
          `professionCompatibility=${professionCompatibility(candidate, fact).toFixed(2)}`,
          `sharedTags=${countSharedTags(fact, tagsOf(candidate))}`,
        ],
      }],
      scores: emptyScores(),
    };
    next.scores = scoreCandidate(next, options.novelty);
    return next;
  });
}

function diversitySignature(candidate: Candidate): string {
  return [
    candidate.selected.profession?.id,
    candidate.selected.contradiction?.id,
    candidate.selected.powerRelationship?.id,
    candidate.selected.powerVisibility?.id,
    candidate.selected.goal?.id,
    candidate.selected.action?.id,
  ].filter(Boolean).join('|');
}

function keepDiverseTopK(candidates: Candidate[], beamWidth: number): Candidate[] {
  const sorted = [...candidates].sort((left, right) => right.scores.total - left.scores.total);
  const selected: Candidate[] = [];
  const signatures = new Set<string>();
  for (const candidate of sorted) {
    const signature = diversitySignature(candidate);
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    selected.push(candidate);
    if (selected.length >= beamWidth) break;
  }
  return selected.length > 0 ? selected : sorted.slice(0, beamWidth);
}

function chooseBaseFact<T extends LibraryFact>(pool: T[], lockedId: string | undefined, random: () => number): T {
  if (lockedId) {
    const locked = pool.find((fact) => fact.id === lockedId);
    if (!locked) throw new Error(`Unknown locked fact: ${lockedId}`);
    return locked;
  }
  return pool[Math.floor(random() * pool.length)];
}

function seededChoiceFromFinalists(finalists: Candidate[], random: () => number): Candidate {
  const minScore = Math.min(...finalists.map((candidate) => candidate.scores.total));
  const weights = finalists.map((candidate) => Math.max(0.1, candidate.scores.total - minScore + 1));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = random() * total;
  for (let index = 0; index < finalists.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return finalists[index];
  }
  return finalists[finalists.length - 1];
}

export function generateSemanticSeedVNext(options: ResolverOptions): SemanticSeedVNext {
  const normalized: ResolverOptions = {
    novelty: 'balanced',
    beamWidth: 16,
    candidateCount: 48,
    ...options,
  };
  const random = mulberry32(hashSeed(normalized.rngSeed));
  const selectedClass = chooseBaseFact(classFacts, normalized.classId, random);
  const selectedSpecies = chooseBaseFact(speciesFacts, normalized.speciesId, random);
  const selectedProfession = chooseBaseFact(professionFacts, normalized.professionId, random);

  let beam: Candidate[] = [{
    selected: { class: selectedClass, species: selectedSpecies, profession: selectedProfession },
    trace: [{
      stage: 'identity',
      decision: `${selectedSpecies.label} ${selectedClass.label}, ${selectedProfession.label}`,
      selectedFactIds: [selectedSpecies.id, selectedClass.id, selectedProfession.id],
      reasons: ['seeded identity selection', normalized.classId ? 'class locked by caller' : 'class selected from pilot pool', normalized.speciesId ? 'species locked by caller' : 'species selected from pilot pool', normalized.professionId ? 'profession locked by caller' : 'profession selected from pilot pool'],
    }],
    scores: emptyScores(),
  }];

  for (const field of generationOrder) {
    const expanded = beam.flatMap((candidate) => expandField(candidate, field, normalized, random));
    beam = keepDiverseTopK(expanded, normalized.beamWidth ?? 16);
  }

  const finalists = keepDiverseTopK(beam, Math.min(normalized.candidateCount ?? 48, beam.length));
  const winner = seededChoiceFromFinalists(finalists, random);
  const id = `semantic-${hashSeed(`${normalized.rngSeed}:${diversitySignature(winner)}`).toString(36)}`;

  return {
    id,
    rngSeed: String(normalized.rngSeed),
    identity: {
      species: toRef(winner.selected.species),
      class: toRef(winner.selected.class),
      profession: toRef(winner.selected.profession),
      ageBand: toRef(winner.selected.ageBand),
    },
    psychology: {
      desire: toRef(winner.selected.desire),
      fear: toRef(winner.selected.fear),
      belief: toRef(winner.selected.belief),
      contradiction: toRef(winner.selected.contradiction),
      copingStrategy: toRef(winner.selected.copingStrategy),
    },
    social: {
      status: toRef(winner.selected.status),
      obligation: toRef(winner.selected.obligation),
    },
    power: {
      source: toRef(winner.selected.powerSource),
      relationship: toRef(winner.selected.powerRelationship),
      control: toRef(winner.selected.powerControl),
      visibility: toRef(winner.selected.powerVisibility),
      cost: winner.selected.powerCost ? toRef(winner.selected.powerCost) : undefined,
    },
    materialLife: {
      economicCondition: toRef(winner.selected.economicCondition),
      toolFamiliarity: toRef(winner.selected.toolFamiliarity),
    },
    currentMoment: {
      goal: toRef(winner.selected.goal),
      obstacle: toRef(winner.selected.obstacle),
      action: toRef(winner.selected.action),
      pressure: toRef(winner.selected.pressure),
    },
    trace: { version: 1, entries: winner.trace },
    scores: winner.scores,
    qaFlags: winner.selected.powerVisibility.id === 'power-visibility.full-apparition' ? ['rare-full-apparition-review'] : [],
  };
}

export function getSemanticPilotFacts(): readonly LibraryFact[] {
  return allFacts;
}

export type { ResolverOptions };
