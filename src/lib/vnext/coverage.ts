import rulesDocument from '../../data/vnext/rules.json';
import type { ConstraintRule, InfluenceRule, LibraryFact } from './contracts';

type RulesDocument = {
  influences: InfluenceRule[];
  constraints: ConstraintRule[];
};

export type CoverageReport = {
  factCount: number;
  ruleCount: number;
  orphanFactIds: string[];
  unreachableFactIds: string[];
  unknownRuleConditions: string[];
  unknownRuleTargets: string[];
  professionWithoutBehavioralTags: string[];
  highRiskFactsWithoutCounterweight: string[];
  coverageScore: number;
};

function buildKnownSignals(facts: readonly LibraryFact[]): Set<string> {
  const signals = new Set<string>(['current-moment.complete', 'library-fact.production']);
  for (const fact of facts) {
    signals.add(fact.id);
    signals.add(`domain.${fact.domain}`);
    for (const tag of fact.tags) signals.add(tag);
  }
  return signals;
}

export function analyzeSemanticCoverage(facts: readonly LibraryFact[]): CoverageReport {
  const rules = rulesDocument as RulesDocument;
  const allRules = [...rules.influences, ...rules.constraints];
  const knownSignals = buildKnownSignals(facts);
  const referenced = new Set(allRules.flatMap((rule) => [...rule.when, ...rule.targets]));
  const conditionIds = allRules.flatMap((rule) => rule.when);
  const targetIds = allRules.flatMap((rule) => rule.targets);

  const orphanFactIds = facts
    .filter((fact) => !referenced.has(fact.id) && !fact.tags.some((tag) => referenced.has(tag)) && !referenced.has(`domain.${fact.domain}`))
    .map((fact) => fact.id);

  const unreachableFactIds = facts
    .filter((fact) => fact.baseWeight <= 0 || fact.tags.length === 0)
    .map((fact) => fact.id);

  const professionWithoutBehavioralTags = facts
    .filter((fact) => fact.domain === 'profession')
    .filter((fact) => {
      const text = [...fact.tags, ...(fact.visualAffordances ?? [])].join(' ').toLowerCase();
      return !/(posture|gesture|hand|handling|stance|gaze|movement|grip|balance|listen|inspect|measure|care|wear)/.test(text);
    })
    .map((fact) => fact.id);

  const highRiskFactsWithoutCounterweight = facts
    .filter((fact) => (fact.stereotypeRisk ?? 0) >= 0.6)
    .filter((fact) => !rules.influences.some((rule) => rule.kind === 'discourages' && rule.targets.includes(fact.id)))
    .map((fact) => fact.id);

  const unknownRuleConditions = [...new Set(conditionIds.filter((id) => !knownSignals.has(id)))];
  const unknownRuleTargets = [...new Set(targetIds.filter((id) => !knownSignals.has(id)))];
  const issueWeight =
    orphanFactIds.length * 0.25 +
    unreachableFactIds.length * 2 +
    unknownRuleConditions.length * 1.5 +
    unknownRuleTargets.length * 0.75 +
    professionWithoutBehavioralTags.length * 1.5 +
    highRiskFactsWithoutCounterweight.length * 2;
  const coverageScore = Math.max(0, Math.min(1, 1 - issueWeight / Math.max(20, facts.length + allRules.length)));

  return {
    factCount: facts.length,
    ruleCount: allRules.length,
    orphanFactIds,
    unreachableFactIds,
    unknownRuleConditions,
    unknownRuleTargets,
    professionWithoutBehavioralTags,
    highRiskFactsWithoutCounterweight,
    coverageScore,
  };
}
