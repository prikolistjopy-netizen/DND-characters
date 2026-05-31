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

const { generateCharacterSeed, resetSmartCandidatePoolMemory, validateGeneratedSeed } = require(path.join(outDir, 'lib/generator.js'));
const { visualThemes, silhouetteProfiles, visualMotifs, armorLanguages, weaponLanguages, themeContentProfiles } = require(path.join(outDir, 'data/seedData.js'));

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

function detailOverlap(a, b) {
  const bSet = new Set(b ?? []);
  return (a ?? []).filter((item) => bSet.has(item)).length;
}

function visualCore(seed) {
  return [
    seed.buildTemplate.id,
    seed.visualTheme.id,
    seed.pose.name,
    seed.weapon.name,
    seed.light.name,
    seed.fx.name,
  ].join(' | ');
}

function similarityScore(seed, previous) {
  let score = 0;
  const matches = [
    [seed.buildTemplate.id, previous.buildTemplate.id, 15],
    [seed.visualTheme.id, previous.visualTheme.id, 18],
    [seed.visualThemeVariant.id, previous.visualThemeVariant.id, 8],
    [seed.silhouetteProfile?.id, previous.silhouetteProfile?.id, 12],
    [seed.armor.name, previous.armor.name, 10],
    [seed.armorLanguage?.id, previous.armorLanguage?.id, 8],
    [seed.weapon.name, previous.weapon.name, 12],
    [seed.weaponLanguage?.id, previous.weaponLanguage?.id, 8],
    [seed.pose.name, previous.pose.name, 14],
    [seed.mood.name, previous.mood.name, 8],
    [seed.light.name, previous.light.name, 10],
    [seed.fx.name, previous.fx.name, 10],
    [seed.visualMotif?.id, previous.visualMotif?.id, 8],
    [seed.equipmentFinish?.id, previous.equipmentFinish?.id, 5],
    [seed.equipmentEnchantment?.id, previous.equipmentEnchantment?.id, 5],
    [seed.race.id, previous.race.id, 5],
    [seed.culturalOrigin.id, previous.culturalOrigin.id, 5],
    [seed.narrativeMotif.id, previous.narrativeMotif.id, 6],
    [seed.narrativeVariant.id, previous.narrativeVariant.id, 4],
  ];
  for (const [a, b, weight] of matches) if (a && a === b) score += weight;
  score += detailOverlap(seed.storyDetails, previous.storyDetails) * 2;
  score += detailOverlap(seed.cultureDetails, previous.cultureDetails) * 2;
  return score;
}

function detailDensity(seed) {
  const visual = seed.visualDetails.length;
  const story = seed.storyDetails.length;
  const culture = seed.cultureDetails.length;
  const companion = seed.companionDetails?.length ?? 0;
  return { visual, story, culture, companion, total: visual + story + culture + companion };
}

function seedSummary(seed) {
  return `${seed.primaryClass} ${seed.race.name} score ${seed.classAnchorScore}/5 | ${seed.culturalOrigin.label} | ${seed.fantasyPillar?.id ?? 'no-pillar'} | ${seed.buildTemplate.id} | ${seed.visualTheme.id}/${seed.visualThemeVariant.id} | ${seed.silhouetteProfile?.id ?? 'no-silhouette'} | ${seed.visualMotif?.id ?? 'no-motif'} | ${seed.armorLanguage?.id ?? 'no-armor-language'} | ${seed.weaponLanguage?.id ?? 'no-weapon-language'} | companion ${seed.companion?.id ?? 'none'} | ${seed.weapon.name} | ${seed.fx.name}`;
}

function classifyValidationIssue(issue, mismatchCounts) {
  const message = issue.message;
  if (message.includes('weapon language') || message.includes('blade weapon language') || message.includes('mechanical tool language') || message.includes('cane sword language')) mismatchCounts.weaponLanguage += 1;
  if (message.includes('armor language') || message.includes('academy robes') || message.includes('hunter leather')) mismatchCounts.armorLanguage += 1;
  if (message.includes('silhouette profile') || message.includes('companion silhouette') || message.includes('dragon_warden') || message.includes('falconer') || message.includes('beastmaster')) mismatchCounts.silhouette += 1;
  if (message.includes('companion must') || message.includes('legendary companion') || message.includes('major/legendary companion')) mismatchCounts.companion += 1;
  if (message.includes('visual motif')) mismatchCounts.visualMotif += 1;
}

function enchantmentFamily(seed) {
  const id = seed.equipmentEnchantment?.id ?? 'none';
  if (seed.enchantmentIntensity === 'none') return 'none';
  if (/holy|relic|stained_glass/.test(id)) return 'holy';
  if (/void|eclipse|starlight/.test(id)) return 'void';
  if (/fey|flower/.test(id)) return 'fey';
  if (/rune/.test(id)) return 'rune';
  if (/mechanical/.test(id)) return 'mechanical';
  if (/necrotic|grave/.test(id)) return 'necrotic';
  return 'battle';
}

function hasContradictoryEquipmentFx(seed) {
  const family = enchantmentFamily(seed);
  if (['none', 'rune'].includes(family)) return false;
  const fxName = seed.fx.name;
  const voidFx = seed.fx.tags.includes('void') || /void|black-violet|purple/.test(fxName);
  const holyFx = seed.fx.tags.includes('holy') || /holy|divine|spectral feather/.test(fxName);
  const feyFx = seed.fx.tags.includes('fey') || /fey|petal|witchfire|pollen|butterfl/.test(fxName);
  return (voidFx && ['holy', 'fey'].includes(family)) || (holyFx && ['void', 'fey', 'necrotic'].includes(family)) || (feyFx && ['void', 'holy', 'necrotic', 'mechanical'].includes(family));
}

function analyze(label, useSmartPool) {
  resetSmartCandidatePoolMemory();
  const failures = [];
  const seeds = [];
  const layerTotals = new Map(layerOrder.map((layer) => [layer, 0]));
  const dominanceCounts = new Map();
  const themeDominatesClass = new Map();
  const motifDominatesClass = new Map();
  const scholarTriggers = new Map();
  const classScores = new Map();
  const detailDensityCounts = new Map();
  const themeCounts = new Map();
  const cultureCounts = new Map();
  const combinationCounts = new Map();
  const generatedSamples = [];
  const silhouetteCounts = new Map();
  const visualMotifCounts = new Map();
  const companionCounts = new Map();
  const armorLanguageCounts = new Map();
  const weaponLanguageCounts = new Map();
  const equipmentFinishCounts = new Map();
  const equipmentEnchantmentCounts = new Map();
  const enchantmentIntensityCounts = new Map();
  const visualDetailCounts = new Map();
  const plainWeaponFallbackSources = new Map();
  const plainWeaponFallbackTags = new Map();
  const plainWeaponFallbackBuildTemplates = new Map();
  const plainWeaponFallbackThemes = new Map();
  const plainWeaponFallbackClasses = new Map();
  const sequentialThemeCounts = new Map();
  const sequentialPoseCounts = new Map();
  const sequentialFxCounts = new Map();
  const sequentialDetailCounts = new Map();
  let conflictCount = 0;
  let equipmentContradictionCount = 0;
  let companionActiveCount = 0;
  let legendaryCompanionCount = 0;
  let previousSequentialSeed = null;
  let sequentialSimilarityTotal = 0;
  let sequentialSimilarityMax = 0;
  let sequentialComparisonCount = 0;
  let consecutiveVisualCoreDuplicateCount = 0;
  let tooSimilarSequentialCount = 0;
  const companionByClass = new Map();
  const companionByBuildTemplate = new Map();
  const companionClassTotals = new Map();
  const companionBuildTemplateTotals = new Map();
  const mismatchCounts = {
    weaponLanguage: 0,
    armorLanguage: 0,
    silhouette: 0,
    companion: 0,
    visualMotif: 0,
  };

  for (let index = 0; index < sampleSize; index += 1) {
    const result = generateCharacterSeed({ useSmartPool });
    const { seed } = result;
    const issues = validateGeneratedSeed(seed);
    if (issues.length > 0) {
      conflictCount += 1;
      for (const issue of issues) classifyValidationIssue(issue, mismatchCounts);
      failures.push(`${seedSummary(seed)} :: ${issues.map((issue) => issue.message).join('; ')}`);
    }

    const budget = identityBudget(seed);
    for (const [layer, value] of Object.entries(budget.normalized)) increment(layerTotals, layer, value);
    increment(dominanceCounts, budget.dominantLayer);
    if (budget.normalized['Visual Theme'] > budget.normalized['Class Identity']) increment(themeDominatesClass, `${seed.primaryClass}+${seed.visualTheme.id}`);
    if (budget.normalized['Narrative Motif'] > budget.normalized['Class Identity']) increment(motifDominatesClass, `${seed.primaryClass}+${seed.narrativeMotif.id}`);

    increment(themeCounts, seed.visualTheme.id);
    increment(cultureCounts, seed.culturalOrigin.id);
    increment(silhouetteCounts, seed.silhouetteProfile?.id ?? 'no-silhouette');
    increment(visualMotifCounts, seed.visualMotif?.id ?? 'no-visual-motif');
    increment(companionCounts, seed.companion?.id ?? 'none');
    increment(armorLanguageCounts, seed.armorLanguage?.id ?? 'no-armor-language');
    increment(weaponLanguageCounts, seed.weaponLanguage?.id ?? 'no-weapon-language');
    if (seed.weaponLanguage?.id === 'plain_weapon_language') {
      increment(plainWeaponFallbackSources, seed.weapon.name);
      for (const tag of seed.weapon.tags ?? []) increment(plainWeaponFallbackTags, tag);
      increment(plainWeaponFallbackBuildTemplates, seed.buildTemplate.id);
      increment(plainWeaponFallbackThemes, seed.visualTheme.id);
      increment(plainWeaponFallbackClasses, seed.primaryClass);
    }
    increment(equipmentFinishCounts, seed.equipmentFinish?.id ?? 'no-equipment-finish');
    increment(equipmentEnchantmentCounts, seed.equipmentEnchantment?.id ?? 'no-equipment-enchantment');
    increment(enchantmentIntensityCounts, seed.enchantmentIntensity ?? 'no-intensity');
    if (hasContradictoryEquipmentFx(seed)) equipmentContradictionCount += 1;
    increment(companionClassTotals, seed.primaryClass);
    increment(companionBuildTemplateTotals, seed.buildTemplate.id);
    if (seed.companion) {
      companionActiveCount += 1;
      increment(companionByClass, seed.primaryClass);
      increment(companionByBuildTemplate, seed.buildTemplate.id);
      if (seed.companion.tier === 'legendary') legendaryCompanionCount += 1;
    }
    for (const detail of seed.visualDetails ?? []) {
      increment(visualDetailCounts, detail);
      increment(sequentialDetailCounts, detail);
    }
    increment(sequentialThemeCounts, seed.visualTheme.id);
    increment(sequentialPoseCounts, seed.pose.name);
    increment(sequentialFxCounts, seed.fx.name);
    if (previousSequentialSeed) {
      const score = similarityScore(seed, previousSequentialSeed);
      sequentialSimilarityTotal += score;
      sequentialSimilarityMax = Math.max(sequentialSimilarityMax, score);
      sequentialComparisonCount += 1;
      if (score >= 65) tooSimilarSequentialCount += 1;
      if (visualCore(seed) === visualCore(previousSequentialSeed)) consecutiveVisualCoreDuplicateCount += 1;
    }
    previousSequentialSeed = seed;
    increment(combinationCounts, `${seed.primaryClass}+${seed.visualTheme.id}+${seed.narrativeMotif.id}`);
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
    increment(detailDensityCounts, `companion:${density.companion}`);
    increment(detailDensityCounts, `total:${density.total}`);

    seeds.push({ seed, budget, density, index });
    if (generatedSamples.length < 30) generatedSamples.push(seed);
  }

  const themeEntropy = entropy(themeCounts);
  const silhouetteEntropy = entropy(silhouetteCounts);
  const expectedThemeCount = sampleSize / visualThemes.length;
  const overusedThemes = topEntries(themeCounts, visualThemes.length).filter(([, count]) => count > expectedThemeCount * 1.5).slice(0, 10);
  const underusedThemes = [...themeCounts.entries()].sort((a, b) => a[1] - b[1]).filter(([, count]) => count < expectedThemeCount * 0.5).slice(0, 10);
  const densityValues = seeds.map(({ density }) => density.total);
  const densityOutliers = seeds.filter(({ density }) => density.total > median(densityValues) + 3).slice(0, 10).map(({ seed, density }) => `${density.total} details :: ${seedSummary(seed)}`);
  const duplicateCombinationCount = [...combinationCounts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  const underusedDetailPools = themeContentProfiles
    .map((profile) => [profile.themeId, (themeCounts.get(profile.themeId) ?? 0)])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 10);
  const scholarTotal = [...themeCounts.entries()].filter(([theme]) => scholarThemes.has(theme)).reduce((sum, [, count]) => sum + count, 0);
  const topTheme = topEntries(themeCounts, 1)[0];
  const classScoreAverage = seeds.reduce((sum, { seed }) => sum + seed.classAnchorScore, 0) / seeds.length;
  const highestClassIdentity = [...seeds].sort((a, b) => b.seed.classAnchorScore - a.seed.classAnchorScore || b.budget.normalized['Class Identity'] - a.budget.normalized['Class Identity']).slice(0, 10);
  const highestDiversity = [...seeds]
    .map((entry) => {
      const { seed, density } = entry;
      const themeRarity = 1 - (themeCounts.get(seed.visualTheme.id) ?? 0) / sampleSize;
      const cultureRarity = 1 - (cultureCounts.get(seed.culturalOrigin.id) ?? 0) / sampleSize;
      const combinationRarity = 1 - (combinationCounts.get(`${seed.primaryClass}+${seed.visualTheme.id}+${seed.narrativeMotif.id}`) ?? 0) / sampleSize;
      return { ...entry, diversityScore: themeRarity * 30 + cultureRarity * 15 + combinationRarity * 25 + density.total * 2 + seed.classAnchorScore * 2 };
    })
    .sort((a, b) => b.diversityScore - a.diversityScore)
    .slice(0, 10);

  return {
    label,
    useSmartPool,
    failures,
    seeds,
    layerTotals,
    dominanceCounts,
    themeDominatesClass,
    motifDominatesClass,
    scholarTriggers,
    classScores,
    detailDensityCounts,
    themeCounts,
    cultureCounts,
    combinationCounts,
    generatedSamples,
    themeEntropy,
    silhouetteEntropy,
    overusedThemes,
    underusedThemes,
    densityOutliers,
    duplicateCombinationCount,
    scholarTotal,
    topTheme,
    classScoreAverage,
    highestClassIdentity,
    highestDiversity,
    silhouetteCounts,
    visualMotifCounts,
    companionCounts,
    armorLanguageCounts,
    weaponLanguageCounts,
    equipmentFinishCounts,
    equipmentEnchantmentCounts,
    enchantmentIntensityCounts,
    visualDetailCounts,
    equipmentContradictionCount,
    companionActiveCount,
    legendaryCompanionCount,
    companionByClass,
    companionByBuildTemplate,
    companionClassTotals,
    companionBuildTemplateTotals,
    mismatchCounts,
    conflictCount,
    underusedDetailPools,
    plainWeaponFallbackSources,
    plainWeaponFallbackTags,
    plainWeaponFallbackBuildTemplates,
    plainWeaponFallbackThemes,
    plainWeaponFallbackClasses,
    sequentialThemeCounts,
    sequentialPoseCounts,
    sequentialFxCounts,
    sequentialDetailCounts,
    sequentialSimilarityAverage: sequentialComparisonCount > 0 ? sequentialSimilarityTotal / sequentialComparisonCount : 0,
    sequentialSimilarityMax,
    tooSimilarSequentialCount,
    consecutiveVisualCoreDuplicateCount,
    consecutiveVisualCoreDuplicateRate: sequentialComparisonCount > 0 ? consecutiveVisualCoreDuplicateCount / sequentialComparisonCount : 0,
  };
}

const baseline = analyze('Baseline weighted selection', false);
const smart = analyze('Smart candidate pool selection', true);
const failures = [...baseline.failures.map((failure) => `baseline: ${failure}`), ...smart.failures.map((failure) => `smart: ${failure}`)];
const baselineUnderused = new Set(baseline.underusedThemes.map(([theme]) => theme));
const smartUnderusedActivation = [...baselineUnderused].reduce((sum, theme) => sum + (smart.themeCounts.get(theme) ?? 0), 0);
const baselineUnderusedActivation = [...baselineUnderused].reduce((sum, theme) => sum + (baseline.themeCounts.get(theme) ?? 0), 0);

console.log('A. Baseline vs smart candidate pool statistics');
for (const report of [baseline, smart]) {
  console.log(`\n${report.label}`);
  console.log(`Class identity average: ${report.classScoreAverage.toFixed(3)}/5`);
  console.log(`Theme entropy: ${report.themeEntropy.entropy.toFixed(3)} bits (${(report.themeEntropy.normalized * 100).toFixed(1)}% normalized)`);
  console.log(`Silhouette entropy: ${report.silhouetteEntropy.entropy.toFixed(3)} bits (${(report.silhouetteEntropy.normalized * 100).toFixed(1)}% normalized)`);
  console.log(`Top theme concentration: ${report.topTheme[0]} = ${report.topTheme[1]} (${formatPercent((report.topTheme[1] / sampleSize) * 100)})`);
  console.log(`Scholar theme concentration: ${report.scholarTotal} (${formatPercent((report.scholarTotal / sampleSize) * 100)})`);
  console.log(`Duplicate combination rate: ${formatPercent((report.duplicateCombinationCount / sampleSize) * 100)}`);
  console.log(`Companion activation: ${report.companionActiveCount} (${formatPercent((report.companionActiveCount / sampleSize) * 100)})`);
  console.log(`Legendary companion rate: ${report.legendaryCompanionCount} (${formatPercent((report.legendaryCompanionCount / sampleSize) * 100)})`);
  console.log(`Conflict rate: ${formatPercent((report.conflictCount / sampleSize) * 100)}`);
  console.log(`Mismatch counts: weapon ${report.mismatchCounts.weaponLanguage}, armor ${report.mismatchCounts.armorLanguage}, silhouette ${report.mismatchCounts.silhouette}, companion ${report.mismatchCounts.companion}, visual motif ${report.mismatchCounts.visualMotif}`);
  console.log(`Fallback language usage: armor ${report.armorLanguageCounts.get('plain_armor_language') ?? 0} (${formatPercent(((report.armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize) * 100)}), weapon ${report.weaponLanguageCounts.get('plain_weapon_language') ?? 0} (${formatPercent(((report.weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize) * 100)})`);
  console.log(`Equipment contradiction count: ${report.equipmentContradictionCount}`);
  console.log(`Recent similarity: avg ${report.sequentialSimilarityAverage.toFixed(1)}, max ${report.sequentialSimilarityMax}, too-similar ${report.tooSimilarSequentialCount}, visual-core duplicates ${report.consecutiveVisualCoreDuplicateCount} (${formatPercent(report.consecutiveVisualCoreDuplicateRate * 100)})`);
}

console.log(`\nUnderused theme activation from baseline-underused set: baseline ${baselineUnderusedActivation}, smart ${smartUnderusedActivation}`);
console.log(`Class identity delta smart-baseline: ${(smart.classScoreAverage - baseline.classScoreAverage).toFixed(3)}`);
console.log(`Theme entropy delta smart-baseline: ${(smart.themeEntropy.normalized - baseline.themeEntropy.normalized).toFixed(3)}`);
console.log(`Top-1 concentration delta smart-baseline: ${(((smart.topTheme[1] - baseline.topTheme[1]) / sampleSize) * 100).toFixed(2)} percentage points`);
console.log(`Scholar concentration delta smart-baseline: ${(((smart.scholarTotal - baseline.scholarTotal) / sampleSize) * 100).toFixed(2)} percentage points`);

function printLayerStats(report) {
  console.log(`\nLayer contribution statistics (${report.label})`);
  for (const layer of layerOrder) console.log(`${layer}: ${formatPercent((report.layerTotals.get(layer) ?? 0) / sampleSize)}`);
  console.log('Layer dominance counts');
  for (const [layer, count] of topEntries(report.dominanceCounts, layerOrder.length)) console.log(`${String(count).padStart(5, ' ')}  ${layer}`);
  console.log('Theme-over-class dominance events');
  for (const [key, count] of topEntries(report.themeDominatesClass, 10)) console.log(`${String(count).padStart(5, ' ')}  ${key}`);
  console.log('Motif-over-class dominance events');
  for (const [key, count] of topEntries(report.motifDominatesClass, 10)) console.log(`${String(count).padStart(5, ' ')}  ${key}`);
}
printLayerStats(smart);

console.log('\nB. Smart theme distribution');
for (const [theme, count] of topEntries(smart.themeCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);
console.log('\nC. Smart scholar trigger analysis');
for (const [trigger, count] of topEntries(smart.scholarTriggers, 30)) console.log(`${String(count).padStart(5, ' ')}  ${trigger}`);
console.log('\nD. Smart class readability analysis');
for (const [className, values] of [...smart.classScores.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  console.log(`${className}: avg ${average.toFixed(2)} | median ${median(values).toFixed(1)} | min ${Math.min(...values)} | max ${Math.max(...values)} | n ${values.length}`);
}
console.log('\nE. Smart detail density analysis');
for (const [bucket, count] of topEntries(smart.detailDensityCounts, 30)) console.log(`${String(count).padStart(5, ' ')}  ${bucket}`);
console.log('Detail density outliers');
for (const item of smart.densityOutliers) console.log(item);
console.log('\nF. Smart entropy report');
console.log(`Theme entropy: ${smart.themeEntropy.entropy.toFixed(3)} bits`);
console.log(`Theme entropy normalized: ${(smart.themeEntropy.normalized * 100).toFixed(1)}%`);
console.log('Most overused themes');
for (const [theme, count] of smart.overusedThemes) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);
console.log('Most underused themes');
for (const [theme, count] of smart.underusedThemes) console.log(`${String(count).padStart(5, ' ')}  ${theme}`);
console.log('\nVisual library distribution');
console.log(`Companion activation: ${smart.companionActiveCount}/${sampleSize} (${formatPercent((smart.companionActiveCount / sampleSize) * 100)})`);
console.log(`Legendary companion rate: ${smart.legendaryCompanionCount}/${sampleSize} (${formatPercent((smart.legendaryCompanionCount / sampleSize) * 100)})`);
console.log(`Mismatch counts: weapon ${smart.mismatchCounts.weaponLanguage}, armor ${smart.mismatchCounts.armorLanguage}, silhouette ${smart.mismatchCounts.silhouette}, companion ${smart.mismatchCounts.companion}, visual motif ${smart.mismatchCounts.visualMotif}`);
console.log(`Fallback language usage: armor ${smart.armorLanguageCounts.get('plain_armor_language') ?? 0}/${sampleSize} (${formatPercent(((smart.armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize) * 100)}), weapon ${smart.weaponLanguageCounts.get('plain_weapon_language') ?? 0}/${sampleSize} (${formatPercent(((smart.weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize) * 100)})`);
console.log(`Equipment contradiction count: ${smart.equipmentContradictionCount}`);
console.log(`Recent similarity: avg ${smart.sequentialSimilarityAverage.toFixed(1)}, max ${smart.sequentialSimilarityMax}, too-similar ${smart.tooSimilarSequentialCount}, visual-core duplicates ${smart.consecutiveVisualCoreDuplicateCount} (${formatPercent(smart.consecutiveVisualCoreDuplicateRate * 100)})`);
console.log('Top 20 plain weapon fallback sources');
for (const [item, count] of topEntries(smart.plainWeaponFallbackSources, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Plain weapon fallback by tag');
for (const [item, count] of topEntries(smart.plainWeaponFallbackTags, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Plain weapon fallback by build template');
for (const [item, count] of topEntries(smart.plainWeaponFallbackBuildTemplates, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Plain weapon fallback by visual theme');
for (const [item, count] of topEntries(smart.plainWeaponFallbackThemes, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Plain weapon fallback by class');
for (const [item, count] of topEntries(smart.plainWeaponFallbackClasses, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top repeated sequential visual themes');
for (const [item, count] of topEntries(smart.sequentialThemeCounts, 10)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top repeated sequential poses');
for (const [item, count] of topEntries(smart.sequentialPoseCounts, 10)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top repeated sequential FX');
for (const [item, count] of topEntries(smart.sequentialFxCounts, 10)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top repeated sequential visual details');
for (const [item, count] of topEntries(smart.sequentialDetailCounts, 10)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Equipment finish distribution');
for (const [item, count] of topEntries(smart.equipmentFinishCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Enchantment intensity distribution');
for (const [item, count] of topEntries(smart.enchantmentIntensityCounts, 10)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top equipment enchantments');
for (const [item, count] of topEntries(smart.equipmentEnchantmentCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Companion activation by class');
for (const [className, total] of [...smart.companionClassTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = smart.companionByClass.get(className) ?? 0;
  console.log(`${className}: ${active}/${total} (${formatPercent((active / total) * 100)})`);
}
console.log('Companion activation by build template');
for (const [templateId, total] of [...smart.companionBuildTemplateTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = smart.companionByBuildTemplate.get(templateId) ?? 0;
  console.log(`${templateId}: ${active}/${total} (${formatPercent((active / total) * 100)})`);
}
console.log('Top silhouettes');
for (const [item, count] of topEntries(smart.silhouetteCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top visual motifs');
for (const [item, count] of topEntries(smart.visualMotifCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top companions');
for (const [item, count] of topEntries(smart.companionCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top armor languages');
for (const [item, count] of topEntries(smart.armorLanguageCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Top weapon languages');
for (const [item, count] of topEntries(smart.weaponLanguageCounts, 20)) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('Underused detail pools');
for (const [item, count] of smart.underusedDetailPools) console.log(`${String(count).padStart(5, ' ')}  ${item}`);
console.log('\nG. 30 smart-pool test characters');
smart.generatedSamples.forEach((seed, index) => console.log(`${index + 1}. ${seedSummary(seed)}`));
console.log('\nH. 10 highest smart class identity characters');
smart.highestClassIdentity.forEach(({ seed }, index) => console.log(`${index + 1}. ${seedSummary(seed)}`));
console.log('\nI. 10 highest smart diversity score characters');
smart.highestDiversity.forEach(({ seed, diversityScore }, index) => console.log(`${index + 1}. diversity ${diversityScore.toFixed(1)} | ${seedSummary(seed)}`));

rmSync(outDir, { recursive: true, force: true });
if (failures.length > 0) {
  console.error(`Identity analysis failed with ${failures.length} validation issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}
console.log(`\nIdentity analysis passed: ${sampleSize} baseline and ${sampleSize} smart-pool generated seeds inspected.`);
