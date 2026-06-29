import type { SemanticSeedVNext } from './contracts';

export type SemanticCharacterCard = {
  title: string;
  identity: string;
  innerConflict: string;
  socialPosition: string;
  powerStatement: string;
  currentMoment: string;
  storyHook: string;
  compactSummary: string;
};

function lowerFirst(value: string): string {
  return value.length ? value[0].toLowerCase() + value.slice(1) : value;
}

export function buildSemanticCharacterCard(seed: SemanticSeedVNext): SemanticCharacterCard {
  const identity = `${seed.identity.species.label} ${seed.identity.class.label}, ${seed.identity.profession.label}`;
  const innerConflict = `${seed.psychology.desire.label}, but fears ${lowerFirst(seed.psychology.fear.label)}. ${seed.psychology.contradiction.label}.`;
  const socialPosition = `${seed.social.status.label}; bound to ${lowerFirst(seed.social.obligation.label)}.`;
  const powerCost = seed.power.cost ? ` at the cost of ${lowerFirst(seed.power.cost.label)}` : '';
  const powerStatement = `${seed.power.source.label}; ${lowerFirst(seed.power.relationship.label)}, ${lowerFirst(seed.power.control.label)}, ${lowerFirst(seed.power.visibility.label)}${powerCost}.`;
  const currentMoment = `${seed.currentMoment.action.label} while trying to ${lowerFirst(seed.currentMoment.goal.label)}. The obstacle: ${lowerFirst(seed.currentMoment.obstacle.label)}. Pressure: ${lowerFirst(seed.currentMoment.pressure.label)}.`;
  const storyHook = `${seed.identity.profession.label} whose ${lowerFirst(seed.power.relationship.label)} power now complicates ${lowerFirst(seed.currentMoment.goal.label)}.`;
  const title = `${seed.identity.species.label} ${seed.identity.class.label} — ${seed.identity.profession.label}`;
  const compactSummary = `${identity}. ${innerConflict} ${currentMoment}`;

  return {
    title,
    identity,
    innerConflict,
    socialPosition,
    powerStatement,
    currentMoment,
    storyHook,
    compactSummary,
  };
}
