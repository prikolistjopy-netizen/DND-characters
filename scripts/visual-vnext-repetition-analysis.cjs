const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-vnext-analysis-${process.pid}`);
const tsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
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
if (compile.status !== 0) process.exit(compile.status ?? 1);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext } = require(path.join(outDir, 'lib/vnext/index.js'));

const sample = 1000;
const maps = Object.fromEntries(['currentMoment','sceneArchetype','obstacle','failurePoint','hiddenPressure','contradiction','posture','gesture','gaze','primaryTool','livedInTrace','powerVisibility','manifestationCarrier','environment','composition','lighting','paletteRole','focalOrder','sentenceOpening','firstVerb'].map((key) => [key, new Map()]));
const pairCounts = new Map();
const tripleCounts = new Map();
const classManifestation = new Map();
const classPalette = new Map();
const professionChannels = new Map();
let latentLeak = 0;
let fullApparition = 0;
let failed = 0;

function inc(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function top(map, limit = 10) { return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit); }
function firstVerb(text) { return (text.toLowerCase().match(/\b(stabilizes|opens|keeps|compares|prepares|shields|pauses|selects|hears|protects|chooses|holds|raises|measures|kneels|deflects|uses|repositions|steps|recognizes|finds|hides)\b/) || ['unknown'])[0]; }

for (let index = 0; index < sample; index += 1) {
  const result = generateDicebornVNext({ rngSeed: `visual-audit-${index}` });
  const seed = result.semanticSeed;
  const visual = result.visualDirection;
  if (!result.qa.passed) failed += 1;
  if (seed.power.visibility === 'latent' && /aura|halo|full apparition|floating rune/i.test(result.prompt)) latentLeak += 1;
  if (seed.power.visibility === 'full_apparition') fullApparition += 1;
  inc(maps.currentMoment, seed.currentMoment.currentAction);
  inc(maps.sceneArchetype, seed.currentMoment.sceneArchetype);
  inc(maps.obstacle, seed.currentMoment.obstacle);
  inc(maps.failurePoint, seed.currentMoment.failurePoint);
  inc(maps.hiddenPressure, seed.currentMoment.hiddenPressure);
  inc(maps.contradiction, seed.tension.roleContradiction);
  inc(maps.posture, visual.embodiment.posture);
  inc(maps.gesture, visual.embodiment.gesture);
  inc(maps.gaze, visual.embodiment.gaze);
  inc(maps.primaryTool, visual.life.primaryTool);
  inc(maps.livedInTrace, visual.life.livedInTrace);
  inc(maps.powerVisibility, seed.power.visibility);
  inc(maps.manifestationCarrier, seed.power.manifestationCarrier);
  inc(maps.environment, seed.world.environment);
  inc(maps.composition, visual.artDirection.composition);
  inc(maps.lighting, visual.artDirection.lighting);
  inc(maps.paletteRole, visual.artDirection.paletteRoles.join('|'));
  inc(maps.focalOrder, visual.artDirection.focalOrder.join('|'));
  inc(maps.sentenceOpening, result.prompt.split(/[.!?]/).map((part) => part.trim()).filter(Boolean)[0] || '');
  inc(maps.firstVerb, firstVerb(result.prompt));
  inc(pairCounts, `${seed.identity.professionId}+${visual.life.primaryTool}`);
  inc(pairCounts, `${seed.identity.classId}+${seed.power.visibility}+${seed.power.manifestationCarrier}`);
  inc(pairCounts, `${seed.currentMoment.sceneArchetype}+${visual.artDirection.composition}`);
  inc(pairCounts, `${seed.world.environment}+${visual.artDirection.lighting}`);
  inc(tripleCounts, `${seed.identity.classId}+${seed.identity.professionId}+${seed.currentMoment.sceneArchetype}`);
  inc(classManifestation, `${seed.identity.classId}+${seed.power.visibility}`);
  inc(classPalette, `${seed.identity.classId}+${visual.artDirection.paletteRoles[0]}`);
  const channels = [visual.life.primaryTool, visual.embodiment.posture, visual.embodiment.gesture, visual.life.livedInTrace, visual.life.materials].filter(Boolean).length;
  professionChannels.set(seed.identity.professionId, Math.min(channels, professionChannels.get(seed.identity.professionId) || channels));
}

const failures = [];
const currentMomentTop = top(maps.currentMoment, 1)[0];
const postureTop = top(maps.posture, 1)[0];
const toolTop = top(maps.primaryTool, 1)[0];
const sentenceTop = top(maps.sentenceOpening, 1)[0];
if (currentMomentTop?.[1] > sample * 0.05) failures.push(`one current moment exceeds 5%: ${currentMomentTop[1]}/${sample}`);
if (postureTop?.[1] > sample * 0.12) failures.push(`one posture exceeds 12%: ${postureTop[1]}/${sample}`);
if (toolTop?.[1] > sample * 0.08) failures.push(`one primary tool exceeds 8%: ${toolTop[1]}/${sample}`);
if (fullApparition > sample * 0.05) failures.push(`full apparition exceeds 5%: ${fullApparition}/${sample}`);
for (const [profession, channels] of professionChannels.entries()) if (channels < 3) failures.push(`profession ${profession} has fewer than 3 visual channels`);
if (latentLeak) failures.push(`latent power leakage count ${latentLeak}`);
if (sentenceTop?.[1] > sample * 0.5) failures.push(`one sentence opening dominates: ${sentenceTop[1]}/${sample}`);
const classCollapse = top(classManifestation, 1)[0];
if (classCollapse?.[1] > sample * 0.12) failures.push(`class manifestation pattern too dominant: ${classCollapse[0]} ${classCollapse[1]}/${sample}`);

const report = {
  sample,
  failedQa: failed,
  fullApparitionRate: fullApparition / sample,
  latentLeak,
  topCurrentMoments: top(maps.currentMoment, 8),
  topSceneArchetypes: top(maps.sceneArchetype, 8),
  topPostures: top(maps.posture, 5),
  topTools: top(maps.primaryTool, 8),
  topManifestations: top(maps.manifestationCarrier, 8),
  topCompositions: top(maps.composition, 8),
  topLighting: top(maps.lighting, 5),
  topPaletteRoles: top(maps.paletteRole, 5),
  topFocalOrders: top(maps.focalOrder, 5),
  topPairs: top(pairCounts, 10),
  topTriples: top(tripleCounts, 10),
  promptVerbDiversity: maps.firstVerb.size,
  sceneArchetypeCoverage: maps.sceneArchetype.size,
  professionVisualChannelMinimum: Math.min(...professionChannels.values()),
};
console.log('Visual vNext repetition analysis');
console.log(JSON.stringify(report, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
if (failures.length) {
  console.error('Blocking visual vNext repetition failures:');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Visual vNext repetition analysis passed');
