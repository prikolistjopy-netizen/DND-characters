import type { EnvironmentRole, ObstacleExpression, PowerDecision, PowerEvidenceChannel, SemanticDirectorPlan, SemanticSeed, SituationGraph, VisualDirection } from './contracts';
import { directSemantic } from './semanticDirector';

function speciesProportions(speciesId: string) {
  const proportions: Record<string, string> = {
    dwarf: 'compact powerful proportions with a low center of gravity and broad practical hands',
    tiefling: 'humanoid proportions with intentional horn silhouette, tail balance, and nonhuman eyes',
    elf: 'long-lined frame with refined movement and age-readable features',
    half_elf: 'blended human and elven features with socially adaptive styling',
    halfling: 'small compact scale with clear adult proportions, practical hands, and environmental scale cues',
    half_orc: 'powerful shoulders, heavy jaw structure, and lived-in strength without caricature',
    gnome: 'small nimble proportions with tool-scaled hands and investigative focus',
    dragonborn: 'draconic head silhouette, coherent crest, scaled hands, and balanced tail mass',
    aasimar: 'human-readable body with subtle otherworldly symmetry and controlled luminous undertone',
    firbolg: 'large pastoral frame, broad gentle nonhuman face, and soft animal-like nose and ears',
    satyr: 'springy posture with goatlike lower-body cues and expressive ears',
    human: 'specific adult human build informed by age, work, and culture rather than a blank template',
  };
  return proportions[speciesId] ?? proportions.human;
}

function classTool(seed: SemanticSeed) {
  const tools: Record<string, string> = {
    warlock: 'sealed bargain token',
    paladin: 'lowered oath blade',
    barbarian: 'wrapped handaxe held low',
    fighter: 'plain sidearm kept close',
    cleric: 'communal token or bandage roll',
    rogue: 'small working knife',
    wizard: 'marked measuring page',
    druid: 'living branch or soil-marked cord',
    bard: 'folded message card',
    monk: 'empty guiding hand',
    ranger: 'route cord and field knife',
    sorcerer: 'bare hand held under pressure',
    artificer: 'single calibrated field tool',
  };
  return tools[seed.identity.classId] ?? 'single necessary object';
}

function professionTrace(seed: SemanticSeed) {
  if (seed.life.professionSalience === 'background') return '';
  if (seed.identity.professionId === 'lamplighter') return 'a faint soot mark under one cuff';
  if (seed.identity.professionId === 'physician') return 'clean repaired cuffs and precise hand pressure';
  if (seed.identity.professionId === 'mason') return 'stone dust caught in repaired seams';
  if (seed.identity.professionId === 'courtier') return 'worn formal cuff material and a controlled exchange habit';
  return seed.life.livedInTrace;
}

function classEnvironment(seed: SemanticSeed) {
  const byClass: Record<string, string> = {
    warlock: 'sealed civic threshold',
    paladin: 'public steps before a judging crowd',
    barbarian: 'wind-cut boundary path',
    fighter: 'narrow breach between danger and shelter',
    cleric: 'community room under moral pressure',
    rogue: 'service passage with watched exits',
    wizard: 'archive worktable under failing evidence',
    druid: 'edge where settlement meets living ground',
    bard: 'public hall where attention can turn',
    monk: 'quiet courtyard at the edge of conflict',
    ranger: 'broken trail line near unsafe ground',
    sorcerer: 'crowded room holding its breath',
    artificer: 'repair bay around a failing device',
  };
  return byClass[seed.identity.classId] ?? seed.world.environment;
}

function classDecisionEnvironment(seed: SemanticSeed) {
  const byClass: Record<string, string[]> = {
    warlock: ['market threshold under social pressure', 'quiet parish room with a private witness', 'rain-dark doorway with no clear permission', 'low ferry crossing under a withheld debt', 'workroom edge around a dangerous token', 'public hall where silence arrives early', 'forest track at a forbidden boundary', 'archive alley around a disputed order', 'community room under moral pressure'],
    paladin: ['public steps before a judging crowd', 'community room under moral pressure', 'rain-dark doorway where law meets shelter', 'market threshold under public accountability'],
    barbarian: ['wind-cut boundary path', 'low ferry crossing under strain', 'forest track at unsafe ground', 'narrow breach between danger and shelter'],
    fighter: ['narrow breach between danger and shelter', 'market threshold under pressure', 'public steps before a judging crowd', 'rain-dark doorway'],
    cleric: ['community room under moral pressure', 'quiet parish room', 'public hall where attention can turn', 'rain-dark doorway'],
    rogue: ['service passage with watched exits', 'market threshold under suspicion', 'archive alley under disputed access', 'rain-dark doorway'],
    wizard: ['archive worktable under failing evidence', 'workroom edge around unsafe proof', 'quiet parish room turned inquiry space', 'public hall where a conclusion is judged'],
    druid: ['edge where settlement meets living ground', 'forest track under ecological pressure', 'low ferry crossing with disturbed water', 'market threshold with living cargo at risk'],
    bard: ['public hall where attention can turn', 'market threshold in a tense exchange', 'community room under moral pressure', 'public steps before a judging crowd'],
    monk: ['quiet courtyard at the edge of conflict', 'community room under held breath', 'forest track where movement narrows', 'rain-dark doorway'],
    ranger: ['broken trail line near unsafe ground', 'low ferry crossing under changing weather', 'forest track under pressure', 'market threshold around a route dispute'],
    sorcerer: ['crowded room holding its breath', 'rain-dark doorway around a bodily surge', 'market threshold under panic', 'quiet parish room'],
    artificer: ['repair bay around a failing device', 'workroom edge around a dangerous token', 'market threshold around a broken mechanism', 'archive alley under failed containment'],
  };
  return byClass[seed.identity.classId] ?? [seed.world.environment];
}

function expressionEnvironmentBias(expression: ObstacleExpression, environment: string) {
  const text = environment.toLowerCase();
  if (expression === 'physical_barrier' && /doorway|threshold|breach|edge|boundary|crossing/.test(text)) return 10;
  if (expression === 'social_refusal' && /market|public|community|hall|parish/.test(text)) return 12;
  if (expression === 'institutional_rule' && /public|archive|hall|parish|community/.test(text)) return 12;
  if (expression === 'withheld_information' && /archive|worktable|service|hall|room/.test(text)) return 10;
  if (expression === 'damaged_object' && /workroom|repair|worktable|market/.test(text)) return 12;
  if (expression === 'unstable_environment' && /ferry|forest|rain|trail|boundary/.test(text)) return 14;
  if (expression === 'time_limit' && /crossing|doorway|market|public/.test(text)) return 8;
  if (expression === 'dependent_resistance' && /room|parish|community|courtyard/.test(text)) return 10;
  if (expression === 'public_scrutiny' && /public|market|hall|steps|threshold/.test(text)) return 12;
  if (expression === 'internal_block' && /quiet|room|courtyard|forest/.test(text)) return 10;
  return 0;
}

function roleEnvironmentBias(role: EnvironmentRole, environment: string) {
  const text = environment.toLowerCase();
  if (role === 'practical_workspace' && /workroom|repair|worktable|archive|market/.test(text)) return 13;
  if (role === 'social_pressure' && /public|market|hall|community|steps/.test(text)) return 13;
  if (role === 'physical_hazard' && /ferry|forest|rain|trail|breach|boundary/.test(text)) return 14;
  if (role === 'witness_space' && /public|hall|market|community|threshold/.test(text)) return 12;
  if (role === 'transitional_space' && /doorway|crossing|threshold|trail|path|edge/.test(text)) return 12;
  if (role === 'private_refuge' && /quiet|room|parish|courtyard/.test(text)) return 12;
  if (role === 'public_exposure' && /public|market|hall|steps/.test(text)) return 14;
  if (role === 'aftermath_space' && /courtyard|breach|parish|forest|room/.test(text)) return 10;
  if (role === 'emotional_contrast' && /quiet|forest|parish|rain/.test(text)) return 9;
  return 4;
}

function weightedEnvironmentChoice(seed: SemanticSeed, plan: SemanticDirectorPlan, candidates: string[]) {
  const unique = [...new Set(candidates)];
  let total = 0;
  const scored = unique.map((environment, index) => {
    let score = 45 + roleEnvironmentBias(plan.environmentRole, environment) + expressionEnvironmentBias(plan.obstacleExpression, environment);
    if (/threshold|archive|doorway/.test(environment) && plan.obstacleExpression === 'physical_barrier') score -= 7;
    if (seed.identity.classId === 'warlock' && /sealed civic threshold|archive arch|official/.test(environment)) score -= 28;
    if (environment === classEnvironment(seed)) score -= 18;
    if (plan.professionBudget.environmentControlAllowed && environment.includes(seed.identity.professionId.replace(/_/g, ' '))) score += 8;
    score += (hashNumber(`${seed.deterministicSeed}:${plan.sceneStrategy}:${plan.conflictCarrier}:${environment}:${index}`) % 31);
    seed.scoreTrace.push({ step: 'visual.environmentCandidate', candidateId: environment, score, reasons: [`role ${plan.environmentRole}`, `obstacle expression ${plan.obstacleExpression}`, `strategy ${plan.sceneStrategy}`, `class ${seed.identity.classId}`] });
    total += Math.max(1, score);
    return { environment, score: Math.max(1, score) };
  });
  let cursor = hashNumber(`${seed.deterministicSeed}:environment-weighted:${plan.anchorInterpretation}`) % total;
  for (const item of scored) {
    cursor -= item.score;
    if (cursor < 0) return item.environment;
  }
  return scored[scored.length - 1].environment;
}

function hashNumber(input: string) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function powerManifestation(seed: SemanticSeed) {
  if (seed.priorityPlan.dominant === 'forbidden_power') return forbiddenPowerManifestation(seed);
  if (seed.power.visibility === 'none') return 'no visible magic; class evidence stays in training, duty, and action';
  if (seed.power.visibility === 'latent') return 'a held breath and still hand mark the hidden force without light';
  if (seed.power.visibility === 'shadow') return 'one weak shadow echo beside the working hand, not a patron apparition';
  if (seed.power.visibility === 'object') return `a low contained response inside the ${seed.life.professionSalience === 'dominant' ? seed.life.personalObject : classTool(seed)}`;
  if (seed.power.visibility === 'reflected') return 'a single impossible reflection close to the immediate task';
  if (seed.power.visibility === 'environmental') return `the ${seed.world.weather} answers the action in one localized place`;
  if (seed.power.visibility === 'bodily') return 'subtle pressure in breath, skin tension, and hand restraint';
  if (seed.power.visibility === 'symbolic') return 'one small sign responding on the necessary object';
  if (seed.power.visibility === 'relational') return 'another person reacts before the character moves';
  if (seed.power.visibility === 'social') return 'authority visible through surrounding reaction rather than glow';
  if (seed.power.visibility === 'partial') return 'a partial manifestation kept behind face and hands';
  if (seed.power.visibility === 'full_apparition') return 'rare distant apparition kept far behind the action';
  return `${seed.power.visibility} power expressed through behavior and focal detail`;
}

function forbiddenPowerManifestation(seed: SemanticSeed) {
  const decisionByClass: Record<string, string> = {
    warlock: `the ${seed.power.decision} decision shows negotiated cost rather than control`,
    cleric: `mercy interrupts doctrine before anyone names it as a rite`,
    paladin: `the oath-bearing hand pauses before obedience can overrule protection`,
    wizard: `the evidence is contained as dangerous knowledge instead of displayed`,
    druid: `the living surroundings register the cost of intervention`,
    rogue: `stolen access is protected by timing, not spectacle`,
    barbarian: `force is held back hard enough to become visible in the body`,
    monk: `breath and posture contain dependence before it becomes need`,
  };
  const channel: Record<PowerEvidenceChannel, string> = {
    behavioral: `the decisive gesture stops before completion, and a witness reacts to the pause`,
    bodily: `breath catches and the working hand stiffens before it can finish the act`,
    object: `a seal or tool bears the strain, growing heavy in the hand without glow`,
    relational: `the dependent refuses contact for one beat because they know the cost`,
    environmental: `dust moves against the local air in a narrow line near the action`,
    reflected: `a wet reflection repeats the class decision half a second late`,
    social: `the surrounding group steps back as familiar authority loses force`,
    absence: `the expected sign does not answer, leaving the refusal visible`,
    consequence: `the damaged object or marked witness shows the bargain has already cost something`,
    witness_reaction: `one witness understands the price before any visible effect appears`,
  };
  return `While choosing to ${seed.power.decision.replace(/_/g, ' ')}, ${channel[seed.power.evidenceChannel]}; ${decisionByClass[seed.identity.classId] ?? 'the forbidden choice stays bound to class behavior'} (${seed.power.conflictMode.replace(/_/g, ' ')})`;
}

function choosePrimaryTool(seed: SemanticSeed, plan: SemanticDirectorPlan) {
  return plan.professionBudget.directSceneAllowed || seed.life.professionSalience === 'strong' ? seed.life.personalObject : classTool(seed);
}

function chooseEnvironment(seed: SemanticSeed, plan: SemanticDirectorPlan) {
  const baseFacts = [seed.world.environment, 'rain-dark doorway', 'low ferry crossing', 'quiet parish room', 'archive alley', 'workroom edge', 'market threshold', 'forest track'];
  const strategyEnvironments: Record<string, string[]> = {
    direct_action: [seed.world.environment, classEnvironment(seed), 'workroom edge'],
    interrupted_action: [seed.world.environment, classEnvironment(seed), 'rain-dark doorway'],
    aftermath: [seed.world.environment, classEnvironment(seed), 'quiet courtyard at the edge of conflict'],
    anticipation: [seed.world.environment, classEnvironment(seed), 'sealed civic threshold'],
    social_exchange: [seed.world.environment, classEnvironment(seed), 'market threshold'],
    hidden_observation: [seed.world.environment, classEnvironment(seed), 'service passage with watched exits'],
    protective_interposition: [seed.world.environment, classEnvironment(seed), 'narrow breach between danger and shelter'],
    object_examination: [seed.world.environment, classEnvironment(seed), 'archive worktable under failing evidence'],
    spatial_blockage: [seed.world.environment, classEnvironment(seed), 'sealed civic threshold'],
    movement_through_space: [seed.world.environment, classEnvironment(seed), 'broken trail line near unsafe ground'],
    public_role: [seed.world.environment, classEnvironment(seed), 'public steps before a judging crowd'],
    private_decision: [seed.world.environment, classEnvironment(seed), 'community room under moral pressure'],
  };
  const candidates = [
    ...baseFacts,
    ...classDecisionEnvironment(seed),
    ...(strategyEnvironments[plan.sceneStrategy] ?? []),
    classEnvironment(seed),
  ];
  return weightedEnvironmentChoice(seed, plan, candidates);
}

function hashChoice(parts: string[], options: string[]) {
  let hash = 2166136261;
  for (const part of parts.join(':')) {
    hash ^= part.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return options[(hash >>> 0) % options.length];
}

function chooseComposition(seed: SemanticSeed, plan: SemanticDirectorPlan) {
  if (plan.professionBudget.compositionControlAllowed && seed.identity.professionId === 'courtier') return 'threshold composition around official, witness, dependent, and status object';
  const strategyCompositions: Record<string, string[]> = {
    direct_action: ['tool-led forward frame', 'close action triangle', 'frontal working plane'],
    interrupted_action: ['broken diagonal with halted motion', 'offset pause before action', 'compressed interruption frame'],
    aftermath: ['low recovery composition', 'scattered aftermath plane', 'quiet rear three-quarter aftermath'],
    anticipation: ['threshold anticipation frame', 'held-breath centered frame', 'wide gap before movement'],
    social_exchange: ['opposing witness line', 'triangular exchange composition', 'side-on negotiation frame'],
    hidden_observation: ['partial occlusion frame', 'over-shoulder watch line', 'shadowed side composition'],
    protective_interposition: ['character-between-community-and-threat composition', 'shielding body diagonal', 'subject-behind-shoulder frame'],
    object_examination: ['object-centered inspection frame', 'hands-to-obstacle close frame', 'evidence table composition'],
    spatial_blockage: ['visible blocked-threshold frame', 'barrier across midground', 'narrow gap composition'],
    movement_through_space: ['diagonal route composition', 'receding path frame', 'crossing-line composition'],
    public_role: ['public semicircle composition', 'raised witness-line frame', 'formal frontality under pressure'],
    private_decision: ['tight inward frame', 'off-center private choice', 'small negative-space composition'],
  };
  const carrierModifier: Record<string, string> = {
    body: 'body-led', relationship: 'relational', object: 'object-led', environment: 'environment-framed', institution: 'institutional', time_pressure: 'time-pressed', public_judgment: 'witnessed', physical_obstacle: 'barrier-led', internal_hesitation: 'held-motion',
  };
  const base = hashChoice([seed.deterministicSeed, plan.dominantNarrativeAnchor, plan.anchorInterpretation, plan.conflictCarrier], strategyCompositions[plan.sceneStrategy] ?? [seed.visualIntent.compositionIntent]);
  return `${carrierModifier[plan.conflictCarrier]} ${base}`;
}

export function directVisual(seed: SemanticSeed, graph: SituationGraph, semanticPlan = directSemantic(seed)): VisualDirection {
  const primaryEdge = graph.edges.find((edge) => edge.type === 'protects')?.reason ?? seed.currentMoment.goal;
  const manifestation = powerManifestation(seed);
  const primaryTool = choosePrimaryTool(seed, semanticPlan);
  const environment = chooseEnvironment(seed, semanticPlan);
  const professionMark = professionTrace(seed);
  const evidence = semanticPlan.classEvidencePlan;
  const composition = chooseComposition(seed, semanticPlan);
  const professionDetail = professionMark ? `; ${professionMark}` : '';

  return {
    anchors: {
      primary: semanticPlan.dominantNarrativeAnchor,
      primaryReason: `Priority plan makes ${semanticPlan.dominantNarrativeAnchor}/${semanticPlan.anchorInterpretation} the main image driver: ${primaryEdge}.`,
      secondary: semanticPlan.supportingNarrativeAnchor,
      secondaryReason: `Supporting anchor keeps class and situation ahead of profession unless profession salience is dominant.`,
    },
    embodiment: {
      silhouette: `${speciesProportions(seed.identity.speciesId)} shaped by ${evidence.physical}`,
      proportions: speciesProportions(seed.identity.speciesId),
      posture: `${evidence.physical}; ${semanticPlan.actionTiming}; ${semanticPlan.conflictCarrier} changes body angle around ${seed.currentMoment.obstacle}`,
      gesture: `${evidence.behavioral}; ${semanticPlan.anchorInterpretation} is carried through ${semanticPlan.conflictCarrier}; the working hand uses ${primaryTool}${professionDetail}`,
      gaze: `attention follows ${semanticPlan.subjectRole} while checking ${semanticPlan.obstacleRole} and ${semanticPlan.conflictCarrier}`,
      expression: `${seed.psychology.emotionalRestraint}; ${evidence.social}`,
    },
    life: {
      clothing: seed.life.professionSalience === 'dominant' ? `clothing adapted for direct ${seed.identity.profession} work` : `clothing shaped by class pressure, species fit, and local material history`,
      materials: `${seed.life.materialHistory}, ${seed.world.architecture}, and material choices subordinate to ${semanticPlan.dominantNarrativeAnchor}`,
      primaryTool,
      handling: seed.life.professionSalience === 'dominant' ? seed.life.dailyHabit : `handling follows ${evidence.behavioral}`,
      personalObject: seed.life.professionSalience === 'dominant' ? seed.life.personalObject : primaryTool,
      wear: professionMark || 'wear appears only where the current danger stresses clothing',
      repairs: 'visible repairs only where work, class discipline, or species fit would cause stress',
      stains: professionMark || 'no decorative stains',
      livedInTrace: professionMark || 'lived-in detail stays secondary to class and scene',
    },
    power: {
      visibility: seed.power.visibility,
      manifestation,
      carrier: seed.power.manifestationCarrier,
      intensity: seed.power.intensity,
      cost: seed.power.cost,
      integrationWithAction: `${semanticPlan.powerBudget}; cue stays tied to ${primaryTool} or body action`,
      patronVisibility: seed.power.sourcePhysicallyVisible,
    },
    scene: {
      environment,
      activeObstacle: seed.currentMoment.obstacle,
      subjectOfAction: seed.currentMoment.targetOfAttention,
      spatialRelation: `${semanticPlan.sceneStrategy} places character, ${semanticPlan.subjectRole}, ${seed.currentMoment.obstacle}, and ${primaryTool} in one cause-and-effect arrangement`,
      currentMoment: seed.currentMoment.currentAction,
      narrativeIntent: seed.currentMoment.narrativeIntent,
      stakes: seed.currentMoment.stakes,
    },
    artDirection: {
      composition,
      camera: seed.identity.speciesId === 'halfling' || seed.identity.speciesId === 'gnome' ? 'slightly lowered three-quarter camera with readable adult scale' : 'front or side three-quarter camera with readable face and hands',
      lighting: `scene-specific ${seed.world.weather} light catches face, working hand, and obstacle without class-color coding`,
      paletteRoles: [`environment:${environment}`, `material:${seed.life.materialHistory}`, `species morphology:${seed.identity.speciesId}`, `power cue:${seed.power.visibility}`, `pressure:${seed.currentMoment.hiddenPressure}`],
      focalOrder: [semanticPlan.dominantNarrativeAnchor, semanticPlan.anchorInterpretation, semanticPlan.sceneStrategy, semanticPlan.supportingNarrativeAnchor, primaryTool, seed.currentMoment.obstacle],
      detailBudget: seed.visualIntent.detailBudget,
      negativeConstraints: ['no duplicate props', 'no belt clutter', 'no class-color stereotype', 'no visible patron unless selected', 'environment secondary', 'no text or logos'],
    },
  };
}
