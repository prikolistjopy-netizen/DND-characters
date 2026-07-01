import type { CompiledPrompt, SemanticSeed, VisualDirection } from './contracts';

const TARGET_WORDS = 240;
const HARD_MAX_WORDS = 270;
const META_LANGUAGE = [
  /expected to perform a class stereotype/gi,
  /courtier work requires/gi,
  /power supports/gi,
  /power stays below/gi,
  /profession influences/gi,
  /shows contradiction/gi,
  /narrative intent/gi,
  /visual consequence/gi,
  /focal hierarchy should/gi,
  /the scene must/gi,
  /attention stays on negotiate status/gi,
  /class stereotype/gi,
];

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function label(value: string) {
  return value.replace(/[_-]+/g, ' ');
}

function compact(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/;\s*;/g, ';')
    .replace(/\.\s*\./g, '.')
    .trim();
}

function clauseKey(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(the|a|an|and|or|to|of|in|on|with|while|as|by|for)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripMetaLanguage(text: string) {
  let next = text;
  for (const pattern of META_LANGUAGE) next = next.replace(pattern, '');
  return compact(next);
}

function sentenceCase(text: string) {
  const cleaned = compact(text);
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned;
}

function splitSentences(text: string) {
  return text.split(/(?<=[.!?])\s+/).map((item) => compact(item)).filter(Boolean);
}

function shortTarget(seed: SemanticSeed) {
  if (seed.identity.professionId === 'courtier') return 'the official, witnesses, and the harmed dependent';
  const target = seed.currentMoment.targetOfAttention.replace(/protect a patron or dependent/g, 'the dependent person');
  if (target === seed.currentMoment.currentAction || /^(prepare|keep|protect|avoid|record|settle|notice|negotiate|choose|mark|calm|open|move|carry|identify)\b/i.test(target)) {
    const dependent = seed.currentMoment.dependent || '';
    return /^(prepare|keep|protect|avoid|record|settle|notice|negotiate|choose|mark|calm|open|move|carry|identify)\b/i.test(dependent) ? 'the affected subject' : dependent || 'the affected subject';
  }
  return target;
}

function normalizeFailure(seed: SemanticSeed) {
  return seed.currentMoment.risk ? `The risk is ${seed.currentMoment.risk}.` : '';
}

function normalizePosture(text: string) {
  const cleaned = stripMetaLanguage(text)
    .replace(/;?\s*energy state is\s*/i, '; ')
    .replace(/, with /gi, '; ')
    .replace(/\brequires\b/gi, 'uses')
    .replace(/\s+/g, ' ');
  return cleaned.split(';').map((part) => {
    const item = part.trim();
    const match = item.match(/^[a-z_ ]+ uses ([^,;]+), ([^,;]+), and /i);
    if (match) return `${match[1]} and ${match[2]}`;
    return item;
  }).filter(Boolean).join('; ');
}


function normalizeGesture(text: string) {
  const cleaned = stripMetaLanguage(text).replace(/revealing .*$/i, '').replace(/;\s*$/, '');
  const match = cleaned.match(/^hands use (.+?) with (.+?)(?:;|$)/i);
  if (match) return `Hands handle ${match[1]}; ${match[2]} guides the movement`;
  return cleaned.replace(/, with /gi, '; ');
}

function compileProfessionEvidence(seed: SemanticSeed, visual: VisualDirection) {
  if (seed.identity.professionId === 'courtier') {
    const statusObject = visual.life.primaryTool.includes('signet') ? 'signet ribbon' : 'folded petition';
    return `Formal cuffs are worn at the edges; the ${statusObject} is visible as the status object, and the ceremonial blade remains lowered.`;
  }
  if (seed.identity.professionId === 'physician') return `The diagnostic tool stays close to the subject; hand placement, cuff wear, and direct assessment carry the physician read.`;
  if (seed.identity.professionId === 'ferryman') return `Rope handling, weathered hands, and a stance set against moving water make the ferryman work visible.`;
  return `${sentenceCase(visual.life.clothing)}; ${visual.life.livedInTrace}; the ${visual.life.primaryTool} is the only primary tool.`;
}

function compileSceneStaging(seed: SemanticSeed, visual: VisualDirection) {
  if (seed.identity.professionId === 'courtier') {
    return [
      'The character stands before a sealed archive arch.',
      'A gate official blocks entry at the threshold while two legal witnesses watch from opposite sides.',
      'The harmed dependent stays just behind the character, partly protected by their body line.',
      'A sealed order in one witness hand carries the private threat.',
    ];
  }
  return [
    `${sentenceCase(visual.scene.currentMoment)}.`,
    `The character works near ${visual.scene.activeObstacle}; ${shortTarget(seed)} remains in the active space.`,
    normalizeFailure(seed),
  ];
}

function compilePower(seed: SemanticSeed, visual: VisualDirection) {
  if (seed.power.visibility === 'none') return 'No overt magic is visible; the class read comes from training, duty, and the task.';
  if (seed.power.visibility === 'latent') return 'The supernatural element stays latent, shown only through breath control and hand tension.';
  if (seed.power.visibility === 'shadow') {
    if (seed.identity.professionId === 'courtier') return 'A faint shadow echo curls once beside the hand holding the petition, barely darker than the archway shade.';
    return 'A single shadow echo sits near the working hand, small enough not to become a second subject.';
  }
  if (seed.power.visibility === 'object') return `A contained response appears only inside the ${visual.life.primaryTool}.`;
  if (seed.power.visibility === 'reflected') return 'One impossible reflection appears close to the task, not in the sky.';
  if (seed.power.visibility === 'behavioral') return 'The supernatural read is behavioral: timing, restraint, and how others react.';
  if (seed.power.visibility === 'social') return 'Authority is visible through the surrounding reaction rather than glow.';
  if (seed.power.visibility === 'environmental') return `One localized environmental response touches the ${seed.world.environment}.`;
  return `${sentenceCase(visual.power.manifestation)}.`;
}

function compositionSummary(visual: VisualDirection) {
  return visual.artDirection.composition.split('; frame ')[0];
}

function buildPromptSections(seed: SemanticSeed, visual: VisualDirection) {
  return [
    `Full-body cinematic painted fantasy character concept: ${label(seed.identity.speciesId)} ${label(seed.identity.classId)} ${seed.identity.profession}. ${visual.embodiment.proportions}.`,
    ...compileSceneStaging(seed, visual),
    `${normalizePosture(visual.embodiment.posture)}. ${normalizeGesture(visual.embodiment.gesture)}. Gaze goes to ${shortTarget(seed)}.`,
    compileProfessionEvidence(seed, visual),
    compilePower(seed, visual),
    `${sentenceCase(visual.scene.environment)}; ${compositionSummary(visual)}.`,
    `${visual.artDirection.lighting.replace(/with one focal accent/i, 'using one focal accent')}; ${visual.artDirection.paletteRoles.slice(0, 3).join('; ')}.`,
    'Rendering constraints: clean silhouette, controlled detail, smooth painterly material planes.',
  ];
}

function dedupeSentences(sentences: string[]) {
  const seen = new Set<string>();
  const removed: string[] = [];
  const kept: string[] = [];
  for (const sentence of sentences) {
    const cleaned = stripMetaLanguage(sentence);
    if (!cleaned) continue;
    const key = clauseKey(cleaned);
    if (key && seen.has(key)) {
      removed.push(cleaned);
      continue;
    }
    seen.add(key);
    kept.push(sentenceCase(cleaned).replace(/([^.!?])$/, '$1.'));
  }
  return { kept, removed };
}

function compressPrompt(sentences: string[]) {
  const trace: string[] = [];
  const deduped = dedupeSentences(sentences);
  if (deduped.removed.length) trace.push(`removed duplicates:${deduped.removed.length}`);
  let kept = deduped.kept;
  let prompt = kept.join(' ');
  if (countWords(prompt) > TARGET_WORDS) {
    const before = kept.length;
    kept = kept.filter((sentence) => !/dominant environment:|species read:|Rendering constraints:/i.test(sentence));
    if (kept.length !== before) trace.push(`trimmed secondary clauses:${before - kept.length}`);
    prompt = kept.join(' ');
  }
  while (countWords(prompt) > HARD_MAX_WORDS && kept.length > 5) {
    kept.splice(-2, 1);
    trace.push('word-count trim:removed secondary sentence');
    prompt = kept.join(' ');
  }
  return { prompt: compact(prompt), trace };
}

function repeatedLongPhraseCount(prompt: string) {
  const words = prompt.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  const ignored = new Set(['and', 'the', 'of', 'to', 'a', 'as', 'with', 'in', 'or', 'is', 'on', 'while', 'through', 'for', 'by', 'from', 'at', 'into']);
  const seen = new Set<string>();
  let repeats = 0;
  for (let index = 0; index <= words.length - 4; index += 1) {
    const chunk = words.slice(index, index + 4);
    if (chunk.some((word) => ignored.has(word))) continue;
    const phrase = chunk.join(' ');
    if (seen.has(phrase)) repeats += 1;
    seen.add(phrase);
  }
  return repeats;
}

export function lintPrompt(prompt: string, negativePrompt: string) {
  const warnings: string[] = [];
  if (/blue or violet|red or gold|staff or sword/i.test(prompt)) warnings.push('unresolved alternative');
  const lower = prompt.toLowerCase();
  const sentences = splitSentences(prompt);
  const keys = new Set<string>();
  for (const sentence of sentences) {
    const key = clauseKey(sentence);
    if (key && keys.has(key)) warnings.push('duplicated clause');
    keys.add(key);
    if (sentence.split(/\s+/).length > 45) warnings.push('sentence over 45 words');
  }
  if (repeatedLongPhraseCount(prompt) > 0) warnings.push('repeated 4 word phrase');
  const openings = new Map<string, number>();
  for (const sentence of sentences) {
    const opening = sentence.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
    if (!opening) continue;
    openings.set(opening, (openings.get(opening) || 0) + 1);
  }
  if ([...openings.values()].some((count) => count > 1)) warnings.push('repeated sentence opening');
  if (/failure would mean if|if [^.]{0,80} if /i.test(prompt)) warnings.push('malformed conditional');
  if (/attention stays on\s+(negotiate|protect|avoid|settle|notice|keep)\b/i.test(prompt)) warnings.push('unresolved infinitive target');
  if ((prompt.match(/;/g) || []).length > 10) warnings.push('excessive semicolon chains');
  if ((prompt.match(/\bwhile\b/gi) || []).length > 2) warnings.push('too many while clauses');
  if ((prompt.match(/\bwith\b/gi) || []).length > 3) warnings.push('too many with clauses');
  for (const adjective of ['controlled', 'restrained', 'practical', 'readable', 'visible', 'secondary']) {
    if ((lower.match(new RegExp(`\\b${adjective}\\b`, 'g')) || []).length > 3) warnings.push(`repeated adjective:${adjective}`);
  }
  if (META_LANGUAGE.some((pattern) => { pattern.lastIndex = 0; return pattern.test(prompt); })) warnings.push('meta-language');
  if (/id:|schemaVersion|deterministicSeed|class\.|profession\.|species\./i.test(prompt)) warnings.push('internal id leakage');
  if (/visible demon|towering patron|patron in the sky/i.test(prompt) && !/visible patron unless explicitly selected/i.test(negativePrompt)) warnings.push('patron visibility leak');
  if (/aura|floating rune|magical glow|generic purple|purple smoke|purple warlock|readable runes/i.test(prompt)) warnings.push('forbidden power/color wording');
  if (countWords(prompt) > HARD_MAX_WORDS) warnings.push('prompt over 270 words');
  return [...new Set(warnings)];
}

export function compilePrompt(seed: SemanticSeed, visual: VisualDirection, maxWords = HARD_MAX_WORDS): CompiledPrompt {
  const sections = buildPromptSections(seed, visual).flatMap((section) => splitSentences(section));
  const compressed = compressPrompt(sections);
  let prompt = compressed.prompt;
  const effectiveMax = Math.min(maxWords, HARD_MAX_WORDS);
  let trace = ['structured sections:identity,scene,posture,profession,tool,power,environment,lighting,rendering', ...compressed.trace];
  if (countWords(prompt) > effectiveMax) {
    const sentences = splitSentences(prompt);
    while (countWords(sentences.join(' ')) > effectiveMax && sentences.length > 5) {
      sentences.splice(-2, 1);
      trace.push('final trim:removed low-priority sentence');
    }
    prompt = compact(sentences.join(' '));
  }
  prompt = stripMetaLanguage(prompt);
  prompt = prompt.replace(/; /g, '. ').replace(/\bvisible\b/g, 'clear');
  prompt = prompt.replace(/(light) light\b/gi, '$1');
  prompt = splitSentences(prompt).map((sentence) => sentenceCase(sentence).replace(/([^.!?])$/, '$1.')).join(' ');
  const negativePrompt = 'No text, logos, duplicate props, belt clutter, noisy microdetail, tiled/checker/rhombus artifacts, all-over surface noise, generic heroic stance, class-color stereotype, visible patron unless explicitly selected, aura, floating runes, generic purple.';
  const warnings = lintPrompt(prompt, negativePrompt);
  trace = [...trace, 'removed meta phrases during normalization', `final word count:${countWords(prompt)}`, `lint warnings:${warnings.length}`];
  return {
    prompt,
    negativePrompt,
    wordCount: countWords(prompt),
    lintWarnings: warnings,
    compilerTrace: trace,
  };
}
