# DND-characters

MVP Vite + React + TypeScript app for generating D&D character seeds and concept-art prompt drafts.

## Features

- Cascading generation for class mode, classes, race, archetype, build template, visual theme, narrative motif, silhouette, armor, weapon/prop, pose, emotion, mood, light, and FX.
- Three generation modes: ordinary class, multiclass, and chaos.
- Narrative Motif and Narrative Variant layers add story details, theme variants, and prompt fragments so generated characters have a compact backstory hook.
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

The debug check compiles the generator into a temporary CommonJS folder, generates 5000 seeds, prints diversity statistics, and fails if any narrative-variant diversity or coherence rule is violated.
