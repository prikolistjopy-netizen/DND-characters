import { describe, expect, it } from 'vitest';
import { generateCharacterSeed } from './generator';

function hasAnyClass(result: ReturnType<typeof generateCharacterSeed>, ids: string[]): boolean {
  return ids.includes(result.seed.primaryClass.id) || (result.seed.secondaryClass ? ids.includes(result.seed.secondaryClass.id) : false);
}

describe('generateCharacterSeed', () => {
  it('creates a complete seed and prompt', () => {
    const result = generateCharacterSeed();

    expect(result.seed.mode.id).toBeTruthy();
    expect(result.seed.primaryClass.id).toBeTruthy();
    expect(result.seed.archetype).toBeTruthy();
    expect(result.seed.race.id).toBeTruthy();
    expect(result.promptDraft).toContain('high quality fantasy character concept art');
    expect(result.trace.length).toBeGreaterThan(5);
  });

  it('does not generate known critical conflicts over many rolls', () => {
    for (let index = 0; index < 400; index += 1) {
      const result = generateCharacterSeed();
      const { seed } = result;

      expect(result.conflicts, result.seedText).toHaveLength(0);

      if (seed.weapon.id === 'tools') {
        expect(hasAnyClass(result, ['artificer', 'bard']), result.seedText).toBe(true);
        expect(hasAnyClass(result, ['paladin', 'fighter', 'monk', 'barbarian', 'ranger', 'rogue']), result.seedText).toBe(false);
      }

      if (seed.pose.id === 'high_kick') {
        expect(hasAnyClass(result, ['monk']), result.seedText).toBe(true);
        expect(hasAnyClass(result, ['druid', 'paladin', 'fighter', 'barbarian', 'cleric']), result.seedText).toBe(false);
      }

      if (hasAnyClass(result, ['wizard', 'sorcerer', 'monk'])) {
        expect(seed.armor.id, result.seedText).not.toBe('heavy_armor');
      }

      if (hasAnyClass(result, ['druid'])) {
        expect(['heavy_armor', 'medium_armor'], result.seedText).not.toContain(seed.armor.id);
      }

      if (seed.race.id === 'fairy') {
        expect(seed.armor.id, result.seedText).not.toBe('heavy_armor');
        expect(['greatsword', 'warhammer'], result.seedText).not.toContain(seed.weapon.id);
      }

      if (seed.weapon.id === 'longbow') {
        expect(seed.pose.id, result.seedText).not.toBe('raised_shield');
      }
    }
  });
});
