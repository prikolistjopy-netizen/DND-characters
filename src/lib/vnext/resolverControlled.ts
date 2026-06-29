import type { SemanticSeedVNext } from './contracts';
import {
  createSemanticSignature,
  generateSemanticSeedVNextWithRules,
  type ResolverWithRulesOptions,
} from './resolverWithRules';

export type SemanticLocks = Partial<{
  desireId: string;
  fearId: string;
  beliefId: string;
  contradictionId: string;
  powerRelationshipId: string;
  powerVisibilityId: string;
  goalId: string;
  obstacleId: string;
  actionId: string;
  pressureId: string;
}>;

export type ControlledResolverOptions = ResolverWithRulesOptions & {
  locks?: SemanticLocks;
  searchAttempts?: number;
};

type LockCheck = {
  matched: number;
  total: number;
  missing: string[];
};

function checkLocks(seed: SemanticSeedVNext, locks: SemanticLocks): LockCheck {
  const pairs: Array<[string, string | undefined, string]> = [
    ['desire', locks.desireId, seed.psychology.desire.id],
    ['fear', locks.fearId, seed.psychology.fear.id],
    ['belief', locks.beliefId, seed.psychology.belief.id],
    ['contradiction', locks.contradictionId, seed.psychology.contradiction.id],
    ['powerRelationship', locks.powerRelationshipId, seed.power.relationship.id],
    ['powerVisibility', locks.powerVisibilityId, seed.power.visibility.id],
    ['goal', locks.goalId, seed.currentMoment.goal.id],
    ['obstacle', locks.obstacleId, seed.currentMoment.obstacle.id],
    ['action', locks.actionId, seed.currentMoment.action.id],
    ['pressure', locks.pressureId, seed.currentMoment.pressure.id],
  ];

  const active = pairs.filter(([, expected]) => Boolean(expected));
  const missing = active.filter(([, expected, actual]) => expected !== actual).map(([name]) => name);
  return { matched: active.length - missing.length, total: active.length, missing };
}

export function generateControlledSemanticSeedVNext(options: ControlledResolverOptions): SemanticSeedVNext {
  const locks = options.locks ?? {};
  const attempts = Math.max(1, Math.min(options.searchAttempts ?? 48, 160));
  const candidates = Array.from({ length: attempts }, (_, index) => {
    const seed = generateSemanticSeedVNextWithRules({
      ...options,
      rngSeed: `${options.rngSeed}:controlled:${index}`,
    });
    const lockCheck = checkLocks(seed, locks);
    const lockPenalty = (lockCheck.total - lockCheck.matched) * 100;
    return {
      seed,
      lockCheck,
      score: seed.scores.total - lockPenalty,
      signature: createSemanticSignature(seed),
      index,
    };
  });

  candidates.sort((left, right) => {
    if (right.lockCheck.matched !== left.lockCheck.matched) return right.lockCheck.matched - left.lockCheck.matched;
    if (right.score !== left.score) return right.score - left.score;
    return left.signature.localeCompare(right.signature);
  });

  const winner = candidates[0];
  const unresolved = winner.lockCheck.missing;
  return {
    ...winner.seed,
    rngSeed: String(options.rngSeed),
    trace: {
      ...winner.seed.trace,
      entries: [
        ...winner.seed.trace.entries,
        {
          stage: 'semantic-locks',
          decision: unresolved.length === 0
            ? `Satisfied all ${winner.lockCheck.total} semantic locks`
            : `Satisfied ${winner.lockCheck.matched} of ${winner.lockCheck.total} semantic locks`,
          selectedFactIds: Object.values(locks).filter((value): value is string => Boolean(value)),
          rejectedFactIds: candidates.slice(1, 5).map((candidate) => candidate.seed.id),
          scoreDelta: -(winner.lockCheck.total - winner.lockCheck.matched) * 100,
          reasons: unresolved.length === 0
            ? [`searchAttempts=${attempts}`, 'all requested locks resolved']
            : [`searchAttempts=${attempts}`, `unresolvedLocks=${unresolved.join(',')}`],
        },
      ],
    },
    qaFlags: [
      ...winner.seed.qaFlags,
      ...(unresolved.length > 0 ? [`unresolved-semantic-locks:${unresolved.join(',')}`] : []),
    ],
  };
}
