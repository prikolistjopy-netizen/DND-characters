import type { GenerationTraceEntry, SemanticSeedVNext } from './contracts';
import { evaluateSemanticRules } from './ruleEngine';
import { generateSemanticSeedVNext, getSemanticPilotFacts, type ResolverOptions } from './resolver';

export type ResolverWithRulesOptions = ResolverOptions & {
  rerankPoolSize?: number;
  repetitionHistory?: string[];
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

function semanticSignature(seed: SemanticSeedVNext): string {
  return [
    seed.identity.class.id,
    seed.identity.species.id,
    seed.identity.profession.id,
    seed.psychology.contradiction.id,
    seed.power.relationship.id,
    seed.power.visibility.id,
    seed.currentMoment.goal.id,
    seed.currentMoment.action.id,
  ].join('|');
}

function repetitionPenalty(signature: string, history: string[]): number {
  const exactMatches = history.filter((item) => item === signature).length;
  const signatureParts = new Set(signature.split('|'));
  const nearMatches = history.reduce((sum, item) => {
    const overlap = item.split('|').filter((part) => signatureParts.has(part)).length;
    return sum + (overlap >= 6 ? 1 : 0);
  }, 0);
  return exactMatches * 3 + nearMatches * 0.35;
}

export function generateSemanticSeedVNextWithRules(options: ResolverWithRulesOptions): SemanticSeedVNext {
  const rerankPoolSize = Math.max(3, Math.min(options.rerankPoolSize ?? 12, 40));
  const facts = getSemanticPilotFacts();
  const history = options.repetitionHistory ?? [];
  const candidates = Array.from({ length: rerankPoolSize }, (_, index) => {
    const derivedSeed = `${options.rngSeed}:rule-pool:${index}`;
    const seed = generateSemanticSeedVNext({ ...options, rngSeed: derivedSeed });
    const evaluation = evaluateSemanticRules(seed, facts);
    const signature = semanticSignature(seed);
    const repetition = repetitionPenalty(signature, history);
    const hardConflictPenalty = evaluation.hardConflict ? 1000 : 0;
    const adjustedTotal = seed.scores.total + evaluation.scoreDelta - repetition - hardConflictPenalty;
    return { seed, evaluation, signature, repetition, adjustedTotal, index };
  });

  candidates.sort((left, right) => {
    if (right.adjustedTotal !== left.adjustedTotal) return right.adjustedTotal - left.adjustedTotal;
    return hashSeed(`${options.rngSeed}:${left.signature}`) - hashSeed(`${options.rngSeed}:${right.signature}`);
  });

  const winner = candidates[0];
  const rerankTrace: GenerationTraceEntry = {
    stage: 'rule-rerank',
    decision: `Selected candidate ${winner.index + 1} from a pool of ${rerankPoolSize}`,
    selectedFactIds: winner.evaluation.appliedInfluenceIds,
    rejectedFactIds: candidates.slice(1, 5).map((candidate) => candidate.seed.id),
    scoreDelta: winner.evaluation.scoreDelta - winner.repetition,
    reasons: [
      ...winner.evaluation.reasons,
      `ruleScoreDelta=${winner.evaluation.scoreDelta.toFixed(2)}`,
      `repetitionPenalty=${winner.repetition.toFixed(2)}`,
      `adjustedTotal=${winner.adjustedTotal.toFixed(2)}`,
    ],
  };

  return {
    ...winner.seed,
    rngSeed: String(options.rngSeed),
    scores: {
      ...winner.seed.scores,
      repetitionPenalty: winner.repetition,
      conflictPenalty: winner.evaluation.hardConflict ? 1000 : 0,
      total: winner.adjustedTotal,
    },
    trace: {
      ...winner.seed.trace,
      entries: [...winner.seed.trace.entries, rerankTrace],
    },
    qaFlags: [
      ...winner.seed.qaFlags,
      ...(winner.evaluation.hardConflict ? ['semantic-hard-conflict'] : []),
      ...(winner.evaluation.unmatchedTargetIds.length > 0 ? ['rule-target-coverage-incomplete'] : []),
    ],
  };
}

export function createSemanticSignature(seed: SemanticSeedVNext): string {
  return semanticSignature(seed);
}
