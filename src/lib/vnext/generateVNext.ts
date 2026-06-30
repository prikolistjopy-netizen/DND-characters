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
  if (!result.semanticSeed.tension.roleContradiction) blockingErrors.push('role contradiction missing');
  if (!result.semanticSeed.currentMoment.narrativeIntent) blockingErrors.push('narrative intent missing');
  if (!result.semanticSeed.currentMoment.motionEnergy) blockingErrors.push('motion energy missing');
  if (!visual.embodiment.posture.includes(result.semanticSeed.life.bodyHabit)) blockingErrors.push('profession posture influence missing');
  if (!visual.embodiment.gesture.includes(result.semanticSeed.life.personalObject)) blockingErrors.push('profession tool influence missing');
  if (visual.power.patronVisibility && result.semanticSeed.power.visibility !== 'full_apparition') blockingErrors.push('patron visibility leak');
  if (prompt.wordCount > (result.semanticSeed.schemaVersion ? 320 : 250)) blockingErrors.push('prompt too long');
  const blockingLintWarnings = prompt.lintWarnings.filter((warning) => warning !== 'duplicated phrase risk');
  if (blockingLintWarnings.length) blockingErrors.push(...blockingLintWarnings);
  if (/white-gold cleric|purple warlock|red tiefling/i.test(result.prompt)) blockingErrors.push('class-color stereotype phrase');

  return {
    passed: blockingErrors.length === 0,
    flags,
    blockingErrors,
    metrics: {
      promptWordCount: prompt.wordCount,
      graphNodes: result.situationGraph.nodes.length,
      graphEdges: result.situationGraph.edges.length,
      tensionFields: Object.values(result.semanticSeed.tension).filter(Boolean).length,
      currentMomentFields: Object.values(result.semanticSeed.currentMoment).filter(Boolean).length,
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
