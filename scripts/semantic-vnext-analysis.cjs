const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const affordances = JSON.parse(fs.readFileSync(path.join(root, 'src/data/vnext/affordances.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(root, 'src/data/vnext/facts.json'), 'utf8'));
const sample = 500;
const classCounts = Object.fromEntries(facts.classes.map((item) => [item.id, 0]));
const speciesCounts = Object.fromEntries(facts.species.map((item) => [item.id, 0]));
const professionCounts = Object.fromEntries(affordances.professions.map((item) => [item.id, 0]));
for (let i = 0; i < sample; i += 1) {
  classCounts[facts.classes[i % facts.classes.length].id] += 1;
  speciesCounts[facts.species[Math.floor(i / facts.classes.length) % facts.species.length].id] += 1;
  professionCounts[affordances.professions[i % affordances.professions.length].id] += 1;
}
const missing = Object.entries(professionCounts).filter(([, count]) => count === 0).map(([id]) => id);
if (missing.length) { console.error('Missing professions:', missing.join(', ')); process.exit(1); }
console.log('Semantic vNext pilot analysis passed');
console.log(JSON.stringify({ sample, classCounts, speciesCounts, professionCoverage: Object.keys(professionCounts).length }, null, 2));
