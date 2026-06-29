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

## Pilot scope

Classes: Fighter, Cleric, Warlock.
Species: Human, Dwarf, Tiefling.
Professions: 20 practical professions.

## Known limitations

This is a pilot scope. QA scripts are intentionally lightweight and should be expanded before vNext replaces Legacy. The comparison page uses deterministic Legacy-style baseline text rather than replacing the production Legacy generator.

## Criteria for replacing Legacy

Before replacement, vNext needs wider class/species/profession coverage, stronger statistical QA, visual review, route-level acceptance tests, and migration of UI controls behind a feature flag.

## Migration plan

Keep vNext isolated, iterate under `/vnext`, expand QA, add opt-in UI wiring, compare against Legacy, then replace `/generate` only after acceptance criteria pass.
