export type GeneratorVersion = 'legacy' | 'semantic-vnext';

export type FactDomain =
  | 'species'
  | 'class'
  | 'profession'
  | 'culture'
  | 'psychology'
  | 'social'
  | 'power'
  | 'material-life'
  | 'current-moment'
  | 'visual';

export type FactRef = {
  id: string;
  domain: FactDomain;
  label: string;
};

export type ConstraintKind = 'requires' | 'excludes' | 'conflicts';
export type InfluenceKind = 'prefers' | 'discourages' | 'implies' | 'transforms';

export type LibraryFact = {
  id: string;
  domain: FactDomain;
  label: string;
  tags: string[];
  description?: string;
  baseWeight: number;
  rarity?: number;
  stereotypeRisk?: number;
  repetitionGroup?: string;
  narrativeAffordances?: string[];
  visualAffordances?: string[];
  provenance?: {
    source?: string;
    author?: string;
    license?: string;
    reviewedAt?: string;
    confidence?: 'low' | 'medium' | 'high';
  };
  version: number;
};

export type ConstraintRule = {
  id: string;
  kind: ConstraintKind;
  when: string[];
  targets: string[];
  reason: string;
  version: number;
};

export type InfluenceRule = {
  id: string;
  kind: InfluenceKind;
  when: string[];
  targets: string[];
  weight: number;
  reason: string;
  version: number;
};

export type SemanticSeedVNext = {
  id: string;
  rngSeed: string;
  identity: {
    species: FactRef;
    class: FactRef;
    profession: FactRef;
    culture?: FactRef;
    ageBand: FactRef;
    presentation?: FactRef;
  };
  psychology: {
    desire: FactRef;
    fear: FactRef;
    belief: FactRef;
    contradiction: FactRef;
    copingStrategy?: FactRef;
  };
  social: {
    status: FactRef;
    obligation: FactRef;
    communityRole?: FactRef;
    reputation?: FactRef;
    keyRelationship?: FactRef;
  };
  power: {
    source: FactRef;
    relationship: FactRef;
    control: FactRef;
    visibility: FactRef;
    cost?: FactRef;
    limitation?: FactRef;
  };
  materialLife: {
    economicCondition: FactRef;
    toolFamiliarity: FactRef;
    personalObject?: FactRef;
  };
  currentMoment: {
    goal: FactRef;
    obstacle: FactRef;
    action: FactRef;
    pressure: FactRef;
    recentEvent?: FactRef;
    hiddenInformation?: FactRef;
  };
  trace: GenerationTrace;
  scores: SemanticScores;
  qaFlags: string[];
};

export type SemanticScores = {
  coherence: number;
  classReadability: number;
  speciesReadability: number;
  professionIntegration: number;
  contradictionQuality: number;
  narrativePotential: number;
  novelty: number;
  stereotypePenalty: number;
  repetitionPenalty: number;
  conflictPenalty: number;
  userPreferenceMatch: number;
  total: number;
};

export type GenerationTraceEntry = {
  stage: string;
  decision: string;
  selectedFactIds: string[];
  rejectedFactIds?: string[];
  scoreDelta?: number;
  reasons: string[];
};

export type GenerationTrace = {
  version: number;
  entries: GenerationTraceEntry[];
};

export type PowerVisibility =
  | 'none'
  | 'latent'
  | 'behavioral'
  | 'bodily'
  | 'object-based'
  | 'reflected'
  | 'shadow-based'
  | 'environmental'
  | 'symbolic'
  | 'relational'
  | 'social'
  | 'partial-apparition'
  | 'full-apparition';

export type VisualDirection = {
  sourceSeedId: string;
  readability: {
    primaryAnchors: string[];
    silhouetteFamily: string;
    proportionBias: string;
  };
  embodiment: {
    posture: string;
    lineOfAction: string;
    gesture: string;
    gaze: string;
    expression: string;
  };
  life: {
    clothingLogic: string;
    materials: string[];
    primaryTool: string;
    personalObject?: string;
    wearTrace: string;
  };
  power: {
    visibility: PowerVisibility;
    control: string;
    manifestation?: string;
    costSignal?: string;
  };
  scene: {
    family: string;
    environment: string;
    spatialRelation: string;
    secondaryObjects: string[];
  };
  artDirection: {
    composition: string;
    camera: string;
    light: string;
    paletteRoles: string[];
    focalOrder: string[];
    detailBudget: {
      face: number;
      hands: number;
      primaryTool: number;
      costumeZone: number;
      narrativeObject: number;
      powerManifestation: number;
    };
  };
  negativeConstraints: string[];
  decisionTrace: GenerationTraceEntry[];
};

export type DicebornGenerationResultVNext = {
  schemaVersion: 'diceborn-vnext-0.1';
  semanticSeed: SemanticSeedVNext;
  visualDirection?: VisualDirection;
  surfacePrompt?: string;
  legacyResultId?: string;
};
