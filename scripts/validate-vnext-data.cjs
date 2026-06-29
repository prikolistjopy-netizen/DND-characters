const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const factsPath = path.join(root, 'src', 'data', 'vnext', 'facts.json');
const rulesPath = path.join(root, 'src', 'data', 'vnext', 'rules.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Failed to read ${path.relative(root, filePath)}:`, error.message);
    process.exitCode = 1;
    return null;
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function addIssue(issues, severity, code, message, subject) {
  issues.push({ severity, code, message, subject });
}

const factsDoc = readJson(factsPath);
const rulesDoc = readJson(rulesPath);
if (!factsDoc || !rulesDoc) process.exit(1);

const issues = [];
const facts = Array.isArray(factsDoc.facts) ? factsDoc.facts : [];
const influences = Array.isArray(rulesDoc.influences) ? rulesDoc.influences : [];
const constraints = Array.isArray(rulesDoc.constraints) ? rulesDoc.constraints : [];

if (!isNonEmptyString(factsDoc.schemaVersion)) addIssue(issues, 'error', 'FACT_SCHEMA_VERSION', 'facts.json needs schemaVersion', 'facts.json');
if (!isNonEmptyString(rulesDoc.schemaVersion)) addIssue(issues, 'error', 'RULE_SCHEMA_VERSION', 'rules.json needs schemaVersion', 'rules.json');

const ids = new Map();
for (const fact of facts) {
  const subject = fact && fact.id ? fact.id : '<unknown fact>';
  if (!fact || typeof fact !== 'object') {
    addIssue(issues, 'error', 'FACT_OBJECT', 'Fact must be an object', subject);
    continue;
  }
  if (!isNonEmptyString(fact.id)) addIssue(issues, 'error', 'FACT_ID', 'Fact requires a non-empty id', subject);
  if (!isNonEmptyString(fact.domain)) addIssue(issues, 'error', 'FACT_DOMAIN', 'Fact requires a domain', subject);
  if (!isNonEmptyString(fact.label)) addIssue(issues, 'error', 'FACT_LABEL', 'Fact requires a label', subject);
  if (!Array.isArray(fact.tags)) addIssue(issues, 'error', 'FACT_TAGS', 'Fact tags must be an array', subject);
  if (typeof fact.baseWeight !== 'number' || !Number.isFinite(fact.baseWeight) || fact.baseWeight <= 0) {
    addIssue(issues, 'error', 'FACT_WEIGHT', 'baseWeight must be a positive finite number', subject);
  }
  if (fact.rarity !== undefined && (typeof fact.rarity !== 'number' || fact.rarity < 0 || fact.rarity > 1)) {
    addIssue(issues, 'error', 'FACT_RARITY', 'rarity must be between 0 and 1', subject);
  }
  if (fact.stereotypeRisk !== undefined && (typeof fact.stereotypeRisk !== 'number' || fact.stereotypeRisk < 0 || fact.stereotypeRisk > 1)) {
    addIssue(issues, 'error', 'FACT_STEREOTYPE_RISK', 'stereotypeRisk must be between 0 and 1', subject);
  }
  if (!Number.isInteger(fact.version) || fact.version < 1) addIssue(issues, 'error', 'FACT_VERSION', 'version must be a positive integer', subject);
  if (!fact.provenance || !isNonEmptyString(fact.provenance.source) || !isNonEmptyString(fact.provenance.confidence)) {
    addIssue(issues, 'error', 'FACT_PROVENANCE', 'Fact requires provenance.source and provenance.confidence', subject);
  }
  if (fact.domain === 'profession') {
    if (!Array.isArray(fact.narrativeAffordances) || fact.narrativeAffordances.length === 0) {
      addIssue(issues, 'error', 'PROFESSION_NARRATIVE_AFFORDANCE', 'Profession requires at least one narrative affordance', subject);
    }
    if (!Array.isArray(fact.visualAffordances) || fact.visualAffordances.length === 0) {
      addIssue(issues, 'error', 'PROFESSION_VISUAL_AFFORDANCE', 'Profession requires at least one visual affordance', subject);
    }
  }
  if (isNonEmptyString(fact.id)) {
    if (ids.has(fact.id)) addIssue(issues, 'error', 'DUPLICATE_ID', `Duplicate id also used by ${ids.get(fact.id)}`, subject);
    else ids.set(fact.id, 'fact');
  }
}

const allowedInfluenceKinds = new Set(['prefers', 'discourages', 'implies', 'transforms']);
const allowedConstraintKinds = new Set(['requires', 'excludes', 'conflicts']);

function validateRule(rule, type) {
  const subject = rule && rule.id ? rule.id : `<unknown ${type}>`;
  if (!rule || typeof rule !== 'object') {
    addIssue(issues, 'error', 'RULE_OBJECT', `${type} must be an object`, subject);
    return;
  }
  if (!isNonEmptyString(rule.id)) addIssue(issues, 'error', 'RULE_ID', `${type} requires a non-empty id`, subject);
  if (!Array.isArray(rule.when) || rule.when.length === 0 || rule.when.some((value) => !isNonEmptyString(value))) {
    addIssue(issues, 'error', 'RULE_WHEN', `${type} requires a non-empty when array`, subject);
  }
  if (!Array.isArray(rule.targets) || rule.targets.length === 0 || rule.targets.some((value) => !isNonEmptyString(value))) {
    addIssue(issues, 'error', 'RULE_TARGETS', `${type} requires a non-empty targets array`, subject);
  }
  if (!isNonEmptyString(rule.reason)) addIssue(issues, 'error', 'RULE_REASON', `${type} requires a reason`, subject);
  if (!Number.isInteger(rule.version) || rule.version < 1) addIssue(issues, 'error', 'RULE_VERSION', `${type} version must be a positive integer`, subject);
  if (isNonEmptyString(rule.id)) {
    if (ids.has(rule.id)) addIssue(issues, 'error', 'DUPLICATE_ID', `Duplicate id also used by ${ids.get(rule.id)}`, subject);
    else ids.set(rule.id, type);
  }
}

for (const rule of influences) {
  validateRule(rule, 'influence');
  if (!allowedInfluenceKinds.has(rule.kind)) addIssue(issues, 'error', 'INFLUENCE_KIND', `Unsupported influence kind: ${rule.kind}`, rule.id);
  if (typeof rule.weight !== 'number' || !Number.isFinite(rule.weight) || rule.weight === 0) {
    addIssue(issues, 'error', 'INFLUENCE_WEIGHT', 'Influence weight must be a non-zero finite number', rule.id);
  }
  if (rule.kind === 'discourages' && rule.weight > 0) addIssue(issues, 'warning', 'DISCOURAGE_POSITIVE_WEIGHT', 'discourages usually uses a negative weight', rule.id);
  if (rule.kind !== 'discourages' && rule.weight < 0) addIssue(issues, 'warning', 'NEGATIVE_POSITIVE_INFLUENCE', `${rule.kind} usually uses a positive weight`, rule.id);
}

for (const rule of constraints) {
  validateRule(rule, 'constraint');
  if (!allowedConstraintKinds.has(rule.kind)) addIssue(issues, 'error', 'CONSTRAINT_KIND', `Unsupported constraint kind: ${rule.kind}`, rule.id);
}

const factDomains = facts.reduce((map, fact) => {
  map.set(fact.domain, (map.get(fact.domain) || 0) + 1);
  return map;
}, new Map());

const requiredPilotCoverage = {
  class: 3,
  species: 3,
  profession: 20,
};

for (const [domain, minimum] of Object.entries(requiredPilotCoverage)) {
  const count = factDomains.get(domain) || 0;
  if (count < minimum) addIssue(issues, 'error', 'PILOT_COVERAGE', `Expected at least ${minimum} ${domain} facts, found ${count}`, domain);
}

const highRiskFacts = facts.filter((fact) => typeof fact.stereotypeRisk === 'number' && fact.stereotypeRisk >= 0.6);
for (const fact of highRiskFacts) {
  addIssue(issues, 'warning', 'HIGH_STEREOTYPE_RISK', `High-risk fact requires explicit justification and counterweights (${fact.stereotypeRisk})`, fact.id);
}

const repetitionGroups = new Map();
for (const fact of facts) {
  if (!isNonEmptyString(fact.repetitionGroup)) continue;
  const values = repetitionGroups.get(fact.repetitionGroup) || [];
  values.push(fact.id);
  repetitionGroups.set(fact.repetitionGroup, values);
}

const report = {
  schemaVersions: { facts: factsDoc.schemaVersion, rules: rulesDoc.schemaVersion },
  counts: {
    facts: facts.length,
    influences: influences.length,
    constraints: constraints.length,
    domains: Object.fromEntries([...factDomains.entries()].sort()),
    repetitionGroups: repetitionGroups.size,
  },
  risks: {
    highStereotypeRiskFacts: highRiskFacts.map((fact) => fact.id),
  },
  issues,
};

console.log(JSON.stringify(report, null, 2));

const errorCount = issues.filter((issue) => issue.severity === 'error').length;
const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
console.log(`\nDiceborn vNext validation: ${errorCount} error(s), ${warningCount} warning(s).`);
if (errorCount > 0) process.exitCode = 1;
