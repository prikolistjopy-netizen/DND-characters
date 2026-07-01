const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const affordances = JSON.parse(fs.readFileSync(path.join(root, 'src/data/vnext/affordances.json'), 'utf8'));
const facts = JSON.parse(fs.readFileSync(path.join(root, 'src/data/vnext/facts.json'), 'utf8'));
const sample = 500;
const classCounts = Object.fromEntries(facts.classes.map((item) => [item.id, 0]));
const speciesCounts = Object.fromEntries(facts.species.map((item) => [item.id, 0]));
const professionCounts = Object.fromEntries(affordances.professions.map((item) => [item.id, 0]));
const currentMomentCounts = new Map();
const tensionCounts = new Map();
const toolCounts = new Map();
const postureCounts = new Map();
for (let i = 0; i < sample; i += 1) {
  const cls = facts.classes[i % facts.classes.length];
  const species = facts.species[Math.floor(i / facts.classes.length) % facts.species.length];
  const profession = affordances.professions[i % affordances.professions.length];
  classCounts[cls.id] += 1;
  speciesCounts[species.id] += 1;
  professionCounts[profession.id] += 1;
  currentMomentCounts.set(profession.scenes[0], (currentMomentCounts.get(profession.scenes[0]) || 0) + 1);
  tensionCounts.set(profession.tensions[0], (tensionCounts.get(profession.tensions[0]) || 0) + 1);
  toolCounts.set(profession.tools[0], (toolCounts.get(profession.tools[0]) || 0) + 1);
  postureCounts.set(profession.habits[0], (postureCounts.get(profession.habits[0]) || 0) + 1);
}
const failures = [];
for (const [id, count] of Object.entries(classCounts)) if (count === 0) failures.push(`class missing in sample: ${id}`);
for (const [id, count] of Object.entries(speciesCounts)) if (count === 0) failures.push(`species missing in sample: ${id}`);
for (const [id, count] of Object.entries(professionCounts)) if (count === 0) failures.push(`profession missing in sample: ${id}`);
if (currentMomentCounts.size < affordances.professions.length) failures.push('current moment diversity collapsed');
if (tensionCounts.size < Math.floor(affordances.professions.length * 0.75)) failures.push('tension diversity too low');
if (toolCounts.size < Math.floor(affordances.professions.length * 0.75)) failures.push('primary tool diversity too low');
if (postureCounts.size < Math.floor(affordances.professions.length * 0.75)) failures.push('posture/habit diversity too low');
const factsText = JSON.stringify(facts).toLowerCase();
for (const phrase of ['purple warlock', 'white-gold cleric', 'red tiefling', 'visible demon', 'patron in the sky']) {
  if (factsText.includes(phrase)) failures.push(`stereotype phrase leaked into facts: ${phrase}`);
}
if (failures.length) {
  console.error('Semantic vNext analysis failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('Semantic vNext analysis passed');
console.log(JSON.stringify({ sample, classCounts, speciesCounts, professionCoverage: Object.keys(professionCounts).length, currentMomentDiversity: currentMomentCounts.size, tensionDiversity: tensionCounts.size, primaryToolDiversity: toolCounts.size, postureDiversity: postureCounts.size }, null, 2));
