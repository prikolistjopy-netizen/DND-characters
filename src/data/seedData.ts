export type WeightedOption<T> = T & { weight: number };

export type CharacterClass =
  | 'artificer'
  | 'barbarian'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'fighter'
  | 'monk'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'sorcerer'
  | 'warlock'
  | 'wizard';

export type RaceOption = {
  name: string;
  tags: Array<'small' | 'fey' | 'large-presence' | 'draconic' | 'celestial' | 'shadow'>;
};

export type ArmorTag = 'none' | 'cloth' | 'light' | 'medium' | 'heavy' | 'metal' | 'natural';

export type ArmorOption = {
  name: string;
  tags: ArmorTag[];
};

export type WeaponTag =
  | 'unarmed'
  | 'staff'
  | 'simple'
  | 'light'
  | 'heavy'
  | 'oversized'
  | 'martial'
  | 'melee'
  | 'ranged'
  | 'bow'
  | 'longbow'
  | 'shield'
  | 'tool'
  | 'magic-focus'
  | 'holy-focus'
  | 'mechanical-focus'
  | 'orb'
  | 'book'
  | 'map'
  | 'instrument'
  | 'rapier'
  | 'dual-blades'
  | 'spear'
  | 'mace'
  | 'greatsword'
  | 'greataxe';

export type WeaponOption = {
  name: string;
  tags: WeaponTag[];
};

export type ArchetypeTag =
  | 'cursed'
  | 'void'
  | 'holy'
  | 'hunter'
  | 'streetwise'
  | 'fey'
  | 'mage'
  | 'nature'
  | 'scholar'
  | 'cartographer'
  | 'tools'
  | 'battlefield'
  | 'noble'
  | 'shadow'
  | 'draconic'
  | 'pirate';

export type ArchetypeOption = {
  name: string;
  classes: CharacterClass[];
  tags: ArchetypeTag[];
};

export type SilhouetteTag = 'nimble' | 'robed' | 'shield' | 'bestial' | 'fey' | 'broad' | 'compact';

export type SilhouetteOption = {
  name: string;
  tags: SilhouetteTag[];
};

export type PoseTag =
  | 'bow'
  | 'shield'
  | 'rapier'
  | 'heavy-melee'
  | 'casting'
  | 'map'
  | 'tools'
  | 'monk'
  | 'general';

export type PoseOption = {
  name: string;
  tags: PoseTag[];
};

export type MoodOption = {
  name: string;
  light: string;
  fx: string;
  tags: ArchetypeTag[];
};

export const modeWeights = [
  { name: 'ordinary class', weight: 68 },
  { name: 'multiclass', weight: 24 },
  { name: 'chaos', weight: 8 },
] as const;

export const characterClasses: Array<WeightedOption<{ name: CharacterClass }>> = [
  { name: 'fighter', weight: 12 },
  { name: 'rogue', weight: 10 },
  { name: 'wizard', weight: 10 },
  { name: 'cleric', weight: 9 },
  { name: 'ranger', weight: 8 },
  { name: 'bard', weight: 8 },
  { name: 'barbarian', weight: 7 },
  { name: 'druid', weight: 7 },
  { name: 'paladin', weight: 7 },
  { name: 'sorcerer', weight: 7 },
  { name: 'warlock', weight: 7 },
  { name: 'monk', weight: 5 },
  { name: 'artificer', weight: 3 },
];

export const races: Array<WeightedOption<RaceOption>> = [
  { name: 'human', tags: [], weight: 12 },
  { name: 'elf', tags: [], weight: 10 },
  { name: 'dwarf', tags: [], weight: 9 },
  { name: 'halfling', tags: ['small'], weight: 7 },
  { name: 'gnome', tags: ['small'], weight: 7 },
  { name: 'tiefling', tags: ['shadow'], weight: 7 },
  { name: 'dragonborn', tags: ['draconic'], weight: 6 },
  { name: 'half-orc', tags: ['large-presence'], weight: 6 },
  { name: 'aasimar', tags: ['celestial'], weight: 5 },
  { name: 'firbolg', tags: ['large-presence', 'fey'], weight: 4 },
  { name: 'satyr', tags: ['fey'], weight: 4 },
  { name: 'fairy', tags: ['small', 'fey'], weight: 3 },
];

export const archetypes: Array<WeightedOption<ArchetypeOption>> = [
  { name: 'haunted noble heir', classes: ['bard', 'paladin', 'rogue', 'warlock'], tags: ['noble', 'shadow'], weight: 6 },
  {
    name: 'streetwise monster hunter',
    classes: ['fighter', 'ranger', 'rogue', 'cleric'],
    tags: ['streetwise', 'hunter'],
    weight: 8,
  },
  { name: 'exiled temple guardian', classes: ['cleric', 'monk', 'paladin'], tags: ['holy'], weight: 7 },
  {
    name: 'wandering battlefield medic',
    classes: ['cleric', 'fighter', 'paladin', 'bard'],
    tags: ['holy', 'battlefield'],
    weight: 6,
  },
  {
    name: 'cursed cartographer',
    classes: ['wizard', 'warlock', 'ranger', 'rogue'],
    tags: ['cursed', 'cartographer', 'mage'],
    weight: 6,
  },
  {
    name: 'clockwork scholar',
    classes: ['artificer', 'wizard', 'bard'],
    tags: ['scholar', 'tools', 'mage'],
    weight: 6,
  },
  { name: 'wild frontier scout', classes: ['ranger', 'druid', 'rogue'], tags: ['nature', 'hunter'], weight: 7 },
  { name: 'fallen oathkeeper', classes: ['paladin', 'warlock', 'fighter'], tags: ['cursed', 'holy'], weight: 5 },
  {
    name: 'fey-touched trickster',
    classes: ['bard', 'druid', 'rogue', 'sorcerer', 'warlock'],
    tags: ['fey'],
    weight: 6,
  },
  {
    name: 'dragon cult defector',
    classes: ['sorcerer', 'warlock', 'fighter', 'barbarian'],
    tags: ['draconic', 'cursed'],
    weight: 4,
  },
  {
    name: 'arcane academy dropout',
    classes: ['wizard', 'sorcerer', 'warlock', 'bard', 'artificer'],
    tags: ['mage', 'scholar'],
    weight: 7,
  },
  { name: 'rage-scarred clan champion', classes: ['barbarian', 'fighter'], tags: ['battlefield'], weight: 7 },
  { name: 'iron wall veteran', classes: ['fighter', 'paladin', 'cleric'], tags: ['battlefield'], weight: 6 },
  { name: 'silent monastery avenger', classes: ['monk', 'rogue'], tags: ['shadow'], weight: 6 },
  { name: 'verdant circle emissary', classes: ['druid', 'ranger'], tags: ['nature', 'fey'], weight: 6 },
  { name: 'pirate relic diver', classes: ['rogue', 'bard', 'artificer'], tags: ['pirate', 'tools'], weight: 5 },
  { name: 'void-pact oracle', classes: ['warlock', 'sorcerer', 'wizard'], tags: ['void', 'cursed', 'mage'], weight: 5 },
  { name: 'runaway alchemist', classes: ['artificer', 'rogue', 'wizard'], tags: ['tools', 'scholar'], weight: 5 },
];

export const silhouettes: Array<WeightedOption<SilhouetteOption>> = [
  { name: 'lean and sharp-edged', tags: ['nimble'], weight: 9 },
  { name: 'broad heroic triangle', tags: ['broad'], weight: 8 },
  { name: 'compact and nimble', tags: ['compact', 'nimble'], weight: 8 },
  { name: 'tall robed column', tags: ['robed'], weight: 7 },
  { name: 'asymmetrical cloak profile', tags: ['nimble'], weight: 7 },
  { name: 'stocky shield-forward stance', tags: ['shield', 'broad'], weight: 6 },
  { name: 'willowy fey outline', tags: ['fey', 'nimble'], weight: 5 },
  { name: 'towering bestial frame', tags: ['bestial', 'broad'], weight: 4 },
];

export const armors: Array<WeightedOption<ArmorOption>> = [
  { name: 'no armor, simple travel wraps', tags: ['none', 'cloth'], weight: 8 },
  { name: 'plain monastery cloth', tags: ['cloth'], weight: 8 },
  { name: 'embroidered arcane robes', tags: ['cloth'], weight: 9 },
  { name: 'fur-lined hide armor', tags: ['medium', 'natural'], weight: 7 },
  { name: 'patched leather armor', tags: ['light'], weight: 9 },
  { name: 'studded leather with hidden knives', tags: ['light', 'metal'], weight: 7 },
  { name: 'living bark and woven reed armor', tags: ['medium', 'natural'], weight: 6 },
  { name: 'scale mail with heraldic sash', tags: ['medium', 'metal'], weight: 7 },
  { name: 'half plate with campaign dents', tags: ['medium', 'metal'], weight: 6 },
  { name: 'chain mail under a weathered tabard', tags: ['heavy', 'metal'], weight: 5 },
  { name: 'full plate with engraved pauldrons', tags: ['heavy', 'metal'], weight: 4 },
  { name: 'reinforced artificer coat', tags: ['light', 'metal'], weight: 6 },
];

export const weapons: Array<WeightedOption<WeaponOption>> = [
  { name: 'unarmed strikes and prayer beads', tags: ['unarmed', 'simple'], weight: 7 },
  { name: 'simple monk shortspear', tags: ['simple', 'spear', 'melee'], weight: 5 },
  { name: 'quarterstaff carved with runes', tags: ['staff', 'simple', 'magic-focus', 'melee'], weight: 8 },
  { name: 'oak spell staff', tags: ['staff', 'magic-focus', 'simple'], weight: 7 },
  { name: 'crystal orb focus', tags: ['orb', 'magic-focus'], weight: 6 },
  { name: 'weathered spellbook', tags: ['book', 'magic-focus'], weight: 6 },
  { name: 'longsword and round shield', tags: ['martial', 'melee', 'shield'], weight: 8 },
  { name: 'mace and holy shield', tags: ['mace', 'simple', 'melee', 'shield', 'holy-focus'], weight: 7 },
  { name: 'silver holy symbol and staff', tags: ['holy-focus', 'staff', 'simple'], weight: 6 },
  { name: 'rapier with jeweled guard', tags: ['rapier', 'martial', 'melee', 'light'], weight: 7 },
  { name: 'paired daggers', tags: ['dual-blades', 'light', 'simple', 'melee'], weight: 8 },
  { name: 'dual ranger blades', tags: ['dual-blades', 'martial', 'melee'], weight: 7 },
  { name: 'hunting longbow', tags: ['ranged', 'bow', 'longbow', 'martial'], weight: 7 },
  { name: 'ranger spear', tags: ['spear', 'simple', 'melee'], weight: 6 },
  { name: 'heavy greatsword', tags: ['heavy', 'martial', 'melee', 'greatsword'], weight: 6 },
  { name: 'heavy greataxe', tags: ['heavy', 'martial', 'melee', 'greataxe'], weight: 7 },
  { name: 'oversized maul', tags: ['heavy', 'oversized', 'martial', 'melee'], weight: 4 },
  { name: 'alchemist tools and sparking wrench', tags: ['tool', 'mechanical-focus'], weight: 7 },
  { name: 'clockwork gauntlet focus', tags: ['mechanical-focus', 'magic-focus', 'tool'], weight: 6 },
  { name: 'lute reinforced as a dueling club', tags: ['instrument', 'tool', 'simple', 'melee'], weight: 5 },
  { name: 'annotated map and compass', tags: ['map', 'tool'], weight: 5 },
];

export const poses: Array<WeightedOption<PoseOption>> = [
  { name: 'ready stance on a cracked dungeon tile', tags: ['general'], weight: 6 },
  { name: 'turning mid-stride as cloak whips around', tags: ['general'], weight: 5 },
  { name: 'aiming down a rain-darkened arrow', tags: ['bow'], weight: 7 },
  { name: 'kneeling shot behind broken cover', tags: ['bow'], weight: 6 },
  { name: 'drawing a bowstring with held breath', tags: ['bow'], weight: 7 },
  { name: 'shield braced against incoming sparks', tags: ['shield'], weight: 7 },
  { name: 'guarded stance behind a raised shield', tags: ['shield'], weight: 6 },
  { name: 'forward rapier thrust', tags: ['rapier'], weight: 6 },
  { name: 'duelist turn with one foot sliding back', tags: ['rapier'], weight: 6 },
  { name: 'overhead strike with a heavy blade', tags: ['heavy-melee'], weight: 7 },
  { name: 'ground slam sending dust through the scene', tags: ['heavy-melee'], weight: 6 },
  { name: 'casting with both hands in a spiral gesture', tags: ['casting'], weight: 7 },
  { name: 'tracing a glowing sigil in the air', tags: ['casting'], weight: 7 },
  { name: 'studying a map under candlelight', tags: ['map'], weight: 5 },
  { name: 'tinkering with sparking tools at a workbench', tags: ['tools'], weight: 6 },
  { name: 'ritual prep around carefully arranged instruments', tags: ['tools', 'casting'], weight: 5 },
  { name: 'balanced on one hand in a martial arts sweep', tags: ['monk'], weight: 5 },
  { name: 'flying kick with prayer beads suspended midair', tags: ['monk'], weight: 5 },
];

export const emotions: Array<WeightedOption<{ name: string }>> = [
  { name: 'grim determination', weight: 9 },
  { name: 'wry confidence', weight: 8 },
  { name: 'haunted calm', weight: 7 },
  { name: 'barely contained fury', weight: 6 },
  { name: 'curious delight', weight: 6 },
  { name: 'solemn focus', weight: 8 },
  { name: 'reckless joy', weight: 5 },
];

export const moodBundles: Array<WeightedOption<MoodOption>> = [
  { name: 'void-cursed omen', light: 'cold moon rim light', fx: 'purple void energy', tags: ['cursed', 'void'], weight: 8 },
  { name: 'haunted midnight ritual', light: 'void glow from below', fx: 'black-violet motes', tags: ['cursed', 'void', 'shadow'], weight: 7 },
  { name: 'radiant temple resolve', light: 'golden divine rays', fx: 'spectral feathers', tags: ['holy'], weight: 8 },
  { name: 'battlefield benediction', light: 'warm sunrise halo', fx: 'floating gold sparks', tags: ['holy', 'battlefield'], weight: 6 },
  { name: 'grim dungeon hunt', light: 'warm torchlight from below', fx: 'swirling mist', tags: ['hunter', 'streetwise'], weight: 8 },
  { name: 'rainy alley ambush', light: 'low lantern light', fx: 'wet cobblestone haze', tags: ['streetwise', 'hunter'], weight: 6 },
  { name: 'mysterious fey dream', light: 'soft green witchfire glow', fx: 'petals and whimsical particles', tags: ['fey'], weight: 8 },
  { name: 'moonlit forest charm', light: 'soft moonlit glade glow', fx: 'tiny constellation motes', tags: ['fey', 'nature'], weight: 6 },
  { name: 'arcane study wonder', light: 'blue arcane glyph light', fx: 'subtle magical runes', tags: ['mage', 'scholar'], weight: 8 },
  { name: 'clockwork workshop focus', light: 'amber workbench lamp', fx: 'sparks from enchanted gears', tags: ['tools', 'scholar'], weight: 7 },
  { name: 'wild frontier dusk', light: 'golden sunset through trees', fx: 'falling autumn leaves', tags: ['nature', 'hunter'], weight: 7 },
  { name: 'battle-scarred epic', light: 'storm lightning silhouette', fx: 'sparks from enchanted steel', tags: ['battlefield', 'draconic'], weight: 7 },
  { name: 'salt-stained relic dive', light: 'green-blue underwater glow', fx: 'bubbles around ancient coins', tags: ['pirate', 'tools'], weight: 5 },
];
