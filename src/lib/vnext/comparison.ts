import type { VNextResult } from './contracts';
import { generateDicebornVNext } from './generateVNext';

export type LegacyVNextComparison = {
  id: string;
  legacyPrompt: string;
  vnext: VNextResult;
  scoreSummary: string;
};

export const comparisonInputs = [
  { id: 'warlock-physician', rngSeed: 'vnext-warlock-physician', classId: 'warlock', speciesId: 'human', professionId: 'physician' },
  { id: 'warlock-locksmith', rngSeed: 'vnext-warlock-locksmith', classId: 'warlock', speciesId: 'tiefling', professionId: 'locksmith' },
  { id: 'fighter-ferryman', rngSeed: 'vnext-fighter-ferryman', classId: 'fighter', speciesId: 'dwarf', professionId: 'ferryman' },
  { id: 'fighter-investigator', rngSeed: 'vnext-fighter-investigator', classId: 'fighter', speciesId: 'human', professionId: 'investigator' },
  { id: 'cleric-undertaker', rngSeed: 'vnext-cleric-undertaker', classId: 'cleric', speciesId: 'dwarf', professionId: 'undertaker' },
  { id: 'cleric-tutor', rngSeed: 'vnext-cleric-tutor', classId: 'cleric', speciesId: 'tiefling', professionId: 'tutor' },
] as const;

function legacyPrompt(result: VNextResult) {
  const seed = result.semanticSeed;
  return `Legacy-style baseline: full-body ${seed.identity.speciesId} ${seed.identity.classId}, ${seed.identity.profession}, cinematic fantasy style. Shows ${result.visualDirection.life.primaryTool}, ${result.visualDirection.embodiment.posture}, ${result.visualDirection.scene.environment}, readable silhouette, controlled detail, uncluttered background.`;
}

export function getLegacyVNextComparisons(): LegacyVNextComparison[] {
  return comparisonInputs.map((input) => {
    const vnext = generateDicebornVNext(input);
    return {
      id: input.id,
      legacyPrompt: legacyPrompt(vnext),
      vnext,
      scoreSummary: `QA ${vnext.qa.passed ? 'passed' : 'failed'}; prompt ${vnext.compiledPrompt.wordCount} words; ${vnext.situationGraph.nodes.length} graph nodes; ${vnext.situationGraph.edges.length} graph edges.`,
    };
  });
}
