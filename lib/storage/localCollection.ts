import type { DicebornGenerationResult } from '@/lib/generator';

export const LOCAL_COLLECTION_KEY = 'diceborn.localCollection.v1';

export type LocalCollectionRecord = Pick<DicebornGenerationResult, 'id' | 'version' | 'generatedAt' | 'character' | 'imagePrompt'>;
