const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.debug-check-build');

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

for (let index = 0; index < 500; index += 1) {
  const { seed } = generateCharacterSeed();
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;
  const poseTags = seed.pose.tags;
  const summary = `${seed.race.name} ${seed.classes.join('/')} ${seed.archetype.name} | ${seed.silhouette.name} | ${seed.armor.name} | ${seed.weapon.name} | ${seed.pose.name}`;

  for (const issue of validateGeneratedSeed(seed)) {
    failures.push(`Generated validation issue: ${issue.message} :: ${summary}`);
  }

  if (
    seed.primaryClass === 'monk' &&
    (hasAny(armorTags, ['light', 'medium', 'heavy', 'metal']) || hasAny(weaponTags, ['rapier', 'shield']))
  ) {
    failures.push(`monk with armor/rapier/shield :: ${summary}`);
  }

  if (['gnome', 'fairy', 'halfling'].includes(seed.race.name) && ['towering bestial frame', 'tall robed column'].includes(seed.silhouette.name)) {
    failures.push(`small/fairy race with towering/tall silhouette :: ${summary}`);
  }

  if (seed.classes.includes('barbarian') && weaponTags.includes('longbow')) {
    failures.push(`barbarian or fighter-barbarian with longbow main weapon :: ${summary}`);
  }

  if (['wizard', 'sorcerer'].includes(seed.primaryClass) && armorTags.includes('heavy')) {
    failures.push(`caster with heavy armor :: ${summary}`);
  }

  if (poseTags.includes('shield') && !weaponTags.includes('shield')) {
    failures.push(`shield pose without shield :: ${summary}`);
  }

  if (
    poseTags.includes('map') &&
    !(weaponTags.includes('map') || seed.archetype.tags.includes('cartographer') || seed.archetype.tags.includes('tools'))
  ) {
    failures.push(`map pose without map/cartographer/tools archetype :: ${summary}`);
  }
}

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Debug check failed with ${failures.length} issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log('Debug check passed: 500 generated seeds satisfy v2 coherence rules.');
