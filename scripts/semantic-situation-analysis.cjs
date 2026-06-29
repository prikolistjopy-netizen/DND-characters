const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.semantic-situation-build');

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
], { cwd: root, stdio: 'inherit' });

writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json', 'affordances.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateIncrementalSemanticSeedVNext } = require(path.join(outDir, 'lib', 'vnext', 'incrementalResolver.js'));
const { buildSituationGraph } = require(path.join(outDir, 'lib', 'vnext', 'situationGraph.js'));

const cases = [
  { classId: 'class.warlock', professionId: 'profession.physician', seed: 'situation-warlock-physician' },
  { classId: 'class.fighter', professionId: 'profession.guard-captain', seed: 'situation-fighter-captain' },
  { classId: 'class.cleric', professionId: 'profession.undertaker', seed: 'situation-cleric-undertaker' },
  { classId: 'class.warlock', professionId: 'profession.locksmith', seed: 'situation-warlock-locksmith' },
  { classId: 'class.fighter', professionId: 'profession.ferryman', seed: 'situation-fighter-ferryman' },
];

const failures = [];
const results = cases.map((item) => {
  const semanticSeed = generateIncrementalSemanticSeedVNext({
    rngSeed: item.seed,
    classId: item.classId,
    professionId: item.professionId,
    beamWidth: 18,
    branchFactor: 5,
  });
  const graph = buildSituationGraph(semanticSeed);
  if (graph.nodes.length < 6) failures.push(`${item.seed}: too few nodes`);
  if (!graph.edges.some((edge) => edge.relation === 'acts-on')) failures.push(`${item.seed}: missing acts-on edge`);
  if (!graph.edges.some((edge) => edge.relation === 'uses')) failures.push(`${item.seed}: missing uses edge`);
  if (!graph.affordances['bodily-habit'].length && !graph.affordances['handling-style'].length) failures.push(`${item.seed}: profession produced no behavioral affordance`);
  return {
    seed: item.seed,
    identity: graph.nodes[0].label,
    summary: graph.summary,
    affordances: Object.fromEntries(Object.entries(graph.affordances).map(([key, value]) => [key, value.map((entry) => entry.label)])),
    edges: graph.edges,
  };
});

console.log(JSON.stringify({ results, failures }, null, 2));
console.log(`\nDiceborn situation graph analysis: ${failures.length} failure(s).`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exitCode = 1;
