const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(os.tmpdir(), `diceborn-env-power-${process.pid}`);
const localTsc = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
const tsc = fs.existsSync(localTsc) ? localTsc : 'tsc';
const compile = spawnSync(tsc, ['--ignoreConfig', '--ignoreDeprecations', '6.0', '--outDir', outDir, '--target', 'ES2020', '--module', 'commonjs', '--moduleResolution', 'node10', '--resolveJsonModule', '--esModuleInterop', '--skipLibCheck', '--lib', 'ES2020,DOM', path.join(root, 'src/lib/vnext/index.ts')], { stdio: 'inherit' });
if (compile.status !== 0) process.exit(compile.status ?? 1);
fs.writeFileSync(path.join(outDir, 'package.json'), '{"type":"commonjs"}\n');
const { generateDicebornVNext } = require(path.join(outDir, 'lib/vnext/index.js'));

function inc(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function pct(count, total) { return Number((count / Math.max(1, total) * 100).toFixed(2)); }
function top(map, total, limit = 10) { return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key, count]) => ({ key, count, percent: pct(count, total) })); }
function table(headers, rows) { return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((row) => `| ${row.map((value) => String(value).replace(/\n/g, '<br>')).join(' | ')} |`).join('\n')}`; }
function words(text) { return text.split(/\s+/).filter(Boolean).length; }
function manifestationKey(text) { return text.toLowerCase().replace(/\b(the|a|an|one|single|near|before|after|without|with|and|or|of|to|in|as|it|is)\b/g, '').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 8).join(' '); }

function warlockResult(index) {
  return generateDicebornVNext({ rngSeed: `warlock-env-v2-${index}`, classId: 'warlock', speciesId: 'human', professionSalience: 'trace' });
}
const warlockRows = Array.from({ length: 100 }, (_, index) => warlockResult(index));
const env = new Map(), roles = new Map(), expressions = new Map(), strategies = new Map();
for (const result of warlockRows) {
  inc(env, result.visualDirection.scene.environment);
  inc(roles, result.semanticSeed.world.environmentRole);
  inc(expressions, result.semanticSeed.currentMoment.obstacleExpression);
  inc(strategies, result.semanticDirectorPlan.sceneStrategy);
}
const first20 = warlockRows.slice(0, 20).map((result, index) => [
  index + 1,
  `warlock-env-v2-${index}`,
  result.visualDirection.scene.environment,
  result.semanticSeed.currentMoment.obstacleExpression,
  result.semanticSeed.world.environmentRole,
  result.semanticDirectorPlan.sceneStrategy,
  result.semanticDirectorPlan.conflictCarrier,
  result.semanticSeed.currentMoment.obstacle,
  result.semanticSeed.currentMoment.currentAction,
]);
const candidateBefore = [
  ['sealed civic threshold', 100, 'returned immediately by chooseEnvironment because trace salience sets environmentControlAllowed=false'],
];
const sampleAfter = warlockRows[0];
const candidateAfter = sampleAfter.semanticSeed.scoreTrace.filter((entry) => entry.step === 'visual.environmentCandidate').slice(0, 12).map((entry) => [entry.candidateId, entry.score, entry.reasons.join('; ')]);

const classes = ['warlock', 'cleric', 'paladin', 'wizard', 'druid', 'rogue', 'barbarian', 'monk'];
const used = { decisions: new Set(), modes: new Set(), channels: new Set(), envs: new Set(), comps: new Set(), strategies: new Set() };
const fpRows = [];
for (const classId of classes) {
  let best = null;
  let bestScore = -1;
  for (let index = 0; index < 1500; index += 1) {
    const result = generateDicebornVNext({ rngSeed: `fp-v2-${classId}-${index}`, classId, speciesId: 'human', professionSalience: 'trace' });
    if (result.semanticDirectorPlan.dominantNarrativeAnchor !== 'forbidden_power') continue;
    const seed = result.semanticSeed;
    let score = 0;
    if (!used.decisions.has(seed.power.decision)) score += 10;
    if (!used.modes.has(seed.power.conflictMode)) score += 10;
    if (!used.channels.has(seed.power.evidenceChannel)) score += 10;
    if (!used.envs.has(result.visualDirection.scene.environment)) score += 6;
    if (!used.comps.has(result.visualDirection.artDirection.composition)) score += 4;
    if (!used.strategies.has(result.semanticDirectorPlan.sceneStrategy)) score += 4;
    if (score > bestScore) { best = result; bestScore = score; }
    if (score >= 44) break;
  }
  if (!best) best = generateDicebornVNext({ rngSeed: `fp-v2-${classId}-fallback`, classId, speciesId: 'human', professionSalience: 'trace' });
  used.decisions.add(best.semanticSeed.power.decision);
  used.modes.add(best.semanticSeed.power.conflictMode);
  used.channels.add(best.semanticSeed.power.evidenceChannel);
  used.envs.add(best.visualDirection.scene.environment);
  used.comps.add(best.visualDirection.artDirection.composition);
  used.strategies.add(best.semanticDirectorPlan.sceneStrategy);
  fpRows.push(best);
}

const sample = 10000;
const classEnv = new Map(), anchorEnv = new Map(), strategyEnv = new Map(), exprEnv = new Map();
const classEnvUnique = new Map(), classRoleUnique = new Map();
const fpMode = new Map(), fpDecision = new Map(), fpChannel = new Map(), fpClassDecision = new Map(), fpManifest = new Map();
let forbiddenCount = 0;
for (let index = 0; index < sample; index += 1) {
  const result = generateDicebornVNext({ rngSeed: `env-power-qa-${index}` });
  const seed = result.semanticSeed;
  const environment = result.visualDirection.scene.environment;
  inc(classEnv, `${seed.identity.classId} -> ${environment}`);
  inc(anchorEnv, `${result.semanticDirectorPlan.dominantNarrativeAnchor} -> ${environment}`);
  inc(strategyEnv, `${result.semanticDirectorPlan.sceneStrategy} -> ${environment}`);
  inc(exprEnv, `${seed.currentMoment.obstacleExpression} -> ${environment}`);
  if (!classEnvUnique.has(seed.identity.classId)) classEnvUnique.set(seed.identity.classId, new Set());
  if (!classRoleUnique.has(seed.identity.classId)) classRoleUnique.set(seed.identity.classId, new Set());
  classEnvUnique.get(seed.identity.classId).add(environment);
  classRoleUnique.get(seed.identity.classId).add(seed.world.environmentRole);
  if (result.semanticDirectorPlan.dominantNarrativeAnchor === 'forbidden_power') {
    forbiddenCount += 1;
    inc(fpMode, seed.power.conflictMode);
    inc(fpDecision, seed.power.decision);
    inc(fpChannel, seed.power.evidenceChannel);
    inc(fpClassDecision, `${seed.identity.classId} -> ${seed.power.decision}`);
    inc(fpManifest, manifestationKey(result.visualDirection.power.manifestation));
  }
}

const mockSample = 1000;
let accepted = 0, rejected = 0, priorityViolations = 0, professionViolations = 0, addedTools = 0, changedEnvironments = 0, changedManifestations = 0, critiqueTwo = 0;
let acceptedDraftWords = 0, acceptedFinalWords = 0;
const rejectionReasons = new Map();
for (let index = 0; index < mockSample; index += 1) {
  const local = generateDicebornVNext({ rngSeed: `mock-safety-${index}`, promptOptions: { writerMode: 'local' } });
  const mock = generateDicebornVNext({ rngSeed: `mock-safety-${index}`, promptOptions: { writerMode: 'mock_llm' } });
  const writer = mock.compiledPrompt.promptWriter;
  const rejectedRewrite = writer?.warnings?.includes('mock_rewrite_rejected') || writer?.critique.observations?.includes('mock_rewrite_rejected');
  if (rejectedRewrite) {
    rejected += 1;
    for (const warning of writer?.warnings ?? []) if (warning !== 'mock_rewrite_rejected') inc(rejectionReasons, warning);
  } else {
    accepted += 1;
    acceptedDraftWords += words(writer?.draftPrompt ?? mock.prompt);
    acceptedFinalWords += words(writer?.finalPrompt ?? mock.prompt);
  }
  if (writer && writer.critique.observations.length >= 2) critiqueTwo += 1;
  if (!rejectedRewrite && writer && (!writer.critique.dominantAnchorClear || !writer.critique.classReadable || !writer.critique.speciesReadable || !writer.critique.conflictCarrierVisible || !writer.critique.sceneClear)) priorityViolations += 1;
  if (!rejectedRewrite && (writer?.critique.professionOverweight || writer?.critique.professionDominates)) professionViolations += 1;
  if (mock.visualDirection.life.primaryTool !== local.visualDirection.life.primaryTool) addedTools += 1;
  if (mock.visualDirection.scene.environment !== local.visualDirection.scene.environment) changedEnvironments += 1;
  if (mock.visualDirection.power.manifestation !== local.visualDirection.power.manifestation) changedManifestations += 1;
}
const acceptedCompression = accepted ? Number(((1 - acceptedFinalWords / acceptedDraftWords) * 100).toFixed(2)) : 0;

const failures = [];
const warlockTop = top(env, 100, 1)[0];
if (warlockTop.percent > 18) failures.push(`Warlock top environment ${warlockTop.percent}%`);
if (pct(env.get('sealed civic threshold') || 0, 100) > 12) failures.push(`sealed civic threshold ${pct(env.get('sealed civic threshold') || 0, 100)}%`);
if (env.size < 8) failures.push(`Warlock unique environments ${env.size}`);
if (strategies.size < 8) failures.push(`Warlock scene strategies ${strategies.size}`);
if (expressions.size < 6) failures.push(`Warlock obstacle expressions ${expressions.size}`);
if (roles.size < 5) failures.push(`Warlock environment roles ${roles.size}`);
const topExprEnv = top(exprEnv, sample, 1)[0];
const topFpDecision = top(fpDecision, forbiddenCount, 1)[0];
const topFpChannel = top(fpChannel, forbiddenCount, 1)[0];
const topFpManifest = top(fpManifest, forbiddenCount, 1)[0];
if (topExprEnv.percent > 25) failures.push(`obstacle expression maps to one environment ${topExprEnv.percent}%`);
if (topFpChannel.percent > 20) failures.push(`forbidden power evidence channel ${topFpChannel.percent}%`);
if (topFpDecision.percent > 18) failures.push(`forbidden power decision ${topFpDecision.percent}%`);
if (topFpManifest.percent > 5) failures.push(`repeated manifestation phrase ${topFpManifest.percent}%`);
if (priorityViolations > 0) failures.push(`mock priority violations ${priorityViolations}`);
if (professionViolations > 0) failures.push(`mock profession budget violations ${professionViolations}`);

fs.writeFileSync(path.join(root, 'warlock-environment-root-cause.md'), `# Warlock Environment Root Cause\n\n## Root Cause\n\nThe collapse first happened in \`directVisual() -> chooseEnvironment()\`. Before this patch, \`chooseEnvironment\` returned \`classEnvironment(seed)\` whenever profession salience did not allow environment control. Trace salience disables profession environment control, so every Human Warlock trace case bypassed world/environment candidates and returned the Warlock class fallback: \`sealed civic threshold\`.\n\nThis was not caused by profession salience candidate filtering, score ties, or the world environment picker. The resolver still selected varied \`world.environment\` facts, but Visual Director discarded them for trace/background/secondary professions.\n\n## Before-Fix Candidate Example\n\n${table(['Candidate environment', 'Score', 'Reason'], candidateBefore)}\n\n## After-Fix Candidate Score Example\n\nSeed: \`warlock-env-v2-0\`\n\n${table(['Candidate environment', 'Score', 'Reasons'], candidateAfter)}\n\n## Scope Check\n\nThe bug was strongest for Warlock because its class fallback was \`sealed civic threshold\`, but the same architecture also made every low-salience class lean toward its class fallback environment instead of using a scored environment pool.\n`);

fs.writeFileSync(path.join(root, 'warlock-environment-diversity-v2.md'), `# Warlock Environment Diversity v2\n\nControlled inputs: 100 Human Warlock results, profession salience trace, seeds \`warlock-env-v2-0..99\`.\n\n## Metrics\n\n- Unique environments: ${env.size}\n- Top environment: ${warlockTop.key} (${warlockTop.percent}%)\n- Sealed civic threshold: ${env.get('sealed civic threshold') || 0} count / ${pct(env.get('sealed civic threshold') || 0, 100)}%\n- Unique scene strategies: ${strategies.size}\n- Unique obstacle expressions: ${expressions.size}\n- Unique environment roles: ${roles.size}\n\n## Top Environments\n\n${table(['Environment', 'Count', 'Percent'], top(env, 100).map((item) => [item.key, item.count, `${item.percent}%`]))}\n\n## First 20 Controlled Results\n\n${table(['#', 'Seed', 'Environment', 'Obstacle expression', 'Environment role', 'Scene strategy', 'Conflict carrier', 'Obstacle', 'Current action'], first20)}\n`);

fs.writeFileSync(path.join(root, 'forbidden-power-class-matrix-v2.md'), `# Forbidden Power Class Matrix v2\n\nControlled dominant anchor: \`forbidden_power\`. Species fixed to Human, profession salience trace. Seeds were searched deterministically per class to maximize distinct decisions, conflict modes, evidence channels, environments, compositions, and scene strategies without adding content entities.\n\n## Matrix\n\n${table(['Class', 'Seed', 'Conflict mode', 'Decision', 'Evidence channel', 'Scene strategy', 'Environment', 'Composition', 'Manifestation', 'Action'], fpRows.map((result) => [result.semanticSeed.identity.classId, result.semanticSeed.deterministicSeed, result.semanticSeed.power.conflictMode, result.semanticSeed.power.decision, result.semanticSeed.power.evidenceChannel, result.semanticDirectorPlan.sceneStrategy, result.visualDirection.scene.environment, result.visualDirection.artDirection.composition, result.visualDirection.power.manifestation, result.semanticSeed.currentMoment.currentAction]))}\n\n## Diversity Summary\n\n- Unique power decisions: ${used.decisions.size}\n- Unique conflict modes: ${used.modes.size}\n- Unique evidence channels: ${used.channels.size}\n- Unique environments: ${used.envs.size}\n- Unique compositions: ${used.comps.size}\n- Unique scene strategies: ${used.strategies.size}\n`);

fs.writeFileSync(path.join(root, 'mock-writer-priority-safety.md'), `# Mock Writer Priority Safety\n\nSample: ${mockSample} deterministic mock rewrites. Mock rewrite now checks hard invariants after rewriting; violating rewrites are rejected, the local final is returned, and \`mock_rewrite_rejected\` is recorded.\n\n## Metrics\n\n- Accepted rewrites: ${accepted}\n- Rejected rewrites: ${rejected}\n- Priority violations after safety gate: ${priorityViolations}\n- Profession budget violations after safety gate: ${professionViolations}\n- Added tools: ${addedTools}\n- Changed environments: ${changedEnvironments}\n- Changed manifestations: ${changedManifestations}\n- Accepted rewrite compression: ${acceptedCompression}%\n- Meaningful critique >= 2 observations: ${pct(critiqueTwo, mockSample)}%\n\n## Top Rejection Reasons\n\n${table(['Reason', 'Count'], top(rejectionReasons, Math.max(1, rejected)).map((item) => [item.key, item.count]))}\n`);

console.log(JSON.stringify({
  warlock: { uniqueEnvironments: env.size, topEnvironment: warlockTop, sealedCivicThresholdPercent: pct(env.get('sealed civic threshold') || 0, 100), uniqueStrategies: strategies.size, uniqueObstacleExpressions: expressions.size, uniqueEnvironmentRoles: roles.size },
  forbiddenPower: { sample: forbiddenCount, topDecision: topFpDecision, topEvidenceChannel: topFpChannel, topManifestationPhrase: topFpManifest, matrixUniqueDecisions: used.decisions.size, matrixUniqueModes: used.modes.size, matrixUniqueChannels: used.channels.size },
  mockWriter: { accepted, rejected, priorityViolations, professionViolations, addedTools, changedEnvironments, changedManifestations, acceptedCompression, critiqueTwoPercent: pct(critiqueTwo, mockSample) },
  failures,
}, null, 2));
try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
if (failures.length) process.exit(1);
