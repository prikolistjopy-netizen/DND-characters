const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.visual-director-vnext-build');
const sampleSize = 600;

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
], { cwd: root, stdio: 'inherit' });

writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json', 'affordances.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateIncrementalSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'incrementalResolver.js'));
const { resolveVisualDirectionVNext } = require(path.join(outDir, 'lib', 'vnext', 'visualDirector.js'));

const classes = ['class.warlock', 'class.fighter', 'class.cleric'];
const failures = [];
const visibility = new Map();
const sceneFamilies = new Map();
const compositionCounts = new Map();
let fullPatronMentions = 0;
let warlockCount = 0;
let warlockFullApparition = 0;
let duplicatePrimaryAnchors = 0;
const examples = [];

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

for (let index = 0; index < sampleSize; index += 1) {
  const classId = classes[index % classes.length];
  const seed = generateIncrementalSemanticSeedVNext({
    rngSeed: `visual-director-${index}`,
    classId,
    novelty: index % 4 === 0 ? 'high' : 'balanced',
    beamWidth: 18,
    branchFactor: 5,
  });
  const visual = resolveVisualDirectionVNext(seed);

  if (visual.readability.primaryAnchors.length > 2) failures.push(`Too many primary anchors at ${index}`);
  if (new Set(visual.readability.primaryAnchors).size !== visual.readability.primaryAnchors.length) duplicatePrimaryAnchors += 1;
  if (!visual.embodiment.gesture || !visual.life.primaryTool || !visual.scene.environment) failures.push(`Missing core visual field at ${index}`);
  if (visual.artDirection.paletteRoles.some((role) => /warlock|cleric|fighter|purple|gold|green/i.test(role))) failures.push(`Class-coded palette at ${index}`);
  if (visual.negativeConstraints.length < 4) failures.push(`Weak negative constraints at ${index}`);

  const serialized = JSON.stringify(visual).toLowerCase();
  if (serialized.includes('visible patron') && visual.power.visibility !== 'full-apparition') fullPatronMentions += 1;
  if (classId === 'class.warlock') {
    warlockCount += 1;
    if (visual.power.visibility === 'full-apparition') warlockFullApparition += 1;
  }

  increment(visibility, `${classId}:${visual.power.visibility}`);
  increment(sceneFamilies, `${classId}:${visual.scene.family}`);
  increment(compositionCounts, visual.artDirection.composition);

  if (examples.length < 15) {
    examples.push({
      seedId: seed.id,
      identity: `${seed.identity.species.label} ${seed.identity.class.label}, ${seed.identity.profession.label}`,
      semanticMoment: `${seed.currentMoment.action.label}; ${seed.currentMoment.goal.label}; ${seed.currentMoment.obstacle.label}`,
      visual: {
        anchors: visual.readability.primaryAnchors,
        posture: visual.embodiment.posture,
        gesture: visual.embodiment.gesture,
        tool: visual.life.primaryTool,
        power: visual.power,
        scene: visual.scene,
        composition: visual.artDirection.composition,
      },
    });
  }
}

const apparitionRate = warlockFullApparition / Math.max(1, warlockCount);
if (apparitionRate > 0.1) failures.push(`Warlock full apparition rate too high: ${apparitionRate}`);
if (fullPatronMentions > 0) failures.push(`Visible patron leaked into non-apparition directions: ${fullPatronMentions}`);
if (duplicatePrimaryAnchors > 0) failures.push(`Duplicate primary anchors: ${duplicatePrimaryAnchors}`);
if (sceneFamilies.size < 6) failures.push(`Scene family coverage too low: ${sceneFamilies.size}`);

const report = {
  sampleSize,
  warlockFullApparitionRate: apparitionRate,
  nonApparitionPatronLeaks: fullPatronMentions,
  duplicatePrimaryAnchors,
  visibilityByClass: Object.fromEntries([...visibility.entries()].sort()),
  sceneFamiliesByClass: Object.fromEntries([...sceneFamilies.entries()].sort()),
  topCompositions: [...compositionCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
  examples,
  failures,
};

console.log(JSON.stringify(report, null, 2));
console.log(`\nDiceborn Visual Director vNext analysis: ${failures.length} failure(s).`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exitCode = 1;
