export type PromptStylePresetId =
  | 'cinematic_painted_fantasy'
  | 'painted_character_study_clean'
  | 'clean_concept_art'
  | 'legacy_heroic_rpg'
  | 'heroic_dnd_concept_art'
  | 'realistic_dark_fantasy'
  | 'wuxia_inspired_high_fantasy'
  | 'painterly_rpg_splash'
  | 'grounded_character_sheet';

export const defaultPromptStylePreset: PromptStylePresetId = 'cinematic_painted_fantasy';

export const promptStylePresetIds: PromptStylePresetId[] = [
  'cinematic_painted_fantasy',
  'painted_character_study_clean',
  'clean_concept_art',
  'legacy_heroic_rpg',
  'heroic_dnd_concept_art',
  'realistic_dark_fantasy',
  'wuxia_inspired_high_fantasy',
  'painterly_rpg_splash',
  'grounded_character_sheet',
];
