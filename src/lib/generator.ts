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
  companionProfiles,
  armorLanguages,
  classAnchors,
  characterClasses,
  culturalOrigins,
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
  type ClassAnchor,
  type CharacterClass,
  type CulturalOrigin,
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
} from '../data/seedData';

type Mode = (typeof modeWeights)[number]['name'];
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
  | 'Companion'
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
};

export type GenerationOptions = {
  useSmartPool?: boolean;
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
  fantasyPillar: FantasyPillar;
  visualThemeVariant: VisualThemeVariant;
  visualFantasy: string;
  visualDetails: string[];
  visualDetailBudget: VisualDetailBudget;
  visualMotif: VisualMotif;
  narrativeMotif: NarrativeMotif;
  narrativeVariant: NarrativeVariant;
  culturalOrigin: CulturalOrigin;
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
  trace: string[];
};

export type ValidationIssue = {
  message: string;
  layers: RegenerableLayer[];
};

const smallRaceNames = ['gnome', 'halfling', 'fairy'];
const casterClasses: CharacterClass[] = ['wizard', 'sorcerer'];
const hardArmorTags = ['light', 'medium', 'heavy', 'metal'];
const scholarThemeIds = new Set(['divine_archivist', 'academy_mage', 'archive_performer']);
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
    const smartScoredWithoutScholar = context.useSmartPool && !isCartographerLike(archetype) && scored.some((entry) => entry.template.id !== 'divine_scholar')
      ? scored.filter((entry) => entry.template.id !== 'divine_scholar')
      : scored;
    const smartScored = context.useSmartPool && primaryClass !== 'ranger' && smartScoredWithoutScholar.some((entry) => entry.template.id !== 'frontier_hunter')
      ? smartScoredWithoutScholar.filter((entry) => entry.template.id !== 'frontier_hunter')
      : smartScoredWithoutScholar;
    const baselinePick = () => {
      const bestScore = Math.max(...scored.map((entry) => entry.score));
      const best = scored.filter((entry) => entry.score === bestScore).map((entry) => ({ ...entry.template, weight: entry.template.weight }));
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
    if (archetype.tags.includes('pirate')) return theme.id === 'pirate_raider' || theme.id === 'lore_skald' || theme.id === 'relic_thief';
    if (archetype.tags.includes('cartographer')) return ['relic_thief', 'academy_mage', 'ritualist', 'divine_archivist'].includes(theme.id);
    if (archetype.name === 'exiled temple guardian') return ['temple_guardian', 'battle_chaplain', 'grave_warden'].includes(theme.id);
    return false;
  });

  const pool = forcedByArchetype.length > 0 ? forcedByArchetype : candidates;
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
  const sizeFilter = (armor: WeightedOption<ArmorOption>) => !(size === 'tiny' && armor.name === 'full plate with engraved pauldrons');
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
  const sizeFilter = (weapon: WeightedOption<WeaponOption>) => !((['tiny', 'small'].includes(size) || race.tags.includes('fey')) && (weapon.tags.includes('oversized') || weapon.tags.includes('greataxe')));
  const preferredOptions = templateOptions(weapons, names).filter(sizeFilter);
  const templateAllowed = templateOptions(weapons, template.allowedWeapons).filter(sizeFilter);
  const options = preferredOptions.length > 0 ? preferredOptions : templateAllowed;
  const sourceOptions = isCartographerLike(archetype) ? templateAllowed : options;

  return prefer(classAnchorWeaponOptions(sourceOptions.length > 0 ? sourceOptions : templateOptions(weapons, template.allowedWeapons), primaryClass), [
    (weapon) => isCartographerLike(archetype) && hasAny(weapon.tags, ['map', 'compass', 'scroll', 'book', 'staff']),
    (weapon) => (archetype.tags.includes('oathkeeper') || archetype.tags.includes('fallen')) && hasAny(weapon.tags, ['shield', 'mace', 'warhammer', 'holy-focus']),
    (weapon) => hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(weapon.tags, ['bow', 'spear', 'dual-blades', 'handaxe']),
    (weapon) => hasAny(archetype.tags, ['fey', 'trickster']) && hasAny(weapon.tags, ['rapier', 'instrument', 'flute', 'dagger', 'fey-focus']),
    (weapon) => hasAny(archetype.tags, ['academy', 'arcane', 'mage']) && hasAny(weapon.tags, ['staff', 'book', 'orb', 'wand']),
  ]);
}

function constrainedPoseOptions(template: BuildTemplate, archetype: ArchetypeOption, weapon: WeaponOption, theme?: VisualTheme) {
  const names = themeNames((theme?.preferredPoses ?? []).filter((name) => template.allowedPoses.includes(name)), template.allowedPoses);
  const options = isCartographerLike(archetype) ? templateOptions(poses, template.allowedPoses) : templateOptions(poses, names);

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

function smartPickPose(options: Array<WeightedOption<PoseOption>>, weapon: WeaponOption, archetype: ArchetypeOption, context: SmartSelectionContext): PoseOption {
  const candidateOptions = isCartographerLike(archetype)
    ? options.filter((pose) => hasAny(pose.tags, ['map', 'tools']))
    : options;
  const scoredOptions = candidateOptions.length > 0 ? candidateOptions : options;
  return smartSelect(
    'Pose',
    scoredOptions.map((pose) => {
      let score = pose.weight + 20;
      const reasons: string[] = [];
      if (hasAny(weapon.tags, ['bow', 'longbow', 'shortbow']) && pose.tags.includes('bow')) { score += 40; reasons.push('bow pose fits weapon'); }
      if (weapon.tags.includes('shield') && pose.tags.includes('shield')) { score += 40; reasons.push('shield pose fits weapon'); }
      if (weapon.tags.includes('dual-blades') && pose.tags.includes('dual-blades')) { score += 40; reasons.push('dual-blades pose fits weapon'); }
      if (weapon.tags.includes('rapier') && pose.tags.includes('rapier')) { score += 40; reasons.push('rapier pose fits weapon'); }
      if (hasAny(weapon.tags, ['heavy', 'greataxe', 'greatsword']) && pose.tags.includes('heavy-melee')) { score += 40; reasons.push('heavy melee pose fits weapon'); }
      if (hasAny(weapon.tags, ['staff', 'orb', 'wand', 'book', 'magic-focus', 'holy-focus']) && hasAny(pose.tags, ['casting', 'prayer'])) { score += 30; reasons.push('focus casting pose fit'); }
      if (hasAny(weapon.tags, ['tool', 'mechanical-focus', 'map', 'compass', 'scroll']) && hasAny(pose.tags, ['tools', 'map'])) { score += 30; reasons.push('tool pose fit'); }
      if (isCartographerLike(archetype) && hasAny(pose.tags, ['map', 'tools'])) { score += 100; reasons.push('cartographer pose fit'); }
      if (hasAny(archetype.tags, ['frontier', 'scout', 'hunter']) && hasAny(pose.tags, ['tracking', 'bow', 'general'])) { score += 10; reasons.push('archetype pose fit'); }
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
  if (language.id === 'dragon_hunter_blade' && hasAny(weapon.tags, ['bow', 'warhammer', 'hammer', 'mace', 'staff', 'instrument', 'tool'])) return false;
  if (language.id === 'reliquary_warhammer' && !hasAny(weapon.tags, ['warhammer', 'hammer', 'mace'])) return false;
  if (language.id === 'academy_spell_staff' && !hasAny(weapon.tags, ['staff', 'book', 'wand', 'focus'])) return false;
  if (language.id === 'void_orb_focus' && !hasAny(weapon.tags, ['orb', 'occult'])) return false;
  if (language.id === 'ranger_bone_bow' && !weapon.tags.includes('bow')) return false;
  if (language.id === 'fey_cane_sword' && !weapon.tags.includes('rapier')) return false;
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

function isDragonLike(companion: CompanionProfile | null): boolean {
  return !!companion && ['dragon', 'shadow'].includes(companion.companionType) && /dragon|drake|wyvern/i.test(companion.id);
}

function silhouetteCompatible(profile: SilhouetteProfile, theme: VisualTheme, seed: Pick<CharacterSeed, 'mode' | 'primaryClass' | 'size'>, companion: CompanionProfile | null): boolean {
  if (!profile.compatibleSizes.includes(seed.size)) return false;
  if (profile.compatibleThemes && profile.compatibleThemes.length > 0 && !profile.compatibleThemes.includes(theme.id) && seed.mode !== 'chaos' && ['companion', 'mounted'].includes(profile.category) && !companion) return false;
  if (profile.forbiddenClasses?.includes(seed.primaryClass)) return false;
  if (seed.mode !== 'chaos' && ['tiny', 'small'].includes(seed.size) && ['wide', 'mounted'].includes(profile.category)) return false;
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

function selectVisualMotif(theme: VisualTheme, buildTemplate: BuildTemplate, profile: ThemeVisualProfile, context: SmartSelectionContext): VisualMotif {
  const candidates = visualMotifs.filter((motif) => visualMotifCompatible(motif, theme, buildTemplate, profile));
  const profileFallback = visualMotifs.filter((motif) => profile.visualMotifIds.includes(motif.id));
  const buildFallback = visualMotifs.filter((motif) => motif.compatibleBuildTemplates.includes(buildTemplate.id));
  const pool = candidates.length > 0 ? candidates : profileFallback.length > 0 ? profileFallback : buildFallback.length > 0 ? buildFallback : visualMotifs;
  return smartSelect(
    'Visual Motif',
    pool.map((motif) => ({
      item: motif,
      score: 40 + (profile.visualMotifIds.includes(motif.id) ? 35 : 0) + (motif.compatibleThemes.includes(theme.id) ? 25 : 0) + (motif.compatibleBuildTemplates.includes(buildTemplate.id) ? 15 : 0),
      reasons: [`theme ${theme.id}`, `pillar ${profile.fantasyPillarId}`],
    })),
    context,
    () => pool[0],
  );
}

function selectArmorLanguage(armor: ArmorOption, seed: Pick<CharacterSeed, 'primaryClass' | 'buildTemplate' | 'visualTheme' | 'fantasyPillar' | 'culturalOrigin'>, profile: ThemeVisualProfile, context: SmartSelectionContext): ArmorLanguage {
  const candidates = armorLanguages.filter((language) => armorLanguageCompatible(language, armor, seed));
  const pool = candidates.length > 0 ? candidates : armorLanguages.filter((language) => language.armorCategory.some((tag) => armor.tags.includes(tag)) && language.id === 'plain_armor_language');
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
  const pool = candidates.length > 0 ? candidates : weaponLanguages.filter((language) => language.baseWeaponTags.some((tag) => weapon.tags.includes(tag)) && language.id === 'plain_weapon_language');
  return smartSelect(
    'Weapon Language',
    (pool.length > 0 ? pool : weaponLanguages.filter((language) => language.baseWeaponTags.some((tag) => weapon.tags.includes(tag)))).map((language) => ({
      item: language,
      score: 35 + (profile.weaponLanguageIds.includes(language.id) ? 30 : 0) + (language.compatibleThemes.includes(theme.id) ? 25 : 0) + language.baseWeaponTags.filter((tag) => weapon.tags.includes(tag)).length * 8,
      reasons: [`weapon ${weapon.name}`, `theme ${theme.id}`],
    })),
    context,
    () => (pool.length > 0 ? pool : weaponLanguages)[0],
  );
}

function companionTierWeights(template: BuildTemplate, primaryClass: CharacterClass, theme: VisualTheme, profile: ThemeVisualProfile): Array<WeightedOption<{ name: CompanionTier }>> {
  const pillar = profile.fantasyPillarId;
  const beastmasterLike = template.id === 'frontier_hunter' || primaryClass === 'ranger' || primaryClass === 'druid' || ['trail_warden', 'beast_slayer', 'forest_sprite'].includes(theme.id);
  if (beastmasterLike) return [{ name: 'none', weight: 83 }, { name: 'minor', weight: 9 }, { name: 'major', weight: 6 }, { name: 'legendary', weight: 2 }];
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
  const mode = weightedPick(modeWeights).name;
  const classes = pickClasses(mode);
  const primaryClass = classes[0];
  const race = weightedPick(races);
  const size = getRaceSize(race);
  const archetype = pickArchetype(classes, primaryClass);
  const { template: buildTemplate, reason: templateReason } = selectBuildTemplate(primaryClass, archetype, race, mode, context);
  const visualTheme = selectVisualTheme(buildTemplate, archetype, race, context);
  const themeProfile = getThemeVisualProfile(visualTheme);
  const fantasyPillar = getFantasyPillar(visualTheme, primaryClass, buildTemplate);
  const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, buildTemplate.allowedFx);
  const visualMotif = selectVisualMotif(visualTheme, buildTemplate, themeProfile, context);
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
  const armor = smartPickArmor(constrainedArmorOptions(buildTemplate, archetype, primaryClass, size, visualTheme), primaryClass, context);
  const armorLanguage = selectArmorLanguage(armor, { primaryClass, buildTemplate, visualTheme, fantasyPillar, culturalOrigin }, themeProfile, context);
  const weaponOptions = constrainedWeaponOptions(buildTemplate, archetype, size, race, primaryClass, visualTheme);
  const weapon = avoidBarbarianBowWeapon(weaponOptions, smartPickWeapon(weaponOptions, primaryClass, archetype, context), classes);
  const weaponLanguage = selectWeaponLanguage(weapon, buildTemplate, visualTheme, themeProfile, context);
  const companionSelection = selectCompanion(buildTemplate, primaryClass, visualTheme, themeProfile, archetype, context);
  const silhouetteProfile = selectSilhouetteProfile(buildTemplate, visualTheme, { mode, primaryClass, size }, companionSelection.companion, context);
  const silhouette = smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(buildTemplate, { mode, primaryClass, race, size, archetype }, visualTheme), getClassAnchor(primaryClass).poseTags, context);
  const pose = smartPickPose(constrainedPoseOptions(buildTemplate, archetype, weapon, visualTheme), weapon, archetype, context);
  const visualDetailSelection = buildVisualDetails(visualTheme, visualThemeVariant, themeProfile, visualMotif, armorLanguage, weaponLanguage, companionSelection.companion);
  context.trace.push(`Visual Detail Budget: major ${visualDetailSelection.budget.majorVisualDetails}, minor ${visualDetailSelection.budget.minorVisualDetails}, story ${visualDetailSelection.budget.storyProps}, culture ${visualDetailSelection.budget.cultureDetails}, companion ${visualDetailSelection.budget.companionDetails}, legendary ${visualDetailSelection.budget.legendaryDetails}.`);

  const seed: CharacterSeed = {
    mode,
    primaryClass,
    classes,
    race,
    size,
    archetype,
    buildTemplate,
    templateReason,
    visualTheme,
    fantasyPillar,
    visualThemeVariant,
    visualFantasy: themeProfile.visualFantasy,
    visualDetails: visualDetailSelection.details,
    visualDetailBudget: visualDetailSelection.budget,
    visualMotif,
    narrativeMotif,
    narrativeVariant,
    culturalOrigin,
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
    companion: companionSelection.companion,
    companionRelationship: companionSelection.relationship,
    companionDetails: visualDetailSelection.companionDetails,
    legendaryVisualDetails: visualDetailSelection.legendary,
    pose,
    emotion: weightedPick(emotions).name,
    mood: smartPickSimpleOption('Mood', constrainedMoodOptions(buildTemplate, archetype, visualTheme, narrativeMotif, narrativeVariant), archetype.tags, context),
    light: smartPickSimpleOption('Light', constrainedLightOptions(buildTemplate, archetype, visualTheme), archetype.tags, context),
    fx: smartPickSimpleOption('FX', constrainedFxOptions(buildTemplate, archetype, visualTheme, narrativeMotif, visualThemeVariant, narrativeVariant), [...archetype.tags, ...visualTheme.archetypeTags], context),
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

  if (isCartographerLike(seed.archetype) && !(hasAny(weaponTags, ['map', 'compass', 'scroll', 'book', 'staff']) && hasAny(poseTags, ['map', 'tools', 'prayer', 'casting', 'general']))) {
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
  const visualMotif = selectVisualMotif(seed.visualTheme, seed.buildTemplate, themeProfile, context);
  const armorLanguage = selectArmorLanguage(seed.armor, { ...seed, fantasyPillar }, themeProfile, context);
  const weaponLanguage = selectWeaponLanguage(refreshedWeapon, seed.buildTemplate, seed.visualTheme, themeProfile, context);
  let companionSelection = selectCompanion(seed.buildTemplate, seed.primaryClass, seed.visualTheme, themeProfile, seed.archetype, context);
  let silhouetteProfile = selectSilhouetteProfile(seed.buildTemplate, seed.visualTheme, seed, companionSelection.companion, context);
  if (companionSelection.companion && ['major', 'legendary'].includes(companionSelection.companion.tier) && !['companion', 'mounted'].includes(silhouetteProfile.category)) {
    companionSelection = { companion: null, relationship: null, tier: 'none' };
    silhouetteProfile = selectSilhouetteProfile(seed.buildTemplate, seed.visualTheme, seed, null, context);
  }
  const visualDetailSelection = buildVisualDetails(seed.visualTheme, seed.visualThemeVariant, themeProfile, visualMotif, armorLanguage, weaponLanguage, companionSelection.companion);
  if (seed.archetype.tags.includes('pirate') && !hasAny(visualDetailSelection.details, ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'])) {
    visualDetailSelection.details = uniqueCleanDetails(['rope belt', ...visualDetailSelection.details]).slice(0, 8);
  }
  context.trace.push(`Visual Detail Budget: major ${visualDetailSelection.budget.majorVisualDetails}, minor ${visualDetailSelection.budget.minorVisualDetails}, story ${visualDetailSelection.budget.storyProps}, culture ${visualDetailSelection.budget.cultureDetails}, companion ${visualDetailSelection.budget.companionDetails}, legendary ${visualDetailSelection.budget.legendaryDetails}.`);
  return withClassAnchorScore({
    ...seed,
    fantasyPillar,
    visualFantasy: themeProfile.visualFantasy,
    visualMotif,
    armorLanguage,
    weapon: refreshedWeapon,
    weaponLanguage,
    pose: refreshedPose,
    companion: companionSelection.companion,
    companionRelationship: companionSelection.relationship,
    companionDetails: visualDetailSelection.companionDetails,
    silhouetteProfile,
    visualDetails: visualDetailSelection.details,
    visualDetailBudget: visualDetailSelection.budget,
    legendaryVisualDetails: visualDetailSelection.legendary,
    promptFragments: [...seed.narrativeMotif.promptFragments, ...seed.narrativeVariant.promptFragments, ...seed.visualThemeVariant.promptFragments, ...visualMotif.promptFragments, ...armorLanguage.promptFragments, ...weaponLanguage.promptFragments, ...(companionSelection.companion ? [companionSelection.companion.promptFragment, companionSelection.relationship?.promptFragment ?? ''] : [])].filter(Boolean),
  });
}

function rerollLayer(seed: CharacterSeed, layer: RegenerableLayer, context: SmartSelectionContext): CharacterSeed {
  if (layer === 'template') {
    const selection = selectBuildTemplate(seed.primaryClass, seed.archetype, seed.race, seed.mode, context);
    const visualTheme = selectVisualTheme(selection.template, seed.archetype, seed.race, context);
    const visualThemeVariant = selectVisualThemeVariant(visualTheme, context, selection.template.allowedFx);
    const motifSelection = selectNarrativeMotif({ ...seed, buildTemplate: selection.template, visualTheme }, context);
    const narrativeVariant = selectNarrativeVariant(motifSelection.motif, context, selection.template.allowedFx);
    return { ...seed, buildTemplate: selection.template, templateReason: selection.reason, visualTheme, visualThemeVariant, visualDetails: pickVisualDetails(visualTheme, visualThemeVariant), narrativeMotif: motifSelection.motif, narrativeVariant, motifReason: motifSelection.reason, storyDetails: pickStoryDetails(motifSelection.motif, narrativeVariant), promptFragments: [...motifSelection.motif.promptFragments, ...narrativeVariant.promptFragments, ...visualThemeVariant.promptFragments] };
  }

  if (layer === 'theme') {
    const visualTheme = selectVisualTheme(seed.buildTemplate, seed.archetype, seed.race, context);
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
    return { ...seed, weapon, pose: smartPickPose(constrainedPoseOptions(seed.buildTemplate, seed.archetype, weapon, seed.visualTheme), weapon, seed.archetype, context) };
  }

  if (layer === 'silhouette') {
    return { ...seed, silhouette: smartPickSimpleOption('Silhouette', constrainedSilhouetteOptions(seed.buildTemplate, seed, seed.visualTheme), getClassAnchor(seed.primaryClass).poseTags, context) };
  }

  if (layer === 'pose') {
    return { ...seed, pose: smartPickPose(constrainedPoseOptions(seed.buildTemplate, seed.archetype, seed.weapon, seed.visualTheme), seed.weapon, seed.archetype, context) };
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
    pose: smartPickPose(constrainedPoseOptions(fallback, nextSeed.archetype, weapon, nextSeed.visualTheme), weapon, nextSeed.archetype, context),
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
    `Companion: ${seed.companion ? seed.companion.label : 'none'}`,
    `Companion Relationship: ${seed.companionRelationship ? seed.companionRelationship.label : 'none'}`,
    `Pose: ${seed.pose.name}`,
    `Emotion: ${seed.emotion}`,
    `Mood: ${seed.mood.name}`,
    `Light: ${seed.light.name}`,
    `FX: ${seed.fx.name}`,
    `Visual Details: ${seed.visualDetails.join(', ')}`,
    `Legendary Visual Details: ${seed.legendaryVisualDetails.length > 0 ? seed.legendaryVisualDetails.join(', ') : 'none'}`,
    `Story Details: ${seed.storyDetails.join(', ')}`,
  ].join('\n');
}

function formatPrompt(seed: CharacterSeed): string {
  return [
    `Detailed fantasy concept art portrait of a ${seed.race.name} ${formatClassLine(seed)}.`,
    `Build template: ${seed.buildTemplate.label}; fantasy pillar: ${seed.fantasyPillar.label}; visual theme: ${seed.visualTheme.label} (${seed.visualFantasy}); theme variant: ${seed.visualThemeVariant.label}.`,
    `Silhouette: ${seed.silhouetteProfile.label}, ${seed.silhouetteProfile.promptFragment}.`,
    `Armor: ${seed.armor.name}; armor language: ${seed.armorLanguage.promptFragments.join(', ')}.`,
    `Weapon or tool: ${seed.weapon.name}; weapon language: ${seed.weaponLanguage.promptFragments.join(', ')}.`,
    `Pose: ${seed.pose.name}; expression: ${seed.emotion}.`,
    seed.companion ? `Companion: ${seed.companion.label}, ${seed.companion.promptFragment}; relationship: ${seed.companionRelationship?.label ?? 'bonded companion'}.` : 'No companion; keep the silhouette focused on the character.',
    `Primary visual motif: ${seed.visualMotif.label}; ${seed.visualMotif.promptFragments.join(', ')}.`,
    `Visual details: ${seed.visualDetails.join(', ')}.`,
    `Cultural details: ${seed.cultureDetails.slice(0, 2).join(', ')}.`,
    `Lighting: ${seed.light.name}; primary visual effect: ${seed.fx.name}.`,
    'Negative prompt: biography text, wall of lore, unreadable gear, duplicate props, extra FX, modern clothing, text in image.',
  ].join(' ');
}

export function generateCharacterSeed(options: GenerationOptions = {}): GenerationResult {
  const useSmartPool = options.useSmartPool ?? true;
  const trace: string[] = [`Starting v8 smart candidate pool generation (${useSmartPool ? 'smart pool' : 'baseline weighted'} mode).`];
  const context: SmartSelectionContext = { useSmartPool, trace };
  const seed = createSeed(context);

  trace.push(`Selected mode: ${seed.mode}.`);
  trace.push(`Selected class: primary ${seed.primaryClass}; classes ${seed.classes.join(' / ')}.`);
  trace.push(`Selected archetype: ${seed.archetype.name} (${seed.archetype.tags.join(', ')}).`);
  trace.push(`Selected buildTemplate: ${seed.buildTemplate.id}.`);
  trace.push(`Template selection reason: ${seed.templateReason}.`);
  trace.push(`Selected visualTheme: ${seed.visualTheme.id}.`);
  trace.push(`Selected visualThemeVariant: ${seed.visualThemeVariant.id}.`);
  trace.push(`Selected narrativeMotif: ${seed.narrativeMotif.id}.`);
  trace.push(`Selected narrativeVariant: ${seed.narrativeVariant.id}.`);
  trace.push(`Selected culture: ${seed.culturalOrigin.label} (${seed.cultureDetails.join(', ')}).`);
  trace.push(`Identity priority: class ${identityInfluence.classIdentity}%, build template ${identityInfluence.buildTemplate}%, visual theme ${identityInfluence.visualTheme}%, narrative motif ${identityInfluence.narrativeMotif}%, theme variant ${identityInfluence.themeVariant}%, motif variant ${identityInfluence.motifVariant}%, culture ${identityInfluence.culture}%.`);
  trace.push(`Class Anchor Score: ${seed.classAnchorScore}/5.`);
  trace.push(`Motif selection reason: ${seed.motifReason}.`);
  trace.push(`Motif compatibility filters: template ${seed.buildTemplate.id}, theme ${seed.visualTheme.id}, class ${seed.primaryClass}, race ${seed.race.name}, tags ${seed.archetype.tags.join(', ')}.`);

  const resolvedSeed = refreshVisualLibraryLayers(withClassAnchorScore(resolveSeedConflicts(seed, trace, context)), context);
  trace.push(`Final fantasy pillar: ${resolvedSeed.fantasyPillar.label}.`);
  trace.push(`Final selected visualTheme: ${resolvedSeed.visualTheme.id}.`);
  trace.push(`Final selected visualThemeVariant: ${resolvedSeed.visualThemeVariant.id}.`);
  trace.push(`Final selected narrativeMotif: ${resolvedSeed.narrativeMotif.id}.`);
  trace.push(`Final selected narrativeVariant: ${resolvedSeed.narrativeVariant.id}.`);
  trace.push(`Final culture: ${resolvedSeed.culturalOrigin.label} (${resolvedSeed.cultureDetails.join(', ')}).`);
  trace.push(`Final silhouette profile: ${resolvedSeed.silhouetteProfile.id} (${resolvedSeed.silhouetteProfile.category}).`);
  trace.push(`Final visual motif: ${resolvedSeed.visualMotif.id}.`);
  trace.push(`Final armor language: ${resolvedSeed.armorLanguage.id}.`);
  trace.push(`Final weapon language: ${resolvedSeed.weaponLanguage.id}.`);
  trace.push(`Final companion: ${resolvedSeed.companion ? `${resolvedSeed.companion.id} / ${resolvedSeed.companionRelationship?.id ?? 'no relationship'}` : 'none'}.`);
  trace.push(`Final visual detail count: ${resolvedSeed.visualDetails.length}; legendary details: ${resolvedSeed.legendaryVisualDetails.length}.`);
  trace.push(`Final Class Anchor Score: ${resolvedSeed.classAnchorScore}/5.`);
  trace.push(`Final motif compatibility filters: template ${resolvedSeed.buildTemplate.id}, theme ${resolvedSeed.visualTheme.id}, class ${resolvedSeed.primaryClass}, race ${resolvedSeed.race.name}, tags ${resolvedSeed.archetype.tags.join(', ')}.`);

  return {
    seed: resolvedSeed,
    seedOutput: formatSeed(resolvedSeed),
    promptDraft: formatPrompt(resolvedSeed),
    trace,
  };
}
