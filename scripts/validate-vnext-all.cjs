const { spawnSync } = require('node:child_process');
const path = require('node:path');
const scripts = ['validate-vnext-data.cjs','semantic-vnext-analysis.cjs','semantic-rule-comparison.cjs','semantic-incremental-analysis.cjs','semantic-situation-analysis.cjs','visual-director-vnext-analysis.cjs','prompt-compiler-vnext-analysis.cjs','semantic-legacy-comparison.cjs','visual-vnext-repetition-analysis.cjs','runtime-vnext-generation-check.cjs'];
for (const script of scripts) {
  console.log(`\n> ${script}`);
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\nAll vNext validation scripts passed');
