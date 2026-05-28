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
  narrativeMotifs,
  narrativeVariants,
  poses,
  races,
  silhouettes,
  visualThemeVariants,
  visualThemes,
  weapons,
  type ArchetypeOption,
  type ArchetypeTag,
  type ArmorOption,
  type BuildTemplate,
  type CharacterClass,
  type FxOption,
  type LightOption,
  type MoodOption,
  type NarrativeMotif,
  type NarrativeVariant,
  type PoseOption,
  type RaceOption,
  type SizeCategory,
  type SilhouetteOption,
  type VisualTheme,
  type VisualThemeVariant,
  type WeaponOption,
  type WeightedOption,
} from '../data/seedData';

type Mode = (typeof modeWeights)[number]['name'];
type RegenerableLayer = 'template' | 'theme' | 'themeVariant' | 'motif' | 'narrativeVariant' | 'armor' | 'weapon' | 'silhouette' | 'pose' | 'mood' | 'light' | 'fx';

type TemplateSelection = {
  template: BuildTemplate;
  reason: string;
};

export type CharacterSeed = {
  mode: Mode;
  primaryClass: CharacterClass;
  classes: CharacterClass[];
  race: RaceOption;
  size: SizeCategory;
  archetype: ArchetypeOption;
  buildTemplate: BuildTemplate;
  templateReason: string;
  visualTheme: VisualTheme;
  visualThemeVariant: VisualThemeVariant;
  visualDetails: string[];
  narrativeMotif: NarrativeMotif;
  narrativeVariant: NarrativeVariant;
  motifReason: string;
  storyDetails: string[];
  promptFragments: string[];
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
  bard: 'skald_performer',
  cleric: 'holy_warrior',
  druid: 'frontier_hunter',
  fighter: 'martial_veteran',
  monk: 'wandering_martial_artist',
  paladin: 'holy_warrior',
  ranger: 'frontier_hunter',
  rogue: 'shadow_skirmisher',
  sorcerer: 'arcane_caster',
  warlock: 'arcane_caster',
  wizard: 'arcane_caster',
};

function getRaceSize(race: RaceOption): SizeCategory {
  if (race.name === 'fairy') return 'tiny';
  if (['halfling', 'gnome'].includes(race.name)) return 'small';
  if (['goliath'].includes(race.name)) return 'large';
  return 'medium';
}

function uniqueCleanDetails(details: string[]): string[] {
  return [...new Set(details.map((detail) => detail.trim()).filter((detail) => detail.length > 0 && !detail.endsWith(',')))];
}

function pickVisualDetails(theme: VisualTheme, variant: VisualThemeVariant): string[] {
  const stable = uniqueCleanDetails(theme.visualDetails).sort(() => Math.random() - 0.5);
  const fresh = uniqueCleanDetails(variant.visualDetails).sort(() => Math.random() - 0.5);
  return uniqueCleanDetails([...stable.slice(0, 2), ...fresh.slice(0, 1), ...stable, ...fresh]).slice(0, 3);
}

function pickStoryDetails(motif: NarrativeMotif, variant: NarrativeVariant): string[] {
  const stable = uniqueCleanDetails(motif.storyDetails).sort(() => Math.random() - 0.5);
  const fresh = uniqueCleanDetails(variant.storyDetails).sort(() => Math.random() - 0.5);
  return uniqueCleanDetails([...stable.slice(0, 1), ...fresh.slice(0, 2), ...stable, ...fresh]).slice(0, 3);
}

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

function canUseDivineScholar(primaryClass: CharacterClass, archetype: ArchetypeOption): boolean {
  if (primaryClass === 'bard') {
    return archetype.tags.includes('holy');
  }
  return ['cleric', 'paladin', 'wizard', 'sorcerer', 'artificer'].includes(primaryClass) || isCartographerLike(archetype) || isScholarLike(archetype);
}

function preferredTemplateIds(primaryClass: CharacterClass, archetype: ArchetypeOption, mode: Mode): string[] {
  if (mode !== 'chaos' && primaryClass === 'monk') {
    return ['wandering_martial_artist'];
  }

  if (primaryClass === 'bard') {
    if (canUseDivineScholar(primaryClass, archetype)) {
      return ['lorekeeper_bard', 'divine_scholar', 'skald_performer'];
    }
    if (hasAny(archetype.tags, ['academy', 'scholar', 'cartographer'])) {
      return ['lorekeeper_bard', 'skald_performer'];
    }
    return hasAny(archetype.tags, ['fey', 'trickster']) ? ['fey_trickster', 'skald_performer', 'lorekeeper_bard'] : ['skald_performer', 'lorekeeper_bard', 'fey_trickster'];
  }

  if (isCartographerLike(archetype)) {
    return ['divine_scholar'];
  }

  if (primaryClass === 'artificer') {
    return canUseDivineScholar(primaryClass, archetype) ? ['battle_engineer', 'divine_scholar'] : ['battle_engineer'];
  }

  if (primaryClass === 'warlock') {
    if (hasAny(archetype.tags, ['fey', 'trickster'])) {
      return ['fey_trickster', 'arcane_caster'];
    }
    return ['arcane_caster', 'fey_trickster'];
  }

  if (primaryClass === 'rogue') {
    return hasAny(archetype.tags, ['fey', 'trickster']) ? ['fey_trickster', 'shadow_skirmisher'] : ['shadow_skirmisher', 'fey_trickster'];
  }

  if (casterClasses.includes(primaryClass)) {
    return canUseDivineScholar(primaryClass, archetype) ? ['arcane_caster', 'divine_scholar'] : ['arcane_caster'];
  }

  if (['cleric', 'paladin'].includes(primaryClass)) {
    return canUseDivineScholar(primaryClass, archetype) ? ['holy_warrior', 'divine_scholar'] : ['holy_warrior'];
  }

  if (primaryClass === 'barbarian') {
    return hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) ? ['frontier_hunter', 'savage_berserker'] : ['savage_berserker', 'frontier_hunter'];
  }

  if (primaryClass === 'druid') {
    if (canUseDivineScholar(primaryClass, archetype)) {
      return ['divine_scholar', 'frontier_hunter'];
    }
    return hasAny(archetype.tags, ['fey', 'trickster']) ? ['fey_trickster', 'frontier_hunter'] : ['frontier_hunter', 'fey_trickster'];
  }

  if (primaryClass === 'ranger') {
    return ['frontier_hunter', 'shadow_skirmisher'];
  }

  if (primaryClass === 'fighter') {
    return hasAny(archetype.tags, ['holy', 'oathkeeper']) ? ['holy_warrior', 'martial_veteran', 'frontier_hunter'] : ['martial_veteran', 'frontier_hunter', 'savage_berserker', 'shadow_skirmisher'];
  }

  return [fallbackTemplateByClass[primaryClass]];
}

function getCompatibleArchetypes(classes: CharacterClass[]) {
  return archetypes.filter((archetype) => archetype.classes.some((className) => classes.includes(className)));
}

function pickArchetype(classes: CharacterClass[], primaryClass: CharacterClass): ArchetypeOption {
  const primaryCompatible = archetypes.filter((archetype) => archetype.classes.includes(primaryClass));
  const compatible = getCompatibleArchetypes(classes);
  return weightedPick(primaryCompatible.length > 0 ? primaryCompatible : compatible.length > 0 ? compatible : archetypes);
}

function getTemplate(id: string): BuildTemplate {
  return buildTemplates.find((template) => template.id === id) ?? buildTemplates[0];
}

function templateScore(template: BuildTemplate, primaryClass: CharacterClass, archetype: ArchetypeOption, race: RaceOption, mode: Mode): number {
  if (!template.allowedClasses.includes(primaryClass)) {
    return -1;
  }

  if (primaryClass === 'fighter' && template.id === 'holy_warrior' && !hasAny(archetype.tags, ['holy', 'oathkeeper'])) {
    return -1;
  }

  const preferredIds = preferredTemplateIds(primaryClass, archetype, mode);
  if (!preferredIds.includes(template.id)) {
    return -1;
  }

  let score = 10 - preferredIds.indexOf(template.id) * 2;

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

function selectBuildTemplate(primaryClass: CharacterClass, archetype: ArchetypeOption, race: RaceOption, mode: Mode): TemplateSelection {
  const scored = buildTemplates
    .map((template) => ({ template, score: templateScore(template, primaryClass, archetype, race, mode) }))
    .filter((entry) => entry.score > 1);

  if (scored.length > 0) {
    const bestScore = Math.max(...scored.map((entry) => entry.score));
    const best = scored.filter((entry) => entry.score === bestScore).map((entry) => ({ ...entry.template, weight: entry.template.weight }));
    const template = weightedPick(best);
    return {
      template,
      reason: `primary class ${primaryClass} preferred ${preferredTemplateIds(primaryClass, archetype, mode).join(' / ')}; matched archetype tags ${archetype.tags.join(', ')}`,
    };
  }

  const fallbackId = fallbackTemplateByClass[primaryClass];
  return {
    template: getTemplate(fallbackId),
    reason: `safe fallback for primary class ${primaryClass}`,
  };
}


function selectVisualTheme(template: BuildTemplate, archetype: ArchetypeOption, race: RaceOption): VisualTheme {
  const candidates = visualThemes.filter((theme) => theme.buildTemplateId === template.id);
  const forcedByArchetype = candidates.filter((theme) => {
    if (archetype.tags.includes('void')) return theme.id === 'void_oracle';
    if (archetype.tags.includes('pirate')) return theme.id === 'pirate_raider' || theme.id === 'lore_skald' || theme.id === 'relic_thief';
    if (archetype.tags.includes('cartographer')) return ['relic_thief', 'academy_mage', 'ritualist', 'divine_archivist'].includes(theme.id);
    if (archetype.name === 'exiled temple guardian') return ['temple_guardian', 'battle_chaplain', 'grave_warden'].includes(theme.id);
    return false;
  });

  const pool = forcedByArchetype.length > 0 ? forcedByArchetype : candidates;
  const scored = pool.map((theme) => {
    let score = theme.weight;
    if (theme.archetypeNames.includes(archetype.name)) score += 10;
    score += theme.archetypeTags.filter((tag) => archetype.tags.includes(tag)).length * 4;
    if (race.name === 'fairy' || race.name === 'satyr') score += theme.id.includes('fey') || theme.id.includes('sprite') ? 3 : 0;
    return { ...theme, weight: Math.max(1, score) };
  });

  if (scored.length === 0) {
    return weightedPick(visualThemes.filter((theme) => theme.buildTemplateId === template.id));
  }

  const bestScore = Math.max(...scored.map((theme) => theme.weight));
  return weightedPick(scored.filter((theme) => theme.weight === bestScore));
}

function themeNames(names: string[], fallback: string[]): string[] {
  return names.length > 0 ? names : fallback;
}

function selectVisualThemeVariant(theme: VisualTheme, fxOptions: string[] = theme.preferredFx): VisualThemeVariant {
  const variants = visualThemeVariants.filter((variant) => variant.visualThemeId === theme.id);
  if (variants.length === 0) {
    return {
      id: `${theme.id}_default_variant`,
      label: `${theme.label} Default Variant`,
      visualThemeId: theme.id,
      visualDetails: theme.visualDetails.slice(0, 3),
      promptFragments: [`keeps the core ${theme.label.toLowerCase()} visual identity`],
      preferredFx: fxOptions,
    };
  }

  return weightedPick(variants.map((variant) => ({
    ...variant,
    weight: Math.max(1, variant.weight + variant.preferredFx.filter((fx) => fxOptions.includes(fx)).length),
  })));
}


type MotifSelection = {
  motif: NarrativeMotif;
  reason: string;
};

function selectNarrativeMotif(seed: Pick<CharacterSeed, 'primaryClass' | 'race' | 'archetype' | 'buildTemplate' | 'visualTheme'>): MotifSelection {
  const allTags = [...seed.archetype.tags, seed.buildTemplate.id, seed.visualTheme.id];
  const candidates = narrativeMotifs.filter((motif) => {
    if (motif.id === 'seasoned_adventurer') return false;
    const buildMatch = motif.compatibleBuildTemplates.length === 0 || motif.compatibleBuildTemplates.includes(seed.buildTemplate.id);
    const themeMatch = motif.compatibleVisualThemes.length === 0 || motif.compatibleVisualThemes.includes(seed.visualTheme.id);
    const classAllowed = !motif.forbiddenClasses.includes(seed.primaryClass);
    const tagsAllowed = !motif.forbiddenTags.some((tag) => allTags.includes(tag));
    return buildMatch && themeMatch && classAllowed && tagsAllowed;
  });

  const scored = candidates.map((motif) => {
    let score = motif.weight;
    score += motif.archetypeTags.filter((tag) => seed.archetype.tags.includes(tag)).length * 4;
    if (motif.classBias.includes(seed.primaryClass)) score += 3;
    if (motif.raceBias.includes(seed.race.name)) score += 3;
    if (motif.compatibleVisualThemes.includes(seed.visualTheme.id)) score += 5;
    return { ...motif, weight: Math.max(1, score) };
  });

  if (scored.length > 0) {
    const bestScore = Math.max(...scored.map((motif) => motif.weight));
    const motif = weightedPick(scored.filter((item) => item.weight === bestScore));
    return {
      motif,
      reason: `matched ${seed.buildTemplate.id}/${seed.visualTheme.id}, class ${seed.primaryClass}, race ${seed.race.name}, archetype tags ${seed.archetype.tags.join(', ')}`,
    };
  }

  return {
    motif: narrativeMotifs.find((motif) => motif.id === 'seasoned_adventurer') ?? narrativeMotifs[narrativeMotifs.length - 1],
    reason: 'fallback motif after no compatible narrative motif matched filters',
  };
}

function selectNarrativeVariant(motif: NarrativeMotif, fxOptions: string[] = motif.fxBias): NarrativeVariant {
  const variants = narrativeVariants.filter((variant) => variant.narrativeMotifId === motif.id);
  if (variants.length === 0) {
    return {
      id: `${motif.id}_default_variant`,
      label: `${motif.label} Default Variant`,
      narrativeMotifId: motif.id,
      storyDetails: motif.storyDetails.slice(0, 3),
      promptFragments: motif.promptFragments,
      moodBias: motif.moodBias,
      fxBias: motif.fxBias,
    };
  }

  return weightedPick(variants.map((variant) => ({
    ...variant,
    weight: Math.max(1, variant.weight + variant.fxBias.filter((fx) => fxOptions.includes(fx)).length),
  })));
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

function constrainedArmorOptions(template: BuildTemplate, archetype: ArchetypeOption, primaryClass: CharacterClass, size: SizeCategory, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredArmor ?? []).filter((name) => template.allowedArmor.includes(name)), template.allowedArmor);
  const sizeFilter = (armor: WeightedOption<ArmorOption>) => !(size === 'tiny' && armor.name === 'full plate with engraved pauldrons');
  const preferredOptions = templateOptions(armors, names).filter(sizeFilter);
  const options = preferredOptions.length > 0 ? preferredOptions : templateOptions(armors, template.allowedArmor).filter(sizeFilter);

  return prefer(options.length > 0 ? options : templateOptions(armors, template.allowedArmor), [
    (armor) => casterClasses.includes(primaryClass) && armor.tags.includes('cloth'),
    (armor) => archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen') ? hasAny(armor.tags, ['heavy', 'medium', 'metal']) : false,
    (armor) => isScholarLike(archetype) && primaryClass !== 'cleric' ? armor.tags.includes('cloth') : false,
  ]);
}

function constrainedWeaponOptions(template: BuildTemplate, archetype: ArchetypeOption, size: SizeCategory, race: RaceOption, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredWeapons ?? []).filter((name) => template.allowedWeapons.includes(name)), template.allowedWeapons);
  const sizeFilter = (weapon: WeightedOption<WeaponOption>) => !((['tiny', 'small'].includes(size) || race.tags.includes('fey')) && (weapon.tags.includes('oversized') || weapon.tags.includes('greataxe')));
  const preferredOptions = templateOptions(weapons, names).filter(sizeFilter);
  const options = preferredOptions.length > 0 ? preferredOptions : templateOptions(weapons, template.allowedWeapons).filter(sizeFilter);

  return prefer(options.length > 0 ? options : templateOptions(weapons, template.allowedWeapons), [
    (weapon) => isCartographerLike(archetype) && hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']),
    (weapon) => (archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen')) && hasAny(weapon.tags, ['shield', 'mace', 'warhammer', 'holy-focus']),
    (weapon) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(weapon.tags, ['bow', 'spear', 'dual-blades', 'handaxe']),
    (weapon) => hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(weapon.tags, ['rapier', 'instrument', 'flute', 'dagger', 'fey-focus']),
    (weapon) => hasAny(archetype.tags, ['academy', 'arcane', 'mage']) && hasAny(weapon.tags, ['staff', 'book', 'orb', 'wand']),
  ]);
}

function constrainedPoseOptions(template: BuildTemplate, archetype: ArchetypeOption, weapon: WeaponOption, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredPoses ?? []).filter((name) => template.allowedPoses.includes(name)), template.allowedPoses);
  const options = templateOptions(poses, names);

  return prefer(options, [
    (pose) => isCartographerLike(archetype) && hasAny(pose.tags, ['map', 'tools']),
    (pose) => hasAny(weapon.tags, ['bow', 'longbow', 'shortbow']) && pose.tags.includes('bow'),
    (pose) => weapon.tags.includes('shield') && pose.tags.includes('shield'),
    (pose) => weapon.tags.includes('dual-blades') && pose.tags.includes('dual-blades'),
    (pose) => weapon.tags.includes('rapier') && pose.tags.includes('rapier'),
    (pose) => hasAny(weapon.tags, ['heavy', 'greataxe', 'greatsword']) && pose.tags.includes('heavy-melee'),
    (pose) => hasAny(weapon.tags, ['tool', 'mechanical-focus']) && hasAny(pose.tags, ['tools', 'casting']),
    (pose) => hasAny(weapon.tags, ['staff', 'orb', 'wand', 'book', 'magic-focus', 'holy-focus']) && hasAny(pose.tags, ['casting', 'prayer']),
    (pose) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(pose.tags, ['tracking', 'bow', 'general']),
  ]);
}

function constrainedSilhouetteOptions(template: BuildTemplate, seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'race' | 'size' | 'archetype'>, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredSilhouettes ?? []).filter((name) => template.allowedSilhouettes.includes(name)), template.allowedSilhouettes);
  const options = templateOptions(silhouettes, names).filter((silhouette) => {
    if (smallRaceNames.includes(seed.race.name) && ['tall robed column', 'towering bestial frame'].includes(silhouette.name)) {
      return false;
    }

    if (seed.size === 'tiny' && ['stocky shield-forward stance', 'towering bestial frame', 'broad heroic triangle'].includes(silhouette.name)) {
      return false;
    }

    if (seed.size === 'small' && silhouette.name === 'towering bestial frame') {
      return false;
    }

    if (seed.race.tags.includes('fey') && ['tall robed column', 'towering bestial frame'].includes(silhouette.name)) {
      return false;
    }

    if (silhouette.name === 'gadget-laden workshop silhouette' && template.id !== 'battle_engineer' && seed.primaryClass !== 'artificer' && !hasAny(seed.archetype.tags, ['academy', 'tools'])) {
      return false;
    }

    if (silhouette.name === 'willowy fey outline' && ['dwarf', 'half-orc'].includes(seed.race.name)) {
      return false;
    }

    if (silhouette.name === 'towering bestial frame' && seed.mode !== 'chaos' && seed.primaryClass !== 'barbarian' && seed.race.name !== 'half-orc') {
      return false;
    }

    return true;
  });

  return prefer(options.length > 0 ? options : templateOptions(silhouettes, ['compact and nimble']), [
    (silhouette) => hasAny(seed.archetype.tags, ['fey', 'trickster']) && silhouette.tags.includes('fey'),
    (silhouette) => hasAny(seed.archetype.tags, ['tools', 'scholar']) && hasAny(silhouette.tags, ['engineer', 'robed']),
  ]);
}

function constrainedMoodOptions(template: BuildTemplate, archetype: ArchetypeOption, theme?: VisualTheme, motif?: NarrativeMotif, narrativeVariant?: NarrativeVariant) {
  const names = themeNames((theme?.preferredMoods ?? []).filter((name) => template.allowedMoods.includes(name)), template.allowedMoods);
  const options = templateOptions(moods, names);
  return prefer(options, [
    (mood) => narrativeVariant ? narrativeVariant.moodBias.includes(mood.name) : false,
    (mood) => motif ? motif.moodBias.includes(mood.name) : false,
    (mood) => mood.tags.some((tag) => archetype.tags.includes(tag)),
  ]);
}

function constrainedLightOptions(template: BuildTemplate, archetype: ArchetypeOption, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredLights ?? []).filter((name) => template.allowedLights.includes(name)), template.allowedLights);
  const options = templateOptions(lights, names);
  return prefer(options, [(light) => light.tags.some((tag) => archetype.tags.includes(tag))]);
}

function constrainedFxOptions(template: BuildTemplate, archetype: ArchetypeOption, theme?: VisualTheme, motif?: NarrativeMotif, themeVariant?: VisualThemeVariant, narrativeVariant?: NarrativeVariant) {
  const themeFx = [...(theme?.preferredFx ?? []), ...(themeVariant?.preferredFx ?? [])];
  const names = themeNames(themeFx.filter((name) => template.allowedFx.includes(name)), template.allowedFx);
  const options = templateOptions(effects, names);

  if (template.id === 'fey_trickster') {
    const feyOptions = options.filter((fx) => hasAny(fx.tags, ['fey', 'trickster']));
    return prefer(feyOptions.length > 0 ? feyOptions : options, [
      (fx) => narrativeVariant ? narrativeVariant.fxBias.includes(fx.name) : false,
      (fx) => motif ? motif.fxBias.includes(fx.name) : false,
    ]);
  }

  return prefer(options, [
    (fx) => narrativeVariant ? narrativeVariant.fxBias.includes(fx.name) : false,
    (fx) => motif ? motif.fxBias.includes(fx.name) : false,
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
  const size = getRaceSize(race);
  const archetype = pickArchetype(classes, primaryClass);
  const { template: buildTemplate, reason: templateReason } = selectBuildTemplate(primaryClass, archetype, race, mode);
  const visualTheme = selectVisualTheme(buildTemplate, archetype, race);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, buildTemplate.allowedFx);
  const motifSelection = selectNarrativeMotif({ primaryClass, race, archetype, buildTemplate, visualTheme });
  const narrativeMotif = motifSelection.motif;
  const narrativeVariant = selectNarrativeVariant(narrativeMotif, buildTemplate.allowedFx);
  const armor = weightedPick(constrainedArmorOptions(buildTemplate, archetype, primaryClass, size, visualTheme));
  const weapon = weightedPick(constrainedWeaponOptions(buildTemplate, archetype, size, race, visualTheme));
  const silhouette = weightedPick(constrainedSilhouetteOptions(buildTemplate, { mode, primaryClass, race, size, archetype }, visualTheme));
  const pose = weightedPick(constrainedPoseOptions(buildTemplate, archetype, weapon, visualTheme));

  return {
    mode,
    primaryClass,
    classes,
    race,
    size,
    archetype,
    buildTemplate,
    templateReason,
    visualTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(visualTheme, visualThemeVariant),
    narrativeMotif,
    narrativeVariant,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(narrativeMotif, narrativeVariant),
    promptFragments: [...narrativeMotif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
    silhouette,
    armor,
    weapon,
    pose,
    emotion: weightedPick(emotions).name,
    mood: weightedPick(constrainedMoodOptions(buildTemplate, archetype, visualTheme, narrativeMotif, narrativeVariant)),
    light: weightedPick(constrainedLightOptions(buildTemplate, archetype, visualTheme)),
    fx: weightedPick(constrainedFxOptions(buildTemplate, archetype, visualTheme, narrativeMotif, visualThemeVariant, narrativeVariant)),
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


function hasWarlockCursedOrVoid(seed: CharacterSeed): boolean {
  return seed.classes.includes('warlock') || hasAny(seed.archetype.tags, ['cursed', 'void']);
}

function hasHolyContext(seed: CharacterSeed): boolean {
  return hasAny(seed.archetype.tags, ['holy', 'oathkeeper', 'fallen']) || ['cleric', 'paladin'].some((className) => seed.classes.includes(className as CharacterClass));
}

function hasFeyContext(seed: CharacterSeed): boolean {
  return hasAny(seed.archetype.tags, ['fey', 'trickster']) || ['satyr', 'fairy'].includes(seed.race.name) || seed.race.tags.includes('fey');
}

function hasMapContext(seed: CharacterSeed): boolean {
  return isCartographerLike(seed.archetype) || isScholarLike(seed.archetype) || hasAny(seed.weapon.tags, ['map', 'book', 'scroll', 'compass']) || seed.pose.name === 'ritual prep around carefully arranged instruments';
}

export function validateGeneratedSeed(seed: CharacterSeed): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const weaponTags = seed.weapon.tags;
  const armorTags = seed.armor.tags;
  const poseTags = seed.pose.tags;
  const smallOrFey = smallRaceNames.includes(seed.race.name) || seed.race.tags.includes('fey');

  if (seed.visualTheme.buildTemplateId !== seed.buildTemplate.id) {
    issues.push({ message: `${seed.visualTheme.id} does not belong to build template ${seed.buildTemplate.id}`, layers: ['theme'] });
  }

  if (!seed.visualThemeVariant || seed.visualThemeVariant.visualThemeId !== seed.visualTheme.id) {
    issues.push({ message: 'seed must have exactly one visual theme variant attached to selected theme', layers: ['themeVariant'] });
  }

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

  if (seed.size === 'tiny' && seed.armor.name === 'full plate with engraved pauldrons') {
    issues.push({ message: 'tiny races cannot wear full plate', layers: ['armor'] });
  }

  if (['tiny', 'small'].includes(seed.size) && hasAny(weaponTags, ['oversized', 'greataxe'])) {
    issues.push({ message: 'small/tiny races cannot use giant weapons', layers: ['weapon', 'pose'] });
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

  if (seed.archetype.tags.includes('void') && seed.visualTheme.id !== 'void_oracle') {
    issues.push({ message: 'void archetypes require void_oracle visual theme', layers: ['theme', 'fx'] });
  }

  if (seed.archetype.tags.includes('void') && !['black-violet motes', 'void glow', 'purple void energy', 'drifting void ash', 'black-violet sparks', 'gravity distortions', 'fragmented stars'].includes(seed.fx.name)) {
    issues.push({ message: 'void oracle must have void FX', layers: ['fx'] });
  }

  if (seed.archetype.tags.includes('pirate') && !['pirate_raider', 'relic_thief', 'lore_skald', 'wandering_bard'].includes(seed.visualTheme.id)) {
    issues.push({ message: 'pirate archetype requires pirate-compatible visual theme', layers: ['theme', 'weapon', 'pose'] });
  }

  if (seed.archetype.tags.includes('pirate') && !hasAny(seed.visualDetails, ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'])) {
    issues.push({ message: 'pirate archetype requires pirate-compatible gear details', layers: ['theme'] });
  }

  if (seed.fx.name === 'black-violet motes' && hasAny(seed.archetype.tags, ['holy']) && !hasWarlockCursedOrVoid(seed)) {
    issues.push({ message: 'black-violet motes require warlock/cursed/void when temple or holy context is present', layers: ['fx'] });
  }

  if (['spectral feathers', 'divine rays', 'holy glow', 'sun motes', 'prayer ribbons', 'glowing dust', 'sacred sparks'].includes(seed.fx.name) && ['rogue', 'barbarian'].includes(seed.primaryClass) && !hasHolyContext(seed)) {
    issues.push({ message: 'divine FX require holy, temple, or oathkeeper context for pure rogue/barbarian', layers: ['fx'] });
  }

  if (seed.fx.name === 'map glow lines' && !hasMapContext(seed)) {
    issues.push({ message: 'map glow lines require cartographer/scholar/academy/map/book/ritual context', layers: ['fx', 'weapon', 'pose'] });
  }

  if (['green witchfire', 'petals and whimsical particles', 'soft fey glow', 'drifting petals', 'glowing pollen', 'moonlit butterflies', 'floating blossoms'].includes(seed.fx.name) && !hasFeyContext(seed)) {
    issues.push({ message: 'fey FX require fey/trickster/forest/satyr/fairy context', layers: ['fx'] });
  }

  if (seed.buildTemplate.id === 'fey_trickster' && !['green witchfire', 'petals and whimsical particles', 'soft fey glow', 'drifting petals', 'glowing pollen', 'moonlit butterflies', 'floating blossoms'].includes(seed.fx.name)) {
    issues.push({ message: 'fey_trickster requires fey-compatible FX', layers: ['fx'] });
  }

  if (seed.primaryClass === 'bard' && seed.buildTemplate.id === 'divine_scholar' && !canUseDivineScholar(seed.primaryClass, seed.archetype)) {
    issues.push({ message: 'bard can use divine_scholar only with divine/holy/temple context', layers: ['template'] });
  }

  if (seed.silhouette.name === 'gadget-laden workshop silhouette' && seed.buildTemplate.id !== 'battle_engineer' && seed.primaryClass !== 'artificer' && !hasAny(seed.archetype.tags, ['academy', 'tools'])) {
    issues.push({ message: 'gadget-laden workshop silhouette requires artificer, battle_engineer, or academy engineer context', layers: ['silhouette'] });
  }

  if (seed.silhouette.name === 'willowy fey outline' && ['dwarf', 'half-orc'].includes(seed.race.name)) {
    issues.push({ message: 'willowy fey outline is not compatible with dwarf or half-orc', layers: ['silhouette'] });
  }

  if (seed.silhouette.name === 'towering bestial frame' && seed.mode !== 'chaos' && seed.primaryClass !== 'barbarian' && seed.race.name !== 'half-orc') {
    issues.push({ message: 'towering bestial frame requires barbarian, half-orc, beast, or chaos context', layers: ['silhouette'] });
  }

  if (!seed.narrativeMotif || seed.narrativeMotif.id.length === 0) {
    issues.push({ message: 'seed must have a narrative motif', layers: ['motif'] });
  }

  if (!seed.narrativeVariant || seed.narrativeVariant.narrativeMotifId !== seed.narrativeMotif.id) {
    issues.push({ message: 'seed must have exactly one narrative variant attached to selected motif', layers: ['narrativeVariant'] });
  }

  if (seed.storyDetails.length === 0 || seed.storyDetails.some((detail) => detail.trim().endsWith(','))) {
    issues.push({ message: 'story details must be non-empty and must not end with comma', layers: ['motif'] });
  }

  if (seed.storyDetails.length < 2) {
    issues.push({ message: 'story details must contain at least two complete details', layers: ['motif'] });
  }

  if (seed.primaryClass === 'fighter' && seed.buildTemplate.id === 'holy_warrior' && !hasAny(seed.archetype.tags, ['holy', 'oathkeeper'])) {
    issues.push({ message: 'fighter without holy archetype cannot use holy_warrior', layers: ['template'] });
  }

  if (seed.primaryClass === 'bard' && isScholarLike(seed.archetype) && seed.buildTemplate.id === 'divine_scholar' && !seed.archetype.tags.includes('holy')) {
    issues.push({ message: 'bard academy/scholar should use lorekeeper_bard unless archetype is divine/holy/temple', layers: ['template'] });
  }

  if (seed.weapon.name === 'paired daggers' && ['forward rapier thrust', 'duelist turn with one foot sliding back'].includes(seed.pose.name)) {
    issues.push({ message: 'paired daggers cannot use rapier thrust poses', layers: ['pose'] });
  }

  if (['tiny', 'small'].includes(seed.size) && seed.armor.name === 'full plate with engraved pauldrons') {
    issues.push({ message: 'small/tiny races cannot wear full plate', layers: ['armor'] });
  }

  if (seed.race.name === 'fairy' && (seed.silhouette.name === 'stocky shield-forward stance' || seed.armor.name === 'full plate with engraved pauldrons' || seed.weapon.tags.includes('oversized'))) {
    issues.push({ message: 'fairy cannot use stocky shield-forward, full plate, or oversized weapons', layers: ['silhouette', 'armor', 'weapon'] });
  }

  return issues;
}

function rerollLayer(seed: CharacterSeed, layer: RegenerableLayer): CharacterSeed {
  if (layer === 'template') {
    const selection = selectBuildTemplate(seed.primaryClass, seed.archetype, seed.race, seed.mode);
    const visualTheme = selectVisualTheme(selection.template, seed.archetype, seed.race);
    const visualThemeVariant = selectVisualThemeVariant(visualTheme, selection.template.allowedFx);
    const motifSelection = selectNarrativeMotif({ ...seed, buildTemplate: selection.template, visualTheme });
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, selection.template.allowedFx);
    return { ...seed, buildTemplate: selection.template, templateReason: selection.reason, visualTheme, visualThemeVariant, visualDetails: pickVisualDetails(visualTheme, visualThemeVariant), narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'theme') {
    const visualTheme = selectVisualTheme(seed.buildTemplate, seed.archetype, seed.race);
    const visualThemeVariant = selectVisualThemeVariant(visualTheme, seed.buildTemplate.allowedFx);
    const motifSelection = selectNarrativeMotif({ ...seed, visualTheme });
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, seed.buildTemplate.allowedFx);
    return { ...seed, visualTheme, visualThemeVariant, visualDetails: pickVisualDetails(visualTheme, visualThemeVariant), narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'motif') {
    const motifSelection = selectNarrativeMotif(seed);
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, seed.buildTemplate.allowedFx);
    return { ...seed, narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments] };
  }

  if (layer === 'themeVariant') {
    const visualThemeVariant = selectVisualThemeVariant(seed.visualTheme, seed.buildTemplate.allowedFx);
    return { ...seed, visualThemeVariant, visualDetails: pickVisualDetails(seed.visualTheme, visualThemeVariant), promptFragments: [...seed.narrativeMotif.promptFragments, ...seed.narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'narrativeVariant') {
    const narrativeVariant = selectNarrativeVariant(seed.narrativeMotif, seed.buildTemplate.allowedFx);
    return { ...seed, narrativeVariant, storyDetails: pickStoryDetails(seed.narrativeMotif, narrativeVariant), promptFragments: [...seed.narrativeMotif.promptFragments, ...narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments] };
  }

  if (layer === 'armor') {
    return { ...seed, armor: weightedPick(constrainedArmorOptions(seed.buildTemplate, seed.archetype, seed.primaryClass, seed.size, seed.visualTheme)) };
  }

  if (layer === 'weapon') {
    const weapon = weightedPick(constrainedWeaponOptions(seed.buildTemplate, seed.archetype, seed.size, seed.race, seed.visualTheme));
    return { ...seed, weapon, pose: weightedPick(constrainedPoseOptions(seed.buildTemplate, seed.archetype, weapon, seed.visualTheme)) };
  }

  if (layer === 'silhouette') {
    return { ...seed, silhouette: weightedPick(constrainedSilhouetteOptions(seed.buildTemplate, seed, seed.visualTheme)) };
  }

  if (layer === 'pose') {
    return { ...seed, pose: weightedPick(constrainedPoseOptions(seed.buildTemplate, seed.archetype, seed.weapon, seed.visualTheme)) };
  }

  if (layer === 'mood') {
    return { ...seed, mood: weightedPick(constrainedMoodOptions(seed.buildTemplate, seed.archetype, seed.visualTheme, seed.narrativeMotif, seed.narrativeVariant)) };
  }

  if (layer === 'light') {
    return { ...seed, light: weightedPick(constrainedLightOptions(seed.buildTemplate, seed.archetype, seed.visualTheme)) };
  }

  return { ...seed, fx: weightedPick(constrainedFxOptions(seed.buildTemplate, seed.archetype, seed.visualTheme, seed.narrativeMotif, seed.visualThemeVariant, seed.narrativeVariant)) };
}

function replaceWithFallbackTemplate(seed: CharacterSeed, trace: string[]): CharacterSeed {
  const fallback = getTemplate(fallbackTemplateByClass[seed.primaryClass]);
  trace.push(`Switching to safe fallback buildTemplate ${fallback.id} for ${seed.primaryClass}.`);

  const visualTheme = selectVisualTheme(fallback, seed.archetype, seed.race);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, fallback.allowedFx);
  const motifSelection = selectNarrativeMotif({ ...seed, buildTemplate: fallback, visualTheme });
  const narrativeVariant = selectNarrativeVariant(motifSelection.motif, fallback.allowedFx);
  const nextSeed: CharacterSeed = {
    ...seed,
    buildTemplate: fallback,
    templateReason: `safe fallback after unresolved validation for ${seed.primaryClass}`,
    visualTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(visualTheme, visualThemeVariant),
    narrativeMotif: motifSelection.motif,
    narrativeVariant,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant),
    promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
  };

  const armor = weightedPick(constrainedArmorOptions(fallback, nextSeed.archetype, nextSeed.primaryClass, nextSeed.size, nextSeed.visualTheme));
  const weapon = weightedPick(constrainedWeaponOptions(fallback, nextSeed.archetype, nextSeed.size, nextSeed.race, nextSeed.visualTheme));

  return {
    ...nextSeed,
    armor,
    weapon,
    silhouette: weightedPick(constrainedSilhouetteOptions(fallback, nextSeed, nextSeed.visualTheme)),
    pose: weightedPick(constrainedPoseOptions(fallback, nextSeed.archetype, weapon, nextSeed.visualTheme)),
    mood: weightedPick(constrainedMoodOptions(fallback, nextSeed.archetype, nextSeed.visualTheme, nextSeed.narrativeMotif, nextSeed.narrativeVariant)),
    light: weightedPick(constrainedLightOptions(fallback, nextSeed.archetype, nextSeed.visualTheme)),
    fx: weightedPick(constrainedFxOptions(fallback, nextSeed.archetype, nextSeed.visualTheme, nextSeed.narrativeMotif, nextSeed.visualThemeVariant, nextSeed.narrativeVariant)),
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
  const visualTheme = selectVisualTheme(safeTemplate, nextSeed.archetype, nextSeed.race);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, safeTemplate.allowedFx);
  const motifSelection = selectNarrativeMotif({ ...nextSeed, buildTemplate: safeTemplate, visualTheme });
  const narrativeVariant = selectNarrativeVariant(motifSelection.motif, safeTemplate.allowedFx);
  return {
    ...nextSeed,
    buildTemplate: safeTemplate,
    visualTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(visualTheme, visualThemeVariant),
    narrativeMotif: motifSelection.motif,
    narrativeVariant,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant),
    promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
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
    `Size: ${seed.size}`,
    `Archetype: ${seed.archetype.name}`,
    `Build Template: ${seed.buildTemplate.id}`,
    `Visual Theme: ${seed.visualTheme.id}`,
    `Theme Variant: ${seed.visualThemeVariant.id}`,
    `Narrative Motif: ${seed.narrativeMotif.label}`,
    `Narrative Variant: ${seed.narrativeVariant.id}`,
    `Silhouette: ${seed.silhouette.name}`,
    `Armor: ${seed.armor.name}`,
    `Weapon / Tool: ${seed.weapon.name}`,
    `Pose: ${seed.pose.name}`,
    `Emotion: ${seed.emotion}`,
    `Mood: ${seed.mood.name}`,
    `Light: ${seed.light.name}`,
    `FX: ${seed.fx.name}`,
    `Visual Details: ${seed.visualDetails.join(', ')}`,
    `Story Details: ${seed.storyDetails.join(', ')}`,
  ].join('\n');
}

function formatPrompt(seed: CharacterSeed): string {
  return [
    `Create a D&D character concept art portrait of a ${seed.race.name} ${formatClassLine(seed)}.`,
    `Build template: ${seed.buildTemplate.label}. Core fantasy: ${seed.archetype.name}. Visual theme variant: ${seed.visualThemeVariant.label}. Narrative variant: ${seed.narrativeVariant.label}.`,
    `Silhouette: ${seed.silhouette.name}; armor: ${seed.armor.name}; weapon or prop: ${seed.weapon.name}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    `Mood: ${seed.mood.name}; lighting: ${seed.light.name}; primary visual effect: ${seed.fx.name}.`,
    `Visual details: ${seed.visualDetails.join(', ')}.`,
    `Narrative details: ${seed.storyDetails.join(', ')}; ${seed.promptFragments.join('; ')}.`,
    'Detailed fantasy illustration, strong readable design, build-template coherent gear, no text in image.',
  ].join(' ');
}

export function generateCharacterSeed(): GenerationResult {
  const trace: string[] = ['Starting v4 narrative-motif cascade generation.'];
  const seed = createSeed();

  trace.push(`Selected mode: ${seed.mode}.`);
  trace.push(`Selected class: primary ${seed.primaryClass}; classes ${seed.classes.join(' / ')}.`);
  trace.push(`Selected archetype: ${seed.archetype.name} (${seed.archetype.tags.join(', ')}).`);
  trace.push(`Selected buildTemplate: ${seed.buildTemplate.id}.`);
  trace.push(`Template selection reason: ${seed.templateReason}.`);
  trace.push(`Selected visualTheme: ${seed.visualTheme.id}.`);
  trace.push(`Selected visualThemeVariant: ${seed.visualThemeVariant.id}.`);
  trace.push(`Selected narrativeMotif: ${seed.narrativeMotif.id}.`);
  trace.push(`Selected narrativeVariant: ${seed.narrativeVariant.id}.`);
  trace.push(`Motif selection reason: ${seed.motifReason}.`);
  trace.push(`Motif compatibility filters: template ${seed.buildTemplate.id}, theme ${seed.visualTheme.id}, class ${seed.primaryClass}, race ${seed.race.name}, tags ${seed.archetype.tags.join(', ')}.`);

  const resolvedSeed = resolveSeedConflicts(seed, trace);
  trace.push(`Final selected visualTheme: ${resolvedSeed.visualTheme.id}.`);
  trace.push(`Final selected visualThemeVariant: ${resolvedSeed.visualThemeVariant.id}.`);
  trace.push(`Final selected narrativeMotif: ${resolvedSeed.narrativeMotif.id}.`);
  trace.push(`Final selected narrativeVariant: ${resolvedSeed.narrativeVariant.id}.`);
  trace.push(`Final motif compatibility filters: template ${resolvedSeed.buildTemplate.id}, theme ${resolvedSeed.visualTheme.id}, class ${resolvedSeed.primaryClass}, race ${resolvedSeed.race.name}, tags ${resolvedSeed.archetype.tags.join(', ')}.`);

  return {
    seed: resolvedSeed,
    seedOutput: formatSeed(resolvedSeed),
    promptDraft: formatPrompt(resolvedSeed),
    trace,
  };
}
