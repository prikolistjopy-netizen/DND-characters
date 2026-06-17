const { rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.debug-check-build');
const sampleSize = 5000;

rmSync(outDir, { recursive: true, force: true });
run(
  'tsc',
  [
    '--ignoreConfig',
    '--outDir',
    outDir,
    '--module',
    'commonjs',
    '--target',
    'ES2020',
    '--moduleResolution',
    'node10',
    '--ignoreDeprecations',
    '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib',
    'ES2020,DOM',
    'src/data/seedData.ts',
    'src/lib/generator.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));

const { generateCharacterSeed, validateGeneratedSeed, resetSmartCandidatePoolMemory, resolveArtDirection, validateArtDirectionBrief, renderTextureHygieneRisk } = require(path.join(outDir, 'lib/generator.js'));
const { visualThemes, visualThemeVariants, narrativeMotifs, narrativeVariants, culturalOrigins, themeContentProfiles, raceAppearanceRules, curatedMulticlassProfiles, dreamWalkerCompatibilityAliases, dreamWalkerRejectedCompatibilityTags } = require(path.join(outDir, 'data/seedData.js'));
const raceRulesById = new Map(raceAppearanceRules.map((rule) => [rule.raceId, rule]));
const curatedProfileIds = new Set(curatedMulticlassProfiles.map((profile) => profile.id));
const dreamWalkerIconicPattern = /sleeping spirit|living dream butterflies|fractured reality|dream serpent|miniature moonlit door/i;

const failures = [];

function hasAny(tags, values) {
  return values.some((value) => tags.includes(value));
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topEntries(map, limit = 20) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

const motifCounts = new Map();
const narrativeVariantCounts = new Map();
const themeCounts = new Map();
const themeVariantCounts = new Map();
const storyDetailCounts = new Map();
const combinationCounts = new Map();
const cultureCounts = new Map();
const classScoreCounts = new Map();
const classScoreTotals = new Map();
const scholarThemeCounts = new Map();
const silhouetteCounts = new Map();
const visualMotifCounts = new Map();
const companionCounts = new Map();
const armorLanguageCounts = new Map();
const weaponLanguageCounts = new Map();
const equipmentFinishCounts = new Map();
const equipmentEnchantmentCounts = new Map();
const enchantmentIntensityCounts = new Map();
const visualDetailCounts = new Map();
const plainWeaponFallbackSources = new Map();
const plainWeaponFallbackTags = new Map();
const plainWeaponFallbackBuildTemplates = new Map();
const plainWeaponFallbackThemes = new Map();
const plainWeaponFallbackClasses = new Map();
const sequentialThemeCounts = new Map();
const sequentialPoseCounts = new Map();
const sequentialFxCounts = new Map();
const sequentialDetailCounts = new Map();
let sequentialSimilarityTotal = 0;
let sequentialSimilarityMax = 0;
let sequentialComparisonCount = 0;
let consecutiveVisualCoreDuplicateCount = 0;
let tooSimilarSequentialCount = 0;
let equipmentContradictionCount = 0;
let companionActiveCount = 0;
let legendaryCompanionCount = 0;
let frontierCompanionGroupCount = 0;
let frontierCompanionActiveCount = 0;
let conflictCount = 0;
const mismatchCounts = {
  weaponLanguage: 0,
  armorLanguage: 0,
  silhouette: 0,
  companion: 0,
  visualMotif: 0,
  pillar: 0,
};
const companionByClass = new Map();
const companionByBuildTemplate = new Map();
const companionClassTotals = new Map();
const companionBuildTemplateTotals = new Map();
const appearanceCountsByRace = new Map();
const appearanceDistribution = new Map();
const compositionModeCounts = new Map();
const environmentLevelCounts = new Map();
const scenePropCounts = new Map();
const characterBoundCounts = new Map();
const repeatedScenePropCounts = new Map();
const modeCounts = new Map();
const curatedProfileCounts = new Map();
const dreamWalkerVariantCounts = new Map();
const dreamWalkerSilhouetteCounts = new Map();
const dreamWalkerArmorCounts = new Map();
const dreamWalkerWeaponCounts = new Map();
const dreamWalkerWeaponLanguageCounts = new Map();
const dreamWalkerFinishCounts = new Map();
const dreamWalkerEnchantmentCounts = new Map();
const dreamWalkerPoseCounts = new Map();
const dreamWalkerMoodCounts = new Map();
const dreamWalkerLightCounts = new Map();
const dreamWalkerFxCounts = new Map();
const dreamWalkerDetailCounts = new Map();
let dreamWalkerCount = 0;
let dreamWalkerScenePropTotal = 0;
let dreamWalkerIconicCount = 0;
let scenePropTotal = 0;
let characterBoundTotal = 0;
let excessiveClutterCount = 0;
let consecutiveSameRaceSameAppearanceCount = 0;
let dwarfSameBeardRepeatCount = 0;
let raceForbiddenFeatureViolations = 0;
let sameRaceAppearanceSimilarityTotal = 0;
let sameRaceAppearanceComparisonCount = 0;
let randomMulticlassCount = 0;
let tripleMulticlassCount = 0;
let forbiddenMulticlassCount = 0;
let multiclassAnchorTotal = 0;
let multiclassAnchorCount = 0;
let imagePromptWordTotal = 0;
let imagePromptWordMax = 0;
let imagePromptOver450Count = 0;
let imagePromptNoReadableTextCount = 0;
let imagePromptNoTextPhraseCount = 0;
let imagePromptFullBodyModePhraseCount = 0;
let imagePromptFullBodyModeTotal = 0;
let imagePromptRaceAppearanceCount = 0;
let imagePromptClassReadabilityCount = 0;
let imagePromptQualityRulesCount = 0;
let imagePromptNegativePromptCount = 0;
let imagePromptScenePropTotal = 0;
let imagePromptCharacterBoundTotal = 0;
let fullGenerationMissingCount = 0;
let fullGenerationMissingSeedHeaderCount = 0;
let fullGenerationMissingImageHeaderCount = 0;
let fullGenerationImageMismatchCount = 0;
let fullGenerationContainsTraceCount = 0;
let fullGenerationOldPromptCount = 0;
let oldPromptTemplateAsImagePromptCount = 0;
let imagePromptMissingCompositionPhraseCount = 0;
let imagePromptMissingRaceAppearanceCount = 0;
let imagePromptMissingClassReadabilityCount = 0;
let aasimarPromptCount = 0;
let aasimarCelestialMarkerCount = 0;
let aasimarEyeMarkerCount = 0;
let aasimarHaloMarkCount = 0;
let aasimarGenericRiskCount = 0;
let noisyDetailTotal = 0;
let paperOverusePromptCount = 0;
let spyglassOutsideAllowedCount = 0;
let ledgerOutsideAllowedCount = 0;
let tagCharmClusterOveruseCount = 0;
let repeatedHighImpactPoseWithinFiveCount = 0;
let repeatedPoseSameClassWithinTenCount = 0;
let emotionPoseMismatchCount = 0;
let bardAsWizardRiskCount = 0;
let bardWithoutPerformerAnchorCount = 0;
let fairyFullPlateCount = 0;
let fairyHeavyShieldCount = 0;
let tinyHeavyHolyWarriorRiskCount = 0;
let imagePromptBackgroundHintFullBodyCount = 0;
let imagePromptCompressedDetailTotal = 0;
let repeatedExactPoseWithinEightCount = 0;
let casterPoseTotal = 0;
let casterActiveCastingPoseCount = 0;
let imagePromptObjectClutterCount = 0;
let imagePromptPaperClutterCount = 0;
let imagePromptBookStackCount = 0;
let imagePromptBannerClutterCount = 0;
let imagePromptChainCharmClutterCount = 0;
let promptsWithMoreThanOneObjectDetail = 0;
let promptsWithStackedBooks = 0;
let promptsWithBattleReports = 0;
let promptsWithCampaignMaps = 0;
let promptsWithHugeBannerRisk = 0;
let promptsWithExcessiveBeltOrTagRisk = 0;
let accessoryClutterPhraseCount = 0;
let beltPhraseCount = 0;
let chainPhraseCount = 0;
let danglingPhraseCount = 0;
let medallionPhraseCount = 0;
let ribbonPhraseCount = 0;
let bannerLargeFlagRisk = 0;
let giantBannerPhraseCount = 0;
let bannerWeaponLargeFlagRisk = 0;
let scholarLibraryRisk = 0;
let weaponAccessoryOverloadRisk = 0;
let armorAccessoryOverloadRisk = 0;
let silhouetteBannerTriggerCount = 0;
let silhouetteBookTriggerCount = 0;
let silhouetteScrollTriggerCount = 0;
let silhouetteClutterTriggerCount = 0;
let positiveBannerWordCountFullBody = 0;
let wizardSecondaryBookTrigger = 0;
let staffPlusBookSilhouetteRisk = 0;
let fairySavageBerserkerRisk = 0;
let fairyRaiderKingRisk = 0;
let fairyArenaColossusRisk = 0;
let tinyBulkyMartialRisk = 0;
let smallRaceOverscaleSilhouetteRisk = 0;
let smallRaceOversizedWeaponRisk = 0;
let highImpactPoseCount = 0;
let casterSigilPoseCount = 0;
let positiveNegativeContradictionCount = 0;
const poseUsageCounts = new Map();
const poseFamilyCounts = new Map();
let repeatedPoseFamilyWithinEightCount = 0;
let classPoseRepetitionCount = 0;
let weaponPoseRepetitionCount = 0;
let primaryReadMissingRace = 0;
let primaryReadMissingClass = 0;
let primaryReadMissingSilhouette = 0;
let primaryReadMissingWeapon = 0;
let primaryReadMissingPose = 0;
let primaryReadMissingPoseFamily = 0;
let flavorStackDominatesPromptCount = 0;
const recentPoseFamilyWindow = [];
const recentClassPoseFamilyWindow = [];
const recentWeaponPoseFamilyWindow = [];
const recentExactPoseWindow = [];
let artDirectionGeneratedCount = 0;
let dominantReadMissingClassCount = 0;
let dominantReadMissingRaceCount = 0;
let dominantReadTooLongCount = 0;
let primaryVisualReadCoverageTotal = 0;
let secondaryFlavorOverBudgetCount = 0;
let suppressedElementLeakCount = 0;
let storyShorthandTotal = 0;
let storyShorthandClutterRiskCount = 0;
let genericRuneFxAfterArtDirectionCount = 0;
let magicModeClassMismatchCount = 0;
let artDirectionPrimaryReadRegressionCount = 0;
const magicManifestationModeCounts = new Map();
let dominantReadClassDriftCount = 0;
let dominantReadThemeOverridesClassCount = 0;
let dominantReadWrongRoleNounCount = 0;
let dominantReadPrimaryClassCoverageCount = 0;
let artDirectionRepairCount = 0;
let dominantReadRepairCount = 0;
let poseDirectiveRepairCount = 0;
let secondaryFlavorDemotionCount = 0;
let conflictingFlavorSuppressedCount = 0;
const magicModeDistributionByClass = new Map();
const casterBodyMagicTotals = new Map();
const casterBodyMagicCounts = new Map();
let environmentMagicGenericCount = 0;
let bardOrbCasterReadCount = 0;
let holySymbolNonDivineReadCount = 0;
let imagePromptWordCountAfterArtDirectionCompressionTotal = 0;
let artDirectionCompressionRemovedFlavorCount = 0;
let primaryReadLostAfterCompressionCount = 0;
let artistBriefMissingDominantRead = 0;
let artistBriefMissingClass = 0;
let artistBriefMissingPose = 0;
let artistBriefTooLong = 0;
let artistBriefSuppressionMissing = 0;
let raceClassPlausibilityRiskCount = 0;
let blockedDefaultRaceClassCount = 0;
let chaosOnlyRaceClassInDefaultCount = 0;
let rareRaceClassReinterpretedCount = 0;
let raceClassReinterpretationAppliedCount = 0;
let themeOverridesPrimaryClassCount = 0;
let themeDowngradedToFlavorCount = 0;
let themeReinterpretedThroughClassCount = 0;
let themeRerolledForClassReadCount = 0;
let fighterPaladinDriftRiskCount = 0;
let rogueBardDriftRiskCount = 0;
let rogueRangerDriftRiskCount = 0;
let wizardClericDriftRiskCount = 0;
let druidBardDriftRiskCount = 0;
let divineHaloOveruseCount = 0;
let genericHolyBacklightCount = 0;
let cathedralRaysOveruseCount = 0;
const divineLightModeDistribution = new Map();
let fighterWithPaladinLightCount = 0;
let clericPaladinLightCollapseCount = 0;
let renderGridArtifactPromptRiskCount = 0;
let rhombusTextureRiskCount = 0;
let scaleTextureOnNonScaledRaceRiskCount = 0;
let overPatternedFabricRiskCount = 0;
let runeMotifGroundedNonArcaneCount = 0;
const recentPoseWindow = [];
const recentPoseClassWindow = [];
const warnings = [];

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function hasForbiddenNoTextPhrase(text) {
  return /\bno text\b|no text in image|text in image/i.test(text);
}


function startsWithCompositionPhrase(text) {
  return /^(full-body character concept art, centered character, entire body visible from head to toe, clean readable silhouette, minimal environment|focused character concept portrait, readable face and upper costume, limited background, strong race features|cinematic fantasy splash art, dynamic scene, dramatic lighting, readable character silhouette|clean vertical character card illustration, full body visible, readable silhouette, minimal background, strong design clarity)\./.test(text);
}
function oldPromptTemplate(text) {
  return /^Detailed fantasy concept art portrait of/i.test(text);
}
function extractImageDetailText(prompt) {
  const match = prompt.match(/Character-bound visual details: (.*?)(?:\. Culture details:|\. Magic and FX:|\. Limited scene props:|\. Companion:|\. Light:)/);
  return match ? match[1] : '';
}
function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}
function entropyFromCounts(counts) {
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0 || counts.size <= 1) return { entropy: 0, normalized: 0 };
  const entropy = [...counts.values()].reduce((sum, count) => { const p = count / total; return sum - p * Math.log2(p); }, 0);
  return { entropy, normalized: entropy / Math.log2(counts.size) };
}
function countMatchingDetailItems(text, pattern) {
  return text.split(/,\s*/).filter((item) => pattern.test(item)).length;
}
const noisyDetailPattern = /spyglass|wanted poster|ledger|records?|license|black-market relic tags?|wax-sealed inventory|trap maps?|coffin tags?|\btag\b|\btags\b|paper|scroll|journal|map|poster|inventory|trinket|tiny charm|hanging charm/i;
const paperRecordPattern = /ledger|records?|license|inventory|poster|map|scroll|journal|letter|contract|paper|notes|registry|writ/i;
const spyglassPattern = /spyglass/i;
const ledgerPattern = /ledger|license|inventory/i;
const tagCharmPattern = /tag|charm|bead|trinket|token|coin|key|seal/i;
const spyglassAllowedThemes = new Set(['pirate_raider', 'bounty_hunter', 'cartographer', 'scout', 'relic_thief', 'trail_warden', 'monster_tracker', 'swamp_tracker']);
const bureaucracyAllowedThemes = new Set(['bounty_hunter', 'monster_tracker', 'relic_thief', 'trail_warden', 'divine_archivist', 'academy_mage', 'archive_performer', 'dream_walker']);
const aasimarCelestialPattern = /celestial|radiant skin|halo|divine mark|birthmark|ethereal/i;
const aasimarEyePattern = /luminous .*eyes|radiant eyes|silver eyes|star-like pupils|reflective eyes/i;
const aasimarHaloMarkPattern = /halo|birthmark|divine mark|celestial scars|tear marks/i;
const genericAasimarRiskPattern = /generic human|ordinary human|human with only/i;
const bardPerformerAnchorPattern = /lute|flute|instrument|song|skald|perform|story|rapier|cane sword|stage|bard|music|courtly|flourish/i;
const bardWizardRiskPattern = /\b(?:small|weathered|generic)?\s*spellbook\b|grimoire|tracing a glowing sigil|sigil trace/i;
const activeCasterPosePattern = /tracing|casting with both hands|sigil|spell gesture|speaking a spell|extended in subtle magic/i;
const highImpactPoseNames = new Set(['shield braced against incoming sparks', 'flying kick with prayer beads suspended midair', 'kneeling prayer as holy light gathers', 'performing a playful fey flourish', 'ready stance on a cracked dungeon tile', 'tracing a glowing sigil in the air', 'studying a map under candlelight', 'overhead strike with a heavy blade']);
const imagePromptObjectClutterPattern = /battle reports?|field orders?|campaign maps?|\bmaps?\b|records?|ledgers?|inventory|license tags?|\btags?\b|labels?|wax seals?|bookmarks?|loose pages?|loose papers?|documents?|notes?|scrolls?|orders?|thesis fragments?|stacked books?|\bbooks?\b|book stacks?|multiple books?|chained books?|library stamps?|charts?|astronomical charts?|tally papers?|wanted posters?|poster fragments?|pamphlets?|flags?|banners?|banner fragments?|pennant cords?|hanging chains?|many chains?|many belts?|excessive straps?|dangling charms?|many medallions?|many talismans?|many ribbons?|trophy loops?|many trophies?|glyph fragments?|floating symbols?/i;
const imagePromptPaperClutterPattern = /battle reports?|field orders?|campaign maps?|\bmaps?\b|records?|ledgers?|inventory|license tags?|\btags?\b|labels?|bookmarks?|loose pages?|loose papers?|documents?|notes?|scrolls?|orders?|thesis fragments?|charts?|tally papers?|wanted posters?|poster fragments?|pamphlets?/i;
const imagePromptBookStackPattern = /stacked books?|stacked academy books?|book stacks?|multiple books?|chained books?|\bacademy books?\b|library stamps?|library records?/i;
const imagePromptBannerClutterPattern = /flags?|banners?|banner fragments?|first company banner|pennant cords?|background banners?|giant flags?|multiple pennants?/i;
const imagePromptChainCharmClutterPattern = /hanging chains?|many chains?|many belts?|excessive straps?|dangling charms?|many medallions?|many talismans?|many ribbons?|trophy loops?|many trophies?|glyph fragments?|floating symbols?/i;
const objectLikeDetailPattern = /\b(book|grimoire|map|scroll|paper|journal|ledger|record|poster|tag|label|seal|banner|flag|pennant|chain|belt|charm|medallion|talisman|trophy|glyph|symbol|page|document|note|report|chart|order|token|coin|necklace)\b/i;
const antiClutterControlPattern = /Clean character design:[^.]+\.|Clean design:[^.]+\.|Negative prompt:.+$/gi;
const accessoryClutterPhrasePattern = /many belts?|excessive belts?|multiple straps?|hanging chains?|dangling chains?|chain clusters?|many medallions?|multiple amulets?|many pouches?|hanging tags?|dangling ornaments?|trophy loops?|many trophies?|many ribbons?|torn strips everywhere|excessive cloth strips?|long hanging scroll strips?|symbol-covered fabric|many small metal charms?|multiple tassels?|crowded waist gear|overloaded belt gear|layered trinkets?|excessive buckles?|overdesigned staff ornaments?|overdesigned spear decorations?|giant banners?|large flags?|multiple pennants?/i;
const beltPhrasePattern = /many belts?|excessive belts?|multiple straps?|crowded waist gear|overloaded belt gear|excessive buckles?/i;
const chainPhrasePattern = /hanging chains?|dangling chains?|chain clusters?|many chains?|chain clutter/i;
const danglingPhrasePattern = /dangling ornaments?|hanging tags?|dangling tags?|dangling charms?/i;
const medallionPhrasePattern = /many medallions?|multiple amulets?|many talismans?|layered trinkets?/i;
const ribbonPhrasePattern = /many ribbons?|prayer strips?|torn strips everywhere|excessive cloth strips?|long hanging scroll strips?/i;
const largeBannerPhrasePattern = /giant banners?|large flags?|full-size banner|battlefield flags?|huge flag|background banners?|multiple pennants?|oversized banners?/i;
const scholarLibraryRiskPattern = /wearable library|stacked books?|multiple books?|loose pages?|hanging scrolls?|many wax seals?|archive labels?|formula bands? all over|symbol-covered robes?|book piles?/i;
const weaponAccessoryOverloadPattern = /weapon and tool:[^.]+(?:many|multiple|excessive|dangling|hanging|overdesigned|symbol-covered|giant banner|large flag|command pennant cords|floating symbols)/i;
const armorAccessoryOverloadPattern = /armor and clothing:[^.]+(?:many|multiple|excessive|dangling|hanging|crowded|overloaded|symbol-covered|trophy loops|prayer strips)/i;
const silhouetteBannerTriggerPattern = /silhouette:[^.]+(?:banner|flag|pennant)/i;
const silhouetteBookTriggerPattern = /silhouette:[^.]+(?:floating grimoire|hovering grimoire|living library|book-heavy|book stack|book shapes|chained tomes|wearable library)/i;
const silhouetteScrollTriggerPattern = /silhouette:[^.]+(?:scroll cascade|cascade of scrolls|scrolls around|hanging scrolls)/i;
const silhouetteClutterTriggerPattern = /silhouette:[^.]+(?:many relics|relic clusters|many charms|tool clusters|satchels and coils|rope lines|chain shapes|dangerous texts|astronomy tools)/i;
const normalizedBannerSpearPhrase = /spear with (?:a |one )small torn pennant near the blade/i;
const positiveBannerWordPattern = /\b(banner|banners|flag|flags|pennant|pennants)\b/gi;
const secondaryBookTriggerPattern = /hovering grimoire|floating grimoire|second read|book-heavy|book stack|book shapes|wearable library|living library|chained tomes/i;
const fairyBulkyThemeIds = new Set(['raider_king', 'arena_champion', 'tribal_champion', 'storm_warrior', 'monster_slayer_veteran']);
const bulkySilhouetteIds = new Set(['arena_colossus', 'siege_breaker_profile', 'banner_commander']);
const oversizedWeaponPattern = /oversized maul|heavy greatsword|heavy greataxe|heavy weapon/i;
const casterSigilPosePattern = /tracing a glowing sigil in the air/i;
function poseCategory(seed) {
  const text = `${seed.pose.name} ${(seed.pose.tags ?? []).join(' ')}`.toLowerCase();
  if (/prayer|kneeling|holy|sacred|ritual|sigil/.test(text)) return 'prayer_ritual';
  if (/map|journal|study|studying|research|book|scroll|tools/.test(text)) return 'study_research';
  if (/stealth|shadow|hidden|assassin|knife|crouch/.test(text)) return 'stealth_ready';
  if (/fey|flourish|playful|perform|lute|flute|dance/.test(text)) return 'fey_performance';
  if (/shield|guard|deflect|block|braced|defensive/.test(text)) return 'defensive_combat';
  if (/strike|kick|attack|greatsword|axe|swing|duel|rapier|bow/.test(text)) return 'offensive_combat';
  return 'calm_portrait';
}

function poseFamily(seed) {
  const text = `${seed.pose.name} ${(seed.pose.tags ?? []).join(' ')}`.toLowerCase();
  if (/instrument|song|story|perform|flourish|lute|flute/.test(text)) return 'performance_pose';
  if (/dagger|crouch|ambush|stealth|cloak|stiletto|lock/.test(text)) return 'stealth_motion';
  if (/shield|guard|protective|warding|reliquary/.test(text)) return 'protective_stance';
  if (/staff planted|focus close|orb close|spell softly|one-handed spell|subtle magic|focus lowered/.test(text)) return 'subtle_casting';
  if (/ritual|prayer|holy symbol|blessing|meditating|kneeling|relic censer/.test(text)) return 'ritual_pose';
  if (/tracking|travel|walking|cloak held|wind|boots|road|bow held lowered|tracks|lantern low/.test(text)) return 'travel_pose';
  if (/pommel|weapon grounded|checking blade|raised|greatsword|greataxe|maul|spear|bow|rapier|blade|weapon display/.test(text)) return 'weapon_display';
  if (/ready stance|ready but not|braced|combat|close-quarters/.test(text)) return 'combat_ready';
  if (/wound|survivor|after battle|battlefield|scar/.test(text)) return 'wounded_survivor';
  if (/quiet authority|courtly|noble|portrait/.test(text)) return 'noble_portrait';
  if (/tinkering|calibrating|adjusting|bracer|tool|device|gauntlet/.test(text)) return 'class_specific_idle';
  if (/laughing|social|storytelling|unseen audience/.test(text)) return 'social_pose';
  if (/ground slam|overhead|flying kick|charging|howling|leaping|mid-air/.test(text)) return 'grounded_power_stance';
  return 'calm_presence';
}
function poseIsHighImpact(seed) {
  return /tracing a glowing sigil|ready stance on a cracked dungeon tile|overhead strike|shield braced|kneeling prayer|flying kick|ground slam|charging|mid-air|leaping/i.test(seed.pose.name);
}
function promptHasPrimaryRead(prompt, seed) {
  return {
    race: prompt.includes('Race appearance:'),
    classRead: prompt.includes('Class and build fantasy:') && prompt.includes(seed.primaryClass),
    silhouette: prompt.includes('Silhouette:'),
    weapon: prompt.includes('Weapon and tool:'),
    pose: prompt.includes('Pose and expression:'),
    poseFamily: Boolean(poseFamily(seed)),
  };
}
function emotionPoseMismatch(seed) {
  const category = poseCategory(seed);
  const emotion = seed.emotion;
  if (category === 'defensive_combat' && ['reckless joy', 'curious delight'].includes(emotion) && seed.primaryClass !== 'barbarian' && !seed.visualTheme.id.includes('fey')) return true;
  if (category === 'prayer_ritual' && ['wry confidence', 'reckless joy'].includes(emotion)) return true;
  if (category === 'stealth_ready' && emotion === 'curious delight' && !seed.visualTheme.id.includes('fey')) return true;
  if (category === 'study_research' && ['barely contained fury', 'reckless joy'].includes(emotion)) return true;
  return false;
}
function runeMotifGrounded(seed) {
  return seed.visualMotif?.id === 'rune_motif' && ['bounty_hunter', 'pirate_raider', 'urban_assassin', 'mercenary_captain', 'arena_champion', 'royal_guard', 'duel_saint'].includes(seed.visualTheme.id) && !['wizard', 'sorcerer', 'warlock', 'artificer'].includes(seed.primaryClass);
}

function classifyValidationIssue(issue) {
  const message = issue.message;
  if (message.includes('weapon language') || message.includes('blade weapon language') || message.includes('mechanical tool language') || message.includes('cane sword language')) mismatchCounts.weaponLanguage += 1;
  if (message.includes('armor language') || message.includes('academy robes') || message.includes('hunter leather')) mismatchCounts.armorLanguage += 1;
  if (message.includes('silhouette profile') || message.includes('companion silhouette') || message.includes('dragon_warden') || message.includes('falconer') || message.includes('beastmaster')) mismatchCounts.silhouette += 1;
  if (message.includes('companion must') || message.includes('legendary companion') || message.includes('major/legendary companion')) mismatchCounts.companion += 1;
  if (message.includes('visual motif')) mismatchCounts.visualMotif += 1;
  if (message.includes('fantasy pillar')) mismatchCounts.pillar += 1;
  if (message.includes('equipment enchantment')) equipmentContradictionCount += 1;
}

function isFrontierCompanionGroup(seed) {
  return ['ranger', 'druid'].includes(seed.primaryClass) || seed.buildTemplate.id === 'frontier_hunter' || ['trail_warden', 'monster_tracker', 'beast_slayer', 'forest_sprite'].includes(seed.visualTheme.id);
}

function isVoidFx(seed) { return seed.fx.tags.includes('void') || /void|black-violet|purple/.test(seed.fx.name); }
function isHolyFx(seed) { return seed.fx.tags.includes('holy') || /holy|divine|spectral feather/.test(seed.fx.name); }
function isFeyFx(seed) { return seed.fx.tags.includes('fey') || /fey|petal|witchfire|pollen|butterfl/.test(seed.fx.name); }
function enchantmentFamily(seed) {
  const id = seed.equipmentEnchantment?.id ?? 'none';
  if (seed.enchantmentIntensity === 'none') return 'none';
  if (/holy|relic|stained_glass/.test(id)) return 'holy';
  if (/void|eclipse|starlight/.test(id)) return 'void';
  if (/fey|flower/.test(id)) return 'fey';
  if (/rune/.test(id)) return 'rune';
  if (/mechanical/.test(id)) return 'mechanical';
  if (/necrotic|grave/.test(id)) return 'necrotic';
  return 'battle';
}
function hasContradictoryEquipmentFx(seed) {
  const family = enchantmentFamily(seed);
  if (['none', 'rune'].includes(family)) return false;
  return (isVoidFx(seed) && ['holy', 'fey'].includes(family)) || (isHolyFx(seed) && ['void', 'fey', 'necrotic'].includes(family)) || (isFeyFx(seed) && ['void', 'holy', 'necrotic', 'mechanical'].includes(family));
}

for (const theme of visualThemes) {
  const count = visualThemeVariants.filter((variant) => variant.visualThemeId === theme.id).length;
  if (count < 3) {
    failures.push(`visual theme ${theme.id} has only ${count} variant(s)`);
  }
}

for (const motif of narrativeMotifs) {
  const count = narrativeVariants.filter((variant) => variant.narrativeMotifId === motif.id).length;
  if (count < 3) {
    failures.push(`narrative motif ${motif.id} has only ${count} variant(s)`);
  }
}

const voidFx = ['black-violet motes', 'void glow', 'purple void energy', 'drifting void ash', 'black-violet sparks', 'gravity distortions', 'fragmented stars'];
const feyFx = ['petals and whimsical particles', 'green witchfire', 'soft fey glow', 'drifting petals', 'glowing pollen', 'moonlit butterflies', 'floating blossoms'];

function detailOverlap(a, b) {
  const set = new Set(a ?? []);
  return (b ?? []).filter((item) => set.has(item)).length;
}
function visualCore(seed) {
  return [seed.buildTemplate.id, seed.visualTheme.id, seed.pose.name, seed.weapon.name, seed.light.name, seed.fx.name].join('|');
}
function appearanceSimilarity(seed, previous) {
  if (!seed.appearanceProfile || !previous.appearanceProfile || seed.race.name !== previous.race.name) return 0;
  let score = 0;
  if (seed.appearanceProfile.id === previous.appearanceProfile.id) score += 12;
  if (seed.appearanceProfile.ageCategory === previous.appearanceProfile.ageCategory) score += 6;
  if (seed.appearanceProfile.faceType === previous.appearanceProfile.faceType) score += 8;
  if (seed.appearanceProfile.bodyType === previous.appearanceProfile.bodyType) score += 6;
  if (seed.appearanceProfile.hairStyle && seed.appearanceProfile.hairStyle === previous.appearanceProfile.hairStyle) score += 5;
  if (seed.appearanceProfile.facialHair && seed.appearanceProfile.facialHair === previous.appearanceProfile.facialHair) score += 8;
  score += detailOverlap(seed.appearanceProfile.raceSpecificFeatures, previous.appearanceProfile.raceSpecificFeatures) * 4;
  score += detailOverlap(seed.appearanceProfile.distinctiveMarks, previous.appearanceProfile.distinctiveMarks) * 3;
  return score;
}

function forbiddenMulticlassKey(seed) { return [...seed.classes].sort().join('/'); }
const forbiddenMulticlasses = new Set(['barbarian/bard', 'barbarian/wizard', 'artificer/barbarian', 'druid/paladin', 'artificer/monk', 'cleric/rogue']);

function appearanceForbiddenViolation(seed) {
  const profile = seed.appearanceProfile;
  if (!profile || !profile.compatibleRaces.includes(seed.race.name)) return true;
  const rule = raceRulesById.get(seed.race.name);
  const text = [profile.promptFragment, profile.faceType, profile.bodyType, profile.hairStyle, profile.facialHair, ...(profile.raceSpecificFeatures ?? [])].join(' ').toLowerCase();
  if (rule && rule.forbiddenFeatures.some((feature) => text.includes(feature.toLowerCase()))) return true;
  if (seed.race.name === 'elf' && /(thick beard|dwarf-like|square beard|elderly wizard beard)/.test(text)) return true;
  if (seed.race.name === 'dragonborn' && /(human beard|human nose|smooth human skin)/.test(text)) return true;
  return false;
}

function similarityScore(seed, previous) {
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
  if (seed.race.name === previous.race.name) score += 5 + appearanceSimilarity(seed, previous);
  if (seed.culturalOrigin.id === previous.culturalOrigin.id) score += 5;
  if (seed.narrativeMotif.id === previous.narrativeMotif.id) score += 6;
  if (seed.narrativeVariant.id === previous.narrativeVariant.id) score += 4;
  if (seed.emotion === previous.emotion) score += 3;
  score += detailOverlap(seed.storyDetails, previous.storyDetails) * 2;
  score += detailOverlap(seed.cultureDetails, previous.cultureDetails) * 2;
  return score;
}
resetSmartCandidatePoolMemory();
let previousSequentialSeed = null;

for (let index = 0; index < sampleSize; index += 1) {
  const result = generateCharacterSeed();
  const { seed } = result;
  const armorTags = seed.armor.tags;
  const weaponTags = seed.weapon.tags;
  const poseTags = seed.pose.tags;
  const summary = `${seed.race.name} ${seed.size} ${seed.classes.join('/')} ${seed.archetype.name} | ${seed.buildTemplate.id}/${seed.visualTheme.id}/${seed.visualThemeVariant?.id ?? 'no-theme-variant'}/${seed.narrativeMotif?.id ?? 'no-motif'}/${seed.narrativeVariant?.id ?? 'no-narrative-variant'} | ${seed.silhouette.name} | ${seed.armor.name} | ${seed.weapon.name} | ${seed.pose.name} | ${seed.fx.name}`;

  increment(modeCounts, seed.mode);
  increment(compositionModeCounts, seed.compositionMode ?? 'no-composition');
  increment(environmentLevelCounts, seed.environmentDetailLevel ?? 'no-environment-level');
  increment(appearanceDistribution, `${seed.race.name}:${seed.appearanceProfile?.id ?? 'no-appearance'}`);
  increment(appearanceCountsByRace, seed.race.name);
  scenePropTotal += seed.sceneProps?.length ?? 0;
  characterBoundTotal += seed.characterBoundDetails?.length ?? 0;
  increment(scenePropCounts, String(seed.sceneProps?.length ?? 0));
  increment(characterBoundCounts, String(seed.characterBoundDetails?.length ?? 0));
  for (const prop of seed.sceneProps ?? []) increment(repeatedScenePropCounts, prop);
  const sceneLimit = seed.compositionMode === 'cinematic_splash_art' ? 3 : seed.environmentDetailLevel === 'minimal' || seed.compositionMode === 'character_card' ? 0 : 1;
  if ((seed.sceneProps?.length ?? 0) > sceneLimit) excessiveClutterCount += 1;
  if (appearanceForbiddenViolation(seed)) {
    raceForbiddenFeatureViolations += 1;
    failures.push(`race appearance forbidden feature violation :: ${summary}`);
  }
  if (!result.promptDraft.includes('no readable text') || result.promptDraft.includes('no text in image')) {
    failures.push(`prompt must use no readable text guidance :: ${summary}`);
  }
  const fullGenerationText = result.fullGenerationText ?? '';
  if (!fullGenerationText) fullGenerationMissingCount += 1;
  if (!fullGenerationText.includes('=== D&D CHARACTER SEED ===')) fullGenerationMissingSeedHeaderCount += 1;
  if (!fullGenerationText.includes('=== IMAGE PROMPT ===')) fullGenerationMissingImageHeaderCount += 1;
  if (!fullGenerationText.includes(result.imagePrompt ?? '')) fullGenerationImageMismatchCount += 1;
  if (/Debug \/ Generation Trace|Generation Trace|Final validation status/i.test(fullGenerationText)) fullGenerationContainsTraceCount += 1;
  if (oldPromptTemplate(fullGenerationText)) fullGenerationOldPromptCount += 1;
  const artistBriefSentence = (result.promptDraft ?? '').match(/Artist brief: .*?(?= Create a D&D character concept art portrait| Appearance:)/)?.[0] ?? '';
  if (!artistBriefSentence.includes('Artist brief:')) artistBriefMissingDominantRead += 1;
  if (!new RegExp(`\\b${seed.primaryClass}\\b`, 'i').test(artistBriefSentence) || !new RegExp(`\\b${seed.race.name}\\b`, 'i').test(artistBriefSentence)) artistBriefMissingClass += 1;
  if (!/Pose:/i.test(artistBriefSentence)) artistBriefMissingPose += 1;
  if (wordCount(artistBriefSentence) > 55) artistBriefTooLong += 1;
  if (!/Avoid:/i.test(artistBriefSentence)) artistBriefSuppressionMissing += 1;
  const imagePrompt = result.imagePrompt ?? '';
  const imageWords = wordCount(imagePrompt);
  imagePromptWordTotal += imageWords;
  imagePromptWordMax = Math.max(imagePromptWordMax, imageWords);
  if (imageWords > 450) imagePromptOver450Count += 1;
  if (imagePrompt.includes('no readable text')) imagePromptNoReadableTextCount += 1;
  if (hasForbiddenNoTextPhrase(imagePrompt)) imagePromptNoTextPhraseCount += 1;
  if (oldPromptTemplate(imagePrompt)) oldPromptTemplateAsImagePromptCount += 1;
  if (!startsWithCompositionPhrase(imagePrompt)) imagePromptMissingCompositionPhraseCount += 1;
  if (seed.compositionMode === 'full_body_character_art') {
    imagePromptFullBodyModeTotal += 1;
    if (imagePrompt.includes('full-body character concept art') && imagePrompt.includes('entire body visible from head to toe')) imagePromptFullBodyModePhraseCount += 1;
  }
  if (imagePrompt.includes('Race appearance:')) imagePromptRaceAppearanceCount += 1;
  else imagePromptMissingRaceAppearanceCount += 1;
  if (imagePrompt.includes('Class and build fantasy:') && imagePrompt.includes('clearly readable as')) imagePromptClassReadabilityCount += 1;
  else imagePromptMissingClassReadabilityCount += 1;
  if (seed.race.name === 'aasimar') {
    aasimarPromptCount += 1;
    const raceSentence = imagePrompt.match(/Race appearance: .*?\./)?.[0] ?? '';
    if (aasimarCelestialPattern.test(raceSentence)) aasimarCelestialMarkerCount += 1;
    if (aasimarEyePattern.test(raceSentence)) aasimarEyeMarkerCount += 1;
    if (aasimarHaloMarkPattern.test(raceSentence)) aasimarHaloMarkCount += 1;
    if (genericAasimarRiskPattern.test(raceSentence) || !aasimarCelestialPattern.test(raceSentence)) aasimarGenericRiskCount += 1;
  }
  const positiveImagePrompt = imagePrompt.split('Negative prompt:')[0];
  const promptForAccessoryStats = imagePrompt.replace(antiClutterControlPattern, '');
  const positiveForAccessoryStats = positiveImagePrompt.replace(antiClutterControlPattern, '');
  const artDirection = resolveArtDirection(seed);
  artDirectionGeneratedCount += 1;
  increment(magicManifestationModeCounts, artDirection.magicManifestationMode);
  const dominantReadWords = wordCount(artDirection.dominantRead);
  if (!new RegExp(`\\b${seed.primaryClass}\\b`, 'i').test(artDirection.dominantRead)) dominantReadMissingClassCount += 1;
  if (!new RegExp(`\\b${seed.race.name}\\b`, 'i').test(artDirection.dominantRead)) dominantReadMissingRaceCount += 1;
  if (dominantReadWords > 22) dominantReadTooLongCount += 1;
  const primaryVisualReadRequired = [seed.race.name, seed.primaryClass, seed.armor.name, seed.weapon.name, seed.pose.name];
  const primaryVisualHits = primaryVisualReadRequired.filter((item) => artDirection.primaryVisualRead.join(' ').toLowerCase().includes(String(item).toLowerCase())).length;
  primaryVisualReadCoverageTotal += primaryVisualHits / primaryVisualReadRequired.length;
  if (artDirection.secondaryFlavor.length > 3) secondaryFlavorOverBudgetCount += 1;
  storyShorthandTotal += artDirection.storyShorthand.length;
  if (artDirection.storyShorthand.length > 2 || artDirection.storyShorthand.some((detail) => imagePromptObjectClutterPattern.test(detail) || accessoryClutterPhrasePattern.test(detail))) storyShorthandClutterRiskCount += 1;
  const suppressedLeakTerms = artDirection.suppressedElements.flatMap((item) => item.split(/\s+or\s+|,\s*/)).map((item) => item.trim()).filter((item) => item.length > 4 && !/^extra |^flavor |^irrelevant|^accessory clutter$|^object clutter$|^class-|^suppress|^avoid|^no |^tiny|^instrument dominance|^paladin halo|^healer|^scholar|^performer|^mystic|^bard|^ranger|^druid|^wizard|^holy|^generic/.test(item));
  if (suppressedLeakTerms.some((term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(positiveImagePrompt))) suppressedElementLeakCount += 1;
  if (/subtle magical runes|generic runes|floating symbols|glyph fragments/i.test(positiveImagePrompt)) genericRuneFxAfterArtDirectionCount += 1;
  if (artDirection.magicManifestationMode === 'none' && ['wizard', 'sorcerer', 'warlock', 'cleric', 'druid', 'bard', 'artificer'].includes(seed.primaryClass)) magicModeClassMismatchCount += 1;
  const artValidation = validateArtDirectionBrief(seed, artDirection);
  if (artValidation.classDrift) dominantReadClassDriftCount += 1;
  if (artValidation.themeOverridesClass) dominantReadThemeOverridesClassCount += 1;
  if (artValidation.wrongRoleNoun) dominantReadWrongRoleNounCount += 1;
  if (new RegExp(`\\b${seed.primaryClass}\\b`, 'i').test(artDirection.dominantRead)) dominantReadPrimaryClassCoverageCount += 1;
  artDirectionRepairCount += artDirection.repairStats?.artDirectionRepairCount ?? 0;
  dominantReadRepairCount += artDirection.repairStats?.dominantReadRepairCount ?? 0;
  poseDirectiveRepairCount += artDirection.repairStats?.poseDirectiveRepairCount ?? 0;
  secondaryFlavorDemotionCount += artDirection.repairStats?.secondaryFlavorDemotionCount ?? 0;
  conflictingFlavorSuppressedCount += artDirection.repairStats?.conflictingFlavorSuppressedCount ?? 0;
  increment(magicModeDistributionByClass, `${seed.primaryClass}:${artDirection.magicManifestationMode}`);
  if (['wizard', 'sorcerer', 'warlock'].includes(seed.primaryClass)) {
    increment(casterBodyMagicTotals, seed.primaryClass);
    if (artDirection.magicManifestationMode === 'body') increment(casterBodyMagicCounts, seed.primaryClass);
  }
  if (artDirection.magicManifestationMode === 'environment' && /generic mist|generic|swirling mist shown as restrained air/i.test(positiveImagePrompt)) environmentMagicGenericCount += 1;
  if (seed.primaryClass === 'bard' && /orb|generic wizard|focused scholar-adventurer/i.test(artDirection.dominantRead)) bardOrbCasterReadCount += 1;
  if (!['cleric', 'paladin'].includes(seed.primaryClass) && /holy symbol guardian|holy guardian/i.test(artDirection.dominantRead)) holySymbolNonDivineReadCount += 1;
  const plausibility = artDirection.raceClassPlausibility;
  if (['rare_reinterpreted', 'chaos_only', 'blocked_default'].includes(plausibility)) raceClassPlausibilityRiskCount += 1;
  if (plausibility === 'blocked_default' && seed.mode !== 'chaos') blockedDefaultRaceClassCount += 1;
  if (plausibility === 'chaos_only' && seed.mode !== 'chaos') chaosOnlyRaceClassInDefaultCount += 1;
  if (plausibility === 'rare_reinterpreted') rareRaceClassReinterpretedCount += 1;
  if (artDirection.raceClassReinterpretation) raceClassReinterpretationAppliedCount += 1;
  if (artDirection.themeClassRisk?.unresolvedOverride) themeOverridesPrimaryClassCount += 1;
  if (artDirection.themeClassRisk?.action === 'downgrade_to_flavor') themeDowngradedToFlavorCount += 1;
  if (artDirection.themeClassRisk?.action === 'reinterpret_through_class') themeReinterpretedThroughClassCount += 1;
  if (artDirection.themeClassRisk?.action === 'suppress_class_stealing_signals') themeRerolledForClassReadCount += 1;
  if (seed.primaryClass === 'fighter' && /halo|cathedral rays|divine rays|saintly/i.test(positiveImagePrompt)) fighterPaladinDriftRiskCount += 1;
  if (seed.primaryClass === 'rogue' && /lute|flute|songbook|song-scroll|performer-forward|bardic/i.test(positiveImagePrompt)) rogueBardDriftRiskCount += 1;
  if (seed.primaryClass === 'rogue' && /trail warden|map and compass|frontier archer|ranger primary/i.test(positiveImagePrompt)) rogueRangerDriftRiskCount += 1;
  if (seed.primaryClass === 'wizard' && /holy symbol|divine priest|cleric primary|paladin primary/i.test(positiveImagePrompt)) wizardClericDriftRiskCount += 1;
  if (seed.primaryClass === 'druid' && /lute|flute|songbook|performer-forward|bardic/i.test(positiveImagePrompt)) druidBardDriftRiskCount += 1;
  increment(divineLightModeDistribution, artDirection.divineLightMode ?? 'none');
  if (/sunrise halo|halo-like|cathedral rays/i.test(positiveImagePrompt)) divineHaloOveruseCount += 1;
  if (/generic holy backlight|divine rays|holy glow/i.test(positiveImagePrompt)) genericHolyBacklightCount += 1;
  if (/cathedral rays/i.test(positiveImagePrompt)) cathedralRaysOveruseCount += 1;
  if (seed.primaryClass === 'fighter' && /sunrise halo|cathedral rays|divine rays|holy glow/i.test(positiveImagePrompt)) fighterWithPaladinLightCount += 1;
  if (seed.primaryClass === 'cleric' && /sunrise halo|cathedral rays|paladin|saint poster/i.test(positiveImagePrompt)) clericPaladinLightCollapseCount += 1;
  const textureRisk = renderTextureHygieneRisk(imagePrompt, seed);
  if (textureRisk.grid) renderGridArtifactPromptRiskCount += 1;
  if (textureRisk.rhombus) rhombusTextureRiskCount += 1;
  if (textureRisk.scaleOnNonScaledRace) scaleTextureOnNonScaledRaceRiskCount += 1;
  if (textureRisk.overPatternedFabric) overPatternedFabricRiskCount += 1;
  imagePromptWordCountAfterArtDirectionCompressionTotal += imageWords;
  if (!/secondary flavor: .*?, .*?,/i.test(imagePrompt)) artDirectionCompressionRemovedFlavorCount += 1;
  const imageDetailText = extractImageDetailText(imagePrompt);
  const imageDetailItems = imageDetailText ? imageDetailText.split(/,\s*/).filter(Boolean) : [];
  imagePromptCompressedDetailTotal += imageDetailItems.length;
  imagePromptObjectClutterCount += countMatches(imageDetailText, new RegExp(imagePromptObjectClutterPattern.source, 'gi'));
  imagePromptPaperClutterCount += countMatches(imageDetailText, new RegExp(imagePromptPaperClutterPattern.source, 'gi'));
  imagePromptBookStackCount += countMatches(imageDetailText, new RegExp(imagePromptBookStackPattern.source, 'gi'));
  imagePromptBannerClutterCount += countMatches(imageDetailText, new RegExp(imagePromptBannerClutterPattern.source, 'gi'));
  imagePromptChainCharmClutterCount += countMatches(imageDetailText, new RegExp(imagePromptChainCharmClutterPattern.source, 'gi'));
  if (imageDetailItems.filter((item) => objectLikeDetailPattern.test(item)).length > 1) promptsWithMoreThanOneObjectDetail += 1;
  if (imagePromptBookStackPattern.test(positiveImagePrompt)) promptsWithStackedBooks += 1;
  if (/battle reports?/i.test(positiveImagePrompt)) promptsWithBattleReports += 1;
  if (/campaign maps?/i.test(positiveImagePrompt)) promptsWithCampaignMaps += 1;
  if (/giant flags?|background banners?|multiple pennants?|huge flag/i.test(positiveImagePrompt)) promptsWithHugeBannerRisk += 1;
  if (/excessive belts?|hanging tags?|dangling tags?|stacks of books attached to belt/i.test(imageDetailText)) promptsWithExcessiveBeltOrTagRisk += 1;
  accessoryClutterPhraseCount += countMatches(promptForAccessoryStats, new RegExp(accessoryClutterPhrasePattern.source, 'gi'));
  beltPhraseCount += countMatches(promptForAccessoryStats, new RegExp(beltPhrasePattern.source, 'gi'));
  chainPhraseCount += countMatches(promptForAccessoryStats, new RegExp(chainPhrasePattern.source, 'gi'));
  danglingPhraseCount += countMatches(promptForAccessoryStats, new RegExp(danglingPhrasePattern.source, 'gi'));
  medallionPhraseCount += countMatches(promptForAccessoryStats, new RegExp(medallionPhrasePattern.source, 'gi'));
  ribbonPhraseCount += countMatches(promptForAccessoryStats, new RegExp(ribbonPhrasePattern.source, 'gi'));
  if (largeBannerPhrasePattern.test(positiveForAccessoryStats)) bannerLargeFlagRisk += 1;
  giantBannerPhraseCount += countMatches(positiveForAccessoryStats, new RegExp(largeBannerPhrasePattern.source, 'gi'));
  if (/banner|pennant/i.test(seed.weapon.name) && largeBannerPhrasePattern.test(positiveForAccessoryStats.replace(/spear with a small torn pennant near the blade/gi, ''))) bannerWeaponLargeFlagRisk += 1;
  if (scholarLibraryRiskPattern.test(positiveForAccessoryStats)) scholarLibraryRisk += 1;
  const silhouetteSentence = positiveImagePrompt.match(/Silhouette: .*?\./)?.[0] ?? '';
  if (silhouetteBannerTriggerPattern.test(silhouetteSentence)) silhouetteBannerTriggerCount += 1;
  if (silhouetteBookTriggerPattern.test(silhouetteSentence)) silhouetteBookTriggerCount += 1;
  if (silhouetteScrollTriggerPattern.test(silhouetteSentence)) silhouetteScrollTriggerCount += 1;
  if (silhouetteClutterTriggerPattern.test(silhouetteSentence)) silhouetteClutterTriggerCount += 1;
  const positiveWithoutAllowedBannerSpear = positiveForAccessoryStats.replace(normalizedBannerSpearPhrase, '');
  if (seed.compositionMode === 'full_body_character_art') positiveBannerWordCountFullBody += countMatches(positiveWithoutAllowedBannerSpear, positiveBannerWordPattern);
  const staffOrFocusWeapon = seed.weapon.tags.includes('staff') || seed.weapon.tags.includes('orb') || seed.weapon.tags.includes('wand') || seed.weapon.tags.includes('magic-focus') || seed.weapon.tags.includes('holy-focus');
  const bookWeapon = /book|grimoire|journal/i.test(seed.weapon.name) || seed.weapon.tags.includes('book');
  const scholarContext = seed.primaryClass === 'wizard' || seed.buildTemplate.id === 'arcane_caster' || ['divine_archivist', 'academy_mage', 'archive_performer'].includes(seed.visualTheme.id);
  if (scholarContext && secondaryBookTriggerPattern.test(silhouetteSentence)) wizardSecondaryBookTrigger += 1;
  if (staffOrFocusWeapon && !bookWeapon && secondaryBookTriggerPattern.test(silhouetteSentence)) staffPlusBookSilhouetteRisk += 1;
  if (seed.race.name === 'fairy' && seed.buildTemplate.id === 'savage_berserker') fairySavageBerserkerRisk += 1;
  if (seed.race.name === 'fairy' && seed.visualTheme.id === 'raider_king') fairyRaiderKingRisk += 1;
  if (seed.race.name === 'fairy' && (seed.visualTheme.id === 'arena_champion' || seed.silhouetteProfile.id === 'arena_colossus')) fairyArenaColossusRisk += 1;
  if (seed.size === 'tiny' && (seed.buildTemplate.id === 'savage_berserker' || fairyBulkyThemeIds.has(seed.visualTheme.id) || bulkySilhouetteIds.has(seed.silhouetteProfile.id) || oversizedWeaponPattern.test(seed.weapon.name))) tinyBulkyMartialRisk += 1;
  if (['tiny', 'small'].includes(seed.size) && bulkySilhouetteIds.has(seed.silhouetteProfile.id)) smallRaceOverscaleSilhouetteRisk += 1;
  if (['tiny', 'small'].includes(seed.size) && oversizedWeaponPattern.test(seed.weapon.name)) smallRaceOversizedWeaponRisk += 1;
  if (/no giant flags|no oversized banners|no wearable library|no symbol-covered fabric|no chain clutter/i.test(imagePrompt) && /Silhouette:[^.]+(?:banner|flag|hovering grimoire|floating grimoire|wearable library|symbol-covered|chain shapes)/i.test(imagePrompt)) positiveNegativeContradictionCount += 1;
  poseUsageCounts.set(seed.pose.name, (poseUsageCounts.get(seed.pose.name) ?? 0) + 1);
  const family = poseFamily(seed);
  poseFamilyCounts.set(family, (poseFamilyCounts.get(family) ?? 0) + 1);
  if (recentPoseFamilyWindow.includes(family)) repeatedPoseFamilyWithinEightCount += 1;
  if (recentClassPoseFamilyWindow.some((entry) => entry.primaryClass === seed.primaryClass && entry.family === family)) classPoseRepetitionCount += 1;
  const weaponFamily = (seed.weapon.tags ?? [])[0] ?? seed.weapon.name;
  if (recentWeaponPoseFamilyWindow.some((entry) => entry.weaponFamily === weaponFamily && entry.family === family)) weaponPoseRepetitionCount += 1;
  recentPoseFamilyWindow.push(family);
  if (recentPoseFamilyWindow.length > 8) recentPoseFamilyWindow.shift();
  recentClassPoseFamilyWindow.push({ primaryClass: seed.primaryClass, family });
  if (recentClassPoseFamilyWindow.length > 12) recentClassPoseFamilyWindow.shift();
  recentWeaponPoseFamilyWindow.push({ weaponFamily, family });
  if (recentWeaponPoseFamilyWindow.length > 12) recentWeaponPoseFamilyWindow.shift();
  if (poseIsHighImpact(seed)) highImpactPoseCount += 1;
  if (casterSigilPosePattern.test(seed.pose.name) && (['wizard', 'sorcerer', 'warlock'].includes(seed.primaryClass) || seed.buildTemplate.id === 'arcane_caster')) casterSigilPoseCount += 1;
  const primaryRead = promptHasPrimaryRead(imagePrompt, seed);
  if (!primaryRead.race) primaryReadMissingRace += 1;
  if (!primaryRead.classRead) primaryReadMissingClass += 1;
  if (!primaryRead.silhouette) primaryReadMissingSilhouette += 1;
  if (!primaryRead.weapon) primaryReadMissingWeapon += 1;
  if (!primaryRead.pose) primaryReadMissingPose += 1;
  if (!primaryRead.poseFamily) primaryReadMissingPoseFamily += 1;
  if (!primaryRead.race || !primaryRead.classRead || !primaryRead.silhouette || !primaryRead.weapon || !primaryRead.pose) primaryReadLostAfterCompressionCount += 1;
  if (!primaryRead.race || !primaryRead.classRead || !primaryRead.silhouette || !primaryRead.weapon || !primaryRead.pose) artDirectionPrimaryReadRegressionCount += 1;
  const firstFlavorIndex = imagePrompt.indexOf('Visual theme:');
  const weaponIndex = imagePrompt.indexOf('Weapon and tool:');
  if (firstFlavorIndex !== -1 && weaponIndex !== -1 && firstFlavorIndex < weaponIndex) flavorStackDominatesPromptCount += 1;
  if (weaponAccessoryOverloadPattern.test(positiveForAccessoryStats)) weaponAccessoryOverloadRisk += 1;
  if (armorAccessoryOverloadPattern.test(positiveForAccessoryStats)) armorAccessoryOverloadRisk += 1;
  if (seed.compositionMode === 'full_body_character_art' && /subtle background hint/i.test(imagePrompt)) imagePromptBackgroundHintFullBodyCount += 1;
  noisyDetailTotal += countMatches(imageDetailText, new RegExp(noisyDetailPattern.source, 'gi'));
  if (countMatchingDetailItems(imageDetailText, new RegExp(paperRecordPattern.source, 'i')) > 1) paperOverusePromptCount += 1;
  if (spyglassPattern.test(imageDetailText) && !spyglassAllowedThemes.has(seed.visualTheme.id) && !hasAny(seed.archetype.tags, ['scout', 'frontier', 'hunter'])) spyglassOutsideAllowedCount += 1;
  if (ledgerPattern.test(imageDetailText) && !bureaucracyAllowedThemes.has(seed.visualTheme.id) && !hasAny(seed.archetype.tags, ['academy', 'hunter', 'tools'])) ledgerOutsideAllowedCount += 1;
  if (countMatchingDetailItems(imageDetailText, new RegExp(tagCharmPattern.source, 'i')) > 1 && !['cleric', 'monk'].includes(seed.primaryClass) && seed.visualTheme.id !== 'dream_walker') tagCharmClusterOveruseCount += 1;
  if (imagePrompt.includes('Quality rules:')) imagePromptQualityRulesCount += 1;
  if (imagePrompt.includes('Negative prompt:')) imagePromptNegativePromptCount += 1;
  imagePromptScenePropTotal += seed.sceneProps?.length ?? 0;
  imagePromptCharacterBoundTotal += seed.characterBoundDetails?.length ?? 0;
  if ((seed.characterBoundDetails?.length ?? 0) < (seed.sceneProps?.length ?? 0) && seed.compositionMode !== 'cinematic_splash_art') {
    failures.push(`character-bound details should dominate scene props :: ${summary}`);
  }
  if (seed.primaryClass === 'bard') {
    const bardReadText = [seed.weapon.name, seed.weaponLanguage?.label ?? '', seed.armor.name, seed.armorLanguage?.label ?? '', seed.pose.name, seed.visualTheme?.label ?? '', imagePrompt].join(' ');
    if (!bardPerformerAnchorPattern.test(bardReadText)) bardWithoutPerformerAnchorCount += 1;
    if (bardWizardRiskPattern.test(`${seed.weapon.name} ${seed.pose.name}`)) bardAsWizardRiskCount += 1;
  }
  if (seed.race.name === 'fairy' && /full plate/i.test(seed.armor.name)) fairyFullPlateCount += 1;
  if (seed.race.name === 'fairy' && (seed.weapon.tags.includes('shield') || /shield-forward/i.test(seed.silhouette.name))) fairyHeavyShieldCount += 1;
  if (seed.race.name === 'fairy' && ['holy_warrior', 'martial_veteran'].includes(seed.buildTemplate.id) && (seed.armor.tags.includes('heavy') || seed.weapon.tags.includes('shield') || /shield-forward/i.test(seed.silhouette.name))) tinyHeavyHolyWarriorRiskCount += 1;
  if (['wizard', 'sorcerer', 'warlock'].includes(seed.primaryClass) || seed.buildTemplate.id === 'arcane_caster') {
    casterPoseTotal += 1;
    if (activeCasterPosePattern.test(seed.pose.name)) casterActiveCastingPoseCount += 1;
  }
  if (recentExactPoseWindow.includes(seed.pose.name)) repeatedExactPoseWithinEightCount += 1;
  recentExactPoseWindow.push(seed.pose.name);
  if (recentExactPoseWindow.length > 8) recentExactPoseWindow.shift();

  if (seed.classes.length > 2) tripleMulticlassCount += 1;
  if (seed.mode === 'curated multiclass') {
    if (!seed.curatedMulticlassProfile || !curatedProfileIds.has(seed.curatedMulticlassProfile.id)) randomMulticlassCount += 1;
    else increment(curatedProfileCounts, seed.curatedMulticlassProfile.id);
    multiclassAnchorTotal += seed.classAnchorScore;
    multiclassAnchorCount += 1;
  } else if (seed.classes.length > 1 || seed.curatedMulticlassProfile) {
    randomMulticlassCount += 1;
  }
  if (forbiddenMulticlasses.has(forbiddenMulticlassKey(seed))) forbiddenMulticlassCount += 1;

  increment(motifCounts, seed.narrativeMotif?.id ?? 'no-motif');
  increment(narrativeVariantCounts, seed.narrativeVariant?.id ?? 'no-narrative-variant');
  increment(themeCounts, seed.visualTheme?.id ?? 'no-theme');
  increment(themeVariantCounts, seed.visualThemeVariant?.id ?? 'no-theme-variant');
  for (const detail of seed.storyDetails ?? []) {
    increment(storyDetailCounts, detail);
  }
  increment(combinationCounts, `${seed.primaryClass}+${seed.visualTheme?.id ?? 'no-theme'}+${seed.narrativeMotif?.id ?? 'no-motif'}`);
  increment(cultureCounts, seed.culturalOrigin?.id ?? 'no-culture');
  increment(silhouetteCounts, seed.silhouetteProfile?.id ?? 'no-silhouette');
  increment(visualMotifCounts, seed.visualMotif?.id ?? 'no-visual-motif');
  increment(companionCounts, seed.companion?.id ?? 'none');
  increment(armorLanguageCounts, seed.armorLanguage?.id ?? 'no-armor-language');
  increment(weaponLanguageCounts, seed.weaponLanguage?.id ?? 'no-weapon-language');
  if (seed.visualTheme.id === 'dream_walker') {
    dreamWalkerCount += 1;
    dreamWalkerScenePropTotal += seed.sceneProps?.length ?? 0;
    increment(dreamWalkerVariantCounts, seed.visualThemeVariant?.id ?? 'no-variant');
    increment(dreamWalkerSilhouetteCounts, seed.silhouetteProfile?.id ?? seed.silhouette.name);
    increment(dreamWalkerArmorCounts, seed.armor.name);
    increment(dreamWalkerWeaponCounts, seed.weapon.name);
    increment(dreamWalkerWeaponLanguageCounts, seed.weaponLanguage?.id ?? 'no-weapon-language');
    increment(dreamWalkerFinishCounts, seed.equipmentFinish?.id ?? 'no-finish');
    increment(dreamWalkerEnchantmentCounts, seed.equipmentEnchantment?.id ?? 'no-enchantment');
    increment(dreamWalkerPoseCounts, seed.pose.name);
    increment(dreamWalkerMoodCounts, seed.mood.name);
    increment(dreamWalkerLightCounts, seed.light.name);
    increment(dreamWalkerFxCounts, seed.fx.name);
    for (const detail of seed.characterBoundDetails ?? seed.visualDetails ?? []) {
      increment(dreamWalkerDetailCounts, detail);
      if (dreamWalkerIconicPattern.test(detail)) dreamWalkerIconicCount += 1;
    }
    if (!result.promptDraft.includes('no readable text') || /(?:^|[^un])\b(?:readable|legible) (?:dream journal|journal|notes|map|scroll)/i.test(result.promptDraft)) {
      failures.push(`dream_walker prompt must keep journals/notes unreadable :: ${summary}`);
    }
  }
  if (seed.weaponLanguage?.id === 'plain_weapon_language') {
    increment(plainWeaponFallbackSources, seed.weapon.name);
    for (const tag of seed.weapon.tags) increment(plainWeaponFallbackTags, tag);
    increment(plainWeaponFallbackBuildTemplates, seed.buildTemplate.id);
    increment(plainWeaponFallbackThemes, seed.visualTheme.id);
    increment(plainWeaponFallbackClasses, seed.primaryClass);
  }
  increment(sequentialThemeCounts, seed.visualTheme.id);
  increment(sequentialPoseCounts, seed.pose.name);
  increment(sequentialFxCounts, seed.fx.name);
  if (highImpactPoseNames.has(seed.pose.name) && recentPoseWindow.includes(seed.pose.name)) repeatedHighImpactPoseWithinFiveCount += 1;
  if (recentPoseClassWindow.some((entry) => entry.pose === seed.pose.name && entry.primaryClass === seed.primaryClass)) repeatedPoseSameClassWithinTenCount += 1;
  recentPoseWindow.push(seed.pose.name);
  if (recentPoseWindow.length > 5) recentPoseWindow.shift();
  recentPoseClassWindow.push({ pose: seed.pose.name, primaryClass: seed.primaryClass });
  if (recentPoseClassWindow.length > 10) recentPoseClassWindow.shift();
  if (emotionPoseMismatch(seed)) emotionPoseMismatchCount += 1;
  if (runeMotifGrounded(seed)) runeMotifGroundedNonArcaneCount += 1;
  for (const detail of seed.visualDetails ?? []) increment(sequentialDetailCounts, detail);
  if (previousSequentialSeed) {
    const score = similarityScore(seed, previousSequentialSeed);
    sequentialSimilarityTotal += score;
    sequentialSimilarityMax = Math.max(sequentialSimilarityMax, score);
    sequentialComparisonCount += 1;
    if (score >= 65) tooSimilarSequentialCount += 1;
    if (visualCore(seed) === visualCore(previousSequentialSeed)) consecutiveVisualCoreDuplicateCount += 1;
    if (seed.race.name === previousSequentialSeed.race.name) {
      const appScore = appearanceSimilarity(seed, previousSequentialSeed);
      sameRaceAppearanceSimilarityTotal += appScore;
      sameRaceAppearanceComparisonCount += 1;
      if (seed.appearanceProfile?.id === previousSequentialSeed.appearanceProfile?.id) consecutiveSameRaceSameAppearanceCount += 1;
      if (seed.race.name === 'dwarf' && seed.appearanceProfile?.facialHair === previousSequentialSeed.appearanceProfile?.facialHair) dwarfSameBeardRepeatCount += 1;
    }
  }
  previousSequentialSeed = seed;
  increment(equipmentFinishCounts, seed.equipmentFinish?.id ?? 'no-equipment-finish');
  increment(equipmentEnchantmentCounts, seed.equipmentEnchantment?.id ?? 'no-equipment-enchantment');
  increment(enchantmentIntensityCounts, seed.enchantmentIntensity ?? 'no-intensity');
  if (hasContradictoryEquipmentFx(seed)) {
    equipmentContradictionCount += 1;
    failures.push(`equipment enchantment contradicts FX :: ${summary}`);
  }
  increment(companionClassTotals, seed.primaryClass);
  increment(companionBuildTemplateTotals, seed.buildTemplate.id);
  if (isFrontierCompanionGroup(seed)) frontierCompanionGroupCount += 1;
  if (seed.companion) {
    companionActiveCount += 1;
    increment(companionByClass, seed.primaryClass);
    increment(companionByBuildTemplate, seed.buildTemplate.id);
    if (seed.companion.tier === 'legendary') legendaryCompanionCount += 1;
    if (isFrontierCompanionGroup(seed)) frontierCompanionActiveCount += 1;
  }
  for (const detail of seed.visualDetails ?? []) increment(visualDetailCounts, detail);
  increment(classScoreCounts, `${seed.primaryClass}:${seed.classAnchorScore}`);
  classScoreTotals.set(seed.primaryClass, (classScoreTotals.get(seed.primaryClass) ?? 0) + seed.classAnchorScore);
  if (['divine_archivist', 'academy_mage', 'archive_performer'].includes(seed.visualTheme?.id)) {
    increment(scholarThemeCounts, seed.visualTheme.id);
  }

  const validationIssues = validateGeneratedSeed(seed);
  if (validationIssues.length > 0) conflictCount += 1;
  for (const issue of validationIssues) {
    classifyValidationIssue(issue);
    failures.push(`Generated validation issue: ${issue.message} :: ${summary}`);
  }

  const fxLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('FX: ')).length;
  if (fxLineCount !== 1) {
    failures.push(`seed should have exactly one FX line, found ${fxLineCount} :: ${summary}`);
  }

  const themeLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('Visual Theme: ')).length;
  if (themeLineCount !== 1 || !seed.visualTheme || !seed.visualTheme.id) {
    failures.push(`seed should have exactly one visual theme, found ${themeLineCount} :: ${summary}`);
  }

  const motifLineCount = result.seedOutput.split('\n').filter((line) => line.startsWith('Narrative Motif: ')).length;
  if (motifLineCount !== 1 || !seed.narrativeMotif || !seed.narrativeMotif.id) {
    failures.push(`seed should have exactly one narrative motif, found ${motifLineCount} :: ${summary}`);
  }

  if (!seed.silhouetteProfile || !seed.visualMotif || !seed.armorLanguage || !seed.weaponLanguage) {
    failures.push(`visual library layers must include silhouette/motif/armor language/weapon language :: ${summary}`);
  }

  if ((seed.visualDetails ?? []).length > 8 || new Set(seed.visualDetails ?? []).size !== (seed.visualDetails ?? []).length) {
    failures.push(`visual details must be unique and capped at 8 :: ${summary}`);
  }

  const storyDetailsLine = result.seedOutput.split('\n').find((line) => line.startsWith('Story Details: '));
  if (!storyDetailsLine || storyDetailsLine === 'Story Details: ' || storyDetailsLine.trim().endsWith(',')) {
    failures.push(`story details line must be non-empty and not end with comma :: ${summary}`);
  }

  if (!seed.storyDetails || seed.storyDetails.length < 2 || seed.storyDetails.some((detail) => detail.trim().length === 0 || detail.trim().endsWith(','))) {
    failures.push(`story details must contain at least two complete entries :: ${summary}`);
  }

  const expectedSizeByRace = {
    fairy: 'tiny',
    halfling: 'small',
    gnome: 'small',
  };
  const expectedSize = expectedSizeByRace[seed.race.name] ?? 'medium';
  if (seed.size !== expectedSize) {
    failures.push(`incorrect size category ${seed.size}, expected ${expectedSize} :: ${summary}`);
  }

  if (['small', 'tiny'].includes(seed.size) && hasAny(weaponTags, ['oversized', 'greataxe'])) {
    failures.push(`small/tiny race has giant weapon :: ${summary}`);
  }

  if (seed.race.name === 'fairy' && seed.armor.name === 'full plate with engraved pauldrons') {
    failures.push(`fairy received full plate :: ${summary}`);
  }

  if (seed.visualTheme.id === 'void_oracle' && !voidFx.includes(seed.fx.name)) {
    failures.push(`void_oracle without void FX :: ${summary}`);
  }

  if (seed.archetype.tags.includes('pirate') && !(seed.visualDetails.some((detail) => ['rope belt', 'sea charts', 'barnacle relics', 'stolen relic case', 'song-scroll case', 'travel lute charms'].some((needle) => detail.includes(needle))))) {
    failures.push(`pirate archetype without pirate-compatible gear :: ${summary}`);
  }

  if (
    seed.primaryClass === 'monk' &&
    seed.archetype.name === 'exiled temple guardian' &&
    seed.fx.name === 'black-violet motes' &&
    !(seed.classes.includes('warlock') || seed.archetype.tags.includes('cursed') || seed.archetype.tags.includes('void'))
  ) {
    failures.push(`monk temple guardian received black-violet motes without cursed/warlock/void :: ${summary}`);
  }

  if (
    seed.primaryClass === 'bard' &&
    seed.buildTemplate.id === 'divine_scholar' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`bard divine_scholar without divine/holy/temple context :: ${summary}`);
  }

  if (
    seed.primaryClass === 'bard' &&
    (seed.archetype.tags.includes('academy') || seed.archetype.tags.includes('scholar') || seed.archetype.tags.includes('cartographer')) &&
    seed.buildTemplate.id === 'divine_scholar' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`bard academy/scholar received divine_scholar without divine/holy/temple context :: ${summary}`);
  }

  if (
    seed.primaryClass === 'fighter' &&
    seed.buildTemplate.id === 'holy_warrior' &&
    !(seed.archetype.tags.includes('holy') || seed.archetype.tags.includes('oathkeeper'))
  ) {
    failures.push(`fighter without holy archetype received holy_warrior :: ${summary}`);
  }

  if (seed.weapon.name === 'paired daggers' && ['forward rapier thrust', 'duelist turn with one foot sliding back'].includes(seed.pose.name)) {
    failures.push(`paired daggers received rapier thrust pose :: ${summary}`);
  }

  if (['tiny', 'small'].includes(seed.size) && seed.armor.name === 'full plate with engraved pauldrons') {
    failures.push(`small/tiny race received full plate :: ${summary}`);
  }

  if (
    seed.race.name === 'fairy' &&
    (seed.silhouette.name === 'stocky shield-forward stance' || seed.armor.name === 'full plate with engraved pauldrons' || seed.weapon.tags.includes('oversized'))
  ) {
    failures.push(`fairy received stocky/full plate/oversized loadout :: ${summary}`);
  }

  if (
    seed.silhouette.name === 'gadget-laden workshop silhouette' &&
    !(seed.primaryClass === 'artificer' || seed.buildTemplate.id === 'battle_engineer' || seed.archetype.tags.includes('academy') || seed.archetype.tags.includes('tools'))
  ) {
    failures.push(`gadget silhouette without artificer/battle_engineer/academy engineer :: ${summary}`);
  }

  if (
    seed.buildTemplate.id === 'fey_trickster' &&
    !feyFx.includes(seed.fx.name)
  ) {
    failures.push(`fey_trickster without fey-compatible FX :: ${summary}`);
  }

  if (seed.classes.includes('barbarian') && weaponTags.includes('rapier')) {
    failures.push(`barbarian with rapier :: ${summary}`);
  }

  if (
    seed.primaryClass === 'wizard' &&
    (hasAny(armorTags, ['light', 'medium', 'heavy', 'metal']) || hasAny(weaponTags, ['rapier', 'shield', 'longbow']))
  ) {
    failures.push(`wizard with armor/rapier/shield/longbow :: ${summary}`);
  }

  if (
    seed.primaryClass === 'monk' &&
    (hasAny(armorTags, ['light', 'medium', 'heavy', 'metal']) || hasAny(weaponTags, ['rapier', 'shield']))
  ) {
    failures.push(`monk with armor/rapier/shield :: ${summary}`);
  }

  if (
    seed.primaryClass === 'rogue' &&
    (armorTags.includes('heavy') || ['chain mail under a weathered tabard', 'half plate with campaign dents'].includes(seed.armor.name))
  ) {
    failures.push(`rogue with chain mail/half plate/heavy armor :: ${summary}`);
  }

  if (
    (['gnome', 'fairy', 'halfling'].includes(seed.race.name) || seed.race.tags.includes('fey')) &&
    ['towering bestial frame', 'tall robed column'].includes(seed.silhouette.name)
  ) {
    failures.push(`small/fey race with towering/tall silhouette :: ${summary}`);
  }

  if (
    poseTags.includes('map') &&
    !(hasAny(weaponTags, ['map', 'book', 'scroll', 'compass']) || seed.archetype.tags.includes('cartographer') || seed.archetype.tags.includes('scholar'))
  ) {
    failures.push(`studying map pose without map/book/scroll/compass/cartographer/scholar :: ${summary}`);
  }

  if (poseTags.includes('shield') && !(weaponTags.includes('shield') || armorTags.includes('shield'))) {
    failures.push(`shield pose without shield :: ${summary}`);
  }

  if (poseTags.includes('bow') && !weaponTags.includes('bow')) {
    failures.push(`bow pose without bow :: ${summary}`);
  }
}

const companionActivationRate = companionActiveCount / sampleSize;
const legendaryCompanionRate = legendaryCompanionCount / sampleSize;
const frontierCompanionRate = frontierCompanionGroupCount === 0 ? 0 : frontierCompanionActiveCount / frontierCompanionGroupCount;
if (companionActivationRate > 0.15) {
  failures.push(`companion activation exceeded hard cap: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
} else if (companionActivationRate > 0.12) {
  warnings.push(`companion activation above target warning band: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
} else if (companionActivationRate < 0.08) {
  warnings.push(`companion activation below target band: ${companionActiveCount}/${sampleSize} (${(companionActivationRate * 100).toFixed(1)}%)`);
}
if (legendaryCompanionRate > 0.015) {
  failures.push(`legendary companion activation exceeded 1.5% cap: ${legendaryCompanionCount}/${sampleSize} (${(legendaryCompanionRate * 100).toFixed(1)}%)`);
}
if (frontierCompanionRate > 0.18) {
  failures.push(`ranger/druid/frontier companion activation exceeded 18% cap: ${frontierCompanionActiveCount}/${frontierCompanionGroupCount} (${(frontierCompanionRate * 100).toFixed(1)}%)`);
}
const noneIntensityRate = (enchantmentIntensityCounts.get('none') ?? 0) / sampleSize;
const subtleIntensityRate = (enchantmentIntensityCounts.get('subtle') ?? 0) / sampleSize;
const strongIntensityRate = (enchantmentIntensityCounts.get('strong') ?? 0) / sampleSize;
const legendaryIntensityRate = (enchantmentIntensityCounts.get('legendary') ?? 0) / sampleSize;
if (noneIntensityRate < 0.45 || noneIntensityRate > 0.655) failures.push(`equipment none intensity outside target: ${(noneIntensityRate * 100).toFixed(1)}%`);
if (subtleIntensityRate < 0.20 || subtleIntensityRate > 0.40) failures.push(`equipment subtle intensity outside target: ${(subtleIntensityRate * 100).toFixed(1)}%`);
if (strongIntensityRate < 0.05 || strongIntensityRate > 0.15) failures.push(`equipment strong intensity outside target: ${(strongIntensityRate * 100).toFixed(1)}%`);
if (legendaryIntensityRate > 0.035) failures.push(`equipment legendary intensity exceeded 3.5% cap: ${(legendaryIntensityRate * 100).toFixed(1)}%`);
const plainWeaponRate = (weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize;
const plainArmorRate = (armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize;
if (plainWeaponRate >= 0.20) failures.push(`plain weapon language fallback too high: ${(plainWeaponRate * 100).toFixed(1)}%`);
if (plainArmorRate >= 0.20) failures.push(`plain armor language fallback too high: ${(plainArmorRate * 100).toFixed(1)}%`);
if (equipmentContradictionCount > 0) failures.push(`equipment contradiction count should be zero: ${equipmentContradictionCount}`);
const dreamWalkerRate = dreamWalkerCount / sampleSize;
if (dreamWalkerRate > 0.10) failures.push(`dream_walker activation dominated distribution: ${(dreamWalkerRate * 100).toFixed(1)}%`);
if (dreamWalkerCount > 0 && dreamWalkerScenePropTotal / dreamWalkerCount > 1.2) failures.push(`dream_walker scene prop average too high: ${(dreamWalkerScenePropTotal / dreamWalkerCount).toFixed(2)}`);
if (dreamWalkerCount > 0 && dreamWalkerIconicCount / dreamWalkerCount > 0.20) failures.push(`dream_walker iconic/legendary detail rate too high: ${((dreamWalkerIconicCount / dreamWalkerCount) * 100).toFixed(1)}%`);
if (artDirectionGeneratedCount !== sampleSize) failures.push(`art direction generated count mismatch: ${artDirectionGeneratedCount}/${sampleSize}`);
if (dominantReadMissingClassCount !== 0 || dominantReadMissingRaceCount !== 0 || dominantReadTooLongCount !== 0) failures.push(`art direction dominant read issues: missing class ${dominantReadMissingClassCount}, missing race ${dominantReadMissingRaceCount}, too long ${dominantReadTooLongCount}`);
if (secondaryFlavorOverBudgetCount !== 0 || storyShorthandClutterRiskCount !== 0 || suppressedElementLeakCount !== 0 || magicModeClassMismatchCount !== 0 || artDirectionPrimaryReadRegressionCount !== 0) failures.push(`art direction QA issues: secondary over budget ${secondaryFlavorOverBudgetCount}, shorthand clutter ${storyShorthandClutterRiskCount}, suppressed leaks ${suppressedElementLeakCount}, magic mismatch ${magicModeClassMismatchCount}, primary regression ${artDirectionPrimaryReadRegressionCount}`);
if (dominantReadClassDriftCount !== 0 || dominantReadThemeOverridesClassCount !== 0 || dominantReadWrongRoleNounCount !== 0 || dominantReadPrimaryClassCoverageCount !== sampleSize) failures.push(`class-authoritative dominant read issues: drift ${dominantReadClassDriftCount}, theme overrides ${dominantReadThemeOverridesClassCount}, wrong role ${dominantReadWrongRoleNounCount}, class coverage ${dominantReadPrimaryClassCoverageCount}/${sampleSize}`);
if (bardOrbCasterReadCount !== 0 || holySymbolNonDivineReadCount !== 0 || primaryReadLostAfterCompressionCount !== 0) failures.push(`art direction coherence issues: bard orb ${bardOrbCasterReadCount}, holy non-divine ${holySymbolNonDivineReadCount}, primary lost ${primaryReadLostAfterCompressionCount}`);
if (artistBriefMissingDominantRead !== 0 || artistBriefMissingClass !== 0 || artistBriefMissingPose !== 0 || artistBriefSuppressionMissing !== 0) failures.push(`artist brief quality issues: missing dominant ${artistBriefMissingDominantRead}, class ${artistBriefMissingClass}, pose ${artistBriefMissingPose}, suppression ${artistBriefSuppressionMissing}`);
if (imagePromptWordMax > 400) failures.push(`image prompt max word count should stay under 400: ${imagePromptWordMax}`);
if (imagePromptBackgroundHintFullBodyCount > 0) failures.push(`full-body image prompts with background hints: ${imagePromptBackgroundHintFullBodyCount}`);
if (imagePromptCompressedDetailTotal / sampleSize > 2.2) failures.push(`average Image Prompt details above 2.2: ${(imagePromptCompressedDetailTotal / sampleSize).toFixed(2)}`);
if (promptsWithMoreThanOneObjectDetail > 0) failures.push(`prompts with more than one object-like detail: ${promptsWithMoreThanOneObjectDetail}`);
if (imagePromptBookStackCount > 0) failures.push(`image prompt book stack clutter count: ${imagePromptBookStackCount}`);
if (promptsWithStackedBooks > 0) failures.push(`prompts with stacked books: ${promptsWithStackedBooks}`);
if (promptsWithBattleReports > 0) failures.push(`prompts with battle reports: ${promptsWithBattleReports}`);
if (promptsWithCampaignMaps > 0) failures.push(`prompts with campaign maps: ${promptsWithCampaignMaps}`);
if (promptsWithHugeBannerRisk > 0) failures.push(`prompts with huge banner risk: ${promptsWithHugeBannerRisk}`);
if (promptsWithExcessiveBeltOrTagRisk > 0) failures.push(`prompts with excessive belt/tag risk: ${promptsWithExcessiveBeltOrTagRisk}`);
if (accessoryClutterPhraseCount > 0) failures.push(`accessory clutter phrase count: ${accessoryClutterPhraseCount}`);
if (danglingPhraseCount > 0) failures.push(`dangling accessory phrase count: ${danglingPhraseCount}`);
if (bannerLargeFlagRisk > 0) failures.push(`banner large flag risk: ${bannerLargeFlagRisk}`);
if (giantBannerPhraseCount > 0) failures.push(`giant banner phrase count: ${giantBannerPhraseCount}`);
if (bannerWeaponLargeFlagRisk > 0) failures.push(`banner weapon large flag risk: ${bannerWeaponLargeFlagRisk}`);
if (scholarLibraryRisk > 0) failures.push(`scholar wearable-library risk: ${scholarLibraryRisk}`);
if (weaponAccessoryOverloadRisk > 0) failures.push(`weapon accessory overload risk: ${weaponAccessoryOverloadRisk}`);
if (armorAccessoryOverloadRisk > 0) failures.push(`armor accessory overload risk: ${armorAccessoryOverloadRisk}`);
if (silhouetteBannerTriggerCount > 0) failures.push(`silhouette banner trigger count: ${silhouetteBannerTriggerCount}`);
if (silhouetteBookTriggerCount > 0) failures.push(`silhouette book trigger count: ${silhouetteBookTriggerCount}`);
if (silhouetteScrollTriggerCount > 0) failures.push(`silhouette scroll trigger count: ${silhouetteScrollTriggerCount}`);
if (silhouetteClutterTriggerCount > 0) failures.push(`silhouette clutter trigger count: ${silhouetteClutterTriggerCount}`);
if (positiveBannerWordCountFullBody > 0) failures.push(`positive banner word count in full-body prompts: ${positiveBannerWordCountFullBody}`);
if (wizardSecondaryBookTrigger > 0) failures.push(`wizard/scholar secondary book trigger count: ${wizardSecondaryBookTrigger}`);
if (staffPlusBookSilhouetteRisk > 0) failures.push(`staff plus book silhouette risk: ${staffPlusBookSilhouetteRisk}`);
if (fairySavageBerserkerRisk > 0) failures.push(`fairy savage berserker risk: ${fairySavageBerserkerRisk}`);
if (fairyRaiderKingRisk > 0) failures.push(`fairy raider king risk: ${fairyRaiderKingRisk}`);
if (fairyArenaColossusRisk > 0) failures.push(`fairy arena colossus risk: ${fairyArenaColossusRisk}`);
if (tinyBulkyMartialRisk > 0) failures.push(`tiny bulky martial risk: ${tinyBulkyMartialRisk}`);
if (smallRaceOverscaleSilhouetteRisk > 0) failures.push(`small race overscale silhouette risk: ${smallRaceOverscaleSilhouetteRisk}`);
if (smallRaceOversizedWeaponRisk > 0) failures.push(`small race oversized weapon risk: ${smallRaceOversizedWeaponRisk}`);
if (positiveNegativeContradictionCount > 0) failures.push(`positive/negative contradiction count: ${positiveNegativeContradictionCount}`);
if (primaryReadMissingRace > 0) failures.push(`primary read missing race: ${primaryReadMissingRace}`);
if (primaryReadMissingClass > 0) failures.push(`primary read missing class: ${primaryReadMissingClass}`);
if (primaryReadMissingSilhouette > 0) failures.push(`primary read missing silhouette: ${primaryReadMissingSilhouette}`);
if (primaryReadMissingWeapon > 0) failures.push(`primary read missing weapon: ${primaryReadMissingWeapon}`);
if (primaryReadMissingPose > 0) failures.push(`primary read missing pose: ${primaryReadMissingPose}`);
if (primaryReadMissingPoseFamily > 0) failures.push(`primary read missing pose family: ${primaryReadMissingPoseFamily}`);
if (flavorStackDominatesPromptCount > 0) failures.push(`flavor stack dominates prompt count: ${flavorStackDominatesPromptCount}`);
if (bardWithoutPerformerAnchorCount > 0) failures.push(`bard without performer anchor count: ${bardWithoutPerformerAnchorCount}`);
if (fairyFullPlateCount > 0) failures.push(`fairy full plate count: ${fairyFullPlateCount}`);
if (blockedDefaultRaceClassCount > 0) failures.push(`blocked default race/class count: ${blockedDefaultRaceClassCount}`);
if (chaosOnlyRaceClassInDefaultCount > 0) failures.push(`chaos-only race/class in default count: ${chaosOnlyRaceClassInDefaultCount}`);
if (themeOverridesPrimaryClassCount > 0) failures.push(`theme overrides primary class count: ${themeOverridesPrimaryClassCount}`);
if (fighterWithPaladinLightCount > 0) failures.push(`fighter with paladin light count: ${fighterWithPaladinLightCount}`);
if (renderGridArtifactPromptRiskCount > 0) failures.push(`render grid artifact prompt risk count: ${renderGridArtifactPromptRiskCount}`);
if (rhombusTextureRiskCount > 0) failures.push(`rhombus texture risk count: ${rhombusTextureRiskCount}`);
if (scaleTextureOnNonScaledRaceRiskCount > 0) failures.push(`scale texture on non-scaled race risk count: ${scaleTextureOnNonScaledRaceRiskCount}`);
if (overPatternedFabricRiskCount > 0) failures.push(`overpatterned fabric risk count: ${overPatternedFabricRiskCount}`);
if (imagePromptOver450Count > 0) failures.push(`image prompts over 450 words: ${imagePromptOver450Count}/${sampleSize}`);
if (imagePromptNoReadableTextCount !== sampleSize) failures.push(`image prompt no readable text phrase missing: ${sampleSize - imagePromptNoReadableTextCount}/${sampleSize}`);
if (imagePromptNoTextPhraseCount !== 0) failures.push(`image prompt forbidden no text phrase count: ${imagePromptNoTextPhraseCount}`);
if (fullGenerationMissingCount !== 0) failures.push(`fullGenerationText missing count: ${fullGenerationMissingCount}`);
if (fullGenerationMissingSeedHeaderCount !== 0) failures.push(`fullGenerationText missing seed header count: ${fullGenerationMissingSeedHeaderCount}`);
if (fullGenerationMissingImageHeaderCount !== 0) failures.push(`fullGenerationText missing image prompt header count: ${fullGenerationMissingImageHeaderCount}`);
if (fullGenerationImageMismatchCount !== 0) failures.push(`fullGenerationText image prompt mismatch count: ${fullGenerationImageMismatchCount}`);
if (fullGenerationContainsTraceCount !== 0) failures.push(`fullGenerationText should not contain debug trace: ${fullGenerationContainsTraceCount}`);
if (fullGenerationOldPromptCount !== 0) failures.push(`fullGenerationText old prompt template count: ${fullGenerationOldPromptCount}`);
if (oldPromptTemplateAsImagePromptCount !== 0) failures.push(`old prompt template as image prompt count: ${oldPromptTemplateAsImagePromptCount}`);
if (imagePromptMissingCompositionPhraseCount !== 0) failures.push(`image prompts missing composition phrase: ${imagePromptMissingCompositionPhraseCount}`);
if (imagePromptMissingRaceAppearanceCount !== 0) failures.push(`image prompts missing race appearance phrase: ${imagePromptMissingRaceAppearanceCount}`);
if (imagePromptMissingClassReadabilityCount !== 0) failures.push(`image prompts missing class readability phrase: ${imagePromptMissingClassReadabilityCount}`);
if (imagePromptFullBodyModePhraseCount !== imagePromptFullBodyModeTotal) failures.push(`full-body image prompts missing full-body phrase: ${imagePromptFullBodyModeTotal - imagePromptFullBodyModePhraseCount}/${imagePromptFullBodyModeTotal}`);
if (imagePromptRaceAppearanceCount !== sampleSize) failures.push(`image prompts missing race appearance phrase: ${sampleSize - imagePromptRaceAppearanceCount}/${sampleSize}`);
if (imagePromptClassReadabilityCount !== sampleSize) failures.push(`image prompts missing class readability phrase: ${sampleSize - imagePromptClassReadabilityCount}/${sampleSize}`);
if (imagePromptQualityRulesCount !== sampleSize) failures.push(`image prompts missing quality rules: ${sampleSize - imagePromptQualityRulesCount}/${sampleSize}`);
if (imagePromptNegativePromptCount !== sampleSize) failures.push(`image prompts missing negative prompt: ${sampleSize - imagePromptNegativePromptCount}/${sampleSize}`);
if (consecutiveVisualCoreDuplicateCount > 0) failures.push(`consecutive visual core duplicate count should be zero: ${consecutiveVisualCoreDuplicateCount}`);
const ordinaryRate = (modeCounts.get('ordinary class') ?? 0) / sampleSize;
const curatedRate = (modeCounts.get('curated multiclass') ?? 0) / sampleSize;
if (ordinaryRate < 0.94 || ordinaryRate > 0.97) failures.push(`ordinary class rate outside target: ${(ordinaryRate * 100).toFixed(1)}%`);
if (curatedRate < 0.03 || curatedRate > 0.05) failures.push(`curated multiclass rate outside target: ${(curatedRate * 100).toFixed(1)}%`);
if (randomMulticlassCount > 0) failures.push(`random multiclass count should be zero: ${randomMulticlassCount}`);
if (tripleMulticlassCount > 0) failures.push(`triple multiclass count should be zero: ${tripleMulticlassCount}`);
if (forbiddenMulticlassCount > 0) failures.push(`forbidden multiclass count should be zero: ${forbiddenMulticlassCount}`);
if (multiclassAnchorCount > 0 && multiclassAnchorTotal / multiclassAnchorCount < 4.3) failures.push(`multiclass class anchor average below 4.3: ${(multiclassAnchorTotal / multiclassAnchorCount).toFixed(2)}`);
if (consecutiveSameRaceSameAppearanceCount > 0) failures.push(`consecutive same-race same-appearance count should be zero: ${consecutiveSameRaceSameAppearanceCount}`);
if (dwarfSameBeardRepeatCount > 0) failures.push(`dwarf same beard repeat count should be zero: ${dwarfSameBeardRepeatCount}`);
if (raceForbiddenFeatureViolations > 0) failures.push(`race forbidden feature violations should be zero: ${raceForbiddenFeatureViolations}`);
if (aasimarPromptCount > 0 && aasimarCelestialMarkerCount !== aasimarPromptCount) failures.push(`aasimar celestial marker phrase missing: ${aasimarPromptCount - aasimarCelestialMarkerCount}/${aasimarPromptCount}`);
if (aasimarPromptCount > 0 && aasimarEyeMarkerCount / aasimarPromptCount < 0.8) failures.push(`aasimar luminous/radiant eye marker below 80%: ${((aasimarEyeMarkerCount / aasimarPromptCount) * 100).toFixed(1)}%`);
if (aasimarPromptCount > 0 && aasimarHaloMarkCount / aasimarPromptCount < 0.7) failures.push(`aasimar halo/birthmark/celestial marker below 70%: ${((aasimarHaloMarkCount / aasimarPromptCount) * 100).toFixed(1)}%`);
if (aasimarGenericRiskCount > 0) failures.push(`aasimar generic human risk count should be zero: ${aasimarGenericRiskCount}`);
if (noisyDetailTotal / sampleSize > 1.0) failures.push(`noisy character-bound detail average above 1.0: ${(noisyDetailTotal / sampleSize).toFixed(2)}`);
if (paperOverusePromptCount > 0) failures.push(`prompts with more than one paper/document item: ${paperOverusePromptCount}`);
if (spyglassOutsideAllowedCount > 0) failures.push(`spyglass outside allowed themes: ${spyglassOutsideAllowedCount}`);
if (ledgerOutsideAllowedCount > 0) failures.push(`ledger/license/inventory outside allowed themes: ${ledgerOutsideAllowedCount}`);
if (emotionPoseMismatchCount > 0) failures.push(`emotion-pose mismatch count should be zero: ${emotionPoseMismatchCount}`);
if (excessiveClutterCount / sampleSize >= 0.05) failures.push(`excessive clutter prompts exceed 5%: ${((excessiveClutterCount / sampleSize) * 100).toFixed(1)}%`);
if (scenePropTotal / sampleSize > 1.2) failures.push(`average scene props above 1.2: ${(scenePropTotal / sampleSize).toFixed(2)}`);
if (characterBoundTotal / sampleSize < 4) failures.push(`average character-bound details below 4: ${(characterBoundTotal / sampleSize).toFixed(2)}`);
if ((compositionModeCounts.get('cinematic_splash_art') ?? 0) > 0) failures.push(`default generation should not use cinematic splash art: ${compositionModeCounts.get('cinematic_splash_art')}`);

const scholarTotal = [...scholarThemeCounts.values()].reduce((sum, count) => sum + count, 0);
if (scholarTotal > sampleSize * 0.28) {
  failures.push(`scholar themes dominated distribution: ${scholarTotal}/${sampleSize}`);
}

const divineArchivistCount = themeCounts.get('divine_archivist') ?? 0;
if (divineArchivistCount > sampleSize * 0.13) {
  failures.push(`divine_archivist dominated distribution: ${divineArchivistCount}/${sampleSize}`);
}

const maxCulture = topEntries(cultureCounts, 1)[0];
if (maxCulture && maxCulture[1] > sampleSize * 0.22) {
  failures.push(`culture dominated distribution: ${maxCulture[0]} = ${maxCulture[1]}`);
}

const maxNarrativeVariant = topEntries(narrativeVariantCounts, 1)[0];
if (maxNarrativeVariant && maxNarrativeVariant[1] > sampleSize * 0.16) {
  failures.push(`narrative variant dominated diversity: ${maxNarrativeVariant[0]} = ${maxNarrativeVariant[1]}`);
}

const maxThemeVariant = topEntries(themeVariantCounts, 1)[0];
if (maxThemeVariant && maxThemeVariant[1] > sampleSize * 0.16) {
  failures.push(`visual theme variant dominated diversity: ${maxThemeVariant[0]} = ${maxThemeVariant[1]}`);
}

const maxStoryDetail = topEntries(storyDetailCounts, 1)[0];
if (maxStoryDetail && maxStoryDetail[1] > sampleSize * 0.22) {
  failures.push(`story detail repeated too often: ${maxStoryDetail[0]} = ${maxStoryDetail[1]}`);
}

const maxCombination = topEntries(combinationCounts, 1)[0];
if (maxCombination && maxCombination[1] > sampleSize * 0.08) {
  failures.push(`class/theme/motif combination repeated too often: ${maxCombination[0]} = ${maxCombination[1]}`);
}

function printStats(title, map) {
  console.log(`\n${title}`);
  for (const [key, count] of topEntries(map)) {
    console.log(`${String(count).padStart(4, ' ')}  ${key}`);
  }
}

printStats('Top 20 motifs', motifCounts);
printStats('Top 20 narrative variants', narrativeVariantCounts);
printStats('Top 20 themes', themeCounts);
printStats('Top 20 visual theme variants', themeVariantCounts);
printStats('Top 20 story details', storyDetailCounts);
printStats('Culture distribution', cultureCounts);
printStats('Class identity score buckets', classScoreCounts);
console.log('\nAverage class identity score');
for (const [className, total] of [...classScoreTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const count = [...classScoreCounts.entries()]
    .filter(([bucket]) => bucket.startsWith(`${className}:`))
    .reduce((sum, [, bucketCount]) => sum + bucketCount, 0);
  console.log(`${className}: ${(total / count).toFixed(2)}/5`);
}
printStats('Scholar theme distribution', scholarThemeCounts);
console.log('\nVisual library distribution');
console.log(`Companion activation: ${companionActiveCount}/${sampleSize} (${((companionActiveCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Legendary companion activation: ${legendaryCompanionCount}/${sampleSize} (${((legendaryCompanionCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Ranger/druid/frontier companion activation: ${frontierCompanionActiveCount}/${frontierCompanionGroupCount} (${(frontierCompanionRate * 100).toFixed(1)}%)`);
console.log(`Conflict rate: ${conflictCount}/${sampleSize} (${((conflictCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Plain armor language fallback: ${armorLanguageCounts.get('plain_armor_language') ?? 0}/${sampleSize} (${(((armorLanguageCounts.get('plain_armor_language') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Plain weapon language fallback: ${weaponLanguageCounts.get('plain_weapon_language') ?? 0}/${sampleSize} (${(((weaponLanguageCounts.get('plain_weapon_language') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Equipment contradiction count: ${equipmentContradictionCount}`);
console.log('Enchantment intensity distribution');
for (const [key, count] of topEntries(enchantmentIntensityCounts, 10)) console.log(`${key}: ${count}/${sampleSize} (${((count / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Recent similarity average: ${(sequentialSimilarityTotal / Math.max(1, sequentialComparisonCount)).toFixed(1)}`);
console.log(`Recent similarity max: ${sequentialSimilarityMax}`);
console.log(`Too-similar sequential count: ${tooSimilarSequentialCount}`);
console.log(`Consecutive visual core duplicate count: ${consecutiveVisualCoreDuplicateCount}`);
console.log(`Consecutive visual core duplicate rate: ${((consecutiveVisualCoreDuplicateCount / Math.max(1, sequentialComparisonCount)) * 100).toFixed(1)}%`);
console.log('Image Prompt quality statistics');
console.log(`Average Image Prompt word count: ${(imagePromptWordTotal / sampleSize).toFixed(1)}`);
console.log(`Max Image Prompt word count: ${imagePromptWordMax}`);
console.log(`Image Prompts over 450 words: ${imagePromptOver450Count}/${sampleSize} (${((imagePromptOver450Count / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with no readable text phrase: ${imagePromptNoReadableTextCount}/${sampleSize} (${((imagePromptNoReadableTextCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with forbidden no text phrase: ${imagePromptNoTextPhraseCount}/${sampleSize} (${((imagePromptNoTextPhraseCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Full-body mode prompts with full-body phrase: ${imagePromptFullBodyModePhraseCount}/${Math.max(1, imagePromptFullBodyModeTotal)} (${((imagePromptFullBodyModePhraseCount / Math.max(1, imagePromptFullBodyModeTotal)) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with race appearance phrase: ${imagePromptRaceAppearanceCount}/${sampleSize} (${((imagePromptRaceAppearanceCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with class readability phrase: ${imagePromptClassReadabilityCount}/${sampleSize} (${((imagePromptClassReadabilityCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with quality rules: ${imagePromptQualityRulesCount}/${sampleSize} (${((imagePromptQualityRulesCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Image Prompts with negative prompt: ${imagePromptNegativePromptCount}/${sampleSize} (${((imagePromptNegativePromptCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Average scene props in Image Prompt: ${(imagePromptScenePropTotal / sampleSize).toFixed(2)}`);
console.log(`Average raw character-bound details before compression: ${(imagePromptCharacterBoundTotal / sampleSize).toFixed(2)}`);
console.log(`Average compressed character-bound details in Image Prompt: ${(imagePromptCompressedDetailTotal / sampleSize).toFixed(2)}`);
console.log(`Full-body prompts with background hints: ${imagePromptBackgroundHintFullBodyCount}`);
console.log(`Old prompt template as Image Prompt: ${oldPromptTemplateAsImagePromptCount}`);
console.log(`Full Generation Output missing: ${fullGenerationMissingCount}`);
console.log(`Full Generation Output missing seed header: ${fullGenerationMissingSeedHeaderCount}`);
console.log(`Full Generation Output missing image prompt header: ${fullGenerationMissingImageHeaderCount}`);
console.log(`Full Generation Output image prompt mismatch: ${fullGenerationImageMismatchCount}`);
console.log(`Full Generation Output contains debug trace: ${fullGenerationContainsTraceCount}`);
console.log(`Image Prompt missing composition phrase: ${imagePromptMissingCompositionPhraseCount}`);
console.log(`Image Prompt missing Race appearance: ${imagePromptMissingRaceAppearanceCount}`);
console.log(`Image Prompt missing Class and build fantasy: ${imagePromptMissingClassReadabilityCount}`);
console.log('Art Direction Resolver statistics');
console.log(`Art direction generated count: ${artDirectionGeneratedCount}`);
console.log(`Dominant read missing class: ${dominantReadMissingClassCount}`);
console.log(`Dominant read missing race: ${dominantReadMissingRaceCount}`);
console.log(`Dominant read too long: ${dominantReadTooLongCount}`);
console.log(`Primary visual read coverage: ${((primaryVisualReadCoverageTotal / sampleSize) * 100).toFixed(1)}%`);
console.log(`Secondary flavor over budget: ${secondaryFlavorOverBudgetCount}`);
console.log(`Suppressed element leak count: ${suppressedElementLeakCount}`);
console.log(`Average story shorthand count: ${(storyShorthandTotal / sampleSize).toFixed(2)}`);
console.log(`Story shorthand clutter risk count: ${storyShorthandClutterRiskCount}`);
console.log('Magic manifestation mode distribution');
for (const [key, count] of topEntries(magicManifestationModeCounts, 10)) console.log(`${key}: ${count}/${sampleSize} (${((count / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Generic rune FX after art direction count: ${genericRuneFxAfterArtDirectionCount}`);
console.log(`Magic mode class mismatch count: ${magicModeClassMismatchCount}`);
console.log(`Art direction primary read regression count: ${artDirectionPrimaryReadRegressionCount}`);
console.log(`Dominant read class drift count: ${dominantReadClassDriftCount}`);
console.log(`Dominant read theme overrides class count: ${dominantReadThemeOverridesClassCount}`);
console.log(`Dominant read wrong role noun count: ${dominantReadWrongRoleNounCount}`);
console.log(`Dominant read primary class coverage: ${dominantReadPrimaryClassCoverageCount}/${sampleSize} (${((dominantReadPrimaryClassCoverageCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Art direction repair count: ${artDirectionRepairCount}`);
console.log(`Dominant read repair count: ${dominantReadRepairCount}`);
console.log(`Pose directive repair count: ${poseDirectiveRepairCount}`);
console.log(`Secondary flavor demotion count: ${secondaryFlavorDemotionCount}`);
console.log(`Conflicting flavor suppressed count: ${conflictingFlavorSuppressedCount}`);
console.log('Magic mode distribution by class');
for (const [key, count] of topEntries(magicModeDistributionByClass, 30)) console.log(`${key}: ${count}`);
console.log('Body magic rate by caster class');
for (const className of ['wizard', 'sorcerer', 'warlock']) console.log(`${className}: ${casterBodyMagicCounts.get(className) ?? 0}/${casterBodyMagicTotals.get(className) ?? 0}`);
console.log(`Environment magic generic count: ${environmentMagicGenericCount}`);
console.log(`Bard orb caster read count: ${bardOrbCasterReadCount}`);
console.log(`Holy symbol non-divine read count: ${holySymbolNonDivineReadCount}`);
console.log(`Image Prompt word count after Art Direction compression: ${(imagePromptWordCountAfterArtDirectionCompressionTotal / sampleSize).toFixed(1)}`);
console.log(`Art Direction compression removed flavor count: ${artDirectionCompressionRemovedFlavorCount}`);
console.log(`Primary read lost after compression count: ${primaryReadLostAfterCompressionCount}`);
console.log('Artist brief quality statistics');
console.log(`Artist brief missing dominant read: ${artistBriefMissingDominantRead}`);
console.log(`Artist brief missing class/race: ${artistBriefMissingClass}`);
console.log(`Artist brief missing pose: ${artistBriefMissingPose}`);
console.log(`Artist brief too long: ${artistBriefTooLong}`);
console.log(`Artist brief suppression missing: ${artistBriefSuppressionMissing}`);
console.log('Race-class plausibility statistics');
console.log(`Race-class plausibility risk count: ${raceClassPlausibilityRiskCount}`);
console.log(`Blocked default race/class count: ${blockedDefaultRaceClassCount}`);
console.log(`Chaos-only race/class in default count: ${chaosOnlyRaceClassInDefaultCount}`);
console.log(`Rare race/class reinterpreted count: ${rareRaceClassReinterpretedCount}`);
console.log(`Race-class reinterpretation applied count: ${raceClassReinterpretationAppliedCount}`);
console.log('Theme class override risk statistics');
console.log(`Theme overrides primary class count: ${themeOverridesPrimaryClassCount}`);
console.log(`Theme downgraded to flavor count: ${themeDowngradedToFlavorCount}`);
console.log(`Theme reinterpreted through class count: ${themeReinterpretedThroughClassCount}`);
console.log(`Theme rerolled/suppressed for class read count: ${themeRerolledForClassReadCount}`);
console.log(`Fighter-paladin drift risk count: ${fighterPaladinDriftRiskCount}`);
console.log(`Rogue-bard drift risk count: ${rogueBardDriftRiskCount}`);
console.log(`Rogue-ranger drift risk count: ${rogueRangerDriftRiskCount}`);
console.log(`Wizard-cleric drift risk count: ${wizardClericDriftRiskCount}`);
console.log(`Druid-bard drift risk count: ${druidBardDriftRiskCount}`);
console.log('Divine light differentiation statistics');
console.log(`Divine halo overuse count: ${divineHaloOveruseCount}`);
console.log(`Generic holy backlight count: ${genericHolyBacklightCount}`);
console.log(`Cathedral rays overuse count: ${cathedralRaysOveruseCount}`);
console.log('Divine light mode distribution');
for (const [key, count] of topEntries(divineLightModeDistribution, 20)) console.log(`${key}: ${count}`);
console.log(`Fighter with paladin light count: ${fighterWithPaladinLightCount}`);
console.log(`Cleric-paladin light collapse count: ${clericPaladinLightCollapseCount}`);
console.log('Render texture hygiene statistics');
console.log(`Render grid artifact prompt risk count: ${renderGridArtifactPromptRiskCount}`);
console.log(`Rhombus texture risk count: ${rhombusTextureRiskCount}`);
console.log(`Scale texture on non-scaled race risk count: ${scaleTextureOnNonScaledRaceRiskCount}`);
console.log(`Overpatterned fabric risk count: ${overPatternedFabricRiskCount}`);
console.log('Aasimar readability statistics');
console.log(`Aasimar prompts: ${aasimarPromptCount}`);
console.log(`Aasimar celestial marker phrase: ${aasimarCelestialMarkerCount}/${aasimarPromptCount || 1} (${((aasimarCelestialMarkerCount / (aasimarPromptCount || 1)) * 100).toFixed(1)}%)`);
console.log(`Aasimar luminous/radiant eye marker: ${aasimarEyeMarkerCount}/${aasimarPromptCount || 1} (${((aasimarEyeMarkerCount / (aasimarPromptCount || 1)) * 100).toFixed(1)}%)`);
console.log(`Aasimar halo/birthmark/celestial mark marker: ${aasimarHaloMarkCount}/${aasimarPromptCount || 1} (${((aasimarHaloMarkCount / (aasimarPromptCount || 1)) * 100).toFixed(1)}%)`);
console.log(`Aasimar generic human risk count: ${aasimarGenericRiskCount}`);
console.log('Noisy character-bound detail statistics');
console.log(`Average noisy character-bound details per prompt: ${(noisyDetailTotal / sampleSize).toFixed(2)}`);
console.log(`Prompts with >1 paper/document item: ${paperOverusePromptCount}`);
console.log(`Spyglass outside allowed themes: ${spyglassOutsideAllowedCount}`);
console.log(`Ledger/license/inventory outside allowed themes: ${ledgerOutsideAllowedCount}`);
console.log(`Prompts with >1 tag/charm cluster: ${tagCharmClusterOveruseCount}`);
console.log('Object clutter suppression statistics');
console.log(`Image Prompt object clutter count: ${imagePromptObjectClutterCount}`);
console.log(`Image Prompt paper clutter count: ${imagePromptPaperClutterCount}`);
console.log(`Image Prompt book stack count: ${imagePromptBookStackCount}`);
console.log(`Image Prompt banner clutter count: ${imagePromptBannerClutterCount}`);
console.log(`Image Prompt chain/charm clutter count: ${imagePromptChainCharmClutterCount}`);
console.log(`Prompts with >1 object-like detail: ${promptsWithMoreThanOneObjectDetail}`);
console.log(`Prompts with stacked books: ${promptsWithStackedBooks}`);
console.log(`Prompts with battle reports: ${promptsWithBattleReports}`);
console.log(`Prompts with campaign maps: ${promptsWithCampaignMaps}`);
console.log(`Prompts with huge banner risk: ${promptsWithHugeBannerRisk}`);
console.log(`Prompts with excessive belt/tag risk: ${promptsWithExcessiveBeltOrTagRisk}`);
console.log('Accessory minimalism statistics');
console.log(`Accessory clutter phrase count: ${accessoryClutterPhraseCount}`);
console.log(`Belt phrase count: ${beltPhraseCount}`);
console.log(`Chain phrase count: ${chainPhraseCount}`);
console.log(`Dangling phrase count: ${danglingPhraseCount}`);
console.log(`Medallion phrase count: ${medallionPhraseCount}`);
console.log(`Ribbon phrase count: ${ribbonPhraseCount}`);
console.log(`Banner large flag risk: ${bannerLargeFlagRisk}`);
console.log(`Giant banner phrase count: ${giantBannerPhraseCount}`);
console.log(`Banner weapon large flag risk: ${bannerWeaponLargeFlagRisk}`);
console.log(`Scholar wearable-library risk: ${scholarLibraryRisk}`);
console.log(`Weapon accessory overload risk: ${weaponAccessoryOverloadRisk}`);
console.log(`Armor accessory overload risk: ${armorAccessoryOverloadRisk}`);
console.log('Silhouette trigger cleanup statistics');
console.log(`Silhouette banner trigger count: ${silhouetteBannerTriggerCount}`);
console.log(`Silhouette book trigger count: ${silhouetteBookTriggerCount}`);
console.log(`Silhouette scroll trigger count: ${silhouetteScrollTriggerCount}`);
console.log(`Silhouette clutter trigger count: ${silhouetteClutterTriggerCount}`);
console.log(`Positive banner word count in full-body prompts: ${positiveBannerWordCountFullBody}`);
console.log(`Wizard/scholar secondary book trigger count: ${wizardSecondaryBookTrigger}`);
console.log(`Staff plus book silhouette risk: ${staffPlusBookSilhouetteRisk}`);
console.log(`Positive/negative contradiction count: ${positiveNegativeContradictionCount}`);
const topPoseCount = Math.max(0, ...poseUsageCounts.values());
const topPoseShare = topPoseCount / sampleSize;
const topPoseFamilyCount = Math.max(0, ...poseFamilyCounts.values());
const topPoseFamilyShare = topPoseFamilyCount / sampleSize;
const poseFamilyEntropy = entropyFromCounts(poseFamilyCounts);
const highImpactPoseRate = highImpactPoseCount / sampleSize;
const casterSigilPoseRate = casterPoseTotal === 0 ? 0 : casterSigilPoseCount / casterPoseTotal;
console.log('Silhouette and pose QA statistics');
console.log(`Top pose share: ${(topPoseShare * 100).toFixed(1)}%`);
console.log(`Top pose family share: ${(topPoseFamilyShare * 100).toFixed(1)}%`);
console.log(`Pose family entropy: ${poseFamilyEntropy.entropy.toFixed(3)} bits (${(poseFamilyEntropy.normalized * 100).toFixed(1)}% normalized)`);
console.log(`High-impact pose rate: ${(highImpactPoseRate * 100).toFixed(1)}%`);
console.log(`Caster sigil pose rate: ${(casterSigilPoseRate * 100).toFixed(1)}%`);
console.log(`Fairy savage berserker risk: ${fairySavageBerserkerRisk}`);
console.log(`Fairy raider king risk: ${fairyRaiderKingRisk}`);
console.log(`Fairy arena colossus risk: ${fairyArenaColossusRisk}`);
console.log(`Tiny bulky martial risk: ${tinyBulkyMartialRisk}`);
console.log(`Small race overscale silhouette risk: ${smallRaceOverscaleSilhouetteRisk}`);
console.log(`Small race oversized weapon risk: ${smallRaceOversizedWeaponRisk}`);
console.log('Pose family distribution');
for (const [family, count] of [...poseFamilyCounts.entries()].sort((a, b) => b[1] - a[1])) console.log(`${String(count).padStart(4)}  ${family}`);
console.log('Primary read stack statistics');
console.log(`Primary read coverage: ${(((sampleSize - primaryReadMissingRace - primaryReadMissingClass - primaryReadMissingSilhouette - primaryReadMissingWeapon - primaryReadMissingPose - primaryReadMissingPoseFamily) / sampleSize) * 100).toFixed(1)}% strict aggregate`);
console.log(`Primary read missing race: ${primaryReadMissingRace}`);
console.log(`Primary read missing class: ${primaryReadMissingClass}`);
console.log(`Primary read missing silhouette: ${primaryReadMissingSilhouette}`);
console.log(`Primary read missing weapon: ${primaryReadMissingWeapon}`);
console.log(`Primary read missing pose: ${primaryReadMissingPose}`);
console.log(`Primary read missing pose family: ${primaryReadMissingPoseFamily}`);
console.log(`Flavor stack dominates prompt count: ${flavorStackDominatesPromptCount}`);
console.log(`Repeated pose family within last 8: ${repeatedPoseFamilyWithinEightCount}`);
console.log(`Class pose repetition count: ${classPoseRepetitionCount}`);
console.log(`Weapon pose repetition count: ${weaponPoseRepetitionCount}`);
console.log('Bard readability statistics');
console.log(`Bard as wizard risk: ${bardAsWizardRiskCount}`);
console.log(`Bard without performer anchor: ${bardWithoutPerformerAnchorCount}`);
console.log('Tiny/small race loadout statistics');
console.log(`Fairy full plate count: ${fairyFullPlateCount}`);
console.log(`Fairy heavy shield fantasy count: ${fairyHeavyShieldCount}`);
console.log(`Tiny heavy holy-warrior risk count: ${tinyHeavyHolyWarriorRiskCount}`);
console.log('Pose cooldown and emotion coherence statistics');
console.log(`Repeated exact pose within last 8: ${repeatedExactPoseWithinEightCount}`);
console.log(`Repeated high-impact pose within last 5: ${repeatedHighImpactPoseWithinFiveCount}`);
console.log(`Repeated pose + same class within last 10: ${repeatedPoseSameClassWithinTenCount}`);
console.log(`Caster active casting pose rate: ${casterActiveCastingPoseCount}/${Math.max(1, casterPoseTotal)} (${((casterActiveCastingPoseCount / Math.max(1, casterPoseTotal)) * 100).toFixed(1)}%)`);
console.log(`Emotion-pose mismatch count: ${emotionPoseMismatchCount}`);
console.log(`Rune motif on grounded non-arcane count: ${runeMotifGroundedNonArcaneCount}`);
console.log('Mismatch statistics');
for (const [key, count] of Object.entries(mismatchCounts)) console.log(`${key}: ${count}`);
console.log('Appearance and clutter statistics');
console.log(`Average same-race appearance similarity: ${(sameRaceAppearanceSimilarityTotal / Math.max(1, sameRaceAppearanceComparisonCount)).toFixed(1)}`);
console.log(`Consecutive same-race same-appearance count: ${consecutiveSameRaceSameAppearanceCount}`);
console.log(`Dwarf same beard repeat count: ${dwarfSameBeardRepeatCount}`);
console.log(`Race-specific forbidden feature violations: ${raceForbiddenFeatureViolations}`);
console.log(`Average scene props: ${(scenePropTotal / sampleSize).toFixed(2)}`);
console.log(`Average character-bound details: ${(characterBoundTotal / sampleSize).toFixed(2)}`);
console.log(`Excessive clutter prompts: ${excessiveClutterCount}/${sampleSize} (${((excessiveClutterCount / sampleSize) * 100).toFixed(1)}%)`);
console.log('Multiclass statistics');
console.log(`Ordinary class rate: ${modeCounts.get('ordinary class') ?? 0}/${sampleSize} (${(((modeCounts.get('ordinary class') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Curated multiclass rate: ${modeCounts.get('curated multiclass') ?? 0}/${sampleSize} (${(((modeCounts.get('curated multiclass') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Chaos rate: ${modeCounts.get('chaos') ?? 0}/${sampleSize} (${(((modeCounts.get('chaos') ?? 0) / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Random multiclass count: ${randomMulticlassCount}`);
console.log(`Triple multiclass count: ${tripleMulticlassCount}`);
console.log(`Forbidden multiclass count: ${forbiddenMulticlassCount}`);
console.log(`Multiclass class anchor average: ${(multiclassAnchorTotal / Math.max(1, multiclassAnchorCount)).toFixed(2)}/5`);
if (warnings.length > 0) {
  console.log('Warnings');
  for (const warning of warnings) console.log(`warning: ${warning}`);
}
console.log('Companion activation by class');
for (const [className, total] of [...companionClassTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = companionByClass.get(className) ?? 0;
  console.log(`${className}: ${active}/${total} (${((active / total) * 100).toFixed(1)}%)`);
}
console.log('Companion activation by build template');
for (const [templateId, total] of [...companionBuildTemplateTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const active = companionByBuildTemplate.get(templateId) ?? 0;
  console.log(`${templateId}: ${active}/${total} (${((active / total) * 100).toFixed(1)}%)`);
}
printStats('Top silhouettes', silhouetteCounts);
printStats('Top visual motifs', visualMotifCounts);
printStats('Top companions', companionCounts);
printStats('Top armor languages', armorLanguageCounts);
printStats('Top weapon languages', weaponLanguageCounts);
printStats('Top 20 plain weapon fallback sources', plainWeaponFallbackSources);
printStats('Plain weapon fallback by tag', plainWeaponFallbackTags);
printStats('Plain weapon fallback by buildTemplate', plainWeaponFallbackBuildTemplates);
printStats('Plain weapon fallback by visualTheme', plainWeaponFallbackThemes);
printStats('Plain weapon fallback by class', plainWeaponFallbackClasses);
printStats('Top repeated sequential visual themes', sequentialThemeCounts);
printStats('Top repeated sequential poses', sequentialPoseCounts);
printStats('Top repeated sequential FX', sequentialFxCounts);
printStats('Top repeated sequential visual details', sequentialDetailCounts);
printStats('Composition mode distribution', compositionModeCounts);
printStats('Environment detail level distribution', environmentLevelCounts);
printStats('Character-bound detail count buckets', characterBoundCounts);
printStats('Scene prop count buckets', scenePropCounts);
printStats('Top repeated scene props', repeatedScenePropCounts);
printStats('Appearance distribution by race/profile', appearanceDistribution);
printStats('Curated multiclass distribution', curatedProfileCounts);
console.log('Dream Walker-specific statistics');
console.log(`Dream Walker activation: ${dreamWalkerCount}/${sampleSize} (${((dreamWalkerCount / sampleSize) * 100).toFixed(1)}%)`);
console.log(`Dream Walker scene prop average: ${(dreamWalkerScenePropTotal / Math.max(1, dreamWalkerCount)).toFixed(2)}`);
console.log(`Dream Walker iconic/legendary detail rate: ${dreamWalkerIconicCount}/${Math.max(1, dreamWalkerCount)} (${((dreamWalkerIconicCount / Math.max(1, dreamWalkerCount)) * 100).toFixed(1)}%)`);
console.log(`Dream Walker remapped compatibility tags: ${Object.entries(dreamWalkerCompatibilityAliases).map(([tag, mapped]) => `${tag}->${mapped.join('|')}`).join(', ')}`);
console.log(`Dream Walker rejected/ignored unknown tags: ${dreamWalkerRejectedCompatibilityTags.length > 0 ? dreamWalkerRejectedCompatibilityTags.join(', ') : 'none'}`);
printStats('Dream Walker theme variants', dreamWalkerVariantCounts);
printStats('Dream Walker silhouettes', dreamWalkerSilhouetteCounts);
printStats('Dream Walker armor/clothing', dreamWalkerArmorCounts);
printStats('Dream Walker weapon/tools', dreamWalkerWeaponCounts);
printStats('Dream Walker weapon languages', dreamWalkerWeaponLanguageCounts);
printStats('Dream Walker equipment finishes', dreamWalkerFinishCounts);
printStats('Dream Walker enchantments', dreamWalkerEnchantmentCounts);
printStats('Dream Walker poses', dreamWalkerPoseCounts);
printStats('Dream Walker moods', dreamWalkerMoodCounts);
printStats('Dream Walker lights', dreamWalkerLightCounts);
printStats('Dream Walker FX', dreamWalkerFxCounts);
printStats('Dream Walker character-bound details', dreamWalkerDetailCounts);
printStats('Top equipment finishes', equipmentFinishCounts);
printStats('Top equipment enchantments', equipmentEnchantmentCounts);
printStats('Top visual details', visualDetailCounts);
console.log('\nUnderused detail pools');
for (const [themeId, count] of themeContentProfiles.map((profile) => [profile.themeId, themeCounts.get(profile.themeId) ?? 0]).sort((a, b) => a[1] - b[1]).slice(0, 10)) console.log(`${String(count).padStart(4, ' ')}  ${themeId}`);
printStats('Most common Class + Theme + Motif combinations', combinationCounts);

rmSync(outDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`Debug check failed with ${failures.length} issue(s):`);
  console.error(failures.slice(0, 25).join('\n'));
  process.exit(1);
}

console.log(`Debug check passed: ${sampleSize} generated seeds satisfy Content Bible v3 visual-library rules.`);
