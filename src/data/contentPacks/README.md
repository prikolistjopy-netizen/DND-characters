# Future content pack modules

Future packs should be added as focused data modules instead of expanding `seedData.ts` directly.

Recommended shape:

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

Compatibility aliases should be resolved before raw compatibility tags are used as hard generator constraints.
