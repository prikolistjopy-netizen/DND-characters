import {
  armors,
  archetypeThemes,
  classes,
  CompatibleItem,
  emotions,
  fx,
  lighting,
  modes,
  moods,
  multiclassPresets,
  poses,
  Race,
  races,
  silhouettes,
  weapons,
  WeightedItem,
} from '../data/seedData';

export type SeedPart = {
  id: string;
  label: string;
  prompt: string;
};

export type CharacterSeed = {
  mode: SeedPart;
  className: string;
  primaryClass: SeedPart;
  secondaryClass?: SeedPart;
  archetype: string;
  race: SeedPart;
  silhouette: SeedPart;
  armor: SeedPart;
  weapon: SeedPart;
  pose: SeedPart;
  emotion: SeedPart;
  mood: SeedPart;
  lighting: SeedPart;
  fx: SeedPart;
};

export type GenerationResult = {
  seed: CharacterSeed;
  promptDraft: string;
  seedText: string;
  trace: string[];
  conflicts: string[];
};

type Context = {
  modeId: string;
  classIds: string[];
  primaryClassId: string;
  secondaryClassId?: string;
  presetId?: string;
  archetype: string;
  raceId?: string;
  silhouetteId?: string;
  armorId?: string;
  weaponId?: string;
};

const labelByClass = new Map(classes.map((item) => [item.id, item]));
const heavyWeapons = new Set(['greatsword', 'warhammer']);
const tinyRaces = new Set(['fairy', 'halfling', 'gnome']);
const martialOnlyClasses = new Set(['paladin', 'fighter', 'monk', 'barbarian', 'ranger', 'rogue']);
const monkPoseIds = new Set(['high_kick']);
const monkPoseForbiddenClasses = new Set(['druid', 'paladin', 'fighter', 'barbarian', 'cleric']);

function toSeedPart(item: { id: string; label: string; prompt: string }): SeedPart {
  return { id: item.id, label: item.label, prompt: item.prompt };
}

function randomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

function chooseWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= Math.max(0, item.weight);
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

function chooseFromIds<T extends { id: string }>(ids: string[], items: T[]): T {
  const filtered = items.filter((item) => ids.includes(item.id));
  return filtered[randomIndex(filtered.length)];
}

function weightedCompatible<T extends CompatibleItem>(items: T[], context: Context): Array<T & { weight: number; reason: string }> {
  return items.map((item) => {
    let weight = 8;
    const reasons: string[] = [];
    const classMatches = item.classes?.filter((id) => context.classIds.includes(id) || id === context.presetId || id === context.weaponId) ?? [];
    const raceMatch = context.raceId && item.races?.includes(context.raceId);
    const archetypeMatch = item.prefers?.includes(context.archetype);

    if (classMatches.length > 0) {
      weight += 28;
      reasons.push(`class match: ${classMatches.join(', ')}`);
    }

    if (archetypeMatch) {
      weight += 24;
      reasons.push(`archetype match: ${context.archetype}`);
    }

    if (raceMatch) {
      weight += 20;
      reasons.push(`race match: ${context.raceId}`);
    }

    if (item.id === 'fey_spirit' && context.raceId === 'fairy') weight += 40;
    if (item.id === 'battle_engineer_frame' && context.classIds.includes('artificer')) weight += 35;
    if (item.id === 'natural_armor' && context.classIds.includes('druid')) weight += 30;
    if (item.id === 'tools' && context.classIds.includes('artificer')) weight += 45;
    if (item.id === 'tools' && context.classIds.includes('bard')) weight += 8;

    const conflict = wouldConflict(item.id, { ...context, [layerFor(items)]: item.id });
    if (conflict.length > 0) {
      weight = 0;
      reasons.push(`filtered: ${conflict.join('; ')}`);
    }

    return { ...item, weight, reason: reasons.join(' + ') || 'fallback compatible option' };
  });
}

function layerFor(items: CompatibleItem[]): 'silhouetteId' | 'armorId' | 'weaponId' {
  if (items === silhouettes) return 'silhouetteId';
  if (items === armors) return 'armorId';
  return 'weaponId';
}

function chooseCompatible<T extends CompatibleItem>(items: T[], context: Context, trace: string[], layerName: string): T {
  const weighted = weightedCompatible(items, context).filter((item) => item.weight > 0);
  const pool = weighted.length > 0 ? weighted : items.map((item) => ({ ...item, weight: 1, reason: 'emergency fallback' }));
  const picked = chooseWeighted(pool);
  trace.push(`${layerName}: selected ${picked.id} (${picked.reason}).`);
  return items.find((item) => item.id === picked.id) ?? items[0];
}

function chooseRace(archetype: string, trace: string[]): Race {
  const weighted = races.map((race) => {
    let weight = race.weight;
    const reasons: string[] = [];

    if (race.prefers.includes(archetype)) {
      weight *= 3;
      reasons.push(`prefers ${archetype}`);
    }

    if (race.avoids?.includes(archetype)) {
      weight = Math.max(1, Math.floor(weight / 5));
      reasons.push(`avoids ${archetype}, reduced weight`);
    }

    return { ...race, weight, reason: reasons.join(', ') || 'base race weight' };
  });
  const picked = chooseWeighted(weighted);
  trace.push(`Race: selected ${picked.id} (${picked.reason}).`);
  return races.find((race) => race.id === picked.id) ?? races[0];
}

function chooseThemeItem(items: CompatibleItem[], archetype: string, themeKey: 'emotions' | 'moods' | 'lighting' | 'fx', trace: string[], label: string): CompatibleItem {
  const preferredIds = archetypeThemes[archetype]?.[themeKey] ?? [];
  const weighted = items.map((item) => ({
    ...item,
    weight: preferredIds.includes(item.id) ? 25 : 4,
  }));
  const picked = chooseWeighted(weighted);
  trace.push(`${label}: selected ${picked.id} (${preferredIds.includes(picked.id) ? `fits ${archetype}` : 'fallback mood color'}).`);
  return items.find((item) => item.id === picked.id) ?? items[0];
}

function classesInclude(context: Context, classId: string): boolean {
  return context.classIds.includes(classId) || context.presetId === classId;
}

function wouldConflict(candidateId: string, context: Context): string[] {
  const conflicts: string[] = [];
  const classIds = context.classIds;
  const raceId = context.raceId;
  const silhouette = silhouettes.find((item) => item.id === (candidateId === context.silhouetteId ? candidateId : context.silhouetteId));
  const weaponId = candidateId === context.weaponId ? candidateId : context.weaponId;
  const armorId = candidateId === context.armorId ? candidateId : context.armorId;
  const poseId = candidateId;

  if (weaponId === 'tools' && !classIds.includes('artificer') && !classIds.includes('bard')) {
    conflicts.push('tools are only allowed for artificer and sometimes bard');
  }

  if (weaponId === 'tools' && classIds.some((id) => martialOnlyClasses.has(id))) {
    conflicts.push('tools are forbidden for paladin/fighter/monk/barbarian/ranger/rogue');
  }

  if (monkPoseIds.has(poseId) && !classesInclude(context, 'monk')) {
    conflicts.push('monk poses require monk');
  }

  if (monkPoseIds.has(poseId) && classIds.some((id) => monkPoseForbiddenClasses.has(id))) {
    conflicts.push('monk poses forbidden for druid/paladin/fighter/barbarian/cleric');
  }

  if (armorId === 'heavy_armor' && (classIds.includes('wizard') || classIds.includes('sorcerer') || classIds.includes('monk'))) {
    conflicts.push('wizard/sorcerer/monk cannot wear heavy armor');
  }

  if (classIds.includes('druid') && armorId && ['heavy_armor', 'medium_armor'].includes(armorId)) {
    conflicts.push('druid cannot receive metal armor');
  }

  if (raceId === 'fairy' && armorId === 'heavy_armor') {
    conflicts.push('fairy cannot receive massive armor');
  }

  if (raceId === 'fairy' && weaponId && ['greatsword', 'warhammer'].includes(weaponId)) {
    conflicts.push('fairy cannot receive oversized weapon');
  }

  if (weaponId && heavyWeapons.has(weaponId) && (silhouette?.tags?.some((tag) => ['small', 'fey'].includes(tag)) || (raceId && tinyRaces.has(raceId)))) {
    conflicts.push('heavy weapons cannot combine with tiny/small/fey silhouettes');
  }

  if (weaponId === 'longbow' && poseId === 'raised_shield') {
    conflicts.push('longbow cannot combine with shield pose');
  }

  return conflicts;
}

function choosePose(context: Context, trace: string[]): CompatibleItem {
  const weighted = poses.map((pose) => {
    let weight = 5;
    const reasons: string[] = [];

    if (pose.classes?.includes(context.weaponId ?? '')) {
      weight += 28;
      reasons.push(`weapon match: ${context.weaponId}`);
    }

    const classMatches = pose.classes?.filter((id) => context.classIds.includes(id) || id === context.presetId) ?? [];
    if (classMatches.length > 0) {
      weight += 18;
      reasons.push(`class match: ${classMatches.join(', ')}`);
    }

    if (pose.prefers?.includes(context.archetype)) {
      weight += 16;
      reasons.push(`archetype match: ${context.archetype}`);
    }

    const conflicts = wouldConflict(pose.id, context);
    if (conflicts.length > 0) {
      weight = 0;
      reasons.push(`filtered: ${conflicts.join('; ')}`);
    }

    return { ...pose, weight, reason: reasons.join(' + ') || 'simple fallback pose' };
  });

  const pool = weighted.filter((pose) => pose.weight > 0);
  const picked = chooseWeighted(pool.length ? pool : weighted.map((pose) => ({ ...pose, weight: 1 })));
  trace.push(`Pose: selected ${picked.id} (${picked.reason}).`);
  return poses.find((pose) => pose.id === picked.id) ?? poses[0];
}

function validateFinal(seed: Pick<CharacterSeed, 'race' | 'silhouette' | 'armor' | 'weapon' | 'pose'>, context: Context): string[] {
  return wouldConflict(seed.pose.id, {
    ...context,
    raceId: seed.race.id,
    silhouetteId: seed.silhouette.id,
    armorId: seed.armor.id,
    weaponId: seed.weapon.id,
  });
}

function makeSeedText(seed: CharacterSeed): string {
  const lines = [
    ['Mode', seed.mode.label],
    ['Class / Multiclass', seed.className],
    ['Primary Class', seed.primaryClass.label],
    ['Secondary Class', seed.secondaryClass?.label ?? '—'],
    ['Archetype', seed.archetype],
    ['Race', seed.race.label],
    ['Silhouette', seed.silhouette.label],
    ['Armor', seed.armor.label],
    ['Weapon', seed.weapon.label],
    ['Pose', seed.pose.label],
    ['Emotion', seed.emotion.label],
    ['Mood', seed.mood.label],
    ['Lighting', seed.lighting.label],
    ['FX', seed.fx.label],
  ];

  return lines.map(([key, value]) => `${key}: ${value}`).join('\n');
}

function makePrompt(seed: CharacterSeed): string {
  return `high quality fantasy character concept art, cinematic splash art, stylized realism, detailed digital painting, expressive face, dynamic silhouette, vertical 3:4 composition. A ${seed.race.prompt} ${seed.archetype.toLowerCase()} ${seed.className.toLowerCase()} with ${seed.silhouette.prompt}. Wearing ${seed.armor.prompt}, wielding ${seed.weapon.prompt}. ${seed.pose.prompt}. ${seed.emotion.prompt}, ${seed.mood.prompt} atmosphere, ${seed.lighting.prompt}, ${seed.fx.prompt}. No modern elements, no sci-fi, no extra limbs, no distorted anatomy, no photorealism, no comedic style.`;
}

export function generateCharacterSeed(): GenerationResult {
  const trace: string[] = [];
  const mode = chooseWeighted(modes);
  trace.push(`Mode: selected ${mode.id} by weighted roll (${mode.weight}).`);

  let primaryClass = classes[0];
  let secondaryClass: typeof classes[number] | undefined;
  let presetId: string | undefined;
  let archetypes: string[];
  let className: string;

  if (mode.id === 'single_class') {
    primaryClass = chooseWeighted(classes);
    archetypes = primaryClass.archetypes;
    className = primaryClass.label;
    trace.push(`Class: selected ${primaryClass.id} by class weight (${primaryClass.weight}).`);
  } else {
    const preset = chooseWeighted(multiclassPresets);
    primaryClass = labelByClass.get(preset.primaryClass) ?? classes[0];
    secondaryClass = labelByClass.get(preset.secondaryClass);
    presetId = preset.id;
    archetypes = preset.archetypes;
    className = preset.label;
    trace.push(`Multiclass: selected ${preset.id} by preset weight (${preset.weight}).`);
  }

  const archetype = archetypes[randomIndex(archetypes.length)];
  trace.push(`Archetype: selected ${archetype} from compatible archetypes.`);

  const classIds = [primaryClass.id, secondaryClass?.id].filter(Boolean) as string[];
  const baseContext: Context = {
    modeId: mode.id,
    classIds,
    primaryClassId: primaryClass.id,
    secondaryClassId: secondaryClass?.id,
    presetId,
    archetype,
  };

  const race = chooseRace(archetype, trace);
  const withRace = { ...baseContext, raceId: race.id };
  const silhouette = chooseCompatible(silhouettes, withRace, trace, 'Silhouette');
  const withSilhouette = { ...withRace, silhouetteId: silhouette.id };
  const armor = chooseCompatible(armors, withSilhouette, trace, 'Armor');
  const withArmor = { ...withSilhouette, armorId: armor.id };
  const weapon = chooseCompatible(weapons, withArmor, trace, 'Weapon');
  const withWeapon = { ...withArmor, weaponId: weapon.id };
  const pose = choosePose(withWeapon, trace);

  const emotion = chooseThemeItem(emotions, archetype, 'emotions', trace, 'Emotion');
  const mood = chooseThemeItem(moods, archetype, 'moods', trace, 'Mood');
  const light = chooseThemeItem(lighting, archetype, 'lighting', trace, 'Lighting');
  const effect = chooseThemeItem(fx, archetype, 'fx', trace, 'FX');

  const seed: CharacterSeed = {
    mode: toSeedPart(mode),
    className,
    primaryClass: toSeedPart(primaryClass),
    secondaryClass: secondaryClass ? toSeedPart(secondaryClass) : undefined,
    archetype,
    race: toSeedPart(race),
    silhouette: toSeedPart(silhouette),
    armor: toSeedPart(armor),
    weapon: toSeedPart(weapon),
    pose: toSeedPart(pose),
    emotion: toSeedPart(emotion),
    mood: toSeedPart(mood),
    lighting: toSeedPart(light),
    fx: toSeedPart(effect),
  };

  const conflicts = validateFinal(seed, withWeapon);
  trace.push(conflicts.length ? `Conflict check: ${conflicts.join('; ')}.` : 'Conflict check: no conflicts found.');

  return {
    seed,
    promptDraft: makePrompt(seed),
    seedText: makeSeedText(seed),
    trace,
    conflicts,
  };
}
