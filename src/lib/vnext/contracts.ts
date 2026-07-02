export type PilotClassId = 'fighter' | 'cleric' | 'warlock' | 'rogue' | 'ranger' | 'paladin' | 'wizard' | 'druid' | 'bard' | 'monk' | 'barbarian' | 'sorcerer' | 'artificer';
export type PilotSpeciesId = 'human' | 'dwarf' | 'tiefling' | 'elf' | 'half_elf' | 'halfling' | 'half_orc' | 'gnome' | 'dragonborn' | 'aasimar' | 'firbolg' | 'satyr';
export type PowerVisibility = 'none' | 'latent' | 'behavioral' | 'bodily' | 'object' | 'reflected' | 'shadow' | 'environmental' | 'symbolic' | 'relational' | 'social' | 'partial' | 'full_apparition';
export type AgeBand = 'young_adult' | 'adult' | 'middle_aged' | 'elder';
export type GenderPresentation = 'masculine' | 'feminine' | 'androgynous';
export type NoveltyMode = 'off' | 'soft' | 'strong';
export type ProfessionSalience = 'background' | 'trace' | 'secondary' | 'strong' | 'dominant';
export type ProfessionAffinity = 'high' | 'medium' | 'low' | 'rare_contrast';
export type SemanticAnchor = 'class_conflict' | 'personal_contradiction' | 'current_danger' | 'relationship' | 'social_duty' | 'forbidden_power' | 'profession' | 'species_presence';
export type SceneStrategy = 'direct_action' | 'interrupted_action' | 'aftermath' | 'anticipation' | 'social_exchange' | 'hidden_observation' | 'protective_interposition' | 'object_examination' | 'spatial_blockage' | 'movement_through_space' | 'public_role' | 'private_decision';
export type ConflictCarrier = 'body' | 'relationship' | 'object' | 'environment' | 'institution' | 'time_pressure' | 'public_judgment' | 'physical_obstacle' | 'internal_hesitation';
export type PromptWriterMode = 'local' | 'mock_llm' | 'external_llm';
export type ObstacleExpression = 'physical_barrier' | 'social_refusal' | 'institutional_rule' | 'withheld_information' | 'damaged_object' | 'unstable_environment' | 'time_limit' | 'dependent_resistance' | 'public_scrutiny' | 'internal_block';
export type EnvironmentRole = 'neutral_stage' | 'practical_workspace' | 'social_pressure' | 'physical_hazard' | 'emotional_contrast' | 'witness_space' | 'transitional_space' | 'private_refuge' | 'public_exposure' | 'aftermath_space';
export type PowerConflictMode = 'possession' | 'obligation' | 'contamination' | 'dependency' | 'borrowed_authority' | 'unstable_control' | 'forbidden_knowledge' | 'harmful_side_effect' | 'social_stigma' | 'moral_prohibition' | 'mistaken_identity' | 'institutional_ban';
export type PowerDecision = 'use' | 'refuse' | 'conceal' | 'transfer' | 'contain' | 'reveal' | 'bargain' | 'endure' | 'redirect' | 'destroy' | 'surrender' | 'exploit';
export type PowerEvidenceChannel = 'behavioral' | 'bodily' | 'object' | 'relational' | 'environmental' | 'reflected' | 'social' | 'absence' | 'consequence' | 'witness_reaction';

export type VNextInput = {
  rngSeed: string | number;
  classId?: PilotClassId;
  speciesId?: PilotSpeciesId;
  professionId?: string;
  professionSalience?: ProfessionSalience;
  locks?: Partial<Pick<SemanticSeed['identity'], 'classId' | 'speciesId' | 'professionId' | 'ageBand' | 'genderPresentation'>> & Partial<Pick<SemanticSeed['power'], 'visibility'>> & { professionSalience?: ProfessionSalience };
  preferences?: string[];
  noveltyMode?: NoveltyMode;
  beamWidth?: number;
  promptOptions?: { maxWords?: number; writerMode?: PromptWriterMode };
};

export type RuleType = 'requires' | 'excludes' | 'prefers' | 'discourages' | 'boosts' | 'penalizes' | 'conditional_override' | 'fallback';
export type RuleSeverity = 'hard' | 'soft';

export type SemanticRule = {
  id: string;
  description: string;
  type: RuleType;
  when: Record<string, unknown>;
  require?: Record<string, unknown>;
  exclude?: Record<string, unknown>;
  prefer?: Record<string, unknown>;
  penalize?: Record<string, unknown>;
  weight: number;
  severity: RuleSeverity;
  explanation: string;
  affectedFields?: string[];
};

export type ScoreTraceEntry = {
  step: string;
  candidateId: string;
  score: number;
  reasons: string[];
  rejected?: boolean;
};

export type SemanticSeed = {
  schemaVersion: string;
  deterministicSeed: string;
  lockedFields: string[];
  selectedFactIds: string[];
  identity: {
    classId: PilotClassId;
    speciesId: PilotSpeciesId;
    professionId: string;
    profession: string;
    ageBand: AgeBand;
    genderPresentation: GenderPresentation;
    socialRole: string;
    culturalContext: string;
  };
  psychology: {
    dominantDrive: string;
    value: string;
    fear: string;
    contradiction: string;
    copingStrategy: string;
    emotionalRestraint: string;
    relationshipToPower: string;
  };
  life: {
    profession: string;
    dailyHabit: string;
    learnedSkill: string;
    bodyHabit: string;
    socialResponsibility: string;
    livedInTrace: string;
    materialHistory: string;
    personalObject: string;
    professionSalience: ProfessionSalience;
    professionAffinity: ProfessionAffinity;
    professionEvidenceChannels: string[];
    formerProfession?: string;
    reputation: string;
  };
  tension: {
    roleContradiction: string;
    socialTension: string;
    innerConflict: string;
    dutyVsInstinct: string;
    sacredVsProfane: string;
    professionClassFriction: string;
    expectationVsBehavior: string;
  };
  currentMoment: {
    sceneArchetype: string;
    currentAction: string;
    immediateTask: string;
    goal: string;
    obstacle: string;
    stakes: string;
    dependent: string;
    risk: string;
    pressure: string;
    hiddenPressure: string;
    targetOfAttention: string;
    urgency: string;
    failurePoint: string;
    motionEnergy: string;
    narrativeIntent: string;
    visualConsequence: string;
    consequenceOfFailure: string;
    obstacleExpression: ObstacleExpression;
  };
  power: {
    source: string;
    sourceId: string;
    relationshipToSource: string;
    visibility: PowerVisibility;
    intensity: 'none' | 'low' | 'medium' | 'high';
    control: string;
    cost: string;
    manifestationCarrier: string;
    sourcePhysicallyVisible: boolean;
    conflictMode: PowerConflictMode;
    decision: PowerDecision;
    evidenceChannel: PowerEvidenceChannel;
  };
  world: {
    environment: string;
    environmentId: string;
    culture: string;
    cultureId: string;
    community: string;
    weather: string;
    architecture: string;
    socialTension: string;
    currentScene: string;
    environmentRole: EnvironmentRole;
  };
  priorityPlan: PriorityPlan;
  visualIntent: {
    silhouettePrinciple: string;
    primaryAnchor: string;
    secondaryAnchor: string;
    focalHierarchy: string[];
    detailBudget: 'minimal' | 'controlled' | 'rich_controlled';
    mood: string;
    compositionIntent: string;
  };
  scoreTrace: ScoreTraceEntry[];
  appliedRules: string[];
  rejectedCandidates: ScoreTraceEntry[];
  qaFlags: string[];
};

export type PriorityPlan = {
  dominant: SemanticAnchor;
  anchorInterpretation: string;
  sceneStrategy: SceneStrategy;
  conflictCarrier: ConflictCarrier;
  supporting: SemanticAnchor;
  minor: SemanticAnchor | 'profession_trace' | 'none';
  suppressed: string[];
  professionSalience: ProfessionSalience;
  professionAffinity: ProfessionAffinity;
};

export type ProfessionBudget = {
  salience: ProfessionSalience;
  maxVisualChannels: number;
  allowedChannels: string[];
  directSceneAllowed: boolean;
  environmentControlAllowed: boolean;
  compositionControlAllowed: boolean;
};

export type ClassEvidencePlan = {
  behavioral: string;
  physical: string;
  social: string;
  object?: string;
  power?: string;
  channels: string[];
};

export type SemanticDirectorPlan = {
  dominantNarrativeAnchor: SemanticAnchor;
  anchorInterpretation: string;
  sceneStrategy: SceneStrategy;
  conflictCarrier: ConflictCarrier;
  supportingNarrativeAnchor: SemanticAnchor;
  minorEcho: SemanticAnchor | 'profession_trace' | 'none';
  suppressedFacts: string[];
  professionBudget: ProfessionBudget;
  classEvidencePlan: ClassEvidencePlan;
  speciesMorphologyPlan: string;
  sceneFocus: string;
  emotionalFocus: string;
  emotionalAxis: string;
  visualConflict: string;
  actionTiming: string;
  subjectRole: string;
  obstacleRole: string;
  obstacleExpression: ObstacleExpression;
  environmentRole: EnvironmentRole;
  powerBudget: string;
  powerConflictMode: PowerConflictMode;
  powerDecision: PowerDecision;
  powerEvidenceChannel: PowerEvidenceChannel;
  professionAffinity: ProfessionAffinity;
  priorityCompliance: string[];
};

export type SituationNodeType = 'character' | 'subject_person' | 'tool' | 'obstacle' | 'risk' | 'pressure' | 'community' | 'environment' | 'power_source' | 'personal_object';
export type SituationEdgeType = 'acts_on' | 'uses' | 'blocked_by' | 'risks' | 'protects' | 'responsible_to' | 'under_pressure_from' | 'reveals' | 'conceals' | 'depends_on' | 'watches' | 'transforms';
export type SituationGraph = {
  nodes: Array<{ id: string; type: SituationNodeType; label: string }>;
  edges: Array<{ from: string; to: string; type: SituationEdgeType; reason: string }>;
};

export type VisualDirection = {
  anchors: { primary: string; primaryReason: string; secondary: string; secondaryReason: string };
  embodiment: { silhouette: string; proportions: string; posture: string; gesture: string; gaze: string; expression: string };
  life: { clothing: string; materials: string; primaryTool: string; handling: string; personalObject: string; wear: string; repairs: string; stains: string; livedInTrace: string };
  power: { visibility: PowerVisibility; manifestation: string; carrier: string; intensity: string; cost: string; integrationWithAction: string; patronVisibility: boolean };
  scene: { environment: string; activeObstacle: string; subjectOfAction: string; spatialRelation: string; currentMoment: string; narrativeIntent: string; stakes: string };
  artDirection: { composition: string; camera: string; lighting: string; paletteRoles: string[]; focalOrder: string[]; detailBudget: string; negativeConstraints: string[] };
};

export type PromptPlan = {
  title: string;
  essentialFacts: string[];
  suppressedFacts: string[];
  targetWordCount: number;
  stylePreset: string;
};

export type PromptCritique = {
  dominantAnchorClear: boolean;
  anchorInterpretationVisible: boolean;
  classReadable: boolean;
  speciesReadable: boolean;
  professionOverweight: boolean;
  sceneClear: boolean;
  actionTimingClear: boolean;
  subjectRoleClear: boolean;
  obstacleRoleClear: boolean;
  conflictCarrierVisible: boolean;
  visualHierarchyCoherent: boolean;
  redundantDetails: string[];
  conflicts: string[];
  promptTooLiteral: boolean;
  promptTooAbstract: boolean;
  professionDominates: boolean;
  classStereotypeLeakage: boolean;
  unresolvedAlternatives: boolean;
  imageModelAmbiguity: boolean;
  observations: string[];
  compressionRatio: number;
};

export type PromptWriterInput = {
  semanticSeed: SemanticSeed;
  semanticDirectorPlan: SemanticDirectorPlan;
  situationGraph: SituationGraph;
  visualDirection: VisualDirection;
  hardConstraints: string[];
  targetWordCount: number;
  stylePreset: string;
  forbiddenPatterns: string[];
  priorityPlan: PriorityPlan;
};

export type PromptWriterOutput = {
  promptPlan: PromptPlan;
  draftPrompt: string;
  critique: PromptCritique;
  finalPrompt: string;
  negativePrompt: string;
  removedDetails: string[];
  priorityCompliance: string[];
  warnings: string[];
};

export type PromptWriterAdapter = {
  mode: PromptWriterMode;
  plan(input: PromptWriterInput): PromptPlan;
  draft(input: PromptWriterInput, plan: PromptPlan): string;
  critique(input: PromptWriterInput, draftPrompt: string): PromptCritique;
  rewrite(input: PromptWriterInput, draftPrompt: string, critique: PromptCritique): PromptWriterOutput;
};

export type PromptWriterResult = {
  promptPlan: PromptPlan;
  draftPrompt: string;
  critique: PromptCritique;
  finalPrompt: string;
  writerMode?: PromptWriterMode;
  negativePrompt?: string;
  warnings?: string[];
  removedDetails: string[];
  priorityCompliance: string[];
};

export type LlmPromptWriterContract = {
  input: { semanticSeed: SemanticSeed; semanticDirectorPlan: SemanticDirectorPlan; visualDirection: VisualDirection; hardConstraints: string[]; targetWordCount: number; stylePreset: string };
  expectedResponse: { draftPrompt: string; critique: PromptCritique; finalPrompt: string; negativePrompt: string; removedDetails: string[] };
};

export type CompiledPrompt = {
  prompt: string;
  negativePrompt: string;
  wordCount: number;
  lintWarnings: string[];
  compilerTrace: string[];
  promptWriter?: PromptWriterResult;
};

export type ImageReviewFields = {
  silhouette_readable: boolean | null;
  profession_visible: boolean | null;
  class_evidence_visible: boolean | null;
  action_visible: boolean | null;
  gaze_target_visible: boolean | null;
  tool_unique: boolean | null;
  power_visibility_correct: boolean | null;
  patron_leak: boolean | null;
  prop_clutter: boolean | null;
  stereotype_leak: boolean | null;
  composition_matches: boolean | null;
  overall_coherence: boolean | null;
};

export type VNextQaReport = {
  passed: boolean;
  flags: string[];
  blockingErrors: string[];
  metrics: Record<string, number>;
  imageReview: ImageReviewFields;
};

export type VNextResult = {
  semanticSeed: SemanticSeed;
  situationGraph: SituationGraph;
  semanticDirectorPlan: SemanticDirectorPlan;
  visualDirection: VisualDirection;
  prompt: string;
  negativePrompt: string;
  compiledPrompt: CompiledPrompt;
  qa: VNextQaReport;
  trace: string[];
  schemaVersion: string;
};

export type VNextSessionHistory = {
  lastProfessions?: string[];
  lastProfessionSalience?: ProfessionSalience[];
  lastSceneArchetypes?: string[];
  lastEnvironments?: string[];
  lastDominantAnchors?: SemanticAnchor[];
  lastCompositions?: string[];
  lastAnchorInterpretations?: string[];
  lastSceneStrategies?: SceneStrategy[];
  lastConflictCarriers?: ConflictCarrier[];
  lastTools?: string[];
};
