# Diceborn Semantic Core vNext Pilot

Semantic Core vNext is an isolated pilot generator. It does not replace the Legacy `/generate` flow and does not modify `src/lib/generator.ts`.

## Architecture

Pipeline:

1. Input / controls (`VNextInput`)
2. Candidate generation from pilot facts
3. Hard constraints in `ruleEngine.ts`
4. Soft scoring and seeded selection in `incrementalResolver.ts`
5. `SemanticSeed`
6. `SituationGraph`
7. `VisualDirection`
8. Prompt compiler
9. QA report
10. Internal comparison route `/vnext`

## Semantic model

`SemanticSeed` separates meaning from art direction. It stores identity, psychology, profession-shaped life details, current moment, power relationship, world context, visual intent, selected fact IDs, score trace, applied rules, rejected candidates, locks, and QA flags.

## Deterministic behavior

`generateDicebornVNext(input)` uses a local seeded RNG. The same `rngSeed` plus the same controls produces the same result. No mutable global memory is used.

## Rule engine

Rules support hard `requires` and `excludes` plus soft scoring rule types. `requires` is implemented as: when the condition matches, the required target must be present. Hard failures are reported before QA success.

## Profession influence

Professions are first-class facts in `src/data/vnext/affordances.json`. Each profession affects tools, body habits, handling, wear, responsibilities, and current scene. The Visual Director uses those channels for posture, gesture, lived-in trace, primary tool, and scene.

## Power visibility

The pilot uses normalized visibility modes: `none`, `latent`, `behavioral`, `bodily`, `object`, `reflected`, `shadow`, `environmental`, `symbolic`, `relational`, `social`, `partial`, and `full_apparition`. Visible patrons are not default; full apparition is rare and penalized.

## Visual Director

`visualDirector.ts` converts `SemanticSeed + SituationGraph` into one coherent visual decision: anchors, embodiment, life/tool handling, power manifestation, scene, art direction, palette roles, focal order, and negative constraints.

## Prompt Compiler

`promptCompiler.ts` compiles `VisualDirection`, not raw random facts. It returns `prompt`, `negativePrompt`, `wordCount`, `lintWarnings`, and `compilerTrace`. The prompt avoids internal IDs, unresolved alternatives, duplicate props, patron leaks, belt clutter, and all-over noise.

## QA scripts

- `npm run validate-vnext`
- `npm run semantic-analysis`
- `npm run semantic-rule-comparison`
- `npm run semantic-incremental-analysis`
- `npm run semantic-situation-analysis`
- `npm run visual-director-analysis`
- `npm run prompt-compiler-analysis`
- `npm run semantic-legacy-comparison`
- `npm run validate-vnext-all`
- `npm run validate-vnext-page`

## Route

Open `/vnext` to see six deterministic comparison cases:

- Warlock Physician
- Warlock Locksmith
- Fighter Ferryman
- Fighter Investigator
- Cleric Undertaker
- Cleric Tutor

## Expanded Alpha scope

Classes: Fighter, Cleric, Warlock, Rogue, Ranger, Paladin, Wizard, Druid, Bard, Monk, Barbarian, Sorcerer, and Artificer.
Species: Human, Dwarf, Tiefling, Elf, Half-Elf, Halfling, Half-Orc, Gnome, Dragonborn, Aasimar, Firbolg, and Satyr.
Professions: 24 practical professions, each carrying tools, body habits, wear traces, responsibilities, scenes, materials, and tension hooks.

## Known limitations

The Alpha vNext library is now broad enough to drive `/generate`, but it is still intentionally text-only: no backend, account system, gallery sync, or image generation is part of this layer. QA scripts are stronger than the pilot scripts, but visual review is still required before replacing every downstream Legacy-only workflow. The comparison page remains an internal diagnostic route.

## Criteria for replacing remaining Legacy-only code paths

Before removing internal fallback code, vNext needs route-level acceptance tests in the production environment, larger statistical QA, and manual visual review across expanded class/species/profession matrices.

## Migration plan

Use Semantic Core vNext as the primary `/generate` path, keep Legacy core files available as internal fallback/reference, continue expanding QA, and migrate collection/detail screens only after generated result contracts stabilize.
