export type PilotClassId = 'fighter' | 'cleric' | 'warlock';
export type PilotSpeciesId = 'human' | 'dwarf' | 'tiefling';
export type PowerVisibility = 'none' | 'latent' | 'behavioral' | 'bodily' | 'object' | 'reflected' | 'shadow' | 'environmental' | 'symbolic' | 'relational' | 'social' | 'partial' | 'full_apparition';
export type AgeBand = 'young_adult' | 'adult' | 'middle_aged' | 'elder';
export type GenderPresentation = 'masculine' | 'feminine' | 'androgynous';
export type NoveltyMode = 'off' | 'soft' | 'strong';

export type VNextInput = {
  rngSeed: string | number;
  classId?: PilotClassId;
  speciesId?: PilotSpeciesId;
  professionId?: string;
  locks?: Partial<Pick<SemanticSeed['identity'], 'classId' | 'speciesId' | 'professionId' | 'ageBand' | 'genderPresentation'>> & Partial<Pick<SemanticSeed['power'], 'visibility'>>;
  preferences?: string[];
  noveltyMode?: NoveltyMode;
  beamWidth?: number;
  promptOptions?: { maxWords?: number };
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
  };
  currentMoment: {
    currentAction: string;
    goal: string;
    obstacle: string;
    risk: string;
    pressure: string;
    targetOfAttention: string;
    urgency: string;
    consequenceOfFailure: string;
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
  };
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
  scene: { environment: string; activeObstacle: string; subjectOfAction: string; spatialRelation: string; currentMoment: string };
  artDirection: { composition: string; camera: string; lighting: string; paletteRoles: string[]; focalOrder: string[]; detailBudget: string; negativeConstraints: string[] };
};

export type CompiledPrompt = {
  prompt: string;
  negativePrompt: string;
  wordCount: number;
  lintWarnings: string[];
  compilerTrace: string[];
};

export type VNextQaReport = {
  passed: boolean;
  flags: string[];
  blockingErrors: string[];
  metrics: Record<string, number>;
};

export type VNextResult = {
  semanticSeed: SemanticSeed;
  situationGraph: SituationGraph;
  visualDirection: VisualDirection;
  prompt: string;
  negativePrompt: string;
  compiledPrompt: CompiledPrompt;
  qa: VNextQaReport;
  trace: string[];
  schemaVersion: string;
};
