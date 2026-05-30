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
  | 'dual-blades'
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
  fantasyPillarId?: FantasyPillarId;
  classBias?: CharacterClass[];
  raceBias?: string[];
  sizeBias?: SizeCategory[];
  visualFantasy?: string;
  visualMotifIds?: string[];
  detailPoolIds?: string[];
  armorLanguageIds?: string[];
  weaponLanguageIds?: string[];
  companionBias?: CompanionTier[];
  visualDetails: string[];
};

export type NarrativeMotif = {
  id: string;
  label: string;
  weight: number;
  compatibleBuildTemplates: string[];
  compatibleVisualThemes: string[];
  archetypeTags: ArchetypeTag[];
  classBias: string[];
  raceBias: string[];
  forbiddenClasses: string[];
  forbiddenTags: string[];
  storyDetails: string[];
  promptFragments: string[];
  moodBias: string[];
  fxBias: string[];
};

export type VisualThemeVariant = {
  id: string;
  label: string;
  visualThemeId: string;
  visualDetails: string[];
  promptFragments: string[];
  preferredFx: string[];
};

export type NarrativeVariant = {
  id: string;
  label: string;
  narrativeMotifId: string;
  storyDetails: string[];
  promptFragments: string[];
  moodBias: string[];
  fxBias: string[];
};

export type ClassAnchor = {
  className: CharacterClass;
  label: string;
  weaponTags: WeaponTag[];
  armorTags: ArmorTag[];
  poseTags: PoseTag[];
  detailKeywords: string[];
};

export type CulturalOrigin = {
  id: string;
  label: string;
  clothingDetails: string[];
  materials: string[];
  ornaments: string[];
  atmosphere: string[];
  colorHints: string[];
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


export type FantasyPillarId =
  | 'warrior'
  | 'scholar'
  | 'explorer'
  | 'mystic'
  | 'divine'
  | 'shadow'
  | 'fey'
  | 'noble'
  | 'primal'
  | 'occult'
  | 'artificer'
  | 'maritime';

export type CompanionTier = 'none' | 'minor' | 'major' | 'legendary';
export type SilhouetteCategory = 'vertical' | 'wide' | 'asymmetrical' | 'companion' | 'relic' | 'caster' | 'martial' | 'small' | 'mounted';

export type FantasyPillar = { id: FantasyPillarId; label: string; description: string };

export type SilhouetteProfile = {
  id: string;
  label: string;
  category: SilhouetteCategory;
  compatibleBuildTemplates: string[];
  compatibleThemes?: string[];
  compatibleSizes: SizeCategory[];
  forbiddenClasses?: CharacterClass[];
  visualDescription: string;
  promptFragment: string;
  weight?: number;
};

export type VisualMotif = {
  id: string;
  label: string;
  compatibleThemes: string[];
  compatibleBuildTemplates: string[];
  shapes: string[];
  materials: string[];
  ornamentDetails: string[];
  promptFragments: string[];
};

export type ArmorLanguage = {
  id: string;
  label: string;
  armorCategory: ArmorTag[];
  compatibleBuildTemplates: string[];
  compatibleThemes: string[];
  compatibleCultures?: string[];
  promptFragments: string[];
  detailHints: string[];
};

export type WeaponLanguage = {
  id: string;
  label: string;
  baseWeaponTags: WeaponTag[];
  compatibleBuildTemplates: string[];
  compatibleThemes: string[];
  promptFragments: string[];
  detailHints: string[];
};

export type CompanionProfile = {
  id: string;
  label: string;
  tier: CompanionTier;
  companionType: 'animal' | 'bird' | 'spirit' | 'dragon' | 'construct' | 'celestial' | 'fey' | 'undead' | 'shadow';
  compatibleClasses: CharacterClass[];
  compatibleBuildTemplates: string[];
  compatibleThemes: string[];
  sizeImpact: 'none' | 'small_silhouette' | 'dual_silhouette' | 'mounted_silhouette';
  visualDetails: string[];
  promptFragment: string;
  weight: number;
};

export type CompanionRelationship = { id: string; label: string; promptFragment: string; weight: number };

export type ThemeContentProfile = {
  themeId: string;
  heroDetails: string[];
  rareDetails: string[];
  legendaryDetails: string[];
  storyProps: string[];
  faceDetails?: string[];
  handDetails?: string[];
  cloakDetails?: string[];
  beltDetails?: string[];
  jewelryDetails?: string[];
  backgroundProps?: string[];
  companionCompatibleDetails?: string[];
};

export type ThemeVisualProfile = {
  themeId: string;
  fantasyPillarId: FantasyPillarId;
  visualFantasy: string;
  visualMotifIds: string[];
  detailPoolIds: string[];
  armorLanguageIds: string[];
  weaponLanguageIds: string[];
  classBias: CharacterClass[];
  raceBias?: string[];
  sizeBias?: SizeCategory[];
  companionBias?: CompanionTier[];
};

export type VisualDetailBudget = {
  majorVisualDetails: number;
  minorVisualDetails: number;
  storyProps: number;
  cultureDetails: number;
  companionDetails: number;
  legendaryDetails: number;
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

export const classAnchors: ClassAnchor[] = [
  { className: 'wizard', label: 'Wizard Arcane Identity', weaponTags: ['staff', 'orb', 'book', 'wand', 'magic-focus'], armorTags: ['cloth'], poseTags: ['casting', 'map', 'tools'], detailKeywords: ['robe', 'spellbook', 'grimoire', 'scroll', 'glyph', 'arcane', 'academy'] },
  { className: 'rogue', label: 'Rogue Skirmisher Identity', weaponTags: ['dagger', 'rapier', 'bow', 'tool', 'map', 'compass', 'scroll'], armorTags: ['light', 'cloth'], poseTags: ['rapier', 'bow', 'dual-blades', 'map', 'tools', 'tracking'], detailKeywords: ['cloak', 'lockpick', 'stolen', 'hidden', 'alley', 'stealth', 'satchel'] },
  { className: 'ranger', label: 'Ranger Wilderness Identity', weaponTags: ['bow', 'spear', 'handaxe', 'dual-blades', 'map', 'compass'], armorTags: ['light', 'medium', 'natural'], poseTags: ['bow', 'tracking', 'map', 'tools'], detailKeywords: ['trail', 'muddy', 'wilderness', 'hunter', 'tracks', 'leather', 'lantern'] },
  { className: 'monk', label: 'Monk Martial Identity', weaponTags: ['unarmed', 'staff', 'simple', 'spear'], armorTags: ['none', 'cloth'], poseTags: ['monk', 'general'], detailKeywords: ['wraps', 'beads', 'sash', 'monastery', 'temple', 'staff'] },
  { className: 'paladin', label: 'Paladin Sacred Knight Identity', weaponTags: ['holy-focus', 'shield', 'mace', 'warhammer', 'spear', 'martial'], armorTags: ['medium', 'heavy', 'metal', 'shield'], poseTags: ['shield', 'prayer', 'general'], detailKeywords: ['holy', 'relic', 'shield', 'symbol', 'banner', 'oath'] },
  { className: 'cleric', label: 'Cleric Ritual Identity', weaponTags: ['holy-focus', 'staff', 'mace', 'warhammer', 'book', 'shield'], armorTags: ['medium', 'heavy', 'cloth', 'metal'], poseTags: ['prayer', 'casting', 'map', 'tools', 'shield'], detailKeywords: ['prayer', 'holy', 'ritual', 'relic', 'book', 'censer'] },
  { className: 'bard', label: 'Bard Performer Identity', weaponTags: ['instrument', 'flute', 'book', 'scroll', 'rapier', 'tool'], armorTags: ['cloth', 'light'], poseTags: ['performance', 'tools', 'rapier'], detailKeywords: ['song', 'lute', 'flute', 'story', 'performance', 'recital', 'archive'] },
  { className: 'artificer', label: 'Artificer Device Identity', weaponTags: ['tool', 'mechanical-focus', 'mechanical-weapon', 'magic-focus'], armorTags: ['light', 'medium', 'metal'], poseTags: ['tools', 'casting'], detailKeywords: ['gear', 'clockwork', 'device', 'brass', 'caliper', 'mechanical'] },
  { className: 'warlock', label: 'Warlock Pact Identity', weaponTags: ['magic-focus', 'book', 'orb', 'wand', 'staff', 'fey-focus'], armorTags: ['cloth', 'light'], poseTags: ['casting', 'rapier'], detailKeywords: ['pact', 'void', 'occult', 'curse', 'talisman', 'eldritch'] },
  { className: 'barbarian', label: 'Barbarian Primal Identity', weaponTags: ['heavy', 'greataxe', 'greatsword', 'spear', 'handaxe'], armorTags: ['medium', 'natural', 'cloth'], poseTags: ['heavy-melee', 'general'], detailKeywords: ['trophy', 'hide', 'clan', 'scar', 'rugged', 'war'] },
  { className: 'fighter', label: 'Fighter Martial Identity', weaponTags: ['martial', 'shield', 'greatsword', 'spear', 'warhammer', 'dual-blades', 'mace', 'bow'], armorTags: ['light', 'medium', 'heavy', 'metal'], poseTags: ['shield', 'heavy-melee', 'dual-blades', 'general', 'bow'], detailKeywords: ['veteran', 'guard', 'arena', 'banner', 'combat', 'campaign'] },
  { className: 'druid', label: 'Druid Natural Identity', weaponTags: ['staff', 'simple', 'spear', 'fey-focus', 'instrument'], armorTags: ['cloth', 'natural', 'light'], poseTags: ['casting', 'tracking', 'general'], detailKeywords: ['leaf', 'forest', 'bark', 'reed', 'nature', 'fey', 'wild'] },
  { className: 'sorcerer', label: 'Sorcerer Innate Magic Identity', weaponTags: ['magic-focus', 'orb', 'wand', 'staff', 'book'], armorTags: ['cloth'], poseTags: ['casting'], detailKeywords: ['aura', 'birthmark', 'arcane', 'spark', 'void', 'dragon'] },
];

export const culturalOrigins: Array<WeightedOption<CulturalOrigin>> = [
  { id: 'northern_frontier', label: 'Northern Frontier', clothingDetails: ['fur trim', 'weathered leather', 'snow-dusted cloak edge'], materials: ['carved bone', 'iron rivets'], ornaments: ['carved bone charms', 'wolf-knot toggles'], atmosphere: ['cold open-air grit'], colorHints: ['charcoal grey', 'frost blue'], weight: 8 },
  { id: 'imperial_heartland', label: 'Imperial Heartland', clothingDetails: ['heraldic embroidery', 'tailored mantle', 'formal layered hems'], materials: ['polished fittings', 'noble fabrics'], ornaments: ['seal-stamped clasp', 'laurel trim'], atmosphere: ['disciplined courtly polish'], colorHints: ['deep crimson', 'warm gold'], weight: 8 },
  { id: 'desert_kingdoms', label: 'Desert Kingdoms', clothingDetails: ['wrapped cloth', 'sun veil', 'sand-worn equipment'], materials: ['bronze', 'dyed linen'], ornaments: ['bronze ornaments', 'glass bead cords'], atmosphere: ['dry heat haze'], colorHints: ['sand ochre', 'turquoise'], weight: 7 },
  { id: 'feywild_exile', label: 'Feywild Exile', clothingDetails: ['living fabrics', 'petal-edged cloak', 'moonlit color panels'], materials: ['glowing flowers', 'woven moonvine'], ornaments: ['glowing flower pins', 'silver thorn charms'], atmosphere: ['unearthly twilight'], colorHints: ['moonlit violet', 'soft green'], weight: 7 },
  { id: 'ancient_monastery', label: 'Ancient Monastery', clothingDetails: ['monastery cloth', 'plain layered wraps', 'weathered prayer shawl'], materials: ['aged wood', 'undyed linen'], ornaments: ['prayer ribbons', 'wooden talismans'], atmosphere: ['quiet incense discipline'], colorHints: ['saffron', 'warm umber'], weight: 7 },
  { id: 'ruined_arcane_state', label: 'Ruined Arcane State', clothingDetails: ['academy ruin patches', 'salvaged robe panels', 'cracked glyph fragments sewn in'], materials: ['salvaged magical relics', 'chipped crystal'], ornaments: ['broken faculty pin', 'rune shard necklace'], atmosphere: ['fallen scholastic grandeur'], colorHints: ['faded blue', 'ashen silver'], weight: 8 },
  { id: 'free_city_states', label: 'Free City States', clothingDetails: ['layered street cloak', 'market-dyed sash', 'practical city boots'], materials: ['mixed textiles', 'brass buckles'], ornaments: ['guild token', 'coin-chain trim'], atmosphere: ['busy cosmopolitan edge'], colorHints: ['brick red', 'brass yellow'], weight: 8 },
  { id: 'dragon_coast', label: 'Dragon Coast', clothingDetails: ['salt-proof coat trim', 'wind-tied scarf', 'scale-pattern panels'], materials: ['lacquered scale', 'sea-worn brass'], ornaments: ['dragon tooth bead', 'coastal knotwork'], atmosphere: ['stormy sea air'], colorHints: ['deep teal', 'storm bronze'], weight: 7 },
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
  { name: 'small fitted chain shirt', tags: ['medium', 'metal'], weight: 5 },
  { name: 'compact leather harness', tags: ['light'], weight: 6 },
  { name: 'small travel cloak', tags: ['light', 'cloth'], weight: 6 },
  { name: 'light ceremonial half-plate', tags: ['medium', 'metal'], weight: 4 },
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
  { name: 'spear and torn banner', tags: ['spear', 'martial', 'melee'], weight: 5 },
  { name: 'song-scroll case', tags: ['scroll', 'book', 'instrument', 'tool'], weight: 6 },
  { name: 'annotated performance notes', tags: ['book', 'scroll', 'instrument', 'tool'], weight: 5 },
  { name: 'small spellbook', tags: ['book', 'magic-focus'], weight: 5 },
  { name: 'crystal focus', tags: ['magic-focus', 'orb'], weight: 3 },
  { name: 'floating spellbook', tags: ['book', 'magic-focus'], weight: 3 },
  { name: 'brass astrolabe', tags: ['tool', 'magic-focus', 'map'], weight: 3 },
  { name: 'bone-carved wand', tags: ['wand', 'magic-focus'], weight: 3 },
  { name: 'ink-stained grimoire', tags: ['book', 'magic-focus'], weight: 3 },
  { name: 'celestial chart cylinder', tags: ['scroll', 'map', 'tool'], weight: 3 },
  { name: 'relic censer', tags: ['holy-focus', 'simple'], weight: 3 },
  { name: 'sun-forged mace', tags: ['mace', 'simple', 'melee', 'holy-focus'], weight: 3 },
  { name: 'banner spear', tags: ['spear', 'martial', 'melee', 'holy-focus'], weight: 3 },
  { name: 'reliquary shield', tags: ['shield', 'holy-focus'], weight: 3 },
  { name: 'pilgrim staff', tags: ['staff', 'simple', 'holy-focus'], weight: 3 },
  { name: 'assassin stiletto', tags: ['dagger', 'light', 'simple', 'melee'], weight: 3 },
  { name: 'folding crossbow', tags: ['ranged', 'martial'], weight: 3 },
  { name: 'trap toolkit', tags: ['tool'], weight: 3 },
  { name: 'rope launcher', tags: ['tool', 'ranged'], weight: 3 },
  { name: 'relic thief satchel', tags: ['tool', 'map'], weight: 3 },
  { name: 'hunting spear', tags: ['spear', 'simple', 'melee'], weight: 3 },
  { name: 'bone bow', tags: ['ranged', 'bow', 'shortbow'], weight: 3 },
  { name: 'trap kit', tags: ['tool'], weight: 3 },
  { name: 'tracking lantern', tags: ['tool'], weight: 3 },
  { name: 'beastcaller horn', tags: ['tool', 'instrument'], weight: 3 },
  { name: 'annotated songbook', tags: ['book', 'instrument', 'tool'], weight: 3 },
  { name: 'enchanted flute', tags: ['flute', 'instrument', 'fey-focus', 'tool'], weight: 3 },
  { name: 'memory scroll case', tags: ['scroll', 'book', 'instrument', 'tool'], weight: 3 },
  { name: 'storykeeper satchel', tags: ['book', 'instrument', 'tool'], weight: 3 },
  { name: 'rune-carved lute', tags: ['instrument', 'tool', 'magic-focus'], weight: 3 },
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
  { name: 'dual slash from a low stance', tags: ['dual-blades'], weight: 6 },
  { name: 'crouched ambush with paired blades', tags: ['dual-blades'], weight: 6 },
  { name: 'close-quarters ready stance', tags: ['dual-blades', 'general'], weight: 6 },
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
  { name: 'adjusting floating pages', tags: ['casting'], weight: 3 },
  { name: 'drawing a sigil circle', tags: ['casting'], weight: 3 },
  { name: 'consulting star charts', tags: ['tools'], weight: 3 },
  { name: 'turning a brass astrolabe toward the light', tags: ['tools'], weight: 3 },
  { name: 'opening a floating grimoire mid-spell', tags: ['casting'], weight: 3 },
  { name: 'raising a relic censer in prayer', tags: ['prayer'], weight: 3 },
  { name: 'planting a banner spear before the charge', tags: ['general'], weight: 3 },
  { name: 'guarding behind a reliquary shield', tags: ['shield'], weight: 3 },
  { name: 'blessing a pilgrim staff before battle', tags: ['prayer'], weight: 3 },
  { name: 'swinging a sun-forged mace in a warding arc', tags: ['general'], weight: 3 },
  { name: 'picking a lock with a stiletto ready', tags: ['tools'], weight: 3 },
  { name: 'studying stolen plans in an alley', tags: ['tools'], weight: 3 },
  { name: 'crouched rooftop observation', tags: ['general'], weight: 3 },
  { name: 'setting a compact trap toolkit', tags: ['tools'], weight: 3 },
  { name: 'firing a rope launcher across a gap', tags: ['tools'], weight: 3 },
  { name: 'inspecting tracks with a lantern low', tags: ['tracking'], weight: 3 },
  { name: 'preparing a hunting trap', tags: ['tools'], weight: 3 },
  { name: 'listening to distant sounds with horn lowered', tags: ['tracking'], weight: 3 },
  { name: 'bracing a hunting spear in tall grass', tags: ['general'], weight: 3 },
  { name: 'drawing a bone bow at dusk', tags: ['bow'], weight: 3 },
  { name: 'performing before an unseen audience', tags: ['performance'], weight: 3 },
  { name: 'writing notes into a songbook', tags: ['tools', 'performance'], weight: 3 },
  { name: 'tuning a magical instrument', tags: ['tools', 'performance'], weight: 3 },
  { name: 'unfurling a memory scroll mid-song', tags: ['performance'], weight: 3 },
  { name: 'striking a rune-carved lute chord', tags: ['performance'], weight: 3 },
  { name: 'howling over a raised greataxe', tags: ['heavy-melee'], weight: 3 },
  { name: 'dragging a maul through battlefield dust', tags: ['heavy-melee'], weight: 3 },
  { name: 'planting a spear in a victory roar', tags: ['general'], weight: 3 },
  { name: 'circling with a handaxe low', tags: ['general'], weight: 3 },
  { name: 'charging out of flying embers', tags: ['heavy-melee'], weight: 3 },
  { name: 'bowing with a moonlit flourish', tags: ['performance'], weight: 3 },
  { name: 'twirling a cane sword beneath petals', tags: ['rapier'], weight: 3 },
  { name: 'playing a flute as witchfire gathers', tags: ['performance'], weight: 3 },
  { name: 'casting through a fey crystal', tags: ['casting'], weight: 3 },
  { name: 'laughing behind a lifted cloak', tags: ['general'], weight: 3 },
  { name: 'tinkering with a clockwork gauntlet', tags: ['tools'], weight: 3 },
  { name: 'calibrating a pistol-like arcane tool', tags: ['tools'], weight: 3 },
  { name: 'tightening mechanical bracers before casting', tags: ['tools', 'casting'], weight: 3 },
  { name: 'measuring sparks over an alchemy kit', tags: ['tools'], weight: 3 },
  { name: 'aiming a humming device like a focus', tags: ['tools', 'casting'], weight: 3 },
  { name: 'copying a holy map by candlelight', tags: ['tools'], weight: 3 },
  { name: 'holding a scroll against divine wind', tags: ['tools', 'casting'], weight: 3 },
  { name: 'reading a compass beside ritual chalk', tags: ['tools'], weight: 3 },
  { name: 'opening a holy book over a sigil', tags: ['casting', 'prayer'], weight: 3 },
  { name: 'kneeling over annotated maps', tags: ['tools'], weight: 3 },
  { name: 'catching a strike on prayer beads', tags: ['monk'], weight: 3 },
  { name: 'sweeping low with a shortspear', tags: ['monk'], weight: 3 },
  { name: 'meditating as mist coils around', tags: ['monk'], weight: 3 },
  { name: 'stepping through a spinning staff form', tags: ['monk'], weight: 3 },
  { name: 'leaping from a temple step', tags: ['monk'], weight: 3 },
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
  { name: 'drifting void ash', tags: ['cursed', 'void'], weight: 3 },
  { name: 'black-violet sparks', tags: ['cursed', 'void'], weight: 3 },
  { name: 'gravity distortions', tags: ['void', 'arcane'], weight: 3 },
  { name: 'fragmented stars', tags: ['void', 'arcane'], weight: 3 },
  { name: 'sun motes', tags: ['holy'], weight: 3 },
  { name: 'prayer ribbons', tags: ['holy'], weight: 3 },
  { name: 'glowing dust', tags: ['holy'], weight: 3 },
  { name: 'sacred sparks', tags: ['holy'], weight: 3 },
  { name: 'drifting petals', tags: ['fey', 'trickster'], weight: 3 },
  { name: 'glowing pollen', tags: ['fey', 'nature'], weight: 3 },
  { name: 'moonlit butterflies', tags: ['fey'], weight: 3 },
  { name: 'floating blossoms', tags: ['fey', 'trickster'], weight: 3 },
  { name: 'windblown leaf sparks', tags: ['frontier', 'hunter', 'nature'], weight: 3 },
  { name: 'lantern moth haze', tags: ['frontier', 'hunter'], weight: 3 },
  { name: 'paper glyph flutter', tags: ['scholar', 'cartographer'], weight: 3 },
  { name: 'ink sparks', tags: ['mage', 'scholar'], weight: 3 },
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

  { id: 'mercenary_captain', label: 'Mercenary Captain', buildTemplateId: 'martial_veteran', archetypeTags: ['battlefield', 'streetwise'], archetypeNames: ['iron wall veteran'], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['torn banners in battlefield smoke', 'sparks from enchanted steel'], preferredWeapons: ['longsword and round shield', 'spear and torn banner'], preferredArmor: ['half plate with campaign dents', 'scale mail with heraldic sash'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['paymaster tally tags', 'scarred command sash'], weight: 8 },
  { id: 'royal_guard', label: 'Royal Guard', buildTemplateId: 'martial_veteran', archetypeTags: ['noble', 'oathkeeper'], archetypeNames: ['iron wall veteran'], preferredMoods: ['battlefield benediction'], preferredLights: ['warm sunrise halo'], preferredFx: ['sparks from enchanted steel'], preferredWeapons: ['longsword and round shield', 'ritual warhammer'], preferredArmor: ['chain mail under a weathered tabard', 'full plate with engraved pauldrons'], preferredPoses: ['guarded stance behind a raised shield'], preferredSilhouettes: ['stocky shield-forward stance'], visualDetails: ['polished guard badge', 'creased parade cloak'], weight: 6 },
  { id: 'arena_champion', label: 'Arena Champion', buildTemplateId: 'martial_veteran', archetypeTags: ['battlefield'], archetypeNames: ['rage-scarred clan champion'], preferredMoods: ['battle-scarred epic'], preferredLights: ['storm lightning silhouette'], preferredFx: ['dust burst'], preferredWeapons: ['heavy greatsword', 'dual ranger blades'], preferredArmor: ['reinforced artificer coat', 'half plate with campaign dents'], preferredPoses: ['overhead strike with a heavy blade', 'dual slash from a low stance'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['arena tally scars', 'prize-fighter belt'], weight: 7 },
  { id: 'veteran_officer', label: 'Veteran Officer', buildTemplateId: 'martial_veteran', archetypeTags: ['battlefield'], archetypeNames: ['wandering battlefield medic'], preferredMoods: ['battle-scarred epic'], preferredLights: ['low lantern light'], preferredFx: ['torn banners in battlefield smoke'], preferredWeapons: ['spear and torn banner', 'ritual warhammer'], preferredArmor: ['scale mail with heraldic sash'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['broad heroic triangle'], visualDetails: ['old campaign medals', 'folded field orders'], weight: 7 },
  { id: 'monster_slayer_veteran', label: 'Monster Slayer Veteran', buildTemplateId: 'martial_veteran', archetypeTags: ['hunter', 'frontier'], archetypeNames: ['streetwise monster hunter'], preferredMoods: ['grim dungeon hunt'], preferredLights: ['warm torchlight from below'], preferredFx: ['swirling mist', 'sparks from enchanted steel'], preferredWeapons: ['heavy greatsword', 'spear and torn banner'], preferredArmor: ['half plate with campaign dents', 'compact leather harness'], preferredPoses: ['weapon raised in a decisive challenge'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['monster tally marks', 'claw-scarred vambrace'], weight: 8 },
  { id: 'archive_performer', label: 'Archive Performer', buildTemplateId: 'lorekeeper_bard', archetypeTags: ['scholar', 'academy'], archetypeNames: ['clockwork scholar', 'arcane academy dropout'], preferredMoods: ['arcane study wonder'], preferredLights: ['candlelit map glow'], preferredFx: ['subtle magical runes'], preferredWeapons: ['song-scroll case', 'annotated performance notes', 'small spellbook'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['ritual prep around carefully arranged instruments'], preferredSilhouettes: ['asymmetrical cloak profile'], visualDetails: ['indexed performance notes', 'library stamp ribbons'], weight: 8 },
  { id: 'wandering_storyteller', label: 'Wandering Storyteller', buildTemplateId: 'lorekeeper_bard', archetypeTags: ['noble', 'pirate'], archetypeNames: ['haunted noble heir', 'pirate relic diver'], preferredMoods: ['rainy alley ambush'], preferredLights: ['low lantern light'], preferredFx: ['floating embers'], preferredWeapons: ['lute reinforced as a dueling club', 'song-scroll case'], preferredArmor: ['small travel cloak', 'travel cloak over leather'], preferredPoses: ['performing a playful fey flourish'], preferredSilhouettes: ['asymmetrical cloak profile'], visualDetails: ['well-worn songbook', 'roadside tale charms'], weight: 7 },
  { id: 'cursed_lore_singer', label: 'Cursed Lore Singer', buildTemplateId: 'lorekeeper_bard', archetypeTags: ['cursed', 'scholar'], archetypeNames: ['cursed cartographer'], preferredMoods: ['haunted midnight ritual'], preferredLights: ['cold moon rim light'], preferredFx: ['black-violet motes', 'subtle magical runes'], preferredWeapons: ['song-scroll case', 'small spellbook'], preferredArmor: ['travel-worn cloth layers'], preferredPoses: ['tracing a glowing sigil in the air'], preferredSilhouettes: ['lean and sharp-edged'], visualDetails: ['curse-annotated verses', 'black-thread bookmark'], weight: 7 },
  { id: 'court_loremaster', label: 'Court Loremaster', buildTemplateId: 'lorekeeper_bard', archetypeTags: ['noble', 'scholar'], archetypeNames: ['haunted noble heir'], preferredMoods: ['arcane study wonder'], preferredLights: ['blue arcane glyph light'], preferredFx: ['subtle magical runes'], preferredWeapons: ['annotated performance notes', 'rapier with jeweled guard'], preferredArmor: ['travel cloak over leather'], preferredPoses: ['duelist turn with one foot sliding back'], preferredSilhouettes: ['asymmetrical cloak profile'], visualDetails: ['court genealogy scroll', 'velvet archive sash'], weight: 6 },
  { id: 'divine_archivist', label: 'Divine Archivist', buildTemplateId: 'divine_scholar', archetypeTags: ['cartographer', 'scholar', 'holy'], archetypeNames: ['cursed cartographer', 'clockwork scholar'], preferredMoods: ['arcane study wonder', 'radiant temple resolve'], preferredLights: ['candlelit map glow'], preferredFx: ['map glow lines', 'subtle magical runes'], preferredWeapons: ['annotated map and compass', 'scroll case and compass', 'holy book and ritual staff'], preferredArmor: ['travel-worn cloth layers', 'embroidered arcane robes'], preferredPoses: ['studying a map under candlelight', 'ritual prep around carefully arranged instruments'], preferredSilhouettes: ['asymmetrical cloak profile', 'gadget-laden workshop silhouette'], visualDetails: ['indexed holy maps', 'ribboned archive keys'], weight: 4 },
];


type VariantSeed = WeightedOption<Omit<VisualThemeVariant, 'visualThemeId'>>;

const explicitVisualThemeVariants: Record<string, VariantSeed[]> = {
  battle_chaplain: [
    { id: 'field_priest', label: 'Field Priest', visualDetails: ['mud-stained prayer book', 'triage prayer tags', 'field altar cord'], promptFragments: ['reads as a field priest tending soldiers between charges'], preferredFx: ['prayer ribbons', 'holy glow', 'glowing dust'], weight: 8 },
    { id: 'siege_chaplain', label: 'Siege Chaplain', visualDetails: ['stone-dust tabard', 'siege bell token', 'broken wall rosary'], promptFragments: ['carries the weight of prayers spoken under siege'], preferredFx: ['sun motes', 'sacred sparks', 'torn banners in battlefield smoke'], weight: 8 },
    { id: 'grave_chaplain', label: 'Grave Chaplain', visualDetails: ['grave soil on greaves', 'mourning cord', 'last-rites parchment'], promptFragments: ['feels like a chaplain who remembers every fallen name'], preferredFx: ['spectral feathers', 'glowing dust', 'candle smoke'], weight: 8 },
  ],
  void_oracle: [
    { id: 'starless_prophet', label: 'Starless Prophet', visualDetails: ['starless veil', 'black prophecy beads', 'eclipsed eye paint'], promptFragments: ['suggests prophecies from a sky with no stars'], preferredFx: ['drifting void ash', 'black-violet sparks', 'black-violet motes'], weight: 8 },
    { id: 'abyssal_medium', label: 'Abyssal Medium', visualDetails: ['bone listening charms', 'spirit-scratched cuffs', 'hollow silver bell'], promptFragments: ['seems to translate whispers from an abyssal presence'], preferredFx: ['gravity distortions', 'void glow', 'black-violet motes'], weight: 8 },
    { id: 'dream_interpreter', label: 'Dream Interpreter', visualDetails: ['nightmare journal', 'sleepwalking chalk marks', 'oneiric lens'], promptFragments: ['looks like someone mapping other people’s nightmares'], preferredFx: ['fragmented stars', 'drifting void ash', 'void glow'], weight: 8 },
  ],
  archive_performer: [
    { id: 'traveling_storyteller', label: 'Traveling Storyteller', visualDetails: ['road-worn song tabs', 'margin-doodle map', 'patched recital cloak'], promptFragments: ['turns road stories into living archive songs'], preferredFx: ['paper glyph flutter', 'subtle magical runes', 'floating embers'], weight: 8 },
    { id: 'royal_chronicler', label: 'Royal Chronicler', visualDetails: ['court seal ribbons', 'genealogy ink notes', 'polished recital clasp'], promptFragments: ['records dynastic secrets as performance'], preferredFx: ['subtle magical runes', 'ink sparks', 'map glow lines'], weight: 8 },
    { id: 'forbidden_loremaster', label: 'Forbidden Loremaster', visualDetails: ['redacted verse slips', 'black-thread index tags', 'locked chorus folio'], promptFragments: ['performs lore that was supposed to stay sealed'], preferredFx: ['black-violet motes', 'ink sparks', 'paper glyph flutter'], weight: 8 },
  ],
};

function defaultVisualThemeVariants(theme: VisualTheme): VariantSeed[] {
  return [
    { id: `${theme.id}_wanderer`, label: `${theme.label} Wanderer`, visualDetails: [`travel-marked ${theme.label.toLowerCase()} token`, 'weathered kit straps', 'personal road charm'], promptFragments: [`adds a road-worn ${theme.label.toLowerCase()} variation`], preferredFx: theme.preferredFx, weight: 7 },
    { id: `${theme.id}_veteran`, label: `${theme.label} Veteran`, visualDetails: [`scarred ${theme.label.toLowerCase()} keepsake`, 'repaired costume seams', 'old field marks'], promptFragments: [`adds a veteran ${theme.label.toLowerCase()} variation`], preferredFx: theme.preferredFx, weight: 7 },
    { id: `${theme.id}_omenspeaker`, label: `${theme.label} Omenspeaker`, visualDetails: [`omen-marked ${theme.label.toLowerCase()} charm`, 'symbolic thread knots', 'quiet ritual token'], promptFragments: [`adds an omen-touched ${theme.label.toLowerCase()} variation`], preferredFx: theme.preferredFx, weight: 7 },
  ];
}

export const visualThemeVariants: Array<WeightedOption<VisualThemeVariant>> = visualThemes.flatMap((theme) => {
  const variants = explicitVisualThemeVariants[theme.id] ?? defaultVisualThemeVariants(theme);
  return variants.map((variant) => ({ ...variant, visualThemeId: theme.id }));
});



export const fantasyPillars: FantasyPillar[] = [
  { id: 'warrior', label: 'Warrior', description: 'Readable martial force, battlefield command, weapons-first identity.' },
  { id: 'scholar', label: 'Scholar', description: 'Books, maps, runes, research tools, and learned precision.' },
  { id: 'explorer', label: 'Explorer', description: 'Road-worn travel, tracking gear, relic routes, and survival tools.' },
  { id: 'mystic', label: 'Mystic', description: 'Prophecy, dreams, stars, ritual geometry, and uncanny insight.' },
  { id: 'divine', label: 'Divine', description: 'Sacred armor, relics, prayer items, radiant or funerary iconography.' },
  { id: 'shadow', label: 'Shadow', description: 'Stealth silhouettes, theft gear, urban grit, contracts, and hidden tools.' },
  { id: 'fey', label: 'Fey', description: 'Living fabrics, floral geometry, moonlit ornament, and trickster elegance.' },
  { id: 'noble', label: 'Noble', description: 'Heraldry, court tokens, signets, polished textiles, and inherited status.' },
  { id: 'primal', label: 'Primal', description: 'Hide, bone, trophies, scars, beasts, and raw wilderness power.' },
  { id: 'occult', label: 'Occult', description: 'Pacts, omens, void marks, forbidden relics, and unsettling talismans.' },
  { id: 'artificer', label: 'Artificer', description: 'Devices, tools, brass fittings, clockwork, and engineered magic.' },
  { id: 'maritime', label: 'Maritime', description: 'Salt-worn gear, ropes, sea charts, storm relics, and nautical fasteners.' },
];

export const themeVisualProfiles: ThemeVisualProfile[] = [
  { themeId: 'void_oracle', fantasyPillarId: 'occult', visualFantasy: 'Looks like someone who knows something no mortal should know.', visualMotifIds: ['eclipse_motif'], detailPoolIds: ['void_oracle'], armorLanguageIds: ['void_oracle_robes', 'academy_robes'], weaponLanguageIds: ['void_orb_focus', 'academy_spell_staff'], classBias: ['warlock', 'sorcerer', 'wizard'], companionBias: ['minor', 'major', 'legendary'] },
  { themeId: 'star_seer', fantasyPillarId: 'mystic', visualFantasy: 'Reads as a calm astrologer whose clothing maps the sky.', visualMotifIds: ['eclipse_motif', 'rune_motif'], detailPoolIds: ['void_oracle', 'academy_mage'], armorLanguageIds: ['academy_robes', 'void_oracle_robes'], weaponLanguageIds: ['void_orb_focus', 'academy_spell_staff'], classBias: ['wizard', 'sorcerer', 'warlock'] },
  { themeId: 'ritualist', fantasyPillarId: 'mystic', visualFantasy: 'Looks like a prepared ritual caster surrounded by tools and circles.', visualMotifIds: ['rune_motif', 'eclipse_motif'], detailPoolIds: ['academy_mage', 'void_oracle'], armorLanguageIds: ['academy_robes', 'void_oracle_robes'], weaponLanguageIds: ['academy_spell_staff', 'void_orb_focus'], classBias: ['wizard', 'warlock', 'cleric'] },
  { themeId: 'academy_mage', fantasyPillarId: 'scholar', visualFantasy: 'Looks competent, educated, precise, and connected to an arcane institution.', visualMotifIds: ['rune_motif'], detailPoolIds: ['academy_mage'], armorLanguageIds: ['academy_robes'], weaponLanguageIds: ['academy_spell_staff'], classBias: ['wizard', 'sorcerer', 'bard'] },
  { themeId: 'divine_archivist', fantasyPillarId: 'scholar', visualFantasy: 'Looks like a sacred researcher guarding dangerous records.', visualMotifIds: ['rune_motif', 'cathedral_motif'], detailPoolIds: ['academy_mage', 'grave_warden'], armorLanguageIds: ['academy_robes', 'gravewarden_mail'], weaponLanguageIds: ['academy_spell_staff', 'reliquary_warhammer'], classBias: ['cleric', 'wizard'] },
  { themeId: 'trail_warden', fantasyPillarId: 'explorer', visualFantasy: 'Looks like someone who survives long roads and reads the wilderness quickly.', visualMotifIds: ['beast_motif'], detailPoolIds: ['trail_warden', 'monster_tracker'], armorLanguageIds: ['hunter_leather', 'battle_worn_frontier_plate'], weaponLanguageIds: ['ranger_bone_bow', 'dragon_hunter_blade'], classBias: ['ranger', 'druid', 'fighter'], companionBias: ['minor', 'major', 'legendary'] },
  { themeId: 'beast_slayer', fantasyPillarId: 'primal', visualFantasy: 'Looks like someone whose body and gear record brutal monster hunts.', visualMotifIds: ['beast_motif'], detailPoolIds: ['monster_tracker'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['dragon_hunter_blade', 'ranger_bone_bow'], classBias: ['barbarian', 'ranger', 'fighter'], companionBias: ['minor', 'major'] },
  { themeId: 'monster_slayer_veteran', fantasyPillarId: 'warrior', visualFantasy: 'Looks like a professional veteran of impossible hunts.', visualMotifIds: ['beast_motif'], detailPoolIds: ['monster_tracker', 'mercenary_captain'], armorLanguageIds: ['battle_worn_frontier_plate', 'hunter_leather'], weaponLanguageIds: ['dragon_hunter_blade'], classBias: ['fighter', 'ranger'] },
  { themeId: 'grave_warden', fantasyPillarId: 'divine', visualFantasy: 'Looks like a guardian standing between the living and the dead.', visualMotifIds: ['cathedral_motif'], detailPoolIds: ['grave_warden'], armorLanguageIds: ['gravewarden_mail', 'ceremonial_sun_plate'], weaponLanguageIds: ['reliquary_warhammer'], classBias: ['cleric', 'paladin'], companionBias: ['minor', 'major'] },
  { themeId: 'battle_chaplain', fantasyPillarId: 'divine', visualFantasy: 'Looks like battlefield faith made practical and armored.', visualMotifIds: ['cathedral_motif'], detailPoolIds: ['battle_chaplain', 'mercenary_captain'], armorLanguageIds: ['gravewarden_mail', 'ceremonial_sun_plate'], weaponLanguageIds: ['reliquary_warhammer'], classBias: ['cleric', 'paladin', 'fighter'], companionBias: ['minor', 'major'] },
  { themeId: 'sun_knight', fantasyPillarId: 'divine', visualFantasy: 'Looks like a radiant champion built around sacred courage.', visualMotifIds: ['cathedral_motif'], detailPoolIds: ['battle_chaplain'], armorLanguageIds: ['ceremonial_sun_plate'], weaponLanguageIds: ['reliquary_warhammer'], classBias: ['paladin', 'cleric'] },
  { themeId: 'relic_thief', fantasyPillarId: 'shadow', visualFantasy: 'Looks like someone who steals objects that should be in museums.', visualMotifIds: ['rune_motif'], detailPoolIds: ['relic_thief'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['fey_cane_sword', 'academy_spell_staff'], classBias: ['rogue', 'ranger', 'bard'] },
  { themeId: 'bounty_hunter', fantasyPillarId: 'shadow', visualFantasy: 'Looks practical, dangerous, and paid to find people who hide.', visualMotifIds: ['beast_motif'], detailPoolIds: ['monster_tracker', 'relic_thief'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['dragon_hunter_blade', 'ranger_bone_bow'], classBias: ['rogue', 'ranger', 'fighter'] },
  { themeId: 'urban_assassin', fantasyPillarId: 'shadow', visualFantasy: 'Reads as a precise city killer with concealed tools.', visualMotifIds: ['rune_motif'], detailPoolIds: ['relic_thief'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['fey_cane_sword'], classBias: ['rogue'] },
  { themeId: 'pirate_raider', fantasyPillarId: 'maritime', visualFantasy: 'Looks salt-worn, dangerous, and loaded with sea relics.', visualMotifIds: ['nautical_motif'], detailPoolIds: ['pirate_raider', 'relic_thief'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['dragon_hunter_blade', 'mechanical_tool_focus'], classBias: ['rogue', 'artificer', 'bard'] },
  { themeId: 'fey_noble', fantasyPillarId: 'fey', visualFantasy: 'Looks like courtly beauty from a realm with different rules.', visualMotifIds: ['thorn_motif'], detailPoolIds: ['fey_noble'], armorLanguageIds: ['fey_court_garb'], weaponLanguageIds: ['fey_cane_sword'], classBias: ['bard', 'warlock', 'druid'], raceBias: ['fairy', 'satyr', 'elf'], companionBias: ['minor', 'major', 'legendary'] },
  { themeId: 'moonlit_duelist', fantasyPillarId: 'fey', visualFantasy: 'Looks elegant, fast, and dangerous under moonlight.', visualMotifIds: ['thorn_motif'], detailPoolIds: ['fey_noble'], armorLanguageIds: ['fey_court_garb'], weaponLanguageIds: ['fey_cane_sword'], classBias: ['bard', 'rogue', 'warlock'] },
  { themeId: 'forest_sprite', fantasyPillarId: 'fey', visualFantasy: 'Looks playful, wild, and surrounded by living forest texture.', visualMotifIds: ['thorn_motif'], detailPoolIds: ['fey_noble'], armorLanguageIds: ['fey_court_garb'], weaponLanguageIds: ['fey_cane_sword'], classBias: ['druid', 'bard'] },
  { themeId: 'mercenary_captain', fantasyPillarId: 'warrior', visualFantasy: 'Looks like a battlefield leader with contracts and command gear.', visualMotifIds: ['cathedral_motif'], detailPoolIds: ['mercenary_captain'], armorLanguageIds: ['battle_worn_frontier_plate'], weaponLanguageIds: ['dragon_hunter_blade'], classBias: ['fighter'] },
  { themeId: 'arena_champion', fantasyPillarId: 'warrior', visualFantasy: 'Looks like a public fighter whose scars became reputation.', visualMotifIds: ['beast_motif'], detailPoolIds: ['mercenary_captain', 'monster_tracker'], armorLanguageIds: ['battle_worn_frontier_plate'], weaponLanguageIds: ['dragon_hunter_blade'], classBias: ['fighter', 'barbarian'] },
  { themeId: 'royal_guard', fantasyPillarId: 'noble', visualFantasy: 'Looks disciplined, formal, and sworn to protect a seat of power.', visualMotifIds: ['cathedral_motif'], detailPoolIds: ['mercenary_captain'], armorLanguageIds: ['ceremonial_sun_plate'], weaponLanguageIds: ['dragon_hunter_blade'], classBias: ['fighter', 'paladin'] },
  { themeId: 'clockwork_sapper', fantasyPillarId: 'artificer', visualFantasy: 'Looks like a combat engineer built from tools, brass, and sparks.', visualMotifIds: ['rune_motif'], detailPoolIds: ['academy_mage', 'mercenary_captain'], armorLanguageIds: ['battle_worn_frontier_plate'], weaponLanguageIds: ['mechanical_tool_focus', 'academy_spell_staff'], classBias: ['artificer'], companionBias: ['minor', 'legendary'] },
  { themeId: 'tribal_champion', fantasyPillarId: 'primal', visualFantasy: 'Looks like a clan champion carrying trophies and scars.', visualMotifIds: ['beast_motif'], detailPoolIds: ['monster_tracker'], armorLanguageIds: ['hunter_leather'], weaponLanguageIds: ['dragon_hunter_blade'], classBias: ['barbarian'] },
];

export const visualMotifs: VisualMotif[] = [
  { id: 'eclipse_motif', label: 'Eclipse Motif', compatibleThemes: ['void_oracle', 'star_seer', 'dream_walker'], compatibleBuildTemplates: ['arcane_caster'], shapes: ['crescent shapes', 'orbital rings', 'partial circles', 'black sun symbols'], materials: ['obsidian', 'black crystal', 'tarnished silver'], ornamentDetails: ['orbiting crescent ornaments', 'black sun symbols woven into the outfit'], promptFragments: ['repeating eclipse geometry', 'orbiting crescent ornaments', 'black sun symbols woven into the outfit'] },
  { id: 'cathedral_motif', label: 'Cathedral Motif', compatibleThemes: ['grave_warden', 'sun_knight', 'battle_chaplain', 'wandering_healer', 'royal_guard'], compatibleBuildTemplates: ['holy_warrior', 'martial_veteran'], shapes: ['arches', 'stained glass geometry', 'sacred vertical lines'], materials: ['polished brass', 'pale stone', 'stained glass'], ornamentDetails: ['sacred arch patterns on armor', 'stained-glass inspired trim'], promptFragments: ['cathedral-like ornamentation', 'stained-glass inspired trim', 'sacred arch patterns on armor'] },
  { id: 'beast_motif', label: 'Beast Motif', compatibleThemes: ['monster_tracker', 'beast_slayer', 'tribal_champion', 'trail_warden', 'monster_slayer_veteran', 'arena_champion'], compatibleBuildTemplates: ['frontier_hunter', 'savage_berserker', 'martial_veteran'], shapes: ['fang patterns', 'claw geometry', 'bone ornamentation'], materials: ['bone', 'hide', 'leather', 'horn'], ornamentDetails: ['fang-shaped ornaments', 'bone trophies integrated into gear'], promptFragments: ['fang-shaped ornaments', 'bone trophies integrated into gear', 'claw-mark patterns across armor'] },
  { id: 'nautical_motif', label: 'Nautical Motif', compatibleThemes: ['pirate_raider', 'relic_diver', 'storm_sailor'], compatibleBuildTemplates: ['shadow_skirmisher', 'battle_engineer', 'lorekeeper_bard'], shapes: ['ropes', 'anchors', 'wave patterns', 'knots'], materials: ['weathered brass', 'soaked leather', 'salt-stained cloth'], ornamentDetails: ['rope knots', 'nautical fasteners'], promptFragments: ['rope knots and nautical fasteners', 'salt-worn equipment', 'wave-pattern embroidery'] },
  { id: 'rune_motif', label: 'Rune Motif', compatibleThemes: ['rune_scholar', 'academy_mage', 'battle_mage', 'arcane_caster', 'ritualist', 'divine_archivist', 'relic_thief', 'clockwork_sapper'], compatibleBuildTemplates: ['arcane_caster', 'divine_scholar', 'battle_engineer', 'shadow_skirmisher'], shapes: ['angular glyphs', 'geometric seals', 'floating tablets'], materials: ['carved stone', 'glowing ink', 'etched metal'], ornamentDetails: ['floating glyph fragments', 'etched magical formulae'], promptFragments: ['angular rune patterns', 'floating glyph fragments', 'etched magical formulae'] },
  { id: 'thorn_motif', label: 'Thorn Motif', compatibleThemes: ['fey_noble', 'forest_sprite', 'fey_trickster', 'moonlit_duelist', 'wandering_bard'], compatibleBuildTemplates: ['fey_trickster', 'lorekeeper_bard'], shapes: ['thorn curls', 'flower geometry', 'vine spirals'], materials: ['living wood', 'moonlit silver', 'glowing petals'], ornamentDetails: ['thorn-like ornamentation', 'living vine trim'], promptFragments: ['thorn-like ornamentation', 'living vine trim', 'moonlit floral patterns'] },
];

export const armorLanguages: ArmorLanguage[] = [
  { id: 'battle_worn_frontier_plate', label: 'Battle-Worn Frontier Plate', armorCategory: ['medium', 'heavy', 'metal'], compatibleBuildTemplates: ['frontier_hunter', 'martial_veteran', 'holy_warrior'], compatibleThemes: ['trail_warden', 'monster_slayer_veteran', 'mercenary_captain', 'arena_champion'], promptFragments: ['dented campaign plates', 'leather repairs', 'mud-stained lower armor'], detailHints: ['dented campaign plates', 'leather repairs', 'mud-stained lower armor'] },
  { id: 'ceremonial_sun_plate', label: 'Ceremonial Sun Plate', armorCategory: ['medium', 'heavy', 'metal'], compatibleBuildTemplates: ['holy_warrior', 'martial_veteran'], compatibleThemes: ['sun_knight', 'battle_chaplain', 'royal_guard'], promptFragments: ['radiant trim', 'polished gold accents', 'sunburst engravings'], detailHints: ['radiant trim', 'polished gold accents', 'sunburst engravings'] },
  { id: 'gravewarden_mail', label: 'Gravewarden Mail', armorCategory: ['medium', 'heavy', 'metal'], compatibleBuildTemplates: ['holy_warrior', 'divine_scholar'], compatibleThemes: ['grave_warden', 'battle_chaplain', 'divine_archivist'], promptFragments: ['blackened chain links', 'funeral charms', 'ash-stained tabard'], detailHints: ['blackened chain links', 'funeral charms', 'ash-stained tabard'] },
  { id: 'academy_robes', label: 'Academy Robes', armorCategory: ['cloth', 'none'], compatibleBuildTemplates: ['arcane_caster', 'divine_scholar', 'lorekeeper_bard'], compatibleThemes: ['academy_mage', 'ritualist', 'divine_archivist', 'star_seer'], promptFragments: ['embroidered arcane trim', 'academy insignia', 'ink-stained cuffs'], detailHints: ['embroidered arcane trim', 'academy insignia', 'ink-stained cuffs'] },
  { id: 'void_oracle_robes', label: 'Void Oracle Robes', armorCategory: ['cloth', 'none'], compatibleBuildTemplates: ['arcane_caster'], compatibleThemes: ['void_oracle', 'star_seer', 'ritualist'], promptFragments: ['starless embroidery', 'torn prophetic cloth strips', 'black-thread fasteners'], detailHints: ['starless embroidery', 'torn prophetic cloth strips', 'black-thread fasteners'] },
  { id: 'hunter_leather', label: 'Hunter Leather', armorCategory: ['light', 'medium', 'natural'], compatibleBuildTemplates: ['frontier_hunter', 'shadow_skirmisher', 'savage_berserker'], compatibleThemes: ['trail_warden', 'beast_slayer', 'bounty_hunter', 'relic_thief', 'swamp_tracker'], promptFragments: ['reinforced shoulder hide', 'trophy loops', 'survival stitching'], detailHints: ['reinforced shoulder hide', 'trophy loops', 'survival stitching'] },
  { id: 'fey_court_garb', label: 'Fey Court Garb', armorCategory: ['cloth', 'light'], compatibleBuildTemplates: ['fey_trickster', 'lorekeeper_bard'], compatibleThemes: ['fey_noble', 'moonlit_duelist', 'forest_sprite', 'wandering_bard'], promptFragments: ['impossible fabric folds', 'living floral accents', 'moonlit silk ribbons'], detailHints: ['impossible fabric folds', 'living floral accents', 'moonlit silk ribbons'] },
];

export const weaponLanguages: WeaponLanguage[] = [
  { id: 'dragon_hunter_blade', label: 'Dragon Hunter Blade', baseWeaponTags: ['martial', 'greatsword', 'spear', 'handaxe', 'dual-blades'], compatibleBuildTemplates: ['martial_veteran', 'frontier_hunter', 'savage_berserker'], compatibleThemes: ['monster_slayer_veteran', 'arena_champion', 'beast_slayer', 'trail_warden'], promptFragments: ['heavy blade with scale marks', 'dragonbone grip', 'heat-blackened edge'], detailHints: ['scale marks', 'dragonbone grip', 'heat-blackened edge'] },
  { id: 'reliquary_warhammer', label: 'Reliquary Warhammer', baseWeaponTags: ['warhammer', 'mace', 'holy-focus', 'shield', 'staff'], compatibleBuildTemplates: ['holy_warrior', 'divine_scholar'], compatibleThemes: ['grave_warden', 'sun_knight', 'battle_chaplain', 'divine_archivist'], promptFragments: ['sacred relic chamber inside the weapon', 'prayer strips', 'old temple metal'], detailHints: ['relic chamber', 'prayer strips', 'old temple metal'] },
  { id: 'academy_spell_staff', label: 'Academy Spell Staff', baseWeaponTags: ['staff', 'wand', 'book', 'magic-focus', 'scroll'], compatibleBuildTemplates: ['arcane_caster', 'divine_scholar', 'lorekeeper_bard'], compatibleThemes: ['academy_mage', 'ritualist', 'star_seer', 'divine_archivist'], promptFragments: ['polished wood', 'measuring rings', 'academy seal'], detailHints: ['polished wood', 'measuring rings', 'academy seal'] },
  { id: 'void_orb_focus', label: 'Void Orb Focus', baseWeaponTags: ['orb', 'magic-focus', 'wand', 'book'], compatibleBuildTemplates: ['arcane_caster'], compatibleThemes: ['void_oracle', 'star_seer', 'ritualist'], promptFragments: ['black crystal core', 'orbiting fragments', 'thread-wrapped handle'], detailHints: ['black crystal core', 'orbiting fragments', 'thread-wrapped handle'] },
  { id: 'ranger_bone_bow', label: 'Ranger Bone Bow', baseWeaponTags: ['bow', 'shortbow', 'longbow', 'spear'], compatibleBuildTemplates: ['frontier_hunter', 'shadow_skirmisher'], compatibleThemes: ['trail_warden', 'monster_slayer_veteran', 'bounty_hunter', 'swamp_tracker'], promptFragments: ['horn-backed bow', 'bone charms', 'notched grip'], detailHints: ['horn-backed bow', 'bone charms', 'notched grip'] },
  { id: 'fey_cane_sword', label: 'Fey Cane Sword', baseWeaponTags: ['rapier', 'dagger', 'fey-focus', 'instrument', 'flute'], compatibleBuildTemplates: ['fey_trickster', 'lorekeeper_bard', 'shadow_skirmisher'], compatibleThemes: ['fey_noble', 'moonlit_duelist', 'wandering_bard', 'relic_thief'], promptFragments: ['thorn engraving', 'moonlit metal', 'hidden blade line'], detailHints: ['thorn engraving', 'moonlit metal', 'hidden blade line'] },
  { id: 'mechanical_tool_focus', label: 'Mechanical Tool Focus', baseWeaponTags: ['tool', 'mechanical-focus', 'mechanical-weapon', 'magic-focus'], compatibleBuildTemplates: ['battle_engineer'], compatibleThemes: ['clockwork_sapper', 'pirate_raider'], promptFragments: ['a practical arcane tool focus with brass calipers and sparking mechanisms'], detailHints: ['brass calibrator rings', 'sparking wrench head'] },
  { id: 'monastic_focus', label: 'Monastic Focus', baseWeaponTags: ['unarmed', 'staff', 'spear', 'simple'], compatibleBuildTemplates: ['wandering_martial_artist'], compatibleThemes: ['temple_guardian', 'silent_avenger', 'mountain_hermit', 'wandering_master', 'dragon_style_adept'], promptFragments: ['a disciplined monk focus of wraps, prayer beads, and simple weapons'], detailHints: ['worn hand wraps', 'smooth prayer beads'] },
];

function makeSilhouette(id: string, label: string, category: SilhouetteCategory, templates: string[], themes: string[], sizes: SizeCategory[], description: string, weight = 5): SilhouetteProfile {
  return { id, label, category, compatibleBuildTemplates: templates, compatibleThemes: themes, compatibleSizes: sizes, visualDescription: description, promptFragment: description, weight };
}

export const silhouetteProfiles: SilhouetteProfile[] = [
  makeSilhouette('bastion', 'Bastion', 'martial', ['martial_veteran', 'holy_warrior'], ['royal_guard', 'battle_chaplain'], ['medium', 'large'], 'a firm shield-ready martial silhouette'),
  makeSilhouette('oathbearer', 'Oathbearer', 'vertical', ['holy_warrior'], ['sun_knight', 'battle_chaplain'], ['small', 'medium', 'large'], 'upright sacred profile with oath symbols'),
  makeSilhouette('broken_veteran', 'Broken Veteran', 'asymmetrical', ['martial_veteran', 'holy_warrior'], ['veteran_officer', 'fallen_saint'], ['small', 'medium', 'large'], 'asymmetrical veteran silhouette with damaged gear'),
  makeSilhouette('beast_hunter', 'Beast Hunter', 'martial', ['frontier_hunter', 'martial_veteran'], ['trail_warden', 'monster_slayer_veteran', 'beast_slayer'], ['small', 'medium', 'large'], 'hunter profile with trophies and long travel gear'),
  makeSilhouette('duel_saint', 'Duel Saint', 'martial', ['fey_trickster', 'holy_warrior'], ['moonlit_duelist', 'sun_knight'], ['small', 'medium'], 'slender duelist profile with sacred or fey linework'),
  makeSilhouette('banner_commander', 'Banner Commander', 'wide', ['martial_veteran', 'holy_warrior'], ['mercenary_captain', 'battle_chaplain'], ['medium', 'large'], 'command silhouette widened by a torn banner'),
  makeSilhouette('arena_colossus', 'Arena Colossus', 'wide', ['martial_veteran', 'savage_berserker'], ['arena_champion', 'raider_king'], ['medium', 'large'], 'massive public-fighter silhouette built for spectacle'),
  makeSilhouette('siege_breaker_profile', 'Siege Breaker Profile', 'wide', ['martial_veteran', 'savage_berserker'], ['arena_champion', 'storm_warrior'], ['medium', 'large'], 'wide breaker profile with heavy weapon emphasis'),
  makeSilhouette('royal_guard_column', 'Royal Guard Column', 'vertical', ['martial_veteran', 'holy_warrior'], ['royal_guard', 'sun_knight'], ['medium', 'large'], 'formal vertical guard silhouette'),
  makeSilhouette('mercenary_cloak_profile', 'Mercenary Cloak Profile', 'asymmetrical', ['martial_veteran'], ['mercenary_captain', 'veteran_officer'], ['small', 'medium', 'large'], 'cloak-and-command profile with practical gear'),
  makeSilhouette('walking_observatory', 'Walking Observatory', 'caster', ['arcane_caster'], ['star_seer', 'void_oracle'], ['medium', 'large'], 'caster silhouette ringed by astronomy tools'),
  makeSilhouette('living_library', 'Living Library', 'caster', ['arcane_caster', 'divine_scholar'], ['academy_mage', 'divine_archivist'], ['small', 'medium', 'large'], 'book-heavy silhouette with floating pages'),
  makeSilhouette('eclipse_oracle', 'Eclipse Oracle', 'caster', ['arcane_caster'], ['void_oracle', 'star_seer'], ['small', 'medium', 'large'], 'ritual caster silhouette framed by eclipse geometry'),
  makeSilhouette('rune_architect', 'Rune Architect', 'caster', ['arcane_caster', 'battle_engineer'], ['academy_mage', 'clockwork_sapper'], ['small', 'medium', 'large'], 'angular caster profile made of tools and glyphs'),
  makeSilhouette('arcane_duelist', 'Arcane Duelist', 'asymmetrical', ['arcane_caster', 'fey_trickster'], ['battle_mage', 'moonlit_duelist'], ['small', 'medium'], 'one-handed duelist caster profile'),
  makeSilhouette('spell_scroll_cascade', 'Spell Scroll Cascade', 'caster', ['arcane_caster', 'divine_scholar'], ['academy_mage', 'ritualist'], ['small', 'medium'], 'cascade of scrolls around a compact caster'),
  makeSilhouette('star_seer_column', 'Star Seer Column', 'vertical', ['arcane_caster'], ['star_seer'], ['medium', 'large'], 'tall calm column marked with constellations'),
  makeSilhouette('ritual_circle_bearer', 'Ritual Circle Bearer', 'relic', ['arcane_caster', 'divine_scholar'], ['ritualist', 'divine_archivist'], ['small', 'medium', 'large'], 'figure carrying a visible ritual circle motif'),
  makeSilhouette('floating_grimoire_profile', 'Floating Grimoire Profile', 'caster', ['arcane_caster'], ['academy_mage', 'void_oracle'], ['small', 'medium', 'large'], 'caster with a hovering grimoire as a second read'),
  makeSilhouette('battle_mage_vanguard', 'Battle Mage Vanguard', 'martial', ['arcane_caster'], ['battle_mage'], ['medium', 'large'], 'forward battlefield caster silhouette'),
  makeSilhouette('long_road_walker', 'Long Road Walker', 'asymmetrical', ['frontier_hunter'], ['trail_warden'], ['small', 'medium', 'large'], 'travel cloak and road-pack explorer shape'),
  makeSilhouette('expedition_leader', 'Expedition Leader', 'relic', ['frontier_hunter', 'divine_scholar'], ['trail_warden', 'relic_thief'], ['small', 'medium', 'large'], 'leader profile with maps and expedition equipment'),
  makeSilhouette('monster_tracker_profile', 'Monster Tracker Profile', 'martial', ['frontier_hunter', 'shadow_skirmisher'], ['bounty_hunter', 'monster_slayer_veteran'], ['small', 'medium', 'large'], 'low hunter silhouette with trophies and tracking gear'),
  makeSilhouette('falconer_profile', 'Falconer Profile', 'companion', ['frontier_hunter', 'shadow_skirmisher'], ['trail_warden', 'bounty_hunter'], ['small', 'medium', 'large'], 'hunter silhouette with bird companion perch'),
  makeSilhouette('dragon_warden_profile', 'Dragon Warden Profile', 'companion', ['frontier_hunter', 'holy_warrior'], ['sun_knight', 'trail_warden'], ['medium', 'large'], 'guardian silhouette paired with a draconic companion'),
  makeSilhouette('rope_and_pack_profile', 'Rope and Pack Profile', 'asymmetrical', ['frontier_hunter', 'shadow_skirmisher'], ['trail_warden', 'relic_thief'], ['small', 'medium', 'large'], 'asymmetrical travel pack profile with rope lines'),
  makeSilhouette('horizon_walker_profile', 'Horizon Walker Profile', 'vertical', ['frontier_hunter'], ['trail_warden'], ['small', 'medium', 'large'], 'long view explorer silhouette pointing toward distance'),
  makeSilhouette('relic_diver_profile', 'Relic Diver Profile', 'relic', ['shadow_skirmisher', 'battle_engineer'], ['pirate_raider', 'relic_thief'], ['medium', 'large'], 'salt-worn relic diver with satchels and coils'),
  makeSilhouette('beastmaster_pair', 'Beastmaster Pair', 'companion', ['frontier_hunter'], ['trail_warden', 'beast_slayer'], ['small', 'medium', 'large'], 'dual silhouette with animal companion'),
  makeSilhouette('mounted_scout', 'Mounted Scout', 'mounted', ['frontier_hunter', 'holy_warrior'], ['trail_warden', 'sun_knight'], ['medium', 'large'], 'mounted or mount-ready scout silhouette'),
  makeSilhouette('living_omen', 'Living Omen', 'caster', ['arcane_caster'], ['void_oracle'], ['small', 'medium', 'large'], 'still occult silhouette surrounded by ominous signs'),
  makeSilhouette('dream_pilgrim', 'Dream Pilgrim', 'vertical', ['arcane_caster'], ['dream_walker', 'void_oracle'], ['small', 'medium', 'large'], 'sleep-walking pilgrim shape with dream haze'),
  makeSilhouette('bound_vessel', 'Bound Vessel', 'asymmetrical', ['arcane_caster', 'fey_trickster'], ['void_oracle', 'moonlit_duelist'], ['small', 'medium'], 'bound magical vessel with wraps and talismans'),
  makeSilhouette('pact_keeper', 'Pact Keeper', 'caster', ['arcane_caster'], ['void_oracle'], ['small', 'medium', 'large'], 'occult focus silhouette with pact marks'),
  makeSilhouette('forbidden_researcher_profile', 'Forbidden Researcher Profile', 'caster', ['arcane_caster', 'divine_scholar'], ['ritualist', 'divine_archivist'], ['small', 'medium', 'large'], 'researcher carrying dangerous texts'),
  makeSilhouette('nightmare_medium', 'Nightmare Medium', 'caster', ['arcane_caster'], ['void_oracle'], ['medium', 'large'], 'medium silhouette pulled upward by dream smoke'),
  makeSilhouette('hollow_prophet', 'Hollow Prophet', 'vertical', ['arcane_caster'], ['void_oracle'], ['medium', 'large'], 'thin prophetic silhouette with empty center line'),
  makeSilhouette('shadow_chained_vessel', 'Shadow-Chained Vessel', 'asymmetrical', ['arcane_caster', 'shadow_skirmisher'], ['void_oracle', 'urban_assassin'], ['medium', 'large'], 'shadow-bound figure with chain shapes'),
  makeSilhouette('omen_bell_bearer', 'Omen Bell Bearer', 'relic', ['arcane_caster', 'holy_warrior'], ['void_oracle', 'grave_warden'], ['small', 'medium', 'large'], 'relic-bearing profile marked by an omen bell'),
  makeSilhouette('mirror_oracle', 'Mirror Oracle', 'relic', ['arcane_caster'], ['void_oracle', 'star_seer'], ['small', 'medium', 'large'], 'oracle with cracked mirror as strong secondary shape'),
  makeSilhouette('reliquary_bearer', 'Reliquary Bearer', 'relic', ['holy_warrior', 'divine_scholar'], ['battle_chaplain', 'divine_archivist'], ['small', 'medium', 'large'], 'sacred relic carried as the main silhouette break'),
  makeSilhouette('lantern_warden', 'Lantern Warden', 'relic', ['holy_warrior'], ['grave_warden'], ['small', 'medium', 'large'], 'grave lantern silhouette with pale flame'),
  makeSilhouette('sun_champion', 'Sun Champion', 'vertical', ['holy_warrior'], ['sun_knight'], ['medium', 'large'], 'radiant vertical silhouette crowned by sun rays'),
  makeSilhouette('pilgrim_medic', 'Pilgrim Medic', 'asymmetrical', ['holy_warrior'], ['wandering_healer'], ['small', 'medium', 'large'], 'pilgrim healer profile with satchels'),
  makeSilhouette('grave_watcher', 'Grave Watcher', 'vertical', ['holy_warrior'], ['grave_warden'], ['small', 'medium', 'large'], 'solemn grave watch profile'),
  makeSilhouette('funeral_knight_profile', 'Funeral Knight Profile', 'martial', ['holy_warrior'], ['grave_warden', 'fallen_saint'], ['medium', 'large'], 'armored funeral knight silhouette'),
  makeSilhouette('battle_chaplain_profile', 'Battle Chaplain Profile', 'martial', ['holy_warrior'], ['battle_chaplain'], ['small', 'medium', 'large'], 'worn armored priest silhouette'),
  makeSilhouette('relic_shield_bearer', 'Relic Shield Bearer', 'relic', ['holy_warrior'], ['sun_knight', 'battle_chaplain'], ['medium', 'large'], 'shield-first profile with reliquary shape'),
  makeSilhouette('saint_with_banners', 'Saint with Banners', 'wide', ['holy_warrior'], ['sun_knight', 'battle_chaplain'], ['medium', 'large'], 'saintly wide silhouette framed by banners'),
  makeSilhouette('temple_exorcist', 'Temple Exorcist', 'asymmetrical', ['holy_warrior', 'wandering_martial_artist'], ['temple_guardian', 'grave_warden'], ['small', 'medium', 'large'], 'ritual exorcist with relics and motion'),
  makeSilhouette('compact_martial_stance', 'Compact Martial Stance', 'small', ['martial_veteran', 'wandering_martial_artist', 'savage_berserker'], [], ['tiny', 'small'], 'compact martial stance scaled for small bodies'),
  makeSilhouette('small_cloak_and_staff', 'Small Cloak and Staff', 'small', ['arcane_caster', 'divine_scholar', 'wandering_martial_artist'], [], ['tiny', 'small'], 'small cloaked figure with clear staff read'),
  makeSilhouette('small_relic_bearer', 'Small Relic Bearer', 'small', ['holy_warrior', 'divine_scholar'], [], ['tiny', 'small'], 'small figure carrying a readable relic'),
  makeSilhouette('compact_beastmaster', 'Compact Beastmaster', 'companion', ['frontier_hunter'], [], ['tiny', 'small'], 'small figure paired with animal companion'),
  makeSilhouette('small_arcane_scholar', 'Small Arcane Scholar', 'small', ['arcane_caster', 'lorekeeper_bard'], [], ['tiny', 'small'], 'small scholarly caster silhouette with book shapes'),
];

function makeCompanion(id: string, label: string, tier: CompanionTier, companionType: CompanionProfile['companionType'], classes: CharacterClass[], templates: string[], themes: string[], sizeImpact: CompanionProfile['sizeImpact'], details: string[], promptFragment: string, weight: number): CompanionProfile {
  return { id, label, tier, companionType, compatibleClasses: classes, compatibleBuildTemplates: templates, compatibleThemes: themes, sizeImpact, visualDetails: details, promptFragment, weight };
}

export const companionProfiles: CompanionProfile[] = [
  makeCompanion('raven', 'raven', 'minor', 'bird', ['warlock', 'wizard', 'rogue', 'ranger'], ['arcane_caster', 'shadow_skirmisher', 'frontier_hunter'], ['void_oracle', 'bounty_hunter', 'trail_warden'], 'small_silhouette', ['black feathers on the shoulder', 'watchful raven eyes'], 'a raven perched nearby', 7),
  makeCompanion('crow', 'crow', 'minor', 'bird', ['rogue', 'warlock'], ['shadow_skirmisher', 'arcane_caster'], ['urban_assassin', 'void_oracle'], 'small_silhouette', ['crow perched on a ruined sign', 'dark feathers near the cloak'], 'a crow watching from the edge of the frame', 6),
  makeCompanion('owl', 'owl', 'minor', 'bird', ['wizard', 'ranger', 'druid'], ['arcane_caster', 'frontier_hunter'], ['academy_mage', 'trail_warden'], 'small_silhouette', ['owl feather charm', 'round-eyed owl perched above'], 'an owl circling overhead', 6),
  makeCompanion('fox', 'fox', 'minor', 'animal', ['bard', 'druid', 'ranger'], ['fey_trickster', 'frontier_hunter'], ['fey_noble', 'forest_sprite', 'trail_warden'], 'small_silhouette', ['fox tracks in dust', 'fox tail peeking from grass'], 'a fox slipping around the boots', 6),
  makeCompanion('ferret', 'ferret', 'minor', 'animal', ['rogue', 'bard'], ['shadow_skirmisher', 'fey_trickster'], ['relic_thief', 'wandering_bard'], 'small_silhouette', ['ferret in a satchel', 'tiny paw prints on the map'], 'a ferret peeking from a satchel', 5),
  makeCompanion('cat', 'cat', 'minor', 'animal', ['wizard', 'bard', 'rogue'], ['arcane_caster', 'lorekeeper_bard', 'shadow_skirmisher'], ['academy_mage', 'court_loremaster', 'urban_assassin'], 'small_silhouette', ['cat curled around loose scrolls', 'green cat eyes in shadow'], 'a cat seated among scrolls', 5),
  makeCompanion('rat', 'rat', 'minor', 'animal', ['rogue', 'warlock'], ['shadow_skirmisher', 'arcane_caster'], ['urban_assassin', 'void_oracle'], 'small_silhouette', ['rat tracks near the boots', 'small rat perched on a crate'], 'a rat moving through the foreground', 4),
  makeCompanion('lizard', 'lizard', 'minor', 'animal', ['druid', 'sorcerer', 'artificer'], ['frontier_hunter', 'arcane_caster', 'battle_engineer'], ['trail_warden', 'battle_mage', 'clockwork_sapper'], 'small_silhouette', ['lizard on a shoulder strap', 'scaled companion curled near tools'], 'a small lizard companion clinging to gear', 4),
  makeCompanion('dream_moth', 'dream moth', 'minor', 'spirit', ['warlock', 'wizard', 'sorcerer'], ['arcane_caster'], ['void_oracle', 'star_seer'], 'small_silhouette', ['moonlit moth wings', 'tiny dream-moth glow'], 'a dream moth floating near the face', 5),
  makeCompanion('prayer_dove', 'prayer dove', 'minor', 'celestial', ['cleric', 'paladin'], ['holy_warrior', 'divine_scholar'], ['sun_knight', 'battle_chaplain', 'grave_warden'], 'small_silhouette', ['white feathers caught in prayer ribbons', 'dove perched on a relic'], 'a prayer dove near the shoulder', 5),
  makeCompanion('clockwork_mouse', 'clockwork mouse', 'minor', 'construct', ['artificer', 'wizard'], ['battle_engineer', 'arcane_caster'], ['clockwork_sapper', 'academy_mage'], 'small_silhouette', ['tiny brass mouse gears', 'clockwork mouse on a belt pouch'], 'a clockwork mouse crawling over gear', 5),
  makeCompanion('wolf', 'wolf', 'major', 'animal', ['ranger', 'druid', 'barbarian'], ['frontier_hunter', 'savage_berserker'], ['trail_warden', 'beast_slayer'], 'dual_silhouette', ['wolf shoulder silhouette', 'wolf tracks beside the boots'], 'a wolf companion beside the character', 7),
  makeCompanion('hound', 'hound', 'major', 'animal', ['fighter', 'ranger', 'rogue'], ['frontier_hunter', 'martial_veteran', 'shadow_skirmisher'], ['bounty_hunter', 'mercenary_captain'], 'dual_silhouette', ['hound leash rings', 'hound guarding the foreground'], 'a loyal hound standing guard', 6),
  makeCompanion('falcon', 'falcon', 'major', 'bird', ['ranger', 'fighter', 'rogue'], ['frontier_hunter', 'shadow_skirmisher'], ['trail_warden', 'bounty_hunter'], 'dual_silhouette', ['falcon hood on belt', 'falcon perched on raised arm'], 'a falcon perched on the raised arm', 6),
  makeCompanion('eagle', 'eagle', 'major', 'bird', ['ranger', 'paladin'], ['frontier_hunter', 'holy_warrior'], ['trail_warden', 'sun_knight'], 'dual_silhouette', ['eagle feather mantle', 'eagle wings framing the figure'], 'an eagle companion circling above', 5),
  makeCompanion('panther', 'panther', 'major', 'animal', ['ranger', 'rogue', 'druid'], ['frontier_hunter', 'shadow_skirmisher'], ['bounty_hunter', 'swamp_tracker'], 'dual_silhouette', ['panther shadow at the feet', 'black fur caught on bracers'], 'a panther low in the foreground', 5),
  makeCompanion('bear', 'bear', 'major', 'animal', ['ranger', 'druid', 'barbarian'], ['frontier_hunter', 'savage_berserker'], ['trail_warden', 'beast_slayer'], 'dual_silhouette', ['bear-claw charm', 'bear bulk behind the figure'], 'a bear companion behind the character', 4),
  makeCompanion('boar', 'boar', 'major', 'animal', ['ranger', 'barbarian'], ['frontier_hunter', 'savage_berserker'], ['trail_warden', 'tribal_champion'], 'dual_silhouette', ['boar tusk charms', 'boar snout in foreground'], 'a boar companion braced at the side', 4),
  makeCompanion('stag', 'stag', 'major', 'animal', ['druid', 'ranger', 'paladin'], ['frontier_hunter', 'holy_warrior'], ['trail_warden', 'fey_noble', 'sun_knight'], 'dual_silhouette', ['antler shadow behind the figure', 'stag bells on a strap'], 'a stag standing behind the character', 5),
  makeCompanion('elk', 'elk', 'major', 'animal', ['druid', 'ranger'], ['frontier_hunter'], ['trail_warden'], 'mounted_silhouette', ['elk saddle blanket', 'antlers framing the silhouette'], 'an elk companion large enough to ride', 4),
  makeCompanion('battle_mastiff', 'battle mastiff', 'major', 'animal', ['fighter', 'paladin', 'cleric'], ['martial_veteran', 'holy_warrior'], ['battle_chaplain', 'mercenary_captain'], 'dual_silhouette', ['armored mastiff collar', 'mastiff guarding the foreground'], 'a battle mastiff at heel', 5),
  makeCompanion('temple_hound', 'temple hound', 'major', 'celestial', ['cleric', 'paladin', 'monk'], ['holy_warrior', 'wandering_martial_artist'], ['grave_warden', 'temple_guardian'], 'dual_silhouette', ['temple hound prayer collar', 'pale hound flame'], 'a temple hound standing like a guardian', 5),
  makeCompanion('spirit_fox', 'spirit fox', 'major', 'spirit', ['druid', 'bard', 'warlock'], ['fey_trickster', 'frontier_hunter'], ['fey_noble', 'forest_sprite', 'moonlit_duelist'], 'dual_silhouette', ['spirit fox tails in soft glow', 'glowing paw prints'], 'a translucent spirit fox companion', 5),
  makeCompanion('young_dragon', 'young dragon', 'legendary', 'dragon', ['sorcerer', 'ranger', 'paladin'], ['arcane_caster', 'frontier_hunter', 'holy_warrior'], ['battle_mage', 'sun_knight', 'trail_warden'], 'dual_silhouette', ['young dragon curling around the shoulders', 'tiny smoke from dragon nostrils'], 'a young dragon coiled around the silhouette', 2),
  makeCompanion('wyvern_hatchling', 'wyvern hatchling', 'legendary', 'dragon', ['ranger', 'rogue', 'barbarian'], ['frontier_hunter', 'shadow_skirmisher', 'savage_berserker'], ['trail_warden', 'pirate_raider', 'beast_slayer'], 'dual_silhouette', ['wyvern hatchling wing hooks', 'small wyvern tail curled around gear'], 'a wyvern hatchling perched on packs', 2),
  makeCompanion('phoenix_fledgling', 'phoenix fledgling', 'legendary', 'celestial', ['cleric', 'paladin', 'sorcerer'], ['holy_warrior', 'arcane_caster'], ['sun_knight', 'battle_mage'], 'dual_silhouette', ['phoenix ember feathers', 'warm fledgling glow'], 'a phoenix fledgling shedding sparks', 2),
  makeCompanion('moon_stag', 'moon stag', 'legendary', 'fey', ['druid', 'ranger', 'bard'], ['frontier_hunter', 'fey_trickster'], ['fey_noble', 'forest_sprite', 'trail_warden'], 'mounted_silhouette', ['moon stag antlers', 'silver hoof glow'], 'a moon stag companion behind the figure', 2),
  makeCompanion('great_spirit_wolf', 'great spirit wolf', 'legendary', 'spirit', ['ranger', 'druid', 'barbarian'], ['frontier_hunter', 'savage_berserker'], ['trail_warden', 'beast_slayer'], 'dual_silhouette', ['great spirit wolf outline', 'blue-white wolf breath'], 'a great spirit wolf looming behind', 2),
  makeCompanion('void_raven', 'void raven', 'legendary', 'shadow', ['warlock', 'wizard', 'sorcerer'], ['arcane_caster'], ['void_oracle', 'star_seer'], 'dual_silhouette', ['void raven eclipse wings', 'starless feathers'], 'a void raven distorting the air', 2),
  makeCompanion('shadow_drake', 'shadow drake', 'legendary', 'shadow', ['warlock', 'rogue'], ['arcane_caster', 'shadow_skirmisher'], ['void_oracle', 'urban_assassin'], 'dual_silhouette', ['shadow drake curled in smoke', 'drake eyes in the dark'], 'a shadow drake crouched in the background', 1),
  makeCompanion('celestial_griffon', 'celestial griffon', 'legendary', 'celestial', ['paladin', 'cleric'], ['holy_warrior'], ['sun_knight', 'battle_chaplain'], 'mounted_silhouette', ['celestial griffon feathers', 'gold talon silhouette'], 'a celestial griffon companion', 1),
  makeCompanion('sun_lion', 'sun lion', 'legendary', 'celestial', ['paladin', 'cleric'], ['holy_warrior'], ['sun_knight'], 'dual_silhouette', ['sun lion mane glow', 'lion paw mark in dust'], 'a sun lion blazing softly nearby', 1),
  makeCompanion('ancient_treant_sapling', 'ancient treant sapling', 'legendary', 'fey', ['druid', 'ranger'], ['frontier_hunter', 'fey_trickster'], ['forest_sprite', 'trail_warden'], 'dual_silhouette', ['tiny ancient tree face', 'leafy sapling companion'], 'an ancient treant sapling walking beside them', 1),
  makeCompanion('clockwork_owl_sentinel', 'clockwork owl sentinel', 'legendary', 'construct', ['artificer', 'wizard'], ['battle_engineer', 'arcane_caster'], ['clockwork_sapper', 'academy_mage'], 'dual_silhouette', ['clockwork owl brass wings', 'tiny lens eyes'], 'a clockwork owl sentinel orbiting the shoulder', 2),
  makeCompanion('living_constellation_bird', 'living constellation bird', 'legendary', 'spirit', ['wizard', 'sorcerer', 'warlock'], ['arcane_caster'], ['star_seer', 'void_oracle'], 'dual_silhouette', ['constellation bird outline', 'stars connected like wings'], 'a living constellation bird floating nearby', 2),
];

export const companionRelationships: CompanionRelationship[] = [
  { id: 'raised_from_cub', label: 'raised from a cub', promptFragment: 'companion reads as raised from a cub', weight: 8 },
  { id: 'inherited_from_mentor', label: 'inherited from mentor', promptFragment: 'companion carries a mentor-token on its collar', weight: 7 },
  { id: 'saved_during_childhood', label: 'saved during childhood', promptFragment: 'companion bond suggests a childhood rescue', weight: 6 },
  { id: 'bound_through_ritual', label: 'bound through ritual', promptFragment: 'companion is bound through visible ritual marks', weight: 7 },
  { id: 'last_survivor', label: 'last survivor of its kind', promptFragment: 'companion feels like the last survivor of its kind', weight: 4 },
  { id: 'accidentally_imprinted', label: 'accidentally imprinted', promptFragment: 'companion seems accidentally imprinted and loyal', weight: 5 },
  { id: 'family_companion', label: 'family companion', promptFragment: 'companion carries old family markings', weight: 6 },
  { id: 'war_companion', label: 'war companion', promptFragment: 'companion has battle-worn harness and campaign scars', weight: 6 },
  { id: 'rescued_battlefield', label: 'rescued from a battlefield', promptFragment: 'companion shows signs of a battlefield rescue', weight: 6 },
  { id: 'abandoned_egg', label: 'found as an abandoned egg', promptFragment: 'companion bond began with an abandoned egg', weight: 4 },
  { id: 'ancient_oath_companion', label: 'ancient oath companion', promptFragment: 'companion is tied to an ancient oath', weight: 5 },
];

export const themeContentProfiles: ThemeContentProfile[] = [
  { themeId: 'void_oracle', heroDetails: ['dark veins near the eyes', 'sleep-deprived eyes', 'starless pupils', 'faint void cracks across the skin', 'thin black tear marks', 'floating omen talismans', 'black-thread family charm', 'torn prophecy scrolls', 'stitched celestial charts', 'ritual bindings on forearms', 'obsidian astrolabe', 'crystal orb wrapped in black thread', 'sealed prophecy journal', 'void-touched prayer beads', 'astronomical measuring tools'], rareDetails: ['orbiting black feathers', 'broken halo fragments', 'floating eclipse symbols', 'shattered celestial compass', 'starless constellation tattoos', 'void-burned fingertips', 'cracked observatory lens', 'eclipsed prayer wheel'], legendaryDetails: ['miniature eclipse orbiting behind the head', 'living prophecy parchment that rewrites itself', 'shadow moving independently', 'fractured starlight crown', 'void rift reflected in one eye'], storyProps: ['stack of unfinished prophecies', 'burned astronomical charts', 'sealed omen boxes', 'collapsed observatory instruments', 'black crystal fragments'], cloakDetails: ['embroidered eclipse patterns', 'stitched star maps', 'frayed prophecy strips', 'void-burned hem', 'ritual knot fasteners'], handDetails: ['ink-stained fingers', 'void-burn scars', 'astronomical measuring rings', 'black-thread wrappings', 'prophecy tattoos'], companionCompatibleDetails: ['companion feathers bent by void wind', 'small omen tags tied to companion harness'] },
  { themeId: 'dream_walker', heroDetails: ['silver sleep mask', 'dream journals', 'moon-thread bracelets', 'glass dream vials', 'pale sleepless complexion', 'soft glowing eyelids', 'sleep ritual circles', 'moonlit mist ribbons', 'unfinished dream sketches', 'lucid dreaming notes'], rareDetails: ['floating dream fragments', 'half-transparent memories', 'sleep sigils', 'moonlit reflections around the body', 'dreamcatcher chains', 'bottle of captured dreams'], legendaryDetails: ['sleeping spirit silhouette following behind', 'living dream butterflies', 'fractured reality reflections', 'dream serpent coiling through the air'], storyProps: ['recorded nightmares', 'memory bottles', 'unfinished dream maps', 'sleep ward talismans', 'silver pillow charm'] },
  { themeId: 'academy_mage', heroDetails: ['organized spell notes', 'academy insignia', 'precision measuring tools', 'annotated spellbook', 'faculty recommendation seals', 'ink-stained robe cuffs', 'stacked academy books', 'examination scrolls', 'polished spell focus', 'lecture notes bound with ribbon'], rareDetails: ['graduation honors', 'arcane thesis fragments', 'mentor annotations', 'restricted section library pass', 'professor correspondence'], legendaryDetails: ['living spellbook', 'floating lecture notes', 'archmage commendation seal', 'spectral classroom diagrams'], storyProps: ['unfinished thesis', 'academy badge', 'field research journal', 'rejected research proposal', 'academy map'] },
  { themeId: 'rune_scholar', heroDetails: ['angular rune notes', 'etched stone tablets', 'rune measuring cords', 'glowing ink bottle', 'formulae stitched into cuffs'], rareDetails: ['floating theorem glyphs', 'ancient rune slate', 'forbidden grammar chart'], legendaryDetails: ['runes rearranging themselves in the air', 'stone tablet that whispers translations'], storyProps: ['copied ruin inscriptions', 'broken translation key', 'field rune rubbings'] },
  { themeId: 'monster_tracker', heroDetails: ['claw trophies', 'tracking tags', 'scarred bestiary', 'monster teeth necklace', 'field sketch journal', 'beast-hide cloak', 'hunter tally marks', 'bite-scarred armor', 'specimen vials', 'reinforced travel boots'], rareDetails: ['dragon scale trophy', 'giant claw fragments', 'ancient bounty markers', 'preserved monster eye charm', 'claw-marked shield plate'], legendaryDetails: ['living monster map', 'dragon skull charm', 'legendary hunt records', 'animated bestiary page'], storyProps: ['monster bounty records', 'blood-stained trail notes', 'strange tracks cast in clay', 'broken trap chain', 'hunter license tags'], companionCompatibleDetails: ['matching hunter tags on companion collar', 'companion bite marks on old monster hide'] },
  { themeId: 'trail_warden', heroDetails: ['mud-stained travel cloak', 'weathered map tube', 'tracking notches on bow grip', 'patched leather straps', 'road dust on boots', 'wilderness herbs tied to belt', 'trail marker cords', 'campfire smoke in fabric'], rareDetails: ['ancient trail badge', 'rare beast track sketch', 'storm-proof lantern', 'forgotten mile marker charm'], legendaryDetails: ['living trail map', 'wind that points toward the road', 'ancestral pathfinder compass'], storyProps: ['folded route map', 'old camp token', 'field ration tally', 'broken compass needle'], companionCompatibleDetails: ['companion paw-print tags', 'shared road dust on companion harness'] },
  { themeId: 'grave_warden', heroDetails: ['gravekeeper keys', 'funeral bell', 'ancestor prayer strips', 'burial registry book', 'black mourning sash', 'lantern with pale flame', 'bone rosary', 'grave soil pouch', 'weathered tomb map'], rareDetails: ['cracked death mask', 'silver last-rites coin', 'ghost-lit candle cage', 'ancestral name tablets'], legendaryDetails: ['spectral handprints on the cloak', 'floating grave bells', 'halo of funeral candles', 'translucent ancestors behind the figure'], storyProps: ['old burial records', 'sealed coffin tags', 'memorial ribbons', 'forgotten epitaph rubbings'], companionCompatibleDetails: ['companion collar with funeral charm', 'pale flame reflected in companion eyes'] },
  { themeId: 'battle_chaplain', heroDetails: ['battlefield prayer strips', 'worn armor dents', 'field sermon book', 'blood-marked bandages', 'portable reliquary', 'patched holy tabard', 'campaign rosary', 'battlefield incense tin'], rareDetails: ['saint medal cracked by an arrow', 'field hospital tally', 'recovered banner saint icon'], legendaryDetails: ['spectral prayer banners', 'halo of battlefield dust', 'saintly hand over the shoulder'], storyProps: ['wounded ally tags', 'field blessing ledger', 'sealed casualty list', 'burned prayer ribbon'] },
  { themeId: 'relic_thief', heroDetails: ['fine lockpicks', 'stolen relic case', 'folded trap maps', 'hidden dagger straps', 'coded museum labels', 'rope harness', 'compact satchel', 'wax-sealed stolen inventory', 'soft-soled boots'], rareDetails: ['cursed jewel case', 'counterfeit museum pass', 'black-market relic tags', 'collapsible grappling hook'], legendaryDetails: ['floating stolen relic', 'invisible lock outline', 'ghostly trap mechanism', 'artifact that refuses to stay hidden'], storyProps: ['coded notebook', 'stolen exhibit plaque', 'vault blueprint', 'broken alarm charm'] },
  { themeId: 'pirate_raider', heroDetails: ['rope belt', 'sea charts', 'barnacle relics', 'salt-stained relic hooks', 'weathered brass buckles', 'coiled boarding rope', 'tide-marked satchel', 'pirate compass'], rareDetails: ['barnacle-encrusted reliquary', 'smuggled shrine coin', 'storm-blackened spyglass', 'cursed pearl token'], legendaryDetails: ['ghostly sea chart glowing above the hand', 'shipwreck crown wrapped in kelp', 'barnacle relic that whispers tide names'], storyProps: ['folded sea charts', 'black-market cargo manifest', 'salt-worn treasure map', 'barnacle relic case'], beltDetails: ['rope belt', 'nautical fasteners'], cloakDetails: ['salt-stained cloak hem', 'wave-pattern embroidery'] },
  { themeId: 'fey_noble', heroDetails: ['living flower jewelry', 'moonlit silk ribbons', 'thorn crown', 'glowing pollen around the hair', 'impossible fabric folds', 'butterfly-wing cloak clasp', 'silver leaf embroidery', 'fey court token'], rareDetails: ['floating blossoms', 'moon glass jewelry', 'living vine circlet', 'whispered names woven into fabric'], legendaryDetails: ['tiny moon orbiting shoulder', 'crown of living starlight flowers', 'cloak made of shifting seasons', 'fey mirror shards floating nearby'], storyProps: ['sealed court invitation', 'impossible rose in a glass case', 'fey oath ribbon', 'courtly duel token'], companionCompatibleDetails: ['matching flower charm on companion', 'companion fur dusted with pollen'] },
  { themeId: 'arena_champion', heroDetails: ['arena victory cords', 'scarred gauntlets', 'sand-stained armor edge', 'crowd token necklace', 'champion tally marks', 'gladiator belt plate'], rareDetails: ['defeated champion crest', 'gold arena bead', 'weapon nick from famous duel'], legendaryDetails: ['ghostly roar of the arena crowd', 'champion laurels made of sparks'], storyProps: ['old arena contract', 'torn victory sash', 'challenge token'] },
  { themeId: 'mercenary_captain', heroDetails: ['campaign maps', 'unit insignia', 'battle reports', 'command cloak', 'contract scroll tubes', 'payment seals', 'mercenary tokens', 'scarred gauntlets', 'weathered banners', 'campaign journal'], rareDetails: ['enemy insignia collection', 'execution ledger', 'first company banner fragment', 'coin from the first contract', 'commander signet'], legendaryDetails: ['banner that survived a massacre', 'ghostly silhouettes of old soldiers', 'war table map projected in the air'], storyProps: ['signed contract papers', 'old muster roll', 'fallen comrades list', 'sealed battle orders'] },
];

export const narrativeMotifs: Array<NarrativeMotif> = [
  { id: 'lost_heir', label: 'Lost Heir', weight: 7, compatibleBuildTemplates: ['holy_warrior', 'shadow_skirmisher', 'fey_trickster', 'arcane_caster', 'lorekeeper_bard'], compatibleVisualThemes: [], archetypeTags: ['noble'], classBias: ['bard', 'rogue', 'paladin', 'warlock'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['broken signet ring', 'faded noble crest hidden under the cloak', 'half-burned inheritance letter'], promptFragments: ['carries subtle signs of a forgotten noble bloodline', 'wears a damaged family token'], moodBias: ['haunted midnight ritual', 'rainy alley ambush'], fxBias: [] },
  { id: 'oathbreaker', label: 'Oathbreaker', weight: 7, compatibleBuildTemplates: ['holy_warrior', 'savage_berserker', 'shadow_skirmisher', 'martial_veteran'], compatibleVisualThemes: ['fallen_saint', 'blood_oath_survivor'], archetypeTags: ['fallen', 'oathkeeper', 'cursed'], classBias: ['paladin', 'fighter', 'barbarian'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['cracked oath symbol', 'burned prayer ribbon', 'scar across the old heraldry'], promptFragments: ['marked by a broken vow', 'old sacred symbols are damaged but not fully abandoned'], moodBias: ['haunted midnight ritual'], fxBias: ['dark holy glow', 'floating embers'] },
  { id: 'relic_seeker', label: 'Relic Seeker', weight: 8, compatibleBuildTemplates: ['shadow_skirmisher', 'divine_scholar', 'frontier_hunter', 'arcane_caster', 'battle_engineer'], compatibleVisualThemes: ['relic_thief', 'divine_archivist', 'ritualist'], archetypeTags: ['cartographer', 'pirate', 'tools', 'scholar'], classBias: ['rogue', 'ranger', 'wizard', 'artificer'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['sealed relic case', 'ancient key on a cord', 'worn treasure map'], promptFragments: ['looks like someone who has crossed half the world chasing a forbidden relic'], moodBias: ['arcane study wonder', 'salt-stained relic dive'], fxBias: ['map glow lines', 'subtle magical runes'] },
  { id: 'last_apprentice', label: 'Last Apprentice', weight: 7, compatibleBuildTemplates: ['arcane_caster', 'wandering_martial_artist', 'divine_scholar', 'skald_performer', 'lorekeeper_bard'], compatibleVisualThemes: ['academy_mage', 'temple_guardian', 'archive_performer'], archetypeTags: ['academy', 'scholar', 'holy'], classBias: ['wizard', 'sorcerer', 'monk', 'bard'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['old mentor token', 'unfinished training sash', 'inherited spellbook'], promptFragments: ['carries the last keepsake of a vanished mentor'], moodBias: ['arcane study wonder', 'radiant temple resolve'], fxBias: ['subtle magical runes'] },
  { id: 'monster_slayer', label: 'Monster Slayer', weight: 8, compatibleBuildTemplates: ['frontier_hunter', 'savage_berserker', 'martial_veteran', 'shadow_skirmisher'], compatibleVisualThemes: ['monster_slayer_veteran', 'beast_slayer', 'bounty_hunter'], archetypeTags: ['hunter', 'frontier', 'draconic'], classBias: ['fighter', 'ranger', 'barbarian', 'rogue'], raceBias: [], forbiddenClasses: ['wizard', 'sorcerer'], forbiddenTags: [], storyDetails: ['monster tooth trophies', 'claw-scarred armor', 'hunter tally marks'], promptFragments: ['every mark on the outfit hints at survived monster hunts'], moodBias: ['grim dungeon hunt', 'battle-scarred epic'], fxBias: ['swirling mist', 'sparks from enchanted steel'] },
  { id: 'exile', label: 'Exile', weight: 6, compatibleBuildTemplates: ['arcane_caster', 'holy_warrior', 'shadow_skirmisher', 'fey_trickster', 'savage_berserker', 'wandering_martial_artist', 'battle_engineer', 'frontier_hunter', 'martial_veteran', 'lorekeeper_bard', 'divine_scholar', 'skald_performer'], compatibleVisualThemes: [], archetypeTags: ['shadow', 'cursed', 'frontier'], classBias: [], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['travel-worn cloak clasp', 'foreign coin necklace', 'patched road clothes'], promptFragments: ['feels like someone who no longer belongs anywhere'], moodBias: ['rainy alley ambush', 'haunted midnight ritual'], fxBias: [] },
  { id: 'chosen_vessel', label: 'Chosen Vessel', weight: 7, compatibleBuildTemplates: ['arcane_caster', 'holy_warrior', 'fey_trickster'], compatibleVisualThemes: ['void_oracle', 'fey_noble', 'sun_knight', 'academy_mage'], archetypeTags: ['void', 'holy', 'fey', 'arcane'], classBias: ['warlock', 'sorcerer', 'cleric', 'paladin'], raceBias: ['aasimar', 'tiefling', 'fairy'], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['glowing birthmark', 'involuntary magical aura', 'ritual scars'], promptFragments: ['carries a power they did not fully choose'], moodBias: ['void-cursed omen', 'radiant temple resolve'], fxBias: ['void glow', 'divine rays', 'green witchfire'] },
  { id: 'battlefield_survivor', label: 'Battlefield Survivor', weight: 7, compatibleBuildTemplates: ['holy_warrior', 'savage_berserker', 'martial_veteran', 'battle_engineer', 'wandering_martial_artist'], compatibleVisualThemes: ['battle_chaplain', 'veteran_officer', 'storm_warrior'], archetypeTags: ['battlefield', 'holy'], classBias: ['fighter', 'cleric', 'barbarian', 'artificer', 'monk'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['patched wounds', 'broken banner strip', 'dented armor plate kept as a charm'], promptFragments: ['the design suggests someone who survived a battle they should not have survived'], moodBias: ['battle-scarred epic', 'battlefield benediction'], fxBias: ['torn banners in battlefield smoke', 'dust burst'] },
  { id: 'cursed_bloodline', label: 'Cursed Bloodline', weight: 7, compatibleBuildTemplates: ['arcane_caster', 'fey_trickster', 'shadow_skirmisher'], compatibleVisualThemes: ['void_oracle', 'moonlit_duelist', 'urban_assassin', 'cursed_lore_singer'], archetypeTags: ['void', 'cursed', 'shadow', 'fey'], classBias: ['warlock', 'sorcerer', 'rogue'], raceBias: ['tiefling'], forbiddenClasses: ['cleric', 'paladin'], forbiddenTags: ['holy'], storyDetails: ['dark veins near the eyes', 'inherited curse mark', 'family charm wrapped in black thread'], promptFragments: ['hints at a curse passed through generations'], moodBias: ['void-cursed omen', 'haunted midnight ritual'], fxBias: ['black-violet motes', 'void glow'] },
  { id: 'redeemed_villain', label: 'Redeemed Villain', weight: 6, compatibleBuildTemplates: ['holy_warrior', 'shadow_skirmisher', 'savage_berserker', 'martial_veteran'], compatibleVisualThemes: ['fallen_saint', 'battle_chaplain', 'urban_assassin', 'blood_oath_survivor'], archetypeTags: ['fallen', 'shadow', 'cursed'], classBias: ['fighter', 'rogue', 'paladin', 'barbarian'], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['old enemy insignia scratched away', 'replaced black cloak lining', 'symbolic new oath token'], promptFragments: ['looks like someone trying to become better without erasing the past'], moodBias: ['haunted midnight ritual', 'battlefield benediction'], fxBias: ['dark holy glow', 'swirling mist'] },
  { id: 'seasoned_adventurer', label: 'Seasoned Adventurer', weight: 1, compatibleBuildTemplates: [], compatibleVisualThemes: [], archetypeTags: [], classBias: [], raceBias: [], forbiddenClasses: [], forbiddenTags: [], storyDetails: ['worn belt pouches', 'travel scratches', 'practical keepsakes'], promptFragments: ['carries practical keepsakes from many roads'], moodBias: [], fxBias: [] },
];

type NarrativeVariantSeed = WeightedOption<Omit<NarrativeVariant, 'narrativeMotifId'>>;

const explicitNarrativeVariants: Record<string, NarrativeVariantSeed[]> = {
  relic_seeker: [
    { id: 'expedition_survivor', label: 'Expedition Survivor', storyDetails: ['broken astrolabe', 'ruined expedition journal', 'cracked compass', 'faded survey notes'], promptFragments: ['survived a failed expedition and still follows its last route'], moodBias: ['grim dungeon hunt'], fxBias: ['map glow lines'], weight: 8 },
    { id: 'forbidden_collector', label: 'Forbidden Collector', storyDetails: ['stolen museum artifact', 'black-market catalog', 'smuggler markings', 'forbidden relic seal'], promptFragments: ['collects relics that legitimate archives refuse to name'], moodBias: ['rainy alley ambush'], fxBias: ['subtle magical runes'], weight: 8 },
    { id: 'treasure_hunter', label: 'Treasure Hunter', storyDetails: ['ancient key', 'sealed relic case', 'worn treasure map', 'forgotten coordinates'], promptFragments: ['chases forgotten coordinates toward one impossible prize'], moodBias: ['wild frontier dusk'], fxBias: ['map glow lines'], weight: 8 },
  ],
  exile: [
    { id: 'fallen_noble', label: 'Fallen Noble', storyDetails: ['damaged signet ring', 'old crest fragment', 'inheritance papers'], promptFragments: ['carries proof of a title nobody recognizes anymore'], moodBias: ['haunted midnight ritual'], fxBias: [], weight: 8 },
    { id: 'road_wanderer', label: 'Road Wanderer', storyDetails: ['patched cloak', 'foreign coin necklace', 'weathered road journal'], promptFragments: ['looks shaped by too many roads and no true home'], moodBias: ['wild frontier dusk'], fxBias: [], weight: 8 },
    { id: 'wanted_fugitive', label: 'Wanted Fugitive', storyDetails: ['wanted poster fragment', 'false identity papers', 'prison tattoo marks'], promptFragments: ['is clearly living under a name that might not be theirs'], moodBias: ['rainy alley ambush'], fxBias: [], weight: 8 },
  ],
  last_apprentice: [
    { id: 'academy_dropout', label: 'Academy Dropout', storyDetails: ['unfinished thesis pages', 'academy badge', 'professor annotations'], promptFragments: ['left formal training with more questions than answers'], moodBias: ['arcane study wonder'], fxBias: ['subtle magical runes'], weight: 8 },
    { id: 'sole_heir', label: 'Sole Heir', storyDetails: ['mentor token', 'inherited spellbook', 'unfinished training sash'], promptFragments: ['carries the last lesson of a vanished teacher'], moodBias: ['radiant temple resolve'], fxBias: ['subtle magical runes'], weight: 8 },
    { id: 'failed_successor', label: 'Failed Successor', storyDetails: ['broken wand', 'rejected examination scroll', 'sealed recommendation letter'], promptFragments: ['looks like someone trying to outgrow a public failure'], moodBias: ['haunted midnight ritual'], fxBias: ['ink sparks'], weight: 8 },
  ],
};

function defaultNarrativeVariants(motif: NarrativeMotif): NarrativeVariantSeed[] {
  return [
    { id: `${motif.id}_scarred_token`, label: `${motif.label} Scarred Token`, storyDetails: [motif.storyDetails[0] ?? 'worn keepsake', motif.storyDetails[1] ?? 'old travel mark', 'scarred personal token'], promptFragments: [`adds a scarred-token variant of ${motif.label.toLowerCase()}`], moodBias: motif.moodBias, fxBias: motif.fxBias, weight: 7 },
    { id: `${motif.id}_hidden_record`, label: `${motif.label} Hidden Record`, storyDetails: [motif.storyDetails[1] ?? 'hidden note', motif.storyDetails[2] ?? 'private keepsake', 'coded travel record'], promptFragments: [`adds a hidden-record variant of ${motif.label.toLowerCase()}`], moodBias: motif.moodBias, fxBias: motif.fxBias, weight: 7 },
    { id: `${motif.id}_unfinished_vow`, label: `${motif.label} Unfinished Vow`, storyDetails: [motif.storyDetails[2] ?? 'unfinished vow token', motif.storyDetails[0] ?? 'worn keepsake', 'promise mark'], promptFragments: [`adds an unfinished-vow variant of ${motif.label.toLowerCase()}`], moodBias: motif.moodBias, fxBias: motif.fxBias, weight: 7 },
  ];
}

export const narrativeVariants: Array<WeightedOption<NarrativeVariant>> = narrativeMotifs.flatMap((motif) => {
  const variants = explicitNarrativeVariants[motif.id] ?? defaultNarrativeVariants(motif);
  return variants.map((variant) => ({ ...variant, narrativeMotifId: motif.id }));
});


export const buildTemplates: Array<WeightedOption<BuildTemplate>> = [
  {
    id: 'arcane_caster',
    label: 'Arcane Caster',
    allowedClasses: ['wizard', 'sorcerer', 'warlock'],
    preferredArchetypes: ['arcane academy dropout', 'void-pact oracle', 'cursed cartographer'],
    preferredArchetypeTags: ['mage', 'academy', 'arcane', 'void', 'scholar', 'cartographer'],
    allowedArmor: ['embroidered arcane robes', 'travel-worn cloth layers', 'plain monastery cloth'],
    allowedWeapons: ['oak spell staff', 'crystal orb focus', 'silver wand focus', 'weathered spellbook', 'scroll case and compass', 'crystal focus', 'floating spellbook', 'brass astrolabe', 'bone-carved wand', 'ink-stained grimoire', 'celestial chart cylinder'],
    allowedPoses: ['casting with both hands in a spiral gesture', 'tracing a glowing sigil in the air', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'ready stance on a cracked dungeon tile', 'adjusting floating pages', 'drawing a sigil circle', 'consulting star charts', 'turning a brass astrolabe toward the light', 'opening a floating grimoire mid-spell'],
    allowedSilhouettes: ['tall robed column', 'asymmetrical cloak profile', 'lean and sharp-edged', 'compact and nimble'],
    allowedMoods: ['arcane study wonder', 'void-cursed omen', 'haunted midnight ritual'],
    allowedLights: ['blue arcane glyph light', 'cold moon rim light', 'void glow from below', 'candlelit map glow'],
    allowedFx: ['subtle magical runes', 'purple void energy', 'black-violet motes', 'map glow lines', 'drifting void ash', 'black-violet sparks', 'gravity distortions', 'fragmented stars', 'paper glyph flutter', 'ink sparks'],
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
    allowedWeapons: ['mace and holy shield', 'longsword and round shield', 'ritual warhammer', 'silver holy symbol and staff', 'relic censer', 'sun-forged mace', 'banner spear', 'reliquary shield', 'pilgrim staff'],
    allowedPoses: ['shield braced against incoming sparks', 'guarded stance behind a raised shield', 'weapon raised in a decisive challenge', 'kneeling prayer as holy light gathers', 'casting with both hands in a spiral gesture', 'ready stance on a cracked dungeon tile', 'raising a relic censer in prayer', 'planting a banner spear before the charge', 'guarding behind a reliquary shield', 'blessing a pilgrim staff before battle', 'swinging a sun-forged mace in a warding arc'],
    allowedSilhouettes: ['stocky shield-forward stance', 'broad heroic triangle', 'tall robed column', 'compact and nimble'],
    allowedMoods: ['radiant temple resolve', 'battlefield benediction', 'battle-scarred epic'],
    allowedLights: ['golden divine rays', 'warm sunrise halo', 'storm lightning silhouette'],
    allowedFx: ['divine rays', 'spectral feathers', 'holy glow', 'dark holy glow', 'sparks from enchanted steel', 'sun motes', 'prayer ribbons', 'glowing dust', 'sacred sparks'],
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
    allowedPoses: ['overhead strike with a heavy blade', 'ground slam sending dust through the scene', 'ready stance on a cracked dungeon tile', 'weapon raised in a decisive challenge', 'howling over a raised greataxe', 'dragging a maul through battlefield dust', 'planting a spear in a victory roar', 'circling with a handaxe low', 'charging out of flying embers'],
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
    allowedWeapons: ['paired daggers', 'rapier with jeweled guard', 'shortbow and scout knife', 'hunting longbow', 'dual ranger blades', 'annotated map and compass', 'scroll case and compass', 'assassin stiletto', 'folding crossbow', 'trap toolkit', 'rope launcher', 'relic thief satchel'],
    allowedPoses: ['ready stance on a cracked dungeon tile', 'turning mid-stride as cloak whips around', 'forward rapier thrust', 'duelist turn with one foot sliding back', 'aiming down a rain-darkened arrow', 'drawing a bowstring with held breath', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'picking a lock with a stiletto ready', 'studying stolen plans in an alley', 'crouched rooftop observation', 'setting a compact trap toolkit', 'firing a rope launcher across a gap'],
    allowedSilhouettes: ['lean and sharp-edged', 'compact and nimble', 'asymmetrical cloak profile'],
    allowedMoods: ['grim dungeon hunt', 'rainy alley ambush', 'haunted midnight ritual'],
    allowedLights: ['warm torchlight from below', 'low lantern light', 'cold moon rim light', 'candlelit map glow'],
    allowedFx: ['swirling mist', 'wet cobblestone haze', 'black-violet motes', 'subtle magical runes', 'map glow lines', 'drifting void ash', 'black-violet sparks', 'paper glyph flutter', 'ink sparks'],
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
    allowedPoses: ['turning mid-stride as cloak whips around', 'weapon raised in a decisive challenge', 'casting with both hands in a spiral gesture', 'performing a playful fey flourish', 'duelist turn with one foot sliding back', 'bowing with a moonlit flourish', 'twirling a cane sword beneath petals', 'playing a flute as witchfire gathers', 'casting through a fey crystal', 'laughing behind a lifted cloak'],
    allowedSilhouettes: ['willowy fey outline', 'asymmetrical cloak profile', 'compact and nimble', 'lean and sharp-edged'],
    allowedMoods: ['mysterious fey dream', 'moonlit forest charm', 'rainy alley ambush'],
    allowedLights: ['soft green witchfire glow', 'soft moonlit glade glow', 'low lantern light'],
    allowedFx: ['petals and whimsical particles', 'green witchfire', 'soft fey glow', 'drifting petals', 'glowing pollen', 'moonlit butterflies', 'floating blossoms'],
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
    allowedPoses: ['performing a playful fey flourish', 'turning mid-stride as cloak whips around', 'weapon raised in a decisive challenge', 'duelist turn with one foot sliding back', 'ready stance on a cracked dungeon tile', 'performing before an unseen audience', 'writing notes into a songbook', 'tuning a magical instrument', 'unfurling a memory scroll mid-song', 'striking a rune-carved lute chord'],
    allowedSilhouettes: ['asymmetrical cloak profile', 'compact and nimble', 'lean and sharp-edged'],
    allowedMoods: ['rainy alley ambush', 'battle-scarred epic', 'salt-stained relic dive'],
    allowedLights: ['low lantern light', 'warm torchlight from below', 'storm lightning silhouette'],
    allowedFx: ['floating embers', 'sparks from enchanted steel', 'swirling mist', 'wet cobblestone haze'],
    forbiddenTags: ['heavy', 'greataxe', 'shield', 'bestial'],
    weight: 6,
  },
  {
    id: 'martial_veteran',
    label: 'Martial Veteran',
    allowedClasses: ['fighter', 'rogue', 'ranger', 'barbarian'],
    preferredArchetypes: ['iron wall veteran', 'streetwise monster hunter', 'rage-scarred clan champion', 'wild frontier scout', 'dragon cult defector'],
    preferredArchetypeTags: ['battlefield', 'hunter', 'frontier', 'draconic'],
    allowedArmor: ['half plate with campaign dents', 'scale mail with heraldic sash', 'chain mail under a weathered tabard', 'reinforced artificer coat', 'full plate with engraved pauldrons', 'small fitted chain shirt', 'compact leather harness', 'light ceremonial half-plate'],
    allowedWeapons: ['longsword and round shield', 'heavy greatsword', 'spear and torn banner', 'dual ranger blades', 'ritual warhammer'],
    allowedPoses: ['ready stance on a cracked dungeon tile', 'weapon raised in a decisive challenge', 'overhead strike with a heavy blade', 'ground slam sending dust through the scene', 'guarded stance behind a raised shield', 'dual slash from a low stance', 'close-quarters ready stance', 'planting a banner spear before the charge', 'dragging a maul through battlefield dust', 'planting a spear in a victory roar', 'charging out of flying embers', 'circling with a handaxe low'],
    allowedSilhouettes: ['broad heroic triangle', 'stocky shield-forward stance', 'lean and sharp-edged', 'compact and nimble'],
    allowedMoods: ['battle-scarred epic', 'grim dungeon hunt', 'battlefield benediction'],
    allowedLights: ['storm lightning silhouette', 'warm torchlight from below', 'low lantern light'],
    allowedFx: ['dust burst', 'sparks from enchanted steel', 'torn banners in battlefield smoke', 'floating embers'],
    forbiddenTags: ['fey-focus', 'magic-focus'],
    weight: 9,
  },
  {
    id: 'lorekeeper_bard',
    label: 'Lorekeeper Bard',
    allowedClasses: ['bard', 'wizard', 'cleric', 'artificer'],
    preferredArchetypes: ['clockwork scholar', 'arcane academy dropout', 'cursed cartographer', 'haunted noble heir'],
    preferredArchetypeTags: ['scholar', 'academy', 'arcane', 'cartographer', 'noble'],
    allowedArmor: ['travel-worn cloth layers', 'embroidered arcane robes', 'travel cloak over leather', 'small travel cloak'],
    allowedWeapons: ['lute reinforced as a dueling club', 'enchanted flute focus', 'rapier with jeweled guard', 'song-scroll case', 'annotated performance notes', 'small spellbook', 'annotated songbook', 'enchanted flute', 'memory scroll case', 'storykeeper satchel', 'rune-carved lute'],
    allowedPoses: ['performing a playful fey flourish', 'tracing a glowing sigil in the air', 'ritual prep around carefully arranged instruments', 'duelist turn with one foot sliding back', 'turning mid-stride as cloak whips around', 'performing before an unseen audience', 'writing notes into a songbook', 'tuning a magical instrument', 'unfurling a memory scroll mid-song', 'striking a rune-carved lute chord'],
    allowedSilhouettes: ['asymmetrical cloak profile', 'compact and nimble', 'lean and sharp-edged', 'tall robed column'],
    allowedMoods: ['arcane study wonder', 'rainy alley ambush', 'haunted midnight ritual'],
    allowedLights: ['candlelit map glow', 'blue arcane glyph light', 'low lantern light'],
    allowedFx: ['subtle magical runes', 'map glow lines', 'floating embers', 'black-violet motes', 'paper glyph flutter', 'ink sparks', 'black-violet sparks'],
    forbiddenTags: ['heavy', 'greataxe', 'oversized', 'shield'],
    weight: 8,
  },
  {
    id: 'divine_scholar',
    label: 'Divine Scholar',
    allowedClasses: ['artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
    preferredArchetypes: ['cursed cartographer', 'clockwork scholar', 'arcane academy dropout', 'wandering battlefield medic'],
    preferredArchetypeTags: ['cartographer', 'scholar', 'holy', 'mage'],
    allowedArmor: ['embroidered arcane robes', 'travel-worn cloth layers', 'scale mail with heraldic sash', 'half plate with campaign dents'],
    allowedWeapons: ['annotated map and compass', 'scroll case and compass', 'holy book and ritual staff', 'oak spell staff', 'ritual warhammer'],
    allowedPoses: ['studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'kneeling prayer as holy light gathers', 'tracing a glowing sigil in the air', 'copying a holy map by candlelight', 'holding a scroll against divine wind', 'reading a compass beside ritual chalk', 'opening a holy book over a sigil', 'kneeling over annotated maps'],
    allowedSilhouettes: ['tall robed column', 'asymmetrical cloak profile', 'stocky shield-forward stance', 'gadget-laden workshop silhouette'],
    allowedMoods: ['arcane study wonder', 'radiant temple resolve', 'clockwork workshop focus'],
    allowedLights: ['candlelit map glow', 'blue arcane glyph light', 'golden divine rays', 'amber workbench lamp'],
    allowedFx: ['subtle magical runes', 'map glow lines', 'divine rays', 'spectral feathers', 'paper glyph flutter', 'ink sparks', 'sun motes', 'prayer ribbons'],
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
    allowedPoses: ['tinkering with sparking tools at a workbench', 'casting through a humming mechanical device', 'ritual prep around carefully arranged instruments', 'weapon raised in a decisive challenge', 'tinkering with a clockwork gauntlet', 'calibrating a pistol-like arcane tool', 'tightening mechanical bracers before casting', 'measuring sparks over an alchemy kit', 'aiming a humming device like a focus'],
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
    allowedWeapons: ['hunting longbow', 'shortbow and scout knife', 'ranger spear', 'handaxe and tracking cord', 'dual ranger blades', 'annotated map and compass', 'scroll case and compass', 'hunting spear', 'bone bow', 'trap kit', 'tracking lantern', 'beastcaller horn'],
    allowedPoses: ['aiming down a rain-darkened arrow', 'drawing a bowstring with held breath', 'tracking footprints with cloak pulled low', 'ready stance on a cracked dungeon tile', 'turning mid-stride as cloak whips around', 'studying a map under candlelight', 'ritual prep around carefully arranged instruments', 'inspecting tracks with a lantern low', 'preparing a hunting trap', 'listening to distant sounds with horn lowered', 'bracing a hunting spear in tall grass', 'drawing a bone bow at dusk'],
    allowedSilhouettes: ['lean and sharp-edged', 'compact and nimble', 'asymmetrical cloak profile', 'broad heroic triangle'],
    allowedMoods: ['wild frontier dusk', 'grim dungeon hunt', 'rainy alley ambush'],
    allowedLights: ['golden sunset through trees', 'warm torchlight from below', 'low lantern light', 'candlelit map glow'],
    allowedFx: ['falling autumn leaves', 'swirling mist', 'wet cobblestone haze', 'floating embers', 'dust burst', 'subtle magical runes', 'map glow lines', 'windblown leaf sparks', 'lantern moth haze'],
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
    allowedPoses: ['balanced on one hand in a martial arts sweep', 'flying kick with prayer beads suspended midair', 'ready stance on a cracked dungeon tile', 'catching a strike on prayer beads', 'sweeping low with a shortspear', 'meditating as mist coils around', 'stepping through a spinning staff form', 'leaping from a temple step'],
    allowedSilhouettes: ['compact and nimble', 'lean and sharp-edged', 'asymmetrical cloak profile'],
    allowedMoods: ['radiant temple resolve', 'haunted midnight ritual', 'grim dungeon hunt'],
    allowedLights: ['golden divine rays', 'cold moon rim light', 'warm torchlight from below'],
    allowedFx: ['spectral feathers', 'divine rays', 'swirling mist'],
    forbiddenTags: ['light', 'medium', 'heavy', 'metal', 'shield', 'rapier', 'longbow', 'greataxe'],
    weight: 5,
  },
];
