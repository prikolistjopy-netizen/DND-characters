import { generateCharacterSeed, type DicebornGenerationResult } from '../generator';
import { generateDicebornVNext } from './generateVNext';
import type { DicebornGenerationResultVNext } from './contracts';
import { compilePromptVNext } from './promptCompiler';
import { resolveVisualDirectionVNext } from './visualDirector';

export type ComparisonClass = 'warlock' | 'fighter' | 'cleric';

export type LegacyVNextComparisonCase = {
  id: string;
  label: string;
  className: ComparisonClass;
  legacy: DicebornGenerationResult;
  vnext: DicebornGenerationResultVNext;
  promptDiagnostics: ReturnType<typeof compilePromptVNext>['lint'] & {
    wordCount: number;
    negativePrompt: string;
  };
  assessment: {
    semanticCompleteness: number;
    visualCompleteness: number;
    promptReadiness: number;
    notes: string[];
  };
};

export type LegacyVNextComparisonReport = {
  generatedAt: string;
  cases: LegacyVNextComparisonCase[];
  summary: {
    caseCount: number;
    averageSemanticCompleteness: number;
    averageVisualCompleteness: number;
    averagePromptReadiness: number;
    blockers: string[];
  };
};

const classMap: Record<ComparisonClass, `class.${ComparisonClass}`> = {
  warlock: 'class.warlock',
  fighter: 'class.fighter',
  cleric: 'class.cleric',
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function assessCase(vnext: DicebornGenerationResultVNext, diagnostics: LegacyVNextComparisonCase['promptDiagnostics']) {
  const seed = vnext.semanticSeed;
  const visual = vnext.visualDirection;
  const notes: string[] = [];

  const semanticRequired = [
    seed.identity.species,
    seed.identity.class,
    seed.identity.profession,
    seed.identity.ageBand,
    seed.psychology.desire,
    seed.psychology.fear,
    seed.psychology.belief,
    seed.psychology.contradiction,
    seed.social.status,
    seed.social.obligation,
    seed.power.source,
    seed.power.relationship,
    seed.power.control,
    seed.power.visibility,
    seed.materialLife.economicCondition,
    seed.materialLife.toolFamiliarity,
    seed.currentMoment.goal,
    seed.currentMoment.obstacle,
    seed.currentMoment.action,
    seed.currentMoment.pressure,
  ];
  const semanticCompleteness = semanticRequired.filter(Boolean).length / semanticRequired.length;

  const visualRequired = visual ? [
    visual.readability.silhouetteFamily,
    visual.readability.proportionBias,
    visual.embodiment.posture,
    visual.embodiment.gesture,
    visual.embodiment.gaze,
    visual.embodiment.expression,
    visual.life.clothingLogic,
    visual.life.materials.length ? 'materials' : '',
    visual.life.primaryTool,
    visual.life.wearTrace,
    visual.scene.environment,
    visual.scene.spatialRelation,
    visual.artDirection.composition,
    visual.artDirection.camera,
    visual.artDirection.light,
    visual.artDirection.paletteRoles.length ? 'palette' : '',
  ] : [];
  const visualCompleteness = visualRequired.length ? visualRequired.filter(Boolean).length / visualRequired.length : 0;

  if (seed.qaFlags.length) notes.push(`QA flags: ${seed.qaFlags.join(', ')}`);
  if (diagnostics.grammarWarnings.length) notes.push(`Grammar warnings: ${diagnostics.grammarWarnings.join(', ')}`);
  if (diagnostics.unresolvedAlternatives.length) notes.push(`Unresolved alternatives: ${diagnostics.unresolvedAlternatives.join(', ')}`);
  if (diagnostics.duplicatePhrases.length > 4) notes.push(`Repeated phrase pressure: ${diagnostics.duplicatePhrases.slice(0, 4).join(', ')}`);
  if (diagnostics.wordCount > 280) notes.push(`Prompt exceeds target length: ${diagnostics.wordCount} words`);
  if (!notes.length) notes.push('Ready for visual review.');

  const promptPenalty =
    diagnostics.grammarWarnings.length * 35 +
    diagnostics.unresolvedAlternatives.length * 30 +
    diagnostics.duplicatePhrases.length * 3 +
    (diagnostics.wordCount > 280 ? 25 : 0);

  return {
    semanticCompleteness: clampScore(semanticCompleteness * 100),
    visualCompleteness: clampScore(visualCompleteness * 100),
    promptReadiness: clampScore(100 - promptPenalty),
    notes,
  };
}

function buildCase(className: ComparisonClass, index: number): LegacyVNextComparisonCase {
  const rngSeed = `review-${className}-${index}`;
  const legacy = generateCharacterSeed({
    useSmartPool: true,
    diversityMode: 'soft',
    compositionMode: 'full_body_character_art',
    environmentDetailLevel: 'balanced',
    manualControls: {
      class: className,
      race: 'random',
      genderPresentation: 'random',
      ageBand: 'random',
      stylePreset: 'random',
      generationProfile: 'balanced_gallery',
      promptCompilerMode: 'artist_brief_prompt',
      allowRare: true,
      allowChaos: false,
    },
  }).dicebornResult;

  const vnext = generateDicebornVNext({
    rngSeed,
    classId: classMap[className],
    novelty: index % 2 === 0 ? 'balanced' : 'high',
    beamWidth: 18,
    branchFactor: 5,
    legacyResultId: legacy.id,
    prompt: { maxWords: 280 },
  });

  const visual = vnext.visualDirection ?? resolveVisualDirectionVNext(vnext.semanticSeed);
  const compiled = compilePromptVNext(vnext.semanticSeed, visual, { maxWords: 280 });
  const promptDiagnostics = {
    ...compiled.lint,
    wordCount: compiled.wordCount,
    negativePrompt: compiled.negativePrompt,
  };

  return {
    id: rngSeed,
    label: `${className} comparison ${index + 1}`,
    className,
    legacy,
    vnext: { ...vnext, visualDirection: visual, surfacePrompt: `${compiled.prompt} ${compiled.negativePrompt}`.trim() },
    promptDiagnostics,
    assessment: assessCase(vnext, promptDiagnostics),
  };
}

export function buildLegacyVNextComparisonReport(): LegacyVNextComparisonReport {
  const cases = ([
    ['warlock', 0],
    ['fighter', 1],
    ['cleric', 2],
    ['warlock', 3],
    ['fighter', 4],
    ['cleric', 5],
  ] as const).map(([className, index]) => buildCase(className, index));

  const averages = cases.reduce((acc, item) => {
    acc.semantic += item.assessment.semanticCompleteness;
    acc.visual += item.assessment.visualCompleteness;
    acc.prompt += item.assessment.promptReadiness;
    return acc;
  }, { semantic: 0, visual: 0, prompt: 0 });

  const blockers = cases.flatMap((item) => item.assessment.notes.filter((note) => !/^Ready/.test(note)));

  return {
    generatedAt: new Date().toISOString(),
    cases,
    summary: {
      caseCount: cases.length,
      averageSemanticCompleteness: clampScore(averages.semantic / cases.length),
      averageVisualCompleteness: clampScore(averages.visual / cases.length),
      averagePromptReadiness: clampScore(averages.prompt / cases.length),
      blockers,
    },
  };
}
