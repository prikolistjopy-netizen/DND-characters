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

const { generateCharacterSeed, validateGeneratedSeed } = require(path.join(outDir, 'lib/generator.js'));
const { visualThemes, visualThemeVariants, narrativeMotifs, narrativeVariants, culturalOrigins } = require(path.join(outDir, 'data/seedData.js'));

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
  increment(classScoreCounts, `${seed.primaryClass}:${seed.classAnchorScore}`);
  classScoreTotals.set(seed.primaryClass, (classScoreTotals.get(seed.primaryClass) ?? 0) + seed.classAnchorScore);
  if (['divine_archivist', 'academy_mage', 'archive_performer'].includes(seed.visualTheme?.id)) {
    increment(scholarThemeCounts, seed.visualTheme.id);
  }

  for (const issue of validateGeneratedSeed(seed)) {
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
printStats('Most common Class + Theme + Motif combinations', combinationCounts);

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Debug check failed with ${failures.length} issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log(`Debug check passed: ${sampleSize} generated seeds satisfy hierarchical identity v6 rules.`);
