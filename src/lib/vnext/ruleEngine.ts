import type { SemanticRule } from './contracts';
import { vnextRules } from './facts';

type CandidateState = Record<string, unknown>;

function matchesCondition(state: CandidateState, condition: Record<string, unknown>) {
  const field = condition.field;
  if (typeof field !== 'string') return true;
  const value = state[field];
  if ('exists' in condition) return condition.exists ? value !== undefined && value !== null : value === undefined || value === null;
  if ('equals' in condition) return value === condition.equals;
  if ('oneOf' in condition && Array.isArray(condition.oneOf)) return condition.oneOf.includes(value as never);
  return true;
}

function targetSatisfied(state: CandidateState, target: Record<string, unknown> | undefined) {
  if (!target) return true;
  const field = target.field;
  if (typeof field !== 'string') return true;
  const value = state[field];
  if ('equals' in target) return value === target.equals;
  if ('oneOf' in target && Array.isArray(target.oneOf)) return target.oneOf.includes(value as never);
  return true;
}

export function evaluateRules(state: CandidateState, rules: SemanticRule[] = vnextRules) {
  const applied: string[] = [];
  const blockingErrors: string[] = [];
  let score = 0;

  for (const rule of rules) {
    if (!matchesCondition(state, rule.when)) continue;
    applied.push(rule.id);
    if (rule.type === 'requires' && !targetSatisfied(state, rule.require)) {
      if (rule.severity === 'hard') blockingErrors.push(`${rule.id}: ${rule.explanation}`);
      else score -= rule.weight;
    }
    if (rule.type === 'excludes' && targetSatisfied(state, rule.exclude)) {
      if (rule.severity === 'hard') blockingErrors.push(`${rule.id}: ${rule.explanation}`);
      else score -= rule.weight;
    }
    if (rule.type === 'prefers' || rule.type === 'boosts') score += rule.weight;
    if (rule.type === 'discourages' || rule.type === 'penalizes') score -= Math.round(rule.weight / 2);
  }

  return { applied, blockingErrors, score };
}

export function assertHardRules(state: CandidateState) {
  return evaluateRules(state).blockingErrors;
}
