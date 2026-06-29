import { vnextAffordances, vnextFacts, vnextSemanticFacts } from './facts';
import { generateDicebornVNext } from './generateVNext';

export function analyzeVNextCoverage(sampleSize = 500) {
  const classes = new Map<string, number>();
  const species = new Map<string, number>();
  const professions = new Map<string, number>();
  const visibility = new Map<string, number>();
  let failed = 0;
  let lockFailures = 0;
  const professionVisualChannels = new Set<string>();

  for (let index = 0; index < sampleSize; index += 1) {
    const result = generateDicebornVNext({ rngSeed: `coverage-${index}` });
    const seed = result.semanticSeed;
    classes.set(seed.identity.classId, (classes.get(seed.identity.classId) ?? 0) + 1);
    species.set(seed.identity.speciesId, (species.get(seed.identity.speciesId) ?? 0) + 1);
    professions.set(seed.identity.professionId, (professions.get(seed.identity.professionId) ?? 0) + 1);
    visibility.set(seed.power.visibility, (visibility.get(seed.power.visibility) ?? 0) + 1);
    if (!result.qa.passed) failed += 1;
    professionVisualChannels.add(`${seed.identity.professionId}:tool`);
    professionVisualChannels.add(`${seed.identity.professionId}:posture`);
    professionVisualChannels.add(`${seed.identity.professionId}:wear`);
  }

  for (const classFact of vnextFacts.classes) {
    const locked = generateDicebornVNext({ rngSeed: `lock-${classFact.id}`, classId: classFact.id });
    if (locked.semanticSeed.identity.classId !== classFact.id) lockFailures += 1;
  }

  const missingClasses = vnextFacts.classes.filter((item) => !classes.has(item.id)).map((item) => item.id);
  const missingSpecies = vnextFacts.species.filter((item) => !species.has(item.id)).map((item) => item.id);
  const missingProfessions = vnextAffordances.professions.filter((item) => !professions.has(item.id)).map((item) => item.id);
  return {
    sampleSize,
    failed,
    lockFailures,
    classDistribution: Object.fromEntries(classes),
    speciesDistribution: Object.fromEntries(species),
    professionDistribution: Object.fromEntries(professions),
    powerVisibilityDistribution: Object.fromEntries(visibility),
    missingClasses,
    missingSpecies,
    missingProfessions,
    professionVisualChannelCoverage: professionVisualChannels.size,
    expectedProfessionVisualChannelCoverage: vnextSemanticFacts.pilotScope.minimumProfessionCount * 3,
  };
}
