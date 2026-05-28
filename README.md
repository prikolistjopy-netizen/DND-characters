# DND-characters

MVP Vite + React + TypeScript app for generating D&D character seeds and concept-art prompt drafts.

## Features

- Weighted random generation for class mode, classes, race, archetype, silhouette, armor, weapon/prop, pose, emotion, mood, light, and FX.
- Three generation modes: ordinary class, multiclass, and chaos.
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
