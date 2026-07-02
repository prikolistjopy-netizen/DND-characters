const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-vnext-prompt-${process.pid}`);
const localTsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const tsc = fs.existsSync(localTsc) ? localTsc : 'tsc';
const compile = spawnSync(tsc, [
  '--ignoreConfig', '--ignoreDeprecations', '6.0', '--outDir', outDir,
  '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node10',
  '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--lib', 'ES2020,DOM',
  path.join(root, 'src/lib/vnext/index.ts'),
], { stdio: 'inherit' });
if (compile.status !== 0) process.exit(compile.status ?? 1);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext } = require(path.join(outDir, 'lib/vnext/index.js'));

function countWords(text) { return text.trim().split(/\s+/).filter(Boolean).length; }
function sentences(text) { return text.split(/(?<=[.!?])\s+/).map((item) => item.trim()).filter(Boolean); }
function repeatedFourPlus(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  const ignored = new Set(['and', 'the', 'of', 'to', 'a', 'as', 'with', 'in', 'or', 'is', 'on', 'while', 'through', 'for', 'by', 'from', 'at', 'into']);
  const seen = new Set();
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
function duplicatedClauses(text) {
  const seen = new Set();
  let duplicates = 0;
  for (const sentence of sentences(text)) {
    const key = sentence.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(the|a|an|and|or|to|of|in|on|with|while|as|by|for)\b/g, ' ').replace(/\s+/g, ' ').trim();
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  }
  return duplicates;
}
function count(text, pattern) { return (text.match(pattern) || []).length; }
function metaLanguage(text) {
  return /expected to perform a class stereotype|courtier work requires|power supports|power stays below|profession influences|shows contradiction|narrative intent|visual consequence|focal hierarchy should|the scene must|attention stays on negotiate status/i.test(text);
}
function malformedConditional(text) { return /failure would mean if|if [^.]{0,80} if /i.test(text); }

function internalTaxonomy(text) {
  return /social gesture|witness relation|status material|threshold composition|affected subject|active space|profession read|species read|supernatural read|current duty|class evidence|material base|dominant environment/i.test(text);
}
function fragmentSentence(sentence) {
  const clean = sentence.replace(/[.!?]$/, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  return words.length < 4 || /^(measures every witness|guarded asymmetry|balanced step into pressure|quiet lateral repositioning|controlled turn toward the threat)$/i.test(clean);
}
function unnaturalPhrase(text) {
  return /uses [^.]{0,80} to keep the duty|remains in the active space|The risk is|Gaze goes to|Rendering constraints:|Localized [^.]+ light using|Species read:|Material base:|Dominant environment:/i.test(text);
}
function normalizeFrame(sentence) {
  return sentence
    .toLowerCase()
    .replace(/full-body cinematic painted fantasy character concept: .+?\./, 'identity.')
    .replace(/\b(human|dwarf|tiefling|elf|half elf|halfling|half orc|gnome|dragonborn|aasimar|firbolg|satyr)\b/g, '<species>')
    .replace(/\b(fighter|cleric|warlock|rogue|ranger|paladin|wizard|druid|bard|monk|barbarian|sorcerer|artificer)\b/g, '<class>')
    .replace(/\b(physician|locksmith|ferryman|investigator|undertaker|tutor|archivist|courier|mason|herbalist|cartographer|cook|shepherd|jeweler|miner|scribe|sailor|midwife|hunter|innkeeper|courtier|smuggler|shrine keeper|battlefield medic|lamplighter|surveyor|trapper|tavern keeper|gravedigger)\b/g, '<profession>')
    .replace(/\b[a-z-]+ (?:object|tool|line|cord|needle|petition|signet|lamp|rope|mug|clamp|rod|satchel)\b/g, '<tool>')
    .replace(/\b[a-z-]+ (?:traveler|patient|villager|passenger|owner|child|petitioner|mourner|pilgrim|ally|scout|soldier|marker|stone|animal|creature|hunter|body|guest|guard|crate|witness|lock|latch|door|resident)\b/g, '<subject>')
    .replace(/\b(forest track|market threshold|quiet parish room|workroom edge|rain-dark doorway)\b/g, '<environment>')
    .replace(/[0-9]+/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim();
}
function environmentMismatch(input, text) {
  if (input.salience === 'background' || input.salience === 'trace') return false;
  const lower = text.toLowerCase();
  const profession = input.professionId;
  if (profession === 'ferryman' && !/river|ferry|boat|passenger|crossing|toll|cargo|flood|mooring/.test(lower)) return true;
  if (profession === 'battlefield_medic' && !/wounded|blood|triage|after fighting|aftermath|bandage|patient|medic/.test(lower)) return true;
  if (profession === 'surveyor' && !/boundary|border|marker|sighting|measuring|survey|map|cord/.test(lower)) return true;
  if (profession === 'trapper' && !/snare|trap|hunter|creature|track|cord|spring/.test(lower)) return true;
  if (profession === 'shrine_keeper' && !/shrine|altar|petitioner|candle|offering|prayer|votive/.test(lower)) return true;
  return false;
}
function unclearSubjectObstacle(text) {
  return !/(within arm's reach|between|before|threshold|foreground|midground|background|blocks|beside|behind|near|toward|arm's reach|fills the midground|holds the midground|diagonal line|obstacle|dependent figure|subject|patient|witness|person who depends)/i.test(text);
}

const sample = 500;
const totals = { words: 0, maxWords: 0, sentenceLength: 0, maxSentenceLength: 0, sentences: 0 };
const counts = { duplicateClausePrompts: 0, repeatedPhrasePrompts: 0, malformedGrammar: 0, metaLanguage: 0, over270: 0, sentenceOver50: 0, controlled: 0, restrained: 0, practical: 0, readable: 0, while: 0, with: 0, power: 0, fragmentSentences: 0, internalTaxonomy: 0, genericClosing: 0, unnaturalPhrase: 0, environmentMismatch: 0, unclearSubjectObstacle: 0 };
const frameCounts = new Map();
for (let index = 0; index < sample; index += 1) {
  const result = generateDicebornVNext({ rngSeed: `prompt-benchmark-${index}` });
  const prompt = result.prompt;
  const wordCount = countWords(prompt);
  totals.words += wordCount;
  totals.maxWords = Math.max(totals.maxWords, wordCount);
  if (wordCount > 270) counts.over270 += 1;
  if (duplicatedClauses(prompt) > 0) counts.duplicateClausePrompts += 1;
  if (repeatedFourPlus(prompt) > 0) counts.repeatedPhrasePrompts += 1;
  if (malformedConditional(prompt)) counts.malformedGrammar += 1;
  if (metaLanguage(prompt)) counts.metaLanguage += 1;
  if (internalTaxonomy(prompt)) counts.internalTaxonomy += 1;
  if (unnaturalPhrase(prompt)) counts.unnaturalPhrase += 1;
  if (/Keep the silhouette clean, the detail restrained, and the background secondary|Use natural materials, clear hand shapes, and controlled detail without clutter|Keep props minimal, surfaces calm, and the scene readable at full-body scale|Favor grounded materials, clear spacing, and a single readable action/i.test(prompt)) counts.genericClosing += 1;
  if (environmentMismatch({ professionId: result.semanticSeed.identity.professionId, salience: result.semanticSeed.life.professionSalience }, prompt)) counts.environmentMismatch += 1;
  if (unclearSubjectObstacle(prompt)) counts.unclearSubjectObstacle += 1;
  counts.controlled += count(prompt, /\bcontrolled\b/gi);
  counts.restrained += count(prompt, /\brestrained\b/gi);
  counts.practical += count(prompt, /\bpractical\b/gi);
  counts.readable += count(prompt, /\breadable\b/gi);
  counts.while += count(prompt, /\bwhile\b/gi);
  counts.with += count(prompt, /\bwith\b/gi);
  counts.power += count(prompt, /\bpower\b/gi);
  for (const sentence of sentences(prompt)) {
    const length = countWords(sentence);
    totals.sentences += 1;
    totals.sentenceLength += length;
    totals.maxSentenceLength = Math.max(totals.maxSentenceLength, length);
    if (length > 50) counts.sentenceOver50 += 1;
    if (fragmentSentence(sentence)) counts.fragmentSentences += 1;
    const frame = normalizeFrame(sentence);
    if (frame && frame !== 'identity.') frameCounts.set(frame, (frameCounts.get(frame) || 0) + 1);
  }
}

const reviewCases = [
  ['Gnome Warlock Courtier', { rngSeed: 'review-gnome-warlock-courtier', classId: 'warlock', speciesId: 'gnome', professionId: 'courtier' }],
  ['Human Warlock Physician', { rngSeed: 'review-human-warlock-physician', classId: 'warlock', speciesId: 'human', professionId: 'physician' }],
  ['Tiefling Cleric Smuggler', { rngSeed: 'review-tiefling-cleric-smuggler', classId: 'cleric', speciesId: 'tiefling', professionId: 'smuggler' }],
  ['Dwarf Fighter Ferryman', { rngSeed: 'review-dwarf-fighter-ferryman', classId: 'fighter', speciesId: 'dwarf', professionId: 'ferryman' }],
  ['Halfling Rogue Shrine Keeper', { rngSeed: 'review-halfling-rogue-shrine-keeper', classId: 'rogue', speciesId: 'halfling', professionId: 'shrine_keeper' }],
  ['Aasimar Paladin Courtier', { rngSeed: 'review-aasimar-paladin-courtier', classId: 'paladin', speciesId: 'aasimar', professionId: 'courtier' }],
  ['Firbolg Druid Undertaker', { rngSeed: 'review-firbolg-druid-undertaker', classId: 'druid', speciesId: 'firbolg', professionId: 'undertaker' }],
  ['Gnome Artificer Lamplighter', { rngSeed: 'review-gnome-artificer-lamplighter', classId: 'artificer', speciesId: 'gnome', professionId: 'lamplighter' }],
  ['Satyr Bard Tavern Keeper', { rngSeed: 'review-satyr-bard-tavern-keeper', classId: 'bard', speciesId: 'satyr', professionId: 'tavern_keeper' }],
  ['Dragonborn Barbarian Battlefield Medic', { rngSeed: 'review-dragonborn-barbarian-battlefield-medic', classId: 'barbarian', speciesId: 'dragonborn', professionId: 'battlefield_medic' }],
  ['Elf Ranger Surveyor', { rngSeed: 'review-elf-ranger-surveyor', classId: 'ranger', speciesId: 'elf', professionId: 'surveyor' }],
  ['Half-Orc Monk Trapper', { rngSeed: 'review-half-orc-monk-trapper', classId: 'monk', speciesId: 'half_orc', professionId: 'trapper' }],
];
const reviewPrompts = reviewCases.map(([label, input]) => {
  const result = generateDicebornVNext(input);
  return { label, words: result.compiledPrompt.wordCount, prompt: result.prompt, lintWarnings: result.compiledPrompt.lintWarnings };
});
const topSentenceFrames = [...frameCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([frame, count]) => ({ frame, count, percent: Number((count / sample * 100).toFixed(2)) }));
const metrics = {
  sample,
  averageWordCount: Number((totals.words / sample).toFixed(1)),
  maxWordCount: totals.maxWords,
  duplicateClauseCount: counts.duplicateClausePrompts,
  repeatedFourWordPhrasePrompts: counts.repeatedPhrasePrompts,
  malformedGrammarPatterns: counts.malformedGrammar,
  averageSentenceLength: Number((totals.sentenceLength / totals.sentences).toFixed(1)),
  maximumSentenceLength: totals.maxSentenceLength,
  wordUse: {
    controlled: counts.controlled,
    restrained: counts.restrained,
    practical: counts.practical,
    readable: counts.readable,
    while: counts.while,
    with: counts.with,
    power: counts.power,
  },
  metaLanguagePercent: Number((counts.metaLanguage / sample * 100).toFixed(2)),
  over270Percent: Number((counts.over270 / sample * 100).toFixed(2)),
  sentenceOver50Percent: Number((counts.sentenceOver50 / totals.sentences * 100).toFixed(2)),
  naturalLanguage: {
    fragmentSentenceRate: Number((counts.fragmentSentences / totals.sentences * 100).toFixed(2)),
    repeatedSentenceFrameRate: topSentenceFrames[0]?.percent ?? 0,
    environmentCompatibilityFailures: counts.environmentMismatch,
    professionEnvironmentMismatchPercent: Number((counts.environmentMismatch / sample * 100).toFixed(2)),
    internalTaxonomyLeakage: counts.internalTaxonomy,
    genericClosingRepetitionPercent: Number((counts.genericClosing / sample * 100).toFixed(2)),
    unnaturalPhrasePercent: Number((counts.unnaturalPhrase / sample * 100).toFixed(2)),
    unclearSubjectObstaclePercent: Number((counts.unclearSubjectObstacle / sample * 100).toFixed(2)),
    duplicateStagingStructureRate: topSentenceFrames[0]?.percent ?? 0,
    topSentenceFrames,
  },
};
console.log('Prompt compiler vNext benchmark');
console.log(JSON.stringify({ metrics, reviewPrompts }, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
const failures = [];
if (metrics.metaLanguagePercent > 0) failures.push(`meta-language ${metrics.metaLanguagePercent}%`);
if (counts.over270 > 0) failures.push(`prompts over 270 words ${counts.over270}/${sample}`);
if (counts.duplicateClausePrompts > 0) failures.push(`duplicate clauses ${counts.duplicateClausePrompts}/${sample}`);
if (counts.malformedGrammar > 0) failures.push(`malformed conditionals ${counts.malformedGrammar}/${sample}`);
if (counts.repeatedPhrasePrompts / sample > 0.01) failures.push(`repeated 4+ word phrase ${(counts.repeatedPhrasePrompts / sample * 100).toFixed(1)}%`);
if (metrics.averageWordCount > 235) failures.push(`average word count ${metrics.averageWordCount}`);
if (metrics.sentenceOver50Percent > 1) failures.push(`sentences over 50 words ${metrics.sentenceOver50Percent}%`);
if (metrics.naturalLanguage.fragmentSentenceRate > 2) failures.push(`fragment sentence rate ${metrics.naturalLanguage.fragmentSentenceRate}%`);
if (counts.internalTaxonomy > 0) failures.push(`internal taxonomy leakage ${counts.internalTaxonomy}/${sample}`);
if (metrics.naturalLanguage.repeatedSentenceFrameRate > 8) failures.push(`top sentence frame ${metrics.naturalLanguage.repeatedSentenceFrameRate}%`);
if (metrics.naturalLanguage.professionEnvironmentMismatchPercent > 1) failures.push(`profession-environment mismatch ${metrics.naturalLanguage.professionEnvironmentMismatchPercent}%`);
if (metrics.naturalLanguage.genericClosingRepetitionPercent > 15) failures.push(`generic closing repetition ${metrics.naturalLanguage.genericClosingRepetitionPercent}%`);
if (metrics.naturalLanguage.unnaturalPhrasePercent > 1) failures.push(`unnatural phrase ${metrics.naturalLanguage.unnaturalPhrasePercent}%`);
if (metrics.naturalLanguage.unclearSubjectObstaclePercent > 2) failures.push(`unclear subject/obstacle relation ${metrics.naturalLanguage.unclearSubjectObstaclePercent}%`);
if (failures.length) {
  console.error('Prompt compiler benchmark failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Prompt compiler benchmark passed');
