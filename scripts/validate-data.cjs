const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.validate-data-build');

rmSync(outDir, { recursive: true, force: true });
run(
  'tsc',
  [
    '--ignoreConfig',
    '--outDir',
    outDir,
    '--module',
    'commonjs',
    '--target',
    'ES2020',
    '--moduleResolution',
    'node10',
    '--ignoreDeprecations',
    '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib',
    'ES2020,DOM',
    'src/data/index.ts',
    'src/data/validationRules.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));

const data = require(path.join(outDir, 'index.js'));
const { validEquipmentEffectIntensities, validSizeCategories, forbiddenImagePromptPhrases } = require(path.join(outDir, 'validationRules.js'));

const failures = [];
const warnings = [];
const looseThemeRefs = new Set(['rune_scholar', 'monster_tracker', 'relic_diver', 'storm_sailor']);
const looseFxRefs = new Set(['torn banners in battlefield smoke']);

function itemId(item) {
  return item?.id ?? item?.name ?? item?.className ?? item?.themeId ?? item?.raceId ?? null;
}

function assertNonEmpty(name, list) {
  if (!Array.isArray(list) || list.length === 0) failures.push(`${name} must be a non-empty array`);
}

function checkDuplicateIds(name, list, getKey = itemId) {
  assertNonEmpty(name, list);
  const seen = new Map();
  for (const item of list ?? []) {
    const id = getKey(item);
    if (!id) failures.push(`${name} item is missing id/name/className/themeId/raceId`);
    else if (seen.has(id)) failures.push(`${name} duplicate id/name: ${id}`);
    else seen.set(id, item);
  }
  return new Set([...seen.keys()]);
}

function checkRefs(sourceName, sourceId, values, targetSet, targetName) {
  for (const value of values ?? []) {
    if (targetSet.has(value)) continue;
    if ((targetName === 'visualTheme' && looseThemeRefs.has(value)) || (targetName === 'fx' && looseFxRefs.has(value))) warnings.push(`${sourceName} ${sourceId} references legacy/alias ${targetName}: ${value}`);
    else failures.push(`${sourceName} ${sourceId} references missing ${targetName}: ${value}`);
  }
}

function checkPromptFragments(name, item) {
  const fragments = item.promptFragments ?? (item.promptFragment ? [item.promptFragment] : []);
  if ('promptFragments' in item && (!Array.isArray(item.promptFragments) || item.promptFragments.length === 0)) failures.push(`${name} ${itemId(item)} has empty promptFragments`);
  for (const fragment of fragments) {
    const lower = String(fragment).toLowerCase();
    if (forbiddenImagePromptPhrases.some((phrase) => lower.includes(phrase) && !lower.includes('no readable text'))) failures.push(`${name} ${itemId(item)} contains forbidden prompt phrase: ${fragment}`);
  }
}

const classIds = new Set(data.characterClasses.map((item) => item.name));
const raceIds = checkDuplicateIds('races', data.races);
const buildTemplateIds = checkDuplicateIds('buildTemplates', data.buildTemplates);
checkDuplicateIds('visualThemes', data.visualThemes, (theme) => `${theme.id}:${theme.buildTemplateId}:${theme.label}`);
checkDuplicateIds('visualThemeVariants', data.visualThemeVariants, (variant) => `${variant.id}:${variant.label}`);
const visualThemeIds = new Set(data.visualThemes.map((theme) => theme.id));
const visualThemeVariantIds = new Set(data.visualThemeVariants.map((variant) => variant.id));
const narrativeMotifIds = checkDuplicateIds('narrativeMotifs', data.narrativeMotifs);
const narrativeVariantIds = checkDuplicateIds('narrativeVariants', data.narrativeVariants);
const themeVisualProfileIds = checkDuplicateIds('themeVisualProfiles', data.themeVisualProfiles);
const themeContentProfileIds = checkDuplicateIds('themeContentProfiles', data.themeContentProfiles);
const armorIds = checkDuplicateIds('armors', data.armors);
const weaponIds = checkDuplicateIds('weapons', data.weapons);
const poseIds = checkDuplicateIds('poses', data.poses);
const moodIds = checkDuplicateIds('moods', data.moods);
const lightIds = checkDuplicateIds('lights', data.lights);
const fxIds = checkDuplicateIds('effects', data.effects);
const silhouetteIds = checkDuplicateIds('silhouettes', data.silhouettes);
const silhouetteProfileIds = checkDuplicateIds('silhouetteProfiles', data.silhouetteProfiles);
const visualMotifIds = checkDuplicateIds('visualMotifs', data.visualMotifs);
const armorLanguageIds = checkDuplicateIds('armorLanguages', data.armorLanguages);
const weaponLanguageIds = checkDuplicateIds('weaponLanguages', data.weaponLanguages);
const equipmentFinishIds = checkDuplicateIds('equipmentFinishes', data.equipmentFinishes);
const equipmentEnchantmentIds = checkDuplicateIds('equipmentEnchantments', data.equipmentEnchantments);
const companionIds = checkDuplicateIds('companionProfiles', data.companionProfiles);
const appearanceIds = checkDuplicateIds('characterAppearanceProfiles', data.characterAppearanceProfiles);
const cultureIds = checkDuplicateIds('culturalOrigins', data.culturalOrigins);
checkDuplicateIds('curatedMulticlassProfiles', data.curatedMulticlassProfiles);
checkDuplicateIds('classAnchors', data.classAnchors);
checkDuplicateIds('fantasyPillars', data.fantasyPillars);
checkDuplicateIds('companionRelationships', data.companionRelationships);

for (const template of data.buildTemplates) {
  checkRefs('buildTemplate.allowedClasses', template.id, template.allowedClasses, classIds, 'class');
  checkRefs('buildTemplate.allowedArmor', template.id, template.allowedArmor, armorIds, 'armor');
  checkRefs('buildTemplate.allowedWeapons', template.id, template.allowedWeapons, weaponIds, 'weapon');
  checkRefs('buildTemplate.allowedPoses', template.id, template.allowedPoses, poseIds, 'pose');
  checkRefs('buildTemplate.allowedSilhouettes', template.id, template.allowedSilhouettes, silhouetteIds, 'silhouette');
  checkRefs('buildTemplate.allowedMoods', template.id, template.allowedMoods, moodIds, 'mood');
  checkRefs('buildTemplate.allowedLights', template.id, template.allowedLights, lightIds, 'light');
  checkRefs('buildTemplate.allowedFx', template.id, template.allowedFx, fxIds, 'fx');
}

for (const theme of data.visualThemes) {
  if (!buildTemplateIds.has(theme.buildTemplateId)) failures.push(`visualTheme ${theme.id} references missing buildTemplateId: ${theme.buildTemplateId}`);
  checkRefs('visualTheme.preferredMoods', theme.id, theme.preferredMoods, moodIds, 'mood');
  checkRefs('visualTheme.preferredLights', theme.id, theme.preferredLights, lightIds, 'light');
  checkRefs('visualTheme.preferredFx', theme.id, theme.preferredFx, fxIds, 'fx');
  checkRefs('visualTheme.preferredWeapons', theme.id, theme.preferredWeapons, weaponIds, 'weapon');
  checkRefs('visualTheme.preferredArmor', theme.id, theme.preferredArmor, armorIds, 'armor');
  checkRefs('visualTheme.preferredPoses', theme.id, theme.preferredPoses, poseIds, 'pose');
  checkRefs('visualTheme.preferredSilhouettes', theme.id, theme.preferredSilhouettes, new Set([...silhouetteIds, ...silhouetteProfileIds]), 'silhouette');
}

for (const variant of data.visualThemeVariants) if (!visualThemeIds.has(variant.visualThemeId)) failures.push(`visualThemeVariant ${variant.id} references missing visualThemeId: ${variant.visualThemeId}`);
for (const profile of data.themeVisualProfiles) {
  if (!visualThemeIds.has(profile.themeId)) failures.push(`themeVisualProfile ${profile.themeId} references missing visualTheme`);
  checkRefs('themeVisualProfile.visualMotifIds', profile.themeId, profile.visualMotifIds, visualMotifIds, 'visualMotif');
  checkRefs('themeVisualProfile.armorLanguageIds', profile.themeId, profile.armorLanguageIds, armorLanguageIds, 'armorLanguage');
  checkRefs('themeVisualProfile.weaponLanguageIds', profile.themeId, profile.weaponLanguageIds, weaponLanguageIds, 'weaponLanguage');
}
for (const profile of data.themeContentProfiles) {
  if (!visualThemeIds.has(profile.themeId)) {
    if (looseThemeRefs.has(profile.themeId)) warnings.push(`themeContentProfile ${profile.themeId} uses legacy/alias visualTheme`);
    else failures.push(`themeContentProfile ${profile.themeId} references missing visualTheme`);
  }
}

for (const motif of data.narrativeMotifs) {
  checkRefs('narrativeMotif.compatibleBuildTemplates', motif.id, motif.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('narrativeMotif.compatibleVisualThemes', motif.id, motif.compatibleVisualThemes, visualThemeIds, 'visualTheme');
  checkRefs('narrativeMotif.classBias', motif.id, motif.classBias, classIds, 'class');
  checkRefs('narrativeMotif.raceBias', motif.id, motif.raceBias, raceIds, 'race');
  checkPromptFragments('narrativeMotif', motif);
}
for (const variant of data.narrativeVariants) {
  if (!narrativeMotifIds.has(variant.narrativeMotifId)) failures.push(`narrativeVariant ${variant.id} references missing narrativeMotifId: ${variant.narrativeMotifId}`);
  checkPromptFragments('narrativeVariant', variant);
}

for (const language of data.armorLanguages) {
  checkRefs('armorLanguage.compatibleBuildTemplates', language.id, language.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('armorLanguage.compatibleThemes', language.id, language.compatibleThemes, visualThemeIds, 'visualTheme');
  checkPromptFragments('armorLanguage', language);
}
for (const language of data.weaponLanguages) {
  checkRefs('weaponLanguage.compatibleBuildTemplates', language.id, language.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('weaponLanguage.compatibleThemes', language.id, language.compatibleThemes, visualThemeIds, 'visualTheme');
  checkPromptFragments('weaponLanguage', language);
}
for (const finish of data.equipmentFinishes) {
  checkRefs('equipmentFinish.compatibleBuildTemplates', finish.id, finish.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('equipmentFinish.compatibleThemes', finish.id, finish.compatibleThemes, visualThemeIds, 'visualTheme');
  checkRefs('equipmentFinish.compatibleArmorLanguages', finish.id, finish.compatibleArmorLanguages ?? [], armorLanguageIds, 'armorLanguage');
  checkRefs('equipmentFinish.compatibleWeaponLanguages', finish.id, finish.compatibleWeaponLanguages ?? [], weaponLanguageIds, 'weaponLanguage');
  checkPromptFragments('equipmentFinish', finish);
}
for (const enchantment of data.equipmentEnchantments) {
  if (!validEquipmentEffectIntensities.includes(enchantment.intensity)) failures.push(`equipmentEnchantment ${enchantment.id} has invalid intensity: ${enchantment.intensity}`);
  checkRefs('equipmentEnchantment.compatibleBuildTemplates', enchantment.id, enchantment.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('equipmentEnchantment.compatibleThemes', enchantment.id, enchantment.compatibleThemes, visualThemeIds, 'visualTheme');
  checkRefs('equipmentEnchantment.compatibleVisualMotifs', enchantment.id, enchantment.compatibleVisualMotifs ?? [], visualMotifIds, 'visualMotif');
  checkPromptFragments('equipmentEnchantment', enchantment);
}

for (const silhouetteProfile of data.silhouetteProfiles) {
  checkRefs('silhouetteProfile.compatibleBuildTemplates', silhouetteProfile.id, silhouetteProfile.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('silhouetteProfile.compatibleThemes', silhouetteProfile.id, silhouetteProfile.compatibleThemes ?? [], visualThemeIds, 'visualTheme');
  for (const size of silhouetteProfile.compatibleSizes) if (!validSizeCategories.includes(size)) failures.push(`silhouetteProfile ${silhouetteProfile.id} has invalid size: ${size}`);
}
for (const companion of data.companionProfiles) {
  checkRefs('companion.compatibleClasses', companion.id, companion.compatibleClasses, classIds, 'class');
  checkRefs('companion.compatibleBuildTemplates', companion.id, companion.compatibleBuildTemplates, buildTemplateIds, 'buildTemplate');
  checkRefs('companion.compatibleThemes', companion.id, companion.compatibleThemes, visualThemeIds, 'visualTheme');
}
for (const appearance of data.characterAppearanceProfiles) {
  checkRefs('appearance.compatibleRaces', appearance.id, appearance.compatibleRaces, raceIds, 'race');
  checkRefs('appearance.compatibleClasses', appearance.id, appearance.compatibleClasses ?? [], classIds, 'class');
  checkRefs('appearance.compatibleBuildTemplates', appearance.id, appearance.compatibleBuildTemplates ?? [], buildTemplateIds, 'buildTemplate');
  checkRefs('appearance.compatibleThemes', appearance.id, appearance.compatibleThemes ?? [], visualThemeIds, 'visualTheme');
  for (const size of appearance.compatibleSizes ?? []) if (!validSizeCategories.includes(size)) failures.push(`appearance ${appearance.id} has invalid size: ${size}`);
}
for (const profile of data.curatedMulticlassProfiles) {
  if (!classIds.has(profile.primaryClass)) failures.push(`curatedMulticlassProfile ${profile.id} has unknown primaryClass: ${profile.primaryClass}`);
  if (!classIds.has(profile.secondaryClass)) failures.push(`curatedMulticlassProfile ${profile.id} has unknown secondaryClass: ${profile.secondaryClass}`);
  if (!buildTemplateIds.has(profile.buildTemplateId)) failures.push(`curatedMulticlassProfile ${profile.id} has unknown buildTemplateId: ${profile.buildTemplateId}`);
  checkRefs('curatedMulticlassProfile.compatibleThemes', profile.id, profile.compatibleThemes, visualThemeIds, 'visualTheme');
  checkRefs('curatedMulticlassProfile.preferredThemes', profile.id, profile.preferredThemes, visualThemeIds, 'visualTheme');
}

for (const themeId of visualThemeIds) {
  if (!themeVisualProfileIds.has(themeId)) warnings.push(`visualTheme ${themeId} has no themeVisualProfile`);
  if (!themeContentProfileIds.has(themeId)) warnings.push(`visualTheme ${themeId} has no themeContentProfile`);
}
for (const motifId of narrativeMotifIds) {
  if (![...narrativeVariantIds].some((variantId) => variantId.startsWith(`${motifId}_`))) warnings.push(`narrativeMotif ${motifId} may have no conventionally named variants`);
}

console.log('Data schema validation summary');
console.log(`duplicate ids / missing ids / missing references / empty pools: ${failures.length}`);
console.log(`warnings: ${warnings.length}`);
if (warnings.length > 0) {
  console.log('Warnings');
  for (const warning of warnings.slice(0, 30)) console.log(`- ${warning}`);
  if (warnings.length > 30) console.log(`... ${warnings.length - 30} more warning(s)`);
}
if (failures.length > 0) {
  console.error('Data validation failures');
  for (const failure of failures.slice(0, 100)) console.error(`- ${failure}`);
  if (failures.length > 100) console.error(`... ${failures.length - 100} more failure(s)`);
  process.exit(1);
}
console.log('Data validation passed.');
