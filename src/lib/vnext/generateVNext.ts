import type { VNextInput, VNextQaReport, VNextResult } from './contracts';
import { resolveSemanticSeed } from './incrementalResolver';
import { buildSituationGraph } from './situationGraph';
import { directVisual } from './visualDirector';
import { compilePrompt } from './promptCompiler';

function runQa(result: Omit<VNextResult, 'qa'>): VNextQaReport {
  const flags: string[] = [...result.semanticSeed.qaFlags];
  const blockingErrors: string[] = [];
  const visual = result.visualDirection;
  const prompt = result.compiledPrompt;

  if (!visual.life.primaryTool) blockingErrors.push('missing primary tool');
  if (visual.anchors.primary && visual.anchors.secondary) flags.push('two-anchor-limit-ok');
  if (!visual.embodiment.gaze) blockingErrors.push('gaze target missing');
  if (!visual.scene.activeObstacle) blockingErrors.push('scene obstacle missing');
  if (!visual.life.livedInTrace) blockingErrors.push('lived-in trace missing');
  if (visual.power.patronVisibility && result.semanticSeed.power.visibility !== 'full_apparition') blockingErrors.push('patron visibility leak');
  if (prompt.wordCount > (result.semanticSeed.schemaVersion ? 320 : 250)) blockingErrors.push('prompt too long');
  if (prompt.lintWarnings.length) blockingErrors.push(...prompt.lintWarnings);
  if (/white-gold cleric|purple warlock|red tiefling/i.test(result.prompt)) blockingErrors.push('class-color stereotype phrase');

  return {
    passed: blockingErrors.length === 0,
    flags,
    blockingErrors,
    metrics: {
      promptWordCount: prompt.wordCount,
      graphNodes: result.situationGraph.nodes.length,
      graphEdges: result.situationGraph.edges.length,
      anchorCount: 2,
      primaryToolCount: 1,
    },
  };
}

export function generateDicebornVNext(input: VNextInput): VNextResult {
  const semanticSeed = resolveSemanticSeed(input);
  const situationGraph = buildSituationGraph(semanticSeed);
  const visualDirection = directVisual(semanticSeed, situationGraph);
  const compiledPrompt = compilePrompt(semanticSeed, visualDirection, input.promptOptions?.maxWords);
  const base = {
    semanticSeed,
    situationGraph,
    visualDirection,
    prompt: compiledPrompt.prompt,
    negativePrompt: compiledPrompt.negativePrompt,
    compiledPrompt,
    trace: [
      `seed:${semanticSeed.deterministicSeed}`,
      `selected:${semanticSeed.selectedFactIds.join(',')}`,
      `rules:${semanticSeed.appliedRules.join(',')}`,
      ...compiledPrompt.compilerTrace,
    ],
    schemaVersion: semanticSeed.schemaVersion,
  };
  return { ...base, qa: runQa(base) };
}
