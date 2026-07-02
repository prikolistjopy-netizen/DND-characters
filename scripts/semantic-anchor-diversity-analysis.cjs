const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-anchor-diversity-${process.pid}`);
const localTsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const tsc = fs.existsSync(localTsc) ? localTsc : 'tsc';
const compile = spawnSync(tsc, ['--ignoreConfig', '--ignoreDeprecations', '6.0', '--outDir', outDir, '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node10', '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--lib', 'ES2020,DOM', path.join(root, 'src/lib/vnext/index.ts')], { stdio: 'inherit' });
if (compile.status !== 0) process.exit(compile.status ?? 1);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext } = require(path.join(outDir, 'lib/vnext/index.js'));

function inc(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function pct(count, total) { return Number((count / Math.max(1, total) * 100).toFixed(2)); }
function top(map, total, limit = 5) { return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key, count]) => ({ key, count, percent: pct(count, total) })); }
function entropy(map) { const total = [...map.values()].reduce((a, b) => a + b, 0); return Number((-[...map.values()].reduce((sum, count) => { const p = count / total; return sum + p * Math.log2(p); }, 0)).toFixed(3)); }
function keyFrame(text) { return text.toLowerCase().split(/[.;]/)[0].replace(/\b[a-z-]+\s+(?:token|blade|tool|cord|page|handaxe|knife|roll|card)\b/g, '<object>'); }

const sample = 10000;
const byAnchor = new Map();
const anchorPairs = new Map();
let mockDraftWords = 0;
let mockFinalWords = 0;
let mockRemovedPositive = 0;
let mockCritiqueTwo = 0;
let mockCount = 0;
let classEvidenceOk = 0;
let speciesOk = 0;
let professionBudgetLeak = 0;

for (let index = 0; index < sample; index += 1) {
  const writerMode = index % 2 === 0 ? 'mock_llm' : 'local';
  const result = generateDicebornVNext({ rngSeed: `anchor-diversity-${index}`, promptOptions: { writerMode } });
  const plan = result.semanticDirectorPlan;
  const seed = result.semanticSeed;
  if (!byAnchor.has(plan.dominantNarrativeAnchor)) byAnchor.set(plan.dominantNarrativeAnchor, { total: 0, interpretations: new Map(), sceneStrategies: new Map(), conflictCarriers: new Map(), scenes: new Map(), currentPremises: new Map(), obstacles: new Map(), compositions: new Map(), postures: new Map(), gestures: new Map(), environments: new Map(), classes: new Map(), salience: new Map(), power: new Map(), objects: new Map(), emotionalFocus: new Map(), phrases: new Map() });
  const bucket = byAnchor.get(plan.dominantNarrativeAnchor);
  bucket.total += 1;
  inc(bucket.interpretations, plan.anchorInterpretation);
  inc(bucket.sceneStrategies, plan.sceneStrategy);
  inc(bucket.conflictCarriers, plan.conflictCarrier);
  inc(bucket.scenes, seed.currentMoment.sceneArchetype);
  inc(bucket.currentPremises, seed.currentMoment.currentAction);
  inc(bucket.obstacles, seed.currentMoment.obstacle);
  inc(bucket.compositions, result.visualDirection.artDirection.composition);
  inc(bucket.postures, result.visualDirection.embodiment.posture);
  inc(bucket.gestures, result.visualDirection.embodiment.gesture);
  inc(bucket.environments, result.visualDirection.scene.environment);
  inc(bucket.classes, seed.identity.classId);
  inc(bucket.salience, seed.life.professionSalience);
  inc(bucket.power, seed.power.visibility);
  inc(bucket.objects, result.visualDirection.life.primaryTool);
  inc(bucket.emotionalFocus, plan.emotionalFocus);
  inc(bucket.phrases, keyFrame(result.prompt));
  inc(anchorPairs, `${plan.dominantNarrativeAnchor}+${result.visualDirection.artDirection.composition}`);
  const writer = result.compiledPrompt.promptWriter;
  if (writerMode === 'mock_llm') {
    const draftCount = writer?.draftPrompt.split(/\s+/).filter(Boolean).length ?? result.compiledPrompt.wordCount;
    mockDraftWords += draftCount;
    mockFinalWords += result.compiledPrompt.wordCount;
    if ((writer?.removedDetails.length ?? 0) > 0) mockRemovedPositive += 1;
    if ((writer?.critique.observations.length ?? 0) >= 2) mockCritiqueTwo += 1;
    mockCount += 1;
  }
  if (plan.classEvidencePlan.channels.length >= 2) classEvidenceOk += 1;
  if (plan.speciesMorphologyPlan) speciesOk += 1;
  if (seed.life.professionEvidenceChannels.length > plan.professionBudget.maxVisualChannels) professionBudgetLeak += 1;
}

const anchorReport = {};
const failures = [];
for (const [anchor, bucket] of byAnchor.entries()) {
  const report = {
    total: bucket.total,
    interpretationEntropy: entropy(bucket.interpretations),
    sceneStrategyEntropy: entropy(bucket.sceneStrategies),
    conflictCarrierEntropy: entropy(bucket.conflictCarriers),
    topCombinations: top(bucket.compositions, bucket.total, 3).map((item) => `${item.key} (${item.percent}%)`),
    topInterpretations: top(bucket.interpretations, bucket.total),
    topSceneStrategies: top(bucket.sceneStrategies, bucket.total),
    topConflictCarriers: top(bucket.conflictCarriers, bucket.total),
    topScenes: top(bucket.scenes, bucket.total),
    topEnvironments: top(bucket.environments, bucket.total),
    topPostures: top(bucket.postures, bucket.total),
    topObjects: top(bucket.objects, bucket.total),
    topPhrases: top(bucket.phrases, bucket.total),
    coverage: { interpretations: bucket.interpretations.size, sceneStrategies: bucket.sceneStrategies.size, compositions: bucket.compositions.size, postures: bucket.postures.size, environments: bucket.environments.size, conflictCarriers: bucket.conflictCarriers.size },
  };
  anchorReport[anchor] = report;
  if ((report.topCombinations[0]?.match(/\(([^%]+)%\)/)?.[1] ?? 0) > 22) failures.push(`${anchor} composition concentration ${report.topCombinations[0]}`);
  if ((report.topScenes[0]?.percent ?? 0) > 20) failures.push(`${anchor} scene concentration ${report.topScenes[0].percent}%`);
  if ((report.topEnvironments[0]?.percent ?? 0) > 18) failures.push(`${anchor} environment concentration ${report.topEnvironments[0].percent}%`);
  if ((report.topPostures[0]?.percent ?? 0) > 18) failures.push(`${anchor} posture concentration ${report.topPostures[0].percent}%`);
  if ((report.topPhrases[0]?.percent ?? 0) > 10) failures.push(`${anchor} phrase concentration ${report.topPhrases[0].percent}%`);
  if (bucket.interpretations.size < 8) failures.push(`${anchor} interpretations ${bucket.interpretations.size}`);
  if (bucket.sceneStrategies.size < 8) failures.push(`${anchor} scene strategies ${bucket.sceneStrategies.size}`);
  if (bucket.compositions.size < 6) failures.push(`${anchor} compositions ${bucket.compositions.size}`);
  if (bucket.postures.size < 6) failures.push(`${anchor} postures ${bucket.postures.size}`);
  if (bucket.environments.size < 6) failures.push(`${anchor} environments ${bucket.environments.size}`);
  if (bucket.conflictCarriers.size < 5) failures.push(`${anchor} conflict carriers ${bucket.conflictCarriers.size}`);
}

const mockCompression = Number(((1 - mockFinalWords / mockDraftWords) * 100).toFixed(2));
const metrics = {
  sample,
  anchors: Object.fromEntries([...byAnchor.entries()].map(([anchor, bucket]) => [anchor, bucket.total])),
  anchorReport,
  topAnchorCompositionPairs: top(anchorPairs, sample, 10),
  draftFinalCompressionPercent: mockCompression,
  mockWriterSample: mockCount,
  mockRemovedDetailsPositivePercent: pct(mockRemovedPositive, mockCount),
  mockCritiqueTwoObservationPercent: pct(mockCritiqueTwo, mockCount),
  classEvidencePercent: pct(classEvidenceOk, sample),
  speciesMorphologyPercent: pct(speciesOk, sample),
  professionBudgetLeakagePercent: pct(professionBudgetLeak, sample),
};
console.log('Semantic anchor diversity analysis');
console.log(JSON.stringify(metrics, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
if (metrics.classEvidencePercent < 95) failures.push(`class evidence ${metrics.classEvidencePercent}%`);
if (metrics.speciesMorphologyPercent < 98) failures.push(`species morphology ${metrics.speciesMorphologyPercent}%`);
if (metrics.professionBudgetLeakagePercent >= 1) failures.push(`profession budget leakage ${metrics.professionBudgetLeakagePercent}%`);
if (metrics.draftFinalCompressionPercent < 15 || metrics.draftFinalCompressionPercent > 25) failures.push(`mock compression ${metrics.draftFinalCompressionPercent}%`);
if (metrics.mockRemovedDetailsPositivePercent < 90) failures.push(`mock removed details ${metrics.mockRemovedDetailsPositivePercent}%`);
if (metrics.mockCritiqueTwoObservationPercent < 80) failures.push(`mock critique observations ${metrics.mockCritiqueTwoObservationPercent}%`);
if (failures.length) {
  console.error('Semantic anchor diversity analysis failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Semantic anchor diversity analysis passed');
