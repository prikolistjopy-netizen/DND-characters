import {
  archetypes,
  armors,
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
  type ArmorOption,
  type CharacterClass,
  type PoseOption,
  type RaceOption,
  type WeaponOption,
  type WeightedOption,
} from '../data/seedData';

type Mode = (typeof modeWeights)[number]['name'];

export type CharacterSeed = {
  mode: Mode;
  classes: CharacterClass[];
  race: RaceOption;
  archetype: string;
  silhouette: string;
  armor: ArmorOption;
  weapon: WeaponOption;
  pose: PoseOption;
  emotion: string;
  mood: string;
  light: string;
  fx: string;
};

export type GenerationResult = {
  seed: CharacterSeed;
  seedOutput: string;
  promptDraft: string;
  trace: string[];
};

const heavyArmorBlockedClasses: CharacterClass[] = ['wizard', 'sorcerer', 'monk'];
const toolAllowedClasses: CharacterClass[] = ['artificer', 'bard'];

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

function pickDistinctClasses(count: number): CharacterClass[] {
  const selected = new Set<CharacterClass>();

  while (selected.size < count) {
    selected.add(weightedPick(characterClasses).name);
  }

  return [...selected];
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

function hasAnyClass(seed: CharacterSeed, classes: CharacterClass[]): boolean {
  return seed.classes.some((className) => classes.includes(className));
}

function validateSeed(seed: CharacterSeed): string[] {
  const conflicts: string[] = [];
  const raceTags = seed.race.tags;
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;

  if (weaponTags.includes('tool') && !hasAnyClass(seed, toolAllowedClasses)) {
    conflicts.push('tools are only allowed for artificer or bard');
  }

  if (seed.pose.monkOnly && !hasAnyClass(seed, ['monk'])) {
    conflicts.push('monk poses are only allowed for monk characters');
  }

  if (armorTags.includes('heavy') && hasAnyClass(seed, heavyArmorBlockedClasses)) {
    conflicts.push('heavy armor is not allowed for wizard, sorcerer, or monk');
  }

  if (armorTags.includes('metal') && hasAnyClass(seed, ['druid'])) {
    conflicts.push('metal armor is not allowed for druids');
  }

  if (
    (weaponTags.includes('oversized') || weaponTags.includes('heavy')) &&
    (raceTags.includes('small') || raceTags.includes('fey'))
  ) {
    conflicts.push('oversized or heavy weapons are not allowed for fairy, small, or fey characters');
  }

  if (weaponTags.includes('longbow') && weaponTags.includes('shield')) {
    conflicts.push('longbow and shield cannot be combined');
  }

  return conflicts;
}

function createSeed(): CharacterSeed {
  const mode = weightedPick(modeWeights).name;

  return {
    mode,
    classes: pickClasses(mode),
    race: weightedPick(races),
    archetype: weightedPick(archetypes).name,
    silhouette: weightedPick(silhouettes).name,
    armor: weightedPick(armors),
    weapon: weightedPick(weapons),
    pose: weightedPick(poses),
    emotion: weightedPick(emotions).name,
    mood: weightedPick(moods).name,
    light: weightedPick(lights).name,
    fx: weightedPick(effects).name,
  };
}

function formatClassLine(seed: CharacterSeed): string {
  if (seed.mode === 'ordinary class') {
    return seed.classes[0];
  }

  return seed.classes.join(' / ');
}

function formatSeed(seed: CharacterSeed): string {
  return [
    `Mode: ${seed.mode}`,
    `Class: ${formatClassLine(seed)}`,
    `Race: ${seed.race.name}`,
    `Archetype: ${seed.archetype}`,
    `Silhouette: ${seed.silhouette}`,
    `Armor: ${seed.armor.name}`,
    `Weapon / Tool: ${seed.weapon.name}`,
    `Pose: ${seed.pose.name}`,
    `Emotion: ${seed.emotion}`,
    `Mood: ${seed.mood}`,
    `Light: ${seed.light}`,
    `FX: ${seed.fx}`,
  ].join('\n');
}

function formatPrompt(seed: CharacterSeed): string {
  return [
    `Create a D&D character concept art portrait of a ${seed.race.name} ${formatClassLine(seed)}.`,
    `Core fantasy: ${seed.archetype}.`,
    `Silhouette: ${seed.silhouette}; armor: ${seed.armor.name}; weapon or prop: ${seed.weapon.name}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    `Mood: ${seed.mood}; lighting: ${seed.light}; visual effects: ${seed.fx}.`,
    'Detailed fantasy illustration, strong readable design, full character seed, no text in image.',
  ].join(' ');
}

export function generateCharacterSeed(): GenerationResult {
  const trace: string[] = ['Starting weighted random generation.'];

  for (let attempt = 1; attempt <= 100; attempt += 1) {
    const seed = createSeed();
    const conflicts = validateSeed(seed);

    trace.push(
      `Attempt ${attempt}: ${seed.race.name} ${formatClassLine(seed)} | ${seed.armor.name} | ${seed.weapon.name}`,
    );

    if (conflicts.length === 0) {
      trace.push('Conflict checks passed. Seed accepted.');

      return {
        seed,
        seedOutput: formatSeed(seed),
        promptDraft: formatPrompt(seed),
        trace,
      };
    }

    trace.push(`Rejected: ${conflicts.join('; ')}.`);
  }

  const safeSeed: CharacterSeed = {
    mode: 'ordinary class',
    classes: ['fighter'],
    race: { name: 'human', tags: [] },
    archetype: 'streetwise monster hunter',
    silhouette: 'broad heroic triangle',
    armor: { name: 'patched leather armor', tags: ['light'] },
    weapon: { name: 'rapier with jeweled guard', tags: ['light'] },
    pose: { name: 'ready stance on a cracked dungeon tile' },
    emotion: 'grim determination',
    mood: 'dark heroic fantasy',
    light: 'warm torchlight from below',
    fx: 'floating embers',
  };

  trace.push('Fallback seed used after repeated conflicts.');

  return {
    seed: safeSeed,
    seedOutput: formatSeed(safeSeed),
    promptDraft: formatPrompt(safeSeed),
    trace,
  };
}
