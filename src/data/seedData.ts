export type WeightedItem = {
  id: string;
  label: string;
  prompt: string;
  weight: number;
};

export type CharacterClass = WeightedItem & {
  archetypes: string[];
};

export type MulticlassPreset = WeightedItem & {
  primaryClass: string;
  secondaryClass: string;
  archetypes: string[];
};

export type Race = WeightedItem & {
  prefers: string[];
  avoids?: string[];
};

export type CompatibleItem = {
  id: string;
  label: string;
  prompt: string;
  prefers?: string[];
  classes?: string[];
  races?: string[];
  tags?: string[];
};

export type ThemeMap = Record<string, string[]>;

export const modes: WeightedItem[] = [
  { id: 'single_class', label: 'Обычный класс', prompt: 'single class', weight: 70 },
  { id: 'multiclass', label: 'Мультикласс', prompt: 'multiclass', weight: 25 },
  { id: 'chaos', label: 'Chaos / странный билд', prompt: 'chaotic multiclass', weight: 5 },
];

export const classes: CharacterClass[] = [
  { id: 'fighter', label: 'Воин', prompt: 'fighter', weight: 14, archetypes: ['Knight', 'Spellblade', 'Shadow Hunter'] },
  { id: 'rogue', label: 'Плут', prompt: 'rogue', weight: 13, archetypes: ['Rogue Assassin', 'Shadow Hunter', 'Trickster Performer'] },
  { id: 'paladin', label: 'Паладин', prompt: 'paladin', weight: 11, archetypes: ['Holy Warrior', 'Knight', 'Fallen Zealot'] },
  { id: 'ranger', label: 'Следопыт', prompt: 'ranger', weight: 11, archetypes: ['Shadow Hunter', 'Nature Guardian'] },
  { id: 'wizard', label: 'Волшебник', prompt: 'wizard', weight: 10, archetypes: ['Arcane Mage', 'Void Prophet'] },
  { id: 'barbarian', label: 'Варвар', prompt: 'barbarian', weight: 10, archetypes: ['Wild Berserker'] },
  { id: 'bard', label: 'Бард', prompt: 'bard', weight: 9, archetypes: ['Trickster Performer', 'Fey Wanderer'] },
  { id: 'cleric', label: 'Жрец', prompt: 'cleric', weight: 9, archetypes: ['Holy Warrior', 'Nature Guardian'] },
  { id: 'sorcerer', label: 'Чародей', prompt: 'sorcerer', weight: 8, archetypes: ['Arcane Mage', 'Dragon Vessel', 'Void Prophet'] },
  { id: 'warlock', label: 'Колдун', prompt: 'warlock', weight: 7, archetypes: ['Occultist', 'Void Prophet', 'Fallen Zealot'] },
  { id: 'monk', label: 'Монах', prompt: 'monk', weight: 7, archetypes: ['Wandering Monk'] },
  { id: 'druid', label: 'Друид', prompt: 'druid', weight: 6, archetypes: ['Nature Guardian'] },
  { id: 'artificer', label: 'Изобретатель', prompt: 'artificer', weight: 5, archetypes: ['Battle Engineer', 'Spellblade'] },
];

export const multiclassPresets: MulticlassPreset[] = [
  { id: 'fighter_rogue', label: 'Воин + Плут', prompt: 'fighter rogue', weight: 10, primaryClass: 'fighter', secondaryClass: 'rogue', archetypes: ['Rogue Assassin', 'Shadow Hunter', 'Spellblade'] },
  { id: 'ranger_rogue', label: 'Следопыт + Плут', prompt: 'ranger rogue', weight: 9, primaryClass: 'ranger', secondaryClass: 'rogue', archetypes: ['Shadow Hunter'] },
  { id: 'bard_rogue', label: 'Бард + Плут', prompt: 'bard rogue', weight: 8, primaryClass: 'bard', secondaryClass: 'rogue', archetypes: ['Trickster Performer'] },
  { id: 'paladin_warlock', label: 'Паладин + Колдун', prompt: 'paladin warlock', weight: 5, primaryClass: 'paladin', secondaryClass: 'warlock', archetypes: ['Fallen Zealot', 'Occultist', 'Knight'] },
  { id: 'fighter_wizard', label: 'Воин + Волшебник', prompt: 'fighter wizard', weight: 4, primaryClass: 'fighter', secondaryClass: 'wizard', archetypes: ['Spellblade'] },
  { id: 'bard_warlock', label: 'Бард + Колдун', prompt: 'bard warlock', weight: 4, primaryClass: 'bard', secondaryClass: 'warlock', archetypes: ['Occultist', 'Trickster Performer'] },
  { id: 'druid_barbarian', label: 'Друид + Варвар', prompt: 'druid barbarian', weight: 2, primaryClass: 'druid', secondaryClass: 'barbarian', archetypes: ['Wild Berserker', 'Nature Guardian'] },
  { id: 'warlock_sorcerer', label: 'Колдун + Чародей', prompt: 'warlock sorcerer', weight: 2, primaryClass: 'warlock', secondaryClass: 'sorcerer', archetypes: ['Void Prophet', 'Occultist'] },
  { id: 'wizard_barbarian', label: 'Волшебник + Варвар', prompt: 'wizard barbarian', weight: 1, primaryClass: 'wizard', secondaryClass: 'barbarian', archetypes: ['Chaos Mutant'] },
  { id: 'monk_paladin', label: 'Монах + Паладин', prompt: 'monk paladin', weight: 1, primaryClass: 'monk', secondaryClass: 'paladin', archetypes: ['Wandering Monk', 'Holy Warrior'] },
];

export const races: Race[] = [
  { id: 'human', label: 'Человек', prompt: 'human', weight: 15, prefers: [] },
  { id: 'elf', label: 'Эльф', prompt: 'elf', weight: 12, prefers: ['Arcane Mage', 'Fey Wanderer', 'Spellblade', 'Shadow Hunter'] },
  { id: 'half_elf', label: 'Полуэльф', prompt: 'half-elf', weight: 11, prefers: ['Trickster Performer', 'Spellblade', 'Occultist', 'Shadow Hunter'] },
  { id: 'dwarf', label: 'Дварф', prompt: 'dwarf', weight: 10, prefers: ['Knight', 'Holy Warrior', 'Battle Engineer'], avoids: ['Fey Wanderer'] },
  { id: 'half_orc', label: 'Полуорк', prompt: 'half-orc', weight: 8, prefers: ['Wild Berserker', 'Knight', 'Shadow Hunter'] },
  { id: 'tiefling', label: 'Тифлинг', prompt: 'tiefling', weight: 7, prefers: ['Occultist', 'Fallen Zealot', 'Trickster Performer', 'Void Prophet'] },
  { id: 'halfling', label: 'Полурослик', prompt: 'halfling', weight: 7, prefers: ['Rogue Assassin', 'Trickster Performer', 'Shadow Hunter'] },
  { id: 'gnome', label: 'Гном', prompt: 'gnome', weight: 6, prefers: ['Battle Engineer', 'Arcane Mage', 'Trickster Performer'] },
  { id: 'aasimar', label: 'Аасимар', prompt: 'aasimar', weight: 5, prefers: ['Holy Warrior', 'Arcane Mage', 'Knight'] },
  { id: 'drow', label: 'Тёмный эльф', prompt: 'drow', weight: 5, prefers: ['Occultist', 'Rogue Assassin', 'Void Prophet', 'Spellblade'] },
  { id: 'dragonborn', label: 'Драконорождённый', prompt: 'dragonborn', weight: 5, prefers: ['Dragon Vessel', 'Knight', 'Holy Warrior'] },
  { id: 'goliath', label: 'Голиаф', prompt: 'goliath', weight: 4, prefers: ['Wild Berserker', 'Knight'] },
  { id: 'tabaxi', label: 'Табакси', prompt: 'tabaxi', weight: 4, prefers: ['Shadow Hunter', 'Rogue Assassin', 'Wandering Monk'] },
  { id: 'fairy', label: 'Фея', prompt: 'fairy', weight: 2, prefers: ['Fey Wanderer', 'Arcane Mage', 'Trickster Performer'], avoids: ['Knight', 'Wild Berserker', 'Holy Warrior'] },
];

export const silhouettes: CompatibleItem[] = [
  { id: 'towering_knight', label: 'Монументальный рыцарь', prompt: 'a monumental knight silhouette', prefers: ['Knight', 'Holy Warrior', 'Fallen Zealot'], classes: ['fighter', 'paladin', 'cleric'], tags: ['massive'] },
  { id: 'lean_duelist', label: 'Стройный дуэлянт', prompt: 'a lean duelist silhouette', prefers: ['Rogue Assassin', 'Spellblade', 'Shadow Hunter'], classes: ['rogue', 'fighter', 'bard'] },
  { id: 'arcane_scholar', label: 'Арканист', prompt: 'an arcane scholar silhouette', prefers: ['Arcane Mage', 'Void Prophet'], classes: ['wizard', 'sorcerer', 'warlock'] },
  { id: 'wild_colossus', label: 'Первобытный колосс', prompt: 'a primal colossus silhouette', prefers: ['Wild Berserker'], classes: ['barbarian', 'druid_barbarian'], tags: ['massive'] },
  { id: 'shadow_stalker', label: 'Теневой охотник', prompt: 'a shadow stalker silhouette', prefers: ['Shadow Hunter', 'Rogue Assassin'], classes: ['rogue', 'ranger'] },
  { id: 'celestial_figure', label: 'Небесная фигура', prompt: 'a radiant celestial silhouette', prefers: ['Holy Warrior', 'Arcane Mage'], classes: ['paladin', 'cleric', 'sorcerer'], races: ['aasimar'] },
  { id: 'wandering_martial_artist', label: 'Странствующий мастер', prompt: 'a wandering martial artist silhouette', prefers: ['Wandering Monk'], classes: ['monk'] },
  { id: 'fey_spirit', label: 'Фейский дух', prompt: 'a small fey spirit silhouette', prefers: ['Fey Wanderer'], races: ['fairy', 'elf', 'half_elf'], tags: ['small', 'fey'] },
  { id: 'battle_engineer_frame', label: 'Боевой инженер', prompt: 'a compact battle engineer frame', prefers: ['Battle Engineer'], classes: ['artificer'] },
];

export const armors: CompatibleItem[] = [
  { id: 'cloth', label: 'Тканевая одежда', prompt: 'layered cloth travel clothes', classes: ['monk', 'wizard', 'sorcerer', 'warlock', 'bard'] },
  { id: 'light_armor', label: 'Лёгкая броня', prompt: 'light leather armor', classes: ['rogue', 'bard', 'ranger', 'warlock', 'fighter'] },
  { id: 'medium_armor', label: 'Средняя броня', prompt: 'medium adventurer armor', classes: ['fighter', 'paladin', 'cleric', 'ranger', 'artificer'] },
  { id: 'heavy_armor', label: 'Тяжёлая броня', prompt: 'heavy plate armor', classes: ['fighter', 'paladin'], tags: ['massive', 'metal'] },
  { id: 'mage_robes', label: 'Магические одеяния', prompt: 'ornate mage robes', classes: ['wizard', 'sorcerer', 'warlock'] },
  { id: 'natural_armor', label: 'Природная броня', prompt: 'non-metal bark and hide armor', classes: ['druid', 'barbarian', 'druid_barbarian'], tags: ['non_metal'] },
];

export const weapons: CompatibleItem[] = [
  { id: 'unarmed', label: 'Без оружия', prompt: 'unarmed martial power', classes: ['monk'] },
  { id: 'quarterstaff', label: 'Боевой посох', prompt: 'a quarterstaff', classes: ['monk', 'druid', 'wizard'] },
  { id: 'rapier', label: 'Рапира', prompt: 'a rapier', classes: ['rogue', 'bard', 'fighter'], prefers: ['Spellblade'] },
  { id: 'daggers', label: 'Кинжалы', prompt: 'paired daggers', classes: ['rogue', 'bard'], prefers: ['Shadow Hunter'] },
  { id: 'longbow', label: 'Длинный лук', prompt: 'a longbow', classes: ['ranger', 'rogue', 'fighter'] },
  { id: 'longsword', label: 'Длинный меч', prompt: 'a longsword', classes: ['fighter', 'paladin', 'cleric'], prefers: ['Spellblade'] },
  { id: 'greatsword', label: 'Двуручный меч', prompt: 'a greatsword', classes: ['fighter', 'paladin', 'barbarian', 'paladin_warlock'], tags: ['heavy', 'oversized'] },
  { id: 'warhammer', label: 'Боевой молот', prompt: 'a warhammer', classes: ['fighter', 'paladin', 'cleric'], races: ['dwarf'], tags: ['heavy'] },
  { id: 'arcane_orb', label: 'Сфера', prompt: 'an arcane orb', classes: ['wizard', 'sorcerer', 'warlock'] },
  { id: 'magic_book', label: 'Магическая книга', prompt: 'a floating magic book', classes: ['wizard'] },
  { id: 'cursed_blade', label: 'Проклятый клинок', prompt: 'a cursed blade', classes: ['warlock', 'paladin_warlock', 'bard_warlock'] },
  { id: 'natural_staff', label: 'Природный посох', prompt: 'a living wooden staff', classes: ['druid'] },
  { id: 'claws_beast_power', label: 'Когти/звериная сила', prompt: 'bestial claws and primal power', classes: ['druid_barbarian', 'barbarian'] },
  { id: 'tools', label: 'Инструменты', prompt: 'glowing tinkering tools', classes: ['artificer', 'bard'] },
];

export const poses: CompatibleItem[] = [
  { id: 'forward_thrust', label: 'Прямой выпад', prompt: 'Lunging forward in a precise thrust', classes: ['rapier', 'longsword', 'cursed_blade'] },
  { id: 'overhead_strike', label: 'Удар сверху', prompt: 'Raising the weapon for an overhead strike', classes: ['greatsword', 'warhammer'], tags: ['heavy_weapon_pose'] },
  { id: 'sweeping_slash', label: 'Широкий замах', prompt: 'Sweeping the blade in a wide slash', classes: ['rapier', 'longsword', 'cursed_blade'] },
  { id: 'raised_shield', label: 'Поднятый щит', prompt: 'Holding a raised shield stance', classes: ['paladin', 'fighter', 'cleric'], tags: ['shield'] },
  { id: 'high_kick', label: 'Высокий удар ногой', prompt: 'Launching a high martial kick', classes: ['monk'], tags: ['monk_pose'] },
  { id: 'lotus_meditation', label: 'Медитация лотоса', prompt: 'Floating in lotus meditation', classes: ['monk', 'wizard', 'sorcerer'] },
  { id: 'summoning_orb', label: 'Призыв сферы', prompt: 'Summoning a glowing orb of power', classes: ['wizard', 'sorcerer', 'warlock'] },
  { id: 'skyward_invocation', label: 'Призыв к небу', prompt: 'Calling power down from the sky', classes: ['cleric', 'sorcerer', 'warlock', 'paladin_warlock'] },
  { id: 'back_glance', label: 'Взгляд через плечо', prompt: 'Looking back over the shoulder with tension', classes: ['rogue', 'warlock', 'bard'] },
  { id: 'ground_slam', label: 'Удар по земле', prompt: 'Slamming power into the ground', classes: ['barbarian', 'druid_barbarian', 'greatsword', 'warhammer'] },
  { id: 'running_charge', label: 'Рывок вперёд', prompt: 'Charging forward through the scene', classes: ['fighter', 'barbarian', 'paladin', 'ranger'] },
  { id: 'hidden_blade_reveal', label: 'Скрытый клинок', prompt: 'Revealing a hidden blade from the shadows', classes: ['rogue', 'bard_rogue'] },
  { id: 'sigil_trace', label: 'Рисование руны', prompt: 'Tracing a glowing sigil in the air', classes: ['wizard', 'sorcerer', 'warlock'], prefers: ['Spellblade'] },
];

export const emotions: CompatibleItem[] = [
  { id: 'calm_focus', label: 'Спокойная концентрация', prompt: 'calm focused expression' },
  { id: 'grim_resolve', label: 'Мрачная решимость', prompt: 'grim resolve' },
  { id: 'mysterious_stoicism', label: 'Загадочный стоицизм', prompt: 'mysterious stoicism' },
  { id: 'radiant_reverence', label: 'Светлое благоговение', prompt: 'radiant reverence' },
  { id: 'fierce_pride', label: 'Свирепая гордость', prompt: 'fierce pride' },
  { id: 'quiet_melancholy', label: 'Тихая меланхолия', prompt: 'quiet melancholy' },
  { id: 'playful_mischief', label: 'Игривое озорство', prompt: 'playful mischief' },
];

export const moods: CompatibleItem[] = [
  { id: 'heroic', label: 'Героический', prompt: 'heroic' },
  { id: 'mysterious', label: 'Таинственный', prompt: 'mysterious' },
  { id: 'tragic', label: 'Трагический', prompt: 'tragic' },
  { id: 'divine', label: 'Божественный', prompt: 'divine' },
  { id: 'dark_fantasy', label: 'Тёмное фэнтези', prompt: 'dark fantasy' },
  { id: 'epic', label: 'Эпический', prompt: 'epic' },
];

export const lighting: CompatibleItem[] = [
  { id: 'warm_cinematic', label: 'Тёплый кинематографичный свет', prompt: 'warm cinematic lighting' },
  { id: 'moonlight', label: 'Лунный свет', prompt: 'moonlight' },
  { id: 'high_contrast', label: 'Контрастный свет', prompt: 'high contrast lighting' },
  { id: 'golden_light', label: 'Золотой свет', prompt: 'golden light' },
  { id: 'holy_glow', label: 'Святое сияние', prompt: 'holy glow' },
  { id: 'void_glow', label: 'Сияние бездны', prompt: 'void glow' },
  { id: 'dramatic_sunset', label: 'Драматичный закат', prompt: 'dramatic sunset lighting' },
];

export const fx: CompatibleItem[] = [
  { id: 'dust_sparks', label: 'Пыль и искры', prompt: 'dust and sparks' },
  { id: 'ki_energy', label: 'Энергия ки', prompt: 'ki energy' },
  { id: 'arcane_particles', label: 'Арканные частицы', prompt: 'arcane particles' },
  { id: 'divine_rays', label: 'Божественные лучи', prompt: 'divine rays' },
  { id: 'corrupted_holy_glow', label: 'Искажённое святое сияние', prompt: 'corrupted holy glow' },
  { id: 'void_particles', label: 'Частицы бездны', prompt: 'void particles' },
  { id: 'moon_particles', label: 'Лунные частицы', prompt: 'moon particles' },
  { id: 'blade_glow', label: 'Сияние клинка', prompt: 'blade glow' },
  { id: 'leaves_roots', label: 'Листья и корни', prompt: 'leaves and roots' },
  { id: 'ashes_smoke', label: 'Пепел и дым', prompt: 'ashes and smoke' },
  { id: 'cloak_wind', label: 'Плащ и ветер', prompt: 'wind-blown cloak' },
];

export const archetypeThemes: Record<string, { emotions: string[]; moods: string[]; lighting: string[]; fx: string[] }> = {
  Knight: { emotions: ['grim_resolve', 'calm_focus'], moods: ['heroic', 'epic'], lighting: ['warm_cinematic', 'dramatic_sunset'], fx: ['dust_sparks', 'blade_glow'] },
  Spellblade: { emotions: ['calm_focus', 'mysterious_stoicism'], moods: ['heroic', 'mysterious'], lighting: ['high_contrast', 'golden_light'], fx: ['arcane_particles', 'blade_glow'] },
  'Shadow Hunter': { emotions: ['mysterious_stoicism', 'grim_resolve'], moods: ['mysterious', 'dark_fantasy'], lighting: ['moonlight', 'high_contrast'], fx: ['moon_particles', 'cloak_wind'] },
  'Rogue Assassin': { emotions: ['mysterious_stoicism', 'calm_focus'], moods: ['dark_fantasy', 'mysterious'], lighting: ['moonlight', 'high_contrast'], fx: ['cloak_wind', 'ashes_smoke'] },
  'Trickster Performer': { emotions: ['playful_mischief', 'calm_focus'], moods: ['mysterious', 'heroic'], lighting: ['warm_cinematic', 'golden_light'], fx: ['dust_sparks', 'cloak_wind'] },
  'Holy Warrior': { emotions: ['radiant_reverence', 'grim_resolve'], moods: ['divine', 'heroic'], lighting: ['holy_glow', 'golden_light'], fx: ['divine_rays', 'dust_sparks'] },
  'Fallen Zealot': { emotions: ['grim_resolve', 'quiet_melancholy'], moods: ['tragic', 'dark_fantasy'], lighting: ['void_glow', 'high_contrast'], fx: ['corrupted_holy_glow', 'ashes_smoke'] },
  'Nature Guardian': { emotions: ['calm_focus', 'quiet_melancholy'], moods: ['heroic', 'mysterious'], lighting: ['golden_light', 'dramatic_sunset'], fx: ['leaves_roots', 'moon_particles'] },
  'Arcane Mage': { emotions: ['calm_focus', 'mysterious_stoicism'], moods: ['mysterious', 'epic'], lighting: ['void_glow', 'high_contrast'], fx: ['arcane_particles', 'void_particles'] },
  'Void Prophet': { emotions: ['mysterious_stoicism', 'quiet_melancholy'], moods: ['dark_fantasy', 'tragic'], lighting: ['void_glow', 'moonlight'], fx: ['void_particles', 'ashes_smoke'] },
  'Wild Berserker': { emotions: ['fierce_pride', 'grim_resolve'], moods: ['epic', 'dark_fantasy'], lighting: ['dramatic_sunset', 'high_contrast'], fx: ['dust_sparks', 'ashes_smoke'] },
  'Fey Wanderer': { emotions: ['playful_mischief', 'quiet_melancholy'], moods: ['mysterious', 'heroic'], lighting: ['moonlight', 'golden_light'], fx: ['moon_particles', 'leaves_roots'] },
  'Dragon Vessel': { emotions: ['fierce_pride', 'calm_focus'], moods: ['epic', 'heroic'], lighting: ['golden_light', 'dramatic_sunset'], fx: ['ashes_smoke', 'arcane_particles'] },
  Occultist: { emotions: ['mysterious_stoicism', 'quiet_melancholy'], moods: ['dark_fantasy', 'mysterious'], lighting: ['void_glow', 'moonlight'], fx: ['void_particles', 'corrupted_holy_glow'] },
  'Wandering Monk': { emotions: ['calm_focus', 'quiet_melancholy'], moods: ['heroic', 'mysterious'], lighting: ['warm_cinematic', 'golden_light'], fx: ['ki_energy', 'dust_sparks'] },
  'Battle Engineer': { emotions: ['calm_focus', 'fierce_pride'], moods: ['heroic', 'epic'], lighting: ['warm_cinematic', 'high_contrast'], fx: ['dust_sparks', 'arcane_particles'] },
  'Chaos Mutant': { emotions: ['fierce_pride', 'mysterious_stoicism'], moods: ['dark_fantasy', 'epic'], lighting: ['void_glow', 'high_contrast'], fx: ['void_particles', 'ashes_smoke'] },
};
