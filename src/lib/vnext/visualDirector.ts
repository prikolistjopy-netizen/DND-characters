import type { GenerationTraceEntry, PowerVisibility, SemanticSeedVNext, VisualDirection } from './contracts';
import { buildSituationGraph } from './situationGraph';

function mapVisibility(id: string): PowerVisibility {
  return id.replace('power-visibility.', '') as PowerVisibility;
}

function firstLabel(values: Array<{ label: string }>, fallback: string): string {
  return values[0]?.label ?? fallback;
}

function silhouetteFor(seed: SemanticSeedVNext): string {
  if (seed.identity.species.id === 'species.dwarf') return 'compact broad silhouette with a low center of gravity';
  if (seed.identity.species.id === 'species.tiefling') return 'upright asymmetric silhouette shaped by horns and anatomy-aware clothing';
  return 'balanced human silhouette shaped primarily by profession and current action';
}

function proportionFor(seed: SemanticSeedVNext): string {
  if (seed.identity.species.id === 'species.dwarf') return 'compact torso, broad mass, shortened reach handled through grounded positioning';
  if (seed.identity.species.id === 'species.tiefling') return 'species-readable anatomy without using infernal styling as a personality cue';
  return 'natural adult proportions with profession-specific bodily habit';
}

function postureFor(seed: SemanticSeedVNext, bodilyHabit: string): string {
  const action = seed.currentMoment.action.id;
  if (action === 'action.examine') return `${bodilyHabit}; torso inclined only enough to inspect without losing control`;
  if (action === 'action.interpose') return `${bodilyHabit}; body placed between the threat and the protected subject`;
  if (action === 'action.compare') return `${bodilyHabit}; weight held still while attention moves between conflicting evidence`;
  if (action === 'action.refuse-order') return `${bodilyHabit}; upright restraint with no theatrical defiance`;
  return bodilyHabit;
}

function gestureFor(seed: SemanticSeedVNext, handling: string): string {
  return `${handling}; the active hand performs ${seed.currentMoment.action.label.toLowerCase()}, while the other protects the subject, tool, or evidence`;
}

function gazeFor(seed: SemanticSeedVNext): string {
  if (seed.currentMoment.pressure.id === 'pressure.public-scrutiny') return 'gaze fixed on the task while remaining aware of watching authority';
  if (seed.currentMoment.pressure.id === 'pressure.divided-loyalty') return 'gaze divided between the immediate subject and the person implicated by the choice';
  return 'focused gaze tracking the practical problem rather than looking toward an abstract magical presence';
}

function expressionFor(seed: SemanticSeedVNext): string {
  if (seed.currentMoment.pressure.id === 'pressure.controlled-alarm') return 'controlled alarm held in the eyes and mouth, with professional composure intact';
  if (seed.currentMoment.pressure.id === 'pressure.public-scrutiny') return 'measured expression under public judgment';
  return 'restrained tension shaped by divided loyalty';
}

function toolFor(seed: SemanticSeedVNext): string {
  const profession = seed.identity.profession.id;
  const tools: Record<string, string> = {
    'profession.physician': 'one well-used diagnostic instrument',
    'profession.archivist': 'one protected record case or indexing tool',
    'profession.ferryman': 'one crossing tool, rope, pole, or oar chosen for the scene',
    'profession.locksmith': 'one compact fine-mechanism tool',
    'profession.undertaker': 'one clean practical preparation tool',
    'profession.cartographer': 'one measuring cord or protected folio',
    'profession.guard-captain': 'one maintained duty weapon or signaling tool',
    'profession.relic-appraiser': 'one inspection lens and handling cloth treated as a single tool system',
    'profession.cook': 'one familiar kitchen blade or heat tool',
    'profession.tutor': 'one portable teaching object',
    'profession.lighthouse-keeper': 'one lamp-maintenance tool',
    'profession.messenger': 'one protected message case',
    'profession.animal-handler': 'one lead or calming tool',
    'profession.mason': 'one measuring line or repair tool',
    'profession.investigator': 'one compact evidence-handling kit',
  };
  return tools[profession] ?? 'one profession-specific primary tool';
}

function clothingFor(seed: SemanticSeedVNext): string {
  const economy = seed.materialLife.economicCondition.id === 'economic.precarious'
    ? 'carefully repaired, practical layers with visible maintenance'
    : 'modest, maintained work clothing built for repeated use';
  const classAddition = seed.identity.class.id === 'class.fighter'
    ? ' with restrained protective reinforcement where the current action needs it'
    : seed.identity.class.id === 'class.cleric'
      ? ' with one understated institutional or ritual sign integrated into daily clothing'
      : ' with no costume-like patron iconography unless required by the selected power manifestation';
  return `${economy}${classAddition}`;
}

function materialsFor(seed: SemanticSeedVNext): string[] {
  const base = ['worn natural cloth', 'aged leather', 'one practical metal'];
  if (seed.identity.profession.id === 'profession.ferryman' || seed.identity.profession.id === 'profession.lighthouse-keeper') base.push('weather-treated outer fabric');
  if (seed.identity.profession.id === 'profession.mason') base.push('stone dust and work cord');
  return base.slice(0, 5);
}

function manifestationFor(seed: SemanticSeedVNext, primaryTool: string): string | undefined {
  switch (seed.power.visibility.id) {
    case 'power-visibility.none': return undefined;
    case 'power-visibility.latent': return 'power is inferred only from consequence, interruption, or another character’s reaction';
    case 'power-visibility.behavioral': return 'a brief involuntary hesitation, repeated gesture, or misplaced attention reveals outside influence';
    case 'power-visibility.object-based': return `${primaryTool} behaves subtly incorrectly in a way tied to the immediate obstacle`;
    case 'power-visibility.reflected': return 'the anomaly appears only in a reflection or polished surface inside the scene';
    case 'power-visibility.full-apparition': return 'a rare full apparition appears only because the current moment directly forces contact with the power source';
    default: return 'a restrained manifestation integrated into the current action rather than surrounding the whole body';
  }
}

function environmentFor(seed: SemanticSeedVNext): string {
  const goal = seed.currentMoment.goal.id;
  if (goal === 'goal.diagnose-anomaly') return 'a practical treatment or examination space with only the subject and essential work surfaces';
  if (goal === 'goal.protect-crossing') return 'a threshold, quay, bridge, gate, or difficult passage shaped by the crossing itself';
  if (goal === 'goal.verify-evidence') return 'a records, workshop, hearing, or investigation space where evidence can be physically compared';
  if (goal === 'goal.keep-oath') return 'an institutional or communal space where the oath has immediate consequences';
  return 'a low-clutter environment directly supporting the current task';
}

function sceneFamily(seed: SemanticSeedVNext): string {
  if (seed.currentMoment.goal.id === 'goal.diagnose-anomaly') return 'work / diagnosis';
  if (seed.currentMoment.goal.id === 'goal.protect-crossing') return 'protection / crossing';
  if (seed.currentMoment.goal.id === 'goal.verify-evidence') return 'investigation / judgment';
  return 'moral choice / obligation';
}

function compositionFor(seed: SemanticSeedVNext): string {
  if (seed.currentMoment.action.id === 'action.interpose') return 'asymmetric composition placing the protected subject behind the character’s body line';
  if (seed.currentMoment.action.id === 'action.compare') return 'stable triangular composition between face, active hand, and evidence';
  if (seed.currentMoment.action.id === 'action.refuse-order') return 'controlled frontal or three-quarter composition with negative space separating character from authority';
  return 'three-quarter working composition centered on face, hands, and tool interaction';
}

function lightFor(seed: SemanticSeedVNext): string {
  if (seed.currentMoment.pressure.id === 'pressure.public-scrutiny') return 'clear public-facing light with a restrained secondary shadow pressure';
  if (seed.currentMoment.pressure.id === 'pressure.divided-loyalty') return 'split but natural environmental light separating two competing responsibilities';
  return 'localized practical light that reveals the task and leaves the larger environment secondary';
}

function paletteFor(seed: SemanticSeedVNext): string[] {
  const roles = ['environment-derived ground colors', 'natural skin and material support', 'one functional profession accent'];
  if (seed.power.visibility.id !== 'power-visibility.none') roles.push('one restrained anomalous note determined by the manifestation, not the class');
  return roles;
}

export function resolveVisualDirectionVNext(seed: SemanticSeedVNext): VisualDirection {
  const graph = buildSituationGraph(seed);
  const bodilyHabit = firstLabel(graph.affordances['bodily-habit'], 'economical posture shaped by repeated professional work');
  const handling = firstLabel(graph.affordances['handling-style'], 'practiced handling of one familiar tool');
  const wearTrace = firstLabel(graph.affordances['material-trace'], 'localized wear only where hands, tools, and movement repeatedly contact clothing');
  const socialSignal = firstLabel(graph.affordances['social-signal'], 'one subtle social signal appropriate to status and obligation');
  const primaryTool = toolFor(seed);
  const visibility = mapVisibility(seed.power.visibility.id);
  const manifestation = manifestationFor(seed, primaryTool);
  const trace: GenerationTraceEntry[] = [
    {
      stage: 'visual-readability',
      decision: 'Use species morphology and current action as the two primary anchors',
      selectedFactIds: [seed.identity.species.id, seed.currentMoment.action.id],
      reasons: ['maximum two primary readability anchors', 'class remains readable through function and power relation rather than stacked symbols'],
    },
    {
      stage: 'visual-life-layer',
      decision: `${bodilyHabit}; ${handling}; ${wearTrace}`,
      selectedFactIds: [seed.identity.profession.id],
      reasons: ['profession must affect body, handling, and material trace'],
    },
    {
      stage: 'visual-power-layer',
      decision: manifestation ?? 'No visible magic; power remains structurally present in the situation',
      selectedFactIds: [seed.power.visibility.id, seed.power.relationship.id],
      reasons: ['power manifestation follows current action and tool relation', 'no automatic aura or patron apparition'],
    },
  ];

  return {
    sourceSeedId: seed.id,
    readability: {
      primaryAnchors: [silhouetteFor(seed), seed.currentMoment.action.label],
      silhouetteFamily: silhouetteFor(seed),
      proportionBias: proportionFor(seed),
    },
    embodiment: {
      posture: postureFor(seed, bodilyHabit),
      lineOfAction: seed.currentMoment.action.id === 'action.interpose' ? 'committed protective diagonal' : 'contained working line directed toward the subject or tool',
      gesture: gestureFor(seed, handling),
      gaze: gazeFor(seed),
      expression: expressionFor(seed),
    },
    life: {
      clothingLogic: `${clothingFor(seed)}; ${socialSignal}`,
      materials: materialsFor(seed),
      primaryTool,
      wearTrace,
    },
    power: {
      visibility,
      control: seed.power.control.label,
      manifestation,
      costSignal: seed.power.cost ? `show the cost through one restrained consequence related to ${seed.power.cost.label.toLowerCase()}` : undefined,
    },
    scene: {
      family: sceneFamily(seed),
      environment: environmentFor(seed),
      spatialRelation: graph.summary,
      secondaryObjects: graph.nodes.filter((node) => node.type === 'subject' || node.type === 'community').map((node) => node.label).slice(0, 2),
    },
    artDirection: {
      composition: compositionFor(seed),
      camera: 'full-body three-quarter view unless the action requires a clearer profile or frontal refusal',
      light: lightFor(seed),
      paletteRoles: paletteFor(seed),
      focalOrder: ['face and gaze', 'active hands and tool contact', 'subject or evidence', 'single power anomaly if visible', 'simplified clothing and environment'],
      detailBudget: {
        face: 28,
        hands: 18,
        primaryTool: 15,
        costumeZone: 12,
        narrativeObject: 10,
        powerManifestation: visibility === 'none' ? 0 : visibility === 'full-apparition' ? 10 : 7,
      },
    },
    negativeConstraints: [
      'no automatic class-color palette',
      'no full-body aura unless explicitly required by the selected manifestation',
      'no duplicate tools or decorative prop belts',
      'no visible patron unless power visibility is full-apparition',
      'no scene element without a semantic or functional justification',
      'keep the environment secondary and low clutter',
    ],
    decisionTrace: trace,
  };
}
