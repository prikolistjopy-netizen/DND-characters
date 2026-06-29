const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.semantic-vnext-build');
const sampleSize = 1200;

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
    '--resolveJsonModule',
    '--ignoreDeprecations',
    '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib',
    'ES2020,DOM',
    'src/lib/vnext/contracts.ts',
    'src/lib/vnext/resolver.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
copyFileSync(path.join(root, 'src', 'data', 'vnext', 'facts.json'), path.join(outDir, 'data', 'vnext', 'facts.json'));
copyFileSync(path.join(root, 'src', 'data', 'vnext', 'semantic-facts.json'), path.join(outDir, 'data', 'vnext', 'semantic-facts.json'));

const { generateSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'resolver.js'));

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function topEntries(map, limit = 10) {
  return [...map.entries()].sort((left, right) => right[1] - left[1]).slice(0, limit);
}

const classes = ['class.warlock', 'class.fighter', 'class.cleric'];
const classCounts = new Map();
const professionCounts = new Map();
const visibilityByClass = new Map(classes.map((id) => [id, new Map()]));
const goalByClass = new Map(classes.map((id) => [id, new Map()]));
const contradictionByClass = new Map(classes.map((id) => [id, new Map()]));
const failures = [];
const signatures = new Set();

for (let index = 0; index < sampleSize; index += 1) {
  const classId = classes[index % classes.length];
  const options = { rngSeed: `semantic-analysis-${index}`, classId, novelty: 'balanced', beamWidth: 14 };
  const first = generateSemanticSeedVNext(options);
  const second = generateSemanticSeedVNext(options);

  if (JSON.stringify(first) !== JSON.stringify(second)) failures.push(`Non-deterministic seed at ${index}`);
  if (first.identity.class.id !== classId) failures.push(`Class lock failed at ${index}`);
  if (!first.trace.entries.length) failures.push(`Missing trace at ${index}`);
  if (!Number.isFinite(first.scores.total)) failures.push(`Invalid total score at ${index}`);

  increment(classCounts, first.identity.class.id);
  increment(professionCounts, first.identity.profession.id);
  increment(visibilityByClass.get(classId), first.power.visibility.id);
  increment(goalByClass.get(classId), first.currentMoment.goal.id);
  increment(contradictionByClass.get(classId), first.psychology.contradiction.id);
  signatures.add([
    first.identity.class.id,
    first.identity.profession.id,
    first.psychology.contradiction.id,
    first.power.relationship.id,
    first.power.visibility.id,
    first.currentMoment.goal.id,
    first.currentMoment.action.id,
  ].join('|'));
}

const warlockVisibility = visibilityByClass.get('class.warlock');
const warlockTotal = [...warlockVisibility.values()].reduce((sum, count) => sum + count, 0);
const apparitionRate = (warlockVisibility.get('power-visibility.full-apparition') || 0) / Math.max(1, warlockTotal);
const uniqueProfessionCount = professionCounts.size;
const uniqueSignatureRate = signatures.size / sampleSize;

if (apparitionRate > 0.12) failures.push(`Warlock full apparition rate too high: ${(apparitionRate * 100).toFixed(2)}%`);
if (uniqueProfessionCount < 15) failures.push(`Profession coverage too low: ${uniqueProfessionCount}`);
if (uniqueSignatureRate < 0.35) failures.push(`Semantic signature diversity too low: ${(uniqueSignatureRate * 100).toFixed(2)}%`);

const report = {
  sampleSize,
  deterministic: failures.every((failure) => !failure.startsWith('Non-deterministic')),
  uniqueSemanticSignatures: signatures.size,
  uniqueSignatureRate,
  uniqueProfessions: uniqueProfessionCount,
  warlockFullApparitionRate: apparitionRate,
  classCounts: Object.fromEntries(classCounts),
  topProfessions: topEntries(professionCounts, 20),
  visibilityByClass: Object.fromEntries(classes.map((id) => [id, Object.fromEntries(topEntries(visibilityByClass.get(id), 20))])),
  goalsByClass: Object.fromEntries(classes.map((id) => [id, Object.fromEntries(topEntries(goalByClass.get(id), 20))])),
  contradictionsByClass: Object.fromEntries(classes.map((id) => [id, Object.fromEntries(topEntries(contradictionByClass.get(id), 20))])),
  failures,
};

console.log(JSON.stringify(report, null, 2));
console.log(`\nDiceborn semantic vNext analysis: ${failures.length} failure(s).`);
if (failures.length > 0) process.exitCode = 1;
