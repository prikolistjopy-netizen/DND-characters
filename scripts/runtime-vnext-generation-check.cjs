const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-vnext-runtime-${process.pid}`);
const localTsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const tsc = fs.existsSync(localTsc) ? localTsc : 'tsc';

function fail(message) {
  console.error(`Runtime vNext generation check failed: ${message}`);
  try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
  process.exit(1);
}

const compile = spawnSync(tsc, [
  '--ignoreConfig',
  '--ignoreDeprecations', '6.0',
  '--outDir', outDir,
  '--target', 'ES2020',
  '--module', 'commonjs',
  '--moduleResolution', 'node10',
  '--resolveJsonModule',
  '--esModuleInterop',
  '--skipLibCheck',
  '--lib', 'ES2020,DOM',
  path.join(root, 'src/lib/vnext/index.ts'),
], { stdio: 'inherit' });
if (compile.status !== 0) fail(`TypeScript compile exited with ${compile.status}`);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext } = require(path.join(outDir, 'lib/vnext/index.js'));

function hashText(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function fingerprint(result) {
  return hashText(JSON.stringify({
    seed: result.semanticSeed.deterministicSeed,
    selectedFactIds: result.semanticSeed.selectedFactIds,
    classId: result.semanticSeed.identity.classId,
    speciesId: result.semanticSeed.identity.speciesId,
    professionId: result.semanticSeed.identity.professionId,
    currentMoment: result.semanticSeed.currentMoment.currentAction,
    prompt: result.prompt,
  }));
}

const randomRows = [];
for (let index = 0; index < 20; index += 1) {
  const seed = `runtime-random-${Date.now()}-${process.pid}-${index}`;
  const result = generateDicebornVNext({ rngSeed: seed });
  randomRows.push({
    seed,
    fingerprint: fingerprint(result),
    prompt: result.prompt,
    title: `${result.semanticSeed.identity.speciesId} ${result.semanticSeed.identity.classId} ${result.semanticSeed.identity.professionId}`,
    profession: result.semanticSeed.identity.profession,
    currentMoment: result.semanticSeed.currentMoment.currentAction,
  });
}
const uniqueFingerprints = new Set(randomRows.map((row) => row.fingerprint));
const uniquePrompts = new Set(randomRows.map((row) => row.prompt));
if (uniqueFingerprints.size < 15) fail(`expected at least 15 unique fingerprints from 20 seeds, got ${uniqueFingerprints.size}`);
if (uniquePrompts.size < 15) fail(`expected at least 15 unique prompts from 20 seeds, got ${uniquePrompts.size}`);

const lockedInput = { rngSeed: 'courtier-test-01', classId: 'warlock', speciesId: 'gnome', professionId: 'courtier' };
const deterministic = Array.from({ length: 5 }, () => generateDicebornVNext(lockedInput)).map(fingerprint);
if (new Set(deterministic).size !== 1) fail(`same seed and locks produced different fingerprints: ${deterministic.join(', ')}`);
const changedLock = fingerprint(generateDicebornVNext({ ...lockedInput, professionId: 'physician' }));
if (changedLock === deterministic[0]) fail('changing one lock did not change the fingerprint');
const changedSeed = fingerprint(generateDicebornVNext({ ...lockedInput, rngSeed: 'courtier-test-02' }));
if (changedSeed === deterministic[0]) fail('changing the seed did not change the fingerprint');

const courtier = generateDicebornVNext(lockedInput);
const courtierText = `${courtier.prompt}\n${courtier.visualDirection.embodiment.gesture}\n${courtier.visualDirection.artDirection.composition}`.toLowerCase();
for (const required of ['witness', 'threshold']) {
  if (!courtierText.includes(required)) fail(`courtier output is missing ${required}`);
}
if (/class stereotype|pressure presses at the edge of attention|purple smoke|purple warlock|belt clutter|readable runes/.test(courtierText)) {
  fail('courtier prompt still contains forbidden meta/stereotype/clutter wording');
}

const report = {
  randomUniqueFingerprints: uniqueFingerprints.size,
  randomUniquePrompts: uniquePrompts.size,
  firstTenRandomRows: randomRows.slice(0, 10).map(({ seed, fingerprint, title, profession, currentMoment }) => ({ seed, fingerprint, title, profession, currentMoment })),
  deterministicFingerprint: deterministic[0],
  changedLockFingerprint: changedLock,
  changedSeedFingerprint: changedSeed,
  courtierPrompt: courtier.prompt,
};
console.log('Runtime vNext generation check passed');
console.log(JSON.stringify(report, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
