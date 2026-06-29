import type { CompiledPrompt, SemanticSeed, VisualDirection } from './contracts';

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function lintPrompt(prompt: string, negativePrompt: string) {
  const warnings: string[] = [];
  if (/\bor\b/.test(prompt) && /blue or violet|red or gold|staff or sword/i.test(prompt)) warnings.push('unresolved alternative');
  if (/\b(\w+\s+\w+\s+\w+)\b[\s\S]*\b\1\b/i.test(prompt)) warnings.push('duplicated three-word phrase risk');
  if (/\band and\b/i.test(prompt)) warnings.push('malformed duplicate conjunction');
  if (/id:|schemaVersion|deterministicSeed/i.test(prompt)) warnings.push('internal id leakage');
  if (/visible demon|towering patron/i.test(prompt) && !/visible patron allowed/i.test(negativePrompt)) warnings.push('patron visibility leak');
  return warnings;
}

export function compilePrompt(seed: SemanticSeed, visual: VisualDirection, maxWords = 320): CompiledPrompt {
  const parts = [
    `Cinematic painted fantasy character concept, full-body ${seed.identity.speciesId} ${seed.identity.classId} working as a ${seed.identity.profession}.`,
    `${visual.embodiment.proportions}; silhouette reads as ${visual.embodiment.silhouette}.`,
    `Posture: ${visual.embodiment.posture}. Gesture: ${visual.embodiment.gesture}.`,
    `Current action: ${visual.scene.currentMoment}, opposed by ${visual.scene.activeObstacle}, with attention on ${visual.scene.subjectOfAction}.`,
    `Expression and gaze: ${visual.embodiment.expression}; ${visual.embodiment.gaze}.`,
    `Clothing and materials: ${visual.life.clothing}, ${visual.life.materials}.`,
    `One primary tool: ${visual.life.primaryTool}, handled through ${visual.life.handling}.`,
    `Lived-in trace: ${visual.life.livedInTrace}; repairs and stains stay localized and functional.`,
    `Power manifestation: ${visual.power.manifestation}, carrier ${visual.power.carrier}, intensity ${visual.power.intensity}; ${visual.power.integrationWithAction}.`,
    `Environment: ${visual.scene.environment}, secondary to the character and action.`,
    `Lighting and palette: ${visual.artDirection.lighting}; palette roles are ${visual.artDirection.paletteRoles.join(', ')}.`,
    `Composition: ${visual.artDirection.composition}; ${visual.artDirection.camera}; focal order ${visual.artDirection.focalOrder.join(' > ')}.`,
    `Clean readable silhouette, controlled detail, smooth painterly material planes, low surface noise.`,
  ];
  let prompt = parts.join(' ');
  if (countWords(prompt) > maxWords) prompt = parts.slice(0, -2).join(' ');
  const negativePrompt = `No text, logos, duplicate props, belt clutter, noisy microdetail, tiled/checker/rhombus artifacts, all-over surface noise, generic heroic stance, class-color stereotype, visible patron unless explicitly selected. Keep environment secondary.`;
  return {
    prompt,
    negativePrompt,
    wordCount: countWords(prompt),
    lintWarnings: lintPrompt(prompt, negativePrompt),
    compilerTrace: ['compiled from VisualDirection only', `wordCount:${countWords(prompt)}`],
  };
}
