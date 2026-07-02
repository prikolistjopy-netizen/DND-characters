import type {
  ArchetypeOption,
  ArmorLanguage,
  ArmorOption,
  BuildTemplate,
  CharacterAppearanceProfile,
  CharacterClass,
  CuratedMulticlassProfile,
  EquipmentEnchantment,
  EquipmentFinish,
  FxOption,
  LightOption,
  MoodOption,
  NarrativeMotif,
  NarrativeVariant,
  PoseOption,
  RaceOption,
  SizeCategory,
  SilhouetteOption,
  SilhouetteProfile,
  VisualTheme,
  VisualThemeVariant,
  WeaponLanguage,
  WeaponOption,
} from '../data';

export type ModeAndClassStage = {
  stage: 'selectModeAndClass';
  mode: string;
  primaryClass: CharacterClass;
  classList: CharacterClass[];
  curatedMulticlassProfile: CuratedMulticlassProfile | null;
};

export type RaceAndAppearanceStage = {
  stage: 'selectRaceAndAppearance';
  race: RaceOption;
  size: SizeCategory;
  appearanceProfile: CharacterAppearanceProfile;
};

export type ArchetypeStage = { stage: 'selectArchetype'; archetype: ArchetypeOption; archetypeTags: string[] };

export type BuildTemplateStage = {
  stage: 'selectBuildTemplate';
  buildTemplate: BuildTemplate;
  buildTemplateSelectionReason: string;
};

export type VisualThemeStage = {
  stage: 'selectVisualTheme';
  visualTheme: VisualTheme;
  themeVariant: VisualThemeVariant;
  visualDetails: string[];
};

export type NarrativeMotifStage = {
  stage: 'selectNarrativeMotif';
  narrativeMotif: NarrativeMotif;
  narrativeVariant: NarrativeVariant;
  storyDetails: string[];
};

export type EquipmentAndPoseStage = {
  stage: 'selectEquipmentAndPose';
  silhouette: SilhouetteOption;
  silhouetteProfile: SilhouetteProfile;
  armor: ArmorOption;
  armorLanguage: ArmorLanguage;
  weaponTool: WeaponOption;
  weaponLanguage: WeaponLanguage;
  equipmentFinish: EquipmentFinish;
  equipmentEnchantment: EquipmentEnchantment;
  pose: PoseOption;
  emotion: string;
};

export type MoodLightFxStage = { stage: 'selectMoodLightFx'; mood: MoodOption; light: LightOption; fx: FxOption };

export type ValidateAndRepairSeedStage = {
  stage: 'validateAndRepairSeed';
  validationStatus: 'passed' | 'repaired' | 'fallback';
  rerollAttempts: number;
  fallbackUsed: boolean;
};

export type PromptComposerStage =
  | { stage: 'composePromptDraft'; promptDraft: string }
  | { stage: 'composeImagePrompt'; imagePrompt: string }
  | { stage: 'composeFullGenerationText'; fullGenerationText: string };

export type GenerationStageContract =
  | ModeAndClassStage
  | RaceAndAppearanceStage
  | ArchetypeStage
  | BuildTemplateStage
  | VisualThemeStage
  | NarrativeMotifStage
  | EquipmentAndPoseStage
  | MoodLightFxStage
  | ValidateAndRepairSeedStage
  | PromptComposerStage;

export const generationPipelineStages = [
  'selectModeAndClass',
  'selectRaceAndAppearance',
  'selectArchetype',
  'selectBuildTemplate',
  'selectVisualTheme',
  'selectNarrativeMotif',
  'selectEquipmentAndPose',
  'selectMoodLightFx',
  'validateAndRepairSeed',
  'composePromptDraft',
  'composeImagePrompt',
  'composeFullGenerationText',
] as const;
