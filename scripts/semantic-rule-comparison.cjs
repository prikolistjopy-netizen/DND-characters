const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.semantic-rule-comparison-build');
const sampleSize = 600;

rmSync(outDir, { recursive: true, force: true });
run(
  'tsc',
  [
    '--ignoreConfig',
    '--outDir', outDir,
    '--module', 'commonjs',
    '--target', 'ES2020',
    '--moduleResolution', 'node10',
    '--resolveJsonModule',
    '--ignoreDeprecations', '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib', 'ES2020,DOM',
    'src/lib/vnext/contracts.ts',
    'src/lib/vnext/resolver.ts',
    'src/lib/vnext/ruleEngine.ts',
    'src/lib/vnext/resolverWithRules.ts',
    'src/lib/vnext/semanticCard.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'resolver.js'));
const { generateSemanticSeedVNextWithRules, createSemanticSignature } = require(path.join(outDir, 'lib', 'vnext', 'resolverWithRules.js'));
const { buildSemanticCharacterCard } = require(path.join(outDir, 'lib', 'vnext', 'semanticCard.js'));
const { getSemanticRuleCoverage } = require(path.join(outDir, 'lib', 'vnext', 'ruleEngine.js'));
const { getSemanticPilotFacts } = require(path.join(outDir, 'lib', 'vnext', 'resolver.js'));

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function summarize(generator) {
  const signatures = new Set();
  const professions = new Map();
  const visibility = new Map();
  const goals = new Map();
  const contradictions = new Map();
  const qaFlags = new Map();
  let apparitionCount = 0;
  let scoreTotal = 0;
  const history = [];

  for (let index = 0; index < sampleSize; index += 1) {
    const classId = index % 3 === 0 ? 'class.warlock' : index % 3 === 1 ? 'class.fighter' : 'class.cleric';
    const seed = generator({
      rngSeed: `rule-comparison-${index}`,
      classId,
      novelty: 'balanced',
      beamWidth: 14,
      repetitionHistory: history.slice(-80),
    });
    const signature = createSemanticSignature(seed);
    signatures.add(signature);
    history.push(signature);
    increment(professions, seed.identity.profession.id);
    increment(visibility, `${classId}:${seed.power.visibility.id}`);
    increment(goals, `${classId}:${seed.currentMoment.goal.id}`);
    increment(contradictions, `${classId}:${seed.psychology.contradiction.id}`);
    for (const flag of seed.qaFlags) increment(qaFlags, flag);
    if (classId === 'class.warlock' && seed.power.visibility.id === 'power-visibility.full-apparition') apparitionCount += 1;
    scoreTotal += seed.scores.total;
  }

  return {
    uniqueSignatureRate: signatures.size / sampleSize,
    uniqueProfessions: professions.size,
    warlockFullApparitionRate: apparitionCount / (sampleSize / 3),
    averageScore: scoreTotal / sampleSize,
    topProfessions: [...professions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
    visibility: Object.fromEntries([...visibility.entries()].sort()),
    goals: Object.fromEntries([...goals.entries()].sort()),
    contradictions: Object.fromEntries([...contradictions.entries()].sort()),
    qaFlags: Object.fromEntries(qaFlags),
  };
}

const baseline = summarize((options) => generateSemanticSeedVNext(options));
const ruleAware = summarize((options) => generateSemanticSeedVNextWithRules({ ...options, rerankPoolSize: 10 }));

const warlockExamples = [];
const exampleHistory = [];
for (let index = 0; index < 20; index += 1) {
  const seed = generateSemanticSeedVNextWithRules({
    rngSeed: `warlock-example-${index}`,
    classId: 'class.warlock',
    novelty: index < 7 ? 'low' : index < 14 ? 'balanced' : 'high',
    rerankPoolSize: 12,
    repetitionHistory: exampleHistory,
  });
  exampleHistory.push(createSemanticSignature(seed));
  warlockExamples.push({
    seedId: seed.id,
    score: seed.scores.total,
    visibility: seed.power.visibility.id,
    profession: seed.identity.profession.id,
    card: buildSemanticCharacterCard(seed),
    qaFlags: seed.qaFlags,
  });
}

const report = {
  sampleSize,
  baseline,
  ruleAware,
  deltas: {
    uniqueSignatureRate: ruleAware.uniqueSignatureRate - baseline.uniqueSignatureRate,
    warlockFullApparitionRate: ruleAware.warlockFullApparitionRate - baseline.warlockFullApparitionRate,
    averageScore: ruleAware.averageScore - baseline.averageScore,
  },
  ruleCoverage: getSemanticRuleCoverage(getSemanticPilotFacts()),
  warlockExamples,
};

console.log(JSON.stringify(report, null, 2));

const failures = [];
if (ruleAware.warlockFullApparitionRate > 0.12) failures.push(`Rule-aware apparition rate too high: ${ruleAware.warlockFullApparitionRate}`);
if (ruleAware.uniqueProfessions < 15) failures.push(`Rule-aware profession coverage too low: ${ruleAware.uniqueProfessions}`);
if (ruleAware.uniqueSignatureRate < 0.35) failures.push(`Rule-aware signature diversity too low: ${ruleAware.uniqueSignatureRate}`);
if (warlockExamples.some((example) => example.qaFlags.includes('semantic-hard-conflict'))) failures.push('Hard conflict found in warlock examples');

console.log(`\nDiceborn semantic rule comparison: ${failures.length} failure(s).`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exitCode = 1;
