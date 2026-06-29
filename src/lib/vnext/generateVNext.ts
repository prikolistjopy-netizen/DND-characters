import type { DicebornGenerationResultVNext } from './contracts';
import { generateIncrementalSemanticSeedVNext, type IncrementalResolverOptions } from './incrementalResolver';
import { compilePromptVNext, type PromptCompilerOptions } from './promptCompiler';
import { resolveVisualDirectionVNext } from './visualDirector';

export type GenerateVNextOptions = IncrementalResolverOptions & {
  prompt?: PromptCompilerOptions;
  legacyResultId?: string;
};

export function generateDicebornVNext(options: GenerateVNextOptions): DicebornGenerationResultVNext {
  const semanticSeed = generateIncrementalSemanticSeedVNext(options);
  const visualDirection = resolveVisualDirectionVNext(semanticSeed);
  const compiled = compilePromptVNext(semanticSeed, visualDirection, options.prompt);

  return {
    schemaVersion: 'diceborn-vnext-0.1',
    semanticSeed,
    visualDirection,
    surfacePrompt: `${compiled.prompt} ${compiled.negativePrompt}`.trim(),
    legacyResultId: options.legacyResultId,
  };
}
