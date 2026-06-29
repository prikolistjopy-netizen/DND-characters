import affordanceDocument from '../../data/vnext/affordances.json';
import type { SemanticSeedVNext } from './contracts';

type AffordanceKind = 'bodily-habit' | 'handling-style' | 'material-trace' | 'social-signal';

type Affordance = {
  id: string;
  kind: AffordanceKind;
  label: string;
  tags: string[];
  supports: string[];
  version: number;
};

type AffordanceDocument = { affordances: Affordance[] };

export type SituationNode = {
  id: string;
  type: 'character' | 'subject' | 'tool' | 'obstacle' | 'risk' | 'pressure' | 'community';
  label: string;
};

export type SituationEdge = {
  from: string;
  relation: 'acts-on' | 'uses' | 'blocked-by' | 'risks' | 'under' | 'responsible-to' | 'reveals';
  to: string;
  reason: string;
};

export type SituationGraph = {
  nodes: SituationNode[];
  edges: SituationEdge[];
  affordances: Record<AffordanceKind, Affordance[]>;
  summary: string;
};

const affordances = (affordanceDocument as AffordanceDocument).affordances;

function selectAffordances(seed: SemanticSeedVNext): Record<AffordanceKind, Affordance[]> {
  const supports = new Set([seed.identity.profession.id, seed.identity.class.id, seed.identity.species.id]);
  const selected = affordances.filter((item) => item.supports.some((support) => supports.has(support)));
  return {
    'bodily-habit': selected.filter((item) => item.kind === 'bodily-habit').slice(0, 2),
    'handling-style': selected.filter((item) => item.kind === 'handling-style').slice(0, 2),
    'material-trace': selected.filter((item) => item.kind === 'material-trace').slice(0, 2),
    'social-signal': selected.filter((item) => item.kind === 'social-signal').slice(0, 2),
  };
}

function inferSubject(seed: SemanticSeedVNext): string {
  const goal = seed.currentMoment.goal.id;
  if (goal === 'goal.diagnose-anomaly') return 'patient or affected subject';
  if (goal === 'goal.protect-crossing') return 'person or group being escorted';
  if (goal === 'goal.verify-evidence') return 'evidence, witness, or disputed object';
  if (goal === 'goal.keep-oath') return 'person affected by the oath';
  return 'immediate subject of the current action';
}

function inferTool(seed: SemanticSeedVNext): string {
  const profession = seed.identity.profession.id;
  if (profession === 'profession.physician') return 'diagnostic instrument';
  if (profession === 'profession.locksmith') return 'fine mechanism tool';
  if (profession === 'profession.archivist') return 'record or indexing tool';
  if (profession === 'profession.ferryman') return 'crossing tool';
  if (profession === 'profession.mason') return 'measuring or repair tool';
  if (profession === 'profession.investigator') return 'evidence-handling kit';
  return 'profession-specific primary tool';
}

export function buildSituationGraph(seed: SemanticSeedVNext): SituationGraph {
  const subjectLabel = inferSubject(seed);
  const toolLabel = inferTool(seed);
  const nodes: SituationNode[] = [
    { id: 'character', type: 'character', label: `${seed.identity.species.label} ${seed.identity.class.label}, ${seed.identity.profession.label}` },
    { id: 'subject', type: 'subject', label: subjectLabel },
    { id: 'tool', type: 'tool', label: toolLabel },
    { id: 'obstacle', type: 'obstacle', label: seed.currentMoment.obstacle.label },
    { id: 'pressure', type: 'pressure', label: seed.currentMoment.pressure.label },
    { id: 'community', type: 'community', label: seed.social.obligation.label },
  ];

  if (seed.power.cost) {
    nodes.push({ id: 'risk', type: 'risk', label: seed.power.cost.label });
  }

  const edges: SituationEdge[] = [
    { from: 'character', relation: 'acts-on', to: 'subject', reason: seed.currentMoment.action.label },
    { from: 'character', relation: 'uses', to: 'tool', reason: seed.materialLife.toolFamiliarity.label },
    { from: 'character', relation: 'blocked-by', to: 'obstacle', reason: seed.currentMoment.goal.label },
    { from: 'character', relation: 'under', to: 'pressure', reason: seed.currentMoment.pressure.label },
    { from: 'character', relation: 'responsible-to', to: 'community', reason: seed.social.status.label },
  ];

  if (seed.power.cost) {
    edges.push({ from: 'character', relation: 'risks', to: 'risk', reason: seed.power.relationship.label });
  }

  if (seed.power.visibility.id !== 'power-visibility.none') {
    edges.push({
      from: 'tool',
      relation: 'reveals',
      to: 'obstacle',
      reason: seed.power.visibility.label,
    });
  }

  const selectedAffordances = selectAffordances(seed);
  const summary = `${nodes[0].label} ${seed.currentMoment.action.label.toLowerCase()} ${subjectLabel}, using ${toolLabel}, while blocked by ${seed.currentMoment.obstacle.label.toLowerCase()} and under ${seed.currentMoment.pressure.label.toLowerCase()}.`;

  return {
    nodes,
    edges,
    affordances: selectedAffordances,
    summary,
  };
}
