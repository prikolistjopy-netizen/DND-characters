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

export type ArmorOption = {
  name: string;
  tags: Array<'cloth' | 'light' | 'medium' | 'heavy' | 'metal' | 'natural'>;
};

export type WeaponOption = {
  name: string;
  tags: Array<'light' | 'heavy' | 'oversized' | 'ranged' | 'longbow' | 'shield' | 'tool' | 'magic-focus'>;
};

export type PoseOption = {
  name: string;
  monkOnly?: boolean;
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

export const archetypes: Array<WeightedOption<{ name: string }>> = [
  { name: 'haunted noble heir', weight: 8 },
  { name: 'streetwise monster hunter', weight: 8 },
  { name: 'exiled temple guardian', weight: 7 },
  { name: 'wandering battlefield medic', weight: 7 },
  { name: 'cursed cartographer', weight: 6 },
  { name: 'clockwork scholar', weight: 5 },
  { name: 'wild frontier scout', weight: 6 },
  { name: 'fallen oathkeeper', weight: 5 },
  { name: 'fey-touched trickster', weight: 5 },
  { name: 'dragon cult defector', weight: 4 },
  { name: 'arcane academy dropout', weight: 6 },
  { name: 'pirate relic diver', weight: 5 },
];

export const silhouettes: Array<WeightedOption<{ name: string }>> = [
  { name: 'lean and sharp-edged', weight: 9 },
  { name: 'broad heroic triangle', weight: 8 },
  { name: 'compact and nimble', weight: 8 },
  { name: 'tall robed column', weight: 7 },
  { name: 'asymmetrical cloak profile', weight: 7 },
  { name: 'stocky shield-forward stance', weight: 6 },
  { name: 'willowy fey outline', weight: 5 },
  { name: 'towering bestial frame', weight: 4 },
];

export const armors: Array<WeightedOption<ArmorOption>> = [
  { name: 'travel-worn cloth layers', tags: ['cloth'], weight: 9 },
  { name: 'patched leather armor', tags: ['light'], weight: 9 },
  { name: 'studded leather with hidden knives', tags: ['light', 'metal'], weight: 8 },
  { name: 'hide armor with bone toggles', tags: ['medium', 'natural'], weight: 7 },
  { name: 'scale mail with heraldic sash', tags: ['medium', 'metal'], weight: 7 },
  { name: 'half plate with campaign dents', tags: ['medium', 'metal'], weight: 6 },
  { name: 'chain mail under a weathered tabard', tags: ['heavy', 'metal'], weight: 5 },
  { name: 'full plate with engraved pauldrons', tags: ['heavy', 'metal'], weight: 4 },
  { name: 'living bark and woven reed armor', tags: ['medium', 'natural'], weight: 5 },
];

export const weapons: Array<WeightedOption<WeaponOption>> = [
  { name: 'longsword and round shield', tags: ['shield'], weight: 9 },
  { name: 'rapier with jeweled guard', tags: ['light'], weight: 8 },
  { name: 'paired daggers', tags: ['light'], weight: 8 },
  { name: 'quarterstaff carved with runes', tags: ['magic-focus'], weight: 8 },
  { name: 'longbow', tags: ['ranged', 'longbow'], weight: 7 },
  { name: 'longbow and buckler shield', tags: ['ranged', 'longbow', 'shield'], weight: 2 },
  { name: 'oversized maul', tags: ['heavy', 'oversized'], weight: 4 },
  { name: 'heavy greataxe', tags: ['heavy'], weight: 5 },
  { name: 'crystal spell focus', tags: ['magic-focus'], weight: 6 },
  { name: 'alchemist tools and sparking wrench', tags: ['tool'], weight: 3 },
  { name: 'lute reinforced as a dueling club', tags: ['tool'], weight: 3 },
];

export const poses: Array<WeightedOption<PoseOption>> = [
  { name: 'ready stance on a cracked dungeon tile', weight: 9 },
  { name: 'turning mid-stride as cloak whips around', weight: 8 },
  { name: 'weapon raised in a decisive challenge', weight: 8 },
  { name: 'kneeling beside a glowing relic', weight: 7 },
  { name: 'balanced on one hand in a martial arts sweep', monkOnly: true, weight: 2 },
  { name: 'flying kick with prayer beads suspended midair', monkOnly: true, weight: 2 },
  { name: 'studying a map under candlelight', weight: 7 },
  { name: 'shield braced against incoming sparks', weight: 6 },
  { name: 'casting with both hands in a spiral gesture', weight: 7 },
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

export const moods: Array<WeightedOption<{ name: string }>> = [
  { name: 'dark heroic fantasy', weight: 9 },
  { name: 'cozy tavern adventure', weight: 7 },
  { name: 'grim dungeon crawl', weight: 8 },
  { name: 'high magic wonder', weight: 7 },
  { name: 'mysterious fey dream', weight: 5 },
  { name: 'battle-scarred epic', weight: 6 },
];

export const lights: Array<WeightedOption<{ name: string }>> = [
  { name: 'warm torchlight from below', weight: 8 },
  { name: 'cold moon rim light', weight: 8 },
  { name: 'golden sunrise backlight', weight: 6 },
  { name: 'green witchfire glow', weight: 5 },
  { name: 'blue arcane glyph light', weight: 7 },
  { name: 'storm lightning silhouette', weight: 5 },
];

export const effects: Array<WeightedOption<{ name: string }>> = [
  { name: 'floating embers', weight: 7 },
  { name: 'subtle magical runes', weight: 8 },
  { name: 'swirling mist', weight: 8 },
  { name: 'falling autumn leaves', weight: 5 },
  { name: 'spectral feathers', weight: 4 },
  { name: 'sparks from enchanted steel', weight: 5 },
  { name: 'tiny constellation motes', weight: 5 },
];
