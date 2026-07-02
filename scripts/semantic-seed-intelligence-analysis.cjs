const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-semantic-intelligence-${process.pid}`);
const localTsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const tsc = fs.existsSync(localTsc) ? localTsc : 'tsc';
const compile = spawnSync(tsc, [
  '--ignoreConfig', '--ignoreDeprecations', '6.0', '--outDir', outDir,
  '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node10',
  '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--lib', 'ES2020,DOM',
  path.join(root, 'src/lib/vnext/index.ts'),
], { stdio: 'inherit' });
if (compile.status !== 0) process.exit(compile.status ?? 1);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext, generateDicebornVNextForSession, CLASS_PROFESSION_AFFINITY } = require(path.join(outDir, 'lib/vnext/index.js'));

function pct(count, total) { return Number((count / total * 100).toFixed(2)); }
function inc(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function top(map, limit = 8) { return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key, count]) => ({ key, count })); }
function words(text) { return text.trim().split(/\s+/).filter(Boolean).length; }

const sample = 5000;
const salience = new Map();
const professions = new Map();
const dominantAnchors = new Map();
const supportingAnchors = new Map();
const scenes = new Map();
const environments = new Map();
const compositions = new Map();
const classProfession = new Map();
let classEvidenceOk = 0;
let speciesMorphologyOk = 0;
let professionDominanceLeakage = 0;
let professionBudgetLeakage = 0;
let titleProfessionLeakage = 0;
let suppressedLeakage = 0;
let finalWords = 0;
let draftWords = 0;
let critiqueRemovals = 0;
let professionPromptFraction = 0;

for (let index = 0; index < sample; index += 1) {
  const result = generateDicebornVNext({ rngSeed: `semantic-intelligence-${index}` });
  const seed = result.semanticSeed;
  const plan = result.semanticDirectorPlan;
  inc(salience, seed.life.professionSalience);
  inc(professions, seed.identity.professionId);
  inc(dominantAnchors, plan.dominantNarrativeAnchor);
  inc(supportingAnchors, plan.supportingNarrativeAnchor);
  inc(scenes, seed.currentMoment.sceneArchetype);
  inc(environments, result.visualDirection.scene.environment);
  inc(compositions, result.visualDirection.artDirection.composition);
  inc(classProfession, `${seed.identity.classId}:${seed.identity.professionId}`);
  if (plan.classEvidencePlan.channels.length >= 2) classEvidenceOk += 1;
  if (plan.speciesMorphologyPlan && result.visualDirection.embodiment.proportions) speciesMorphologyOk += 1;
  if (seed.life.professionSalience !== 'dominant' && plan.dominantNarrativeAnchor === 'profession') professionDominanceLeakage += 1;
  if (seed.life.professionEvidenceChannels.length > plan.professionBudget.maxVisualChannels) professionBudgetLeakage += 1;
  if ((seed.life.professionSalience === 'background' || seed.life.professionSalience === 'trace') && result.compiledPrompt.promptWriter?.promptPlan.title.toLowerCase().includes(seed.identity.profession.toLowerCase())) titleProfessionLeakage += 1;
  const promptLower = result.prompt.toLowerCase();
  for (const fact of plan.suppressedFacts) if (promptLower.includes(fact.replace(/_/g, ' '))) suppressedLeakage += 1;
  finalWords += result.compiledPrompt.wordCount;
  const draft = result.compiledPrompt.promptWriter?.draftPrompt ?? result.prompt;
  draftWords += words(draft);
  critiqueRemovals += result.compiledPrompt.promptWriter?.removedDetails.length ?? 0;
  const professionWord = seed.identity.profession.toLowerCase().split(' ')[0];
  professionPromptFraction += (promptLower.match(new RegExp(`\\b${professionWord}\\b`, 'g')) || []).length / Math.max(1, result.compiledPrompt.wordCount);
}

const salienceObject = Object.fromEntries([...salience.entries()].map(([key, count]) => [key, { count, percent: pct(count, sample) }]));
const maxProfession = top(professions, 1)[0];
const metrics = {
  sample,
  salience: salienceObject,
  dominantProfessionPercent: pct(salience.get('dominant') || 0, sample),
  backgroundTracePercent: pct((salience.get('background') || 0) + (salience.get('trace') || 0), sample),
  maxProfessionShare: maxProfession ? { profession: maxProfession.key, percent: pct(maxProfession.count, sample) } : null,
  dominantAnchors: top(dominantAnchors),
  supportingAnchors: top(supportingAnchors),
  topProfessions: top(professions),
  topScenes: top(scenes),
  topEnvironments: top(environments),
  topCompositions: top(compositions),
  classEvidencePercent: pct(classEvidenceOk, sample),
  speciesMorphologyPercent: pct(speciesMorphologyOk, sample),
  professionDominanceLeakagePercent: pct(professionDominanceLeakage, sample),
  professionBudgetLeakagePercent: pct(professionBudgetLeakage, sample),
  titleProfessionLeakage,
  suppressedLeakage,
  averageProfessionPromptFraction: Number((professionPromptFraction / sample).toFixed(4)),
  averageFinalWords: Number((finalWords / sample).toFixed(1)),
  averageDraftWords: Number((draftWords / sample).toFixed(1)),
  averageCompressionPercent: Number(((1 - finalWords / draftWords) * 100).toFixed(2)),
  averageCritiqueRemovals: Number((critiqueRemovals / sample).toFixed(2)),
};

const lamplighterTrace = [
  { label: 'Human Warlock Lamplighter', input: { rngSeed: 'trace-human-warlock-lamplighter', classId: 'warlock', speciesId: 'human', professionId: 'lamplighter', professionSalience: 'trace' } },
  { label: 'Dwarf Paladin Lamplighter', input: { rngSeed: 'trace-dwarf-paladin-lamplighter', classId: 'paladin', speciesId: 'dwarf', professionId: 'lamplighter', professionSalience: 'trace' } },
  { label: 'Half-Orc Barbarian Lamplighter', input: { rngSeed: 'trace-half-orc-barbarian-lamplighter', classId: 'barbarian', speciesId: 'half_orc', professionId: 'lamplighter', professionSalience: 'trace' } },
].map((caseItem) => {
  const result = generateDicebornVNext(caseItem.input);
  return {
    label: caseItem.label,
    salience: result.semanticSeed.life.professionSalience,
    dominant: result.semanticDirectorPlan.dominantNarrativeAnchor,
    currentMoment: result.semanticSeed.currentMoment.currentAction,
    posture: result.visualDirection.embodiment.posture,
    composition: result.visualDirection.artDirection.composition,
    environment: result.visualDirection.scene.environment,
    tool: result.visualDirection.life.primaryTool,
    power: result.semanticSeed.power.relationshipToSource,
    trace: result.visualDirection.life.livedInTrace,
  };
});

const salienceLadder = ['background', 'trace', 'secondary', 'strong', 'dominant'].map((professionSalience) => {
  const result = generateDicebornVNext({ rngSeed: `ladder-warlock-physician-${professionSalience}`, classId: 'warlock', speciesId: 'human', professionId: 'physician', professionSalience });
  return {
    professionSalience,
    title: result.compiledPrompt.promptWriter?.promptPlan.title,
    channels: result.semanticSeed.life.professionEvidenceChannels,
    tool: result.visualDirection.life.primaryTool,
    environment: result.visualDirection.scene.environment,
    promptWords: result.compiledPrompt.wordCount,
  };
});

const sessionHistory = { lastProfessions: [], lastSceneArchetypes: [], lastEnvironments: [], lastCompositions: [], lastProfessionSalience: [], lastDominantAnchors: [], lastTools: [] };
const sessionRolls = [];
for (let index = 0; index < 16; index += 1) {
  const result = generateDicebornVNextForSession({ rngSeed: `session-memory-${index}` }, sessionHistory);
  sessionRolls.push({ profession: result.semanticSeed.identity.professionId, salience: result.semanticSeed.life.professionSalience, scene: result.semanticSeed.currentMoment.sceneArchetype, environment: result.visualDirection.scene.environment, composition: result.visualDirection.artDirection.composition, dominant: result.semanticDirectorPlan.dominantNarrativeAnchor });
  sessionHistory.lastProfessions.push(result.semanticSeed.identity.professionId);
  sessionHistory.lastProfessionSalience.push(result.semanticSeed.life.professionSalience);
  sessionHistory.lastSceneArchetypes.push(result.semanticSeed.currentMoment.sceneArchetype);
  sessionHistory.lastEnvironments.push(result.visualDirection.scene.environment);
  sessionHistory.lastCompositions.push(result.visualDirection.artDirection.composition);
  sessionHistory.lastDominantAnchors.push(result.semanticDirectorPlan.dominantNarrativeAnchor);
  sessionHistory.lastTools.push(result.visualDirection.life.primaryTool);
}

const deterministicA = generateDicebornVNext({ rngSeed: 'determinism-semantic-intelligence', classId: 'warlock', speciesId: 'human', professionId: 'lamplighter', professionSalience: 'trace' });
const deterministicB = generateDicebornVNext({ rngSeed: 'determinism-semantic-intelligence', classId: 'warlock', speciesId: 'human', professionId: 'lamplighter', professionSalience: 'trace' });
const deterministicOk = deterministicA.prompt === deterministicB.prompt && JSON.stringify(deterministicA.semanticSeed.selectedFactIds) === JSON.stringify(deterministicB.semanticSeed.selectedFactIds);

console.log('Semantic seed intelligence analysis');
console.log(JSON.stringify({ metrics, affinityMatrix: CLASS_PROFESSION_AFFINITY, lamplighterTrace, salienceLadder, promptWriterExample: { plan: deterministicA.compiledPrompt.promptWriter?.promptPlan, draft: deterministicA.compiledPrompt.promptWriter?.draftPrompt, critique: deterministicA.compiledPrompt.promptWriter?.critique, final: deterministicA.prompt }, sessionRolls, deterministicOk }, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}

const failures = [];
if (metrics.dominantProfessionPercent > 5) failures.push(`dominant profession ${metrics.dominantProfessionPercent}%`);
if (metrics.backgroundTracePercent < 45) failures.push(`background+trace ${metrics.backgroundTracePercent}%`);
if (metrics.maxProfessionShare && metrics.maxProfessionShare.percent > 8) failures.push(`profession ${metrics.maxProfessionShare.profession} ${metrics.maxProfessionShare.percent}%`);
if (metrics.classEvidencePercent < 95) failures.push(`class evidence ${metrics.classEvidencePercent}%`);
if (metrics.speciesMorphologyPercent < 98) failures.push(`species morphology ${metrics.speciesMorphologyPercent}%`);
if (metrics.professionDominanceLeakagePercent > 1) failures.push(`profession dominance leakage ${metrics.professionDominanceLeakagePercent}%`);
if (metrics.professionBudgetLeakagePercent > 1) failures.push(`profession budget leakage ${metrics.professionBudgetLeakagePercent}%`);
if (metrics.titleProfessionLeakage > 0) failures.push(`profession title leakage ${metrics.titleProfessionLeakage}`);
if (metrics.suppressedLeakage > 0) failures.push(`suppressed fact leakage ${metrics.suppressedLeakage}`);
if (!deterministicOk) failures.push('determinism failed');
if (failures.length) {
  console.error('Semantic seed intelligence analysis failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Semantic seed intelligence analysis passed');
