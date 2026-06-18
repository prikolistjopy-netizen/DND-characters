# DND-characters

Vite + React + TypeScript app for generating D&D character seeds and image-generation prompts for character concept art.

The generator is data-driven: it builds a structured visual seed first, validates it, then composes a readable Prompt Draft and a final Image Prompt optimized for image generation.

## Architecture overview

The project preserves the existing cascade while making the content easier to maintain:

```text
Class
→ Build Template
→ Visual Theme
→ Narrative Motif
→ Race Appearance
→ Culture
→ Equipment / Details
→ Prompt Composer
→ Image Prompt
→ Full Generation Output
```

Key runtime files:

- `src/lib/generator.ts` orchestrates generation, validation, prompt composition, and the final copy-ready output.
- `src/lib/stageContracts.ts` documents the stage contracts used by the pipeline and debug trace.
- `src/data/seedData.ts` remains the compatibility data barrel for existing imports.
- `src/data/index.ts` is the new data entrypoint for future modules.

## Data module overview

The current data split is intentionally conservative so generation behavior stays stable. `seedData.ts` remains the canonical compatibility source, while focused modules expose high-growth areas for future maintenance:

- `src/data/buildTemplates.ts`
- `src/data/visualThemes.ts`
- `src/data/narrativeMotifs.ts`
- `src/data/promptStyles.ts`
- `src/data/validationRules.ts`
- `src/data/contentPacks/README.md`

Future content packs should follow a small, reviewable shape:

- `id`
- `label`
- `targetVisualTheme`
- `themeVariants`
- `silhouettes`
- `armor`
- `weapons`
- `details`
- `sceneProps`
- `antiRepeatNotes`
- `compatibilityAliases`

Unknown compatibility tags should be mapped through aliases when possible; otherwise they should remain notes/debug metadata instead of becoming hard compatibility rules.

## Generation pipeline overview

The generator trace now mirrors these stage boundaries:

1. `selectModeAndClass`
2. `selectRaceAndAppearance`
3. `selectArchetype`
4. `selectBuildTemplate`
5. `selectVisualTheme`
6. `selectNarrativeMotif`
7. `selectEquipmentAndPose`
8. `selectMoodLightFx`
9. `validateAndRepairSeed`
10. `composePromptDraft`
11. `composeImagePrompt`
12. `composeFullGenerationText`

This keeps the current implementation lightweight while making future refactors safer.

## UI workflow

1. Click **Generate Character Seed**.
2. Use **Full Generation Output** as the main result block.
3. Click **Copy Full Generation** to copy the seed and final Image Prompt together.
4. Use **Copy Image Prompt** when you only need the image-generation prompt.
5. Use **Copy Seed** or **Copy Prompt Draft** for targeted debugging or writing.
6. The Debug / Generation Trace remains available as a secondary diagnostics block.

`Full Generation Output` uses this copy format:

```text
=== D&D CHARACTER SEED ===
[seed output]

=== IMAGE PROMPT ===
[image prompt]
```

It does not include the debug trace by default.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data validation

```bash
npm run validate-data
```

The data validator checks critical pools for missing ids, duplicate ids, missing references, invalid compatibility references, empty required arrays, invalid size categories, invalid enchantment intensities, and forbidden prompt phrases.

## Debug validation

```bash
npm run debug-check
```

The debug check compiles the generator into a temporary CommonJS folder, generates 5000 seeds, prints generation-quality statistics, and fails if validation, prompt-quality, full-generation-output, multiclass, race-appearance, clutter, or visual-library constraints regress.

## Identity analysis

```bash
npm run identity-analysis
```

The identity analysis compares baseline weighted generation with smart candidate-pool selection across 10,000 baseline and 10,000 smart-pool seeds, including entropy, diversity, similarity guard, appearance, prompt quality, full-generation-output, and curated multiclass reports.
