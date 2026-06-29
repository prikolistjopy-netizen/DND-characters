import type { SemanticSeedVNext, VisualDirection } from './contracts';

export type PromptCompilerOptions = {
  style?: 'cinematic-painted-fantasy' | 'painted-character-study' | 'clean-concept-art';
  maxWords?: number;
};

export type CompiledPromptVNext = {
  prompt: string;
  negativePrompt: string;
  wordCount: number;
  lint: {
    duplicatePhrases: string[];
    unresolvedAlternatives: string[];
    grammarWarnings: string[];
    excessiveLength: boolean;
  };
};

function sentence(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function dedupe<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function joinNatural(items: string[]): string {
  const values = items.filter(Boolean);
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`;
}

function normalizeSubject(seed: SemanticSeedVNext): string {
  const age = seed.identity.ageBand.label.toLowerCase();
  return `a ${age} ${seed.identity.species.label.toLowerCase()} ${seed.identity.class.label.toLowerCase()}, ${seed.identity.profession.label.toLowerCase()}`;
}

function styleBlock(style: PromptCompilerOptions['style']): string {
  if (style === 'painted-character-study') {
    return 'Painted fantasy character study with refined brushwork, smooth value masses, restrained realism, natural materials, controlled edges, localized detail, and a clean readable silhouette.';
  }
  if (style === 'clean-concept-art') {
    return 'Clean full-body fantasy concept art with strong shape design, clear material separation, restrained atmospheric depth, controlled detail, and production-ready visual readability.';
  }
  return 'Full-body cinematic painted fantasy concept with realistic painterly finish, dramatic but controlled atmospheric depth, expressive face and hands, natural materials, a clean readable silhouette, and low surface noise.';
}

function buildPromptSections(seed: SemanticSeedVNext, visual: VisualDirection, options: PromptCompilerOptions): string[] {
  const subject = normalizeSubject(seed);
  const moment = `${visual.embodiment.posture}; ${visual.embodiment.gesture}; ${visual.embodiment.gaze}; ${visual.embodiment.expression}`;
  const identitySentence = `${subject}. ${visual.readability.silhouetteFamily}; ${visual.readability.proportionBias}`;
  const lifeSentence = `${visual.life.clothingLogic}. Materials: ${joinNatural(visual.life.materials)}. Primary tool: ${visual.life.primaryTool}. Lived-in trace: ${visual.life.wearTrace}`;
  const powerSentence = visual.power.manifestation
    ? `Power is ${visual.power.control.toLowerCase()} and ${visual.power.visibility.replace(/-/g, ' ')}: ${visual.power.manifestation}${visual.power.costSignal ? `; ${visual.power.costSignal}` : ''}`
    : `No visible supernatural effect; power remains present only through the situation, consequence, and character behavior${visual.power.costSignal ? `; ${visual.power.costSignal}` : ''}`;
  const sceneSentence = `${visual.scene.environment}. ${visual.scene.spatialRelation}`;
  const artSentence = `${visual.artDirection.composition}. ${visual.artDirection.camera}. ${visual.artDirection.light}. Palette logic: ${joinNatural(visual.artDirection.paletteRoles)}. Focal order: ${joinNatural(visual.artDirection.focalOrder)}`;
  const storySentence = `${seed.psychology.contradiction.label}. ${seed.currentMoment.goal.label}; ${seed.currentMoment.obstacle.label}; pressure: ${seed.currentMoment.pressure.label.toLowerCase()}`;

  return [
    sentence(identitySentence),
    sentence(moment),
    sentence(storySentence),
    sentence(lifeSentence),
    sentence(powerSentence),
    sentence(sceneSentence),
    sentence(artSentence),
    sentence(styleBlock(options.style)),
  ].filter(Boolean);
}

function trimToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  const trimmed = words.slice(0, maxWords).join(' ');
  const lastPeriod = trimmed.lastIndexOf('.');
  return lastPeriod > maxWords * 2 ? trimmed.slice(0, lastPeriod + 1) : `${trimmed.replace(/[,:;\s]+$/, '')}.`;
}

function findDuplicatePhrases(text: string): string[] {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);
  const counts = new Map<string, number>();
  for (let index = 0; index <= words.length - 3; index += 1) {
    const phrase = words.slice(index, index + 3).join(' ');
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([phrase]) => phrase).slice(0, 12);
}

function findUnresolvedAlternatives(text: string): string[] {
  const matches = text.match(/\b(?:violet|blue|green|crimson|gold|silver|red|black|white)\b(?:\s*,\s*|\s+or\s+){1,3}\b(?:violet|blue|green|crimson|gold|silver|red|black|white)\b/gi);
  return dedupe(matches ?? []);
}

function grammarWarnings(text: string): string[] {
  const warnings: string[] = [];
  if (/\bthey stands\b/i.test(text)) warnings.push('pronoun-verb mismatch: they stands');
  if (/\bthey holds\b/i.test(text)) warnings.push('pronoun-verb mismatch: they holds');
  if (/\bhe stand\b/i.test(text)) warnings.push('pronoun-verb mismatch: he stand');
  if (/\bshe stand\b/i.test(text)) warnings.push('pronoun-verb mismatch: she stand');
  if (/\busing\s+[^.]{0,80}\busing\b/i.test(text)) warnings.push('repeated using-clause');
  return warnings;
}

export function compilePromptVNext(
  seed: SemanticSeedVNext,
  visual: VisualDirection,
  options: PromptCompilerOptions = {},
): CompiledPromptVNext {
  const maxWords = Math.max(120, options.maxWords ?? 280);
  const sections = buildPromptSections(seed, visual, options);
  const rawPrompt = sections.join(' ').replace(/\s+/g, ' ').trim();
  const prompt = trimToWords(rawPrompt, maxWords);
  const negatives = dedupe([
    ...visual.negativeConstraints,
    'no text, logos, letters, or readable symbols',
    'no duplicate props or duplicate body parts',
    'no unresolved color alternatives',
    'no noisy patterned surfaces, grainy overlays, or excessive microdetail',
  ]);
  const negativePrompt = `Avoid ${negatives.map((item) => item.replace(/^no\s+/i, '')).join(', ')}.`;
  const wordCount = prompt.split(/\s+/).filter(Boolean).length;

  return {
    prompt,
    negativePrompt,
    wordCount,
    lint: {
      duplicatePhrases: findDuplicatePhrases(prompt),
      unresolvedAlternatives: findUnresolvedAlternatives(prompt),
      grammarWarnings: grammarWarnings(prompt),
      excessiveLength: wordCount > maxWords,
    },
  };
}
