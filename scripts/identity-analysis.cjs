const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.identity-analysis-build');
const sampleSize = 10000;
const scholarThemes = new Set(['divine_archivist', 'academy_mage', 'archive_performer']);
const layerOrder = ['Class Identity', 'Build Template', 'Visual Theme', 'Narrative Motif', 'Theme Variant', 'Narrative Variant', 'Culture'];

rmSync(outDir, { recursive: true, force: true });
run(
  'tsc',
  [
    '--ignoreConfig',
    '--outDir',
    outDir,
    '--module',
    'commonjs',
    '--target',
    'ES2020',
    '--moduleResolution',
    'node10',
    '--ignoreDeprecations',
    '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib',
    'ES2020,DOM',
    'src/data/seedData.ts',
    'src/lib/generator.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));

const { generateCharacterSeed, validateGeneratedSeed } = require(path.join(outDir, 'lib/generator.js'));
const { visualThemes } = require(path.join(outDir, 'data/seedData.js'));

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function topEntries(map, limit = 20) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

function entropy(counts) {
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0 || counts.size <= 1) return { entropy: 0, normalized: 0 };
  const h = [...counts.values()].reduce((sum, count) => {
    const p = count / total;
    return sum - p * Math.log2(p);
  }, 0);
  return { entropy: h, normalized: h / Math.log2(counts.size) };
}

function identityBudget(seed) {
  const raw = {
    'Class Identity': Math.max(0, seed.classAnchorScore / 5) * 35,
    'Build Template': 25,
    'Visual Theme': 15,
    'Narrative Motif': 10,
    'Theme Variant': 5,
    'Narrative Variant': 5,
    Culture: 5,
  };
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0);
  const normalized = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, (value / total) * 100]));
  const dominantLayer = Object.entries(normalized).sort((a, b) => b[1] - a[1])[0][0];
  return { normalized, dominantLayer };
}

function adaptiveThemeWeight(themeId, recentThemes, themeCounts, index) {
  let weight = 100;
  if (recentThemes.slice(-10).includes(themeId)) weight = 90;
  if (recentThemes.slice(-5).includes(themeId)) weight = 80;

  const currentCount = themeCounts.get(themeId) ?? 0;
  const observedShare = index > 0 ? currentCount / index : 0;
  const expectedShare = 1 / Math.max(1, visualThemes.length);
  if (observedShare > expectedShare * 2.5) weight = 70;

  return Math.max(50, weight);
}

function detailDensity(seed) {
  const visual = seed.visualDetails.length;
  const story = seed.storyDetails.length;
  const culture = seed.cultureDetails.length;
  return { visual, story, culture, total: visual + story + culture };
}

function seedSummary(seed) {
  return `${seed.primaryClass} ${seed.race.name} score ${seed.classAnchorScore}/5 | ${seed.culturalOrigin.label} | ${seed.buildTemplate.id} | ${seed.visualTheme.id}/${seed.visualThemeVariant.id} | ${seed.narrativeMotif.id}/${seed.narrativeVariant.id} | ${seed.weapon.name} | ${seed.fx.name}`;
}

const failures = [];
const seeds = [];
const layerTotals = new Map(layerOrder.map((layer) => [layer, 0]));
const dominanceCounts = new Map();
const themeDominatesClass = new Map();
const motifDominatesClass = new Map();
const adaptiveThemeWeights = new Map();
const adaptivePenaltyCounts = new Map();
const scholarTriggers = new Map();
const classScores = new Map();
const detailDensityCounts = new Map();
const themeCounts = new Map();
const cultureCounts = new Map();
const recentThemes = [];
const generatedSamples = [];

for (let index = 0; index < sampleSize; index += 1) {
  const result = generateCharacterSeed();
  const { seed } = result;
  const issues = validateGeneratedSeed(seed);
  if (issues.length > 0) {
    failures.push(`${seedSummary(seed)} :: ${issues.map((issue) => issue.message).join('; ')}`);
  }

  const budget = identityBudget(seed);
  for (const [layer, value] of Object.entries(budget.normalized)) {
    increment(layerTotals, layer, value);
  }
  increment(dominanceCounts, budget.dominantLayer);

  if (budget.normalized['Visual Theme'] > budget.normalized['Class Identity']) {
    increment(themeDominatesClass, `${seed.primaryClass}+${seed.visualTheme.id}`);
  }
  if (budget.normalized['Narrative Motif'] > budget.normalized['Class Identity']) {
    increment(motifDominatesClass, `${seed.primaryClass}+${seed.narrativeMotif.id}`);
  }

  const adaptiveWeight = adaptiveThemeWeight(seed.visualTheme.id, recentThemes, themeCounts, index);
  increment(adaptiveThemeWeights, seed.visualTheme.id, adaptiveWeight);
  if (adaptiveWeight < 100) increment(adaptivePenaltyCounts, `${seed.visualTheme.id}@${adaptiveWeight}`);

  increment(themeCounts, seed.visualTheme.id);
  increment(cultureCounts, seed.culturalOrigin.id);
  if (scholarThemes.has(seed.visualTheme.id)) {
    increment(scholarTriggers, `archetype:${seed.archetype.name}`);
    for (const tag of seed.archetype.tags) increment(scholarTriggers, `tag:${tag}`);
    increment(scholarTriggers, `class:${seed.primaryClass}`);
  }

  const classScoreBucket = classScores.get(seed.primaryClass) ?? [];
  classScoreBucket.push(seed.classAnchorScore);
  classScores.set(seed.primaryClass, classScoreBucket);

  const density = detailDensity(seed);
  increment(detailDensityCounts, `visual:${density.visual}`);
  increment(detailDensityCounts, `story:${density.story}`);
  increment(detailDensityCounts, `culture:${density.culture}`);
  increment(detailDensityCounts, `total:${density.total}`);

  seeds.push({ seed, budget, density, index });
  if (generatedSamples.length < 30) generatedSamples.push(seed);

  recentThemes.push(seed.visualTheme.id);
  if (recentThemes.length > 10) recentThemes.shift();
}

const themeEntropy = entropy(themeCounts);
const expectedThemeCount = sampleSize / visualThemes.length;
const overusedThemes = topEntries(themeCounts, visualThemes.length)
  .filter(([, count]) => count > expectedThemeCount * 1.5)
  .slice(0, 10);
const underusedThemes = [...themeCounts.entries()]
  .sort((a, b) => a[1] - b[1])
  .filter(([, count]) => count < expectedThemeCount * 0.5)
  .slice(0, 10);

const densityValues = seeds.map(({ density }) => density.total);
const densityOutliers = seeds
  .filter(({ density }) => density.total > median(densityValues) + 3)
  .slice(0, 10)
  .map(({ seed, density }) => `${density.total} details :: ${seedSummary(seed)}`);

const highestClassIdentity = [...seeds]
  .sort((a, b) => b.seed.classAnchorScore - a.seed.classAnchorScore || b.budget.normalized['Class Identity'] - a.budget.normalized['Class Identity'])
  .slice(0, 10);

function diversityScore(entry) {
  const { seed, density } = entry;
  const themeRarity = 1 - (themeCounts.get(seed.visualTheme.id) ?? 0) / sampleSize;
  const cultureRarity = 1 - (cultureCounts.get(seed.culturalOrigin.id) ?? 0) / sampleSize;
  const motifSpecificity = seed.narrativeVariant.id.includes(seed.narrativeMotif.id) ? 0.5 : 1;
  return themeRarity * 35 + cultureRarity * 20 + motifSpecificity * 25 + density.total * 2 + seed.classAnchorScore * 2;
}

const highestDiversity = [...seeds]
  .map((entry) => ({ ...entry, diversityScore: diversityScore(entry) }))
  .sort((a, b) => b.diversityScore - a.diversityScore)
  .slice(0, 10);

console.log('A. Layer contribution statistics');
for (const layer of layerOrder) {
  console.log(`${layer}: ${formatPercent((layerTotals.get(layer) ?? 0) / sampleSize)}`);
}
console.log('\nLayer dominance counts');
for (const [layer, count] of topEntries(dominanceCounts, layerOrder.length)) {
  console.log(`${String(count).padStart(5, ' ')}  ${layer}`);
}
console.log('\nTheme-over-class dominance events');
for (const [key, count] of topEntries(themeDominatesClass, 10)) console.log(`${String(count).padStart(5, ' ')}  ${key}`);
console.log('\nMotif-over-class dominance events');
for (const [key, count] of topEntries(motifDominatesClass, 10)) console.log(`${String(count).padStart(5, ' ')}  ${key}`);

console.log('\nB. Theme distribution');
for (const [theme, count] of topEntries(themeCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);
console.log('\nAdaptive theme weight test (top penalties)');
for (const [themeWeight, count] of topEntries(adaptivePenaltyCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${themeWeight}`);
console.log('\nAverage adaptive theme weights');
for (const [theme, totalWeight] of topEntries(adaptiveThemeWeights, 20)) {
  const count = themeCounts.get(theme) ?? 1;
  console.log(`${(totalWeight / count).toFixed(1).padStart(5, ' ')}  ${theme}`);
}

console.log('\nC. Scholar trigger analysis');
for (const [trigger, count] of topEntries(scholarTriggers, 30)) console.log(`${String(count).padStart(5, ' ')}  ${trigger}`);

console.log('\nD. Class readability analysis');
for (const [className, values] of [...classScores.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  console.log(`${className}: avg ${average.toFixed(2)} | median ${median(values).toFixed(1)} | min ${Math.min(...values)} | max ${Math.max(...values)} | n ${values.length}`);
}

console.log('\nE. Detail density analysis');
for (const [bucket, count] of topEntries(detailDensityCounts, 30)) console.log(`${String(count).padStart(5, ' ')}  ${bucket}`);
console.log('Detail density outliers');
for (const item of densityOutliers) console.log(item);

console.log('\nF. Entropy report');
console.log(`Theme entropy: ${themeEntropy.entropy.toFixed(3)} bits`);
console.log(`Theme entropy normalized: ${(themeEntropy.normalized * 100).toFixed(1)}%`);
console.log('Most overused themes');
for (const [theme, count] of overusedThemes) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);
console.log('Most underused themes');
for (const [theme, count] of underusedThemes) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);

console.log('\nG. 30 test characters');
generatedSamples.forEach((seed, index) => console.log(`${index + 1}. ${seedSummary(seed)}`));

console.log('\nH. 10 highest class identity characters');
highestClassIdentity.forEach(({ seed }, index) => console.log(`${index + 1}. ${seedSummary(seed)}`));

console.log('\nI. 10 highest diversity score characters');
highestDiversity.forEach(({ seed, diversityScore: score }, index) => console.log(`${index + 1}. diversity ${score.toFixed(1)} | ${seedSummary(seed)}`));

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Identity analysis failed with ${failures.length} validation issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log(`\nIdentity analysis passed: ${sampleSize} generated seeds inspected.`);
