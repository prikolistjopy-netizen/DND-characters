export type PromptStylePresetId =
  | 'heroic_dnd_concept_art'
  | 'realistic_dark_fantasy'
  | 'wuxia_inspired_high_fantasy'
  | 'painterly_rpg_splash'
  | 'grounded_character_sheet';

export const defaultPromptStylePreset: PromptStylePresetId = 'heroic_dnd_concept_art';

export const promptStylePresetIds: PromptStylePresetId[] = [
  'heroic_dnd_concept_art',
  'realistic_dark_fantasy',
  'wuxia_inspired_high_fantasy',
  'painterly_rpg_splash',
  'grounded_character_sheet',
];
