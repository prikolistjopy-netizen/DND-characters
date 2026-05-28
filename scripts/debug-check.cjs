const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.debug-check-build');
const sampleSize = 1000;

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

const failures = [];

function hasAny(tags, values) {
  return values.some((value) => tags.includes(value));
}

for (let index = 0; index < sampleSize; index += 1) {
  const result = generateCharacterSeed();
  const { seed } = result;
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;
  const poseTags = seed.pose.tags;
  const summary = `${seed.race.name} ${seed.classes.join('/')} ${seed.archetype.name} | ${seed.buildTemplate.id} | ${seed.silhouette.name} | ${seed.armor.name} | ${seed.weapon.name} | ${seed.pose.name}`;

  for (const issue of validateGeneratedSeed(seed)) {
    failures.push(`Generated validation issue: ${issue.message} :: ${summary}`);
  }

  const fxLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('FX: ')).length;
  if (fxLineCount !== 1) {
    failures.push(`seed should have exactly one FX line, found ${fxLineCount} :: ${summary}`);
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
    !(seed.archetype.tags.includes('scholar') || seed.archetype.tags.includes('cartographer') || seed.archetype.tags.includes('academy'))
  ) {
    failures.push(`bard divine_scholar without scholar/cartographer/academy/lore :: ${summary}`);
  }

  if (
    seed.silhouette.name === 'gadget-laden workshop silhouette' &&
    !(seed.primaryClass === 'artificer' || seed.buildTemplate.id === 'battle_engineer' || seed.archetype.tags.includes('academy') || seed.archetype.tags.includes('tools'))
  ) {
    failures.push(`gadget silhouette without artificer/battle_engineer/academy engineer :: ${summary}`);
  }

  if (
    seed.buildTemplate.id === 'fey_trickster' &&
    !['petals and whimsical particles', 'green witchfire', 'soft fey glow'].includes(seed.fx.name)
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

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Debug check failed with ${failures.length} issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log(`Debug check passed: ${sampleSize} generated seeds satisfy build-template v2 coherence rules.`);
