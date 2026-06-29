const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const facts = read('src/data/vnext/facts.json');
const affordances = read('src/data/vnext/affordances.json');
const rules = read('src/data/vnext/rules.json');
const semantic = read('src/data/vnext/semantic-facts.json');
const failures = [];
function unique(name, items) {
  const seen = new Set();
  for (const item of items || []) {
    if (!item.id) failures.push(`${name} item missing id`);
    if (seen.has(item.id)) failures.push(`${name} duplicate id ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}
const classIds = unique('classes', facts.classes);
const speciesIds = unique('species', facts.species);
unique('cultures', facts.cultures);
unique('environments', facts.environments);
const professionIds = unique('professions', affordances.professions);
if (professionIds.size < semantic.pilotScope.minimumProfessionCount) failures.push('profession coverage below pilot minimum');
for (const profession of affordances.professions) {
  for (const field of ['tools', 'habits', 'wear', 'responsibilities', 'scenes']) if (!Array.isArray(profession[field]) || profession[field].length === 0) failures.push(`profession ${profession.id} missing ${field}`);
}
for (const id of semantic.pilotScope.classes) if (!classIds.has(id)) failures.push(`pilot class missing ${id}`);
for (const id of semantic.pilotScope.species) if (!speciesIds.has(id)) failures.push(`pilot species missing ${id}`);
for (const rule of rules.rules || []) {
  if (!rule.id || !rule.type || !rule.when || !rule.severity) failures.push(`invalid rule ${rule.id || '<missing id>'}`);
  if (rule.type === 'requires' && !rule.require) failures.push(`requires rule missing require target ${rule.id}`);
  if (rule.type === 'excludes' && !rule.exclude) failures.push(`excludes rule missing exclude target ${rule.id}`);
}
if (failures.length) {
  console.error('vNext data validation failed');
  for (const failure of failures) console.error('-', failure);
  process.exit(1);
}
console.log('vNext data validation passed');
console.log(`classes=${classIds.size} species=${speciesIds.size} professions=${professionIds.size} rules=${(rules.rules || []).length}`);
