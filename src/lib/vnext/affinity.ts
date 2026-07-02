import type { PilotClassId, ProfessionAffinity } from './contracts';

export const CLASS_PROFESSION_AFFINITY: Record<PilotClassId, Record<ProfessionAffinity, string[]>> = {
  cleric: { high: ['physician', 'midwife', 'shrine_keeper'], medium: ['tutor', 'undertaker', 'battlefield_medic', 'herbalist'], low: ['mason', 'miner', 'cartographer', 'surveyor'], rare_contrast: ['smuggler', 'executioner', 'locksmith'] },
  bard: { high: ['courtier', 'tutor', 'tavern_keeper'], medium: ['messenger', 'physician', 'archivist', 'scribe'], low: ['miner', 'mason', 'trapper'], rare_contrast: ['executioner', 'gravedigger'] },
  fighter: { high: ['caravan_guard', 'battlefield_medic'], medium: ['ferryman', 'mason', 'courier', 'hunter', 'miner'], low: ['archivist', 'scribe', 'tutor'], rare_contrast: ['shrine_keeper', 'courtier'] },
  barbarian: { high: ['miner', 'hunter', 'trapper'], medium: ['mason', 'battlefield_medic', 'ferryman', 'beast_handler'], low: ['scribe', 'archivist', 'tutor'], rare_contrast: ['courtier', 'jeweler'] },
  rogue: { high: ['locksmith', 'investigator', 'courier', 'smuggler'], medium: ['messenger', 'relic_broker', 'tavern_keeper'], low: ['physician', 'mason', 'shepherd'], rare_contrast: ['shrine_keeper', 'paladin'] },
  wizard: { high: ['archivist', 'scribe', 'cartographer', 'tutor'], medium: ['investigator', 'relic_broker', 'jeweler'], low: ['trapper', 'ferryman', 'miner'], rare_contrast: ['executioner', 'beast_handler'] },
  druid: { high: ['herbalist', 'shepherd'], medium: ['physician', 'undertaker', 'trapper', 'beast_handler'], low: ['courtier', 'locksmith', 'scribe'], rare_contrast: ['executioner', 'relic_broker'] },
  monk: { high: ['tutor', 'shrine_keeper'], medium: ['messenger', 'trapper', 'physician'], low: ['lamplighter', 'courtier', 'tavern_keeper'], rare_contrast: ['smuggler', 'executioner'] },
  paladin: { high: ['shrine_keeper', 'caravan_guard', 'battlefield_medic'], medium: ['courtier', 'physician', 'undertaker', 'tutor'], low: ['locksmith', 'miner', 'lamplighter'], rare_contrast: ['smuggler', 'executioner'] },
  warlock: { high: ['investigator', 'relic_broker', 'courtier'], medium: ['physician', 'locksmith', 'archivist', 'tutor'], low: ['lamplighter', 'ferryman', 'mason'], rare_contrast: ['shrine_keeper', 'midwife'] },
  ranger: { high: ['hunter', 'trapper', 'surveyor'], medium: ['courier', 'cartographer', 'ferryman', 'shepherd'], low: ['scribe', 'courtier', 'tavern_keeper'], rare_contrast: ['executioner', 'jeweler'] },
  sorcerer: { high: ['relic_broker', 'messenger'], medium: ['courtier', 'tavern_keeper', 'physician', 'jeweler'], low: ['miner', 'mason', 'shepherd'], rare_contrast: ['undertaker', 'shrine_keeper'] },
  artificer: { high: ['locksmith', 'mason', 'jeweler'], medium: ['lamplighter', 'surveyor', 'cartographer', 'relic_broker'], low: ['tutor', 'shepherd', 'ferryman'], rare_contrast: ['shrine_keeper', 'undertaker'] },
};

export function professionAffinityFor(classId: PilotClassId, professionId: string): ProfessionAffinity {
  const matrix = CLASS_PROFESSION_AFFINITY[classId];
  for (const level of ['high', 'medium', 'low', 'rare_contrast'] as ProfessionAffinity[]) {
    if (matrix[level].includes(professionId)) return level;
  }
  return 'low';
}

export function affinityWeight(affinity: ProfessionAffinity) {
  if (affinity === 'high') return 14;
  if (affinity === 'medium') return 7;
  if (affinity === 'low') return 2;
  return 0.7;
}
