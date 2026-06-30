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
if (classIds.size < 13) failures.push(`class coverage below vNext expansion minimum: ${classIds.size}`);
if (speciesIds.size < 12) failures.push(`species coverage below vNext expansion minimum: ${speciesIds.size}`);
if (professionIds.size < 24) failures.push(`profession coverage below vNext expansion minimum: ${professionIds.size}`);
for (const profession of affordances.professions) {
  for (const field of ['tools', 'habits', 'wear', 'responsibilities', 'scenes', 'materials', 'tensions']) {
    if (!Array.isArray(profession[field]) || profession[field].length === 0) failures.push(`profession ${profession.id} missing ${field}`);
  }
}
for (const id of semantic.pilotScope.classes) if (!classIds.has(id)) failures.push(`semantic class missing ${id}`);
for (const id of semantic.pilotScope.species) if (!speciesIds.has(id)) failures.push(`semantic species missing ${id}`);
for (const id of semantic.pilotScope.professions) if (!professionIds.has(id)) failures.push(`semantic profession missing ${id}`);
for (const source of facts.powerSources || []) {
  for (const classId of source.classes || []) if (!classIds.has(classId)) failures.push(`power source ${source.id} references unknown class ${classId}`);
  for (const mode of source.visibility || []) if (!semantic.pilotScope.powerVisibilityModes.includes(mode)) failures.push(`power source ${source.id} references unknown visibility ${mode}`);
}
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
