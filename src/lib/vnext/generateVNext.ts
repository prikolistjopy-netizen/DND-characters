import type { ImageReviewFields, VNextInput, VNextQaReport, VNextResult, VNextSessionHistory } from './contracts';
import { resolveSemanticSeed } from './incrementalResolver';
import { buildSituationGraph } from './situationGraph';
import { directVisual } from './visualDirector';
import { directSemantic } from './semanticDirector';
import { compilePrompt } from './promptCompiler';

function emptyImageReview(): ImageReviewFields {
  return {
    silhouette_readable: null,
    profession_visible: null,
    class_evidence_visible: null,
    action_visible: null,
    gaze_target_visible: null,
    tool_unique: null,
    power_visibility_correct: null,
    patron_leak: null,
    prop_clutter: null,
    stereotype_leak: null,
    composition_matches: null,
    overall_coherence: null,
  };
}

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
  if (result.semanticDirectorPlan.classEvidencePlan.channels.length < 2) blockingErrors.push('class evidence under budget');
  if (!result.semanticDirectorPlan.speciesMorphologyPlan) blockingErrors.push('species morphology absent');
  if (result.semanticSeed.life.professionSalience !== 'dominant' && result.semanticSeed.priorityPlan.dominant === 'profession') blockingErrors.push('profession dominance leakage');
  if (result.semanticSeed.life.professionSalience === 'background' && result.semanticSeed.life.professionEvidenceChannels.length > 0) blockingErrors.push('background profession over budget');
  if (result.semanticSeed.life.professionEvidenceChannels.length > result.semanticDirectorPlan.professionBudget.maxVisualChannels) blockingErrors.push('profession controls more channels than salience allows');
  if (!result.semanticSeed.tension.roleContradiction) blockingErrors.push('role contradiction missing');
  if (!result.semanticSeed.currentMoment.narrativeIntent) blockingErrors.push('narrative intent missing');
  if (!result.semanticSeed.currentMoment.sceneArchetype) blockingErrors.push('scene archetype missing');
  if (!result.semanticSeed.currentMoment.visualConsequence) blockingErrors.push('visual consequence missing');
  if (!result.semanticSeed.currentMoment.motionEnergy) blockingErrors.push('motion energy missing');
  if (result.semanticSeed.life.professionSalience === 'dominant' && !visual.embodiment.posture.includes(result.semanticSeed.life.bodyHabit)) blockingErrors.push('dominant profession posture influence missing');
  if (result.semanticSeed.life.professionSalience === 'dominant' && !visual.embodiment.gesture.includes(result.semanticSeed.life.personalObject)) blockingErrors.push('dominant profession tool influence missing');
  if (visual.power.patronVisibility && result.semanticSeed.power.visibility !== 'full_apparition') blockingErrors.push('patron visibility leak');
  if (result.semanticSeed.power.visibility === 'latent' && /aura|halo|full apparition|floating rune/i.test(result.prompt)) blockingErrors.push('latent power leakage');
  if (prompt.wordCount > 270) blockingErrors.push('prompt too long');
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
      tensionFields: Object.values(result.semanticSeed.tension).filter(Boolean).length,
      currentMomentFields: Object.values(result.semanticSeed.currentMoment).filter(Boolean).length,
      anchorCount: 2,
      primaryToolCount: 1,
      sceneArchetypePresent: result.semanticSeed.currentMoment.sceneArchetype ? 1 : 0,
      classEvidenceChannels: result.semanticDirectorPlan.classEvidencePlan.channels.length,
      professionBudgetChannels: result.semanticDirectorPlan.professionBudget.maxVisualChannels,
    },
    imageReview: emptyImageReview(),
  };
}

export function generateDicebornVNextDeterministic(input: VNextInput): VNextResult {
  const semanticSeed = resolveSemanticSeed(input);
  const situationGraph = buildSituationGraph(semanticSeed);
  const semanticDirectorPlan = directSemantic(semanticSeed);
  const visualDirection = directVisual(semanticSeed, situationGraph, semanticDirectorPlan);
  const compiledPrompt = compilePrompt(semanticSeed, visualDirection, input.promptOptions?.maxWords, semanticDirectorPlan, input.promptOptions?.writerMode ?? 'local');
  const base = {
    semanticSeed,
    situationGraph,
    semanticDirectorPlan,
    visualDirection,
    prompt: compiledPrompt.prompt,
    negativePrompt: compiledPrompt.negativePrompt,
    compiledPrompt,
    trace: [
      `seed:${semanticSeed.deterministicSeed}`,
      `selected:${semanticSeed.selectedFactIds.join(',')}`,
      `rules:${semanticSeed.appliedRules.join(',')}`,
      `priority:${semanticDirectorPlan.dominantNarrativeAnchor}/${semanticDirectorPlan.anchorInterpretation}/${semanticDirectorPlan.sceneStrategy}/${semanticDirectorPlan.conflictCarrier}/${semanticDirectorPlan.supportingNarrativeAnchor}`,
      `profession:${semanticSeed.identity.professionId}:${semanticSeed.life.professionSalience}:${semanticSeed.life.professionAffinity}`,
      ...compiledPrompt.compilerTrace,
    ],
    schemaVersion: semanticSeed.schemaVersion,
  };
  return { ...base, qa: runQa(base) };
}

export function generateDicebornVNext(input: VNextInput): VNextResult {
  return generateDicebornVNextDeterministic(input);
}

export function generateDicebornVNextForSession(input: VNextInput, history: VNextSessionHistory = {}): VNextResult {
  const recentProfessions = new Set(history.lastProfessions?.slice(-8) ?? []);
  const recentSceneArchetypes = new Set(history.lastSceneArchetypes?.slice(-5) ?? []);
  const recentEnvironments = new Set(history.lastEnvironments?.slice(-4) ?? []);
  const recentCompositions = new Set(history.lastCompositions?.slice(-4) ?? []);
  const baseSeed = String(input.rngSeed);
  let best: VNextResult | null = null;
  let bestPenalty = Infinity;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const candidate = generateDicebornVNextDeterministic({ ...input, rngSeed: attempt === 0 ? baseSeed : `${baseSeed}:session:${attempt}` });
    const lockedProfession = input.professionId ?? input.locks?.professionId;
    let penalty = 0;
    if (!lockedProfession && recentProfessions.has(candidate.semanticSeed.identity.professionId)) penalty += 100;
    if (candidate.semanticSeed.life.professionSalience === 'dominant' && history.lastProfessionSalience?.slice(-12).includes('dominant')) penalty += 60;
    if (recentSceneArchetypes.has(candidate.semanticSeed.currentMoment.sceneArchetype)) penalty += 20;
    if (recentEnvironments.has(candidate.visualDirection.scene.environment)) penalty += 12;
    if (recentCompositions.has(candidate.visualDirection.artDirection.composition)) penalty += 12;
    if (history.lastAnchorInterpretations?.slice(-6).includes(candidate.semanticDirectorPlan.anchorInterpretation)) penalty += 10;
    if (history.lastSceneStrategies?.slice(-6).includes(candidate.semanticDirectorPlan.sceneStrategy)) penalty += 10;
    if (history.lastConflictCarriers?.slice(-6).includes(candidate.semanticDirectorPlan.conflictCarrier)) penalty += 8;
    if (history.lastDominantAnchors?.slice(-2).every((anchor) => anchor === candidate.semanticDirectorPlan.dominantNarrativeAnchor)) penalty += 10;
    if (penalty < bestPenalty) {
      best = candidate;
      bestPenalty = penalty;
    }
    if (penalty === 0) return candidate;
  }
  return best ?? generateDicebornVNextDeterministic(input);
}
