# DND-characters

MVP Vite + React + TypeScript app for generating D&D character seeds and concept-art prompt drafts.

## Features

- Cascading visual-library generation for class mode, classes, race, archetype, fantasy pillar, build template, visual theme, theme variant, narrative motif, silhouette profile, visual motif, armor language, weapon/tool language, companion, pose, visual details, mood, light, and FX.
- Three generation modes: ordinary class, multiclass, and chaos.
- Class Anchor, Cultural Origin, Narrative Motif, Narrative Variant, Companion, and Detail Budget layers preserve class readability while adding visible concept-art details, controlled culture flavor, and prompt fragments.
- Conflict checks with a visible debug trace:
  - tools only appear for artificer or bard characters;
  - monk-only poses only appear for monk characters;
  - heavy armor is rejected for wizard, sorcerer, or monk;
  - metal armor is rejected for druid;
  - oversized/heavy weapons are rejected for fairy, small, or fey characters;
  - longbow + shield combinations are rejected.
- Copy buttons for both the generated seed and prompt draft.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Debug validation

```bash
npm run debug-check
```

The debug check compiles the generator into a temporary CommonJS folder, generates 5000 seeds, prints class identity/theme/culture plus visual-library statistics (silhouettes, motifs, companions, armor/weapon languages, detail pools), and fails if any hierarchical identity, diversity, or coherence rule is violated.

## Identity analysis

```bash
npm run identity-analysis
```

The identity analysis compares baseline weighted generation with smart candidate-pool selection across 10,000 baseline and 10,000 smart-pool seeds, including theme entropy, silhouette entropy, companion activation, conflict rate, duplicate combination rate, scholar trigger analysis, and visual-library distribution reports.
