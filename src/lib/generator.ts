import {
  archetypes,
  armors,
  buildTemplates,
  weaponLanguages,
  visualMotifs,
  themeVisualProfiles,
  themeContentProfiles,
  silhouetteProfiles,
  fantasyPillars,
  companionRelationships,
  characterAppearanceProfiles,
  curatedMulticlassProfiles,
  companionProfiles,
  armorLanguages,
  classAnchors,
  characterClasses,
  culturalOrigins,
  effects,
  emotions,
  equipmentEnchantments,
  equipmentFinishes,
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
  type ClassAnchor,
  type CharacterAppearanceProfile,
  type CharacterClass,
  type CulturalOrigin,
  type CuratedMulticlassProfile,
  type EquipmentEffectIntensity,
  type EquipmentEnchantment,
  type EquipmentFinish,
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
  type ArmorLanguage,
  type CompanionProfile,
  type CompanionRelationship,
  type CompanionTier,
  type FantasyPillar,
  type SilhouetteProfile,
  type ThemeContentProfile,
  type ThemeVisualProfile,
  type VisualDetailBudget,
  type VisualMotif,
  type WeaponLanguage,
  type WeightedOption,
} from '../data';

type Mode = (typeof modeWeights)[number]['name'];
export type DiversityMode = 'off' | 'soft' | 'strict';
export type EnvironmentDetailLevel = 'minimal' | 'balanced' | 'cinematic';
export type CompositionMode = 'character_concept_portrait' | 'full_body_character_art' | 'cinematic_splash_art' | 'character_card';
export type StylePreset = 'heroic_dnd_concept_art' | 'realistic_dark_fantasy' | 'wuxia_inspired_high_fantasy' | 'painterly_rpg_splash' | 'grounded_character_sheet';
type RegenerableLayer = 'template' | 'theme' | 'themeVariant' | 'motif' | 'narrativeVariant' | 'culture' | 'armor' | 'weapon' | 'silhouette' | 'pose' | 'mood' | 'light' | 'fx';

type TemplateSelection = {
  template: BuildTemplate;
  reason: string;
};

type SmartSelectionLayer =
  | 'Build Template'
  | 'Visual Theme'
  | 'Visual Theme Variant'
  | 'Narrative Motif'
  | 'Narrative Variant'
  | 'Culture'
  | 'Armor'
  | 'Weapon / Tool'
  | 'Silhouette'
  | 'Silhouette Profile'
  | 'Visual Motif'
  | 'Armor Language'
  | 'Weapon Language'
  | 'Equipment Finish'
  | 'Equipment Enchantment'
  | 'Companion'
  | 'Curated Multiclass'
  | 'Appearance'
  | 'Pose'
  | 'Mood'
  | 'Light'
  | 'FX';

type SmartCandidate<T> = {
  item: T;
  score: number;
  reasons: string[];
};

type SmartSelectionContext = {
  useSmartPool: boolean;
  trace: string[];
  compositionMode?: CompositionMode;
  environmentDetailLevel?: EnvironmentDetailLevel;
  stylePreset?: StylePreset;
};

export type GenerationOptions = {
  useSmartPool?: boolean;
  diversityMode?: DiversityMode;
  environmentDetailLevel?: EnvironmentDetailLevel;
  compositionMode?: CompositionMode;
  stylePreset?: StylePreset;
};

export type CharacterSeed = {
  mode: Mode;
  primaryClass: CharacterClass;
  classes: CharacterClass[];
  race: RaceOption;
  size: SizeCategory;
  appearanceProfile: CharacterAppearanceProfile;
  archetype: ArchetypeOption;
  buildTemplate: BuildTemplate;
  templateReason: string;
  visualTheme: VisualTheme;
  fantasyPillar: FantasyPillar;
  visualThemeVariant: VisualThemeVariant;
  visualFantasy: string;
  visualDetails: string[];
  characterBoundDetails: string[];
  sceneProps: string[];
  backgroundProps: string[];
  visualDetailBudget: VisualDetailBudget;
  visualMotif: VisualMotif;
  narrativeMotif: NarrativeMotif;
  narrativeVariant: NarrativeVariant;
  culturalOrigin: CulturalOrigin;
  compositionMode: CompositionMode;
  environmentDetailLevel: EnvironmentDetailLevel;
  stylePreset: StylePreset;
  curatedMulticlassProfile: CuratedMulticlassProfile | null;
  cultureDetails: string[];
  classAnchorScore: number;
  motifReason: string;
  storyDetails: string[];
  promptFragments: string[];
  silhouette: SilhouetteOption;
  silhouetteProfile: SilhouetteProfile;
  armor: ArmorOption;
  armorLanguage: ArmorLanguage;
  weapon: WeaponOption;
  weaponLanguage: WeaponLanguage;
  equipmentFinish: EquipmentFinish;
  equipmentEnchantment: EquipmentEnchantment;
  enchantmentIntensity: EquipmentEffectIntensity;
  companion: CompanionProfile | null;
  companionRelationship: CompanionRelationship | null;
  companionDetails: string[];
  legendaryVisualDetails: string[];
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
  imagePrompt: string;
  fullGenerationText: string;
  trace: string[];
};

type MagicManifestationMode = 'none' | 'body' | 'weapon' | 'environment' | 'light' | 'companion' | 'subtle_aura';

export type ArtDirectionBrief = {
  dominantRead: string;
  primaryVisualRead: string[];
  secondaryFlavor: string[];
  suppressedElements: string[];
  poseDirective: string;
  magicManifestationMode: MagicManifestationMode;
  storyShorthand: string[];
  promptPriorityOrder: string[];
  imagePromptGuidance: string[];
};

type SimilarityReport = {
  score: number;
  tooSimilar: boolean;
  duplicateVisualCore: boolean;
  similarSummary: string;
  appearanceScore?: number;
};

export type ValidationIssue = {
  message: string;
  layers: RegenerableLayer[];
};

const smallRaceNames = ['gnome', 'halfling', 'fairy'];
const casterClasses: CharacterClass[] = ['wizard', 'sorcerer'];
const hardArmorTags = ['light', 'medium', 'heavy', 'metal'];
const scholarThemeIds = new Set(['divine_archivist', 'academy_mage', 'archive_performer']);
const recentSeedMemory: CharacterSeed[] = [];

type PoseFamily = 'calm_presence' | 'class_specific_idle' | 'weapon_display' | 'social_pose' | 'travel_pose' | 'ritual_pose' | 'subtle_casting' | 'combat_ready' | 'wounded_survivor' | 'noble_portrait' | 'stealth_motion' | 'grounded_power_stance' | 'performance_pose' | 'protective_stance';
type PoseEnergy = 'calm' | 'controlled' | 'ready' | 'dynamic' | 'high_action';
type PosePurpose = 'identity_read' | 'class_read' | 'weapon_read' | 'mood_read' | 'action_read' | 'social_read' | 'ritual_read';
type PoseMetadata = {
  poseFamily: PoseFamily;
  poseEnergy: PoseEnergy;
  posePurpose: PosePurpose;
  compatibleClassFamilies: string[];
  compatibleWeaponFamilies: string[];
  highImpact: boolean;
  activeCasting: boolean;
  fullBodySafe: boolean;
};

const highImpactPoseNames = new Set([
  'shield braced against incoming sparks',
  'flying kick with prayer beads suspended midair',
  'kneeling prayer as holy light gathers',
  'performing a playful fey flourish',
  'ready stance on a cracked dungeon tile',
  'tracing a glowing sigil in the air',
  'studying a map under candlelight',
  'overhead strike with a heavy blade',
]);
const safeFullBodyPoseNames = new Set([
  'standing calmly with weapon lowered',
  'calm three-quarter stance',
  'standing with cloak held by wind',
  'resting one hand on weapon pommel',
  'weapon grounded beside the character',
  'looking down with quiet authority',
  'walking forward with weapon lowered',
  'turning slightly as cloak moves',
  'adjusting a glove or bracer',
  'checking blade edge',
  'staff planted on the ground',
  'standing with staff planted on the ground',
  'holding a focus close to the chest',
  'holding orb close with one hand',
  'controlled one-handed spell gesture',
  'standing calmly with focus lowered',
  'holding an instrument at rest',
  'mid-song gesture',
  'storytelling gesture',
  'rapier lowered in courtly stance',
  'bow held lowered after tracking',
  'dagger half-drawn under cloak',
  'hands wrapped, ready but not jumping',
  'shield lowered in protective stance',
  'holy symbol held close, not raised dramatically',
  'standing after battle, weapon at rest',
  'travel-ready stance with cloak and boots emphasized',
  'close-quarters ready stance',
  'quiet storytelling stance with one hand raised',
  'courtly flourish with rapier lowered',
  'protective stance with shield lowered',
]);
const classPoseFamilyPreferences: Record<CharacterClass, PoseFamily[]> = {
  fighter: ['weapon_display', 'grounded_power_stance', 'combat_ready', 'calm_presence', 'protective_stance'],
  barbarian: ['grounded_power_stance', 'weapon_display', 'combat_ready', 'wounded_survivor'],
  paladin: ['protective_stance', 'noble_portrait', 'calm_presence', 'weapon_display', 'ritual_pose'],
  cleric: ['ritual_pose', 'protective_stance', 'calm_presence', 'class_specific_idle'],
  wizard: ['subtle_casting', 'ritual_pose', 'class_specific_idle', 'calm_presence'],
  sorcerer: ['subtle_casting', 'ritual_pose', 'class_specific_idle', 'calm_presence'],
  warlock: ['subtle_casting', 'ritual_pose', 'class_specific_idle', 'calm_presence'],
  bard: ['performance_pose', 'social_pose', 'class_specific_idle', 'weapon_display'],
  rogue: ['stealth_motion', 'social_pose', 'weapon_display', 'calm_presence'],
  ranger: ['travel_pose', 'weapon_display', 'calm_presence', 'stealth_motion'],
  druid: ['ritual_pose', 'calm_presence', 'travel_pose', 'class_specific_idle'],
  monk: ['class_specific_idle', 'calm_presence', 'grounded_power_stance', 'combat_ready'],
  artificer: ['class_specific_idle', 'weapon_display', 'calm_presence', 'subtle_casting'],
};

function poseMetadata(pose: PoseOption): PoseMetadata {
  const text = normalizeText([pose.name, ...pose.tags].join(' '));
  let poseFamily: PoseFamily = 'calm_presence';
  if (/instrument|song|story|perform|flourish|lute|flute/.test(text)) poseFamily = 'performance_pose';
  else if (/dagger|crouch|ambush|stealth|cloak|stiletto|lock/.test(text)) poseFamily = 'stealth_motion';
  else if (/shield|guard|protective|warding|reliquary/.test(text)) poseFamily = 'protective_stance';
  else if (/staff planted|focus close|orb close|spell softly|one-handed spell|subtle magic|focus lowered/.test(text)) poseFamily = 'subtle_casting';
  else if (/ritual|prayer|holy symbol|blessing|meditating|kneeling|relic censer/.test(text)) poseFamily = 'ritual_pose';
  else if (/tracking|travel|walking|cloak held|wind|boots|road|bow held lowered|tracks|lantern low/.test(text)) poseFamily = 'travel_pose';
  else if (/pommel|weapon grounded|checking blade|raised|greatsword|greataxe|maul|spear|bow|rapier|blade|weapon display/.test(text)) poseFamily = 'weapon_display';
  else if (/ready stance|ready but not|braced|combat|close-quarters/.test(text)) poseFamily = 'combat_ready';
  else if (/wound|survivor|after battle|battlefield|scar/.test(text)) poseFamily = 'wounded_survivor';
  else if (/quiet authority|courtly|noble|portrait/.test(text)) poseFamily = 'noble_portrait';
  else if (/tinkering|calibrating|adjusting|bracer|tool|device|gauntlet/.test(text)) poseFamily = 'class_specific_idle';
  else if (/laughing|social|storytelling|unseen audience/.test(text)) poseFamily = 'social_pose';
  else if (/ground slam|overhead|flying kick|charging|howling|leaping|mid-air/.test(text)) poseFamily = 'grounded_power_stance';

  const highImpact = /tracing a glowing sigil|ready stance on a cracked dungeon tile|overhead strike|shield braced|kneeling prayer|flying kick|ground slam|charging|mid-air|leaping/.test(text);
  const activeCasting = /tracing|casting with both hands|sigil|spell gesture|one-handed spell|speaking a spell|extended in subtle magic|opening a holy book/.test(text);
  const poseEnergy: PoseEnergy = highImpact ? 'high_action' : /raised|ready|draw|braced|guard|tracking|aiming/.test(text) ? 'ready' : /turning|walking|adjusting|checking|storytelling|performance/.test(text) ? 'controlled' : 'calm';
  const posePurpose: PosePurpose = poseFamily === 'performance_pose' || poseFamily === 'social_pose' ? 'social_read' : poseFamily === 'ritual_pose' || poseFamily === 'subtle_casting' ? 'ritual_read' : poseFamily === 'weapon_display' ? 'weapon_read' : highImpact ? 'action_read' : 'identity_read';
  return {
    poseFamily,
    poseEnergy,
    posePurpose,
    compatibleClassFamilies: [],
    compatibleWeaponFamilies: pose.tags,
    highImpact,
    activeCasting,
    fullBodySafe: !/workbench|table|altar|floor clutter|book pile/.test(text),
  };
}

const groundedNonArcaneThemeIds = new Set(['bounty_hunter', 'pirate_raider', 'urban_assassin', 'mercenary_captain', 'arena_champion', 'royal_guard', 'duel_saint']);
const runeFriendlyThemeIds = new Set(['academy_mage', 'rune_scholar', 'battle_mage', 'void_oracle', 'dream_walker', 'forbidden_researcher', 'pact_scholar', 'star_seer', 'clockwork_sapper', 'battle_engineer', 'spell_duelist']);
const runeFriendlyClasses: CharacterClass[] = ['wizard', 'sorcerer', 'warlock', 'artificer'];
const spyglassThemeIds = new Set(['pirate_raider', 'bounty_hunter', 'relic_thief', 'trail_warden', 'monster_tracker', 'swamp_tracker']);
const bureaucracyThemeIds = new Set(['bounty_hunter', 'monster_tracker', 'relic_thief', 'trail_warden', 'divine_archivist', 'academy_mage', 'archive_performer', 'dream_walker']);
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

const classIdentityThreshold = 3;
const identityInfluence = {
  classIdentity: 35,
  buildTemplate: 25,
  visualTheme: 15,
  narrativeMotif: 10,
  themeVariant: 5,
  motifVariant: 5,
  culture: 5,
};


const stylePresets: Record<StylePreset, { phrase: string; use: string }> = {
  heroic_dnd_concept_art: {
    phrase: 'heroic D&D character concept art, realistic digital fantasy art, high-end RPG production art, dark high fantasy and heroic fantasy, premium concept-art quality, detailed but readable, cinematic character-focused lighting, strong clean silhouette, detailed costume and gear, grounded fantasy materials, subtle painterly finish, no excessive background clutter',
    use: 'default stable D&D concept-art style',
  },
  realistic_dark_fantasy: {
    phrase: 'realistic dark fantasy character concept art, grounded materials, moody lighting, worn gear, mature atmosphere, detailed but restrained',
    use: 'grim, occult, rogue, and grave themes',
  },
  wuxia_inspired_high_fantasy: {
    phrase: 'realistic high fantasy character concept art with subtle wuxia-inspired elegance, flowing fabric, graceful motion, refined silhouettes, ornate but readable costume details',
    use: 'monks, temple guardians, fey, and elegant casters',
  },
  painterly_rpg_splash: {
    phrase: 'painterly RPG splash art, dramatic lighting, rich atmosphere, high fantasy action pose, detailed costume and gear, character-focused composition',
    use: 'cinematic splash art only',
  },
  grounded_character_sheet: {
    phrase: 'grounded fantasy character sheet art, full body visible, neutral readable pose, clean silhouette, minimal background, practical costume and gear design',
    use: 'character cards and design review',
  },
};

function getClassAnchor(className: CharacterClass): ClassAnchor {
  return classAnchors.find((anchor) => anchor.className === className) ?? classAnchors[0];
}

function pickCultureDetails(culture: CulturalOrigin): string[] {
  return uniqueCleanDetails([
    weightedPick(culture.clothingDetails.map((name) => ({ name, weight: 1 }))).name,
    weightedPick(culture.materials.map((name) => ({ name, weight: 1 }))).name,
    weightedPick(culture.ornaments.map((name) => ({ name, weight: 1 }))).name,
    weightedPick(culture.atmosphere.map((name) => ({ name, weight: 1 }))).name,
    weightedPick(culture.colorHints.map((name) => ({ name, weight: 1 }))).name,
  ]).slice(0, 4);
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function getRaceSize(race: RaceOption): SizeCategory {
  if (race.name === 'fairy') return 'tiny';
  if (['halfling', 'gnome'].includes(race.name)) return 'small';
  if (['goliath'].includes(race.name)) return 'large';
  return 'medium';
}

function uniqueCleanDetails(details: string[]): string[] {
  return [...new Set(details.map((detail) => detail.trim()).filter((detail) => detail.length > 0 && !detail.endsWith(',')))];
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickVisualDetails(theme: VisualTheme, variant: VisualThemeVariant): string[] {
  const stable = shuffled(uniqueCleanDetails(theme.visualDetails));
  const fresh = shuffled(uniqueCleanDetails(variant.visualDetails));
  return uniqueCleanDetails([...stable.slice(0, 2), ...fresh.slice(0, 1), ...shuffled([...stable, ...fresh])]).slice(0, 3);
}

function pickStoryDetails(motif: NarrativeMotif, variant: NarrativeVariant): string[] {
  const stable = uniqueCleanDetails(motif.storyDetails);
  const fresh = uniqueCleanDetails(variant.storyDetails);
  return shuffled(uniqueCleanDetails([...stable, ...fresh])).slice(0, 3);
}


function resolveFantasyPillarId(theme: VisualTheme): FantasyPillar['id'] {
  const profile = themeVisualProfiles.find((entry) => entry.themeId === theme.id);
  if (profile) return profile.fantasyPillarId;
  if (theme.buildTemplateId === 'holy_warrior' || theme.archetypeTags.includes('holy')) return 'divine';
  if (theme.buildTemplateId === 'frontier_hunter') return 'explorer';
  if (theme.buildTemplateId === 'shadow_skirmisher') return 'shadow';
  if (theme.buildTemplateId === 'fey_trickster' || theme.archetypeTags.includes('fey')) return 'fey';
  if (theme.buildTemplateId === 'battle_engineer') return 'artificer';
  if (theme.archetypeTags.includes('void') || theme.archetypeTags.includes('cursed')) return 'occult';
  if (theme.archetypeTags.includes('mage') || theme.archetypeTags.includes('scholar')) return 'scholar';
  if (theme.buildTemplateId === 'savage_berserker') return 'primal';
  return 'warrior';
}

const classPillarCompatibility: Record<CharacterClass, FantasyPillar['id'][]> = {
  fighter: ['warrior'],
  barbarian: ['primal', 'warrior'],
  paladin: ['divine', 'warrior'],
  wizard: ['scholar', 'mystic'],
  sorcerer: ['mystic', 'scholar'],
  warlock: ['occult', 'mystic'],
  cleric: ['divine', 'scholar'],
  ranger: ['explorer', 'primal'],
  druid: ['primal', 'explorer', 'fey'],
  rogue: ['shadow', 'explorer'],
  bard: ['fey', 'scholar', 'noble', 'shadow'],
  artificer: ['artificer', 'scholar'],
  monk: ['warrior', 'divine', 'primal'],
};

const buildTemplatePillarCompatibility: Record<string, FantasyPillar['id'][]> = {
  arcane_caster: ['scholar', 'mystic', 'occult', 'warrior'],
  holy_warrior: ['divine', 'warrior'],
  savage_berserker: ['primal', 'warrior'],
  shadow_skirmisher: ['shadow', 'explorer', 'maritime'],
  fey_trickster: ['fey', 'shadow', 'noble'],
  divine_scholar: ['divine', 'scholar', 'mystic'],
  battle_engineer: ['artificer', 'scholar', 'maritime'],
  frontier_hunter: ['explorer', 'primal'],
  wandering_martial_artist: ['warrior', 'divine', 'primal'],
  martial_veteran: ['warrior', 'noble', 'primal'],
  lorekeeper_bard: ['scholar', 'fey', 'noble', 'shadow'],
  skald_performer: ['fey', 'noble', 'shadow'],
};

function adjustedFantasyPillarId(theme: VisualTheme, primaryClass: CharacterClass, buildTemplate: BuildTemplate): FantasyPillar['id'] {
  const raw = resolveFantasyPillarId(theme);
  const classAllowed = classPillarCompatibility[primaryClass];
  const buildAllowed = buildTemplatePillarCompatibility[buildTemplate.id] ?? classAllowed;
  if (classAllowed.includes(raw) && buildAllowed.includes(raw)) return raw;
  const shared = classAllowed.find((pillar) => buildAllowed.includes(pillar));
  return shared ?? classAllowed[0] ?? raw;
}

function getFantasyPillar(theme: VisualTheme, primaryClass?: CharacterClass, buildTemplate?: BuildTemplate): FantasyPillar {
  const pillarId = primaryClass && buildTemplate ? adjustedFantasyPillarId(theme, primaryClass, buildTemplate) : resolveFantasyPillarId(theme);
  return fantasyPillars.find((pillar) => pillar.id === pillarId) ?? fantasyPillars[0];
}

function isPillarCompatible(seed: Pick<CharacterSeed, 'fantasyPillar' | 'primaryClass' | 'buildTemplate'>): boolean {
  return classPillarCompatibility[seed.primaryClass].includes(seed.fantasyPillar.id) && (buildTemplatePillarCompatibility[seed.buildTemplate.id] ?? []).includes(seed.fantasyPillar.id);
}


function selectAppearanceProfile(
  race: RaceOption,
  size: SizeCategory,
  primaryClass: CharacterClass,
  buildTemplate: BuildTemplate,
  visualTheme: VisualTheme,
  fantasyPillar: FantasyPillar,
  culturalOrigin: CulturalOrigin,
  context: SmartSelectionContext,
): CharacterAppearanceProfile {
  const baseCandidates = characterAppearanceProfiles.filter((profile) => profile.compatibleRaces.includes(race.name) && (!profile.compatibleSizes || profile.compatibleSizes.includes(size)));
  const immediatePrevious = [...recentSeedMemory].reverse().find((seed) => seed.race.name === race.name)?.appearanceProfile;
  const filteredCandidates = immediatePrevious
    ? baseCandidates.filter((profile) => {
      if (profile.id === immediatePrevious.id) return false;
      if (race.name === 'dwarf' && profile.facialHair === immediatePrevious.facialHair) return false;
      if (['tiefling', 'satyr', 'dragonborn', 'fairy'].includes(race.name)) {
        const previousFeatures = new Set(immediatePrevious.raceSpecificFeatures ?? []);
        if ((profile.raceSpecificFeatures ?? []).some((feature) => previousFeatures.has(feature))) return false;
      }
      return true;
    })
    : baseCandidates;
  const candidates = filteredCandidates.length >= 3 ? filteredCandidates : baseCandidates.filter((profile) => !immediatePrevious || profile.id !== immediatePrevious.id);
  const recentSameRace = recentSeedMemory.slice(-8).filter((seed) => seed.race.name === race.name).map((seed) => seed.appearanceProfile);
  return smartSelect(
    'Appearance',
    candidates.map((profile) => {
      let score = profile.weight + 40;
      const reasons = [`race ${race.name}`];
      if (profile.compatibleClasses?.includes(primaryClass)) { score += 10; reasons.push(`class ${primaryClass}`); }
      if (profile.compatibleBuildTemplates?.includes(buildTemplate.id)) { score += 12; reasons.push(`template ${buildTemplate.id}`); }
      if (profile.compatibleThemes?.includes(visualTheme.id)) { score += 24; reasons.push(`theme ${visualTheme.id}`); }
      if (profile.compatiblePillars?.includes(fantasyPillar.id)) { score += 14; reasons.push(`pillar ${fantasyPillar.id}`); }
      if (profile.compatibleCultures?.includes(culturalOrigin.id)) { score += 8; reasons.push(`culture ${culturalOrigin.id}`); }
      for (const previous of recentSameRace) {
        if (previous.id === profile.id) score -= 100;
        if (previous.ageCategory === profile.ageCategory) score -= 14;
        if (race.name === 'dwarf' && previous.facialHair === profile.facialHair) score -= 40;
        const previousFeatures = new Set(previous.raceSpecificFeatures ?? []);
        const overlap = (profile.raceSpecificFeatures ?? []).filter((feature) => previousFeatures.has(feature)).length;
        score -= overlap * 18;
      }
      return { item: profile, score, reasons };
    }),
    context,
    () => weightedPick(candidates),
  );
}

function bindDetail(detail: string, index: number): string {
  const anchors = ['worked into the costume design', 'visible as a single clean accent', 'integrated into the silhouette'];
  if (/tucked|fastened|pinned|tied|attached|braided|around the neck|on the cloak|on armor/.test(detail)) return detail;
  return `${detail} ${anchors[index % anchors.length]}`;
}

function splitVisualDetails(details: string[], environmentDetailLevel: EnvironmentDetailLevel, compositionMode: CompositionMode): { characterBoundDetails: string[]; sceneProps: string[]; backgroundProps: string[]; visualDetails: string[] } {
  const maxScene = environmentDetailLevel === 'cinematic' || compositionMode === 'cinematic_splash_art' ? 2 : 0;
  const maxBackground = environmentDetailLevel === 'cinematic' || compositionMode === 'cinematic_splash_art' ? 1 : 0;
  const sceneKeywords = /map|book|scroll|journal|letter|coin|box|instrument|tool|record|chart|registry|plans|papers|orders|contract|satchel|case/i;
  const sceneCandidates = details.filter((detail) => sceneKeywords.test(detail));
  const sceneProps = sceneCandidates.slice(0, maxScene);
  const backgroundProps = maxBackground > 0 ? details.filter((detail) => !sceneProps.some((scene) => scene.includes(detail))).slice(-maxBackground).map((detail) => `subtle background hint of ${detail}`) : [];
  const characterBoundDetails = details
    .filter((detail) => !sceneProps.some((scene) => scene.includes(detail)) && !backgroundProps.some((background) => background.includes(detail)))
    .slice(0, 4)
    .map(bindDetail);
  while (characterBoundDetails.length < Math.min(3, details.length)) {
    const fallback = details[characterBoundDetails.length];
    if (!fallback) break;
    characterBoundDetails.push(bindDetail(fallback, characterBoundDetails.length));
  }
  return { characterBoundDetails, sceneProps, backgroundProps, visualDetails: uniqueCleanDetails([...characterBoundDetails, ...sceneProps, ...backgroundProps]).slice(0, 5) };
}

function compositionPrompt(compositionMode: CompositionMode): string {
  if (compositionMode === 'character_concept_portrait') return 'focused character concept portrait, readable upper-to-full figure, limited background';
  if (compositionMode === 'cinematic_splash_art') return 'cinematic fantasy splash art, dynamic scene, character remains dominant';
  if (compositionMode === 'character_card') return 'clean character card illustration, readable silhouette, minimal background';
  return 'full-body character concept art, character fully visible, centered 3:4 portrait-friendly composition';
}

function appearanceSimilarity(a: CharacterAppearanceProfile, b: CharacterAppearanceProfile): number {
  let score = 0;
  if (a.id === b.id) score += 12;
  if (a.ageCategory === b.ageCategory) score += 6;
  if (a.faceType === b.faceType) score += 8;
  if (a.bodyType === b.bodyType) score += 6;
  if (a.hairStyle && a.hairStyle === b.hairStyle) score += 5;
  if (a.facialHair && a.facialHair === b.facialHair) score += 8;
  if (a.groomingStyle && a.groomingStyle === b.groomingStyle) score += 4;
  score += detailOverlap(a.raceSpecificFeatures ?? [], b.raceSpecificFeatures ?? []) * 4;
  score += detailOverlap(a.distinctiveMarks ?? [], b.distinctiveMarks ?? []) * 3;
  return score;
}

function getThemeVisualProfile(theme: VisualTheme): ThemeVisualProfile {
  const profile = themeVisualProfiles.find((entry) => entry.themeId === theme.id);
  if (profile) return profile;

  const pillarId = resolveFantasyPillarId(theme);
  const defaultMotif = pillarId === 'divine' ? 'cathedral_motif' : pillarId === 'fey' ? 'thorn_motif' : pillarId === 'shadow' ? 'rune_motif' : pillarId === 'primal' || pillarId === 'explorer' ? 'beast_motif' : pillarId === 'maritime' ? 'nautical_motif' : 'rune_motif';
  return {
    themeId: theme.id,
    fantasyPillarId: pillarId,
    visualFantasy: `Reads clearly as ${theme.label.toLowerCase()} through visible gear, silhouette, and props.`,
    visualMotifIds: [defaultMotif],
    detailPoolIds: [theme.id],
    armorLanguageIds: [],
    weaponLanguageIds: [],
    classBias: [],
  };
}

function getThemeContentProfiles(theme: VisualTheme, profile: ThemeVisualProfile): ThemeContentProfile[] {
  const ids = new Set([theme.id, ...profile.detailPoolIds]);
  const profiles = themeContentProfiles.filter((item) => ids.has(item.themeId));
  if (profiles.length > 0) return profiles;
  return [{
    themeId: theme.id,
    heroDetails: uniqueCleanDetails(theme.visualDetails),
    rareDetails: [],
    legendaryDetails: [],
    storyProps: uniqueCleanDetails(theme.visualDetails).slice(0, 2),
  }];
}

function pickFromDetails(details: string[], count: number): string[] {
  return shuffled(uniqueCleanDetails(details)).slice(0, Math.max(0, count));
}

function makeDetailBudget(companion: CompanionProfile | null, hasLegendary: boolean): VisualDetailBudget {
  return {
    majorVisualDetails: 2,
    minorVisualDetails: 2,
    storyProps: 1,
    cultureDetails: 2,
    companionDetails: companion ? companion.tier === 'minor' ? 1 : 2 : 0,
    legendaryDetails: hasLegendary ? 1 : 0,
  };
}

function buildVisualDetails(
  theme: VisualTheme,
  themeVariant: VisualThemeVariant,
  profile: ThemeVisualProfile,
  visualMotif: VisualMotif,
  armorLanguage: ArmorLanguage,
  weaponLanguage: WeaponLanguage,
  companion: CompanionProfile | null,
): { details: string[]; budget: VisualDetailBudget; legendary: string[]; companionDetails: string[] } {
  const content = getThemeContentProfiles(theme, profile);
  const heroDetails = content.flatMap((item) => item.heroDetails);
  const rareDetails = content.flatMap((item) => item.rareDetails);
  const legendaryPool = content.flatMap((item) => item.legendaryDetails);
  const storyProps = content.flatMap((item) => item.storyProps);
  const anatomicalDetails = content.flatMap((item) => [
    ...(item.faceDetails ?? []),
    ...(item.handDetails ?? []),
    ...(item.cloakDetails ?? []),
    ...(item.beltDetails ?? []),
    ...(item.jewelryDetails ?? []),
    ...(item.backgroundProps ?? []),
  ]);
  const companionPool = [
    ...(companion?.visualDetails ?? []),
    ...content.flatMap((item) => item.companionCompatibleDetails ?? []),
  ];
  const hasLegendary = legendaryPool.length > 0 && Math.random() < 0.025;
  const budget = makeDetailBudget(companion, hasLegendary);
  const legendary = hasLegendary ? pickFromDetails(legendaryPool, 1) : [];
  const companionDetails = companion ? pickFromDetails(companionPool, budget.companionDetails) : [];
  let details = uniqueCleanDetails([
    ...pickFromDetails(heroDetails, budget.majorVisualDetails),
    ...pickFromDetails([...rareDetails, ...anatomicalDetails, ...themeVariant.visualDetails, ...visualMotif.ornamentDetails, ...armorLanguage.detailHints, ...weaponLanguage.detailHints], budget.minorVisualDetails),
    ...pickFromDetails(storyProps, budget.storyProps),
    ...companionDetails,
    ...legendary,
  ]).slice(0, 8);

  if (theme.id === 'pirate_raider' && !hasAny(details, ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'])) {
    details = uniqueCleanDetails(['rope belt', ...details]).slice(0, 8);
  }

  return { details, budget, legendary, companionDetails };
}

function applyEquipmentLegendaryDetail(selection: { details: string[]; budget: VisualDetailBudget; legendary: string[]; companionDetails: string[] }, enchantment: EquipmentEnchantment): { details: string[]; budget: VisualDetailBudget; legendary: string[]; companionDetails: string[] } {
  if (enchantment.intensity !== 'legendary') return selection;
  const detail = enchantment.detailHints[0] ?? enchantment.label;
  const legendary = uniqueCleanDetails([detail, ...selection.legendary]).slice(0, 1);
  const details = uniqueCleanDetails([detail, ...selection.details]).slice(0, 8);
  return { ...selection, details, legendary, budget: { ...selection.budget, legendaryDetails: 1 } };
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


const smartRecentPicks = new Map<SmartSelectionLayer, string[]>();

export function resetSmartCandidatePoolMemory(): void {
  smartRecentPicks.clear();
  recentSeedMemory.length = 0;
}

function getCandidateId(item: unknown): string {
  if (typeof item === 'object' && item !== null) {
    const record = item as Record<string, unknown>;
    if (typeof record.id === 'string') return record.id;
    if (typeof record.name === 'string') return record.name;
    if (typeof record.label === 'string') return record.label;
  }

  return String(item);
}

function recentPenalty(layer: SmartSelectionLayer, id: string): number {
  const history = smartRecentPicks.get(layer) ?? [];
  const last10 = history.slice(-10).filter((item) => item === id).length;
  const last20 = history.slice(-20).filter((item) => item === id).length;
  const last50 = history.slice(-50).filter((item) => item === id).length;

  let penalty = 0;
  if (last10 >= 1) penalty -= 5;
  if (last20 >= 3) penalty -= 10;
  if (last50 >= 5) penalty -= 15;
  return penalty;
}

function rememberSmartPick(layer: SmartSelectionLayer, id: string): void {
  const history = smartRecentPicks.get(layer) ?? [];
  history.push(id);
  smartRecentPicks.set(layer, history.slice(-50));
}

function topPoolSize(candidateCount: number): number {
  if (candidateCount <= 3) return candidateCount;
  if (candidateCount <= 8) return 4;
  if (candidateCount <= 20) return 6;
  return 8;
}

function pickControlledPoolIndex(poolSize: number): number {
  if (poolSize <= 3) return Math.floor(Math.random() * poolSize);

  const roll = Math.random();
  const topEnd = Math.min(3, poolSize);
  const middleEnd = Math.min(6, poolSize);

  if (roll < 0.7) {
    return Math.floor(Math.random() * topEnd);
  }

  if (roll < 0.95 && middleEnd > topEnd) {
    return topEnd + Math.floor(Math.random() * (middleEnd - topEnd));
  }

  if (poolSize > middleEnd) {
    return middleEnd + Math.floor(Math.random() * (poolSize - middleEnd));
  }

  return Math.floor(Math.random() * poolSize);
}

function formatCandidatePool<T>(candidates: Array<SmartCandidate<T>>): string {
  return candidates
    .map((candidate) => `${getCandidateId(candidate.item)} ${Math.round(candidate.score)}`)
    .join(', ');
}

function smartSelect<T>(
  layer: SmartSelectionLayer,
  candidates: Array<SmartCandidate<T>>,
  context: SmartSelectionContext,
  baselinePick: () => T,
): T {
  if (!context.useSmartPool || candidates.length === 0) {
    return baselinePick();
  }

  const scored = candidates
    .map((candidate) => {
      const id = getCandidateId(candidate.item);
      const penalty = recentPenalty(layer, id);
      const score = candidate.score + penalty + Math.random() * 4;
      return { ...candidate, score, recentPenalty: penalty };
    })
    .sort((a, b) => b.score - a.score);

  const poolSize = topPoolSize(scored.length);
  const topPool = scored.slice(0, poolSize);
  const selected = topPool[pickControlledPoolIndex(topPool.length)];
  const selectedId = getCandidateId(selected.item);
  rememberSmartPick(layer, selectedId);

  context.trace.push(
    `${layer} candidates: ${scored.length}. Top pool (${poolSize}): ${formatCandidatePool(topPool)}. Selected: ${selectedId} ${Math.round(selected.score)}. Reason: random among top compatible pool${selected.recentPenalty < 0 ? `; recent penalty ${selected.recentPenalty}` : ''}${selected.reasons.length > 0 ? `; ${selected.reasons.join('; ')}` : ''}.`,
  );

  return selected.item;
}

function optionScore<T extends { weight: number; tags?: string[]; name?: string; id?: string }>(
  option: T,
  preferredNames: string[],
  preferredTags: string[] = [],
): number {
  let score = option.weight;
  if (option.name && preferredNames.includes(option.name)) score += 20;
  if (option.id && preferredNames.includes(option.id)) score += 20;
  if (option.tags) score += option.tags.filter((tag) => preferredTags.includes(tag)).length * 8;
  return score;
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
  if (mode === 'chaos') {
    return [weightedPick(characterClasses).name];
  }

  return [weightedPick(characterClasses).name];
}

function selectCuratedMulticlassProfile(race: RaceOption, size: SizeCategory, context: SmartSelectionContext): CuratedMulticlassProfile {
  const candidates = curatedMulticlassProfiles.filter((profile) =>
    !(profile.forbiddenRaces ?? []).includes(race.name)
    && (!profile.allowedRaces || profile.allowedRaces.includes(race.name))
    && (!profile.allowedSizes || profile.allowedSizes.includes(size)),
  );
  return smartSelect(
    'Curated Multiclass',
    candidates.map((profile) => ({ item: profile, score: profile.weight + 40, reasons: [`${profile.primaryClass}/${profile.secondaryClass}`] })),
    context,
    () => weightedPick(candidates),
  );
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

  if (isCartographerLike(archetype) && ['cleric', 'paladin'].includes(primaryClass)) {
    return ['divine_scholar', 'holy_warrior'];
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
    if (isCartographerLike(archetype)) return ['shadow_skirmisher', 'divine_scholar', 'fey_trickster'];
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
    return isCartographerLike(archetype) ? ['frontier_hunter', 'divine_scholar', 'shadow_skirmisher'] : ['frontier_hunter', 'shadow_skirmisher'];
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

  if (isCartographerLike(archetype)) {
    const hasCartographerTool = weapons.some((weapon) => template.allowedWeapons.includes(weapon.name) && hasAny(weapon.tags, ['map', 'book', 'scroll', 'compass', 'staff']));
    const hasCartographerPose = poses.some((pose) => template.allowedPoses.includes(pose.name) && hasAny(pose.tags, ['map', 'tools']));
    if (!hasCartographerTool || !hasCartographerPose) {
      return -1;
    }
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

function selectBuildTemplate(primaryClass: CharacterClass, archetype: ArchetypeOption, race: RaceOption, mode: Mode, context: SmartSelectionContext): TemplateSelection {
  const scored = buildTemplates
    .map((template) => ({ template, score: templateScore(template, primaryClass, archetype, race, mode) }))
    .filter((entry) => entry.score > 1);

  if (scored.length > 0) {
    const sizeSafeScored = race.name === 'fairy' && scored.some((entry) => entry.template.id !== 'savage_berserker')
      ? scored.filter((entry) => entry.template.id !== 'savage_berserker')
      : scored;
    const smartScoredWithoutScholar = context.useSmartPool && !isCartographerLike(archetype) && sizeSafeScored.some((entry) => entry.template.id !== 'divine_scholar')
      ? sizeSafeScored.filter((entry) => entry.template.id !== 'divine_scholar')
      : sizeSafeScored;
    const smartScored = context.useSmartPool && primaryClass !== 'ranger' && smartScoredWithoutScholar.some((entry) => entry.template.id !== 'frontier_hunter')
      ? smartScoredWithoutScholar.filter((entry) => entry.template.id !== 'frontier_hunter')
      : smartScoredWithoutScholar;
    const baselinePick = () => {
      const bestScore = Math.max(...sizeSafeScored.map((entry) => entry.score));
      const best = sizeSafeScored.filter((entry) => entry.score === bestScore).map((entry) => ({ ...entry.template, weight: entry.template.weight }));
      return weightedPick(best);
    };
    const template = smartSelect(
      'Build Template',
      smartScored.map((entry) => ({
        item: entry.template,
        score: entry.score * 12 + entry.template.weight - (entry.template.id === 'divine_scholar' && !isCartographerLike(archetype) ? 50 : 0) - (entry.template.id === 'frontier_hunter' ? 260 : 0),
        reasons: [`class ${primaryClass}`, `preferred ${preferredTemplateIds(primaryClass, archetype, mode).join(' / ')}`, ...(entry.template.id === 'divine_scholar' && !isCartographerLike(archetype) ? ['scholar branch soft penalty'] : []), ...(entry.template.id === 'frontier_hunter' ? ['single-theme frontier soft penalty'] : [])],
      })),
      context,
      baselinePick,
    );
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


function selectVisualTheme(template: BuildTemplate, archetype: ArchetypeOption, race: RaceOption, context: SmartSelectionContext): VisualTheme {
  const candidates = visualThemes.filter((theme) => theme.buildTemplateId === template.id);
  const forcedByArchetype = candidates.filter((theme) => {
    if (archetype.tags.includes('void')) return theme.id === 'void_oracle';
    if (archetype.tags.includes('pirate')) return theme.id === 'pirate_raider' || theme.id === 'lore_skald' || theme.id === 'relic_thief' || theme.id === 'wandering_storyteller';
    if (archetype.tags.includes('cartographer')) return ['relic_thief', 'academy_mage', 'ritualist', 'divine_archivist', 'dream_walker'].includes(theme.id);
    if (archetype.name === 'exiled temple guardian') return ['temple_guardian', 'battle_chaplain', 'grave_warden'].includes(theme.id);
    return false;
  });

  const basePool = forcedByArchetype.length > 0 ? forcedByArchetype : candidates;
  const bulkyFairyThemes = new Set(['raider_king', 'arena_champion', 'tribal_champion', 'storm_warrior', 'monster_slayer_veteran']);
  const pool = race.name === 'fairy' && basePool.some((theme) => !bulkyFairyThemes.has(theme.id))
    ? basePool.filter((theme) => !bulkyFairyThemes.has(theme.id))
    : basePool;
  const scored = pool.map((theme) => {
    let score = theme.weight + 35;
    const reasons = [`template ${template.id}`];
    if (theme.archetypeNames.includes(archetype.name)) {
      score += 24;
      reasons.push(`archetype ${archetype.name}`);
    }
    const tagMatches = theme.archetypeTags.filter((tag) => archetype.tags.includes(tag)).length;
    score += tagMatches * 10;
    if (tagMatches > 0) reasons.push(`${tagMatches} archetype tag match(es)`);
    if (race.name === 'fairy' || race.name === 'satyr') {
      const feyFit = theme.id.includes('fey') || theme.id.includes('sprite') || theme.archetypeTags.includes('fey');
      score += feyFit ? 10 : -4;
      if (feyFit) reasons.push('fey race fit');
    }
    if (scholarThemeIds.has(theme.id)) score -= 30;
    if (theme.id === 'trail_warden') score -= 55;
    if (theme.id === 'battle_chaplain') score -= 20;
    return { item: theme, score, reasons };
  });

  if (scored.length === 0) {
    return weightedPick(visualThemes.filter((theme) => theme.buildTemplateId === template.id));
  }

  return smartSelect(
    'Visual Theme',
    scored,
    context,
    () => {
      const baseline = scored.map((entry) => ({ ...entry.item, weight: Math.max(1, entry.score) }));
      const bestScore = Math.max(...baseline.map((theme) => theme.weight));
      return weightedPick(baseline.filter((theme) => theme.weight === bestScore));
    },
  );
}


function selectCuratedVisualTheme(profile: CuratedMulticlassProfile, template: BuildTemplate, archetype: ArchetypeOption, race: RaceOption, context: SmartSelectionContext): VisualTheme {
  const bulkyFairyThemes = new Set(['raider_king', 'arena_champion', 'tribal_champion', 'storm_warrior', 'monster_slayer_veteran']);
  const candidates = visualThemes.filter((theme) => theme.buildTemplateId === template.id && profile.compatibleThemes.includes(theme.id) && !(profile.forbiddenThemes ?? []).includes(theme.id));
  const safeCandidates = race.name === 'fairy' && candidates.some((theme) => !bulkyFairyThemes.has(theme.id))
    ? candidates.filter((theme) => !bulkyFairyThemes.has(theme.id))
    : candidates;
  if (safeCandidates.length === 0) return selectVisualTheme(template, archetype, race, context);
  return smartSelect(
    'Visual Theme',
    safeCandidates.map((theme) => ({
      item: theme,
      score: theme.weight + 45 + (profile.preferredThemes.includes(theme.id) ? 35 : 0) + theme.archetypeTags.filter((tag) => archetype.tags.includes(tag)).length * 8,
      reasons: [`curated multiclass ${profile.id}`, `template ${template.id}`],
    })),
    context,
    () => weightedPick(safeCandidates.map((theme) => ({ ...theme, weight: theme.weight + (profile.preferredThemes.includes(theme.id) ? 10 : 0) }))),
  );
}

function themeNames(names: string[], fallback: string[]): string[] {
  return names.length > 0 ? names : fallback;
}

function selectVisualThemeVariant(theme: VisualTheme, context: SmartSelectionContext, fxOptions: string[] = theme.preferredFx): VisualThemeVariant {
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

  const scored = variants.map((variant) => ({
    item: variant,
    score: variant.weight + variant.preferredFx.filter((fx) => fxOptions.includes(fx)).length * 8 + 20,
    reasons: [`theme ${theme.id}`, `${variant.preferredFx.filter((fx) => fxOptions.includes(fx)).length} FX fit(s)`],
  }));

  return smartSelect(
    'Visual Theme Variant',
    scored,
    context,
    () => weightedPick(variants.map((variant) => ({
      ...variant,
      weight: Math.max(1, variant.weight + variant.preferredFx.filter((fx) => fxOptions.includes(fx)).length),
    }))),
  );
}


type MotifSelection = {
  motif: NarrativeMotif;
  reason: string;
};

function selectNarrativeMotif(seed: Pick<CharacterSeed, 'primaryClass' | 'race' | 'archetype' | 'buildTemplate' | 'visualTheme'>, context: SmartSelectionContext): MotifSelection {
  const allTags = [...seed.archetype.tags, seed.buildTemplate.id, seed.visualTheme.id];
  const candidates = narrativeMotifs.filter((motif) => {
    if (motif.id === 'seasoned_adventurer') return false;
    const buildMatch = motif.compatibleBuildTemplates.length === 0 || motif.compatibleBuildTemplates.includes(seed.buildTemplate.id);
    const themeMatch = motif.compatibleVisualThemes.length === 0 || motif.compatibleVisualThemes.includes(seed.visualTheme.id);
    const classAllowed = !motif.forbiddenClasses.includes(seed.primaryClass);
    const tagsAllowed = !motif.forbiddenTags.some((tag) => allTags.includes(tag));
    return buildMatch && themeMatch && classAllowed && tagsAllowed;
  });

  const commonMotifs = ['exile', 'lost_heir'];
  const motifPool = context.useSmartPool && candidates.some((motif) => !commonMotifs.includes(motif.id))
    ? candidates.filter((motif) => !commonMotifs.includes(motif.id))
    : context.useSmartPool && candidates.some((motif) => motif.id !== 'exile')
      ? candidates.filter((motif) => motif.id !== 'exile')
      : candidates;

  const scored = motifPool.map((motif) => {
    let score = motif.weight;
    score += motif.archetypeTags.filter((tag) => seed.archetype.tags.includes(tag)).length * 4;
    if (motif.classBias.includes(seed.primaryClass)) score += 3;
    if (motif.raceBias.includes(seed.race.name)) score += 3;
    if (motif.compatibleVisualThemes.includes(seed.visualTheme.id)) score += 5;
    return { ...motif, weight: Math.max(1, score) };
  });

  if (scored.length > 0) {
    const motif = smartSelect(
      'Narrative Motif',
      scored.map((motif) => ({
        item: motif,
        score: motif.weight + 25 - (motif.id === 'exile' ? 90 : 0) - (motif.id === 'lost_heir' ? 45 : 0),
        reasons: [`template ${seed.buildTemplate.id}`, `theme ${seed.visualTheme.id}`, ...(motif.id === 'exile' ? ['generic exile soft penalty'] : []), ...(motif.id === 'lost_heir' ? ['lost heir freshness penalty'] : [])],
      })),
      context,
      () => {
        const bestScore = Math.max(...scored.map((item) => item.weight));
        return weightedPick(scored.filter((item) => item.weight === bestScore));
      },
    );
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

function selectNarrativeVariant(motif: NarrativeMotif, context: SmartSelectionContext, fxOptions: string[] = motif.fxBias): NarrativeVariant {
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

  const scored = variants.map((variant) => ({
    item: variant,
    score: variant.weight + variant.fxBias.filter((fx) => fxOptions.includes(fx)).length * 8 + 15,
    reasons: [`motif ${motif.id}`, `${variant.fxBias.filter((fx) => fxOptions.includes(fx)).length} FX fit(s)`],
  }));

  return smartSelect(
    'Narrative Variant',
    scored,
    context,
    () => weightedPick(variants.map((variant) => ({
      ...variant,
      weight: Math.max(1, variant.weight + variant.fxBias.filter((fx) => fxOptions.includes(fx)).length),
    }))),
  );
}

function templateOptions<T extends { name: string }>(options: Array<WeightedOption<T>>, names: string[]): Array<WeightedOption<T>> {
  const filtered = pickByName(options, names);
  return filtered.length > 0 ? filtered : options;
}

function classAnchorWeaponOptions(options: Array<WeightedOption<WeaponOption>>, primaryClass: CharacterClass): Array<WeightedOption<WeaponOption>> {
  const anchor = getClassAnchor(primaryClass);
  const anchored = options.filter((weapon) => hasAny(weapon.tags, anchor.weaponTags));
  return anchored.length > 0 ? anchored : options;
}

function classAnchorArmorOptions(options: Array<WeightedOption<ArmorOption>>, primaryClass: CharacterClass): Array<WeightedOption<ArmorOption>> {
  const anchor = getClassAnchor(primaryClass);
  const anchored = options.filter((armor) => hasAny(armor.tags, anchor.armorTags));
  return anchored.length > 0 ? anchored : options;
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
  const sizeFilter = (armor: WeightedOption<ArmorOption>) => !(size === 'tiny' && (armor.name === 'full plate with engraved pauldrons' || armor.tags.includes('heavy')));
  const preferredOptions = templateOptions(armors, names).filter(sizeFilter);
  const options = preferredOptions.length > 0 ? preferredOptions : templateOptions(armors, template.allowedArmor).filter(sizeFilter);

  return prefer(classAnchorArmorOptions(options.length > 0 ? options : templateOptions(armors, template.allowedArmor), primaryClass), [
    (armor) => casterClasses.includes(primaryClass) && armor.tags.includes('cloth'),
    (armor) => archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen') ? hasAny(armor.tags, ['heavy', 'medium', 'metal']) : false,
    (armor) => isScholarLike(archetype) && primaryClass !== 'cleric' ? armor.tags.includes('cloth') : false,
  ]);
}

function constrainedWeaponOptions(template: BuildTemplate, archetype: ArchetypeOption, size: SizeCategory, race: RaceOption, primaryClass: CharacterClass, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredWeapons ?? []).filter((name) => template.allowedWeapons.includes(name)), template.allowedWeapons);
  const sizeFilter = (weapon: WeightedOption<WeaponOption>) => !((['tiny', 'small'].includes(size) || race.tags.includes('fey')) && (weapon.tags.includes('oversized') || weapon.tags.includes('greataxe') || weapon.tags.includes('greatsword') || /heavy greatsword|oversized maul/i.test(weapon.name)));
  const preferredOptions = templateOptions(weapons, names).filter(sizeFilter);
  const templateAllowed = templateOptions(weapons, template.allowedWeapons).filter(sizeFilter);
  const options = preferredOptions.length > 0 ? preferredOptions : templateAllowed;
  const sourceOptions = isCartographerLike(archetype) ? templateAllowed : options;
  if (race.name === 'fairy') {
    const tinyWeaponPool = [...sourceOptions, ...templateAllowed];
    const seenTinyWeapons = new Set<string>();
    const lightTinyOptions = tinyWeaponPool.filter((weapon) => {
      if (seenTinyWeapons.has(weapon.name)) return false;
      seenTinyWeapons.add(weapon.name);
      return !weapon.tags.includes('shield') && !hasAny(weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace']);
    });
    if (lightTinyOptions.length > 0) return lightTinyOptions;
  }
  if (primaryClass === 'bard') {
    const bardOptions = sourceOptions.filter((weapon) =>
      hasAny(weapon.tags, ['instrument', 'lute', 'flute', 'rapier', 'fey-focus'])
      || /song|lute|flute|rapier|viol|lyre|instrument|performance|storykeeper/i.test(weapon.name),
    );
    if (bardOptions.length > 0) return bardOptions;
  }

  return prefer(classAnchorWeaponOptions(sourceOptions.length > 0 ? sourceOptions : templateOptions(weapons, template.allowedWeapons), primaryClass), [
    (weapon) => isCartographerLike(archetype) && hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']),
    (weapon) => (archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen')) && hasAny(weapon.tags, ['shield', 'mace', 'warhammer', 'holy-focus']),
    (weapon) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(weapon.tags, ['bow', 'spear', 'dual-blades', 'handaxe']),
    (weapon) => hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(weapon.tags, ['rapier', 'instrument', 'flute', 'dagger', 'fey-focus']),
    (weapon) => hasAny(archetype.tags, ['academy', 'arcane', 'mage']) && hasAny(weapon.tags, ['staff', 'book', 'orb', 'wand']),
  ]);
}

function uniqueByName<T extends { name: string }>(items: Array<WeightedOption<T>>): Array<WeightedOption<T>> {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function constrainedPoseOptions(template: BuildTemplate, archetype: ArchetypeOption, weapon: WeaponOption, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredPoses ?? []).filter((name) => template.allowedPoses.includes(name)), template.allowedPoses);
  const templatePoseOptions = templateOptions(poses, template.allowedPoses);
  const globalSafeOptions = poses.filter((pose) => safeFullBodyPoseNames.has(pose.name));
  const templatePlusSafe = uniqueByName([...templatePoseOptions, ...globalSafeOptions]);
  const rawOptions = isCartographerLike(archetype) ? templatePoseOptions : uniqueByName([...templateOptions(poses, names), ...globalSafeOptions]);
  const fallbackOptions = templatePlusSafe;
  const compatible = (pose: WeightedOption<PoseOption>) => {
    if (pose.tags.includes('shield') && !weapon.tags.includes('shield')) return false;
    if (pose.tags.includes('bow') && !hasAny(weapon.tags, ['bow', 'longbow', 'shortbow'])) return false;
    if (pose.tags.includes('rapier') && !weapon.tags.includes('rapier')) return false;
    if (pose.tags.includes('staff') && !weapon.tags.includes('staff')) return false;
    if (pose.tags.includes('dual-blades') && !weapon.tags.includes('dual-blades')) return false;
    if (pose.tags.includes('heavy-melee') && !hasAny(weapon.tags, ['heavy', 'greataxe', 'greatsword', 'maul'])) return false;
    if (pose.tags.includes('monk') && template.id !== 'wandering_martial_artist') return false;
    if (pose.tags.includes('performance') && !['skald_performer', 'lorekeeper_bard', 'fey_trickster'].includes(template.id)) return false;
    if (pose.tags.includes('social_character_pose') && !['skald_performer', 'lorekeeper_bard', 'fey_trickster', 'shadow_skirmisher'].includes(template.id)) return false;
    return true;
  };
  const options = rawOptions.filter(compatible);
  const safeOptions = options.length > 0 ? options : fallbackOptions.filter(compatible);

  return prefer(safeOptions.length > 0 ? safeOptions : fallbackOptions, [
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

function bardHasPerformerAnchor(seed: Pick<CharacterSeed, 'primaryClass' | 'weapon' | 'weaponLanguage' | 'armor' | 'armorLanguage' | 'pose' | 'visualTheme'>): boolean {
  if (seed.primaryClass !== 'bard') return true;
  const text = normalizeText([
    seed.weapon.name,
    seed.weaponLanguage.label,
    seed.armor.name,
    seed.armorLanguage.label,
    seed.pose.name,
    seed.visualTheme.label,
  ].join(' '));
  return /lute|flute|instrument|song|skald|perform|story|rapier|cane sword|stage|bard|music|courtly|flourish/.test(text);
}

function isBardWizardRisk(seed: Pick<CharacterSeed, 'primaryClass' | 'weapon' | 'pose'>): boolean {
  if (seed.primaryClass !== 'bard') return false;
  const weaponText = normalizeText(seed.weapon.name);
  const poseText = normalizeText(seed.pose.name);
  return /spellbook|grimoire|weathered spellbook|small spellbook/.test(weaponText) || /tracing a glowing sigil|sigil trace/.test(poseText);
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


function smartPickArmor(options: Array<WeightedOption<ArmorOption>>, primaryClass: CharacterClass, context: SmartSelectionContext): ArmorOption {
  const anchor = getClassAnchor(primaryClass);
  return smartSelect(
    'Armor',
    options.map((armor) => ({
      item: armor,
      score: optionScore(armor, [], anchor.armorTags) + (hasAny(armor.tags, anchor.armorTags) ? 35 : 0),
      reasons: hasAny(armor.tags, anchor.armorTags) ? [`class anchor ${primaryClass}`] : [],
    })),
    context,
    () => weightedPick(options),
  );
}

function smartPickWeapon(options: Array<WeightedOption<WeaponOption>>, primaryClass: CharacterClass, archetype: ArchetypeOption, context: SmartSelectionContext): WeaponOption {
  const anchor = getClassAnchor(primaryClass);
  const candidateOptions = isCartographerLike(archetype)
    ? options.filter((weapon) => hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']))
    : options;
  const scoredOptions = candidateOptions.length > 0 ? candidateOptions : options;
  return smartSelect(
    'Weapon / Tool',
    scoredOptions.map((weapon) => {
      let score = optionScore(weapon, [], anchor.weaponTags) + (hasAny(weapon.tags, anchor.weaponTags) ? 45 : 0);
      const reasons = hasAny(weapon.tags, anchor.weaponTags) ? [`class anchor ${primaryClass}`] : [];
      if (isCartographerLike(archetype) && hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff'])) {
        score += 100;
        reasons.push('cartographer tool fit');
      }
      if (hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(weapon.tags, ['bow', 'spear', 'dual-blades', 'handaxe'])) {
        score += 20;
        reasons.push('frontier weapon fit');
      }
      if (hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(weapon.tags, ['rapier', 'instrument', 'flute', 'dagger', 'fey-focus'])) {
        score += 20;
        reasons.push('fey/trickster tool fit');
      }
      return { item: weapon, score, reasons };
    }),
    context,
    () => weightedPick(scoredOptions),
  );
}


function avoidBarbarianBowWeapon(options: Array<WeightedOption<WeaponOption>>, selected: WeaponOption, classes: CharacterClass[]): WeaponOption {
  if (!classes.includes('barbarian') || !hasAny(selected.tags, ['bow', 'longbow', 'shortbow'])) return selected;
  return options.find((weapon) => !hasAny(weapon.tags, ['bow', 'longbow', 'shortbow'])) ?? selected;
}


function isRuneMotifNoisyForTheme(motif: VisualMotif, theme: VisualTheme, buildTemplate: BuildTemplate, primaryClass?: CharacterClass): boolean {
  if (motif.id !== 'rune_motif') return false;
  if (runeFriendlyThemeIds.has(theme.id) || theme.id.includes('rune') || theme.id.includes('arcane') || theme.id.includes('void') || theme.id.includes('dream')) return false;
  if (runeFriendlyClasses.includes(primaryClass ?? 'fighter')) return false;
  if (['arcane_caster', 'battle_engineer', 'divine_scholar'].includes(buildTemplate.id)) return false;
  return groundedNonArcaneThemeIds.has(theme.id) || ['martial_veteran', 'shadow_skirmisher', 'frontier_hunter', 'savage_berserker'].includes(buildTemplate.id);
}

function recentPosePenalty(pose: PoseOption, primaryClass?: CharacterClass, visualTheme?: VisualTheme): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (recentSeedMemory.slice(-8).some((seed) => seed.pose.name === pose.name)) {
    score -= 220;
    reasons.push('exact pose cooldown last 8');
  }
  if (recentSeedMemory.slice(-12).some((seed) => seed.pose.name === pose.name && seed.primaryClass === primaryClass)) {
    score -= 220;
    reasons.push('pose + class cooldown last 12');
  }
  if (!highImpactPoseNames.has(pose.name)) return { score, reasons };
  const recentFive = recentSeedMemory.slice(-5);
  if (recentFive.some((seed) => seed.pose.name === pose.name)) {
    score -= 160;
    reasons.push('high-impact pose cooldown last 5');
  }
  const recentTen = recentSeedMemory.slice(-10);
  if (recentTen.some((seed) => seed.pose.name === pose.name && (seed.primaryClass === primaryClass || seed.visualTheme.id === visualTheme?.id))) {
    score -= 260;
    reasons.push('high-impact pose + class/theme cooldown last 10');
  }
  return { score, reasons };
}

function smartPickPose(options: Array<WeightedOption<PoseOption>>, weapon: WeaponOption, archetype: ArchetypeOption, context: SmartSelectionContext, poseContext: { primaryClass?: CharacterClass; visualTheme?: VisualTheme } = {}): PoseOption {
  const candidateOptions = isCartographerLike(archetype)
    ? options.filter((pose) => hasAny(pose.tags, ['map', 'tools']))
    : options;
  const baseOptions = candidateOptions.length > 0 ? candidateOptions : options;
  const cooldownOptions = baseOptions.filter((pose) => {
    const exactRecent = recentSeedMemory.slice(-8).some((seed) => seed.pose.name === pose.name);
    const sameClassRecent = recentSeedMemory.slice(-12).some((seed) => seed.pose.name === pose.name && seed.primaryClass === poseContext.primaryClass);
    if (exactRecent || sameClassRecent) return false;
    if (!highImpactPoseNames.has(pose.name)) return true;
    const recentlyUsed = recentSeedMemory.slice(-5).some((seed) => seed.pose.name === pose.name);
    const sameClassOrTheme = recentSeedMemory.slice(-10).some((seed) => seed.pose.name === pose.name && (seed.primaryClass === poseContext.primaryClass || seed.visualTheme.id === poseContext.visualTheme?.id));
    return !recentlyUsed && !sameClassOrTheme;
  });
  const nonHighImpactFallback = options.filter((pose) => !highImpactPoseNames.has(pose.name));
  const scoredOptions = cooldownOptions.length > 0 ? cooldownOptions : nonHighImpactFallback.length > 0 ? nonHighImpactFallback : baseOptions;
  return smartSelect(
    'Pose',
    scoredOptions.map((pose) => {
      let score = pose.weight + 20;
      const reasons: string[] = [];
      const metadata = poseMetadata(pose);
      if (['tracing a glowing sigil in the air', 'ready stance on a cracked dungeon tile', 'overhead strike with a heavy blade'].includes(pose.name)) { score -= 150; reasons.push('high-impact pose reduced'); }
      if (['shield braced against incoming sparks', 'kneeling prayer as holy light gathers', 'ground slam sending dust through the scene', 'flying kick with prayer beads suspended midair'].includes(pose.name)) { score -= 105; reasons.push('ritual/defensive high-impact reduced'); }
      if (metadata.highImpact) { score -= 40; reasons.push('pose family high-impact soft cap'); }
      const preferredFamilies = poseContext.primaryClass ? classPoseFamilyPreferences[poseContext.primaryClass] ?? [] : [];
      if (preferredFamilies.includes(metadata.poseFamily)) { score += 55; reasons.push(`class pose family ${metadata.poseFamily}`); }
      if (metadata.fullBodySafe && safeFullBodyPoseNames.has(pose.name)) { score += 55; reasons.push('low-clutter full-body pose'); }
      const recentFamilyUses = recentSeedMemory.slice(-12).filter((seed) => poseMetadata(seed.pose).poseFamily === metadata.poseFamily).length;
      if (recentFamilyUses >= 3) { score -= recentFamilyUses * 18; reasons.push('pose family cooldown'); }
      const recentClassFamilyUses = recentSeedMemory.slice(-12).filter((seed) => seed.primaryClass === poseContext.primaryClass && poseMetadata(seed.pose).poseFamily === metadata.poseFamily).length;
      if (recentClassFamilyUses >= 2) { score -= recentClassFamilyUses * 22; reasons.push('class pose family cooldown'); }
      if (pose.name === 'weapon raised in a decisive challenge') { score -= 35; reasons.push('challenge pose softened'); }
      if (hasAny(weapon.tags, ['bow', 'longbow', 'shortbow']) && pose.tags.includes('bow')) { score += 40; reasons.push('bow pose fits weapon'); }
      if (weapon.tags.includes('shield') && pose.tags.includes('shield')) { score += 40; reasons.push('shield pose fits weapon'); }
      if (weapon.tags.includes('dual-blades') && pose.tags.includes('dual-blades')) { score += 40; reasons.push('dual-blades pose fits weapon'); }
      if (weapon.tags.includes('rapier') && pose.tags.includes('rapier')) { score += 40; reasons.push('rapier pose fits weapon'); }
      if (hasAny(weapon.tags, ['heavy', 'greataxe', 'greatsword']) && pose.tags.includes('heavy-melee')) { score += 40; reasons.push('heavy melee pose fits weapon'); }
      if (hasAny(weapon.tags, ['staff', 'orb', 'wand', 'book', 'magic-focus', 'holy-focus']) && hasAny(pose.tags, ['casting', 'prayer'])) { score += 30; reasons.push('focus casting pose fit'); }
      if (hasAny(weapon.tags, ['tool', 'mechanical-focus', 'map', 'compass', 'scroll']) && hasAny(pose.tags, ['tools', 'map'])) { score += 30; reasons.push('tool pose fit'); }
      if (isCartographerLike(archetype) && hasAny(pose.tags, ['map', 'tools'])) { score += 100; reasons.push('cartographer pose fit'); }
      if (hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(pose.tags, ['tracking', 'bow', 'general'])) { score += 10; reasons.push('archetype pose fit'); }
      if (['staff planted on the ground', 'speaking a spell softly', 'one hand extended in subtle magic, not full sigil', 'book held closed under one arm'].includes(pose.name)) { score += 45; reasons.push('calm caster pose preference'); }
      if (['standing calmly with weapon lowered', 'resting one hand on weapon pommel', 'bow held lowered after tracking', 'close-quarters ready stance'].includes(pose.name)) { score += 35; reasons.push('stable full-body pose preference'); }
      const cooldown = recentPosePenalty(pose, poseContext.primaryClass, poseContext.visualTheme);
      score += cooldown.score;
      reasons.push(...cooldown.reasons);
      return { item: pose, score, reasons };
    }),
    context,
    () => weightedPick(scoredOptions),
  );
}

function smartPickSimpleOption<T extends WeightedOption<{ name: string; tags: string[] }>>(
  layer: SmartSelectionLayer,
  options: T[],
  preferredTags: string[],
  context: SmartSelectionContext,
): T {
  return smartSelect(
    layer,
    options.map((option) => ({
      item: option,
      score: optionScore(option, [], preferredTags) + 15,
      reasons: option.tags.some((tag) => preferredTags.includes(tag)) ? ['tag fit'] : [],
    })),
    context,
    () => weightedPick(options),
  );
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



function visualMotifCompatible(motif: VisualMotif, theme: VisualTheme, buildTemplate: BuildTemplate, profile: ThemeVisualProfile): boolean {
  return profile.visualMotifIds.includes(motif.id) || motif.compatibleThemes.includes(theme.id) || motif.compatibleBuildTemplates.includes(buildTemplate.id);
}

function weaponLanguageCompatible(language: WeaponLanguage, weapon: WeaponOption, buildTemplate: BuildTemplate, theme: VisualTheme, profile: ThemeVisualProfile): boolean {
  if (!language.baseWeaponTags.some((tag) => weapon.tags.includes(tag))) return false;
  if (language.id === 'plain_weapon_language') return language.compatibleBuildTemplates.includes(buildTemplate.id);
  const isBookOnly = hasAny(weapon.tags, ['book', 'spellbook', 'grimoire']) && !weapon.tags.includes('staff');
  const isStaffOnly = weapon.tags.includes('staff') && !hasAny(weapon.tags, ['book', 'spellbook', 'grimoire']);
  const isMapTool = hasAny(weapon.tags, ['scroll', 'map', 'compass', 'case']) && !hasAny(weapon.tags, ['sword', 'blade', 'hammer', 'warhammer', 'mace', 'bow']);
  const isOrbOnly = weapon.tags.includes('orb') && !weapon.tags.includes('staff');
  if (isBookOnly && language.id !== 'dream_journal_focus' && /staff|spear|blade|bow|hammer|maul|axe|lute|flute|calibrator|wrench|gauntlet|orb|crystal|focus/i.test(language.id)) return false;
  if (isStaffOnly && /book|grimoire|map|scroll|compass|lute|dagger|blade|bow|hammer|axe|calibrator|wrench|gauntlet/i.test(language.id)) return false;
  if (isMapTool && /blade|sword|dagger|bow|hammer|maul|axe|staff|lute|flute/i.test(language.id)) return false;
  if (isMapTool && /spellbook|grimoire|living_spellbook|weathered_spellbook|holy_book|prayer_book/i.test(language.id) && !/scroll|map|compass|case|songbook/.test(language.id)) return false;
  if (isOrbOnly && /staff|book|grimoire|map|scroll|blade|sword|bow|hammer|axe/i.test(language.id)) return false;
  if (weapon.tags.includes('staff') && /orb|crystal|lens_focus|relic_focus|glass_focus/.test(language.id) && !/staff/.test(language.id)) return false;

  const focusOnlyLanguages = ['fey_crystal_focus_language', 'thorn_focus_language', 'holy_relic_focus', 'mechanical_lens_focus', 'storm_glass_focus', 'starseer_crystal_focus', 'void_orb_focus'];
  if (focusOnlyLanguages.includes(language.id) && hasAny(weapon.tags, ['rapier', 'sword', 'blade', 'dagger', 'dual-blades', 'bow', 'shortbow', 'longbow', 'hammer', 'warhammer', 'mace', 'maul', 'axe', 'greataxe', 'greatsword', 'spear', 'shield', 'melee', 'martial'])) return false;
  if (language.id === 'siege_maul' && !hasAny(weapon.tags, ['maul', 'hammer'])) return false;
  if (['battle_lute_language', 'skald_war_lute'].includes(language.id) && !weapon.tags.includes('lute')) return false;
  if (language.id === 'enchanted_flute_language' && !hasAny(weapon.tags, ['flute', 'fey-focus'])) return false;
  if (language.id === 'storykeeper_songbook' && !hasAny(weapon.tags, ['book', 'spellbook', 'scroll', 'case'])) return false;
  if (weapon.tags.includes('instrument') && /mechanical|calibrator|wrench|gauntlet|engineer/i.test(language.id) && buildTemplate.id !== 'battle_engineer') return false;
  if (language.id === 'dragon_hunter_blade' && hasAny(weapon.tags, ['bow', 'warhammer', 'hammer', 'mace', 'staff', 'instrument', 'tool'])) return false;
  if (language.id === 'reliquary_warhammer' && !hasAny(weapon.tags, ['warhammer', 'hammer', 'mace'])) return false;
  if (language.id === 'academy_spell_staff' && !hasAny(weapon.tags, ['staff', 'wand'])) return false;
  if (language.id === 'academy_spellbook_language' && !hasAny(weapon.tags, ['book', 'spellbook', 'grimoire'])) return false;
  if (language.id === 'void_orb_focus' && !hasAny(weapon.tags, ['orb', 'occult'])) return false;
  if (language.id === 'ranger_bone_bow' && !weapon.tags.includes('bow')) return false;
  if (language.id === 'fey_cane_sword' && !weapon.tags.includes('rapier')) return false;
  if (['holy_symbol_staff', 'pilgrim_staff_language', 'gravewarden_staff'].includes(language.id) && !weapon.tags.includes('staff')) return false;
  if (['holy_book_reliquary', 'holy_book_language', 'ritual_prayer_book'].includes(language.id) && !hasAny(weapon.tags, ['book', 'spellbook', 'grimoire'])) return false;
  if (language.id === 'mechanical_tool_focus' && !(hasAny(weapon.tags, ['mechanical', 'mechanical-focus', 'mechanical-weapon', 'device']) || (weapon.tags.includes('tool') && buildTemplate.id === 'battle_engineer'))) return false;
  return language.compatibleBuildTemplates.includes(buildTemplate.id) && (language.compatibleThemes.length === 0 || language.compatibleThemes.includes(theme.id) || profile.weaponLanguageIds.includes(language.id));
}

function armorLanguageCompatible(language: ArmorLanguage, armor: ArmorOption, seed: Pick<CharacterSeed, 'primaryClass' | 'buildTemplate' | 'visualTheme' | 'fantasyPillar'>): boolean {
  if (!language.armorCategory.some((tag) => armor.tags.includes(tag))) return false;
  if (language.id === 'plain_armor_language') return language.compatibleBuildTemplates.includes(seed.buildTemplate.id);
  if (!language.compatibleBuildTemplates.includes(seed.buildTemplate.id) && !language.compatibleThemes.includes(seed.visualTheme.id)) return false;
  if (language.id === 'academy_robes' && !(seed.buildTemplate.id === 'arcane_caster' || seed.buildTemplate.id === 'divine_scholar' || seed.visualTheme.id === 'academy_mage' || seed.fantasyPillar.id === 'scholar')) return false;
  if (language.id === 'void_oracle_robes' && !(seed.visualTheme.id === 'void_oracle' || ['occult', 'mystic'].includes(seed.fantasyPillar.id) || seed.primaryClass === 'warlock')) return false;
  if (language.id === 'hunter_leather' && !(seed.buildTemplate.id === 'frontier_hunter' || seed.buildTemplate.id === 'shadow_skirmisher' || seed.buildTemplate.id === 'savage_berserker' || ['trail_warden', 'beast_slayer', 'bounty_hunter', 'relic_thief', 'swamp_tracker', 'tribal_champion'].includes(seed.visualTheme.id))) return false;
  if (language.id === 'fey_court_garb' && seed.fantasyPillar.id !== 'fey') return false;
  if (language.id === 'gravewarden_mail' && !['grave_warden', 'battle_chaplain', 'divine_archivist'].includes(seed.visualTheme.id)) return false;
  if (language.id === 'ceremonial_sun_plate' && !(seed.buildTemplate.id === 'holy_warrior' || ['paladin', 'cleric'].includes(seed.primaryClass) || seed.visualTheme.id === 'sun_knight')) return false;
  if (language.id === 'battle_worn_frontier_plate' && !['martial_veteran', 'frontier_hunter', 'holy_warrior'].includes(seed.buildTemplate.id)) return false;
  if (language.id === 'monastic_temple_cloth' && seed.buildTemplate.id !== 'wandering_martial_artist') return false;
  return true;
}


function equipmentFinishCompatible(finish: EquipmentFinish, seed: Pick<CharacterSeed, 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'armorLanguage' | 'weaponLanguage'>): boolean {
  if (finish.forbiddenThemes?.includes(seed.visualTheme.id)) return false;
  if (finish.forbiddenPillars?.includes(seed.fantasyPillar.id)) return false;
  const templateMatch = finish.compatibleBuildTemplates.includes(seed.buildTemplate.id);
  const themeMatch = finish.compatibleThemes.includes(seed.visualTheme.id);
  const pillarMatch = finish.compatiblePillars.includes(seed.fantasyPillar.id);
  const armorMatch = finish.compatibleArmorLanguages?.includes(seed.armorLanguage.id) ?? false;
  const weaponMatch = finish.compatibleWeaponLanguages?.includes(seed.weaponLanguage.id) ?? false;
  return (templateMatch || themeMatch || pillarMatch) && (!finish.compatibleArmorLanguages || armorMatch || weaponMatch || themeMatch || pillarMatch);
}

function isVoidFx(fx: FxOption): boolean {
  return hasAny(fx.tags, ['void']) || /void|black-violet|purple/.test(fx.name);
}

function isHolyFx(fx: FxOption): boolean {
  return hasAny(fx.tags, ['holy']) || /holy|divine|spectral feather/.test(fx.name);
}

function isFeyFx(fx: FxOption): boolean {
  return hasAny(fx.tags, ['fey']) || /fey|petal|witchfire|pollen|butterfl/.test(fx.name);
}

function enchantmentFamily(enchantment: EquipmentEnchantment): 'none' | 'holy' | 'void' | 'fey' | 'rune' | 'battle' | 'mechanical' | 'necrotic' | 'storm' {
  if (enchantment.intensity === 'none') return 'none';
  if (/holy|relic|stained_glass/.test(enchantment.id)) return 'holy';
  if (/void|eclipse|starlight/.test(enchantment.id)) return 'void';
  if (/fey|flower/.test(enchantment.id)) return 'fey';
  if (/rune/.test(enchantment.id)) return 'rune';
  if (/mechanical/.test(enchantment.id)) return 'mechanical';
  if (/necrotic|grave/.test(enchantment.id)) return 'necrotic';
  if (/storm|lightning/.test(enchantment.id)) return 'storm';
  return 'battle';
}

function enchantmentContradictsFx(enchantment: EquipmentEnchantment, fx: FxOption): boolean {
  const family = enchantmentFamily(enchantment);
  if (family === 'none' || family === 'rune') return false;
  if (isVoidFx(fx) && ['holy', 'fey'].includes(family)) return true;
  if (isHolyFx(fx) && ['void', 'fey', 'necrotic'].includes(family)) return true;
  if (isFeyFx(fx) && ['void', 'holy', 'necrotic', 'mechanical'].includes(family)) return true;
  return false;
}

function equipmentEnchantmentCompatible(enchantment: EquipmentEnchantment, seed: Pick<CharacterSeed, 'mode' | 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'weapon' | 'armor' | 'visualMotif' | 'fx'>): boolean {
  if (enchantment.intensity === 'none') return true;
  if (enchantment.forbiddenThemes?.includes(seed.visualTheme.id)) return false;
  if (enchantment.forbiddenPillars?.includes(seed.fantasyPillar.id)) return false;
  if (enchantmentContradictsFx(enchantment, seed.fx)) return false;
  const isMapOrBook = hasAny(seed.weapon.tags, ['book', 'spellbook', 'grimoire', 'scroll', 'map', 'compass', 'case']);
  const isInstrument = seed.weapon.tags.includes('instrument');
  const isOrb = seed.weapon.tags.includes('orb');
  const family = enchantmentFamily(enchantment);
  if (isMapOrBook && ['battle', 'storm', 'mechanical'].includes(family) && !(seed.mode === 'chaos' || seed.visualTheme.id === 'storm_sailor')) return false;
  if (isInstrument && family === 'mechanical' && seed.buildTemplate.id !== 'battle_engineer') return false;
  if (isOrb && family === 'battle') return false;
  if (!enchantment.compatibleBuildTemplates.includes(seed.buildTemplate.id) && !enchantment.compatibleThemes.includes(seed.visualTheme.id) && !enchantment.compatiblePillars.includes(seed.fantasyPillar.id)) return false;
  if (enchantment.compatibleWeaponTags && !enchantment.compatibleWeaponTags.some((tag) => seed.weapon.tags.includes(tag))) {
    if (!enchantment.compatibleArmorCategories || !enchantment.compatibleArmorCategories.some((tag) => seed.armor.tags.includes(tag))) return false;
  }
  if (enchantment.compatibleArmorCategories && !enchantment.compatibleArmorCategories.some((tag) => seed.armor.tags.includes(tag))) {
    if (!enchantment.compatibleWeaponTags || !enchantment.compatibleWeaponTags.some((tag) => seed.weapon.tags.includes(tag))) return false;
  }
  if (enchantment.compatibleVisualMotifs && !enchantment.compatibleVisualMotifs.includes(seed.visualMotif.id)) return false;
  if (enchantment.intensity === 'legendary' && !(enchantment.compatibleThemes.includes(seed.visualTheme.id) || seed.mode === 'chaos')) return false;
  if (family === 'void' && !(seed.visualTheme.id === 'void_oracle' || ['occult', 'mystic'].includes(seed.fantasyPillar.id) || seed.mode === 'chaos')) return false;
  if (family === 'holy' && !(seed.buildTemplate.id === 'holy_warrior' || seed.fantasyPillar.id === 'divine' || seed.mode === 'chaos')) return false;
  if (family === 'fey' && !(seed.fantasyPillar.id === 'fey' || seed.mode === 'chaos')) return false;
  return true;
}

function selectEquipmentFinish(seed: Pick<CharacterSeed, 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'armorLanguage' | 'weaponLanguage'>, context: SmartSelectionContext): EquipmentFinish {
  const candidates = equipmentFinishes.filter((finish) => equipmentFinishCompatible(finish, seed));
  const pool = candidates.length > 0 ? candidates : equipmentFinishes.filter((finish) => finish.compatiblePillars.includes(seed.fantasyPillar.id));
  return smartSelect(
    'Equipment Finish',
    (pool.length > 0 ? pool : equipmentFinishes).map((finish) => ({
      item: finish,
      score: finish.weight + (finish.compatibleThemes.includes(seed.visualTheme.id) ? 35 : 0) + (finish.compatibleBuildTemplates.includes(seed.buildTemplate.id) ? 25 : 0) + (finish.compatiblePillars.includes(seed.fantasyPillar.id) ? 15 : 0) + (finish.compatibleArmorLanguages?.includes(seed.armorLanguage.id) ? 15 : 0) + (finish.compatibleWeaponLanguages?.includes(seed.weaponLanguage.id) ? 15 : 0),
      reasons: [`theme ${seed.visualTheme.id}`, `pillar ${seed.fantasyPillar.id}`],
    })),
    context,
    () => (pool.length > 0 ? pool : equipmentFinishes)[0],
  );
}

function weightedIntensity(): EquipmentEffectIntensity {
  return weightedPick([
    { name: 'none' as EquipmentEffectIntensity, weight: 52 },
    { name: 'subtle' as EquipmentEffectIntensity, weight: 32 },
    { name: 'strong' as EquipmentEffectIntensity, weight: 13 },
    { name: 'legendary' as EquipmentEffectIntensity, weight: 3 },
  ]).name;
}

function selectEquipmentEnchantment(seed: Pick<CharacterSeed, 'mode' | 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'weapon' | 'armor' | 'visualMotif' | 'fx'>, context: SmartSelectionContext): EquipmentEnchantment {
  const desiredIntensity = weightedIntensity();
  const none = equipmentEnchantments.find((item) => item.intensity === 'none') ?? equipmentEnchantments[0];
  if (desiredIntensity === 'none') {
    context.trace.push('Equipment enchantment intensity roll: none.');
    return none;
  }
  const candidates = equipmentEnchantments.filter((item) => item.intensity === desiredIntensity && equipmentEnchantmentCompatible(item, seed));
  if (candidates.length === 0) {
    context.trace.push(`Equipment enchantment intensity roll: ${desiredIntensity}; no compatible enchantment, using none.`);
    return none;
  }
  context.trace.push(`Equipment enchantment intensity roll: ${desiredIntensity}.`);
  return smartSelect(
    'Equipment Enchantment',
    candidates.map((item) => ({
      item,
      score: item.weight + (item.compatibleThemes.includes(seed.visualTheme.id) ? 40 : 0) + (item.compatibleBuildTemplates.includes(seed.buildTemplate.id) ? 25 : 0) + (item.compatiblePillars.includes(seed.fantasyPillar.id) ? 15 : 0) + (item.compatibleVisualMotifs?.includes(seed.visualMotif.id) ? 15 : 0),
      reasons: [`intensity ${desiredIntensity}`, `theme ${seed.visualTheme.id}`, `fx ${seed.fx.name}`],
    })),
    context,
    () => candidates[0],
  );
}

function isDragonLike(companion: CompanionProfile | null): boolean {
  return !!companion && ['dragon', 'shadow'].includes(companion.companionType) && /dragon|drake|wyvern/i.test(companion.id);
}

function silhouetteCompatible(profile: SilhouetteProfile, theme: VisualTheme, seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'size'>, companion: CompanionProfile | null): boolean {
  if (!profile.compatibleSizes.includes(seed.size)) return false;
  if (profile.compatibleThemes && profile.compatibleThemes.length > 0 && !profile.compatibleThemes.includes(theme.id) && seed.mode !== 'chaos' && ['companion', 'mounted'].includes(profile.category) && !companion) return false;
  if (profile.forbiddenClasses?.includes(seed.primaryClass)) return false;
  if (seed.mode !== 'chaos' && ['tiny', 'small'].includes(seed.size) && ['wide', 'mounted'].includes(profile.category)) return false;
  if (seed.mode !== 'chaos' && ['tiny', 'small'].includes(seed.size) && ['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(profile.id)) return false;
  if (['companion', 'mounted'].includes(profile.category) && !companion) return false;
  if (profile.id === 'falconer_profile' && !(companion && companion.companionType === 'bird')) return false;
  if (profile.id === 'dragon_warden_profile' && !(isDragonLike(companion) || theme.id.includes('dragon'))) return false;
  if (profile.id === 'beastmaster_pair' && !(companion && ['major', 'legendary'].includes(companion.tier) && ['animal', 'spirit', 'fey'].includes(companion.companionType))) return false;
  if (profile.id === 'mounted_scout' && !(companion && companion.sizeImpact === 'mounted_silhouette')) return false;
  if (companion?.tier === 'minor' && ['mounted_scout', 'beastmaster_pair', 'dragon_warden_profile'].includes(profile.id)) return false;
  if (companion && ['major', 'legendary'].includes(companion.tier) && !['companion', 'mounted'].includes(profile.category)) return false;
  return true;
}

function legendaryCompanionAllowed(companion: CompanionProfile, primaryClass: CharacterClass, theme: VisualTheme, buildTemplate: BuildTemplate, archetype: ArchetypeOption, pillar: FantasyPillar['id']): boolean {
  if (companion.tier !== 'legendary') return true;
  if (['young_dragon', 'wyvern_hatchling', 'shadow_drake'].includes(companion.id)) return hasAny(archetype.tags, ['draconic']) || /dragon|drake|wyvern/.test(theme.id) || buildTemplate.id === 'frontier_hunter';
  if (companion.id === 'sun_lion') return theme.id === 'sun_knight' || (buildTemplate.id === 'holy_warrior' && ['paladin', 'cleric'].includes(primaryClass));
  if (companion.id === 'void_raven') return theme.id === 'void_oracle' || pillar === 'occult' || primaryClass === 'warlock';
  if (companion.id === 'living_constellation_bird') return ['star_seer', 'void_oracle'].includes(theme.id) || buildTemplate.id === 'arcane_caster';
  if (companion.id === 'great_spirit_wolf') return ['druid', 'ranger', 'barbarian'].includes(primaryClass) || ['primal', 'fey'].includes(pillar);
  if (companion.id === 'clockwork_owl_sentinel') return primaryClass === 'artificer' || theme.id === 'clockwork_sapper' || hasAny(archetype.tags, ['academy', 'tools']);
  if (companion.id === 'phoenix_fledgling') return pillar === 'divine' || theme.id === 'sun_knight' || ['paladin', 'cleric'].includes(primaryClass);
  return false;
}

function selectVisualMotif(theme: VisualTheme, buildTemplate: BuildTemplate, profile: ThemeVisualProfile, context: SmartSelectionContext, primaryClass?: CharacterClass): VisualMotif {
  const candidates = visualMotifs.filter((motif) => visualMotifCompatible(motif, theme, buildTemplate, profile));
  const profileFallback = visualMotifs.filter((motif) => profile.visualMotifIds.includes(motif.id));
  const buildFallback = visualMotifs.filter((motif) => motif.compatibleBuildTemplates.includes(buildTemplate.id));
  const pool = candidates.length > 0 ? candidates : profileFallback.length > 0 ? profileFallback : buildFallback.length > 0 ? buildFallback : visualMotifs;
  return smartSelect(
    'Visual Motif',
    pool.map((motif) => ({
      item: motif,
      score: 40 + (profile.visualMotifIds.includes(motif.id) ? 35 : 0) + (motif.compatibleThemes.includes(theme.id) ? 25 : 0) + (motif.compatibleBuildTemplates.includes(buildTemplate.id) ? 15 : 0) + (isRuneMotifNoisyForTheme(motif, theme, buildTemplate, primaryClass) ? -220 : 0),
      reasons: [`theme ${theme.id}`, `pillar ${profile.fantasyPillarId}`],
    })),
    context,
    () => pool[0],
  );
}

function selectArmorLanguage(armor: ArmorOption, seed: Pick<CharacterSeed, 'primaryClass' | 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'culturalOrigin'>, profile: ThemeVisualProfile, context: SmartSelectionContext): ArmorLanguage {
  const candidates = armorLanguages.filter((language) => armorLanguageCompatible(language, armor, seed));
  const specificCandidates = candidates.filter((language) => language.id !== 'plain_armor_language');
  const pool = specificCandidates.length > 0 ? specificCandidates : candidates.length > 0 ? candidates : armorLanguages.filter((language) => language.armorCategory.some((tag) => armor.tags.includes(tag)) && language.id === 'plain_armor_language');
  return smartSelect(
    'Armor Language',
    (pool.length > 0 ? pool : armorLanguages.filter((language) => language.armorCategory.some((tag) => armor.tags.includes(tag)))).map((language) => ({
      item: language,
      score: 35 + (profile.armorLanguageIds.includes(language.id) ? 30 : 0) + (language.compatibleThemes.includes(seed.visualTheme.id) ? 25 : 0) + (language.compatibleCultures?.includes(seed.culturalOrigin.id) ? 10 : 0),
      reasons: [`armor ${armor.name}`, `theme ${seed.visualTheme.id}`],
    })),
    context,
    () => (pool.length > 0 ? pool : armorLanguages)[0],
  );
}

function selectWeaponLanguage(weapon: WeaponOption, buildTemplate: BuildTemplate, theme: VisualTheme, profile: ThemeVisualProfile, context: SmartSelectionContext): WeaponLanguage {
  const candidates = weaponLanguages.filter((language) => weaponLanguageCompatible(language, weapon, buildTemplate, theme, profile));
  const specificCandidates = candidates.filter((language) => language.id !== 'plain_weapon_language');
  const pool = specificCandidates.length > 0 ? specificCandidates : candidates.length > 0 ? candidates : weaponLanguages.filter((language) => language.baseWeaponTags.some((tag) => weapon.tags.includes(tag)) && language.id === 'plain_weapon_language');
  return smartSelect(
    'Weapon Language',
    (pool.length > 0 ? pool : weaponLanguages.filter((language) => language.baseWeaponTags.some((tag) => weapon.tags.includes(tag)))).map((language) => ({
      item: language,
      score: 35 + (profile.weaponLanguageIds.includes(language.id) ? 30 : 0) + (language.compatibleThemes.includes(theme.id) ? 25 : 0) + language.baseWeaponTags.filter((tag) => weapon.tags.includes(tag)).length * 8 + (language.id !== 'plain_weapon_language' ? 20 : -80),
      reasons: [`weapon ${weapon.name}`, `theme ${theme.id}`],
    })),
    context,
    () => (pool.length > 0 ? pool : weaponLanguages)[0],
  );
}

function companionTierWeights(template: BuildTemplate, primaryClass: CharacterClass, theme: VisualTheme, profile: ThemeVisualProfile): Array<WeightedOption<{ name: CompanionTier }>> {
  const pillar = profile.fantasyPillarId;
  const beastmasterLike = template.id === 'frontier_hunter' || primaryClass === 'ranger' || primaryClass === 'druid' || ['trail_warden', 'beast_slayer', 'forest_sprite'].includes(theme.id);
  if (beastmasterLike) return [{ name: 'none', weight: 84 }, { name: 'minor', weight: 9 }, { name: 'major', weight: 5 }, { name: 'legendary', weight: 2 }];
  if (template.id === 'holy_warrior' || ['paladin', 'cleric'].includes(primaryClass)) return [{ name: 'none', weight: 90 }, { name: 'minor', weight: 6 }, { name: 'major', weight: 3 }, { name: 'legendary', weight: 1 }];
  if (primaryClass === 'warlock' || pillar === 'occult' || theme.id === 'void_oracle') return [{ name: 'none', weight: 90 }, { name: 'minor', weight: 7 }, { name: 'major', weight: 2 }, { name: 'legendary', weight: 1 }];
  if (primaryClass === 'artificer' || template.id === 'battle_engineer' || theme.id === 'clockwork_sapper') return [{ name: 'none', weight: 90 }, { name: 'minor', weight: 7 }, { name: 'major', weight: 2 }, { name: 'legendary', weight: 1 }];
  if (profile.companionBias && profile.companionBias.length > 0) return [{ name: 'none', weight: 88 }, { name: 'minor', weight: 7 }, { name: 'major', weight: 4 }, { name: 'legendary', weight: 1 }];
  return [{ name: 'none', weight: 90 }, { name: 'minor', weight: 6 }, { name: 'major', weight: 3 }, { name: 'legendary', weight: 1 }];
}

function selectCompanion(template: BuildTemplate, primaryClass: CharacterClass, theme: VisualTheme, profile: ThemeVisualProfile, archetype: ArchetypeOption, context: SmartSelectionContext): { companion: CompanionProfile | null; relationship: CompanionRelationship | null; tier: CompanionTier } {
  const tier = weightedPick(companionTierWeights(template, primaryClass, theme, profile)).name;
  context.trace.push(`Companion tier roll: ${tier}.`);
  if (tier === 'none') return { companion: null, relationship: null, tier };

  const pillar = adjustedFantasyPillarId(theme, primaryClass, template);
  const candidates = companionProfiles.filter((companion) =>
    companion.tier === tier &&
    (companion.compatibleClasses.includes(primaryClass) || companion.compatibleBuildTemplates.includes(template.id) || companion.compatibleThemes.includes(theme.id)) &&
    legendaryCompanionAllowed(companion, primaryClass, theme, template, archetype, pillar),
  );
  if (candidates.length === 0) return { companion: null, relationship: null, tier: 'none' };

  const companion = smartSelect(
    'Companion',
    candidates.map((candidate) => ({
      item: candidate,
      score: candidate.weight + (candidate.compatibleClasses.includes(primaryClass) ? 35 : 0) + (candidate.compatibleBuildTemplates.includes(template.id) ? 25 : 0) + (candidate.compatibleThemes.includes(theme.id) ? 30 : 0) + (profile.companionBias?.includes(candidate.tier) ? 10 : 0),
      reasons: [`tier ${tier}`, `class ${primaryClass}`, `theme ${theme.id}`],
    })),
    context,
    () => weightedPick(candidates),
  );
  const relationship = weightedPick(companionRelationships);
  context.trace.push(`Companion selection reason: ${companion.label} matched ${primaryClass}/${template.id}/${theme.id}; relationship ${relationship.label}.`);
  return { companion, relationship, tier };
}

function selectSilhouetteProfile(
  buildTemplate: BuildTemplate,
  theme: VisualTheme,
  seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'size'>,
  companion: CompanionProfile | null,
  context: SmartSelectionContext,
): SilhouetteProfile {
  const candidates = silhouetteProfiles.filter((profile) =>
    (profile.compatibleBuildTemplates.includes(buildTemplate.id) || (profile.compatibleThemes ?? []).includes(theme.id)) &&
    silhouetteCompatible(profile, theme, seed, companion),
  );
  const companionFallback = companion && ['major', 'legendary'].includes(companion.tier)
    ? silhouetteProfiles.filter((profile) => ['companion', 'mounted'].includes(profile.category) && silhouetteCompatible(profile, theme, seed, companion))
    : [];
  const fallback = silhouetteProfiles.filter((profile) => profile.compatibleSizes.includes(seed.size) && !['companion', 'mounted'].includes(profile.category) && (seed.size === 'tiny' || seed.size === 'small' ? profile.category === 'small' : true));
  const pool = candidates.length > 0 ? candidates : companionFallback.length > 0 ? companionFallback : fallback.length > 0 ? fallback : silhouetteProfiles;
  return smartSelect(
    'Silhouette Profile',
    pool.map((profile) => ({
      item: profile,
      score: (profile.weight ?? 5) + (profile.compatibleBuildTemplates.includes(buildTemplate.id) ? 35 : 0) + ((profile.compatibleThemes ?? []).includes(theme.id) ? 35 : 0) + (companion && ['companion', 'mounted'].includes(profile.category) ? 30 : 0) + (profile.category === 'small' && ['tiny', 'small'].includes(seed.size) ? 25 : 0),
      reasons: [`template ${buildTemplate.id}`, `theme ${theme.id}`, `size ${seed.size}`],
    })),
    context,
    () => pool[0],
  );
}

function pickCuratedArchetype(profile: CuratedMulticlassProfile, primaryClass: CharacterClass, context: SmartSelectionContext): ArchetypeOption {
  const profileThemes = visualThemes.filter((theme) => profile.compatibleThemes.includes(theme.id));
  const classArchetypes = archetypes.filter((archetype) => archetype.classes.includes(primaryClass));
  const candidates = classArchetypes.filter((archetype) => profileThemes.some((theme) => theme.archetypeNames.includes(archetype.name) || theme.archetypeTags.some((tag) => archetype.tags.includes(tag))));
  const pool = candidates.length > 0 ? candidates : classArchetypes;
  return smartSelect(
    'Curated Multiclass',
    pool.map((archetype) => {
      const directThemeMatches = profileThemes.filter((theme) => theme.archetypeNames.includes(archetype.name)).length;
      const tagMatches = profileThemes.reduce((sum, theme) => sum + theme.archetypeTags.filter((tag) => archetype.tags.includes(tag)).length, 0);
      return { item: archetype, score: archetype.weight + 35 + directThemeMatches * 25 + tagMatches * 8, reasons: [`curated multiclass ${profile.id}`, `primary ${primaryClass}`] };
    }),
    context,
    () => weightedPick(pool),
  );
}


function poseCategory(pose: PoseOption): 'defensive_combat' | 'offensive_combat' | 'prayer_ritual' | 'stealth_ready' | 'study_research' | 'fey_performance' | 'travel_guard' | 'wounded_survivor' | 'calm_portrait' {
  const text = normalizeText([pose.name, ...pose.tags].join(' '));
  if (/prayer|kneeling|holy|sacred|ritual|sigil/.test(text)) return 'prayer_ritual';
  if (/map|journal|study|studying|research|book|scroll|tools/.test(text)) return 'study_research';
  if (/stealth|shadow|hidden|assassin|knife|crouch/.test(text)) return 'stealth_ready';
  if (/fey|flourish|playful|perform|lute|flute|dance/.test(text)) return 'fey_performance';
  if (/shield|guard|deflect|block|braced|defensive/.test(text)) return 'defensive_combat';
  if (/strike|kick|attack|greatsword|axe|swing|duel|rapier|bow/.test(text)) return 'offensive_combat';
  if (/wound|scar|survivor|limp/.test(text)) return 'wounded_survivor';
  if (/travel|walking|watch|ready|road|patrol|tracking/.test(text)) return 'travel_guard';
  return 'calm_portrait';
}

const emotionByPoseCategory: Record<ReturnType<typeof poseCategory>, { preferred: string[]; avoid: string[] }> = {
  defensive_combat: { preferred: ['grim determination', 'solemn focus', 'haunted calm'], avoid: ['reckless joy', 'curious delight'] },
  offensive_combat: { preferred: ['grim determination', 'barely contained fury', 'solemn focus'], avoid: ['curious delight'] },
  prayer_ritual: { preferred: ['solemn focus', 'haunted calm', 'grim determination'], avoid: ['wry confidence', 'reckless joy'] },
  stealth_ready: { preferred: ['wry confidence', 'grim determination', 'barely contained fury', 'haunted calm'], avoid: ['curious delight'] },
  study_research: { preferred: ['solemn focus', 'haunted calm', 'curious delight'], avoid: ['barely contained fury', 'reckless joy'] },
  fey_performance: { preferred: ['wry confidence', 'curious delight', 'reckless joy'], avoid: [] },
  travel_guard: { preferred: ['solemn focus', 'wry confidence', 'grim determination', 'haunted calm'], avoid: ['reckless joy'] },
  wounded_survivor: { preferred: ['haunted calm', 'grim determination', 'solemn focus'], avoid: ['curious delight', 'reckless joy'] },
  calm_portrait: { preferred: ['solemn focus', 'wry confidence', 'haunted calm', 'curious delight'], avoid: [] },
};

function emotionCompatibleWithPose(pose: PoseOption, emotion: string, primaryClass: CharacterClass, visualTheme: VisualTheme): boolean {
  const category = poseCategory(pose);
  const rules = emotionByPoseCategory[category];
  if (category === 'defensive_combat' && emotion === 'reckless joy' && (primaryClass === 'barbarian' || visualTheme.id.includes('fey'))) return true;
  if (category === 'stealth_ready' && emotion === 'curious delight' && visualTheme.id.includes('fey')) return true;
  return !rules.avoid.includes(emotion);
}

function pickEmotionForPose(pose: PoseOption, primaryClass: CharacterClass, visualTheme: VisualTheme, context: SmartSelectionContext): string {
  const category = poseCategory(pose);
  const rules = emotionByPoseCategory[category];
  const preferred = emotions.filter((emotion) => rules.preferred.includes(emotion.name));
  const compatible = emotions.filter((emotion) => emotionCompatibleWithPose(pose, emotion.name, primaryClass, visualTheme));
  const pool = preferred.length > 0 ? preferred : compatible.length > 0 ? compatible : emotions;
  const emotion = weightedPick(pool).name;
  if (pool !== emotions) context.trace.push(`Emotion coherence: pose category ${category}, selected ${emotion}.`);
  return emotion;
}

function ensureEmotionCoherence(seed: CharacterSeed, context: SmartSelectionContext): CharacterSeed {
  if (emotionCompatibleWithPose(seed.pose, seed.emotion, seed.primaryClass, seed.visualTheme)) return seed;
  const emotion = pickEmotionForPose(seed.pose, seed.primaryClass, seed.visualTheme, context);
  context.trace.push(`Emotion-pose coherence reroll: ${seed.emotion} -> ${emotion} for pose ${seed.pose.name}.`);
  return { ...seed, emotion };
}

function calculateClassAnchorScore(seed: Pick<CharacterSeed, 'primaryClass' | 'weapon' | 'armor' | 'pose' | 'visualDetails' | 'storyDetails' | 'cultureDetails' | 'buildTemplate'> & Partial<Pick<CharacterSeed, 'fantasyPillar' | 'visualMotif' | 'armorLanguage' | 'weaponLanguage' | 'silhouetteProfile' | 'companion' | 'visualFantasy'>>): number {
  const anchor = getClassAnchor(seed.primaryClass);
  const text = normalizeText([
    ...seed.visualDetails,
    ...seed.storyDetails,
    ...seed.cultureDetails,
    seed.buildTemplate.label,
    seed.fantasyPillar?.label ?? '',
    seed.visualMotif?.label ?? '',
    seed.armorLanguage?.label ?? '',
    seed.weaponLanguage?.label ?? '',
    seed.silhouetteProfile?.label ?? '',
    seed.silhouetteProfile?.visualDescription ?? '',
    seed.companion?.label ?? '',
    seed.visualFantasy ?? '',
  ].join(' '));
  let score = 0;

  if (hasAny(seed.weapon.tags, anchor.weaponTags)) score += 2;
  if (hasAny(seed.armor.tags, anchor.armorTags)) score += 1;
  if (hasAny(seed.pose.tags, anchor.poseTags)) score += 1;
  if (anchor.detailKeywords.some((keyword) => text.includes(normalizeText(keyword)))) score += 1;

  if (seed.primaryClass === 'druid' && ['frontier_hunter', 'fey_trickster'].includes(seed.buildTemplate.id)) score += 1;
  if (seed.primaryClass === 'artificer' && seed.buildTemplate.id === 'battle_engineer') score += 1;
  if (seed.primaryClass === 'warlock' && ['occult', 'mystic', 'fey'].includes(seed.fantasyPillar?.id ?? '')) score += 1;

  return Math.min(5, score);
}

function createSeed(context: SmartSelectionContext): CharacterSeed {
  const pickedMode = weightedPick(modeWeights).name;
  const mode: Mode = pickedMode === 'chaos' ? 'ordinary class' : pickedMode;
  const race = weightedPick(races);
  const size = getRaceSize(race);
  const curatedMulticlassProfile = mode === 'curated multiclass' ? selectCuratedMulticlassProfile(race, size, context) : null;
  const classes = curatedMulticlassProfile ? [curatedMulticlassProfile.primaryClass, curatedMulticlassProfile.secondaryClass] : pickClasses(mode);
  const primaryClass = classes[0];
  const archetype = curatedMulticlassProfile ? pickCuratedArchetype(curatedMulticlassProfile, primaryClass, context) : pickArchetype(classes, primaryClass);
  const curatedTemplate = curatedMulticlassProfile ? buildTemplates.find((template) => template.id === curatedMulticlassProfile.buildTemplateId) : undefined;
  const templateSelection = curatedTemplate
    ? { template: curatedTemplate, reason: `curated multiclass ${curatedMulticlassProfile?.id} locks template ${curatedTemplate.id}` }
    : selectBuildTemplate(primaryClass, archetype, race, mode, context);
  const { template: buildTemplate, reason: templateReason } = templateSelection;
  const visualTheme = curatedMulticlassProfile ? selectCuratedVisualTheme(curatedMulticlassProfile, buildTemplate, archetype, race, context) : selectVisualTheme(buildTemplate, archetype, race, context);
  const themeProfile = getThemeVisualProfile(visualTheme);
  const fantasyPillar = getFantasyPillar(visualTheme, primaryClass, buildTemplate);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, buildTemplate.allowedFx);
  const visualMotif = selectVisualMotif(visualTheme, buildTemplate, themeProfile, context, primaryClass);
  const motifSelection = selectNarrativeMotif({ primaryClass, race, archetype, buildTemplate, visualTheme }, context);
  const narrativeMotif = motifSelection.motif;
  const narrativeVariant = selectNarrativeVariant(narrativeMotif, context, buildTemplate.allowedFx);
  const culturalOrigin = smartSelect(
    'Culture',
    culturalOrigins.map((culture) => ({ item: culture, score: culture.weight + 20, reasons: ['culture flavor only'] })),
    context,
    () => weightedPick(culturalOrigins),
  );
  const cultureDetails = pickCultureDetails(culturalOrigin);
  const compositionMode = context.compositionMode ?? 'full_body_character_art';
  const environmentDetailLevel = context.environmentDetailLevel ?? 'balanced';
  const stylePreset = context.stylePreset ?? 'heroic_dnd_concept_art';
  const appearanceProfile = selectAppearanceProfile(race, size, primaryClass, buildTemplate, visualTheme, fantasyPillar, culturalOrigin, context);
  const armor = smartPickArmor(constrainedArmorOptions(buildTemplate, archetype, primaryClass, size, visualTheme), primaryClass, context);
  const armorLanguage = selectArmorLanguage(armor, { primaryClass, buildTemplate, visualTheme, fantasyPillar, culturalOrigin }, themeProfile, context);
  const weaponOptions = constrainedWeaponOptions(buildTemplate, archetype, size, race, primaryClass, visualTheme);
  const weapon = avoidBarbarianBowWeapon(weaponOptions, smartPickWeapon(weaponOptions, primaryClass, archetype, context), classes);
  const weaponLanguage = selectWeaponLanguage(weapon, buildTemplate, visualTheme, themeProfile, context);
  const companionSelection = selectCompanion(buildTemplate, primaryClass, visualTheme, themeProfile, archetype, context);
  const silhouetteProfile = selectSilhouetteProfile(buildTemplate, visualTheme, { mode, primaryClass, size }, companionSelection.companion, context);
  const silhouette = smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(buildTemplate, { mode, primaryClass, race, size, archetype }, visualTheme), getClassAnchor(primaryClass).poseTags, context);
  const pose = smartPickPose(constrainedPoseOptions(buildTemplate, archetype, weapon, visualTheme), weapon, archetype, context, { primaryClass, visualTheme });
  const mood = smartPickSimpleOption('Mood', constrainedMoodOptions(buildTemplate, archetype, visualTheme, narrativeMotif, narrativeVariant), archetype.tags, context);
  const light = smartPickSimpleOption('Light', constrainedLightOptions(buildTemplate, archetype, visualTheme), archetype.tags, context);
  const fx = smartPickSimpleOption('FX', constrainedFxOptions(buildTemplate, archetype, visualTheme, narrativeMotif, visualThemeVariant, narrativeVariant), [...archetype.tags, ...visualTheme.archetypeTags], context);
  const equipmentFinish = selectEquipmentFinish({ buildTemplate, visualTheme, fantasyPillar, armorLanguage, weaponLanguage }, context);
  const equipmentEnchantment = selectEquipmentEnchantment({ mode, buildTemplate, visualTheme, fantasyPillar, weapon, armor, visualMotif, fx }, context);
  let visualDetailSelection = buildVisualDetails(visualTheme, visualThemeVariant, themeProfile, visualMotif, armorLanguage, weaponLanguage, companionSelection.companion);
  visualDetailSelection = applyEquipmentLegendaryDetail(visualDetailSelection, equipmentEnchantment);
  const detailSplit = splitVisualDetails(visualDetailSelection.details, environmentDetailLevel, compositionMode);
  context.trace.push(`Visual Detail Budget: major ${visualDetailSelection.budget.majorVisualDetails}, minor ${visualDetailSelection.budget.minorVisualDetails}, story ${visualDetailSelection.budget.storyProps}, culture ${visualDetailSelection.budget.cultureDetails}, companion ${visualDetailSelection.budget.companionDetails}, legendary ${visualDetailSelection.budget.legendaryDetails}.`);

  const seed: CharacterSeed = {
    mode,
    primaryClass,
    classes,
    race,
    size,
    appearanceProfile,
    archetype,
    buildTemplate,
    templateReason,
    visualTheme,
    fantasyPillar,
    visualThemeVariant,
    visualFantasy: themeProfile.visualFantasy,
    visualDetails: detailSplit.visualDetails,
    characterBoundDetails: detailSplit.characterBoundDetails,
    sceneProps: detailSplit.sceneProps,
    backgroundProps: detailSplit.backgroundProps,
    visualDetailBudget: visualDetailSelection.budget,
    visualMotif,
    narrativeMotif,
    narrativeVariant,
    culturalOrigin,
    compositionMode,
    environmentDetailLevel,
    stylePreset,
    curatedMulticlassProfile,
    cultureDetails,
    classAnchorScore: 0,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(narrativeMotif, narrativeVariant),
    promptFragments: [...narrativeMotif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
    silhouette,
    silhouetteProfile,
    armor,
    armorLanguage,
    weapon,
    weaponLanguage,
    equipmentFinish,
    equipmentEnchantment,
    enchantmentIntensity: equipmentEnchantment.intensity,
    companion: companionSelection.companion,
    companionRelationship: companionSelection.relationship,
    companionDetails: visualDetailSelection.companionDetails,
    legendaryVisualDetails: visualDetailSelection.legendary,
    pose,
    emotion: pickEmotionForPose(pose, primaryClass, visualTheme, context),
    mood,
    light,
    fx,
  };

  return { ...seed, classAnchorScore: calculateClassAnchorScore(seed) };
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
  if (layer === 'pose' && safeFullBodyPoseNames.has(seed.pose.name)) return true;
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

function detailsContainAny(details: string[], needles: string[]): boolean {
  return details.some((detail) => needles.some((needle) => detail.includes(needle)));
}

function forbiddenMulticlassKey(seed: CharacterSeed): string {
  return seed.classes.slice().sort().join('/');
}

export function validateGeneratedSeed(seed: CharacterSeed): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const weaponTags = seed.weapon.tags;
  const armorTags = seed.armor.tags;
  const poseTags = seed.pose.tags;
  const smallOrFey = smallRaceNames.includes(seed.race.name) || seed.race.tags.includes('fey');

  if (!seed.appearanceProfile || !seed.appearanceProfile.compatibleRaces.includes(seed.race.name)) {
    issues.push({ message: 'seed must include race-compatible CharacterAppearance profile', layers: ['theme'] });
  }

  const appearanceText = [
    seed.appearanceProfile?.promptFragment ?? '',
    seed.appearanceProfile?.faceType ?? '',
    seed.appearanceProfile?.bodyType ?? '',
    seed.appearanceProfile?.hairStyle ?? '',
    seed.appearanceProfile?.facialHair ?? '',
    ...(seed.appearanceProfile?.raceSpecificFeatures ?? []),
  ].join(' ').toLowerCase();
  if (seed.race.name === 'elf' && /(thick beard|dwarf-like|square beard|elderly wizard beard)/.test(appearanceText)) {
    issues.push({ message: 'elf appearance cannot include thick or dwarf-like beard features', layers: ['theme'] });
  }
  if (seed.race.name === 'dragonborn' && /(human beard|human nose|smooth human skin)/.test(appearanceText)) {
    issues.push({ message: 'dragonborn appearance cannot include human beard, human nose, or smooth human skin', layers: ['theme'] });
  }

  if (seed.sceneProps.length > (seed.compositionMode === 'cinematic_splash_art' ? 3 : seed.environmentDetailLevel === 'minimal' || seed.compositionMode === 'character_card' ? 0 : 1)) {
    issues.push({ message: 'scene props exceed composition/environment budget', layers: ['theme'] });
  }
  if (seed.compositionMode !== 'cinematic_splash_art' && seed.characterBoundDetails.length < seed.sceneProps.length) {
    issues.push({ message: 'character-bound details must dominate scene props outside cinematic mode', layers: ['theme'] });
  }

  const forbiddenMulticlasses = new Set(['barbarian/bard', 'barbarian/wizard', 'artificer/barbarian', 'druid/paladin', 'artificer/monk', 'cleric/rogue']);
  const multiclassKey = forbiddenMulticlassKey(seed);
  if (seed.classes.length > 2) {
    issues.push({ message: 'triple multiclass is disabled in normal generation', layers: ['template'] });
  }
  if (seed.mode === 'curated multiclass') {
    if (!seed.curatedMulticlassProfile) {
      issues.push({ message: 'curated multiclass mode requires CuratedMulticlassProfile', layers: ['template'] });
    } else {
      if (seed.primaryClass !== seed.curatedMulticlassProfile.primaryClass || seed.classes[1] !== seed.curatedMulticlassProfile.secondaryClass) {
        issues.push({ message: 'curated multiclass classes must match profile primary/secondary classes', layers: ['template'] });
      }
      if (seed.buildTemplate.id !== seed.curatedMulticlassProfile.buildTemplateId) {
        issues.push({ message: 'curated multiclass primary class must control the build template', layers: ['template'] });
      }
      if (!seed.curatedMulticlassProfile.compatibleThemes.includes(seed.visualTheme.id)) {
        issues.push({ message: 'curated multiclass visual theme must match profile compatibility', layers: ['theme'] });
      }
      if (seed.classAnchorScore < 3) {
        issues.push({ message: 'curated multiclass class anchor score must stay at least 3/5', layers: ['template'] });
      }
    }
  } else if (seed.classes.length > 1 || seed.curatedMulticlassProfile) {
    issues.push({ message: 'random multiclass is disabled; multiclass must come from CuratedMulticlassProfile', layers: ['template'] });
  }
  if (forbiddenMulticlasses.has(multiclassKey)) {
    issues.push({ message: `forbidden multiclass combination generated: ${multiclassKey}`, layers: ['template'] });
  }

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

  if (isCartographerLike(seed.archetype) && !(hasAny(weaponTags, ['map', 'compass', 'scroll', 'book', 'staff']) && hasAny(poseTags, ['map', 'tools', 'prayer', 'casting', 'general']))) {
    issues.push({ message: 'cartographer archetype requires map/compass/scroll/book/staff and map/ritual pose', layers: ['weapon', 'pose', 'fx', 'light'] });
  }

  if (seed.archetype.tags.includes('void') && seed.visualTheme.id !== 'void_oracle') {
    issues.push({ message: 'void archetypes require void_oracle visual theme', layers: ['theme', 'fx'] });
  }

  if (seed.archetype.tags.includes('void') && !['black-violet motes', 'void glow', 'purple void energy', 'drifting void ash', 'black-violet sparks', 'gravity distortions', 'fragmented stars'].includes(seed.fx.name)) {
    issues.push({ message: 'void oracle must have void FX', layers: ['fx'] });
  }

  if (seed.archetype.tags.includes('pirate') && !['pirate_raider', 'relic_thief', 'lore_skald', 'wandering_bard', 'wandering_storyteller'].includes(seed.visualTheme.id)) {
    issues.push({ message: 'pirate archetype requires pirate-compatible visual theme', layers: ['theme', 'weapon', 'pose'] });
  }

  if (seed.archetype.tags.includes('pirate') && !detailsContainAny(seed.visualDetails, ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'])) {
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

  if (seed.primaryClass === 'bard' && (!bardHasPerformerAnchor(seed) || isBardWizardRisk(seed))) {
    issues.push({ message: 'bard must keep an explicit performer anchor and avoid wizard-like spellbook/sigil identity', layers: ['weapon', 'pose'] });
  }

  if (seed.race.name === 'fairy' && (seed.armor.name === 'full plate with engraved pauldrons' || seed.armor.tags.includes('heavy'))) {
    issues.push({ message: 'fairy cannot use full plate or heavy armor fantasy', layers: ['armor'] });
  }

  if (seed.race.name === 'fairy' && (seed.weapon.tags.includes('shield') || seed.silhouette.name === 'stocky shield-forward stance')) {
    issues.push({ message: 'fairy should avoid heavy shield-forward fantasy', layers: ['weapon', 'pose', 'silhouette'] });
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

  if (!seed.culturalOrigin || seed.cultureDetails.length === 0) {
    issues.push({ message: 'seed must have a cultural origin with flavour details', layers: ['culture'] });
  }

  if (calculateClassAnchorScore(seed) < classIdentityThreshold) {
    issues.push({ message: `${seed.primaryClass} class identity score is below ${classIdentityThreshold}`, layers: ['theme', 'themeVariant', 'motif', 'narrativeVariant', 'culture', 'weapon', 'pose'] });
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

  if (!seed.visualMotif || seed.visualMotif.id.length === 0) {
    issues.push({ message: 'seed must have one primary visual motif', layers: ['theme'] });
  }

  if (!seed.silhouetteProfile || seed.silhouetteProfile.id.length === 0) {
    issues.push({ message: 'seed must have one silhouette profile', layers: ['silhouette'] });
  }

  if (seed.silhouetteProfile && !seed.silhouetteProfile.compatibleSizes.includes(seed.size)) {
    issues.push({ message: 'silhouette profile incompatible with size', layers: ['silhouette'] });
  }

  if (['tiny', 'small'].includes(seed.size) && seed.mode !== 'chaos' && ['wide', 'mounted'].includes(seed.silhouetteProfile.category)) {
    issues.push({ message: 'tiny/small characters cannot use massive, wide, or mounted visual-library silhouettes', layers: ['silhouette'] });
  }

  if (!isPillarCompatible(seed)) {
    issues.push({ message: 'fantasy pillar must be compatible with selected class and build template', layers: ['theme'] });
  }

  const validationProfile = getThemeVisualProfile(seed.visualTheme);

  if (!seed.visualMotif || !visualMotifCompatible(seed.visualMotif, seed.visualTheme, seed.buildTemplate, validationProfile)) {
    issues.push({ message: 'primary visual motif must strongly match selected theme or build template', layers: ['theme'] });
  }

  if (!seed.silhouetteProfile || !silhouetteCompatible(seed.silhouetteProfile, seed.visualTheme, seed, seed.companion)) {
    issues.push({ message: 'silhouette profile must match theme, size, and companion state', layers: ['silhouette'] });
  }

  if (!seed.armorLanguage || !armorLanguageCompatible(seed.armorLanguage, seed.armor, seed)) {
    issues.push({ message: 'armor language must match armor category, theme, and build template', layers: ['armor'] });
  }

  if (!seed.weaponLanguage || !weaponLanguageCompatible(seed.weaponLanguage, seed.weapon, seed.buildTemplate, seed.visualTheme, validationProfile)) {
    issues.push({ message: 'weapon language must strictly match weapon/tool tags, theme, and build template', layers: ['weapon'] });
  }

  if (!seed.equipmentFinish || !equipmentFinishCompatible(seed.equipmentFinish, seed)) {
    issues.push({ message: 'equipment finish must match build, theme, pillar, and selected equipment languages', layers: ['armor', 'weapon'] });
  }

  if (!seed.equipmentEnchantment || seed.enchantmentIntensity !== seed.equipmentEnchantment.intensity || !equipmentEnchantmentCompatible(seed.equipmentEnchantment, seed)) {
    issues.push({ message: 'equipment enchantment must match intensity, FX, theme, motif, and item tags', layers: ['weapon', 'armor', 'fx'] });
  }


  const languageId = seed.weaponLanguage.id;
  const bookOnlyWeapon = hasAny(seed.weapon.tags, ['book', 'spellbook', 'grimoire']) && !seed.weapon.tags.includes('staff');
  const staffOnlyWeapon = seed.weapon.tags.includes('staff') && !hasAny(seed.weapon.tags, ['book', 'spellbook', 'grimoire']);
  const mapToolWeapon = hasAny(seed.weapon.tags, ['scroll', 'map', 'compass', 'case']) && !hasAny(seed.weapon.tags, ['sword', 'blade', 'hammer', 'warhammer', 'mace', 'bow']);
  const orbOnlyWeapon = seed.weapon.tags.includes('orb') && !seed.weapon.tags.includes('staff');
  if (bookOnlyWeapon && languageId !== 'dream_journal_focus' && /staff|spear|blade|bow|hammer|maul|axe|lute|flute|calibrator|wrench|gauntlet|orb|crystal|focus/i.test(languageId)) {
    issues.push({ message: 'book or spellbook cannot use staff, martial, instrument, or mechanical weapon language', layers: ['weapon'] });
  }
  if (staffOnlyWeapon && /book|grimoire|map|scroll|compass|lute|dagger|blade|bow|hammer|axe|calibrator|wrench|gauntlet|orb|crystal|lens_focus|relic_focus|glass_focus/i.test(languageId)) {
    issues.push({ message: 'staff cannot use book, map, martial, instrument, or mechanical weapon language', layers: ['weapon'] });
  }
  if (mapToolWeapon && /blade|sword|dagger|bow|hammer|maul|axe|staff|lute|flute/i.test(languageId)) {
    issues.push({ message: 'scroll, map, compass, or case cannot use martial-only weapon language', layers: ['weapon'] });
  }
  if (orbOnlyWeapon && /staff|book|grimoire|map|scroll|blade|sword|bow|hammer|axe/i.test(languageId)) {
    issues.push({ message: 'orb or crystal focus cannot use staff, book, map, or martial weapon language', layers: ['weapon'] });
  }

  const focusOnlyLanguageIds = ['fey_crystal_focus_language', 'thorn_focus_language', 'holy_relic_focus', 'mechanical_lens_focus', 'storm_glass_focus', 'starseer_crystal_focus', 'void_orb_focus'];
  if (focusOnlyLanguageIds.includes(languageId) && hasAny(seed.weapon.tags, ['rapier', 'sword', 'blade', 'dagger', 'dual-blades', 'bow', 'shortbow', 'longbow', 'hammer', 'warhammer', 'mace', 'maul', 'axe', 'greataxe', 'greatsword', 'spear', 'shield', 'melee', 'martial'])) {
    issues.push({ message: 'martial weapon cannot use focus-only weapon language', layers: ['weapon'] });
  }
  if (languageId === 'siege_maul' && !hasAny(seed.weapon.tags, ['maul', 'hammer'])) {
    issues.push({ message: 'siege maul language requires maul or hammer base weapon tags', layers: ['weapon'] });
  }
  if (['battle_lute_language', 'skald_war_lute'].includes(languageId) && !seed.weapon.tags.includes('lute')) {
    issues.push({ message: 'lute language requires lute base weapon tag', layers: ['weapon'] });
  }
  if (languageId === 'enchanted_flute_language' && !hasAny(seed.weapon.tags, ['flute', 'fey-focus'])) {
    issues.push({ message: 'flute language requires flute or fey-focus base weapon tag', layers: ['weapon'] });
  }
  if (languageId === 'storykeeper_songbook' && !hasAny(seed.weapon.tags, ['book', 'spellbook', 'scroll', 'case'])) {
    issues.push({ message: 'songbook language requires book, scroll, or case base weapon tag', layers: ['weapon'] });
  }
  const enchantFamilyForValidation = enchantmentFamily(seed.equipmentEnchantment);
  if (mapToolWeapon && ['battle', 'storm', 'mechanical'].includes(enchantFamilyForValidation) && !(seed.mode === 'chaos' || seed.visualTheme.id === 'storm_sailor')) {
    issues.push({ message: 'book, scroll, map, or compass cannot use martial-only equipment enchantment', layers: ['weapon', 'fx'] });
  }

  if (seed.weapon.tags.includes('bow') && seed.weaponLanguage.id === 'dragon_hunter_blade') {
    issues.push({ message: 'bow cannot use blade weapon language', layers: ['weapon'] });
  }

  if (hasAny(seed.weapon.tags, ['hammer', 'warhammer', 'mace']) && seed.weaponLanguage.id === 'dragon_hunter_blade') {
    issues.push({ message: 'hammer or mace cannot use blade weapon language', layers: ['weapon'] });
  }

  if (seed.weapon.tags.includes('instrument') && seed.weaponLanguage.id === 'mechanical_tool_focus' && !(seed.primaryClass === 'artificer' || seed.classes.includes('artificer'))) {
    issues.push({ message: 'instrument cannot use mechanical tool language unless artificer is present', layers: ['weapon'] });
  }

  if (seed.weapon.name === 'paired daggers' && seed.weaponLanguage.id === 'fey_cane_sword') {
    issues.push({ message: 'paired daggers cannot use cane sword language', layers: ['weapon'] });
  }

  if (seed.primaryClass === 'monk' && seed.armorLanguage.id === 'academy_robes' && seed.visualTheme.id !== 'academy_mage') {
    issues.push({ message: 'monk cannot use academy robes unless explicitly academy-themed', layers: ['armor'] });
  }

  if (seed.primaryClass === 'paladin' && seed.buildTemplate.id === 'holy_warrior' && seed.armorLanguage.id === 'hunter_leather' && !['wandering_healer'].includes(seed.visualTheme.id)) {
    issues.push({ message: 'holy warrior paladin cannot use hunter leather unless pilgrim/frontier variant', layers: ['armor'] });
  }

  if (seed.companion) {
    const companionCompatible = seed.companion.compatibleClasses.includes(seed.primaryClass) || seed.companion.compatibleBuildTemplates.includes(seed.buildTemplate.id) || seed.companion.compatibleThemes.includes(seed.visualTheme.id);
    if (!companionCompatible) {
      issues.push({ message: 'companion must be compatible with class, build template, or visual theme', layers: ['theme'] });
    }
    if (!legendaryCompanionAllowed(seed.companion, seed.primaryClass, seed.visualTheme, seed.buildTemplate, seed.archetype, seed.fantasyPillar.id)) {
      issues.push({ message: 'legendary companion must be thematically locked to class/theme/archetype', layers: ['theme'] });
    }
    if (['major', 'legendary'].includes(seed.companion.tier) && !['companion', 'mounted'].includes(seed.silhouetteProfile.category)) {
      issues.push({ message: 'major/legendary companion requires companion or mounted silhouette profile', layers: ['silhouette'] });
    }
  }

  if (seed.visualDetails.length > 8) {
    issues.push({ message: 'prompt should not carry more than 8 visual details', layers: ['theme'] });
  }

  if (new Set(seed.visualDetails).size !== seed.visualDetails.length) {
    issues.push({ message: 'visual details must not contain duplicates', layers: ['theme'] });
  }

  if (seed.legendaryVisualDetails.length > 1) {
    issues.push({ message: 'legendary visual detail budget allows at most one legendary detail', layers: ['theme'] });
  }

  return issues;
}

function withClassAnchorScore(seed: CharacterSeed): CharacterSeed {
  return { ...seed, classAnchorScore: calculateClassAnchorScore(seed) };
}


function refreshVisualLibraryLayers(seed: CharacterSeed, context: SmartSelectionContext): CharacterSeed {
  const themeProfile = getThemeVisualProfile(seed.visualTheme);
  const fantasyPillar = getFantasyPillar(seed.visualTheme, seed.primaryClass, seed.buildTemplate);
  let refreshedWeapon = seed.weapon;
  let refreshedPose = seed.pose;
  if (isCartographerLike(seed.archetype) && !(hasAny(refreshedWeapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']) && hasAny(refreshedPose.tags, ['map', 'tools']))) {
    const weaponOptions = constrainedWeaponOptions(seed.buildTemplate, seed.archetype, seed.size, seed.race, seed.primaryClass, seed.visualTheme);
    refreshedWeapon = weaponOptions.find((weapon) => hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff'])) ?? refreshedWeapon;
    const poseOptions = constrainedPoseOptions(seed.buildTemplate, seed.archetype, refreshedWeapon, seed.visualTheme);
    refreshedPose = poseOptions.find((pose) => hasAny(pose.tags, ['map', 'tools'])) ?? refreshedPose;
  }
  const visualMotif = selectVisualMotif(seed.visualTheme, seed.buildTemplate, themeProfile, context, seed.primaryClass);
  const armorLanguage = selectArmorLanguage(seed.armor, { ...seed, fantasyPillar }, themeProfile, context);
  const weaponLanguage = selectWeaponLanguage(refreshedWeapon, seed.buildTemplate, seed.visualTheme, themeProfile, context);
  const equipmentFinish = selectEquipmentFinish({ ...seed, fantasyPillar, armorLanguage, weaponLanguage }, context);
  const equipmentEnchantment = selectEquipmentEnchantment({ ...seed, fantasyPillar, weapon: refreshedWeapon, visualMotif, fx: seed.fx }, context);
  let companionSelection = selectCompanion(seed.buildTemplate, seed.primaryClass, seed.visualTheme, themeProfile, seed.archetype, context);
  let silhouetteProfile = selectSilhouetteProfile(seed.buildTemplate, seed.visualTheme, seed, companionSelection.companion, context);
  if (companionSelection.companion && ['major', 'legendary'].includes(companionSelection.companion.tier) && !['companion', 'mounted'].includes(silhouetteProfile.category)) {
    companionSelection = { companion: null, relationship: null, tier: 'none' };
    silhouetteProfile = selectSilhouetteProfile(seed.buildTemplate, seed.visualTheme, seed, null, context);
  }
  let visualDetailSelection = buildVisualDetails(seed.visualTheme, seed.visualThemeVariant, themeProfile, visualMotif, armorLanguage, weaponLanguage, companionSelection.companion);
  visualDetailSelection = applyEquipmentLegendaryDetail(visualDetailSelection, equipmentEnchantment);
  if (seed.archetype.tags.includes('pirate') && !hasAny(visualDetailSelection.details, ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'])) {
    visualDetailSelection.details = uniqueCleanDetails(['rope belt', ...visualDetailSelection.details]).slice(0, 8);
  }
  const detailSplit = splitVisualDetails(visualDetailSelection.details, seed.environmentDetailLevel, seed.compositionMode);
  context.trace.push(`Visual Detail Budget: major ${visualDetailSelection.budget.majorVisualDetails}, minor ${visualDetailSelection.budget.minorVisualDetails}, story ${visualDetailSelection.budget.storyProps}, culture ${visualDetailSelection.budget.cultureDetails}, companion ${visualDetailSelection.budget.companionDetails}, legendary ${visualDetailSelection.budget.legendaryDetails}.`);
  return withClassAnchorScore({
    ...seed,
    fantasyPillar,
    visualFantasy: themeProfile.visualFantasy,
    visualMotif,
    armorLanguage,
    weapon: refreshedWeapon,
    weaponLanguage,
    equipmentFinish,
    equipmentEnchantment,
    enchantmentIntensity: equipmentEnchantment.intensity,
    pose: refreshedPose,
    companion: companionSelection.companion,
    companionRelationship: companionSelection.relationship,
    companionDetails: visualDetailSelection.companionDetails,
    silhouetteProfile,
    visualDetails: detailSplit.visualDetails,
    characterBoundDetails: detailSplit.characterBoundDetails,
    sceneProps: detailSplit.sceneProps,
    backgroundProps: detailSplit.backgroundProps,
    visualDetailBudget: visualDetailSelection.budget,
    legendaryVisualDetails: visualDetailSelection.legendary,
    promptFragments: [...seed.narrativeMotif.promptFragments, ...seed.narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments, ...visualMotif.promptFragments, ...armorLanguage.promptFragments, ...weaponLanguage.promptFragments, ...equipmentFinish.promptFragments, ...equipmentEnchantment.promptFragments, ...(companionSelection.companion ? [companionSelection.companion.promptFragment, companionSelection.relationship?.promptFragment ?? ''] : [])].filter(Boolean),
  });
}

function rerollLayer(seed: CharacterSeed, layer: RegenerableLayer, context: SmartSelectionContext): CharacterSeed {
  if (layer === 'template') {
    const selection = seed.curatedMulticlassProfile
      ? { template: getTemplate(seed.curatedMulticlassProfile.buildTemplateId), reason: `curated multiclass ${seed.curatedMulticlassProfile.id} keeps locked template` }
      : selectBuildTemplate(seed.primaryClass, seed.archetype, seed.race, seed.mode, context);
    const visualTheme = seed.curatedMulticlassProfile ? selectCuratedVisualTheme(seed.curatedMulticlassProfile, selection.template, seed.archetype, seed.race, context) : selectVisualTheme(selection.template, seed.archetype, seed.race, context);
    const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, selection.template.allowedFx);
    const motifSelection = selectNarrativeMotif({ ...seed, buildTemplate: selection.template, visualTheme }, context);
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, selection.template.allowedFx);
    return { ...seed, buildTemplate: selection.template, templateReason: selection.reason, visualTheme, visualThemeVariant, visualDetails: pickVisualDetails(visualTheme, visualThemeVariant), narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'theme') {
    const visualTheme = seed.curatedMulticlassProfile ? selectCuratedVisualTheme(seed.curatedMulticlassProfile, seed.buildTemplate, seed.archetype, seed.race, context) : selectVisualTheme(seed.buildTemplate, seed.archetype, seed.race, context);
    const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, seed.buildTemplate.allowedFx);
    const motifSelection = selectNarrativeMotif({ ...seed, visualTheme }, context);
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, seed.buildTemplate.allowedFx);
    return { ...seed, visualTheme, visualThemeVariant, visualDetails: pickVisualDetails(visualTheme, visualThemeVariant), narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'motif') {
    const motifSelection = selectNarrativeMotif(seed, context);
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, seed.buildTemplate.allowedFx);
    return { ...seed, narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments] };
  }

  if (layer === 'themeVariant') {
    const visualThemeVariant = selectVisualThemeVariant(seed.visualTheme, context, seed.buildTemplate.allowedFx);
    return { ...seed, visualThemeVariant, visualDetails: pickVisualDetails(seed.visualTheme, visualThemeVariant), promptFragments: [...seed.narrativeMotif.promptFragments, ...seed.narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'narrativeVariant') {
    const narrativeVariant = selectNarrativeVariant(seed.narrativeMotif, context, seed.buildTemplate.allowedFx);
    return { ...seed, narrativeVariant, storyDetails: pickStoryDetails(seed.narrativeMotif, narrativeVariant), promptFragments: [...seed.narrativeMotif.promptFragments, ...narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments] };
  }

  if (layer === 'culture') {
    const culturalOrigin = smartSelect('Culture', culturalOrigins.map((culture) => ({ item: culture, score: culture.weight + 20, reasons: ['culture flavor only'] })), context, () => weightedPick(culturalOrigins));
    return withClassAnchorScore({ ...seed, culturalOrigin, cultureDetails: pickCultureDetails(culturalOrigin) });
  }

  if (layer === 'armor') {
    return { ...seed, armor: smartPickArmor(constrainedArmorOptions(seed.buildTemplate, seed.archetype, seed.primaryClass, seed.size, seed.visualTheme), seed.primaryClass, context) };
  }

  if (layer === 'weapon') {
    const weaponOptions = constrainedWeaponOptions(seed.buildTemplate, seed.archetype, seed.size, seed.race, seed.primaryClass, seed.visualTheme);
    const weapon = avoidBarbarianBowWeapon(weaponOptions, smartPickWeapon(weaponOptions, seed.primaryClass, seed.archetype, context), seed.classes);
    {
      const pose = smartPickPose(constrainedPoseOptions(seed.buildTemplate, seed.archetype, weapon, seed.visualTheme), weapon, seed.archetype, context, { primaryClass: seed.primaryClass, visualTheme: seed.visualTheme });
      return ensureEmotionCoherence({ ...seed, weapon, pose }, context);
    }
  }

  if (layer === 'silhouette') {
    return { ...seed, silhouette: smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(seed.buildTemplate, seed, seed.visualTheme), getClassAnchor(seed.primaryClass).poseTags, context) };
  }

  if (layer === 'pose') {
    {
      const pose = smartPickPose(constrainedPoseOptions(seed.buildTemplate, seed.archetype, seed.weapon, seed.visualTheme), seed.weapon, seed.archetype, context, { primaryClass: seed.primaryClass, visualTheme: seed.visualTheme });
      return ensureEmotionCoherence({ ...seed, pose }, context);
    }
  }

  if (layer === 'mood') {
    return { ...seed, mood: smartPickSimpleOption('Mood', constrainedMoodOptions(seed.buildTemplate, seed.archetype, seed.visualTheme, seed.narrativeMotif, seed.narrativeVariant), seed.archetype.tags, context) };
  }

  if (layer === 'light') {
    return { ...seed, light: smartPickSimpleOption('Light', constrainedLightOptions(seed.buildTemplate, seed.archetype, seed.visualTheme), seed.archetype.tags, context) };
  }

  return { ...seed, fx: smartPickSimpleOption('FX', constrainedFxOptions(seed.buildTemplate, seed.archetype, seed.visualTheme, seed.narrativeMotif, seed.visualThemeVariant, seed.narrativeVariant), [...seed.archetype.tags, ...seed.visualTheme.archetypeTags], context) };
}

function replaceWithFallbackTemplate(seed: CharacterSeed, trace: string[], context: SmartSelectionContext): CharacterSeed {
  const fallback = getTemplate(fallbackTemplateByClass[seed.primaryClass]);
  trace.push(`Switching to safe fallback buildTemplate ${fallback.id} for ${seed.primaryClass}.`);

  const visualTheme = selectVisualTheme(fallback, seed.archetype, seed.race, context);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, fallback.allowedFx);
  const motifSelection = selectNarrativeMotif({ ...seed, buildTemplate: fallback, visualTheme }, context);
  const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, fallback.allowedFx);
  const nextSeed: CharacterSeed = {
    ...seed,
    buildTemplate: fallback,
    templateReason: `safe fallback after unresolved validation for ${seed.primaryClass}`,
    visualTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(visualTheme, visualThemeVariant),
    narrativeMotif: motifSelection.motif,
    narrativeVariant,
    culturalOrigin: seed.culturalOrigin,
    cultureDetails: seed.cultureDetails,
    classAnchorScore: seed.classAnchorScore,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant),
    promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
  };

  const armor = smartPickArmor(constrainedArmorOptions(fallback, nextSeed.archetype, nextSeed.primaryClass, nextSeed.size, nextSeed.visualTheme), nextSeed.primaryClass, context);
  const fallbackWeaponOptions = constrainedWeaponOptions(fallback, nextSeed.archetype, nextSeed.size, nextSeed.race, nextSeed.primaryClass, nextSeed.visualTheme);
  const weapon = avoidBarbarianBowWeapon(fallbackWeaponOptions, smartPickWeapon(fallbackWeaponOptions, nextSeed.primaryClass, nextSeed.archetype, context), nextSeed.classes);

  return {
    ...nextSeed,
    armor,
    weapon,
    silhouette: smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(fallback, nextSeed, nextSeed.visualTheme), getClassAnchor(nextSeed.primaryClass).poseTags, context),
    pose: smartPickPose(constrainedPoseOptions(fallback, nextSeed.archetype, weapon, nextSeed.visualTheme), weapon, nextSeed.archetype, context, { primaryClass: nextSeed.primaryClass, visualTheme: nextSeed.visualTheme }),
    mood: smartPickSimpleOption('Mood', constrainedMoodOptions(fallback, nextSeed.archetype, nextSeed.visualTheme, nextSeed.narrativeMotif, nextSeed.narrativeVariant), nextSeed.archetype.tags, context),
    light: smartPickSimpleOption('Light', constrainedLightOptions(fallback, nextSeed.archetype, nextSeed.visualTheme), nextSeed.archetype.tags, context),
    fx: smartPickSimpleOption('FX', constrainedFxOptions(fallback, nextSeed.archetype, nextSeed.visualTheme, nextSeed.narrativeMotif, nextSeed.visualThemeVariant, nextSeed.narrativeVariant), [...nextSeed.archetype.tags, ...nextSeed.visualTheme.archetypeTags], context),
  };
}

function resolveSeedConflicts(seed: CharacterSeed, trace: string[], context: SmartSelectionContext): CharacterSeed {
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
      nextSeed = rerollLayer(nextSeed, layer, context);
    }
  }

  nextSeed = replaceWithFallbackTemplate(nextSeed, trace, context);

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const issues = validateGeneratedSeed(nextSeed);
    if (issues.length === 0) {
      trace.push(`Final validation status: passed with fallback template after ${attempt} check(s).`);
      return nextSeed;
    }

    const layers = [...new Set<RegenerableLayer>(issues.flatMap((issue) => issue.layers))];
    trace.push(`Fallback reroll attempt ${attempt}: ${layers.join(', ')}.`);
    for (const layer of layers.filter((layer) => layer !== 'template')) {
      nextSeed = rerollLayer(nextSeed, layer, context);
    }
  }

  trace.push('Final validation status: forced safe cloth/staff fallback after unresolved conflicts.');
  const safeTemplate = getTemplate(seed.primaryClass === 'monk' ? 'wandering_martial_artist' : fallbackTemplateByClass[seed.primaryClass]);
  const armor = armors.find((option) => option.name === (seed.primaryClass === 'monk' ? 'no armor, simple travel wraps' : safeTemplate.allowedArmor[0])) ?? armors[0];
  const forcedWeaponOptions = templateOptions(weapons, safeTemplate.allowedWeapons);
  const weapon = avoidBarbarianBowWeapon(forcedWeaponOptions, weapons.find((option) => option.name === safeTemplate.allowedWeapons[0]) ?? weapons[0], nextSeed.classes);
  const visualTheme = selectVisualTheme(safeTemplate, nextSeed.archetype, nextSeed.race, context);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, safeTemplate.allowedFx);
  const motifSelection = selectNarrativeMotif({ ...nextSeed, buildTemplate: safeTemplate, visualTheme }, context);
  const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, safeTemplate.allowedFx);
  return {
    ...nextSeed,
    buildTemplate: safeTemplate,
    visualTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(visualTheme, visualThemeVariant),
    narrativeMotif: motifSelection.motif,
    narrativeVariant,
    culturalOrigin: seed.culturalOrigin,
    cultureDetails: seed.cultureDetails,
    classAnchorScore: seed.classAnchorScore,
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
  if (seed.curatedMulticlassProfile) {
    return `${seed.primaryClass} primary (${seed.primaryClass} / ${seed.curatedMulticlassProfile.secondaryClass}) — ${seed.curatedMulticlassProfile.label}`;
  }
  return seed.primaryClass;
}

function formatSeed(seed: CharacterSeed): string {
  return [
    `Mode: ${seed.mode}`,
    `Primary Class: ${seed.primaryClass}`,
    `Class: ${formatClassLine(seed)}`,
    `Race: ${seed.race.name}`,
    `Size: ${seed.size}`,
    `Appearance Profile: ${seed.appearanceProfile.label}`,
    `Appearance Details: ${seed.appearanceProfile.promptFragment}`,
    `Composition Mode: ${seed.compositionMode}`,
    `Environment Detail Level: ${seed.environmentDetailLevel}`,
    `Style Preset: ${seed.stylePreset}`,
    `Secondary Class: ${seed.curatedMulticlassProfile ? seed.curatedMulticlassProfile.secondaryClass : 'none'}`,
    `Curated Multiclass Profile: ${seed.curatedMulticlassProfile ? seed.curatedMulticlassProfile.label : 'none'}`,
    `Curated Visual Fantasy: ${seed.curatedMulticlassProfile ? seed.curatedMulticlassProfile.visualFantasy : 'none'}`,
    `Archetype: ${seed.archetype.name}`,
    `Fantasy Pillar: ${seed.fantasyPillar.label}`,
    `Build Template: ${seed.buildTemplate.id}`,
    `Visual Theme: ${seed.visualTheme.id}`,
    `Visual Fantasy: ${seed.visualFantasy}`,
    `Theme Variant: ${seed.visualThemeVariant.id}`,
    `Narrative Motif: ${seed.narrativeMotif.label}`,
    `Narrative Variant: ${seed.narrativeVariant.id}`,
    `Class Anchor Score: ${seed.classAnchorScore}/5`,
    `Culture: ${seed.culturalOrigin.label}`,
    `Culture Details: ${seed.cultureDetails.join(', ')}`,
    `Silhouette: ${seed.silhouetteProfile.label}`,
    `Silhouette Category: ${seed.silhouetteProfile.category}`,
    `Legacy Silhouette: ${seed.silhouette.name}`,
    `Visual Motif: ${seed.visualMotif.label}`,
    `Armor: ${seed.armor.name}`,
    `Armor Language: ${seed.armorLanguage.label}`,
    `Weapon / Tool: ${seed.weapon.name}`,
    `Weapon Language: ${seed.weaponLanguage.label}`,
    `Equipment Finish: ${seed.equipmentFinish.label}`,
    `Equipment Enchantment: ${seed.equipmentEnchantment.label}`,
    `Enchantment Intensity: ${seed.enchantmentIntensity}`,
    `Companion: ${seed.companion ? seed.companion.label : 'none'}`,
    `Companion Relationship: ${seed.companionRelationship ? seed.companionRelationship.label : 'none'}`,
    `Pose: ${seed.pose.name}`,
    `Emotion: ${seed.emotion}`,
    `Mood: ${seed.mood.name}`,
    `Light: ${seed.light.name}`,
    `FX: ${seed.fx.name}`,
    `Character-Bound Details: ${seed.characterBoundDetails.join(', ')}`,
    `Scene Props: ${seed.sceneProps.length > 0 ? seed.sceneProps.join(', ') : 'none'}`,
    `Background Props: ${seed.backgroundProps.length > 0 ? seed.backgroundProps.join(', ') : 'none'}`,
    `Visual Details: ${seed.visualDetails.join(', ')}`,
    `Legendary Visual Details: ${seed.legendaryVisualDetails.length > 0 ? seed.legendaryVisualDetails.join(', ') : 'none'}`,
    `Story Details: ${seed.storyDetails.join(', ')}`,
  ].join('\n');
}

function formatPrompt(seed: CharacterSeed): string {
  const artDirection = resolveArtDirection(seed);
  const multiclassLine = seed.curatedMulticlassProfile
    ? `Create a D&D character concept art portrait of a ${seed.race.name} ${seed.primaryClass} primary (${seed.primaryClass} / ${seed.curatedMulticlassProfile.secondaryClass}), built around the curated fantasy: ${seed.curatedMulticlassProfile.label}. ${seed.curatedMulticlassProfile.promptHint}.`
    : `Create a D&D character concept art portrait of a ${seed.race.name} ${seed.primaryClass}.`;
  return [
    compositionPrompt(seed.compositionMode),
    `Artist brief: ${artDirection.dominantRead}. Pose: ${artDirection.poseDirective}. Story shorthand: ${artDirection.storyShorthand.join('; ') || 'none'}. Avoid: ${artDirection.suppressedElements.slice(0, 4).join(', ')}.`,
    multiclassLine,
    `Appearance: ${seed.appearanceProfile.promptFragment}.`,
    `Build template: ${seed.buildTemplate.label}; fantasy pillar: ${seed.fantasyPillar.label}; visual theme: ${seed.visualTheme.label} (${seed.visualFantasy}); theme variant: ${seed.visualThemeVariant.label}.`,
    `Silhouette: ${sanitizeSilhouetteForImagePrompt(seed)}.`,
    `Armor: ${seed.armor.name}; armor language: ${seed.armorLanguage.promptFragments.join(', ')}; finish: ${seed.equipmentFinish.promptFragments.slice(0, 1).join(', ')}.`,
    `Weapon or tool: ${seed.weapon.name}; weapon language: ${seed.weaponLanguage.promptFragments.join(', ')}${seed.enchantmentIntensity !== 'none' ? `; enchantment: ${seed.equipmentEnchantment.promptFragments.slice(0, 1).join(', ')}` : ''}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    seed.companion ? `Companion: ${seed.companion.label}, ${seed.companion.promptFragment}; relationship: ${seed.companionRelationship?.label ?? 'bonded companion'}.` : 'No companion; keep the silhouette focused on the character.',
    `Primary visual motif: ${seed.visualMotif.label}; ${seed.visualMotif.promptFragments.join(', ')}.`,
    `Character-bound details: ${seed.characterBoundDetails.join(', ')}.`,
    seed.sceneProps.length > 0 ? `Minimal scene props: ${seed.sceneProps.join(', ')}.` : 'Minimal scene props: none; keep the environment clean.',
    seed.backgroundProps.length > 0 ? `Background hints: ${seed.backgroundProps.join(', ')}.` : 'Background hints: minimal.',
    `Cultural details: ${seed.cultureDetails.slice(0, 2).join(', ')}.`,
    `Lighting: ${seed.light.name}; primary visual effect: ${seed.fx.name}.`,
    'Negative prompt: biography text, wall of lore, unreadable gear, duplicate props, extra FX, modern clothing, no readable text, only abstract marks or illegible symbols on papers.',
  ].join(' ');
}


function compositionImagePromptPhrase(compositionMode: CompositionMode): string {
  if (compositionMode === 'character_concept_portrait') return 'focused character concept portrait, readable face and upper costume, limited background, strong race features';
  if (compositionMode === 'cinematic_splash_art') return 'cinematic fantasy splash art, dynamic scene, dramatic lighting, readable character silhouette';
  if (compositionMode === 'character_card') return 'clean vertical character card illustration, full body visible, readable silhouette, minimal background, strong design clarity';
  return 'full-body character concept art, centered character, entire body visible from head to toe, clean readable silhouette, minimal environment';
}

function qualityRulesForMode(compositionMode: CompositionMode): string {
  if (compositionMode === 'character_concept_portrait') return 'Quality rules: readable face, clear race and class identity, clean accessories, character focus.';
  return 'Quality rules: full body visible, clear race and class identity, strong silhouette, clean accessories.';
}

function negativePromptForImage(): string {
  return 'Negative prompt: no cropped body, no extra limbs, no malformed hands, no unreadable face, no modern clothing, no guns, no logo, no watermark, no cluttered background, no floor props, no duplicate weapons, no excessive belts, no chain clutter, no dangling ornaments, no crowded waist gear, no loose papers, no item clutter, no stacks of books, no wearable library, no overdesigned staff, no symbol-covered fabric, no oversized banners, no giant flags, no readable text, only abstract marks or illegible symbols if papers or books appear.';
}

function sentenceJoin(parts: Array<string | null | undefined | false>): string {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join(' ');
}

function shortList(items: string[], max = 5): string {
  return uniqueCleanDetails(items).slice(0, max).join(', ');
}


function raceAppearanceForImagePrompt(seed: CharacterSeed): string {
  if (seed.race.name !== 'aasimar') return seed.appearanceProfile.promptFragment;
  const base = seed.appearanceProfile.promptFragment.replace(/\.$/, '');
  const fallen = /fallen|dimmed|grave|pale|tired|exile/i.test(`${seed.appearanceProfile.id} ${seed.appearanceProfile.label} ${base}`);
  const eyeMarker = fallen ? 'dim luminous silver eyes' : 'luminous silver or radiant eyes';
  const haloMarker = fallen ? 'muted halo shadow and pale celestial scars' : 'halo-like rim glow and celestial birthmark';
  return `${base}, visible celestial ancestry, ${eyeMarker}, radiant skin undertone, ${haloMarker}`;
}

type ImageDetailCategory =
  | 'integrated_design'
  | 'body_mark'
  | 'material_texture'
  | 'main_tool_detail'
  | 'object_clutter'
  | 'paper_clutter'
  | 'banner_clutter'
  | 'book_clutter'
  | 'chain_charm_clutter';

const paperClutterPattern = /battle reports?|field orders?|campaign maps?|\bmaps?\b|records?|ledgers?|inventory|license tags?|\btags?\b|labels?|bookmarks?|loose pages?|loose papers?|documents?|notes?|scrolls?|orders?|thesis fragments?|charts?|astronomical charts?|tally papers?|wanted posters?|poster fragments?|pamphlets?/i;
const bookClutterPattern = /stacked books?|stacked academy books?|book stacks?|multiple books?|chained books?|\bacademy books?\b|\bbooks?\b|library stamps?|library records?|wax seals?|hanging pages?/i;
const bannerClutterPattern = /flags?|banners?|banner fragments?|first company banner|pennant cords?|background banners?/i;
const chainCharmClutterPattern = /\bchains?\b|cords?|hanging chains?|many chains?|many belts?|excessive straps?|straps?|dangling charms?|charms?|ornaments?|many medallions?|medallions?|many talismans?|talismans?|many ribbons?|ribbons?|trophy loops?|many trophies?|tokens?|coins?|necklaces?/i;
const symbolClutterPattern = /glyph fragments?|floating symbols?|floating glyphs?|formula bands?/i;
const objectClutterPattern = new RegExp(`${paperClutterPattern.source}|${bookClutterPattern.source}|${bannerClutterPattern.source}|${chainCharmClutterPattern.source}|${symbolClutterPattern.source}`, 'i');
const objectLikeDetailPattern = /\b(book|grimoire|map|scroll|paper|journal|ledger|record|poster|tag|label|seal|banner|flag|pennant|chain|belt|charm|medallion|talisman|trophy|glyph|symbol|page|document|note|report|chart|order|token|coin|necklace)\b/i;
const accessoryClutterPattern = /many belts?|excessive belts?|multiple straps?|hanging chains?|dangling chains?|chain clusters?|many medallions?|multiple amulets?|many pouches?|hanging tags?|dangling ornaments?|trophy loops?|many trophies?|many ribbons?|torn strips everywhere|excessive cloth strips?|long hanging scroll strips?|symbol-covered fabric|many small metal charms?|multiple tassels?|crowded waist gear|overloaded belt gear|layered trinkets?|excessive buckles?|overdesigned staff ornaments?|overdesigned spear decorations?|giant banners?|large flags?|multiple pennants?/i;
const scholarLibraryRiskPattern = /stacked books?|multiple books?|loose pages?|hanging scrolls?|many wax seals?|archive labels?|formula bands? all over|symbol-covered robes?|wearable librar/i;
const largeBannerRiskPattern = /giant banners?|large flags?|full-size banner|battlefield flags?|huge flag|background banners?|multiple pennants?|command pennant cords?|first company banner fragment/i;

function classifyImagePromptDetail(detail: string): ImageDetailCategory {
  const text = normalizeText(detail);
  if (bookClutterPattern.test(text)) return 'book_clutter';
  if (bannerClutterPattern.test(text)) return 'banner_clutter';
  if (paperClutterPattern.test(text)) return 'paper_clutter';
  if (chainCharmClutterPattern.test(text) || symbolClutterPattern.test(text) || accessoryClutterPattern.test(text)) return 'chain_charm_clutter';
  if (/birthmark|scar|tattoo|eyes|horn|wing|scale|beard|hair|tusk|halo|celestial|body mark|pact stain/.test(text)) return 'body_mark';
  if (/fur|hide|leather|metal|bronze|cloth|velvet|silk|linen|wool|bark|bone|scale texture|weathered|dented|scarred|burned|patched/.test(text)) return 'material_texture';
  if (/weapon grip|pommel|focus glow|staff head|blade edge|instrument shape|shield face|holy symbol|pact focus/.test(text)) return 'main_tool_detail';
  if (/trim|pattern|embroidery|stitch|thread|sash|cloak edge|hem|lining|tabard|mantle|robe panels|clasp|seam|markings|colors|texture/.test(text)) return 'integrated_design';
  if (objectLikeDetailPattern.test(text)) return 'object_clutter';
  return 'integrated_design';
}

function transformObjectClutterDetail(detail: string, seed: CharacterSeed): string | null {
  const text = normalizeText(detail);
  const weaponText = normalizeText(seed.weapon.name);
  if (/battle reports?|field orders?|campaign maps?|campaign|reports?|orders?|inheritance letters?|letters?|coded travel record|weathered road journal|worn treasure map|maps?|journals?/.test(text)) return seed.primaryClass === 'fighter' ? 'campaign-worn officer trim' : seed.primaryClass === 'ranger' || seed.primaryClass === 'druid' ? 'mud-stained boots from long trail work' : 'weathered travel wear from old obligations';
  if (/first company banner|banner fragment|torn banner|pennant cords?|flags?|banners?|large flags?|giant banners?|multiple pennants?/.test(text)) {
    if (/banner|pennant/.test(weaponText)) return 'small torn cloth near the spearhead';
    return 'faded company color on cloak lining';
  }
  if (/stacked books?|book stacks?|multiple books?|chained books?|academy books?|\bbooks?\b|library records?|library stamps?/.test(text)) return seed.primaryClass === 'wizard' ? 'scholar-layered robe panels' : 'archive-style embroidery';
  if (/broken signet ring|signet|noble crest|crest/.test(text)) return 'faded noble crest on cloak lining';
  if (/wax seals?|archive labels?|labels?/.test(text)) return 'wax-red robe clasp';
  if (/prayer strips?|many ribbons?|ribbons?|torn strips everywhere|excessive cloth strips?|long hanging scroll strips?/.test(text)) return 'clean sacred sash';
  if (/trophy loops?|many trophies?|trophies/.test(text)) return seed.primaryClass === 'barbarian' ? 'beast-scarred mantle' : 'trophy-scarred armor texture';
  if (/glyph fragments?|floating symbols?|floating glyphs?|formula bands?|symbol-covered fabric|symbol-covered robes?/.test(text)) return hasAny(seed.weapon.tags, ['magic-focus', 'staff', 'orb', 'wand', 'book']) ? 'controlled glow on the focus' : 'restrained embroidered trim';
  if (/\bchains?\b|cords?|hanging chains?|dangling chains?|chain clusters?|many chains?|many medallions?|multiple amulets?|medallions?|many talismans?|talismans?|charms?|ornaments?|tokens?|coins?|necklaces?|keys?/.test(text)) return seed.primaryClass === 'paladin' || seed.primaryClass === 'cleric' ? 'worn sacred trim dulled by travel and vigil' : 'subtle material wear at the collar';
  if (/many belts?|excessive belts?|multiple straps?|excessive straps?|\bstraps?\b|crowded waist gear|overloaded belt gear|excessive buckles?/.test(text)) return 'practical armor fastening';
  if (/dangling charms?|dangling ornaments?|many small metal charms?|multiple tassels?|layered trinkets?|bookmarks?|loose pages?|loose papers?|documents?|notes?|scrolls?|charts?|thesis fragments?|wanted posters?|poster fragments?|pamphlets?|tally papers?|records?|ledgers?|inventory|license/.test(text)) {
    if (seed.primaryClass === 'rogue' || seed.primaryClass === 'ranger') return 'single practical utility pouch';
    if (seed.primaryClass === 'wizard' || seed.primaryClass === 'sorcerer' || seed.primaryClass === 'warlock') return 'clean robe panels';
    return 'subtle costume trim';
  }
  return null;
}

function detailMotifKey(detail: string): string {
  return normalizeText(detail)
    .replace(/\b(tucked into the sash|fastened to the belt|tied to the wrist|pinned to the cloak|attached to the armor|tied to the cloak|tied to the belt|worked into the costume design|visible as a single clean accent|integrated into the silhouette)\b/g, '')
    .replace(/\b(one|single|small|subtle|weathered|worn|old|faded|clean)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanPromptDetail(detail: string): string {
  return detail
    .replace(/\s+(tucked into the sash|fastened to the belt|pinned to the cloak|tied to the wrist|tied to the belt|tied to the cloak|around the focus|fastened to a cord|on the belt loop|carried close, not scattered)$/i, '')
    .replace(/\s+(worked into the costume design|visible as a single clean accent|integrated into the silhouette)$/i, '')
    .replace(/\b(stacked|multiple|many|loose|hanging|dangling|excessive)\b\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeImagePromptDetails(seed: CharacterSeed, selectedDetails: string[]): string[] {
  const candidates = selectedDetails
    .map((detail) => cleanPromptDetail(transformObjectClutterDetail(detail, seed) ?? detail))
    .filter(Boolean);
  const selected: string[] = [];
  const motifKeys = new Set<string>();
  let objectLikeCount = 0;
  let bodyMarkerCount = 0;

  const ordered = [...new Set(candidates)].sort((a, b) => {
    const score = (detail: string) => {
      const category = classifyImagePromptDetail(detail);
      if (category === 'body_mark') return 100;
      if (category === 'integrated_design') return 90;
      if (category === 'material_texture') return 82;
      if (category === 'main_tool_detail') return 65;
      return 10;
    };
    return score(b) - score(a) || a.length - b.length;
  });

  for (const detail of ordered) {
    if (selected.length >= 2 && bodyMarkerCount > 0) break;
    if (selected.length >= 2 && classifyImagePromptDetail(detail) !== 'body_mark') break;
    if (selected.length >= 3) break;
    const category = classifyImagePromptDetail(detail);
    const transformed = objectClutterPattern.test(detail) ? transformObjectClutterDetail(detail, seed) : detail;
    if (!transformed) continue;
    const clean = cleanPromptDetail(transformed);
    if (!clean || objectClutterPattern.test(clean)) continue;
    const motifKey = detailMotifKey(clean);
    if (!motifKey || motifKeys.has(motifKey)) continue;
    const isObjectLike = objectLikeDetailPattern.test(clean);
    if (isObjectLike && objectLikeCount >= 1) continue;
    if (category === 'body_mark') bodyMarkerCount += 1;
    if (isObjectLike) objectLikeCount += 1;
    selected.push(clean);
    motifKeys.add(motifKey);
  }

  if (selected.length === 0) {
    selected.push(seed.primaryClass === 'barbarian' ? 'scarred hide-and-fur silhouette' : seed.primaryClass === 'wizard' ? 'clean layered robe construction' : 'clean integrated costume trim');
  }
  if (selected.length === 1) {
    selected.push(seed.primaryClass === 'fighter' ? 'notched armor texture' : seed.primaryClass === 'bard' ? 'performer-cut coat silhouette' : 'subtle material contrast');
  }
  return selected.slice(0, bodyMarkerCount > 0 ? 3 : 2);
}

function compressCharacterDetails(details: string[], seed: CharacterSeed): string {
  const unique = [...new Set(details.filter(Boolean))];
  const sorted = unique.sort((a, b) => {
    const categoryScore = (detail: string) => {
      const transformed = transformObjectClutterDetail(detail, seed) ?? detail;
      const category = classifyImagePromptDetail(transformed);
      if (category === 'body_mark') return 95;
      if (category === 'integrated_design') return 90;
      if (category === 'material_texture') return 82;
      if (category === 'main_tool_detail') return 60;
      return 10;
    };
    return categoryScore(b) - categoryScore(a) || a.length - b.length;
  });
  return shortList(sanitizeImagePromptDetails(seed, sorted), 3);
}

function multiclassInfluence(seed: CharacterSeed): string {
  if (!seed.curatedMulticlassProfile) return `clearly readable as ${seed.primaryClass}.`;
  const secondaryDetails = shortList([
    seed.curatedMulticlassProfile.promptHint,
    ...sanitizeImagePromptDetails(seed, seed.characterBoundDetails),
    seed.equipmentEnchantment.intensity !== 'none' ? seed.equipmentEnchantment.label : '',
  ].filter(Boolean), 2);
  return `clearly readable as ${seed.primaryClass} first, with subtle ${seed.curatedMulticlassProfile.secondaryClass} influence in ${secondaryDetails}.`;
}


function sanitizeAccessoryWording(text: string, seed: CharacterSeed, context: 'armor' | 'weapon' | 'detail' | 'finish'): string {
  const isBannerWeapon = /banner|pennant/i.test(seed.weapon.name);
  let clean = text
    .replace(/spear and torn banner|banner spear|spear with torn banner/gi, 'spear with a small torn cloth near the blade')
    .replace(/command pennant cords?|first company banner fragment|battlefield flags?|huge flag behind the character|full-size banner cloth|large banner|giant banner|multiple pennants?/gi, isBannerWeapon ? 'small torn cloth' : 'faded cloak color')
    .replace(/many belts?|excessive belts?|multiple straps?|\bstraps?\b|crowded waist gear|overloaded belt gear|excessive buckles?/gi, context === 'armor' ? 'practical armor fastening' : 'clean silhouette')
    .replace(/\bchains?\b|cords?|hanging chains?|dangling chains?|chain clusters?|many chains?/gi, 'metal collar trim')
    .replace(/many medallions?|medallions?|multiple amulets?|many talismans?|talismans?|layered trinkets?/gi, 'one simple clasp')
    .replace(/many pouches?|hanging tags?|dangling ornaments?|ornaments?|many small metal charms?|charms?|multiple tassels?|tabs?/gi, 'single clean accent')
    .replace(/trophy loops?|many trophies?/gi, seed.primaryClass === 'barbarian' ? 'scarred hide shoulder' : 'trophy-scarred armor texture')
    .replace(/many ribbons?|prayer strips?|torn strips everywhere|excessive cloth strips?|long hanging scroll strips?/gi, 'clean sacred sash')
    .replace(/symbol-covered fabric|symbol-covered robes?|glyph fragments?|floating symbols?|floating glyphs?|formula bands?/gi, 'restrained embroidered trim')
    .replace(/overdesigned staff ornaments?|staff with many tags, ribbons, chains, carved symbols/gi, 'plain staff with one carved focus')
    .replace(/overdesigned spear decorations?/gi, 'clean spear silhouette')
    .replace(/stacked books?|multiple books?|loose pages?|hanging scrolls?|many wax seals?|archive labels?/gi, 'clean robe panels');
  if (context === 'weapon' && /\b(staff|wand|orb|focus)\b/i.test(seed.weapon.name)) {
    clean = clean.replace(/orbiting rings?|floating|covered in symbols|many carved symbols/gi, 'controlled');
  }
  return clean
    .replace(/\s*,\s*(?:clean silhouette|single clean accent)(?=\s*,|$)/gi, '')
    .replace(/\b(?:many|multiple|excessive|dangling|hanging|crowded|overloaded|overdesigned)\b\s*/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/(?:,\s*){2,}/g, ', ')
    .replace(/^,\s*|,\s*$/g, '')
    .trim();
}

function sanitizeArmorLanguageForImagePrompt(seed: CharacterSeed): string {
  const source = seed.armorLanguage.promptFragments[0] ?? seed.armorLanguage.label;
  return sanitizeAccessoryWording(source || seed.armor.name, seed, 'armor') || 'large readable armor shape';
}

function sanitizeWeaponNameForImagePrompt(seed: CharacterSeed): string {
  if (/banner|pennant/i.test(seed.weapon.name)) return 'spear with a small torn cloth near the blade';
  if (/staff/i.test(seed.weapon.name) && /ornament|tag|ribbon|chain|symbol/i.test(seed.weapon.name)) return 'plain ritual staff with one carved focus';
  return sanitizeAccessoryWording(seed.weapon.name, seed, 'weapon') || seed.weapon.name;
}

function sanitizeWeaponLanguageForImagePrompt(seed: CharacterSeed): string {
  if (/banner|pennant/i.test(seed.weapon.name)) return 'clean spear silhouette';
  const source = seed.weaponLanguage.promptFragments[0] ?? seed.weaponLanguage.label;
  return sanitizeAccessoryWording(source || seed.weapon.name, seed, 'weapon') || 'clean weapon silhouette';
}

function sanitizeFinishForImagePrompt(seed: CharacterSeed): string {
  const source = seed.equipmentFinish.promptFragments[0] ?? seed.equipmentFinish.label;
  return sanitizeAccessoryWording(source || 'grounded fantasy material finish', seed, 'finish') || 'grounded fantasy material finish';
}

function stylePresetForSeed(seed: CharacterSeed): StylePreset {
  if (seed.stylePreset !== 'heroic_dnd_concept_art') return seed.stylePreset;
  return 'heroic_dnd_concept_art';
}


function sanitizePoseForImagePrompt(seed: CharacterSeed): string {
  return seed.pose.name
    .replace(/planting a banner spear before the charge/gi, 'planting a spear before the charge')
    .replace(/banner spear/gi, 'spear')
    .replace(/giant flag|large flag|battlefield flags?|background banners?|framed by banners/gi, 'clean battlefield presence')
    .replace(/hovering grimoire|floating grimoire|scroll cascade|cascade of scrolls/gi, 'controlled focus')
    .replace(/tinkering with sparking tools at a workbench/gi, 'adjusting a sparking tool at chest height')
    .replace(/workbench|table|altar|map desk/gi, 'clean standing stance')
    .trim();
}

function sanitizeSilhouetteForImagePrompt(seed: CharacterSeed): string {
  const weaponText = normalizeText(seed.weapon.name);
  const hasBookTool = /book|grimoire|journal/.test(weaponText) || hasAny(seed.weapon.tags, ['book']);
  const hasStaffOrFocus = hasAny(seed.weapon.tags, ['staff', 'orb', 'wand', 'magic-focus', 'holy-focus']) && !hasBookTool;
  const raw = `${seed.silhouetteProfile.label}, ${seed.silhouetteProfile.promptFragment}`;
  let clean = raw;
  if (/saint with banners|framed by banners|banner commander|torn banner|banners?|flags?|pennants?/i.test(clean)) {
    clean = 'saintly wide silhouette with a broad tabard and halo-like shoulder shape';
  }
  if (/floating grimoire|hovering grimoire|living library|book-heavy|book shapes|chained tomes/i.test(clean)) {
    clean = hasBookTool
      ? 'clean caster silhouette with one held grimoire and strong robe panels'
      : 'clean caster silhouette with strong robe panels and one controlled arcane focus';
  }
  if (/spell scroll cascade|cascade of scrolls|scroll cascade|scrolls around/i.test(clean)) {
    clean = 'vertical caster silhouette with layered robe panels';
  }
  if (/reliquary bearer|relic-bearing|many relics|relic clusters|sacred relic carried/i.test(clean)) {
    clean = 'sacred guardian silhouette with one compact relic focus';
  }
  if (/tool clusters|tools and glyphs|astronomy tools|maps and expedition equipment|satchels and coils|rope lines|chain shapes|wraps and talismans|dangerous texts|sleep charms|moon-thread ribbons/i.test(clean)) {
    clean = clean
      .replace(/ringed by astronomy tools/gi, 'defined by a clean star-seer outline')
      .replace(/made of tools and glyphs/gi, 'with restrained angular robe geometry')
      .replace(/with maps and expedition equipment/gi, 'with a clean explorer cloak shape')
      .replace(/with satchels and coils/gi, 'with a salt-worn cloak shape')
      .replace(/with rope lines/gi, 'with a practical travel outline')
      .replace(/with chain shapes/gi, 'with a shadowed cloak edge')
      .replace(/with wraps and talismans/gi, 'with a bound cloak shape')
      .replace(/carrying dangerous texts/gi, 'with severe scholar robe panels')
      .replace(/with a lantern, sleep charms, and soft robe layers/gi, 'with a lantern and soft robe layers')
      .replace(/with drifting moon-thread ribbons/gi, 'with a soft moonlit cloak edge');
  }
  if (hasStaffOrFocus) {
    clean = clean.replace(/one held grimoire|hovering grimoire|book-heavy|book shapes/gi, 'one controlled arcane focus');
  }
  return clean
    .replace(/\b(banners?|flags?|pennants?|scroll cascade|cascade of scrolls|hovering grimoire|floating grimoire|book stack|book-heavy|chained tomes|many charms|tool clusters|many relics|relic clusters)\b/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/^,\s*|,\s*$/g, '')
    .trim() || 'clean readable silhouette with large costume shapes';
}


function rolePhraseForArtDirection(seed: CharacterSeed): string {
  const themeText = normalizeText(`${seed.visualTheme.id} ${seed.visualTheme.label} ${seed.archetype.name} ${seed.narrativeMotif.label}`);
  if (/grave|fallen|oath|saint|warden|burial/.test(themeText)) return 'grave oath guardian';
  if (/pirate|sea|coast|relic diver/.test(themeText)) return 'salt-worn relic seeker';
  if (/void|warlock|pact|cursed|forbidden|dream/.test(themeText)) return 'controlled occult visionary';
  if (/academy|scholar|archive|lore|book|cartographer|map/.test(themeText)) return 'focused scholar-adventurer';
  if (/fey|trickster|jester|bard|performer|song/.test(themeText)) return 'performer trickster';
  if (/frontier|hunter|scout|tracker|trail/.test(themeText)) return 'trail-tested hunter';
  if (/temple|monk|martial|master|avenger/.test(themeText)) return 'disciplined martial wanderer';
  if (/storm|berserk|raider|beast|blood|savage/.test(themeText)) return 'battle-scarred survivor';
  if (/engineer|artificer|clockwork|alchemist|device/.test(themeText)) return 'practical arcane engineer';
  return seed.visualTheme.label.toLowerCase();
}

function poseDirectiveForArtDirection(seed: CharacterSeed): string {
  const metadata = poseMetadata(seed.pose);
  const scale = seed.size === 'tiny' || seed.size === 'small' ? 'compact, scale-aware ' : '';
  if (metadata.poseFamily === 'performance_pose') return `${scale}performer-readable pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'subtle_casting') return `${scale}restrained magic pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'ritual_pose') return `${scale}quiet ritual pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'weapon_display') return `${scale}weapon-first pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'protective_stance') return `${scale}protective pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'stealth_motion') return `${scale}stealth-read pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'travel_pose') return `${scale}travel-worn pose: ${sanitizePoseForImagePrompt(seed)}`;
  if (metadata.poseFamily === 'grounded_power_stance') return `${scale}grounded power pose: ${sanitizePoseForImagePrompt(seed)}`;
  return `${scale}clear full-body pose: ${sanitizePoseForImagePrompt(seed)}`;
}

function inferMagicManifestationMode(seed: CharacterSeed): MagicManifestationMode {
  const text = normalizeText(`${seed.primaryClass} ${seed.buildTemplate.id} ${seed.visualTheme.id} ${seed.visualTheme.label} ${seed.archetype.name} ${seed.fx.name} ${seed.light.name} ${seed.weapon.name}`);
  if (seed.companion && /companion|familiar|spirit/.test(text)) return 'companion';
  if (/cleric|paladin|holy|divine|saint|oath|temple|radiant|halo/.test(text)) return 'light';
  if (/druid|ranger|fey|forest|frontier|swamp|petal|mist|leaves|storm/.test(text)) return 'environment';
  if (/warlock|void|dream|cursed|pact|oracle|shadow/.test(text)) return 'subtle_aura';
  if (/bard|song|performer|instrument|lute|flute|voice/.test(text)) return /rapier|songblade|weapon|blade/.test(text) ? 'weapon' : 'body';
  if (['wizard', 'sorcerer', 'artificer'].includes(seed.primaryClass)) return /staff|orb|wand|focus|book|device/.test(text) ? 'weapon' : 'body';
  if (seed.enchantmentIntensity !== 'none') return 'weapon';
  return 'none';
}

function magicManifestationPhrase(seed: CharacterSeed, artDirection: ArtDirectionBrief): string {
  const fx = seed.fx.name;
  switch (artDirection.magicManifestationMode) {
    case 'none':
      return 'no large magic effect; rely on silhouette, materials, and expression';
    case 'body':
      return `${fx} expressed close to the face, hands, breath, or posture, restrained and anatomical`;
    case 'weapon':
      return `${fx} held inside the main weapon or focus, one controlled glow only`;
    case 'environment':
      return `${fx} shown as restrained air, dust, leaves, mist, or ground reaction near the body`;
    case 'light':
      return `${fx} expressed through rim light, halo warmth, or weapon-edge light, not extra objects`;
    case 'companion':
      return `${fx} tied to the companion relationship while the character remains dominant`;
    case 'subtle_aura':
      return `${fx} as a close subtle aura near eyes, shoulders, or hands, no symbol cloud`;
  }
}

function causalStoryDetail(seed: CharacterSeed, source: string): string | null {
  const text = normalizeText(source);
  if (!source || objectClutterPattern.test(source) || accessoryClutterPattern.test(source) || /letter|ring|necklace|token|key|journal|map|record|coin|case|charm|cord/i.test(source)) return null;
  if (/scar|burn|ash|dented|patched|repaired|salt|mud|weathered|worn|stained|polished|frayed|chipped|cracked|soot|blood|rain/.test(text)) {
    return cleanPromptDetail(source);
  }
  return null;
}

function selectStoryShorthand(seed: CharacterSeed, artDirection?: Pick<ArtDirectionBrief, 'magicManifestationMode'>): string[] {
  const candidates = [
    ...seed.storyDetails,
    ...seed.visualDetails,
    ...seed.characterBoundDetails,
    ...seed.cultureDetails,
    sanitizeFinishForImagePrompt(seed),
  ];
  const selected: string[] = [];
  const motifKeys = new Set<string>();
  for (const candidate of candidates) {
    const causal = causalStoryDetail(seed, candidate) ?? transformObjectClutterDetail(candidate, seed);
    if (!causal) continue;
    const clean = cleanPromptDetail(causal);
    if (!clean || objectClutterPattern.test(clean) || accessoryClutterPattern.test(clean)) continue;
    const key = detailMotifKey(clean);
    if (!key || motifKeys.has(key)) continue;
    selected.push(clean);
    motifKeys.add(key);
    if (selected.length >= 2) break;
  }
  if (selected.length === 0) {
    if (seed.primaryClass === 'bard') selected.push('repaired performer fabric from many road shows');
    else if (seed.primaryClass === 'ranger') selected.push('mud-stained boots from long trail work');
    else if (seed.primaryClass === 'barbarian') selected.push('old scar lines across exposed shoulders');
    else if (seed.primaryClass === 'wizard' || seed.primaryClass === 'sorcerer' || seed.primaryClass === 'warlock') selected.push(artDirection?.magicManifestationMode === 'subtle_aura' ? 'sleep-deprived eyes with faint occult strain' : 'one polished focus grip from daily spell practice');
    else if (seed.primaryClass === 'cleric' || seed.primaryClass === 'paladin') selected.push('worn sacred trim dulled by travel and vigil');
  }
  return selected.slice(0, 2);
}

export function resolveArtDirection(seed: CharacterSeed): ArtDirectionBrief {
  const role = rolePhraseForArtDirection(seed);
  const poseDirective = poseDirectiveForArtDirection(seed);
  const magicManifestationMode = inferMagicManifestationMode(seed);
  const storyShorthand = selectStoryShorthand(seed, { magicManifestationMode });
  const secondaryFlavor = [
    seed.narrativeMotif.label,
    seed.culturalOrigin.label,
    magicManifestationPhrase(seed, { magicManifestationMode } as ArtDirectionBrief),
  ].filter(Boolean).slice(0, 3);
  const suppressedElements = [
    'extra books',
    'extra banners',
    'extra relics',
    'duplicate weapons',
    'excessive runes',
    'cathedral overload',
    'accessory clutter',
    'object clutter',
    'irrelevant story details',
    'flavor that competes with class or race read',
  ];
  if (!/book|grimoire|journal/i.test(seed.weapon.name)) suppressedElements.push('secondary books', 'hovering grimoires');
  if (!/banner|pennant/i.test(seed.weapon.name)) suppressedElements.push('literal banners', 'literal flags');
  if (seed.size === 'tiny' || seed.size === 'small') suppressedElements.push('bulky oversized heroic framing');
  const dominantRead = `${seed.size} ${seed.race.name} ${seed.primaryClass} as ${role}, ${sanitizePoseForImagePrompt(seed)}`;
  return {
    dominantRead,
    primaryVisualRead: [
      `${seed.size} ${seed.race.name}`,
      seed.primaryClass,
      seed.buildTemplate.label,
      sanitizeSilhouetteForImagePrompt(seed),
      seed.armor.name,
      sanitizeWeaponNameForImagePrompt(seed),
      sanitizePoseForImagePrompt(seed),
    ],
    secondaryFlavor,
    suppressedElements,
    poseDirective,
    magicManifestationMode,
    storyShorthand,
    promptPriorityOrder: ['race appearance', 'primary class', 'silhouette', 'armor or clothing', 'primary weapon or tool', 'pose', 'light and FX', 'story shorthand', 'negative controls'],
    imagePromptGuidance: [
      'primary read wins over flavor',
      'keep story shorthand causal and low clutter',
      'express magic through the selected manifestation mode',
      'omit suppressed elements from the final image prompt',
    ],
  };
}

type PrimaryReadStack = {
  identity: string;
  raceAppearance: string;
  classRead: string;
  silhouette: string;
  armor: string;
  weapon: string;
  pose: string;
};

type FlavorStack = {
  theme: string;
  details: string;
  companion: string | null;
  sceneProps: string;
  magic: string;
};

function buildPrimaryReadStack(seed: CharacterSeed, artDirection: ArtDirectionBrief): PrimaryReadStack {
  const weaponName = sanitizeWeaponNameForImagePrompt(seed);
  const weaponFragments = sanitizeWeaponLanguageForImagePrompt(seed);
  const armorFragments = sanitizeArmorLanguageForImagePrompt(seed);
  const identity = seed.curatedMulticlassProfile
    ? `Art direction: ${artDirection.dominantRead}. Create a ${seed.size} ${seed.race.name} ${seed.primaryClass} primary character, ${seed.primaryClass} / ${seed.curatedMulticlassProfile.secondaryClass} curated multiclass.`
    : `Art direction: ${artDirection.dominantRead}. Create a ${seed.size} ${seed.race.name} ${seed.primaryClass} character.`;
  return {
    identity,
    raceAppearance: `Race appearance: ${raceAppearanceForImagePrompt(seed)}.`,
    classRead: `Class and build fantasy: ${seed.archetype.name}, ${seed.buildTemplate.label}, ${multiclassInfluence(seed)}`,
    silhouette: `Silhouette: ${sanitizeSilhouetteForImagePrompt(seed)}.`,
    armor: `Armor and clothing: ${seed.armor.name}, with ${armorFragments}.`,
    weapon: `Weapon and tool: ${weaponName}, with ${weaponFragments}.`,
    pose: `Pose and expression: ${artDirection.poseDirective}, ${seed.emotion}, ${seed.mood.name}.`,
  };
}

function buildFlavorStack(seed: CharacterSeed, artDirection: ArtDirectionBrief): FlavorStack {
  const details = shortList(sanitizeImagePromptDetails(seed, [...artDirection.storyShorthand, ...seed.characterBoundDetails]), 2);
  return {
    theme: `Visual theme: ${seed.visualTheme.label}; secondary flavor: ${shortList(artDirection.secondaryFlavor, 3)}.`,
    details: `Character-bound visual details: ${details}.`,
    companion: seed.companion ? `Companion: ${seed.companion.label}, ${seed.companion.promptFragment}, visually subordinate to the character.` : null,
    sceneProps: seed.compositionMode === 'cinematic_splash_art' && seed.sceneProps.length > 0 ? shortList(seed.sceneProps, 2) : '',
    magic: `Magic and FX: ${magicManifestationPhrase(seed, artDirection)}.`,
  };
}

function composeImagePromptFromStacks(seed: CharacterSeed, primaryRead: PrimaryReadStack, flavor: FlavorStack): string {
  const stylePreset = stylePresets[stylePresetForSeed(seed)];
  const compactStyle = stylePresetForSeed(seed) === 'heroic_dnd_concept_art'
    ? 'heroic D&D concept art, realistic high-end RPG production art, painterly dark fantasy, large readable costume shapes, restrained accessories, few bold details, clean silhouette, no accessory clutter'
    : stylePreset.phrase;
  return sentenceJoin([
    compositionImagePromptPhrase(seed.compositionMode) + '.',
    compactStyle + '.',
    'Clean character design: minimal belts, minimal chains, no dangling ornaments, no trinket clutter.',
    primaryRead.identity,
    primaryRead.raceAppearance,
    primaryRead.classRead,
    primaryRead.silhouette,
    primaryRead.armor,
    primaryRead.weapon,
    primaryRead.pose,
    flavor.theme,
    flavor.details,
    flavor.magic,
    flavor.sceneProps ? `Limited scene props: ${flavor.sceneProps}.` : null,
    flavor.companion,
    `Lighting: ${seed.light.name}.`,
    qualityRulesForMode(seed.compositionMode),
    negativePromptForImage(),
  ]).replace(/subtle magical runes/gi, 'controlled focus shimmer').replace(/generic runes/gi, 'controlled focus shimmer').replace(/\s+/g, ' ').trim();
}

function formatImagePrompt(seed: CharacterSeed): string {
  const artDirection = resolveArtDirection(seed);
  return composeImagePromptFromStacks(seed, buildPrimaryReadStack(seed, artDirection), buildFlavorStack(seed, artDirection));
}



export function formatFullGenerationOutput(seedOutput: string, imagePrompt: string, options: { promptDraft?: string; includePromptDraft?: boolean } = {}): string {
  return [
    '=== D&D CHARACTER SEED ===',
    '',
    seedOutput.trim(),
    '',
    '=== IMAGE PROMPT ===',
    '',
    imagePrompt.trim(),
    ...(options.includePromptDraft && options.promptDraft ? ['', '=== PROMPT DRAFT ===', '', options.promptDraft.trim()] : []),
  ].join('\n');
}

function visualCore(seed: CharacterSeed): string {
  return [seed.buildTemplate.id, seed.visualTheme.id, seed.pose.name, seed.weapon.name, seed.light.name, seed.fx.name].join('|');
}

function seedSummary(seed: CharacterSeed): string {
  return `${seed.primaryClass}/${seed.visualTheme.id}/${seed.visualThemeVariant.id}/${seed.weapon.name}/${seed.pose.name}/${seed.light.name}/${seed.fx.name}`;
}

function detailOverlap(a: string[], b: string[]): number {
  const set = new Set(a);
  return b.filter((item) => set.has(item)).length;
}

function similarityScore(seed: CharacterSeed, previous: CharacterSeed): number {
  let score = 0;
  if (seed.buildTemplate.id === previous.buildTemplate.id) score += 15;
  if (seed.visualTheme.id === previous.visualTheme.id) score += 18;
  if (seed.visualThemeVariant.id === previous.visualThemeVariant.id) score += 8;
  if (seed.silhouetteProfile.id === previous.silhouetteProfile.id) score += 12;
  if (seed.armor.name === previous.armor.name) score += 10;
  if (seed.armorLanguage.id === previous.armorLanguage.id) score += 8;
  if (seed.weapon.name === previous.weapon.name) score += 12;
  if (seed.weaponLanguage.id === previous.weaponLanguage.id) score += 8;
  if (seed.pose.name === previous.pose.name) score += 14;
  if (seed.mood.name === previous.mood.name) score += 8;
  if (seed.light.name === previous.light.name) score += 10;
  if (seed.fx.name === previous.fx.name) score += 10;
  if (seed.visualMotif.id === previous.visualMotif.id) score += 8;
  if (seed.equipmentFinish.id === previous.equipmentFinish.id) score += 5;
  if (seed.equipmentEnchantment.id === previous.equipmentEnchantment.id) score += 5;
  if (seed.race.name === previous.race.name) score += 5;
  if (seed.race.name === previous.race.name) score += appearanceSimilarity(seed.appearanceProfile, previous.appearanceProfile);
  if (seed.culturalOrigin.id === previous.culturalOrigin.id) score += 5;
  if (seed.narrativeMotif.id === previous.narrativeMotif.id) score += 6;
  if (seed.narrativeVariant.id === previous.narrativeVariant.id) score += 4;
  if (seed.emotion === previous.emotion) score += 3;
  score += detailOverlap(seed.storyDetails, previous.storyDetails) * 2;
  score += detailOverlap(seed.cultureDetails, previous.cultureDetails) * 2;
  return score;
}

function analyzeRecentSimilarity(seed: CharacterSeed, threshold: number): SimilarityReport {
  let bestScore = 0;
  let bestAppearanceScore = 0;
  let bestSeed: CharacterSeed | null = null;
  let duplicateVisualCore = false;
  for (const previous of recentSeedMemory.slice(-20)) {
    const score = similarityScore(seed, previous);
    const appScore = seed.race.name === previous.race.name ? appearanceSimilarity(seed.appearanceProfile, previous.appearanceProfile) : 0;
    bestAppearanceScore = Math.max(bestAppearanceScore, appScore);
    if (score > bestScore) { bestScore = score; bestSeed = previous; }
    const sameCore = visualCore(seed) === visualCore(previous);
    const sameTemplateThemeWeaponPoseLightFx = seed.buildTemplate.id === previous.buildTemplate.id && seed.visualTheme.id === previous.visualTheme.id && seed.weapon.name === previous.weapon.name && seed.pose.name === previous.pose.name && seed.light.name === previous.light.name && seed.fx.name === previous.fx.name;
    const sameTemplateThemeArmorWeaponDetails = seed.buildTemplate.id === previous.buildTemplate.id && seed.visualTheme.id === previous.visualTheme.id && seed.armor.name === previous.armor.name && seed.weapon.name === previous.weapon.name && detailOverlap(seed.visualDetails, previous.visualDetails) >= 2;
    const sameFace = seed.race.name === previous.race.name && (seed.appearanceProfile.id === previous.appearanceProfile.id || appearanceSimilarity(seed.appearanceProfile, previous.appearanceProfile) >= 34);
    if (sameCore || sameTemplateThemeWeaponPoseLightFx || sameTemplateThemeArmorWeaponDetails || sameFace) duplicateVisualCore = true;
  }
  return { score: bestScore, tooSimilar: bestScore >= threshold || duplicateVisualCore, duplicateVisualCore, similarSummary: bestSeed ? seedSummary(bestSeed) : 'none', appearanceScore: bestAppearanceScore };
}

function rememberSeed(seed: CharacterSeed): void {
  recentSeedMemory.push(seed);
  if (recentSeedMemory.length > 20) recentSeedMemory.splice(0, recentSeedMemory.length - 20);
}



function curatedProfileMismatch(seed: CharacterSeed): boolean {
  return Boolean(seed.curatedMulticlassProfile && (
    seed.buildTemplate.id !== seed.curatedMulticlassProfile.buildTemplateId
    || !seed.curatedMulticlassProfile.compatibleThemes.includes(seed.visualTheme.id)
  ));
}

function enforceCuratedProfile(seed: CharacterSeed, context: SmartSelectionContext): CharacterSeed {
  if (!curatedProfileMismatch(seed)) return seed;
  context.trace.push(`Curated multiclass safety repair: restoring profile ${seed.curatedMulticlassProfile?.id}.`);
  return rerollLayer(seed, 'template', context);
}


function forceNonBulkyFairyTheme(seed: CharacterSeed, bulkyFairyThemeIds: Set<string>, context: SmartSelectionContext): CharacterSeed {
  if (seed.race.name !== 'fairy' || !bulkyFairyThemeIds.has(seed.visualTheme.id)) return seed;
  const safeTheme = visualThemes.find((theme) => theme.buildTemplateId === seed.buildTemplate.id && !bulkyFairyThemeIds.has(theme.id));
  if (!safeTheme) return seed;
  context.trace.push(`Tiny fairy fantasy repair: replacing bulky theme ${seed.visualTheme.id} with ${safeTheme.id}.`);
  const visualThemeVariant = selectVisualThemeVariant(safeTheme, context, seed.buildTemplate.allowedFx);
  const motifSelection = selectNarrativeMotif({ ...seed, visualTheme: safeTheme }, context);
  const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, seed.buildTemplate.allowedFx);
  return {
    ...seed,
    visualTheme: safeTheme,
    visualThemeVariant,
    visualDetails: pickVisualDetails(safeTheme, visualThemeVariant),
    narrativeMotif: motifSelection.motif,
    narrativeVariant,
    motifReason: motifSelection.reason,
    storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant),
    promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
  };
}

function sanitizeTinyFairyLoadout(seed: CharacterSeed, context: SmartSelectionContext): CharacterSeed {
  if (seed.race.name !== 'fairy') return seed;

  let nextSeed = seed;
  if (nextSeed.buildTemplate.id === 'savage_berserker') {
    context.trace.push('Tiny fairy fantasy repair: rerolling away from bulky savage_berserker template.');
    nextSeed = rerollLayer(nextSeed, 'template', context);
    if (nextSeed.buildTemplate.id !== 'savage_berserker') {
      nextSeed = rerollLayer(rerollLayer(rerollLayer(refreshVisualLibraryLayers(nextSeed, context), 'mood', context), 'light', context), 'fx', context);
    }
    if (nextSeed.buildTemplate.id === 'savage_berserker') {
      const lightFallback = buildTemplates.find((template) => template.id === (nextSeed.primaryClass === 'barbarian' ? 'frontier_hunter' : 'fey_trickster'));
      if (lightFallback) {
        const visualTheme = selectVisualTheme(lightFallback, nextSeed.archetype, nextSeed.race, context);
        const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, lightFallback.allowedFx);
        const motifSelection = selectNarrativeMotif({ ...nextSeed, buildTemplate: lightFallback, visualTheme }, context);
        const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, lightFallback.allowedFx);
        const armor = smartPickArmor(constrainedArmorOptions(lightFallback, nextSeed.archetype, nextSeed.primaryClass, nextSeed.size, visualTheme), nextSeed.primaryClass, context);
        const weaponOptions = constrainedWeaponOptions(lightFallback, nextSeed.archetype, nextSeed.size, nextSeed.race, nextSeed.primaryClass, visualTheme);
        const weapon = smartPickWeapon(weaponOptions, nextSeed.primaryClass, nextSeed.archetype, context);
        nextSeed = {
          ...nextSeed,
          buildTemplate: lightFallback,
          templateReason: 'tiny fairy light-fantasy fallback',
          visualTheme,
          visualThemeVariant,
          narrativeMotif: motifSelection.motif,
          narrativeVariant,
          motifReason: motifSelection.reason,
          storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant),
          promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments],
          armor,
          weapon,
          silhouette: smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(lightFallback, nextSeed, visualTheme), getClassAnchor(nextSeed.primaryClass).poseTags, context),
          pose: smartPickPose(constrainedPoseOptions(lightFallback, nextSeed.archetype, weapon, visualTheme), weapon, nextSeed.archetype, context, { primaryClass: nextSeed.primaryClass, visualTheme }),
          mood: smartPickSimpleOption('Mood', constrainedMoodOptions(lightFallback, nextSeed.archetype, visualTheme, motifSelection.motif, narrativeVariant), nextSeed.archetype.tags, context),
          light: smartPickSimpleOption('Light', constrainedLightOptions(lightFallback, nextSeed.archetype, visualTheme), nextSeed.archetype.tags, context),
          fx: smartPickSimpleOption('FX', constrainedFxOptions(lightFallback, nextSeed.archetype, visualTheme, motifSelection.motif, visualThemeVariant, narrativeVariant), [...nextSeed.archetype.tags, ...visualTheme.archetypeTags], context),
        };
        nextSeed = refreshVisualLibraryLayers(nextSeed, context);
      }
    }
  }
  if (nextSeed.armor.name === 'full plate with engraved pauldrons' || nextSeed.armor.tags.includes('heavy')) {
    const lightArmorOptions = constrainedArmorOptions(nextSeed.buildTemplate, nextSeed.archetype, nextSeed.primaryClass, nextSeed.size, nextSeed.visualTheme)
      .filter((armor) => !armor.tags.includes('heavy') && armor.name !== 'full plate with engraved pauldrons');
    if (lightArmorOptions.length > 0) {
      nextSeed = { ...nextSeed, armor: smartPickArmor(lightArmorOptions, nextSeed.primaryClass, context) };
    }
  }

  const currentAnchor = getClassAnchor(nextSeed.primaryClass);
  if (nextSeed.weapon.tags.includes('shield') || hasAny(nextSeed.weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace']) || !hasAny(nextSeed.weapon.tags, currentAnchor.weaponTags)) {
    const lightWeaponOptions = constrainedWeaponOptions(nextSeed.buildTemplate, nextSeed.archetype, nextSeed.size, nextSeed.race, nextSeed.primaryClass, nextSeed.visualTheme)
      .filter((weapon) => !weapon.tags.includes('shield') && !hasAny(weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace']));
    const anchor = getClassAnchor(nextSeed.primaryClass);
    const anchoredLightWeaponOptions = lightWeaponOptions.filter((weapon) => hasAny(weapon.tags, anchor.weaponTags));
    const tinyWeaponOptions = anchoredLightWeaponOptions.length > 0 ? anchoredLightWeaponOptions : lightWeaponOptions;
    if (tinyWeaponOptions.length > 0) {
      const weapon = smartPickWeapon(tinyWeaponOptions, nextSeed.primaryClass, nextSeed.archetype, context);
      const pose = smartPickPose(constrainedPoseOptions(nextSeed.buildTemplate, nextSeed.archetype, weapon, nextSeed.visualTheme), weapon, nextSeed.archetype, context, { primaryClass: nextSeed.primaryClass, visualTheme: nextSeed.visualTheme });
      nextSeed = ensureEmotionCoherence({ ...nextSeed, weapon, pose }, context);
    }
  }

  const bulkyFairyThemeIds = new Set(['raider_king', 'arena_champion', 'tribal_champion', 'storm_warrior', 'monster_slayer_veteran']);
  if (bulkyFairyThemeIds.has(nextSeed.visualTheme.id)) {
    nextSeed = forceNonBulkyFairyTheme(rerollLayer(nextSeed, 'theme', context), bulkyFairyThemeIds, context);
  }

  if (['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(nextSeed.silhouetteProfile.id)) {
    nextSeed = rerollLayer(nextSeed, 'silhouette', context);
  }

  if (nextSeed.silhouette.name === 'stocky shield-forward stance') {
    const compactSilhouettes = constrainedSilhouetteOptions(nextSeed.buildTemplate, nextSeed, nextSeed.visualTheme)
      .filter((silhouette) => !/stocky|shield-forward|towering|gigantic|giant/i.test(silhouette.name));
    if (compactSilhouettes.length > 0) {
      nextSeed = { ...nextSeed, silhouette: smartPickSimpleOption('Silhouette', compactSilhouettes, getClassAnchor(nextSeed.primaryClass).poseTags, context) };
    }
  }

  let finalSeed = refreshVisualLibraryLayers(nextSeed, context);
  if (bulkyFairyThemeIds.has(finalSeed.visualTheme.id)) {
    finalSeed = forceNonBulkyFairyTheme(rerollLayer(finalSeed, 'theme', context), bulkyFairyThemeIds, context);
  }
  if (['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(finalSeed.silhouetteProfile.id)) {
    finalSeed = rerollLayer(finalSeed, 'silhouette', context);
  }
  finalSeed = resolveSeedConflicts(finalSeed, context.trace, context);
  for (let repairAttempt = 0; repairAttempt < 5; repairAttempt += 1) {
    const hasBulkyTheme = bulkyFairyThemeIds.has(finalSeed.visualTheme.id);
    const hasBulkySilhouette = ['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(finalSeed.silhouetteProfile.id);
    const hasBulkyWeapon = finalSeed.weapon.tags.includes('shield') || hasAny(finalSeed.weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace']);
    if (finalSeed.buildTemplate.id !== 'savage_berserker' && !hasBulkyTheme && !hasBulkySilhouette && !hasBulkyWeapon) break;
    if (finalSeed.buildTemplate.id === 'savage_berserker') finalSeed = rerollLayer(finalSeed, 'template', context);
    if (bulkyFairyThemeIds.has(finalSeed.visualTheme.id)) finalSeed = forceNonBulkyFairyTheme(rerollLayer(finalSeed, 'theme', context), bulkyFairyThemeIds, context);
    if (['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(finalSeed.silhouetteProfile.id)) finalSeed = rerollLayer(finalSeed, 'silhouette', context);
  }
  finalSeed = forceNonBulkyFairyTheme(finalSeed, bulkyFairyThemeIds, context);
  if (finalSeed.weapon.tags.includes('shield') || hasAny(finalSeed.weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace'])) {
    const lightWeaponOptions = constrainedWeaponOptions(finalSeed.buildTemplate, finalSeed.archetype, finalSeed.size, finalSeed.race, finalSeed.primaryClass, finalSeed.visualTheme)
      .filter((weapon) => !weapon.tags.includes('shield') && !hasAny(weapon.tags, ['heavy', 'oversized', 'greataxe', 'greatsword', 'warhammer', 'mace']));
    if (lightWeaponOptions.length > 0) {
      const weapon = smartPickWeapon(lightWeaponOptions, finalSeed.primaryClass, finalSeed.archetype, context);
      finalSeed = { ...finalSeed, weapon, pose: smartPickPose(constrainedPoseOptions(finalSeed.buildTemplate, finalSeed.archetype, weapon, finalSeed.visualTheme), weapon, finalSeed.archetype, context, { primaryClass: finalSeed.primaryClass, visualTheme: finalSeed.visualTheme }) };
    }
  }
  finalSeed = forceNonBulkyFairyTheme(refreshVisualLibraryLayers(finalSeed, context), bulkyFairyThemeIds, context);
  finalSeed = resolveSeedConflicts(finalSeed, context.trace, context);
  finalSeed = forceNonBulkyFairyTheme(finalSeed, bulkyFairyThemeIds, context);
  if (['arena_colossus', 'siege_breaker_profile', 'banner_commander'].includes(finalSeed.silhouetteProfile.id)) {
    finalSeed = rerollLayer(finalSeed, 'silhouette', context);
  }
  return withClassAnchorScore(finalSeed);
}

function diversityThreshold(mode: DiversityMode, seedMode: Mode): number {
  if (mode === 'strict') return seedMode === 'chaos' ? 80 : 55;
  if (mode === 'soft') return seedMode === 'chaos' ? 80 : 65;
  return Number.POSITIVE_INFINITY;
}

export function generateCharacterSeed(options: GenerationOptions = {}): GenerationResult {
  const useSmartPool = options.useSmartPool ?? true;
  const diversityMode = options.diversityMode ?? 'soft';
  const compositionMode = options.compositionMode ?? 'full_body_character_art';
  const environmentDetailLevel = options.environmentDetailLevel ?? 'balanced';
  const stylePreset = options.stylePreset ?? 'heroic_dnd_concept_art';
  const trace: string[] = [`Starting v8 smart candidate pool generation (${useSmartPool ? 'smart pool' : 'baseline weighted'} mode; diversity ${diversityMode}).`];
  const context: SmartSelectionContext = { useSmartPool, trace, compositionMode, environmentDetailLevel, stylePreset };
  let seed = createSeed(context);
  let similarityStatus: SimilarityReport = { score: 0, tooSimilar: false, duplicateVisualCore: false, similarSummary: 'none' };

  trace.push(`[Stage selectModeAndClass] mode ${seed.mode}; primary ${seed.primaryClass}; classes ${seed.classes.join(' / ')}.`);
  trace.push(`[Stage selectRaceAndAppearance] race ${seed.race.name}; size ${seed.size}; appearance ${seed.appearanceProfile.id}.`);
  trace.push(`[Stage selectArchetype] ${seed.archetype.name} (${seed.archetype.tags.join(', ')}).`);
  trace.push(`[Stage selectBuildTemplate] ${seed.buildTemplate.id}; reason ${seed.templateReason}.`);
  trace.push(`[Stage selectVisualTheme] theme ${seed.visualTheme.id}; variant ${seed.visualThemeVariant.id}.`);
  trace.push(`[Stage selectPose] family ${poseMetadata(seed.pose).poseFamily}; energy ${poseMetadata(seed.pose).poseEnergy}; pose ${seed.pose.name}.`);
  trace.push(`[Stage selectNarrativeMotif] motif ${seed.narrativeMotif.id}; variant ${seed.narrativeVariant.id}.`);
  trace.push(`[Stage selectCulture] ${seed.culturalOrigin.label} (${seed.cultureDetails.join(', ')}).`);
  trace.push(`Selected appearance profile: ${seed.appearanceProfile.id} (${seed.appearanceProfile.promptFragment}).`);
  trace.push(`Composition mode: ${seed.compositionMode}; environment detail level: ${seed.environmentDetailLevel}; style preset: ${seed.stylePreset}.`);
  trace.push(`Identity priority: class ${identityInfluence.classIdentity}%, build template ${identityInfluence.buildTemplate}%, visual theme ${identityInfluence.visualTheme}%, narrative motif ${identityInfluence.narrativeMotif}%, theme variant ${identityInfluence.themeVariant}%, motif variant ${identityInfluence.motifVariant}%, culture ${identityInfluence.culture}%.`);
  trace.push(`Class Anchor Score: ${seed.classAnchorScore}/5.`);
  trace.push(`Motif selection reason: ${seed.motifReason}.`);
  trace.push(`Motif compatibility filters: template ${seed.buildTemplate.id}, theme ${seed.visualTheme.id}, class ${seed.primaryClass}, race ${seed.race.name}, tags ${seed.archetype.tags.join(', ')}.`);

  let resolvedSeed = sanitizeTinyFairyLoadout(ensureEmotionCoherence(refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(seed, trace, context)), context), context), context);
  if (diversityMode !== 'off') {
    const threshold = diversityThreshold(diversityMode, resolvedSeed.mode);
    for (let attempt = 0; attempt <= 60; attempt += 1) {
      similarityStatus = analyzeRecentSimilarity(resolvedSeed, threshold);
      if (!similarityStatus.tooSimilar) break;
      trace.push(`Recent similarity guard reroll ${attempt + 1}: score ${similarityStatus.score}, duplicate visual core ${similarityStatus.duplicateVisualCore}, most similar ${similarityStatus.similarSummary}.`);
      seed = createSeed(context);
      resolvedSeed = sanitizeTinyFairyLoadout(ensureEmotionCoherence(refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(seed, trace, context)), context), context), context);
    }
  }
  if (curatedProfileMismatch(resolvedSeed)) {
    resolvedSeed = sanitizeTinyFairyLoadout(ensureEmotionCoherence(refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(enforceCuratedProfile(resolvedSeed, context), trace, context)), context), context), context);
  }
  for (let validationAttempt = 0; validationAttempt < 40; validationAttempt += 1) {
    const validationIssues = validateGeneratedSeed(resolvedSeed);
    if (validationIssues.length === 0) break;
    trace.push(`Validation repair reroll ${validationAttempt + 1}: ${validationIssues.map((issue) => issue.message).join('; ')}.`);
    seed = createSeed(context);
    resolvedSeed = sanitizeTinyFairyLoadout(ensureEmotionCoherence(refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(seed, trace, context)), context), context), context);
    if (curatedProfileMismatch(resolvedSeed)) {
      resolvedSeed = sanitizeTinyFairyLoadout(ensureEmotionCoherence(refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(enforceCuratedProfile(resolvedSeed, context), trace, context)), context), context), context);
    }
  }
  similarityStatus = analyzeRecentSimilarity(resolvedSeed, diversityThreshold(diversityMode, resolvedSeed.mode));
  trace.push(`Recent similarity score: ${similarityStatus.score}; appearance similarity score: ${similarityStatus.appearanceScore ?? 0}; most similar previous seed: ${similarityStatus.similarSummary}; duplicate visual core or same-face: ${similarityStatus.duplicateVisualCore}; final status: ${similarityStatus.tooSimilar ? 'accepted after retry budget' : 'distinct'}.`);
  rememberSeed(resolvedSeed);
  trace.push(`Final fantasy pillar: ${resolvedSeed.fantasyPillar.label}.`);
  trace.push(`Final selected visualTheme: ${resolvedSeed.visualTheme.id}.`);
  trace.push(`Final selected visualThemeVariant: ${resolvedSeed.visualThemeVariant.id}.`);
  trace.push(`Final selected narrativeMotif: ${resolvedSeed.narrativeMotif.id}.`);
  trace.push(`Final selected narrativeVariant: ${resolvedSeed.narrativeVariant.id}.`);
  trace.push(`Final culture: ${resolvedSeed.culturalOrigin.label} (${resolvedSeed.cultureDetails.join(', ')}).`);
  trace.push(`Final appearance profile: ${resolvedSeed.appearanceProfile.id}.`);
  trace.push(`Final character-bound details: ${resolvedSeed.characterBoundDetails.length}; scene props: ${resolvedSeed.sceneProps.length}; background props: ${resolvedSeed.backgroundProps.length}.`);
  trace.push(`Final silhouette profile: ${resolvedSeed.silhouetteProfile.id} (${resolvedSeed.silhouetteProfile.category}).`);
  trace.push(`Final visual motif: ${resolvedSeed.visualMotif.id}.`);
  trace.push(`Final armor language: ${resolvedSeed.armorLanguage.id}.`);
  trace.push(`Final weapon language: ${resolvedSeed.weaponLanguage.id}.`);
  trace.push(`Final equipment finish: ${resolvedSeed.equipmentFinish.id}.`);
  trace.push(`Final equipment enchantment: ${resolvedSeed.equipmentEnchantment.id} (${resolvedSeed.enchantmentIntensity}).`);
  trace.push(`Final companion: ${resolvedSeed.companion ? `${resolvedSeed.companion.id} / ${resolvedSeed.companionRelationship?.id ?? 'no relationship'}` : 'none'}.`);
  trace.push(`Final visual detail count: ${resolvedSeed.visualDetails.length}; legendary details: ${resolvedSeed.legendaryVisualDetails.length}.`);
  trace.push(`Final Class Anchor Score: ${resolvedSeed.classAnchorScore}/5.`);
  trace.push(`Final motif compatibility filters: template ${resolvedSeed.buildTemplate.id}, theme ${resolvedSeed.visualTheme.id}, class ${resolvedSeed.primaryClass}, race ${resolvedSeed.race.name}, tags ${resolvedSeed.archetype.tags.join(', ')}.`);

  const artDirection = resolveArtDirection(resolvedSeed);
  trace.push(`[Stage resolveArtDirection] ${artDirection.dominantRead}; magic ${artDirection.magicManifestationMode}; shorthand ${artDirection.storyShorthand.join(' | ') || 'none'}.`);
  const seedOutput = formatSeed(resolvedSeed);
  const promptDraft = formatPrompt(resolvedSeed);
  const imagePrompt = formatImagePrompt(resolvedSeed);
  const fullGenerationText = formatFullGenerationOutput(seedOutput, imagePrompt);
  trace.push('[Stage composePromptDraft] Prompt Draft composed.');
  trace.push('[Stage composeImagePrompt] Image Prompt composed.');
  trace.push('[Stage composeFullGenerationText] Seed Output + Image Prompt composed for one-click copy.');

  return {
    seed: resolvedSeed,
    seedOutput,
    promptDraft,
    imagePrompt,
    fullGenerationText,
    trace,
  };
}
