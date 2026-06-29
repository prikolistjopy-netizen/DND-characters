import rulesDocument from '../../data/vnext/rules.json';
import type { ConstraintRule, FactRef, InfluenceRule, LibraryFact, SemanticSeedVNext } from './contracts';

export type RuleEvaluation = {
  scoreDelta: number;
  hardConflict: boolean;
  appliedInfluenceIds: string[];
  triggeredConstraintIds: string[];
  reasons: string[];
  unmatchedTargetIds: string[];
};

type RulesDocument = {
  influences: InfluenceRule[];
  constraints: ConstraintRule[];
};

const rules = rulesDocument as RulesDocument;

function flattenRefs(seed: SemanticSeedVNext): FactRef[] {
  return [
    seed.identity.species,
    seed.identity.class,
    seed.identity.profession,
    seed.identity.culture,
    seed.identity.ageBand,
    seed.identity.presentation,
    seed.psychology.desire,
    seed.psychology.fear,
    seed.psychology.belief,
    seed.psychology.contradiction,
    seed.psychology.copingStrategy,
    seed.social.status,
    seed.social.obligation,
    seed.social.communityRole,
    seed.social.reputation,
    seed.social.keyRelationship,
    seed.power.source,
    seed.power.relationship,
    seed.power.control,
    seed.power.visibility,
    seed.power.cost,
    seed.power.limitation,
    seed.materialLife.economicCondition,
    seed.materialLife.toolFamiliarity,
    seed.materialLife.personalObject,
    seed.currentMoment.goal,
    seed.currentMoment.obstacle,
    seed.currentMoment.action,
    seed.currentMoment.pressure,
    seed.currentMoment.recentEvent,
    seed.currentMoment.hiddenInformation,
  ].filter((value): value is FactRef => Boolean(value));
}

function buildSignals(seed: SemanticSeedVNext, factsById: ReadonlyMap<string, LibraryFact>): Set<string> {
  const signals = new Set<string>();
  for (const ref of flattenRefs(seed)) {
    signals.add(ref.id);
    signals.add(`domain.${ref.domain}`);
    const fact = factsById.get(ref.id);
    for (const tag of fact?.tags ?? []) signals.add(tag);
  }
  signals.add('current-moment.complete');
  signals.add('library-fact.production');
  return signals;
}

function allWhenMatch(when: string[], signals: Set<string>): boolean {
  return when.every((condition) => signals.has(condition));
}

function anyTargetMatches(targets: string[], signals: Set<string>): boolean {
  return targets.some((target) => signals.has(target));
}

export function evaluateSemanticRules(
  seed: SemanticSeedVNext,
  facts: readonly LibraryFact[],
): RuleEvaluation {
  const factsById = new Map(facts.map((fact) => [fact.id, fact]));
  const signals = buildSignals(seed, factsById);
  const appliedInfluenceIds: string[] = [];
  const triggeredConstraintIds: string[] = [];
  const reasons: string[] = [];
  const unmatchedTargetIds = new Set<string>();
  let scoreDelta = 0;
  let hardConflict = false;

  for (const rule of rules.influences) {
    if (!allWhenMatch(rule.when, signals)) continue;
    const matched = anyTargetMatches(rule.targets, signals);
    if (!matched) {
      for (const target of rule.targets) {
        if (!signals.has(target)) unmatchedTargetIds.add(target);
      }
      continue;
    }
    scoreDelta += rule.weight;
    appliedInfluenceIds.push(rule.id);
    reasons.push(`${rule.id}: ${rule.reason} (${rule.weight >= 0 ? '+' : ''}${rule.weight})`);
  }

  for (const rule of rules.constraints) {
    if (!allWhenMatch(rule.when, signals)) continue;
    const matched = anyTargetMatches(rule.targets, signals);
    if (!matched) continue;
    triggeredConstraintIds.push(rule.id);
    reasons.push(`${rule.id}: ${rule.reason}`);
    if (rule.kind === 'excludes' || rule.kind === 'conflicts') hardConflict = true;
  }

  return {
    scoreDelta,
    hardConflict,
    appliedInfluenceIds,
    triggeredConstraintIds,
    reasons,
    unmatchedTargetIds: [...unmatchedTargetIds],
  };
}

export function getSemanticRuleCoverage(facts: readonly LibraryFact[]) {
  const knownSignals = new Set<string>();
  for (const fact of facts) {
    knownSignals.add(fact.id);
    knownSignals.add(`domain.${fact.domain}`);
    for (const tag of fact.tags) knownSignals.add(tag);
  }
  knownSignals.add('current-moment.complete');
  knownSignals.add('library-fact.production');

  const targetIds = [...rules.influences, ...rules.constraints].flatMap((rule) => rule.targets);
  const whenIds = [...rules.influences, ...rules.constraints].flatMap((rule) => rule.when);
  return {
    influenceCount: rules.influences.length,
    constraintCount: rules.constraints.length,
    knownTargetCount: targetIds.filter((target) => knownSignals.has(target)).length,
    unknownTargets: [...new Set(targetIds.filter((target) => !knownSignals.has(target)))],
    unknownConditions: [...new Set(whenIds.filter((condition) => !knownSignals.has(condition)))],
  };
}
