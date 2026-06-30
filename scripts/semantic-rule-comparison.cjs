const { spawnSync } = require('node:child_process');
const result = spawnSync(process.execPath, [require('node:path').join(__dirname, 'semantic-vnext-analysis.cjs')], { stdio: 'inherit' });
process.exit(result.status ?? 1);
