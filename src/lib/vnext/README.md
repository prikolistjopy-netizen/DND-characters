# Diceborn Semantic Core vNext

This directory introduces the semantic-first architecture alongside the frozen legacy generator.

## Goals

- Construct a coherent character before visual prompt writing.
- Treat class, species, profession, psychology, social role, power relationship, material life, and current moment as interacting factors.
- Preserve deterministic seeded generation.
- Keep every decision traceable and testable.
- Reduce stereotype concentration and repeated visual motifs.
- Separate SemanticSeed, VisualDirection, and SurfacePrompt.

## Safety boundary

The legacy generator remains unchanged and is the current production baseline. vNext must stay behind an explicit feature flag until comparison QA is complete.

## Planned pipeline

1. Load ontology and versioned fact libraries.
2. Create a seeded pool of partial semantic candidates.
3. Expand candidates in a fixed generation order.
4. Apply hard constraints.
5. Score soft influences, coherence, novelty, stereotype risk, and repetition.
6. Keep a diverse beam rather than a single maximum candidate.
7. Select one candidate with a seeded weighted choice.
8. Produce SemanticSeedVNext with a decision trace.
9. Resolve VisualDirection from the semantic seed.
10. Compile the final prompt without making new semantic decisions.

## Pilot scope

Classes:
- warlock
- fighter
- cleric

Species:
- human
- dwarf
- tiefling

Initial profession library:
- physician
- archivist
- ferryman
- brewer
- locksmith
- shepherd
- court translator
- undertaker
- cartographer
- stage performer
- guard captain
- relic appraiser
- cook
- tutor
- tax collector
- lighthouse keeper
- messenger
- animal handler
- mason
- investigator

## Research Curator Agent

The future curator agent must never write directly into production libraries.

Required flow:

1. Discover candidate facts from approved sources.
2. Save source URL, title, author, publication date, license, and quotation-free summary.
3. Normalize the candidate into a proposed LibraryFact, InfluenceRule, or ConstraintRule.
4. Run schema validation, duplicate detection, conflict checks, stereotype-risk checks, and coverage analysis.
5. Place accepted candidates in a review queue.
6. Open a GitHub pull request containing only reviewed proposals and provenance.
7. Require human approval before merge.

The agent may propose weights and tags, but those fields are hypotheses until reviewed. It must not silently convert cultural claims, genre conventions, or disputed historical material into universal facts.

## Non-goals for the first patch

- No production prompt changes.
- No UI changes.
- No LLM-generated semantic truth.
- No automatic fact merges.
- No MAP-Elites runtime archive yet.
- No removal of legacy data.
