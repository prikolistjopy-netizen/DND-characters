import {
  archetypes,
  armors,
  characterClasses,
  emotions,
  modeWeights,
  moodBundles,
  poses,
  races,
  silhouettes,
  weapons,
  type ArchetypeOption,
  type ArchetypeTag,
  type ArmorOption,
  type CharacterClass,
  type MoodOption,
  type PoseOption,
  type RaceOption,
  type SilhouetteOption,
  type WeaponOption,
} from '../data/seedData';

type Mode = (typeof modeWeights)[number]['name'];
type RegenerableLayer = 'archetype' | 'armor' | 'weapon' | 'silhouette' | 'pose' | 'mood';

type ClassProfile = {
  armors: string[];
  weapons: string[];
  silhouetteTags: string[];
};

export type CharacterSeed = {
  mode: Mode;
  primaryClass: CharacterClass;
  classes: CharacterClass[];
  race: RaceOption;
  archetype: ArchetypeOption;
  silhouette: SilhouetteOption;
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

export type ValidationIssue = {
  message: string;
  layers: RegenerableLayer[];
};

const casterClasses: CharacterClass[] = ['wizard', 'sorcerer'];
const smallRaceNames = ['gnome', 'halfling', 'fairy'];

const classProfiles: Record<CharacterClass, ClassProfile> = {
  artificer: {
    armors: ['reinforced artificer coat', 'patched leather armor', 'half plate with campaign dents'],
    weapons: ['alchemist tools and sparking wrench', 'clockwork gauntlet focus', 'annotated map and compass'],
    silhouetteTags: ['compact', 'nimble', 'broad'],
  },
  barbarian: {
    armors: ['fur-lined hide armor', 'patched leather armor', 'living bark and woven reed armor'],
    weapons: ['heavy greataxe', 'heavy greatsword', 'oversized maul', 'ranger spear'],
    silhouetteTags: ['broad', 'bestial'],
  },
  bard: {
    armors: ['patched leather armor', 'studded leather with hidden knives', 'embroidered arcane robes'],
    weapons: ['rapier with jeweled guard', 'lute reinforced as a dueling club', 'crystal orb focus'],
    silhouetteTags: ['nimble', 'robed', 'fey'],
  },
  cleric: {
    armors: ['scale mail with heraldic sash', 'half plate with campaign dents', 'chain mail under a weathered tabard'],
    weapons: ['mace and holy shield', 'silver holy symbol and staff', 'quarterstaff carved with runes'],
    silhouetteTags: ['shield', 'broad', 'robed'],
  },
  druid: {
    armors: ['living bark and woven reed armor', 'fur-lined hide armor', 'plain monastery cloth'],
    weapons: ['oak spell staff', 'ranger spear', 'annotated map and compass'],
    silhouetteTags: ['fey', 'robed', 'bestial'],
  },
  fighter: {
    armors: ['scale mail with heraldic sash', 'half plate with campaign dents', 'chain mail under a weathered tabard', 'full plate with engraved pauldrons'],
    weapons: ['longsword and round shield', 'heavy greatsword', 'ranger spear', 'hunting longbow'],
    silhouetteTags: ['broad', 'shield'],
  },
  monk: {
    armors: ['no armor, simple travel wraps', 'plain monastery cloth'],
    weapons: ['unarmed strikes and prayer beads', 'quarterstaff carved with runes', 'simple monk shortspear'],
    silhouetteTags: ['compact', 'nimble'],
  },
  paladin: {
    armors: ['chain mail under a weathered tabard', 'full plate with engraved pauldrons', 'scale mail with heraldic sash'],
    weapons: ['longsword and round shield', 'mace and holy shield', 'heavy greatsword'],
    silhouetteTags: ['shield', 'broad'],
  },
  ranger: {
    armors: ['patched leather armor', 'studded leather with hidden knives', 'fur-lined hide armor', 'half plate with campaign dents'],
    weapons: ['hunting longbow', 'dual ranger blades', 'ranger spear', 'annotated map and compass'],
    silhouetteTags: ['nimble', 'compact'],
  },
  rogue: {
    armors: ['patched leather armor', 'studded leather with hidden knives'],
    weapons: ['rapier with jeweled guard', 'paired daggers', 'annotated map and compass'],
    silhouetteTags: ['nimble', 'compact'],
  },
  sorcerer: {
    armors: ['embroidered arcane robes', 'plain monastery cloth'],
    weapons: ['crystal orb focus', 'oak spell staff', 'weathered spellbook'],
    silhouetteTags: ['robed', 'fey'],
  },
  warlock: {
    armors: ['embroidered arcane robes', 'patched leather armor'],
    weapons: ['crystal orb focus', 'oak spell staff', 'weathered spellbook'],
    silhouetteTags: ['robed', 'nimble'],
  },
  wizard: {
    armors: ['embroidered arcane robes', 'plain monastery cloth'],
    weapons: ['oak spell staff', 'crystal orb focus', 'weathered spellbook'],
    silhouetteTags: ['robed'],
  },
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

function pickByName<T extends { name: string }>(options: Array<T & { weight: number }>, names: string[]): Array<T & { weight: number }> {
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

function hasClass(seed: CharacterSeed, className: CharacterClass): boolean {
  return seed.classes.includes(className);
}

function hasAnyTag<T extends string>(actualTags: T[], requiredTags: T[]): boolean {
  return requiredTags.some((tag) => actualTags.includes(tag));
}

function getCompatibleArchetypes(classes: CharacterClass[]) {
  return archetypes.filter((archetype) => archetype.classes.some((className) => classes.includes(className)));
}

function pickArchetype(classes: CharacterClass[]): ArchetypeOption {
  const compatible = getCompatibleArchetypes(classes);
  return weightedPick(compatible.length > 0 ? compatible : archetypes);
}

function pickProfileArmor(primaryClass: CharacterClass): ArmorOption {
  return weightedPick(pickByName(armors, classProfiles[primaryClass].armors));
}

function pickProfileWeapon(primaryClass: CharacterClass): WeaponOption {
  return weightedPick(pickByName(weapons, classProfiles[primaryClass].weapons));
}

function isMageArchetype(archetype: ArchetypeOption): boolean {
  return archetype.tags.includes('mage') || archetype.tags.includes('scholar');
}

function getSilhouetteOptions(seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'race' | 'archetype'>) {
  const preferredTags = classProfiles[seed.primaryClass].silhouetteTags;

  return silhouettes.filter((silhouette) => {
    if (smallRaceNames.includes(seed.race.name) && (silhouette.name === 'tall robed column' || silhouette.name === 'towering bestial frame')) {
      return false;
    }

    if (seed.primaryClass === 'monk' && (silhouette.name === 'stocky shield-forward stance' || silhouette.name === 'towering bestial frame')) {
      return false;
    }

    if (seed.race.name === 'dwarf' && silhouette.name === 'tall robed column' && !isMageArchetype(seed.archetype)) {
      return false;
    }

    if (seed.race.name === 'elf' && seed.mode !== 'chaos' && silhouette.name === 'towering bestial frame') {
      return false;
    }

    if (seed.archetype.tags.includes('fey') && silhouette.tags.includes('fey')) {
      return true;
    }

    if (seed.race.tags.includes('large-presence') && silhouette.tags.includes('broad')) {
      return true;
    }

    return silhouette.tags.some((tag) => preferredTags.includes(tag));
  });
}

function pickSilhouette(seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'race' | 'archetype'>): SilhouetteOption {
  const options = getSilhouetteOptions(seed);
  return weightedPick(options.length > 0 ? options : silhouettes.filter((silhouette) => silhouette.name === 'compact and nimble'));
}

function getPoseOptions(seed: Pick<CharacterSeed, 'primaryClass' | 'weapon' | 'archetype'>) {
  const tags = seed.weapon.tags;

  if (tags.includes('bow') || tags.includes('longbow')) {
    return poses.filter((pose) => pose.tags.includes('bow'));
  }

  if (tags.includes('shield')) {
    return poses.filter((pose) => pose.tags.includes('shield'));
  }

  if (tags.includes('rapier')) {
    return poses.filter((pose) => pose.tags.includes('rapier'));
  }

  if (tags.includes('heavy') || tags.includes('greatsword') || tags.includes('greataxe')) {
    return poses.filter((pose) => pose.tags.includes('heavy-melee'));
  }

  if (tags.includes('map') || seed.archetype.tags.includes('cartographer')) {
    return poses.filter((pose) => pose.tags.includes('map'));
  }

  if (tags.includes('tool') || seed.archetype.tags.includes('tools')) {
    return poses.filter((pose) => pose.tags.includes('tools'));
  }

  if (seed.primaryClass === 'monk' || tags.includes('unarmed')) {
    return poses.filter((pose) => pose.tags.includes('monk') || pose.tags.includes('general'));
  }

  if (tags.includes('magic-focus') || tags.includes('holy-focus') || tags.includes('staff') || tags.includes('orb') || tags.includes('book')) {
    return poses.filter((pose) => pose.tags.includes('casting'));
  }

  return poses.filter((pose) => pose.tags.includes('general'));
}

function pickPose(seed: Pick<CharacterSeed, 'primaryClass' | 'weapon' | 'archetype'>): PoseOption {
  const options = getPoseOptions(seed);
  return weightedPick(options.length > 0 ? options : poses.filter((pose) => pose.tags.includes('general')));
}

function moodScore(mood: MoodOption, archetypeTags: ArchetypeTag[]): number {
  return mood.tags.filter((tag) => archetypeTags.includes(tag)).length;
}

function pickMood(archetype: ArchetypeOption): MoodOption {
  const bestScore = Math.max(...moodBundles.map((mood) => moodScore(mood, archetype.tags)));
  const options = moodBundles.filter((mood) => moodScore(mood, archetype.tags) === bestScore && bestScore > 0);
  return weightedPick(options.length > 0 ? options : moodBundles);
}

function createLinkedSeed(): CharacterSeed {
  const mode = weightedPick(modeWeights).name;
  const classes = pickClasses(mode);
  const primaryClass = classes[0];
  const race = weightedPick(races);
  const archetype = pickArchetype(classes);
  const armor = pickProfileArmor(primaryClass);
  const weapon = pickProfileWeapon(primaryClass);
  const silhouette = pickSilhouette({ mode, primaryClass, race, archetype });
  const pose = pickPose({ primaryClass, weapon, archetype });
  const mood = pickMood(archetype);

  return {
    mode,
    primaryClass,
    classes,
    race,
    archetype,
    silhouette,
    armor,
    weapon,
    pose,
    emotion: weightedPick(emotions).name,
    mood: mood.name,
    light: mood.light,
    fx: mood.fx,
  };
}

function isAllowedByProfile(seed: CharacterSeed, layer: 'armor' | 'weapon'): boolean {
  const allowedNames = layer === 'armor' ? classProfiles[seed.primaryClass].armors : classProfiles[seed.primaryClass].weapons;
  return allowedNames.includes(seed[layer].name);
}

export function validateGeneratedSeed(seed: CharacterSeed): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const raceTags = seed.race.tags;
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;
  const poseTags = seed.pose.tags;

  if (!isAllowedByProfile(seed, 'armor')) {
    issues.push({ message: `${seed.primaryClass} cannot use armor: ${seed.armor.name}`, layers: ['armor'] });
  }

  if (!isAllowedByProfile(seed, 'weapon')) {
    issues.push({ message: `${seed.primaryClass} cannot use weapon/tool: ${seed.weapon.name}`, layers: ['weapon', 'pose'] });
  }

  if (!seed.archetype.classes.some((className) => seed.classes.includes(className))) {
    issues.push({ message: `${seed.archetype.name} is not compatible with ${seed.classes.join('/')}`, layers: ['archetype', 'mood', 'silhouette', 'pose'] });
  }

  if (seed.primaryClass === 'monk' && (!armorTags.includes('cloth') || armorTags.some((tag) => ['light', 'medium', 'heavy', 'metal'].includes(tag)))) {
    issues.push({ message: 'monk must use cloth or no armor only', layers: ['armor'] });
  }

  if (seed.primaryClass === 'monk' && (weaponTags.includes('rapier') || weaponTags.includes('shield') || weaponTags.includes('martial'))) {
    issues.push({ message: 'monk cannot use rapier, shield, or martial weapons', layers: ['weapon', 'pose'] });
  }

  if (casterClasses.includes(seed.primaryClass) && !armorTags.includes('cloth')) {
    issues.push({ message: 'wizard and sorcerer must use robes or cloth only', layers: ['armor'] });
  }

  if (casterClasses.includes(seed.primaryClass) && (weaponTags.includes('martial') || weaponTags.includes('shield') || weaponTags.includes('heavy'))) {
    issues.push({ message: 'wizard and sorcerer cannot use martial weapons, shields, or heavy weapons', layers: ['weapon', 'pose'] });
  }

  if (hasClass(seed, 'barbarian') && weaponTags.includes('longbow')) {
    issues.push({ message: 'barbarian and fighter/barbarian cannot use longbow as main weapon', layers: ['weapon', 'pose'] });
  }

  if (armorTags.includes('heavy') && seed.classes.some((className) => [...casterClasses, 'monk'].includes(className))) {
    issues.push({ message: 'heavy armor is not allowed for wizard, sorcerer, or monk', layers: ['armor'] });
  }

  if (armorTags.includes('metal') && hasClass(seed, 'druid')) {
    issues.push({ message: 'metal armor is not allowed for druids', layers: ['armor'] });
  }

  if ((weaponTags.includes('oversized') || weaponTags.includes('heavy')) && (raceTags.includes('small') || raceTags.includes('fey'))) {
    issues.push({ message: 'oversized or heavy weapons are not allowed for fairy, small, or fey characters', layers: ['weapon', 'pose'] });
  }

  if (weaponTags.includes('longbow') && weaponTags.includes('shield')) {
    issues.push({ message: 'longbow and shield cannot be combined', layers: ['weapon', 'pose'] });
  }

  if (smallRaceNames.includes(seed.race.name) && ['tall robed column', 'towering bestial frame'].includes(seed.silhouette.name)) {
    issues.push({ message: 'gnome, halfling, and fairy cannot use tall or towering silhouettes', layers: ['silhouette'] });
  }

  if (seed.primaryClass === 'monk' && ['stocky shield-forward stance', 'towering bestial frame'].includes(seed.silhouette.name)) {
    issues.push({ message: 'monks cannot use heavy or stocky shield-forward silhouettes', layers: ['silhouette'] });
  }

  if (seed.race.name === 'dwarf' && seed.silhouette.name === 'tall robed column' && !isMageArchetype(seed.archetype)) {
    issues.push({ message: 'dwarf can use tall robed column only with a mage archetype', layers: ['silhouette', 'archetype'] });
  }

  if (seed.race.name === 'elf' && seed.mode !== 'chaos' && seed.silhouette.name === 'towering bestial frame') {
    issues.push({ message: 'elf cannot use towering bestial frame outside chaos mode', layers: ['silhouette'] });
  }

  if (poseTags.includes('shield') && !weaponTags.includes('shield')) {
    issues.push({ message: 'shield pose requires a shield weapon', layers: ['pose'] });
  }

  if (poseTags.includes('map') && !(weaponTags.includes('map') || seed.archetype.tags.includes('cartographer') || seed.archetype.tags.includes('tools'))) {
    issues.push({ message: 'map pose requires a map, cartographer archetype, or tools archetype', layers: ['pose'] });
  }

  if (poseTags.includes('bow') && !hasAnyTag(weaponTags, ['bow', 'longbow'])) {
    issues.push({ message: 'bow pose requires a bow weapon', layers: ['pose'] });
  }

  if (poseTags.includes('rapier') && !weaponTags.includes('rapier')) {
    issues.push({ message: 'rapier pose requires a rapier', layers: ['pose'] });
  }

  if (poseTags.includes('heavy-melee') && !hasAnyTag(weaponTags, ['heavy', 'greatsword', 'greataxe'])) {
    issues.push({ message: 'heavy melee pose requires a heavy weapon', layers: ['pose'] });
  }

  if (poseTags.includes('tools') && !(weaponTags.includes('tool') || seed.archetype.tags.includes('tools'))) {
    issues.push({ message: 'tool pose requires tools or a tools archetype', layers: ['pose'] });
  }

  return issues;
}

function regenerateLayers(seed: CharacterSeed, layers: Set<RegenerableLayer>): CharacterSeed {
  let nextSeed = { ...seed };

  if (layers.has('archetype')) {
    const archetype = pickArchetype(nextSeed.classes);
    nextSeed = { ...nextSeed, archetype };
    layers.add('mood');
    layers.add('silhouette');
    layers.add('pose');
  }

  if (layers.has('armor')) {
    nextSeed = { ...nextSeed, armor: pickProfileArmor(nextSeed.primaryClass) };
  }

  if (layers.has('weapon')) {
    const weapon = pickProfileWeapon(nextSeed.primaryClass);
    nextSeed = { ...nextSeed, weapon };
    layers.add('pose');
  }

  if (layers.has('silhouette')) {
    nextSeed = { ...nextSeed, silhouette: pickSilhouette(nextSeed) };
  }

  if (layers.has('mood')) {
    const mood = pickMood(nextSeed.archetype);
    nextSeed = { ...nextSeed, mood: mood.name, light: mood.light, fx: mood.fx };
  }

  if (layers.has('pose')) {
    nextSeed = { ...nextSeed, pose: pickPose(nextSeed) };
  }

  return nextSeed;
}

function fallbackForClass(primaryClass: CharacterClass, trace: string[]): CharacterSeed {
  const classes = [primaryClass];
  const race = races.find((option) => option.name === 'human') ?? races[0];
  const archetype = pickArchetype(classes);
  const mood = pickMood(archetype);
  const seed: CharacterSeed = {
    mode: 'ordinary class',
    primaryClass,
    classes,
    race,
    archetype,
    silhouette: pickSilhouette({ mode: 'ordinary class', primaryClass, race, archetype }),
    armor: pickProfileArmor(primaryClass),
    weapon: pickProfileWeapon(primaryClass),
    pose: poses.find((pose) => pose.tags.includes('general')) ?? poses[0],
    emotion: 'grim determination',
    mood: mood.name,
    light: mood.light,
    fx: mood.fx,
  };

  trace.push(`Safe fallback used for ${primaryClass}.`);
  return regenerateLayers(seed, new Set(['pose']));
}

function resolveSeedConflicts(seed: CharacterSeed, trace: string[]): CharacterSeed {
  let nextSeed = seed;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const issues = validateGeneratedSeed(nextSeed);

    if (issues.length === 0) {
      trace.push(`Post-generation validation passed after ${attempt} check(s).`);
      return nextSeed;
    }

    const layers = new Set<RegenerableLayer>(issues.flatMap((issue) => issue.layers));
    trace.push(`Validation pass ${attempt}: regenerating ${[...layers].join(', ')} (${issues.map((issue) => issue.message).join('; ')}).`);
    nextSeed = regenerateLayers(nextSeed, layers);
  }

  return fallbackForClass(seed.primaryClass, trace);
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
    `Silhouette: ${seed.silhouette.name}`,
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
    `Core fantasy: ${seed.archetype.name}.`,
    `Silhouette: ${seed.silhouette.name}; armor: ${seed.armor.name}; weapon or prop: ${seed.weapon.name}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    `Mood: ${seed.mood}; lighting: ${seed.light}; visual effects: ${seed.fx}.`,
    'Detailed fantasy illustration, strong readable design, class-coherent gear, no text in image.',
  ].join(' ');
}

export function generateCharacterSeed(): GenerationResult {
  const trace: string[] = ['Starting v2 linked generation from primary class and compatible archetype.'];
  const initialSeed = createLinkedSeed();

  trace.push(
    `Primary ${initialSeed.primaryClass}: ${initialSeed.race.name} ${formatClassLine(initialSeed)} | ${initialSeed.archetype.name} | ${initialSeed.armor.name} | ${initialSeed.weapon.name}`,
  );

  const seed = resolveSeedConflicts(initialSeed, trace);

  return {
    seed,
    seedOutput: formatSeed(seed),
    promptDraft: formatPrompt(seed),
    trace,
  };
}
