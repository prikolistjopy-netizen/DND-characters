import type { CompiledPrompt, SemanticSeed, VisualDirection } from './contracts';

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function label(value: string) {
  return value.replace(/[_-]+/g, ' ');
}

function lintPrompt(prompt: string, negativePrompt: string) {
  const warnings: string[] = [];
  if (/blue or violet|red or gold|staff or sword/i.test(prompt)) warnings.push('unresolved alternative');
  const words = prompt.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  const ignored = new Set(['and', 'the', 'of', 'to', 'a', 'as', 'with', 'in', 'or', 'is', 'on', 'while', 'through', 'for', 'by', 'from']);
  const phrases = new Set<string>();
  for (let index = 0; index <= words.length - 4; index += 1) {
    const chunk = words.slice(index, index + 4);
    if (chunk.some((word) => ignored.has(word))) continue;
    const phrase = chunk.join(' ');
    if (phrases.has(phrase)) {
      warnings.push('duplicated phrase risk');
      break;
    }
    phrases.add(phrase);
  }
  if (/\band and\b/i.test(prompt)) warnings.push('malformed duplicate conjunction');
  if ((prompt.match(/\bwhile\b/gi) || []).length > 3) warnings.push('too many while clauses');
  if ((prompt.match(/\b(controlled|restrained|practical|readable)\b/gi) || []).length > 6) warnings.push('abstract modifier repetition');
  if (/shows tension|visual tension|meaningful tension/i.test(prompt)) warnings.push('abstract tension without carrier');
  if (/id:|schemaVersion|deterministicSeed|class\.|profession\.|species\./i.test(prompt)) warnings.push('internal id leakage');
  if (/visible demon|towering patron|patron in the sky/i.test(prompt) && !/visible patron unless explicitly selected/i.test(negativePrompt)) warnings.push('patron visibility leak');
  return warnings;
}

export function compilePrompt(seed: SemanticSeed, visual: VisualDirection, maxWords = 320): CompiledPrompt {
  const parts = [
    `Cinematic painted fantasy character concept, full-body ${label(seed.identity.speciesId)} ${label(seed.identity.classId)} whose working life as a ${seed.identity.profession} shapes the scene.`,
    `${visual.embodiment.proportions}; silhouette reads as ${visual.embodiment.silhouette}.`,
    `Body logic: ${visual.embodiment.posture}. The hands make the action specific: ${visual.embodiment.gesture}.`,
    `Current moment: ${visual.scene.currentMoment}. The scene matters because ${visual.scene.stakes}.`,
    `The obstacle is ${visual.scene.activeObstacle}; attention stays on ${visual.scene.subjectOfAction} while ${seed.currentMoment.hiddenPressure}.`,
    `Expression and gaze: ${visual.embodiment.expression}; ${visual.embodiment.gaze}.`,
    `Clothing and materials: ${visual.life.clothing}, ${visual.life.materials}.`,
    `One primary tool: ${visual.life.primaryTool}, kept as the main working focus.`,
    `Lived-in trace: ${visual.life.livedInTrace}; repairs and stains stay localized and functional.`,
    `Contradiction made physical: ${seed.tension.roleContradiction}; ${seed.currentMoment.visualConsequence}.`,
    `Power manifestation: ${visual.power.manifestation}; it stays subordinate to face, tool, and action.`,
    `Environment: ${visual.scene.environment}, secondary to the character, tool, and action.`,
    `Lighting and palette: ${visual.artDirection.lighting}; ${visual.artDirection.paletteRoles.join('; ')}.`,
    `Composition: ${visual.artDirection.composition}; ${visual.artDirection.camera}.`,
    `Clean readable silhouette, controlled detail, smooth painterly material planes, low surface noise.`,
  ];
  let usedParts = [...parts];
  let prompt = usedParts.join(' ');
  while (countWords(prompt) > maxWords && usedParts.length > 9) {
    usedParts.splice(-2, 1);
    prompt = usedParts.join(' ');
  }
  const negativePrompt = 'No text, logos, duplicate props, belt clutter, noisy microdetail, tiled/checker/rhombus artifacts, all-over surface noise, generic heroic stance, class-color stereotype, visible patron unless explicitly selected. Keep environment secondary.';
  return {
    prompt,
    negativePrompt,
    wordCount: countWords(prompt),
    lintWarnings: lintPrompt(prompt, negativePrompt),
    compilerTrace: ['compiled from VisualDirection only', `wordCount:${countWords(prompt)}`],
  };
}
