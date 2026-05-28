import {
  archetypes,
  armors,
  buildTemplates,
  characterClasses,
  effects,
  emotions,
  lights,
  modeWeights,
  moods,
  poses,
  races,
  silhouettes,
  weapons,
  type ArchetypeOption,
  type ArchetypeTag,
  type ArmorOption,
  type BuildTemplate,
  type CharacterClass,
  type FxOption,
  type LightOption,
  type MoodOption,
  type PoseOption,
  type RaceOption,
  type SilhouetteOption,
  type WeaponOption,
  type WeightedOption,
} from '../data/seedData';

type Mode = (typeof modeWeights)[number]['name'];
type RegenerableLayer = 'template' | 'armor' | 'weapon' | 'silhouette' | 'pose' | 'mood' | 'light' | 'fx';

type TemplateSelection = {
  template: BuildTemplate;
  reason: string;
};

export type CharacterSeed = {
  mode: Mode;
  primaryClass: CharacterClass;
  classes: CharacterClass[];
  race: RaceOption;
  archetype: ArchetypeOption;
  buildTemplate: BuildTemplate;
  templateReason: string;
  silhouette: SilhouetteOption;
  armor: ArmorOption;
  weapon: WeaponOption;
  pose: PoseOption;
  emotion: string;
  mood: MoodOption;
  light: LightOption;
  fx: FxOption;
};

export type GenerationResult = {
  seed: CharacterSeed;
  seedOutput: string;
  promptDraft: string;
  trace: string[];
};

export type ValidationIssue = {
  message: string;
  layers: RegenerableLayer[];
};

const smallRaceNames = ['gnome', 'halfling', 'fairy'];
const casterClasses: CharacterClass[] = ['wizard', 'sorcerer'];
const hardArmorTags = ['light', 'medium', 'heavy', 'metal'];
const fallbackTemplateByClass: Record<CharacterClass, string> = {
  artificer: 'battle_engineer',
  barbarian: 'savage_berserker',
  bard: 'fey_trickster',
  cleric: 'holy_warrior',
  druid: 'fey_trickster',
  fighter: 'frontier_hunter',
  monk: 'wandering_martial_artist',
  paladin: 'holy_warrior',
  ranger: 'frontier_hunter',
  rogue: 'shadow_skirmisher',
  sorcerer: 'arcane_caster',
  warlock: 'arcane_caster',
  wizard: 'arcane_caster',
};

function weightedPick<T extends { weight: number }>(options: readonly T[]): T {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * total;

  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) {
      return option;
    }
  }

  return options[options.length - 1];
}

function pickByName<T extends { name: string }>(options: Array<WeightedOption<T>>, names: string[]): Array<WeightedOption<T>> {
  return options.filter((option) => names.includes(option.name));
}

function pickDistinctClasses(count: number): CharacterClass[] {
  const selected: CharacterClass[] = [];

  while (selected.length < count) {
    const nextClass = weightedPick(characterClasses).name;
    if (!selected.includes(nextClass)) {
      selected.push(nextClass);
    }
  }

  return selected;
}

function pickClasses(mode: Mode): CharacterClass[] {
  if (mode === 'multiclass') {
    return pickDistinctClasses(2);
  }

  if (mode === 'chaos') {
    return pickDistinctClasses(Math.random() > 0.45 ? 3 : 2);
  }

  return [weightedPick(characterClasses).name];
}

function hasAny<T extends string>(actualTags: T[], requiredTags: T[]): boolean {
  return requiredTags.some((tag) => actualTags.includes(tag));
}

function isCartographerLike(archetype: ArchetypeOption): boolean {
  return archetype.tags.includes('cartographer');
}

function isScholarLike(archetype: ArchetypeOption): boolean {
  return archetype.tags.includes('scholar') || archetype.tags.includes('academy') || archetype.tags.includes('arcane');
}

function getCompatibleArchetypes(classes: CharacterClass[]) {
  return archetypes.filter((archetype) => archetype.classes.some((className) => classes.includes(className)));
}

function pickArchetype(classes: CharacterClass[]): ArchetypeOption {
  const compatible = getCompatibleArchetypes(classes);
  return weightedPick(compatible.length > 0 ? compatible : archetypes);
}

function getTemplate(id: string): BuildTemplate {
  return buildTemplates.find((template) => template.id === id) ?? buildTemplates[0];
}

function templateScore(template: BuildTemplate, primaryClass: CharacterClass, archetype: ArchetypeOption, race: RaceOption): number {
  if (!template.allowedClasses.includes(primaryClass)) {
    return -1;
  }

  if (
    template.id === 'divine_scholar' &&
    !['cleric', 'wizard', 'artificer'].includes(primaryClass) &&
    !isCartographerLike(archetype) &&
    !isScholarLike(archetype)
  ) {
    return -1;
  }

  let score = 1;

  if (template.preferredArchetypes.includes(archetype.name)) {
    score += 8;
  }

  score += archetype.tags.filter((tag) => template.preferredArchetypeTags.includes(tag)).length * 3;

  if (race.tags.includes('fey') && template.id === 'fey_trickster') {
    score += 4;
  }

  if (isCartographerLike(archetype) && template.id === 'divine_scholar') {
    score += 8;
  }

  if (archetype.tags.includes('hunter') && template.id === 'frontier_hunter') {
    score += 4;
  }

  return score;
}

function selectBuildTemplate(primaryClass: CharacterClass, archetype: ArchetypeOption, race: RaceOption): TemplateSelection {
  const scored = buildTemplates
    .map((template) => ({ template, score: templateScore(template, primaryClass, archetype, race) }))
    .filter((entry) => entry.score > 1);

  if (scored.length > 0) {
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const best = scored.filter((entry) => entry.score === bestScore).map((entry) => ({ ...entry.template, weight: entry.template.weight }));
    const template = weightedPick(best);
    return {
      template,
      reason: `matched primary class ${primaryClass} and archetype tags ${archetype.tags.join(', ')}`,
    };
  }

  const fallbackId = fallbackTemplateByClass[primaryClass];
  return {
    template: getTemplate(fallbackId),
    reason: `safe fallback for primary class ${primaryClass}`,
  };
}

function templateOptions<T extends { name: string }>(options: Array<WeightedOption<T>>, names: string[]): Array<WeightedOption<T>> {
  const filtered = pickByName(options, names);
  return filtered.length > 0 ? filtered : options;
}

function prefer<T extends { name: string; tags: string[] }>(options: Array<WeightedOption<T>>, predicates: Array<(option: WeightedOption<T>) => boolean>) {
  for (const predicate of predicates) {
    const preferred = options.filter(predicate);
    if (preferred.length > 0) {
      return preferred;
    }
  }

  return options;
}

function constrainedArmorOptions(template: BuildTemplate, archetype: ArchetypeOption, primaryClass: CharacterClass) {
  const options = templateOptions(armors, template.allowedArmor);

  return prefer(options, [
    (armor) => casterClasses.includes(primaryClass) && armor.tags.includes('cloth'),
    (armor) => archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen') ? hasAny(armor.tags, ['heavy', 'medium', 'metal']) : false,
    (armor) => isScholarLike(archetype) && primaryClass !== 'cleric' ? armor.tags.includes('cloth') : false,
  ]);
}

function constrainedWeaponOptions(template: BuildTemplate, archetype: ArchetypeOption) {
  const options = templateOptions(weapons, template.allowedWeapons);

  return prefer(options, [
    (weapon) => isCartographerLike(archetype) && hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']),
    (weapon) => (archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen')) && hasAny(weapon.tags, ['shield', 'mace', 'warhammer', 'holy-focus']),
    (weapon) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(weapon.tags, ['bow', 'spear', 'dual-blades', 'handaxe']),
    (weapon) => hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(weapon.tags, ['rapier', 'instrument', 'flute', 'dagger', 'fey-focus']),
    (weapon) => hasAny(archetype.tags, ['academy', 'arcane', 'mage']) && hasAny(weapon.tags, ['staff', 'book', 'orb', 'wand']),
  ]);
}

function constrainedPoseOptions(template: BuildTemplate, archetype: ArchetypeOption, weapon: WeaponOption) {
  const options = templateOptions(poses, template.allowedPoses);

  return prefer(options, [
    (pose) => isCartographerLike(archetype) && hasAny(pose.tags, ['map', 'tools']),
    (pose) => hasAny(weapon.tags, ['bow', 'longbow', 'shortbow']) && pose.tags.includes('bow'),
    (pose) => weapon.tags.includes('shield') && pose.tags.includes('shield'),
    (pose) => weapon.tags.includes('rapier') && pose.tags.includes('rapier'),
    (pose) => hasAny(weapon.tags, ['heavy', 'greataxe', 'greatsword']) && pose.tags.includes('heavy-melee'),
    (pose) => hasAny(weapon.tags, ['tool', 'mechanical-focus']) && hasAny(pose.tags, ['tools', 'casting']),
    (pose) => hasAny(weapon.tags, ['staff', 'orb', 'wand', 'book', 'magic-focus', 'holy-focus']) && hasAny(pose.tags, ['casting', 'prayer']),
    (pose) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(pose.tags, ['tracking', 'bow', 'general']),
  ]);
}

function constrainedSilhouetteOptions(template: BuildTemplate, seed: Pick<CharacterSeed, 'mode' | 'race' | 'archetype'>) {
  const options = templateOptions(silhouettes, template.allowedSilhouettes).filter((silhouette) => {
    if (smallRaceNames.includes(seed.race.name) && ['tall robed column', 'towering bestial frame'].includes(silhouette.name)) {
      return false;
    }

    if (seed.race.tags.includes('fey') && ['tall robed column', 'towering bestial frame'].includes(silhouette.name)) {
      return false;
    }

    return true;
  });

  return prefer(options.length > 0 ? options : templateOptions(silhouettes, ['compact and nimble']), [
    (silhouette) => hasAny(seed.archetype.tags, ['fey', 'trickster']) && silhouette.tags.includes('fey'),
    (silhouette) => hasAny(seed.archetype.tags, ['tools', 'scholar']) && hasAny(silhouette.tags, ['engineer', 'robed']),
  ]);
}

function constrainedMoodOptions(template: BuildTemplate, archetype: ArchetypeOption) {
  const options = templateOptions(moods, template.allowedMoods);
  return prefer(options, [(mood) => mood.tags.some((tag) => archetype.tags.includes(tag))]);
}

function constrainedLightOptions(template: BuildTemplate, archetype: ArchetypeOption) {
  const options = templateOptions(lights, template.allowedLights);
  return prefer(options, [(light) => light.tags.some((tag) => archetype.tags.includes(tag))]);
}

function constrainedFxOptions(template: BuildTemplate, archetype: ArchetypeOption) {
  const options = templateOptions(effects, template.allowedFx);
  return prefer(options, [
    (fx) => isCartographerLike(archetype) && hasAny(fx.tags, ['cartographer', 'scholar']),
    (fx) => (archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen')) && hasAny(fx.tags, ['holy', 'fallen']),
    (fx) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(fx.tags, ['frontier', 'hunter', 'nature']),
    (fx) => hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(fx.tags, ['fey', 'trickster']),
    (fx) => hasAny(archetype.tags, ['academy', 'arcane', 'mage']) && hasAny(fx.tags, ['mage', 'scholar']),
  ]);
}

function createSeed(): CharacterSeed {
  const mode = weightedPick(modeWeights).name;
  const classes = pickClasses(mode);
  const primaryClass = classes[0];
  const race = weightedPick(races);
  const archetype = pickArchetype(classes);
  const { template: buildTemplate, reason: templateReason } = selectBuildTemplate(primaryClass, archetype, race);
  const armor = weightedPick(constrainedArmorOptions(buildTemplate, archetype, primaryClass));
  const weapon = weightedPick(constrainedWeaponOptions(buildTemplate, archetype));
  const silhouette = weightedPick(constrainedSilhouetteOptions(buildTemplate, { mode, race, archetype }));
  const pose = weightedPick(constrainedPoseOptions(buildTemplate, archetype, weapon));

  return {
    mode,
    primaryClass,
    classes,
    race,
    archetype,
    buildTemplate,
    templateReason,
    silhouette,
    armor,
    weapon,
    pose,
    emotion: weightedPick(emotions).name,
    mood: weightedPick(constrainedMoodOptions(buildTemplate, archetype)),
    light: weightedPick(constrainedLightOptions(buildTemplate, archetype)),
    fx: weightedPick(constrainedFxOptions(buildTemplate, archetype)),
  };
}

function isInAllowedList(seed: CharacterSeed, layer: 'armor' | 'weapon' | 'pose' | 'silhouette' | 'mood' | 'light' | 'fx') {
  const allowedMap = {
    armor: seed.buildTemplate.allowedArmor,
    weapon: seed.buildTemplate.allowedWeapons,
    pose: seed.buildTemplate.allowedPoses,
    silhouette: seed.buildTemplate.allowedSilhouettes,
    mood: seed.buildTemplate.allowedMoods,
    light: seed.buildTemplate.allowedLights,
    fx: seed.buildTemplate.allowedFx,
  };
  return allowedMap[layer].includes(seed[layer].name);
}

function usesForbiddenTemplateTag(seed: CharacterSeed): boolean {
  const tags: string[] = [
    ...seed.armor.tags,
    ...seed.weapon.tags,
    ...seed.pose.tags,
    ...seed.silhouette.tags,
    ...seed.mood.tags,
    ...seed.light.tags,
    ...seed.fx.tags,
  ];
  return seed.buildTemplate.forbiddenTags.some((tag) => tags.includes(tag));
}

export function validateGeneratedSeed(seed: CharacterSeed): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const weaponTags = seed.weapon.tags;
  const armorTags = seed.armor.tags;
  const poseTags = seed.pose.tags;
  const smallOrFey = smallRaceNames.includes(seed.race.name) || seed.race.tags.includes('fey');

  if (!seed.buildTemplate.allowedClasses.includes(seed.primaryClass)) {
    issues.push({ message: `${seed.buildTemplate.id} does not allow ${seed.primaryClass}`, layers: ['template'] });
  }

  for (const layer of ['armor', 'weapon', 'pose', 'silhouette', 'mood', 'light', 'fx'] as const) {
    if (!isInAllowedList(seed, layer)) {
      issues.push({ message: `${layer} is outside build template ${seed.buildTemplate.id}`, layers: [layer] });
    }
  }

  if (usesForbiddenTemplateTag(seed)) {
    issues.push({ message: `build template ${seed.buildTemplate.id} forbidden tag detected`, layers: ['armor', 'weapon', 'pose', 'silhouette', 'mood', 'light', 'fx'] });
  }

  if (casterClasses.includes(seed.primaryClass) && (hasAny(armorTags, hardArmorTags) || hasAny(weaponTags, ['shield', 'rapier', 'longbow', 'greataxe', 'bow']))) {
    issues.push({ message: 'wizard/sorcerer cannot have armor, shield, rapier, longbow, or greataxe', layers: ['armor', 'weapon', 'pose'] });
  }

  if (seed.primaryClass === 'monk' && (hasAny(armorTags, hardArmorTags) || hasAny(weaponTags, ['shield', 'rapier', 'longbow', 'greataxe']) || !hasAny(weaponTags, ['unarmed', 'staff', 'simple']))) {
    issues.push({ message: 'monk must stay cloth/no-armor with unarmed/staff/simple monk weapon only', layers: ['armor', 'weapon', 'pose'] });
  }

  if (seed.primaryClass === 'rogue' && (armorTags.includes('heavy') || ['chain mail under a weathered tabard', 'half plate with campaign dents'].includes(seed.armor.name))) {
    issues.push({ message: 'rogue cannot use chain mail, half plate, or heavy armor', layers: ['armor'] });
  }

  if (seed.classes.includes('barbarian') && weaponTags.includes('rapier')) {
    issues.push({ message: 'barbarian cannot use rapier as main weapon', layers: ['weapon', 'pose'] });
  }

  if (seed.classes.includes('barbarian') && weaponTags.includes('longbow')) {
    issues.push({ message: 'barbarian cannot use longbow as main weapon', layers: ['weapon', 'pose'] });
  }

  if ((smallRaceNames.includes(seed.race.name) || seed.race.tags.includes('fey')) && ['tall robed column', 'towering bestial frame'].includes(seed.silhouette.name)) {
    issues.push({ message: 'small/fey races cannot use tall/towering silhouettes', layers: ['silhouette'] });
  }

  if (seed.mode !== 'chaos' && smallOrFey && (weaponTags.includes('oversized') || seed.weapon.name === 'heavy greataxe')) {
    issues.push({ message: 'small/fey races cannot use heavy greataxe or oversized weapons outside chaos mode', layers: ['weapon', 'pose'] });
  }

  if (poseTags.includes('map') && !(hasAny(weaponTags, ['map', 'book', 'scroll', 'compass']) || isCartographerLike(seed.archetype) || isScholarLike(seed.archetype))) {
    issues.push({ message: 'studying map pose requires map/book/scroll/compass or cartographer/scholar archetype', layers: ['pose', 'weapon'] });
  }

  if (poseTags.includes('shield') && !(weaponTags.includes('shield') || armorTags.includes('shield'))) {
    issues.push({ message: 'shield pose requires shield in weapon/tool or armor', layers: ['pose', 'weapon', 'armor'] });
  }

  if (poseTags.includes('bow') && !weaponTags.includes('bow')) {
    issues.push({ message: 'bow pose requires bow weapon', layers: ['pose', 'weapon'] });
  }

  if (isCartographerLike(seed.archetype) && !(hasAny(weaponTags, ['map', 'compass', 'scroll', 'book', 'staff']) && hasAny(poseTags, ['map', 'tools']))) {
    issues.push({ message: 'cartographer archetype requires map/compass/scroll/book/staff and map/ritual pose', layers: ['weapon', 'pose', 'fx', 'light'] });
  }

  return issues;
}

function rerollLayer(seed: CharacterSeed, layer: RegenerableLayer): CharacterSeed {
  if (layer === 'template') {
    const selection = selectBuildTemplate(seed.primaryClass, seed.archetype, seed.race);
    return { ...seed, buildTemplate: selection.template, templateReason: selection.reason };
  }

  if (layer === 'armor') {
    return { ...seed, armor: weightedPick(constrainedArmorOptions(seed.buildTemplate, seed.archetype, seed.primaryClass)) };
  }

  if (layer === 'weapon') {
    const weapon = weightedPick(constrainedWeaponOptions(seed.buildTemplate, seed.archetype));
    return { ...seed, weapon, pose: weightedPick(constrainedPoseOptions(seed.buildTemplate, seed.archetype, weapon)) };
  }

  if (layer === 'silhouette') {
    return { ...seed, silhouette: weightedPick(constrainedSilhouetteOptions(seed.buildTemplate, seed)) };
  }

  if (layer === 'pose') {
    return { ...seed, pose: weightedPick(constrainedPoseOptions(seed.buildTemplate, seed.archetype, seed.weapon)) };
  }

  if (layer === 'mood') {
    return { ...seed, mood: weightedPick(constrainedMoodOptions(seed.buildTemplate, seed.archetype)) };
  }

  if (layer === 'light') {
    return { ...seed, light: weightedPick(constrainedLightOptions(seed.buildTemplate, seed.archetype)) };
  }

  return { ...seed, fx: weightedPick(constrainedFxOptions(seed.buildTemplate, seed.archetype)) };
}

function replaceWithFallbackTemplate(seed: CharacterSeed, trace: string[]): CharacterSeed {
  const fallback = getTemplate(fallbackTemplateByClass[seed.primaryClass]);
  trace.push(`Switching to safe fallback buildTemplate ${fallback.id} for ${seed.primaryClass}.`);

  const nextSeed: CharacterSeed = {
    ...seed,
    buildTemplate: fallback,
    templateReason: `safe fallback after unresolved validation for ${seed.primaryClass}`,
  };

  const armor = weightedPick(constrainedArmorOptions(fallback, nextSeed.archetype, nextSeed.primaryClass));
  const weapon = weightedPick(constrainedWeaponOptions(fallback, nextSeed.archetype));

  return {
    ...nextSeed,
    armor,
    weapon,
    silhouette: weightedPick(constrainedSilhouetteOptions(fallback, nextSeed)),
    pose: weightedPick(constrainedPoseOptions(fallback, nextSeed.archetype, weapon)),
    mood: weightedPick(constrainedMoodOptions(fallback, nextSeed.archetype)),
    light: weightedPick(constrainedLightOptions(fallback, nextSeed.archetype)),
    fx: weightedPick(constrainedFxOptions(fallback, nextSeed.archetype)),
  };
}

function resolveSeedConflicts(seed: CharacterSeed, trace: string[]): CharacterSeed {
  let nextSeed = seed;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const issues = validateGeneratedSeed(nextSeed);

    if (issues.length === 0) {
      trace.push(`Final validation status: passed after ${attempt} validation check(s).`);
      return nextSeed;
    }

    const layers = [...new Set<RegenerableLayer>(issues.flatMap((issue) => issue.layers))];
    trace.push(`Reroll attempt ${attempt}: ${layers.join(', ')} because ${issues.map((issue) => issue.message).join('; ')}.`);

    for (const layer of layers) {
      nextSeed = rerollLayer(nextSeed, layer);
    }
  }

  nextSeed = replaceWithFallbackTemplate(nextSeed, trace);

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const issues = validateGeneratedSeed(nextSeed);
    if (issues.length === 0) {
      trace.push(`Final validation status: passed with fallback template after ${attempt} check(s).`);
      return nextSeed;
    }

    const layers = [...new Set<RegenerableLayer>(issues.flatMap((issue) => issue.layers))];
    trace.push(`Fallback reroll attempt ${attempt}: ${layers.join(', ')}.`);
    for (const layer of layers.filter((layer) => layer !== 'template')) {
      nextSeed = rerollLayer(nextSeed, layer);
    }
  }

  trace.push('Final validation status: forced safe cloth/staff fallback after unresolved conflicts.');
  const safeTemplate = getTemplate(seed.primaryClass === 'monk' ? 'wandering_martial_artist' : fallbackTemplateByClass[seed.primaryClass]);
  const armor = armors.find((option) => option.name === (seed.primaryClass === 'monk' ? 'no armor, simple travel wraps' : safeTemplate.allowedArmor[0])) ?? armors[0];
  const weapon = weapons.find((option) => option.name === safeTemplate.allowedWeapons[0]) ?? weapons[0];
  return {
    ...nextSeed,
    buildTemplate: safeTemplate,
    armor,
    weapon,
    silhouette: silhouettes.find((option) => option.name === 'compact and nimble') ?? silhouettes[0],
    pose: poses.find((option) => option.name === 'ready stance on a cracked dungeon tile') ?? poses[0],
    mood: moods.find((option) => safeTemplate.allowedMoods.includes(option.name)) ?? moods[0],
    light: lights.find((option) => safeTemplate.allowedLights.includes(option.name)) ?? lights[0],
    fx: effects.find((option) => safeTemplate.allowedFx.includes(option.name)) ?? effects[0],
  };
}

function formatClassLine(seed: CharacterSeed): string {
  if (seed.mode === 'ordinary class') {
    return seed.primaryClass;
  }

  return `${seed.primaryClass} primary (${seed.classes.join(' / ')})`;
}

function formatSeed(seed: CharacterSeed): string {
  return [
    `Mode: ${seed.mode}`,
    `Primary Class: ${seed.primaryClass}`,
    `Class: ${formatClassLine(seed)}`,
    `Race: ${seed.race.name}`,
    `Archetype: ${seed.archetype.name}`,
    `Build Template: ${seed.buildTemplate.id}`,
    `Silhouette: ${seed.silhouette.name}`,
    `Armor: ${seed.armor.name}`,
    `Weapon / Tool: ${seed.weapon.name}`,
    `Pose: ${seed.pose.name}`,
    `Emotion: ${seed.emotion}`,
    `Mood: ${seed.mood.name}`,
    `Light: ${seed.light.name}`,
    `FX: ${seed.fx.name}`,
  ].join('\n');
}

function formatPrompt(seed: CharacterSeed): string {
  return [
    `Create a D&D character concept art portrait of a ${seed.race.name} ${formatClassLine(seed)}.`,
    `Build template: ${seed.buildTemplate.label}. Core fantasy: ${seed.archetype.name}.`,
    `Silhouette: ${seed.silhouette.name}; armor: ${seed.armor.name}; weapon or prop: ${seed.weapon.name}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    `Mood: ${seed.mood.name}; lighting: ${seed.light.name}; visual effects: ${seed.fx.name}.`,
    'Detailed fantasy illustration, strong readable design, build-template coherent gear, no text in image.',
  ].join(' ');
}

export function generateCharacterSeed(): GenerationResult {
  const trace: string[] = ['Starting v2 build-template cascade generation.'];
  const seed = createSeed();

  trace.push(`Selected mode: ${seed.mode}.`);
  trace.push(`Selected class: primary ${seed.primaryClass}; classes ${seed.classes.join(' / ')}.`);
  trace.push(`Selected archetype: ${seed.archetype.name} (${seed.archetype.tags.join(', ')}).`);
  trace.push(`Selected buildTemplate: ${seed.buildTemplate.id}.`);
  trace.push(`Template selection reason: ${seed.templateReason}.`);

  const resolvedSeed = resolveSeedConflicts(seed, trace);

  return {
    seed: resolvedSeed,
    seedOutput: formatSeed(resolvedSeed),
    promptDraft: formatPrompt(resolvedSeed),
    trace,
  };
}
