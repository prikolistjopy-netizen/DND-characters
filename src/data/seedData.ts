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

export type SizeCategory = 'tiny' | 'small' | 'medium' | 'large';

export type RaceOption = {
  name: string;
  tags: Array<'small' | 'fey' | 'large-presence' | 'draconic' | 'celestial' | 'shadow'>;
};

export type ArmorTag = 'none' | 'cloth' | 'light' | 'medium' | 'heavy' | 'metal' | 'natural' | 'shield';

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
  | 'shortbow'
  | 'longbow'
  | 'shield'
  | 'tool'
  | 'magic-focus'
  | 'holy-focus'
  | 'mechanical-focus'
  | 'mechanical-weapon'
  | 'orb'
  | 'wand'
  | 'book'
  | 'scroll'
  | 'compass'
  | 'map'
  | 'instrument'
  | 'flute'
  | 'fey-focus'
  | 'rapier'
  | 'dual-blades'
  | 'dagger'
  | 'spear'
  | 'mace'
  | 'warhammer'
  | 'handaxe'
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
  | 'trickster'
  | 'mage'
  | 'academy'
  | 'arcane'
  | 'nature'
  | 'frontier'
  | 'scout'
  | 'scholar'
  | 'cartographer'
  | 'tools'
  | 'battlefield'
  | 'noble'
  | 'shadow'
  | 'draconic'
  | 'pirate'
  | 'oathkeeper'
  | 'fallen';

export type ArchetypeOption = {
  name: string;
  classes: CharacterClass[];
  tags: ArchetypeTag[];
};

export type SilhouetteTag = 'nimble' | 'robed' | 'shield' | 'bestial' | 'fey' | 'broad' | 'compact' | 'engineer';

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
  | 'prayer'
  | 'tracking'
  | 'performance'
  | 'general';

export type PoseOption = {
  name: string;
  tags: PoseTag[];
};

export type MoodOption = {
  name: string;
  tags: ArchetypeTag[];
};

export type LightOption = {
  name: string;
  tags: ArchetypeTag[];
};

export type FxOption = {
  name: string;
  tags: ArchetypeTag[];
};

export type VisualTheme = {
  id: string;
  label: string;
  buildTemplateId: string;
  archetypeTags: ArchetypeTag[];
  archetypeNames: string[];
  preferredMoods: string[];
  preferredLights: string[];
  preferredFx: string[];
  preferredWeapons: string[];
  preferredArmor: string[];
  preferredPoses: string[];
  preferredSilhouettes: string[];
  visualDetails: string[];
};

export type BuildTemplate = {
  id: string;
  label: string;
  allowedClasses: CharacterClass[];
  preferredArchetypes: string[];
  preferredArchetypeTags: ArchetypeTag[];
  allowedArmor: string[];
  allowedWeapons: string[];
  allowedPoses: string[];
  allowedSilhouettes: string[];
  allowedMoods: string[];
  allowedLights: string[];
  allowedFx: string[];
  forbiddenTags: string[];
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
  { name: 'streetwise monster hunter', classes: ['fighter', 'ranger', 'rogue', 'cleric'], tags: ['streetwise', 'hunter'], weight: 8 },
  { name: 'exiled temple guardian', classes: ['cleric', 'monk', 'paladin'], tags: ['holy'], weight: 7 },
  { name: 'wandering battlefield medic', classes: ['cleric', 'fighter', 'paladin', 'bard'], tags: ['holy', 'battlefield'], weight: 6 },
  { name: 'cursed cartographer', classes: ['wizard', 'warlock', 'ranger', 'rogue', 'cleric'], tags: ['cursed', 'cartographer', 'mage', 'scholar'], weight: 6 },
  { name: 'clockwork scholar', classes: ['artificer', 'wizard', 'bard'], tags: ['scholar', 'tools', 'mage'], weight: 6 },
  { name: 'wild frontier scout', classes: ['ranger', 'druid', 'rogue', 'barbarian'], tags: ['nature', 'hunter', 'frontier', 'scout'], weight: 7 },
  { name: 'fallen oathkeeper', classes: ['paladin', 'warlock', 'fighter', 'barbarian'], tags: ['cursed', 'holy', 'oathkeeper', 'fallen'], weight: 5 },
  { name: 'fey-touched trickster', classes: ['bard', 'druid', 'rogue', 'sorcerer', 'warlock'], tags: ['fey', 'trickster'], weight: 6 },
  { name: 'dragon cult defector', classes: ['sorcerer', 'warlock', 'fighter', 'barbarian'], tags: ['draconic', 'cursed'], weight: 4 },
  { name: 'arcane academy dropout', classes: ['wizard', 'sorcerer', 'warlock', 'bard', 'artificer'], tags: ['mage', 'scholar', 'academy', 'arcane'], weight: 7 },
  { name: 'rage-scarred clan champion', classes: ['barbarian', 'fighter'], tags: ['battlefield'], weight: 7 },
  { name: 'iron wall veteran', classes: ['fighter', 'paladin', 'cleric'], tags: ['battlefield', 'oathkeeper'], weight: 6 },
  { name: 'silent monastery avenger', classes: ['monk', 'rogue'], tags: ['shadow'], weight: 6 },
  { name: 'verdant circle emissary', classes: ['druid', 'ranger'], tags: ['nature', 'fey'], weight: 6 },
  { name: 'pirate relic diver', classes: ['rogue', 'bard', 'artificer'], tags: ['pirate', 'tools'], weight: 5 },
  { name: 'void-pact oracle', classes: ['warlock', 'sorcerer', 'wizard'], tags: ['void', 'cursed', 'mage', 'arcane'], weight: 5 },
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
  { name: 'gadget-laden workshop silhouette', tags: ['engineer', 'compact'], weight: 5 },
];

export const armors: Array<WeightedOption<ArmorOption>> = [
  { name: 'no armor, simple travel wraps', tags: ['none', 'cloth'], weight: 8 },
  { name: 'travel-worn cloth layers', tags: ['cloth'], weight: 8 },
  { name: 'plain monastery cloth', tags: ['cloth'], weight: 8 },
  { name: 'embroidered arcane robes', tags: ['cloth'], weight: 9 },
  { name: 'fur-lined hide armor', tags: ['medium', 'natural'], weight: 7 },
  { name: 'patched leather armor', tags: ['light'], weight: 9 },
  { name: 'studded leather with hidden knives', tags: ['light', 'metal'], weight: 7 },
  { name: 'travel cloak over leather', tags: ['light', 'cloth'], weight: 7 },
  { name: 'living bark and woven reed armor', tags: ['medium', 'natural'], weight: 6 },
  { name: 'scale mail with heraldic sash', tags: ['medium', 'metal'], weight: 7 },
  { name: 'half plate with campaign dents', tags: ['medium', 'metal'], weight: 6 },
  { name: 'chain mail under a weathered tabard', tags: ['heavy', 'metal'], weight: 5 },
  { name: 'full plate with engraved pauldrons', tags: ['heavy', 'metal'], weight: 4 },
  { name: 'reinforced artificer coat', tags: ['light', 'metal'], weight: 6 },
  { name: 'mechanical bracers over a work coat', tags: ['medium', 'metal'], weight: 5 },
];

export const weapons: Array<WeightedOption<WeaponOption>> = [
  { name: 'unarmed strikes and prayer beads', tags: ['unarmed', 'simple'], weight: 7 },
  { name: 'simple monk shortspear', tags: ['simple', 'spear', 'melee'], weight: 5 },
  { name: 'quarterstaff carved with runes', tags: ['staff', 'simple', 'magic-focus', 'melee'], weight: 8 },
  { name: 'oak spell staff', tags: ['staff', 'magic-focus', 'simple'], weight: 7 },
  { name: 'crystal orb focus', tags: ['orb', 'magic-focus'], weight: 6 },
  { name: 'silver wand focus', tags: ['wand', 'magic-focus'], weight: 5 },
  { name: 'weathered spellbook', tags: ['book', 'magic-focus'], weight: 6 },
  { name: 'scroll case and compass', tags: ['scroll', 'compass', 'map', 'tool'], weight: 7 },
  { name: 'annotated map and compass', tags: ['map', 'compass', 'tool'], weight: 5 },
  { name: 'holy book and ritual staff', tags: ['book', 'staff', 'holy-focus', 'simple'], weight: 6 },
  { name: 'longsword and round shield', tags: ['martial', 'melee', 'shield'], weight: 8 },
  { name: 'mace and holy shield', tags: ['mace', 'simple', 'melee', 'shield', 'holy-focus'], weight: 7 },
  { name: 'ritual warhammer', tags: ['warhammer', 'martial', 'melee', 'holy-focus'], weight: 5 },
  { name: 'silver holy symbol and staff', tags: ['holy-focus', 'staff', 'simple'], weight: 6 },
  { name: 'rapier with jeweled guard', tags: ['rapier', 'martial', 'melee', 'light'], weight: 7 },
  { name: 'cane sword with fey etching', tags: ['rapier', 'fey-focus', 'martial', 'melee'], weight: 5 },
  { name: 'paired daggers', tags: ['dual-blades', 'dagger', 'light', 'simple', 'melee'], weight: 8 },
  { name: 'dual ranger blades', tags: ['dual-blades', 'martial', 'melee'], weight: 7 },
  { name: 'hunting longbow', tags: ['ranged', 'bow', 'longbow', 'martial'], weight: 7 },
  { name: 'shortbow and scout knife', tags: ['ranged', 'bow', 'shortbow', 'dagger', 'light'], weight: 6 },
  { name: 'ranger spear', tags: ['spear', 'simple', 'melee'], weight: 6 },
  { name: 'handaxe and tracking cord', tags: ['handaxe', 'simple', 'melee'], weight: 5 },
  { name: 'heavy greatsword', tags: ['heavy', 'martial', 'melee', 'greatsword'], weight: 6 },
  { name: 'heavy greataxe', tags: ['heavy', 'martial', 'melee', 'greataxe'], weight: 7 },
  { name: 'oversized maul', tags: ['heavy', 'oversized', 'martial', 'melee'], weight: 4 },
  { name: 'alchemist tools and sparking wrench', tags: ['tool', 'mechanical-focus'], weight: 7 },
  { name: 'clockwork gauntlet focus', tags: ['mechanical-focus', 'magic-focus', 'tool', 'mechanical-weapon'], weight: 6 },
  { name: 'pistol-like arcane calibrator', tags: ['mechanical-focus', 'mechanical-weapon', 'tool', 'ranged'], weight: 4 },
  { name: 'lute reinforced as a dueling club', tags: ['instrument', 'tool', 'simple', 'melee'], weight: 5 },
  { name: 'enchanted flute focus', tags: ['flute', 'instrument', 'fey-focus', 'tool'], weight: 5 },
  { name: 'fey crystal focus', tags: ['fey-focus', 'magic-focus'], weight: 5 },
];

export const poses: Array<WeightedOption<PoseOption>> = [
  { name: 'ready stance on a cracked dungeon tile', tags: ['general'], weight: 6 },
  { name: 'turning mid-stride as cloak whips around', tags: ['general'], weight: 5 },
  { name: 'weapon raised in a decisive challenge', tags: ['general'], weight: 6 },
  { name: 'aiming down a rain-darkened arrow', tags: ['bow'], weight: 7 },
  { name: 'kneeling shot behind broken cover', tags: ['bow'], weight: 6 },
  { name: 'drawing a bowstring with held breath', tags: ['bow'], weight: 7 },
  { name: 'tracking footprints with cloak pulled low', tags: ['tracking'], weight: 6 },
  { name: 'shield braced against incoming sparks', tags: ['shield'], weight: 7 },
  { name: 'guarded stance behind a raised shield', tags: ['shield'], weight: 6 },
  { name: 'forward rapier thrust', tags: ['rapier'], weight: 6 },
  { name: 'duelist turn with one foot sliding back', tags: ['rapier'], weight: 6 },
  { name: 'overhead strike with a heavy blade', tags: ['heavy-melee'], weight: 7 },
  { name: 'ground slam sending dust through the scene', tags: ['heavy-melee'], weight: 6 },
  { name: 'casting with both hands in a spiral gesture', tags: ['casting'], weight: 7 },
  { name: 'tracing a glowing sigil in the air', tags: ['casting'], weight: 7 },
  { name: 'studying a map under candlelight', tags: ['map'], weight: 5 },
  { name: 'ritual prep around carefully arranged instruments', tags: ['tools', 'casting'], weight: 5 },
  { name: 'kneeling prayer as holy light gathers', tags: ['prayer'], weight: 6 },
  { name: 'performing a playful fey flourish', tags: ['performance'], weight: 5 },
  { name: 'tinkering with sparking tools at a workbench', tags: ['tools'], weight: 6 },
  { name: 'casting through a humming mechanical device', tags: ['tools', 'casting'], weight: 5 },
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

export const moods: Array<WeightedOption<MoodOption>> = [
  { name: 'void-cursed omen', tags: ['cursed', 'void'], weight: 8 },
  { name: 'haunted midnight ritual', tags: ['cursed', 'void', 'shadow'], weight: 7 },
  { name: 'radiant temple resolve', tags: ['holy'], weight: 8 },
  { name: 'battlefield benediction', tags: ['holy', 'battlefield'], weight: 6 },
  { name: 'grim dungeon hunt', tags: ['hunter', 'streetwise'], weight: 8 },
  { name: 'rainy alley ambush', tags: ['streetwise', 'hunter'], weight: 6 },
  { name: 'mysterious fey dream', tags: ['fey'], weight: 8 },
  { name: 'moonlit forest charm', tags: ['fey', 'nature'], weight: 6 },
  { name: 'arcane study wonder', tags: ['mage', 'scholar'], weight: 8 },
  { name: 'clockwork workshop focus', tags: ['tools', 'scholar'], weight: 7 },
  { name: 'wild frontier dusk', tags: ['nature', 'hunter', 'frontier'], weight: 7 },
  { name: 'battle-scarred epic', tags: ['battlefield', 'draconic'], weight: 7 },
  { name: 'salt-stained relic dive', tags: ['pirate', 'tools'], weight: 5 },
  { name: 'solemn grave watch', tags: ['holy', 'fallen'], weight: 5 },
  { name: 'silver star prophecy', tags: ['mage', 'arcane'], weight: 5 },
];

export const lights: Array<WeightedOption<LightOption>> = [
  { name: 'cold moon rim light', tags: ['cursed', 'void', 'shadow'], weight: 7 },
  { name: 'void glow from below', tags: ['void', 'cursed'], weight: 6 },
  { name: 'golden divine rays', tags: ['holy'], weight: 8 },
  { name: 'warm sunrise halo', tags: ['holy', 'battlefield'], weight: 6 },
  { name: 'warm torchlight from below', tags: ['hunter', 'streetwise'], weight: 8 },
  { name: 'low lantern light', tags: ['streetwise', 'hunter'], weight: 6 },
  { name: 'soft green witchfire glow', tags: ['fey'], weight: 8 },
  { name: 'soft moonlit glade glow', tags: ['fey', 'nature'], weight: 6 },
  { name: 'blue arcane glyph light', tags: ['mage', 'scholar', 'arcane'], weight: 8 },
  { name: 'amber workbench lamp', tags: ['tools', 'scholar'], weight: 7 },
  { name: 'golden sunset through trees', tags: ['nature', 'hunter', 'frontier'], weight: 7 },
  { name: 'storm lightning silhouette', tags: ['battlefield', 'draconic'], weight: 7 },
  { name: 'candlelit map glow', tags: ['cartographer', 'scholar'], weight: 7 },
  { name: 'mechanical blue-white glow', tags: ['tools'], weight: 6 },
  { name: 'silver starlight', tags: ['mage', 'arcane'], weight: 5 },
  { name: 'pale cemetery lantern light', tags: ['holy', 'fallen'], weight: 5 },
];

export const effects: Array<WeightedOption<FxOption>> = [
  { name: 'purple void energy', tags: ['cursed', 'void'], weight: 8 },
  { name: 'black-violet motes', tags: ['cursed', 'void', 'shadow'], weight: 7 },
  { name: 'void glow', tags: ['void', 'cursed'], weight: 7 },
  { name: 'spectral feathers', tags: ['holy'], weight: 8 },
  { name: 'divine rays', tags: ['holy'], weight: 8 },
  { name: 'dark holy glow', tags: ['holy', 'fallen', 'cursed'], weight: 6 },
  { name: 'holy glow', tags: ['holy'], weight: 7 },
  { name: 'swirling mist', tags: ['hunter', 'streetwise'], weight: 8 },
  { name: 'wet cobblestone haze', tags: ['streetwise', 'hunter'], weight: 6 },
  { name: 'petals and whimsical particles', tags: ['fey', 'trickster'], weight: 8 },
  { name: 'green witchfire', tags: ['fey'], weight: 7 },
  { name: 'soft fey glow', tags: ['fey'], weight: 6 },
  { name: 'subtle magical runes', tags: ['mage', 'scholar', 'cartographer'], weight: 8 },
  { name: 'map glow lines', tags: ['cartographer', 'scholar'], weight: 7 },
  { name: 'sparks from enchanted gears', tags: ['tools', 'scholar'], weight: 7 },
  { name: 'falling autumn leaves', tags: ['nature', 'hunter', 'frontier'], weight: 7 },
  { name: 'sparks from enchanted steel', tags: ['battlefield', 'draconic'], weight: 7 },
  { name: 'floating embers', tags: ['battlefield', 'tools'], weight: 6 },
  { name: 'dust burst', tags: ['battlefield', 'frontier'], weight: 6 },
  { name: 'mechanical glow', tags: ['tools'], weight: 6 },
  { name: 'constellation dust', tags: ['mage', 'arcane'], weight: 5 },
  { name: 'candle smoke', tags: ['scholar', 'cartographer'], weight: 5 },
];


export const visualThemes: Array<WeightedOption<VisualTheme>> = [
  {
    id: 'academy_mage', label: 'Academy Mage', buildTemplateId: 'arcane_caster', archetypeTags: ['academy', 'scholar', 'mage'], archetypeNames: ['arcane academy dropout', 'clockwork scholar'],
    preferredMoods: ['arcane study wonder'], preferredLights: ['blue arcane glyph light'], preferredFx: ['subtle magical runes'],
    preferredWeapons: ['weathered spellbook', 'scroll case and compass', 'oak spell staff'], preferredArmor: ['embroidered arcane robes'], preferredPoses: ['tracing a glowing sigil in the air'], preferredSilhouettes: ['tall robed column', 'asymmetrical cloak profile'],
    visualDetails: ['stacked academy books', 'annotated scrolls', 'ink-stained robe cuffs'], weight: 8,
  },
  {
    id: 'battle_mage', label: 'Battle Mage', buildTemplateId: 'arcane_caster', archetypeTags: ['battlefield', 'draconic'], archetypeNames: ['dragon cult defector'],
    preferredMoods: ['battle-scarred epic', 'arcane study wonder'], preferredLights: ['storm lightning silhouette', 'blue arcane glyph light'], preferredFx: ['sparks from enchanted steel', 'subtle magical runes'],
    preferredWeapons: ['oak spell staff', 'silver wand focus'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['casting with both hands in a spiral gesture'], preferredSilhouettes: ['lean and sharp-edged'],
    visualDetails: ['combat casting stance', 'scorched robe hems', 'enchanted armor trims'], weight: 5,
  },
  {
    id: 'void_oracle', label: 'Void Oracle', buildTemplateId: 'arcane_caster', archetypeTags: ['void', 'cursed'], archetypeNames: ['void-pact oracle'],
    preferredMoods: ['void-cursed omen', 'haunted midnight ritual'], preferredLights: ['void glow from below', 'cold moon rim light'], preferredFx: ['black-violet motes', 'void glow', 'purple void energy'],
    preferredWeapons: ['crystal orb focus', 'weathered spellbook'], preferredArmor: ['plain monastery cloth', 'embroidered arcane robes'], preferredPoses: ['tracing a glowing sigil in the air'], preferredSilhouettes: ['asymmetrical cloak profile', 'lean and sharp-edged'],
    visualDetails: ['floating occult talismans', 'torn prophecy scrolls', 'black-violet smoke'], weight: 8,
  },
  {
    id: 'star_seer', label: 'Star Seer', buildTemplateId: 'arcane_caster', archetypeTags: ['mage', 'arcane'], archetypeNames: [],
    preferredMoods: ['silver star prophecy', 'arcane study wonder'], preferredLights: ['silver starlight', 'blue arcane glyph light'], preferredFx: ['constellation dust', 'subtle magical runes'],
    preferredWeapons: ['crystal orb focus', 'silver wand focus'], preferredArmor: ['embroidered arcane robes'], preferredPoses: ['tracing a glowing sigil in the air'], preferredSilhouettes: ['tall robed column'],
    visualDetails: ['constellation charts', 'silver astrolabe', 'cosmic dust'], weight: 5,
  },
  {
    id: 'ritualist', label: 'Ritualist', buildTemplateId: 'arcane_caster', archetypeTags: ['cartographer', 'scholar', 'cursed'], archetypeNames: ['cursed cartographer'],
    preferredMoods: ['arcane study wonder', 'haunted midnight ritual'], preferredLights: ['candlelit map glow', 'blue arcane glyph light'], preferredFx: ['map glow lines', 'candle smoke', 'subtle magical runes'],
    preferredWeapons: ['scroll case and compass', 'weathered spellbook', 'oak spell staff'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['ritual prep around carefully arranged instruments', 'studying a map under candlelight'], preferredSilhouettes: ['asymmetrical cloak profile'],
    visualDetails: ['chalk ritual circle', 'half-melted candles', 'sigil-covered parchment'], weight: 7,
  },
  {
    id: 'sun_knight', label: 'Sun Knight', buildTemplateId: 'holy_warrior', archetypeTags: ['holy', 'oathkeeper'], archetypeNames: ['iron wall veteran'],
    preferredMoods: ['radiant temple resolve'], preferredLights: ['golden divine rays'], preferredFx: ['divine rays', 'holy glow'],
    preferredWeapons: ['longsword and round shield', 'mace and holy shield'], preferredArmor: ['full plate with engraved pauldrons', 'scale mail with heraldic sash'], preferredPoses: ['weapon raised in a decisive challenge', 'shield braced against incoming sparks'], preferredSilhouettes: ['broad heroic triangle', 'stocky shield-forward stance'],
    visualDetails: ['radiant armor trim', 'sunburst tabard'], weight: 7,
  },
  {
    id: 'battle_chaplain', label: 'Battle Chaplain', buildTemplateId: 'holy_warrior', archetypeTags: ['battlefield', 'holy'], archetypeNames: ['wandering battlefield medic', 'exiled temple guardian'],
    preferredMoods: ['battlefield benediction'], preferredLights: ['warm sunrise halo'], preferredFx: ['spectral feathers', 'holy glow'],
    preferredWeapons: ['mace and holy shield', 'ritual warhammer'], preferredArmor: ['chain mail under a weathered tabard', 'scale mail with heraldic sash'], preferredPoses: ['kneeling prayer as holy light gathers', 'guarded stance behind a raised shield'], preferredSilhouettes: ['stocky shield-forward stance'],
    visualDetails: ['battlefield prayer strips', 'worn armor dents'], weight: 8,
  },
  {
    id: 'wandering_healer', label: 'Wandering Healer', buildTemplateId: 'holy_warrior', archetypeTags: ['holy'], archetypeNames: ['wandering battlefield medic'],
    preferredMoods: ['radiant temple resolve'], preferredLights: ['warm sunrise halo'], preferredFx: ['holy glow', 'spectral feathers'],
    preferredWeapons: ['silver holy symbol and staff', 'mace and holy shield'], preferredArmor: ['scale mail with heraldic sash'], preferredPoses: ['kneeling prayer as holy light gathers'], preferredSilhouettes: ['tall robed column', 'broad heroic triangle'],
    visualDetails: ['herb satchel', 'bandages', 'medicine kit'], weight: 6,
  },
  {
    id: 'grave_warden', label: 'Grave Warden', buildTemplateId: 'holy_warrior', archetypeTags: ['holy', 'fallen'], archetypeNames: ['exiled temple guardian'],
    preferredMoods: ['solemn grave watch', 'haunted midnight ritual'], preferredLights: ['pale cemetery lantern light'], preferredFx: ['spectral feathers', 'candle smoke'],
    preferredWeapons: ['ritual warhammer', 'silver holy symbol and staff'], preferredArmor: ['chain mail under a weathered tabard'], preferredPoses: ['kneeling prayer as holy light gathers'], preferredSilhouettes: ['stocky shield-forward stance'],
    visualDetails: ['cemetery keys', 'grave soil on boots', 'solemn veil'], weight: 5,
  },
  {
    id: 'fallen_saint', label: 'Fallen Saint', buildTemplateId: 'holy_warrior', archetypeTags: ['fallen', 'cursed'], archetypeNames: ['fallen oathkeeper'],
    preferredMoods: ['haunted midnight ritual', 'radiant temple resolve'], preferredLights: ['cold moon rim light'], preferredFx: ['dark holy glow', 'spectral feathers'],
    preferredWeapons: ['longsword and round shield', 'ritual warhammer'], preferredArmor: ['full plate with engraved pauldrons'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['broad heroic triangle'],
    visualDetails: ['cracked halo motif', 'corrupted prayer ribbons'], weight: 7,
  },
  {
    id: 'bounty_hunter', label: 'Bounty Hunter', buildTemplateId: 'shadow_skirmisher', archetypeTags: ['hunter', 'streetwise'], archetypeNames: ['streetwise monster hunter'],
    preferredMoods: ['grim dungeon hunt'], preferredLights: ['warm torchlight from below'], preferredFx: ['swirling mist'], preferredWeapons: ['shortbow and scout knife', 'dual ranger blades'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['tracking footprints with cloak pulled low', 'ready stance on a cracked dungeon tile'], preferredSilhouettes: ['lean and sharp-edged'],
    visualDetails: ['wanted posters', 'monster trophies'], weight: 7,
  },
  {
    id: 'urban_assassin', label: 'Urban Assassin', buildTemplateId: 'shadow_skirmisher', archetypeTags: ['shadow', 'streetwise'], archetypeNames: ['silent monastery avenger'],
    preferredMoods: ['rainy alley ambush'], preferredLights: ['low lantern light'], preferredFx: ['wet cobblestone haze'], preferredWeapons: ['paired daggers', 'rapier with jeweled guard'], preferredArmor: ['studded leather with hidden knives'], preferredPoses: ['forward rapier thrust', 'turning mid-stride as cloak whips around'], preferredSilhouettes: ['compact and nimble'],
    visualDetails: ['alley shadows', 'hidden dagger straps'], weight: 6,
  },
  {
    id: 'relic_thief', label: 'Relic Thief', buildTemplateId: 'shadow_skirmisher', archetypeTags: ['cartographer', 'pirate', 'tools'], archetypeNames: ['cursed cartographer', 'pirate relic diver'],
    preferredMoods: ['salt-stained relic dive', 'rainy alley ambush'], preferredLights: ['candlelit map glow', 'low lantern light'], preferredFx: ['map glow lines', 'subtle magical runes'], preferredWeapons: ['annotated map and compass', 'scroll case and compass'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['studying a map under candlelight', 'ritual prep around carefully arranged instruments'], preferredSilhouettes: ['asymmetrical cloak profile'],
    visualDetails: ['folded trap maps', 'stolen relic case', 'fine lockpicks'], weight: 8,
  },
  {
    id: 'swamp_tracker', label: 'Swamp Tracker', buildTemplateId: 'shadow_skirmisher', archetypeTags: ['hunter', 'nature'], archetypeNames: ['wild frontier scout'],
    preferredMoods: ['grim dungeon hunt'], preferredLights: ['low lantern light'], preferredFx: ['swirling mist'], preferredWeapons: ['shortbow and scout knife'], preferredArmor: ['patched leather armor'], preferredPoses: ['tracking footprints with cloak pulled low'], preferredSilhouettes: ['compact and nimble'],
    visualDetails: ['mud-stained boots', 'reeds tied to the cloak'], weight: 5,
  },
  {
    id: 'pirate_raider', label: 'Pirate Raider', buildTemplateId: 'shadow_skirmisher', archetypeTags: ['pirate'], archetypeNames: ['pirate relic diver'],
    preferredMoods: ['salt-stained relic dive'], preferredLights: ['low lantern light'], preferredFx: ['wet cobblestone haze'], preferredWeapons: ['paired daggers', 'annotated map and compass'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['turning mid-stride as cloak whips around'], preferredSilhouettes: ['asymmetrical cloak profile'],
    visualDetails: ['rope belt', 'sea charts', 'barnacle relics'], weight: 8,
  },
  { id: 'court_jester', label: 'Court Jester', buildTemplateId: 'fey_trickster', archetypeTags: ['trickster'], archetypeNames: [], preferredMoods: ['mysterious fey dream'], preferredLights: ['soft green witchfire glow'], preferredFx: ['petals and whimsical particles'], preferredWeapons: ['enchanted flute focus', 'cane sword with fey etching'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['performing a playful fey flourish'], preferredSilhouettes: ['willowy fey outline'], visualDetails: ['ribboned bells', 'painted grin mask'], weight: 6 },
  { id: 'wandering_bard', label: 'Wandering Bard', buildTemplateId: 'fey_trickster', archetypeTags: ['fey', 'pirate'], archetypeNames: ['pirate relic diver'], preferredMoods: ['moonlit forest charm'], preferredLights: ['soft moonlit glade glow'], preferredFx: ['soft fey glow'], preferredWeapons: ['lute reinforced as a dueling club', 'enchanted flute focus'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['performing a playful fey flourish'], preferredSilhouettes: ['asymmetrical cloak profile'], visualDetails: ['travel lute charms', 'story ribbons'], weight: 6 },
  { id: 'forest_sprite', label: 'Forest Sprite', buildTemplateId: 'fey_trickster', archetypeTags: ['fey', 'nature'], archetypeNames: ['verdant circle emissary'], preferredMoods: ['mysterious fey dream'], preferredLights: ['soft green witchfire glow'], preferredFx: ['green witchfire'], preferredWeapons: ['fey crystal focus'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['casting with both hands in a spiral gesture'], preferredSilhouettes: ['willowy fey outline'], visualDetails: ['leaf crown', 'glowing pollen'], weight: 7 },
  { id: 'moonlit_duelist', label: 'Moonlit Duelist', buildTemplateId: 'fey_trickster', archetypeTags: ['fey', 'trickster'], archetypeNames: ['fey-touched trickster'], preferredMoods: ['moonlit forest charm'], preferredLights: ['soft moonlit glade glow'], preferredFx: ['soft fey glow'], preferredWeapons: ['rapier with jeweled guard', 'cane sword with fey etching'], preferredArmor: ['patched leather armor'], preferredPoses: ['duelist turn with one foot sliding back'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['moonlit cloak clasp', 'silver thorn boutonniere'], weight: 7 },
  { id: 'fey_noble', label: 'Fey Noble', buildTemplateId: 'fey_trickster', archetypeTags: ['fey', 'noble'], archetypeNames: ['haunted noble heir'], preferredMoods: ['mysterious fey dream'], preferredLights: ['soft green witchfire glow'], preferredFx: ['petals and whimsical particles'], preferredWeapons: ['fey crystal focus'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['willowy fey outline'], visualDetails: ['thorn circlet', 'embroidered fey court sash'], weight: 5 },
  { id: 'tribal_champion', label: 'Tribal Champion', buildTemplateId: 'savage_berserker', archetypeTags: ['battlefield'], archetypeNames: ['rage-scarred clan champion'], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['dust burst'], preferredWeapons: ['heavy greataxe'], preferredArmor: ['fur-lined hide armor'], preferredPoses: ['overhead strike with a heavy blade'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['clan trophies', 'painted war marks'], weight: 7 },
  { id: 'beast_slayer', label: 'Beast Slayer', buildTemplateId: 'savage_berserker', archetypeTags: ['draconic'], archetypeNames: ['dragon cult defector'], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['sparks from enchanted steel'], preferredWeapons: ['heavy greatsword', 'ranger spear'], preferredArmor: ['fur-lined hide armor'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['towering bestial frame'], visualDetails: ['monster tooth trophies', 'scarred hide mantle'], weight: 6 },
  { id: 'raider_king', label: 'Raider King', buildTemplateId: 'savage_berserker', archetypeTags: ['battlefield'], archetypeNames: [], preferredMoods: ['battle-scarred epic'], preferredLights: ['golden sunset through trees'], preferredFx: ['floating embers'], preferredWeapons: ['oversized maul'], preferredArmor: ['half plate with campaign dents'], preferredPoses: ['ground slam sending dust through the scene'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['broken crown', 'raider cloak'], weight: 4 },
  { id: 'storm_warrior', label: 'Storm Warrior', buildTemplateId: 'savage_berserker', archetypeTags: ['battlefield'], archetypeNames: [], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['sparks from enchanted steel'], preferredWeapons: ['heavy greataxe'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['overhead strike with a heavy blade'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['storm-charred braids', 'lightning scars'], weight: 5 },
  { id: 'blood_oath_survivor', label: 'Blood Oath Survivor', buildTemplateId: 'savage_berserker', archetypeTags: ['fallen', 'cursed'], archetypeNames: ['fallen oathkeeper'], preferredMoods: ['void-cursed omen'], preferredLights: ['cold moon rim light'], preferredFx: ['floating embers'], preferredWeapons: ['heavy greatsword'], preferredArmor: ['patched leather armor'], preferredPoses: ['ready stance on a cracked dungeon tile'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['blood oath brands', 'torn vow cloth'], weight: 5 },
  { id: 'temple_guardian', label: 'Temple Guardian', buildTemplateId: 'wandering_martial_artist', archetypeTags: ['holy'], archetypeNames: ['exiled temple guardian'], preferredMoods: ['radiant temple resolve'], preferredLights: ['golden divine rays'], preferredFx: ['spectral feathers'], preferredWeapons: ['quarterstaff carved with runes'], preferredArmor: ['plain monastery cloth'], preferredPoses: ['ready stance on a cracked dungeon tile'], preferredSilhouettes: ['compact and nimble'], visualDetails: ['temple key beads', 'saffron sash'], weight: 8 },
  { id: 'silent_avenger', label: 'Silent Avenger', buildTemplateId: 'wandering_martial_artist', archetypeTags: ['shadow'], archetypeNames: ['silent monastery avenger'], preferredMoods: ['haunted midnight ritual'], preferredLights: ['cold moon rim light'], preferredFx: ['swirling mist'], preferredWeapons: ['unarmed strikes and prayer beads'], preferredArmor: ['no armor, simple travel wraps'], preferredPoses: ['flying kick with prayer beads suspended midair'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['shadow prayer beads', 'wrapped knuckles'], weight: 7 },
  { id: 'mountain_hermit', label: 'Mountain Hermit', buildTemplateId: 'wandering_martial_artist', archetypeTags: ['holy'], archetypeNames: [], preferredMoods: ['grim dungeon hunt'], preferredLights: ['warm torchlight from below'], preferredFx: ['swirling mist'], preferredWeapons: ['simple monk shortspear'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['balanced on one hand in a martial arts sweep'], preferredSilhouettes: ['compact and nimble'], visualDetails: ['weathered prayer flags', 'stone talisman'], weight: 5 },
  { id: 'wandering_master', label: 'Wandering Master', buildTemplateId: 'wandering_martial_artist', archetypeTags: ['holy'], archetypeNames: [], preferredMoods: ['radiant temple resolve'], preferredLights: ['warm torchlight from below'], preferredFx: ['divine rays'], preferredWeapons: ['quarterstaff carved with runes'], preferredArmor: ['plain monastery cloth'], preferredPoses: ['ready stance on a cracked dungeon tile'], preferredSilhouettes: ['compact and nimble'], visualDetails: ['patched master cloak', 'old training scars'], weight: 5 },
  { id: 'dragon_style_adept', label: 'Dragon Style Adept', buildTemplateId: 'wandering_martial_artist', archetypeTags: ['draconic'], archetypeNames: [], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['divine rays'], preferredWeapons: ['unarmed strikes and prayer beads'], preferredArmor: ['no armor, simple travel wraps'], preferredPoses: ['flying kick with prayer beads suspended midair'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['dragon-scale wrist wraps', 'coiled stance'], weight: 4 },
  { id: 'clockwork_sapper', label: 'Clockwork Sapper', buildTemplateId: 'battle_engineer', archetypeTags: ['tools', 'scholar'], archetypeNames: ['clockwork scholar', 'runaway alchemist'], preferredMoods: ['clockwork workshop focus'], preferredLights: ['mechanical blue-white glow', 'amber workbench lamp'], preferredFx: ['sparks from enchanted gears', 'mechanical glow'], preferredWeapons: ['alchemist tools and sparking wrench', 'clockwork gauntlet focus'], preferredArmor: ['reinforced artificer coat'], preferredPoses: ['tinkering with sparking tools at a workbench'], preferredSilhouettes: ['gadget-laden workshop silhouette'], visualDetails: ['gear-stuffed bandolier', 'folding brass calipers'], weight: 8 },
  { id: 'pirate_raider', label: 'Pirate Raider Engineer', buildTemplateId: 'battle_engineer', archetypeTags: ['pirate', 'tools'], archetypeNames: ['pirate relic diver'], preferredMoods: ['salt-stained relic dive'], preferredLights: ['amber workbench lamp'], preferredFx: ['sparks from enchanted gears', 'mechanical glow'], preferredWeapons: ['alchemist tools and sparking wrench', 'pistol-like arcane calibrator'], preferredArmor: ['reinforced artificer coat'], preferredPoses: ['tinkering with sparking tools at a workbench'], preferredSilhouettes: ['gadget-laden workshop silhouette'], visualDetails: ['rope belt', 'sea charts', 'barnacle relics'], weight: 8 },
    { id: 'trail_warden', label: 'Trail Warden', buildTemplateId: 'frontier_hunter', archetypeTags: ['frontier', 'scout', 'hunter'], archetypeNames: ['wild frontier scout', 'streetwise monster hunter'], preferredMoods: ['wild frontier dusk', 'grim dungeon hunt'], preferredLights: ['golden sunset through trees', 'warm torchlight from below'], preferredFx: ['falling autumn leaves', 'swirling mist'], preferredWeapons: ['hunting longbow', 'ranger spear'], preferredArmor: ['patched leather armor', 'fur-lined hide armor'], preferredPoses: ['tracking footprints with cloak pulled low', 'aiming down a rain-darkened arrow'], preferredSilhouettes: ['lean and sharp-edged', 'compact and nimble'], visualDetails: ['trail markers', 'muddy map case'], weight: 8 },
  { id: 'lore_skald', label: 'Lore Skald', buildTemplateId: 'skald_performer', archetypeTags: ['noble', 'battlefield', 'pirate'], archetypeNames: ['haunted noble heir', 'pirate relic diver'], preferredMoods: ['rainy alley ambush', 'battle-scarred epic'], preferredLights: ['low lantern light'], preferredFx: ['floating embers', 'swirling mist'], preferredWeapons: ['lute reinforced as a dueling club', 'rapier with jeweled guard'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['performing a playful fey flourish'], preferredSilhouettes: ['asymmetrical cloak profile'], visualDetails: ['song-scroll case', 'trophy tassels'], weight: 7 },
  { id: 'divine_archivist', label: 'Divine Archivist', buildTemplateId: 'divine_scholar', archetypeTags: ['cartographer', 'scholar', 'holy'], archetypeNames: ['cursed cartographer', 'clockwork scholar'], preferredMoods: ['arcane study wonder', 'radiant temple resolve'], preferredLights: ['candlelit map glow'], preferredFx: ['map glow lines', 'subtle magical runes'], preferredWeapons: ['annotated map and compass', 'scroll case and compass', 'holy book and ritual staff'], preferredArmor: ['travel-worn cloth layers', 'embroidered arcane robes'], preferredPoses: ['studying a map under candlelight', 'ritual prep around carefully arranged instruments'], preferredSilhouettes: ['asymmetrical cloak profile', 'gadget-laden workshop silhouette'], visualDetails: ['indexed holy maps', 'ribboned archive keys'], weight: 8 },
];

export const buildTemplates: Array<WeightedOption<BuildTemplate>> = [
  {
    id: 'arcane_caster',
    label: 'Arcane Caster',
    allowedClasses: ['wizard', 'sorcerer', 'warlock'],
    preferredArchetypes: ['arcane academy dropout', 'void-pact oracle', 'cursed cartographer'],
    preferredArchetypeTags: ['mage', 'academy', 'arcane', 'void', 'scholar', 'cartographer'],
    allowedArmor: ['embroidered arcane robes', 'travel-worn cloth layers', 'plain monastery cloth'],
    allowedWeapons: ['oak spell staff', 'crystal orb focus', 'silver wand focus', 'weathered spellbook', 'scroll case and compass'],
    allowedPoses: ['casting with both hands in a spiral gesture', 'tracing a glowing sigil in the air', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'ready stance on a cracked dungeon tile'],
    allowedSilhouettes: ['tall robed column', 'asymmetrical cloak profile', 'lean and sharp-edged', 'compact and nimble'],
    allowedMoods: ['arcane study wonder', 'void-cursed omen', 'haunted midnight ritual'],
    allowedLights: ['blue arcane glyph light', 'cold moon rim light', 'void glow from below', 'candlelit map glow'],
    allowedFx: ['subtle magical runes', 'purple void energy', 'black-violet motes', 'map glow lines'],
    forbiddenTags: ['light', 'medium', 'heavy', 'metal', 'shield', 'rapier', 'greataxe', 'longbow', 'bow'],
    weight: 9,
  },
  {
    id: 'holy_warrior',
    label: 'Holy Warrior',
    allowedClasses: ['paladin', 'cleric', 'fighter'],
    preferredArchetypes: ['exiled temple guardian', 'wandering battlefield medic', 'fallen oathkeeper', 'iron wall veteran'],
    preferredArchetypeTags: ['holy', 'oathkeeper', 'fallen', 'battlefield'],
    allowedArmor: ['scale mail with heraldic sash', 'half plate with campaign dents', 'chain mail under a weathered tabard', 'full plate with engraved pauldrons'],
    allowedWeapons: ['mace and holy shield', 'longsword and round shield', 'ritual warhammer', 'silver holy symbol and staff'],
    allowedPoses: ['shield braced against incoming sparks', 'guarded stance behind a raised shield', 'weapon raised in a decisive challenge', 'kneeling prayer as holy light gathers', 'casting with both hands in a spiral gesture', 'ready stance on a cracked dungeon tile'],
    allowedSilhouettes: ['stocky shield-forward stance', 'broad heroic triangle', 'tall robed column', 'compact and nimble'],
    allowedMoods: ['radiant temple resolve', 'battlefield benediction', 'battle-scarred epic'],
    allowedLights: ['golden divine rays', 'warm sunrise halo', 'storm lightning silhouette'],
    allowedFx: ['divine rays', 'spectral feathers', 'holy glow', 'dark holy glow', 'sparks from enchanted steel'],
    forbiddenTags: ['dagger', 'dual-blades', 'rapier', 'fey-focus'],
    weight: 8,
  },
  {
    id: 'savage_berserker',
    label: 'Savage Berserker',
    allowedClasses: ['barbarian', 'fighter', 'paladin', 'warlock'],
    preferredArchetypes: ['rage-scarred clan champion', 'dragon cult defector', 'fallen oathkeeper', 'wild frontier scout'],
    preferredArchetypeTags: ['battlefield', 'draconic', 'fallen', 'frontier', 'scout'],
    allowedArmor: ['fur-lined hide armor', 'travel-worn cloth layers', 'patched leather armor', 'half plate with campaign dents'],
    allowedWeapons: ['heavy greataxe', 'oversized maul', 'heavy greatsword', 'ranger spear', 'handaxe and tracking cord'],
    allowedPoses: ['overhead strike with a heavy blade', 'ground slam sending dust through the scene', 'ready stance on a cracked dungeon tile', 'weapon raised in a decisive challenge'],
    allowedSilhouettes: ['broad heroic triangle', 'towering bestial frame', 'lean and sharp-edged', 'compact and nimble'],
    allowedMoods: ['battle-scarred epic', 'wild frontier dusk', 'void-cursed omen'],
    allowedLights: ['storm lightning silhouette', 'golden sunset through trees', 'cold moon rim light'],
    allowedFx: ['sparks from enchanted steel', 'falling autumn leaves', 'floating embers', 'dust burst'],
    forbiddenTags: ['rapier', 'longbow', 'shield', 'map'],
    weight: 7,
  },
  {
    id: 'shadow_skirmisher',
    label: 'Shadow Skirmisher',
    allowedClasses: ['rogue', 'ranger', 'fighter'],
    preferredArchetypes: ['streetwise monster hunter', 'silent monastery avenger', 'haunted noble heir', 'pirate relic diver'],
    preferredArchetypeTags: ['streetwise', 'hunter', 'shadow', 'pirate'],
    allowedArmor: ['patched leather armor', 'studded leather with hidden knives', 'travel cloak over leather'],
    allowedWeapons: ['paired daggers', 'rapier with jeweled guard', 'shortbow and scout knife', 'hunting longbow', 'dual ranger blades', 'annotated map and compass', 'scroll case and compass'],
    allowedPoses: ['ready stance on a cracked dungeon tile', 'turning mid-stride as cloak whips around', 'forward rapier thrust', 'duelist turn with one foot sliding back', 'aiming down a rain-darkened arrow', 'drawing a bowstring with held breath', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments'],
    allowedSilhouettes: ['lean and sharp-edged', 'compact and nimble', 'asymmetrical cloak profile'],
    allowedMoods: ['grim dungeon hunt', 'rainy alley ambush', 'haunted midnight ritual'],
    allowedLights: ['warm torchlight from below', 'low lantern light', 'cold moon rim light', 'candlelit map glow'],
    allowedFx: ['swirling mist', 'wet cobblestone haze', 'black-violet motes', 'subtle magical runes', 'map glow lines'],
    forbiddenTags: ['heavy', 'shield'],
    weight: 8,
  },
  {
    id: 'fey_trickster',
    label: 'Fey Trickster',
    allowedClasses: ['bard', 'rogue', 'warlock', 'sorcerer', 'druid'],
    preferredArchetypes: ['fey-touched trickster', 'haunted noble heir', 'pirate relic diver'],
    preferredArchetypeTags: ['fey', 'trickster', 'pirate'],
    allowedArmor: ['travel-worn cloth layers', 'patched leather armor', 'travel cloak over leather'],
    allowedWeapons: ['rapier with jeweled guard', 'cane sword with fey etching', 'paired daggers', 'lute reinforced as a dueling club', 'enchanted flute focus', 'fey crystal focus'],
    allowedPoses: ['turning mid-stride as cloak whips around', 'weapon raised in a decisive challenge', 'casting with both hands in a spiral gesture', 'performing a playful fey flourish', 'duelist turn with one foot sliding back'],
    allowedSilhouettes: ['willowy fey outline', 'asymmetrical cloak profile', 'compact and nimble', 'lean and sharp-edged'],
    allowedMoods: ['mysterious fey dream', 'moonlit forest charm', 'rainy alley ambush'],
    allowedLights: ['soft green witchfire glow', 'soft moonlit glade glow', 'low lantern light'],
    allowedFx: ['petals and whimsical particles', 'green witchfire', 'soft fey glow'],
    forbiddenTags: ['heavy', 'greataxe', 'bestial'],
    weight: 7,
  },
  {
    id: 'skald_performer',
    label: 'Skald Performer',
    allowedClasses: ['bard', 'fighter', 'rogue'],
    preferredArchetypes: ['haunted noble heir', 'wandering battlefield medic', 'pirate relic diver', 'streetwise monster hunter'],
    preferredArchetypeTags: ['noble', 'battlefield', 'pirate', 'streetwise', 'hunter'],
    allowedArmor: ['travel-worn cloth layers', 'patched leather armor', 'travel cloak over leather', 'studded leather with hidden knives'],
    allowedWeapons: ['lute reinforced as a dueling club', 'rapier with jeweled guard', 'paired daggers', 'shortbow and scout knife'],
    allowedPoses: ['performing a playful fey flourish', 'turning mid-stride as cloak whips around', 'weapon raised in a decisive challenge', 'duelist turn with one foot sliding back', 'ready stance on a cracked dungeon tile'],
    allowedSilhouettes: ['asymmetrical cloak profile', 'compact and nimble', 'lean and sharp-edged'],
    allowedMoods: ['rainy alley ambush', 'battle-scarred epic', 'salt-stained relic dive'],
    allowedLights: ['low lantern light', 'warm torchlight from below', 'storm lightning silhouette'],
    allowedFx: ['floating embers', 'sparks from enchanted steel', 'swirling mist', 'wet cobblestone haze'],
    forbiddenTags: ['heavy', 'greataxe', 'shield', 'bestial'],
    weight: 6,
  },
  {
    id: 'divine_scholar',
    label: 'Divine Scholar',
    allowedClasses: ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
    preferredArchetypes: ['cursed cartographer', 'clockwork scholar', 'arcane academy dropout', 'wandering battlefield medic'],
    preferredArchetypeTags: ['cartographer', 'scholar', 'holy', 'mage'],
    allowedArmor: ['embroidered arcane robes', 'travel-worn cloth layers', 'scale mail with heraldic sash', 'half plate with campaign dents'],
    allowedWeapons: ['annotated map and compass', 'scroll case and compass', 'holy book and ritual staff', 'oak spell staff', 'ritual warhammer'],
    allowedPoses: ['studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'kneeling prayer as holy light gathers', 'tracing a glowing sigil in the air'],
    allowedSilhouettes: ['tall robed column', 'asymmetrical cloak profile', 'stocky shield-forward stance', 'gadget-laden workshop silhouette'],
    allowedMoods: ['arcane study wonder', 'radiant temple resolve', 'clockwork workshop focus'],
    allowedLights: ['candlelit map glow', 'blue arcane glyph light', 'golden divine rays', 'amber workbench lamp'],
    allowedFx: ['subtle magical runes', 'map glow lines', 'divine rays', 'spectral feathers'],
    forbiddenTags: ['rapier', 'greataxe', 'longbow', 'oversized'],
    weight: 6,
  },
  {
    id: 'battle_engineer',
    label: 'Battle Engineer',
    allowedClasses: ['artificer', 'cleric', 'warlock'],
    preferredArchetypes: ['clockwork scholar', 'runaway alchemist', 'pirate relic diver', 'arcane academy dropout'],
    preferredArchetypeTags: ['tools', 'scholar', 'arcane', 'pirate'],
    allowedArmor: ['reinforced artificer coat', 'mechanical bracers over a work coat', 'patched leather armor', 'half plate with campaign dents'],
    allowedWeapons: ['alchemist tools and sparking wrench', 'clockwork gauntlet focus', 'pistol-like arcane calibrator', 'ritual warhammer', 'oak spell staff'],
    allowedPoses: ['tinkering with sparking tools at a workbench', 'casting through a humming mechanical device', 'ritual prep around carefully arranged instruments', 'weapon raised in a decisive challenge'],
    allowedSilhouettes: ['gadget-laden workshop silhouette', 'compact and nimble', 'broad heroic triangle'],
    allowedMoods: ['clockwork workshop focus', 'arcane study wonder', 'salt-stained relic dive'],
    allowedLights: ['amber workbench lamp', 'mechanical blue-white glow', 'blue arcane glyph light'],
    allowedFx: ['sparks from enchanted gears', 'subtle magical runes', 'floating embers', 'mechanical glow', 'map glow lines'],
    forbiddenTags: ['natural', 'bestial', 'greataxe', 'longbow'],
    weight: 6,
  },
  {
    id: 'frontier_hunter',
    label: 'Frontier Hunter',
    allowedClasses: ['ranger', 'fighter', 'rogue', 'barbarian', 'druid'],
    preferredArchetypes: ['wild frontier scout', 'streetwise monster hunter', 'rage-scarred clan champion'],
    preferredArchetypeTags: ['frontier', 'scout', 'hunter', 'nature'],
    allowedArmor: ['patched leather armor', 'studded leather with hidden knives', 'fur-lined hide armor', 'half plate with campaign dents'],
    allowedWeapons: ['hunting longbow', 'shortbow and scout knife', 'ranger spear', 'handaxe and tracking cord', 'dual ranger blades', 'annotated map and compass', 'scroll case and compass'],
    allowedPoses: ['aiming down a rain-darkened arrow', 'drawing a bowstring with held breath', 'tracking footprints with cloak pulled low', 'ready stance on a cracked dungeon tile', 'turning mid-stride as cloak whips around', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments'],
    allowedSilhouettes: ['lean and sharp-edged', 'compact and nimble', 'asymmetrical cloak profile', 'broad heroic triangle'],
    allowedMoods: ['wild frontier dusk', 'grim dungeon hunt', 'rainy alley ambush'],
    allowedLights: ['golden sunset through trees', 'warm torchlight from below', 'low lantern light', 'candlelit map glow'],
    allowedFx: ['falling autumn leaves', 'swirling mist', 'wet cobblestone haze', 'floating embers', 'dust burst', 'subtle magical runes', 'map glow lines'],
    forbiddenTags: ['robed', 'cloth', 'magic-focus'],
    weight: 8,
  },
  {
    id: 'wandering_martial_artist',
    label: 'Wandering Martial Artist',
    allowedClasses: ['monk'],
    preferredArchetypes: ['silent monastery avenger', 'exiled temple guardian'],
    preferredArchetypeTags: ['shadow', 'holy'],
    allowedArmor: ['no armor, simple travel wraps', 'plain monastery cloth', 'travel-worn cloth layers'],
    allowedWeapons: ['unarmed strikes and prayer beads', 'quarterstaff carved with runes', 'simple monk shortspear'],
    allowedPoses: ['balanced on one hand in a martial arts sweep', 'flying kick with prayer beads suspended midair', 'ready stance on a cracked dungeon tile'],
    allowedSilhouettes: ['compact and nimble', 'lean and sharp-edged', 'asymmetrical cloak profile'],
    allowedMoods: ['radiant temple resolve', 'haunted midnight ritual', 'grim dungeon hunt'],
    allowedLights: ['golden divine rays', 'cold moon rim light', 'warm torchlight from below'],
    allowedFx: ['spectral feathers', 'divine rays', 'swirling mist'],
    forbiddenTags: ['light', 'medium', 'heavy', 'metal', 'shield', 'rapier', 'longbow', 'greataxe'],
    weight: 5,
  },
];
