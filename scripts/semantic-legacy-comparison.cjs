const { copyFileSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { execFileSync: run } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.semantic-legacy-comparison-build');
const sampleSize = 300;

rmSync(outDir, { recursive: true, force: true });
run(
  'tsc',
  [
    '--ignoreConfig',
    '--outDir', outDir,
    '--module', 'commonjs',
    '--target', 'ES2020',
    '--moduleResolution', 'node10',
    '--resolveJsonModule',
    '--ignoreDeprecations', '6.0',
    '--esModuleInterop',
    '--skipLibCheck',
    '--lib', 'ES2020,DOM',
    'src/data/seedData.ts',
    'src/lib/generator.ts',
    'src/lib/vnext/contracts.ts',
    'src/lib/vnext/resolver.ts',
    'src/lib/vnext/ruleEngine.ts',
    'src/lib/vnext/resolverWithRules.ts',
    'src/lib/vnext/resolverControlled.ts',
    'src/lib/vnext/semanticCard.ts',
  ],
  { cwd: root, stdio: 'inherit' },
);
writeFileSync(path.join(outDir, 'package.json'), JSON.stringify({ type: 'commonjs' }));
mkdirSync(path.join(outDir, 'data', 'vnext'), { recursive: true });
for (const file of ['facts.json', 'semantic-facts.json', 'rules.json']) {
  copyFileSync(path.join(root, 'src', 'data', 'vnext', file), path.join(outDir, 'data', 'vnext', file));
}

const { generateCharacterSeed, resetSmartCandidatePoolMemory } = require(path.join(outDir, 'lib', 'generator.js'));
const { generateSemanticSeedVNextWithRules, createSemanticSignature } = require(path.join(outDir, 'lib', 'vnext', 'resolverWithRules.js'));
const { buildSemanticCharacterCard } = require(path.join(outDir, 'lib', 'vnext', 'semanticCard.js'));

const classes = [
  { legacy: 'warlock', vnext: 'class.warlock' },
  { legacy: 'fighter', vnext: 'class.fighter' },
  { legacy: 'cleric', vnext: 'class.cleric' },
];
const species = [
  { legacy: 'human', vnext: 'species.human' },
  { legacy: 'dwarf', vnext: 'species.dwarf' },
  { legacy: 'tiefling', vnext: 'species.tiefling' },
];

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function legacySkeleton(result) {
  const character = result.dicebornResult?.character || {};
  const concept = result.dicebornResult?.concept || {};
  const seed = result.dicebornResult?.seedJson || {};
  return [
    character.race,
    character.primaryClass,
    character.archetype,
    seed.sceneMoment?.action || seed.pose?.name || '',
    seed.magicVisualLanguage?.manifestation || seed.effect?.name || '',
  ].filter(Boolean).join('|');
}

function legacySummary(result) {
  const diceborn = result.dicebornResult;
  return {
    title: diceborn?.character?.title,
    identity: [diceborn?.character?.race, diceborn?.character?.primaryClass, diceborn?.character?.archetype].filter(Boolean).join(' · '),
    conceptLine: diceborn?.concept?.conceptLine || diceborn?.sceneMoment?.narrativeIntent || '',
    promptPreview: (diceborn?.imagePrompt || '').slice(0, 280),
  };
}

resetSmartCandidatePoolMemory?.();
const legacySignatures = new Set();
const vnextSignatures = new Set();
const legacyArchetypes = new Map();
const vnextProfessions = new Map();
const vnextVisibility = new Map();
const pairs = [];
const history = [];
const failures = [];

for (let index = 0; index < sampleSize; index += 1) {
  const classPair = classes[index % classes.length];
  const speciesPair = species[Math.floor(index / classes.length) % species.length];
  const seed = `legacy-vnext-${index}`;

  let legacy;
  try {
    legacy = generateCharacterSeed({
      useSmartPool: true,
      diversityMode: 'soft',
      compositionMode: 'full_body_character_art',
      environmentDetailLevel: 'balanced',
      manualControls: {
        class: classPair.legacy,
        race: speciesPair.legacy,
        generationProfile: 'natural_random',
        genderPresentation: 'random',
        ageBand: 'random',
        stylePreset: 'cinematic_painted_fantasy',
        promptCompilerMode: 'artist_brief_prompt',
      },
      rngSeed: seed,
    });
  } catch (error) {
    failures.push(`Legacy generation failed at ${index}: ${error.message}`);
    continue;
  }

  const vnext = generateSemanticSeedVNextWithRules({
    rngSeed: seed,
    classId: classPair.vnext,
    speciesId: speciesPair.vnext,
    novelty: 'balanced',
    rerankPoolSize: 10,
    repetitionHistory: history.slice(-80),
  });
  const signature = createSemanticSignature(vnext);
  history.push(signature);

  legacySignatures.add(legacySkeleton(legacy));
  vnextSignatures.add(signature);
  increment(legacyArchetypes, legacy.dicebornResult?.character?.archetype || 'unknown');
  increment(vnextProfessions, vnext.identity.profession.id);
  increment(vnextVisibility, `${vnext.identity.class.id}:${vnext.power.visibility.id}`);

  if (pairs.length < 20) {
    pairs.push({
      seed,
      legacy: legacySummary(legacy),
      vnext: {
        id: vnext.id,
        score: vnext.scores.total,
        card: buildSemanticCharacterCard(vnext),
        visibility: vnext.power.visibility.id,
        qaFlags: vnext.qaFlags,
      },
    });
  }
}

const report = {
  sampleSize,
  completedPairs: sampleSize - failures.length,
  legacy: {
    uniqueSkeletons: legacySignatures.size,
    uniqueSkeletonRate: legacySignatures.size / Math.max(1, sampleSize - failures.length),
    topArchetypes: [...legacyArchetypes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15),
  },
  vnext: {
    uniqueSemanticSignatures: vnextSignatures.size,
    uniqueSemanticSignatureRate: vnextSignatures.size / Math.max(1, sampleSize - failures.length),
    uniqueProfessions: vnextProfessions.size,
    topProfessions: [...vnextProfessions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    visibilityByClass: Object.fromEntries([...vnextVisibility.entries()].sort()),
  },
  pairs,
  failures,
};

console.log(JSON.stringify(report, null, 2));
console.log(`\nDiceborn legacy/vNext comparison: ${failures.length} failure(s).`);
if (failures.length > 0) process.exitCode = 1;
