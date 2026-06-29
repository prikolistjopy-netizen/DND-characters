const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.semantic-incremental-build');
const sampleSize = 900;

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
    'src/lib/vnext/resolverControlled.ts',
    'src/lib/vnext/resolverWithRules.ts',
    'src/lib/vnext/resolver.ts',
    'src/lib/vnext/ruleEngine.ts',
    'src/lib/vnext/incrementalResolver.ts',
    'src/lib/vnext/semanticCard.ts',
    'src/lib/vnext/coverage.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateIncrementalSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'incrementalResolver.js'));
const { buildSemanticCharacterCard } = require(path.join(outDir, 'lib', 'vnext', 'semanticCard.js'));
const { analyzeSemanticCoverage } = require(path.join(outDir, 'lib', 'vnext', 'coverage.js'));
const { getSemanticPilotFacts } = require(path.join(outDir, 'lib', 'vnext', 'resolver.js'));

const classes = ['class.warlock', 'class.fighter', 'class.cleric'];
const history = [];
const signatures = new Set();
const professions = new Map();
const visibility = new Map();
const goals = new Map();
const appliedRuleCounts = new Map();
const failures = [];
let warlockCount = 0;
let warlockApparitionCount = 0;
let deterministicFailures = 0;

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function signature(seed) {
  return [
    seed.identity.class.id,
    seed.identity.species.id,
    seed.identity.profession.id,
    seed.psychology.contradiction.id,
    seed.power.relationship.id,
    seed.power.visibility.id,
    seed.currentMoment.goal.id,
    seed.currentMoment.action.id,
  ].join('|');
}

for (let index = 0; index < sampleSize; index += 1) {
  const classId = classes[index % classes.length];
  const options = {
    rngSeed: `incremental-analysis-${index}`,
    classId,
    novelty: index % 5 === 0 ? 'high' : index % 5 === 1 ? 'low' : 'balanced',
    beamWidth: 18,
    branchFactor: 5,
    repetitionHistory: history.slice(-100),
  };
  const first = generateIncrementalSemanticSeedVNext(options);
  const second = generateIncrementalSemanticSeedVNext(options);
  if (JSON.stringify(first) !== JSON.stringify(second)) deterministicFailures += 1;
  if (first.identity.class.id !== classId) failures.push(`Class lock failed at ${index}`);
  if (first.qaFlags.includes('no-data-driven-rules-applied')) failures.push(`No rules applied at ${index}`);
  if (!first.trace.entries.some((entry) => entry.stage === 'final-selection')) failures.push(`Missing final trace at ${index}`);

  const currentSignature = signature(first);
  signatures.add(currentSignature);
  history.push(currentSignature);
  increment(professions, first.identity.profession.id);
  increment(visibility, `${classId}:${first.power.visibility.id}`);
  increment(goals, `${classId}:${first.currentMoment.goal.id}`);
  for (const entry of first.trace.entries) {
    for (const factId of entry.selectedFactIds || []) {
      if (factId.includes('-prefers-') || factId.includes('-discourages-') || factId.includes('-needs-') || factId.includes('-before-') || factId.includes('-after-')) {
        increment(appliedRuleCounts, factId);
      }
    }
  }
  if (classId === 'class.warlock') {
    warlockCount += 1;
    if (first.power.visibility.id === 'power-visibility.full-apparition') warlockApparitionCount += 1;
  }
}

const lockCases = [
  {
    name: 'warlock physician indirect power',
    options: {
      rngSeed: 'lock-case-warlock-physician',
      classId: 'class.warlock',
      professionId: 'profession.physician',
      locks: {
        contradictionId: 'contradiction.healer-harmful-power',
        powerVisibilityId: 'power-visibility.object-based',
        goalId: 'goal.diagnose-anomaly',
        actionId: 'action.examine',
      },
    },
  },
  {
    name: 'fighter protector',
    options: {
      rngSeed: 'lock-case-fighter',
      classId: 'class.fighter',
      locks: {
        contradictionId: 'contradiction.protector-fears-contact',
        powerVisibilityId: 'power-visibility.none',
        actionId: 'action.interpose',
      },
    },
  },
  {
    name: 'cleric moral oath',
    options: {
      rngSeed: 'lock-case-cleric',
      classId: 'class.cleric',
      locks: {
        goalId: 'goal.keep-oath',
        actionId: 'action.refuse-order',
        pressureId: 'pressure.public-scrutiny',
      },
    },
  },
];

const lockResults = lockCases.map(({ name, options }) => {
  const seed = generateIncrementalSemanticSeedVNext({ ...options, beamWidth: 20, branchFactor: 6 });
  const expected = Object.values(options.locks);
  const actual = [
    seed.psychology.contradiction.id,
    seed.power.visibility.id,
    seed.currentMoment.goal.id,
    seed.currentMoment.action.id,
    seed.currentMoment.pressure.id,
  ];
  const missing = expected.filter((id) => !actual.includes(id));
  if (missing.length) failures.push(`${name} missing locks: ${missing.join(', ')}`);
  return { name, missing, card: buildSemanticCharacterCard(seed), score: seed.scores.total, qaFlags: seed.qaFlags };
});

const coverage = analyzeSemanticCoverage(getSemanticPilotFacts());
const warlockApparitionRate = warlockApparitionCount / Math.max(1, warlockCount);
const uniqueSignatureRate = signatures.size / sampleSize;

if (deterministicFailures > 0) failures.push(`Determinism failures: ${deterministicFailures}`);
if (warlockApparitionRate > 0.1) failures.push(`Warlock apparition rate too high: ${warlockApparitionRate}`);
if (professions.size < 16) failures.push(`Profession coverage too low: ${professions.size}`);
if (uniqueSignatureRate < 0.4) failures.push(`Signature diversity too low: ${uniqueSignatureRate}`);
if (coverage.coverageScore < 0.65) failures.push(`Coverage score too low: ${coverage.coverageScore}`);

const report = {
  sampleSize,
  deterministicFailures,
  uniqueSemanticSignatures: signatures.size,
  uniqueSignatureRate,
  uniqueProfessions: professions.size,
  warlockFullApparitionRate: warlockApparitionRate,
  topProfessions: [...professions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
  visibilityByClass: Object.fromEntries([...visibility.entries()].sort()),
  goalsByClass: Object.fromEntries([...goals.entries()].sort()),
  topAppliedRules: [...appliedRuleCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
  coverage,
  lockResults,
  failures,
};

console.log(JSON.stringify(report, null, 2));
console.log(`\nDiceborn incremental semantic analysis: ${failures.length} failure(s).`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exitCode = 1;
