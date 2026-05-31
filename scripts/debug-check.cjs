const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.debug-check-build');
const sampleSize = 5000;

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

const { generateCharacterSeed, validateGeneratedSeed, resetSmartCandidatePoolMemory } = require(path.join(outDir, 'lib/generator.js'));
const { visualThemes, visualThemeVariants, narrativeMotifs, narrativeVariants, culturalOrigins, themeContentProfiles } = require(path.join(outDir, 'data/seedData.js'));

const failures = [];

function hasAny(tags, values) {
  return values.some((value) => tags.includes(value));
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topEntries(map, limit = 20) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const motifCounts = new Map();
const narrativeVariantCounts = new Map();
const themeCounts = new Map();
const themeVariantCounts = new Map();
const storyDetailCounts = new Map();
const combinationCounts = new Map();
const cultureCounts = new Map();
const classScoreCounts = new Map();
const classScoreTotals = new Map();
const scholarThemeCounts = new Map();
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
let sequentialSimilarityTotal = 0;
let sequentialSimilarityMax = 0;
let sequentialComparisonCount = 0;
let consecutiveVisualCoreDuplicateCount = 0;
let tooSimilarSequentialCount = 0;
let equipmentContradictionCount = 0;
let companionActiveCount = 0;
let legendaryCompanionCount = 0;
let frontierCompanionGroupCount = 0;
let frontierCompanionActiveCount = 0;
let conflictCount = 0;
const mismatchCounts = {
  weaponLanguage: 0,
  armorLanguage: 0,
  silhouette: 0,
  companion: 0,
  visualMotif: 0,
  pillar: 0,
};
const companionByClass = new Map();
const companionByBuildTemplate = new Map();
const companionClassTotals = new Map();
const companionBuildTemplateTotals = new Map();
const warnings = [];

function classifyValidationIssue(issue) {
  const message = issue.message;
  if (message.includes('weapon language') || message.includes('blade weapon language') || message.includes('mechanical tool language') || message.includes('cane sword language')) mismatchCounts.weaponLanguage += 1;
  if (message.includes('armor language') || message.includes('academy robes') || message.includes('hunter leather')) mismatchCounts.armorLanguage += 1;
  if (message.includes('silhouette profile') || message.includes('companion silhouette') || message.includes('dragon_warden') || message.includes('falconer') || message.includes('beastmaster')) mismatchCounts.silhouette += 1;
  if (message.includes('companion must') || message.includes('legendary companion') || message.includes('major/legendary companion')) mismatchCounts.companion += 1;
  if (message.includes('visual motif')) mismatchCounts.visualMotif += 1;
  if (message.includes('fantasy pillar')) mismatchCounts.pillar += 1;
  if (message.includes('equipment enchantment')) equipmentContradictionCount += 1;
}

function isFrontierCompanionGroup(seed) {
  return ['ranger', 'druid'].includes(seed.primaryClass) || seed.buildTemplate.id === 'frontier_hunter' || ['trail_warden', 'monster_tracker', 'beast_slayer', 'forest_sprite'].includes(seed.visualTheme.id);
}

function isVoidFx(seed) { return seed.fx.tags.includes('void') || /void|black-violet|purple/.test(seed.fx.name); }
function isHolyFx(seed) { return seed.fx.tags.includes('holy') || /holy|divine|spectral feather/.test(seed.fx.name); }
function isFeyFx(seed) { return seed.fx.tags.includes('fey') || /fey|petal|witchfire|pollen|butterfl/.test(seed.fx.name); }
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
  return (isVoidFx(seed) && ['holy', 'fey'].includes(family)) || (isHolyFx(seed) && ['void', 'fey', 'necrotic'].includes(family)) || (isFeyFx(seed) && ['void', 'holy', 'necrotic', 'mechanical'].includes(family));
}

for (const theme of visualThemes) {
  const count = visualThemeVariants.filter((variant) => variant.visualThemeId === theme.id).length;
  if (count < 3) {
    failures.push(`visual theme ${theme.id} has only ${count} variant(s)`);
  }
}

for (const motif of narrativeMotifs) {
  const count = narrativeVariants.filter((variant) => variant.narrativeMotifId === motif.id).length;
  if (count < 3) {
    failures.push(`narrative motif ${motif.id} has only ${count} variant(s)`);
  }
}

const voidFx = ['black-violet motes', 'void glow', 'purple void energy', 'drifting void ash', 'black-violet sparks', 'gravity distortions', 'fragmented stars'];
const feyFx = ['petals and whimsical particles', 'green witchfire', 'soft fey glow', 'drifting petals', 'glowing pollen', 'moonlit butterflies', 'floating blossoms'];

function detailOverlap(a, b) {
  const set = new Set(a ?? []);
  return (b ?? []).filter((item) => set.has(item)).length;
}
function visualCore(seed) {
  return [seed.buildTemplate.id, seed.visualTheme.id, seed.pose.name, seed.weapon.name, seed.light.name, seed.fx.name].join('|');
}
function similarityScore(seed, previous) {
  let score = 0;
  if (seed.buildTemplate.id === previous.buildTemplate.id) score += 15;
  if (seed.visualTheme.id === previous.visualTheme.id) score += 18;
  if (seed.visualThemeVariant.id === previous.visualThemeVariant.id) score += 8;
  if (seed.silhouetteProfile.id === previous.silhouetteProfile.id) score += 12;
  if (seed.armor.name === previous.armor.name) score += 10;
  if (seed.armorLanguage.id === previous.armorLanguage.id) score += 8;
  if (seed.weapon.name === previous.weapon.name) score += 12;
  if (seed.weaponLanguage.id === previous.weaponLanguage.id) score += 8;
  if (seed.pose.name === previous.pose.name) score += 14;
  if (seed.mood.name === previous.mood.name) score += 8;
  if (seed.light.name === previous.light.name) score += 10;
  if (seed.fx.name === previous.fx.name) score += 10;
  if (seed.visualMotif.id === previous.visualMotif.id) score += 8;
  if (seed.equipmentFinish.id === previous.equipmentFinish.id) score += 5;
  if (seed.equipmentEnchantment.id === previous.equipmentEnchantment.id) score += 5;
  if (seed.race.name === previous.race.name) score += 5;
  if (seed.culturalOrigin.id === previous.culturalOrigin.id) score += 5;
  if (seed.narrativeMotif.id === previous.narrativeMotif.id) score += 6;
  if (seed.narrativeVariant.id === previous.narrativeVariant.id) score += 4;
  if (seed.emotion === previous.emotion) score += 3;
  score += detailOverlap(seed.storyDetails, previous.storyDetails) * 2;
  score += detailOverlap(seed.cultureDetails, previous.cultureDetails) * 2;
  return score;
}
resetSmartCandidatePoolMemory();
let previousSequentialSeed = null;

for (let index = 0; index < sampleSize; index += 1) {
  const result = generateCharacterSeed();
  const { seed } = result;
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;
  const poseTags = seed.pose.tags;
  const summary = `${seed.race.name} ${seed.size} ${seed.classes.join('/')} ${seed.archetype.name} | ${seed.buildTemplate.id}/${seed.visualTheme.id}/${seed.visualThemeVariant?.id ?? 'no-theme-variant'}/${seed.narrativeMotif?.id ?? 'no-motif'}/${seed.narrativeVariant?.id ?? 'no-narrative-variant'} | ${seed.silhouette.name} | ${seed.armor.name} | ${seed.weapon.name} | ${seed.pose.name} | ${seed.fx.name}`;

  increment(motifCounts, seed.narrativeMotif?.id ?? 'no-motif');
  increment(narrativeVariantCounts, seed.narrativeVariant?.id ?? 'no-narrative-variant');
  increment(themeCounts, seed.visualTheme?.id ?? 'no-theme');
  increment(themeVariantCounts, seed.visualThemeVariant?.id ?? 'no-theme-variant');
  for (const detail of seed.storyDetails ?? []) {
    increment(storyDetailCounts, detail);
  }
  increment(combinationCounts, `${seed.primaryClass}+${seed.visualTheme?.id ?? 'no-theme'}+${seed.narrativeMotif?.id ?? 'no-motif'}`);
  increment(cultureCounts, seed.culturalOrigin?.id ?? 'no-culture');
  increment(silhouetteCounts, seed.silhouetteProfile?.id ?? 'no-silhouette');
  increment(visualMotifCounts, seed.visualMotif?.id ?? 'no-visual-motif');
  increment(companionCounts, seed.companion?.id ?? 'none');
  increment(armorLanguageCounts, seed.armorLanguage?.id ?? 'no-armor-language');
  increment(weaponLanguageCounts, seed.weaponLanguage?.id ?? 'no-weapon-language');
  if (seed.weaponLanguage?.id === 'plain_weapon_language') {
    increment(plainWeaponFallbackSources, seed.weapon.name);
    for (const tag of seed.weapon.tags) increment(plainWeaponFallbackTags, tag);
    increment(plainWeaponFallbackBuildTemplates, seed.buildTemplate.id);
    increment(plainWeaponFallbackThemes, seed.visualTheme.id);
    increment(plainWeaponFallbackClasses, seed.primaryClass);
  }
  increment(sequentialThemeCounts, seed.visualTheme.id);
  increment(sequentialPoseCounts, seed.pose.name);
  increment(sequentialFxCounts, seed.fx.name);
  for (const detail of seed.visualDetails ?? []) increment(sequentialDetailCounts, detail);
  if (previousSequentialSeed) {
    const score = similarityScore(seed, previousSequentialSeed);
    sequentialSimilarityTotal += score;
    sequentialSimilarityMax = Math.max(sequentialSimilarityMax, score);
    sequentialComparisonCount += 1;
    if (score >= 65) tooSimilarSequentialCount += 1;
    if (visualCore(seed) === visualCore(previousSequentialSeed)) consecutiveVisualCoreDuplicateCount += 1;
  }
  previousSequentialSeed = seed;
  increment(equipmentFinishCounts, seed.equipmentFinish?.id ?? 'no-equipment-finish');
  increment(equipmentEnchantmentCounts, seed.equipmentEnchantment?.id ?? 'no-equipment-enchantment');
  increment(enchantmentIntensityCounts, seed.enchantmentIntensity ?? 'no-intensity');
  if (hasContradictoryEquipmentFx(seed)) {
    equipmentContradictionCount += 1;
    failures.push(`equipment enchantment contradicts FX :: ${summary}`);
  }
  increment(companionClassTotals, seed.primaryClass);
  increment(companionBuildTemplateTotals, seed.buildTemplate.id);
  if (isFrontierCompanionGroup(seed)) frontierCompanionGroupCount += 1;
  if (seed.companion) {
    companionActiveCount += 1;
    increment(companionByClass, seed.primaryClass);
    increment(companionByBuildTemplate, seed.buildTemplate.id);
    if (seed.companion.tier === 'legendary') legendaryCompanionCount += 1;
    if (isFrontierCompanionGroup(seed)) frontierCompanionActiveCount += 1;
  }
  for (const detail of seed.visualDetails ?? []) increment(visualDetailCounts, detail);
  increment(classScoreCounts, `${seed.primaryClass}:${seed.classAnchorScore}`);
  classScoreTotals.set(seed.primaryClass, (classScoreTotals.get(seed.primaryClass) ?? 0) + seed.classAnchorScore);
  if (['divine_archivist', 'academy_mage', 'archive_performer'].includes(seed.visualTheme?.id)) {
    increment(scholarThemeCounts, seed.visualTheme.id);
  }

  const validationIssues = validateGeneratedSeed(seed);
  if (validationIssues.length > 0) conflictCount += 1;
  for (const issue of validationIssues) {
    classifyValidationIssue(issue);
    failures.push(`Generated validation issue: ${issue.message} :: ${summary}`);
  }

  const fxLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('FX: ')).length;
  if (fxLineCount !== 1) {
    failures.push(`seed should have exactly one FX line, found ${fxLineCount} :: ${summary}`);
  }

  const themeLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('Visual Theme: ')).length;
  if (themeLineCount !== 1 || !seed.visualTheme || !seed.visualTheme.id) {
    failures.push(`seed should have exactly one visual theme, found ${themeLineCount} :: ${summary}`);
  }

  const motifLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('Narrative Motif: ')).length;
  if (motifLineCount !== 1 || !seed.narrativeMotif || !seed.narrativeMotif.id) {
    failures.push(`seed should have exactly one narrative motif, found ${motifLineCount} :: ${summary}`);
  }

  if (!seed.silhouetteProfile || !seed.visualMotif || !seed.armorLanguage || !seed.weaponLanguage) {
    failures.push(`visual library layers must include silhouette/motif/armor language/weapon language :: ${summary}`);
  }

  if ((seed.visualDetails ?? []).length > 8 || new Set(seed.visualDetails ?? []).size !== (seed.visualDetails ?? []).length) {
    failures.push(`visual details must be unique and capped at 8 :: ${summary}`);
  }

  const storyDetailsLine = result.seedOutput.split('\n').find((line) => line.startsWith('Story Details: '));
  if (!storyDetailsLine || storyDetailsLine === 'Story Details: ' || storyDetailsLine.trim().endsWith(',')) {
    failures.push(`story details line must be non-empty and not end with comma :: ${summary}`);
  }

  if (!seed.storyDetails || seed.storyDetails.length < 2 || seed.storyDetails.some((detail) => detail.trim().length === 0 || detail.trim().endsWith(','))) {
    failures.push(`story details must contain at least two complete entries :: ${summary}`);
  }

  const expectedSizeByRace = {
    fairy: 'tiny',
    halfling: 'small',
    gnome: 'small',
  };
  const expectedSize = expectedSizeByRace[seed.race.name] ?? 'medium';
  if (seed.size !== expectedSize) {
    failures.push(`incorrect size category ${seed.size}, expected ${expectedSize} :: ${summary}`);
  }

  if (['small', 'tiny'].includes(seed.size) && hasAny(weaponTags, ['oversized', 'greataxe'])) {
    failures.push(`small/tiny race has giant weapon :: ${summary}`);
  }

  if (seed.race.name === 'fairy' && seed.armor.name === 'full plate with engraved pauldrons') {
    failures.push(`fairy received full plate :: ${summary}`);
  }

  if (seed.visualTheme.id === 'void_oracle' && !voidFx.includes(seed.fx.name)) {
    failures.push(`void_oracle without void FX :: ${summary}`);
  }

  if (seed.archetype.tags.includes('pirate') && !(seed.visualDetails.some((detail) => ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'].includes(detail)))) {
    failures.push(`pirate archetype without pirate-compatible gear :: ${summary}`);
  }

  if (
    seed.primaryClass === 'monk' &&
    seed.archetype.name === 'exiled temple guardian' &&
    seed.fx.name === 'black-violet motes' &&
    !(seed.classes.includes('warlock') || seed.archetype.tags.includes('cursed') || seed.archetype.tags.includes('void'))
  ) {
    failures.push(`monk temple guardian received black-violet motes without cursed/warlock/void :: ${summary}`);
  }

  if (
    seed.primaryClass === 'bard' &&
    seed.buildTemplate.id === 'divine_scholar' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`bard divine_scholar without divine/holy/temple context :: ${summary}`);
  }

  if (
    seed.primaryClass === 'bard' &&
    (seed.archetype.tags.includes('academy') || seed.archetype.tags.includes('scholar') || seed.archetype.tags.includes('cartographer')) &&
    seed.buildTemplate.id === 'divine_scholar' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`bard academy/scholar received divine_scholar without divine/holy/temple context :: ${summary}`);
  }

  if (
    seed.primaryClass === 'fighter' &&
    seed.buildTemplate.id === 'holy_warrior' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`fighter without holy archetype received holy_warrior :: ${summary}`);
  }

  if (seed.weapon.name === 'paired daggers' && ['forward rapier thrust', 'duelist turn with one foot sliding back'].includes(seed.pose.name)) {
    failures.push(`paired daggers received rapier thrust pose :: ${summary}`);
  }

  if (['tiny', 'small'].includes(seed.size) && seed.armor.name === 'full plate with engraved pauldrons') {
    failures.push(`small/tiny race received full plate :: ${summary}`);
  }

  if (
    seed.race.name === 'fairy' &&
    (seed.silhouette.name === 'stocky shield-forward stance' || seed.armor.name === 'full plate with engraved pauldrons' || seed.weapon.tags.includes('oversized'))
  ) {
    failures.push(`fairy received stocky/full plate/oversized loadout :: ${summary}`);
  }

  if (
    seed.silhouette.name === 'gadget-laden workshop silhouette' &&
    !(seed.primaryClass === 'artificer' || seed.buildTemplate.id === 'battle_engineer' || seed.archetype.tags.includes('academy') || seed.archetype.tags.includes('tools'))
  ) {
    failures.push(`gadget silhouette without artificer/battle_engineer/academy engineer :: ${summary}`);
  }

  if (
    seed.buildTemplate.id === 'fey_trickster' &&
    !feyFx.includes(seed.fx.name)
  ) {
    failures.push(`fey_trickster without fey-compatible FX :: ${summary}`);
  }

  if (seed.classes.includes('barbarian') && weaponTags.includes('rapier')) {
    failures.push(`barbarian with rapier :: ${summary}`);
  }

  if (
    seed.primaryClass === 'wizard' &&
    (hasAny(armorTags, ['light', 'medium', 'heavy', 'metal']) || hasAny(weaponTags, ['rapier', 'shield', 'longbow']))
  ) {
    failures.push(`wizard with armor/rapier/shield/longbow :: ${summary}`);
  }

  if (
    seed.primaryClass === 'monk' &&
    (hasAny(armorTags, ['light', 'medium', 'heavy', 'metal']) || hasAny(weaponTags, ['rapier', 'shield']))
  ) {
    failures.push(`monk with armor/rapier/shield :: ${summary}`);
  }

  if (
    seed.primaryClass === 'rogue' &&
    (armorTags.includes('heavy') || ['chain mail under a weathered tabard', 'half plate with campaign dents'].includes(seed.armor.name))
  ) {
    failures.push(`rogue with chain mail/half plate/heavy armor :: ${summary}`);
  }

  if (
    (['gnome', 'fairy', 'halfling'].includes(seed.race.name) || seed.race.tags.includes('fey')) &&
    ['towering bestial frame', 'tall robed column'].includes(seed.silhouette.name)
  ) {
    failures.push(`small/fey race with towering/tall silhouette :: ${summary}`);
  }

  if (
    poseTags.includes('map') &&
    !(hasAny(weaponTags, ['map', 'book', 'scroll', 'compass']) || seed.archetype.tags.includes('cartographer') || seed.archetype.tags.includes('scholar'))
  ) {
    failures.push(`studying map pose without map/book/scroll/compass/cartographer/scholar :: ${summary}`);
  }

  if (poseTags.includes('shield') && !(weaponTags.includes('shield') || armorTags.includes('shield'))) {
    failures.push(`shield pose without shield :: ${summary}`);
  }

  if (poseTags.includes('bow') && !weaponTags.includes('bow')) {
    failures.push(`bow pose without bow :: ${summary}`);
  }
}

const companionActivationRate = companionActiveCount / sampleSize;
const legendaryCompanionRate = legendaryCompanionCount / sampleSize;
const frontierCompanionRate = frontierCompanionGroupCount === 0 ? 0 : frontierCompanionActiveCount / frontierCompanionGroupCount;
if (companionActivationRate > 0.15) {
  failures.push(`companion activation exceeded hard cap: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
} else if (companionActivationRate > 0.12) {
  warnings.push(`companion activation above target warning band: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
} else if (companionActivationRate < 0.08) {
  warnings.push(`companion activation below target band: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
}
if (legendaryCompanionRate > 0.015) {
  failures.push(`legendary companion activation exceeded 1.5% cap: ${legendaryCompanionCount}/${sampleSize} (${(legendaryCompanionRate * 100).toFixed(1)}%)`);
}
if (frontierCompanionRate > 0.18) {
  failures.push(`ranger/druid/frontier companion activation exceeded 18% cap: ${frontierCompanionActiveCount}/${frontierCompanionGroupCount} (${(frontierCompanionRate * 100).toFixed(1)}%)`);
}
const noneIntensityRate = (enchantmentIntensityCounts.get('none') ?? 0) / sampleSize;
const subtleIntensityRate = (enchantmentIntensityCounts.get('subtle') ?? 0) / sampleSize;
const strongIntensityRate = (enchantmentIntensityCounts.get('strong') ?? 0) / sampleSize;
const legendaryIntensityRate = (enchantmentIntensityCounts.get('legendary') ?? 0) / sampleSize;
if (noneIntensityRate < 0.45 || noneIntensityRate > 0.65) failures.push(`equipment none intensity outside target: ${(noneIntensityRate * 100).toFixed(1)}%`);
if (subtleIntensityRate < 0.20 || subtleIntensityRate > 0.40) failures.push(`equipment subtle intensity outside target: ${(subtleIntensityRate * 100).toFixed(1)}%`);
if (strongIntensityRate < 0.05 || strongIntensityRate > 0.15) failures.push(`equipment strong intensity outside target: ${(strongIntensityRate * 100).toFixed(1)}%`);
if (legendaryIntensityRate > 0.035) failures.push(`equipment legendary intensity exceeded 3.5% cap: ${(legendaryIntensityRate * 100).toFixed(1)}%`);
const plainWeaponRate = (weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize;
const plainArmorRate = (armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize;
if (plainWeaponRate >= 0.20) failures.push(`plain weapon language fallback too high: ${(plainWeaponRate * 100).toFixed(1)}%`);
if (plainArmorRate >= 0.20) failures.push(`plain armor language fallback too high: ${(plainArmorRate * 100).toFixed(1)}%`);
if (equipmentContradictionCount > 0) failures.push(`equipment contradiction count should be zero: ${equipmentContradictionCount}`);
if (consecutiveVisualCoreDuplicateCount > 0) failures.push(`consecutive visual core duplicate count should be zero: ${consecutiveVisualCoreDuplicateCount}`);

const scholarTotal = [...scholarThemeCounts.values()].reduce((sum, count) => sum + count, 0);
if (scholarTotal > sampleSize * 0.28) {
  failures.push(`scholar themes dominated distribution: ${scholarTotal}/${sampleSize}`);
}

const divineArchivistCount = themeCounts.get('divine_archivist') ?? 0;
if (divineArchivistCount > sampleSize * 0.13) {
  failures.push(`divine_archivist dominated distribution: ${divineArchivistCount}/${sampleSize}`);
}

const maxCulture = topEntries(cultureCounts, 1)[0];
if (maxCulture && maxCulture[1] > sampleSize * 0.22) {
  failures.push(`culture dominated distribution: ${maxCulture[0]} = ${maxCulture[1]}`);
}

const maxNarrativeVariant = topEntries(narrativeVariantCounts, 1)[0];
if (maxNarrativeVariant && maxNarrativeVariant[1] > sampleSize * 0.16) {
  failures.push(`narrative variant dominated diversity: ${maxNarrativeVariant[0]} = ${maxNarrativeVariant[1]}`);
}

const maxThemeVariant = topEntries(themeVariantCounts, 1)[0];
if (maxThemeVariant && maxThemeVariant[1] > sampleSize * 0.16) {
  failures.push(`visual theme variant dominated diversity: ${maxThemeVariant[0]} = ${maxThemeVariant[1]}`);
}

const maxStoryDetail = topEntries(storyDetailCounts, 1)[0];
if (maxStoryDetail && maxStoryDetail[1] > sampleSize * 0.22) {
  failures.push(`story detail repeated too often: ${maxStoryDetail[0]} = ${maxStoryDetail[1]}`);
}

const maxCombination = topEntries(combinationCounts, 1)[0];
if (maxCombination && maxCombination[1] > sampleSize * 0.08) {
  failures.push(`class/theme/motif combination repeated too often: ${maxCombination[0]} = ${maxCombination[1]}`);
}

function printStats(title, map) {
  console.log(`\n${title}`);
  for (const [key, count] of topEntries(map)) {
    console.log(`${String(count).padStart(4, ' ')}  ${key}`);
  }
}

printStats('Top 20 motifs', motifCounts);
printStats('Top 20 narrative variants', narrativeVariantCounts);
printStats('Top 20 themes', themeCounts);
printStats('Top 20 visual theme variants', themeVariantCounts);
printStats('Top 20 story details', storyDetailCounts);
printStats('Culture distribution', cultureCounts);
printStats('Class identity score buckets', classScoreCounts);
console.log('\nAverage class identity score');
for (const [className, total] of [...classScoreTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const count = [...classScoreCounts.entries()]
    .filter(([bucket]) => bucket.startsWith(`${className}:`))
    .reduce((sum, [, bucketCount]) => sum + bucketCount, 0);
  console.log(`${className}: ${(total / count).toFixed(2)}/5`);
}
printStats('Scholar theme distribution', scholarThemeCounts);
console.log('\nVisual library distribution');
console.log(`Companion activation: ${companionActiveCount}/${sampleSize} (${((companionActiveCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Legendary companion activation: ${legendaryCompanionCount}/${sampleSize} (${((legendaryCompanionCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Ranger/druid/frontier companion activation: ${frontierCompanionActiveCount}/${frontierCompanionGroupCount} (${(frontierCompanionRate * 100).toFixed(1)}%)`);
console.log(`Conflict rate: ${conflictCount}/${sampleSize} (${((conflictCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Plain armor language fallback: ${armorLanguageCounts.get('plain_armor_language') ?? 0}/${sampleSize} (${(((armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Plain weapon language fallback: ${weaponLanguageCounts.get('plain_weapon_language') ?? 0}/${sampleSize} (${(((weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Equipment contradiction count: ${equipmentContradictionCount}`);
console.log('Enchantment intensity distribution');
for (const [key, count] of topEntries(enchantmentIntensityCounts, 10)) console.log(`${key}: ${count}/${sampleSize} (${((count / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Recent similarity average: ${(sequentialSimilarityTotal / Math.max(1, sequentialComparisonCount)).toFixed(1)}`);
console.log(`Recent similarity max: ${sequentialSimilarityMax}`);
console.log(`Too-similar sequential count: ${tooSimilarSequentialCount}`);
console.log(`Consecutive visual core duplicate count: ${consecutiveVisualCoreDuplicateCount}`);
console.log(`Consecutive visual core duplicate rate: ${((consecutiveVisualCoreDuplicateCount / Math.max(1, sequentialComparisonCount)) * 100).toFixed(1)}%`);
console.log('Mismatch statistics');
for (const [key, count] of Object.entries(mismatchCounts)) console.log(`${key}: ${count}`);
if (warnings.length > 0) {
  console.log('Warnings');
  for (const warning of warnings) console.log(`warning: ${warning}`);
}
console.log('Companion activation by class');
for (const [className, total] of [...companionClassTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = companionByClass.get(className) ?? 0;
  console.log(`${className}: ${active}/${total} (${((active / total) * 100).toFixed(1)}%)`);
}
console.log('Companion activation by build template');
for (const [templateId, total] of [...companionBuildTemplateTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = companionByBuildTemplate.get(templateId) ?? 0;
  console.log(`${templateId}: ${active}/${total} (${((active / total) * 100).toFixed(1)}%)`);
}
printStats('Top silhouettes', silhouetteCounts);
printStats('Top visual motifs', visualMotifCounts);
printStats('Top companions', companionCounts);
printStats('Top armor languages', armorLanguageCounts);
printStats('Top weapon languages', weaponLanguageCounts);
printStats('Top 20 plain weapon fallback sources', plainWeaponFallbackSources);
printStats('Plain weapon fallback by tag', plainWeaponFallbackTags);
printStats('Plain weapon fallback by buildTemplate', plainWeaponFallbackBuildTemplates);
printStats('Plain weapon fallback by visualTheme', plainWeaponFallbackThemes);
printStats('Plain weapon fallback by class', plainWeaponFallbackClasses);
printStats('Top repeated sequential visual themes', sequentialThemeCounts);
printStats('Top repeated sequential poses', sequentialPoseCounts);
printStats('Top repeated sequential FX', sequentialFxCounts);
printStats('Top repeated sequential visual details', sequentialDetailCounts);
printStats('Top equipment finishes', equipmentFinishCounts);
printStats('Top equipment enchantments', equipmentEnchantmentCounts);
printStats('Top visual details', visualDetailCounts);
console.log('\nUnderused detail pools');
for (const [themeId, count] of themeContentProfiles.map((profile) => [profile.themeId, themeCounts.get(profile.themeId) ?? 0]).sort((a, b) => a[1] - b[1]).slice(0, 10)) console.log(`${String(count).padStart(4, ' ')}  ${themeId}`);
printStats('Most common Class + Theme + Motif combinations', combinationCounts);

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Debug check failed with ${failures.length} issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log(`Debug check passed: ${sampleSize} generated seeds satisfy Content Bible v3 visual-library rules.`);
