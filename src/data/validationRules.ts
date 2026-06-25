import type { EquipmentEffectIntensity, SizeCategory } from './seedData';

export const validSizeCategories: SizeCategory[] = ['tiny', 'small', 'medium', 'large'];

export const validEquipmentEffectIntensities: EquipmentEffectIntensity[] = ['none', 'subtle', 'strong', 'legendary'];

export const forbiddenImagePromptPhrases = ['no text in image', 'text in image', 'no text'] as const;

export const futureContentPackShape = [
  'id',
  'label',
  'targetVisualTheme',
  'themeVariants',
  'silhouettes',
  'armor',
  'weapons',
  'details',
  'sceneProps',
  'antiRepeatNotes',
  'compatibilityAliases',
] as const;
