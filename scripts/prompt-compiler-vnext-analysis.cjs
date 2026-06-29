const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.prompt-compiler-vnext-build');
const sampleSize = 450;

rmSync(outDir, { recursive: true, force: true });
run('tsc', [
  '--ignoreConfig', '--outDir', outDir,
  '--module', 'commonjs', '--target', 'ES2020', '--moduleResolution', 'node10',
  '--resolveJsonModule', '--ignoreDeprecations', '6.0', '--esModuleInterop', '--skipLibCheck',
  '--lib', 'ES2020,DOM',
  'src/lib/vnext/contracts.ts',
  'src/lib/vnext/resolverControlled.ts',
  'src/lib/vnext/resolverWithRules.ts',
  'src/lib/vnext/resolver.ts',
  'src/lib/vnext/ruleEngine.ts',
  'src/lib/vnext/incrementalResolver.ts',
  'src/lib/vnext/situationGraph.ts',
  'src/lib/vnext/visualDirector.ts',
  'src/lib/vnext/promptCompiler.ts',
  'src/lib/vnext/generateVNext.ts',
], { cwd: root, stdio: 'inherit' });

writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json', 'affordances.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateIncrementalSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'incrementalResolver.js'));
const { resolveVisualDirectionVNext } = require(path.join(outDir, 'lib', 'vnext', 'visualDirector.js'));
const { compilePromptVNext } = require(path.join(outDir, 'lib', 'vnext', 'promptCompiler.js'));
const { generateDicebornVNext } = require(path.join(outDir, 'lib', 'vnext', 'generateVNext.js'));

const classes = ['class.warlock', 'class.fighter', 'class.cleric'];
const failures = [];
const wordCounts = [];
let grammarWarningCount = 0;
let unresolvedAlternativeCount = 0;
let duplicatePhraseCount = 0;
let patronLeakCount = 0;
let classColorLeakCount = 0;
const examples = [];

for (let index = 0; index < sampleSize; index += 1) {
  const classId = classes[index % classes.length];
  const semanticSeed = generateIncrementalSemanticSeedVNext({
    rngSeed: `prompt-compiler-${index}`,
    classId,
    novelty: index % 4 === 0 ? 'high' : 'balanced',
    beamWidth: 18,
    branchFactor: 5,
  });
  const visual = resolveVisualDirectionVNext(semanticSeed);
  const compiled = compilePromptVNext(semanticSeed, visual, {
    style: index % 3 === 0 ? 'painted-character-study' : index % 3 === 1 ? 'clean-concept-art' : 'cinematic-painted-fantasy',
    maxWords: 280,
  });
  const endToEnd = generateDicebornVNext({
    rngSeed: `prompt-compiler-e2e-${index}`,
    classId,
    prompt: { maxWords: 280 },
  });

  wordCounts.push(compiled.wordCount);
  grammarWarningCount += compiled.lint.grammarWarnings.length;
  unresolvedAlternativeCount += compiled.lint.unresolvedAlternatives.length;
  duplicatePhraseCount += compiled.lint.duplicatePhrases.length;

  const lower = compiled.prompt.toLowerCase();
  if (visual.power.visibility !== 'full-apparition' && /visible patron|full apparition|patron appears/.test(lower)) patronLeakCount += 1;
  if (/warlock purple|cleric gold|fighter red|class-colored palette/.test(lower)) classColorLeakCount += 1;
  if (!compiled.negativePrompt.startsWith('Avoid ')) failures.push(`Negative prompt format failed at ${index}`);
  if (!endToEnd.surfacePrompt || !endToEnd.visualDirection || !endToEnd.semanticSeed) failures.push(`End-to-end result incomplete at ${index}`);
  if (compiled.wordCount > 280) failures.push(`Prompt too long at ${index}: ${compiled.wordCount}`);

  if (examples.length < 18) {
    examples.push({
      seedId: semanticSeed.id,
      identity: `${semanticSeed.identity.species.label} ${semanticSeed.identity.class.label}, ${semanticSeed.identity.profession.label}`,
      visibility: visual.power.visibility,
      prompt: compiled.prompt,
      negativePrompt: compiled.negativePrompt,
      lint: compiled.lint,
    });
  }
}

const averageWordCount = wordCounts.reduce((sum, value) => sum + value, 0) / wordCounts.length;
const maxWordCount = Math.max(...wordCounts);
const minWordCount = Math.min(...wordCounts);

if (grammarWarningCount > 0) failures.push(`Grammar warnings: ${grammarWarningCount}`);
if (unresolvedAlternativeCount > 0) failures.push(`Unresolved color alternatives: ${unresolvedAlternativeCount}`);
if (patronLeakCount > 0) failures.push(`Patron leaks in non-apparition prompts: ${patronLeakCount}`);
if (classColorLeakCount > 0) failures.push(`Class-color leaks: ${classColorLeakCount}`);
if (averageWordCount < 120 || averageWordCount > 260) failures.push(`Unexpected average word count: ${averageWordCount}`);

const report = {
  sampleSize,
  wordCount: { average: averageWordCount, min: minWordCount, max: maxWordCount },
  lint: {
    grammarWarningCount,
    unresolvedAlternativeCount,
    duplicatePhraseCount,
    patronLeakCount,
    classColorLeakCount,
  },
  examples,
  failures,
};

console.log(JSON.stringify(report, null, 2));
console.log(`\nDiceborn Prompt Compiler vNext analysis: ${failures.length} failure(s).`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exitCode = 1;
