import type { SemanticSeed, SituationGraph } from './contracts';

export function buildSituationGraph(seed: SemanticSeed): SituationGraph {
  const nodes = [
    { id: 'character', type: 'character' as const, label: `${seed.identity.speciesId} ${seed.identity.classId} ${seed.identity.profession}` },
    { id: 'subject', type: 'subject_person' as const, label: seed.currentMoment.targetOfAttention },
    { id: 'tool', type: 'tool' as const, label: seed.life.personalObject },
    { id: 'obstacle', type: 'obstacle' as const, label: seed.currentMoment.obstacle },
    { id: 'risk', type: 'risk' as const, label: seed.currentMoment.risk },
    { id: 'pressure', type: 'pressure' as const, label: seed.currentMoment.pressure },
    { id: 'community', type: 'community' as const, label: seed.world.community },
    { id: 'environment', type: 'environment' as const, label: seed.world.environment },
    { id: 'power', type: 'power_source' as const, label: seed.power.source },
    { id: 'object', type: 'personal_object' as const, label: seed.life.personalObject },
    { id: 'hidden-pressure', type: 'pressure' as const, label: seed.currentMoment.hiddenPressure },
    { id: 'failure', type: 'risk' as const, label: seed.currentMoment.failurePoint },
  ];
  const edges = [
    { from: 'character', to: 'subject', type: 'protects' as const, reason: seed.life.socialResponsibility },
    { from: 'character', to: 'tool', type: 'uses' as const, reason: seed.visualIntent.secondaryAnchor },
    { from: 'character', to: 'obstacle', type: 'blocked_by' as const, reason: seed.currentMoment.goal },
    { from: 'risk', to: 'community', type: 'risks' as const, reason: seed.currentMoment.stakes },
    { from: 'character', to: 'pressure', type: 'under_pressure_from' as const, reason: seed.currentMoment.urgency },
    { from: 'power', to: 'character', type: seed.power.visibility === 'none' ? 'conceals' as const : 'reveals' as const, reason: seed.power.relationshipToSource },
    { from: 'environment', to: 'character', type: 'depends_on' as const, reason: seed.world.currentScene },
    { from: 'character', to: 'subject', type: 'watches' as const, reason: seed.currentMoment.targetOfAttention },
    { from: 'hidden-pressure', to: 'character', type: 'under_pressure_from' as const, reason: seed.tension.socialTension },
    { from: 'tool', to: 'failure', type: 'depends_on' as const, reason: seed.currentMoment.failurePoint },
    { from: 'character', to: 'object', type: 'reveals' as const, reason: seed.tension.expectationVsBehavior },
  ];
  return { nodes, edges };
}
