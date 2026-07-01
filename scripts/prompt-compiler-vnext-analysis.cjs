const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-vnext-prompt-${process.pid}`);
const tsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
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

const sample = 500;
const totals = { words: 0, maxWords: 0, sentenceLength: 0, maxSentenceLength: 0, sentences: 0 };
const counts = { duplicateClausePrompts: 0, repeatedPhrasePrompts: 0, malformedGrammar: 0, metaLanguage: 0, over270: 0, sentenceOver50: 0, controlled: 0, restrained: 0, practical: 0, readable: 0, while: 0, with: 0, power: 0 };
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
if (failures.length) {
  console.error('Prompt compiler benchmark failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Prompt compiler benchmark passed');
