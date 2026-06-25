# Diceborn

**Every Roll Begins a Story**

Diceborn is a cinematic fantasy character generator foundation. The generator core is feature-frozen for the Alpha web phase: future UI work should consume the public generator result contract instead of changing generation weights, prompt compiler behavior, or content data.

Deployment configuration refreshed for Next.js on Vercel.

## Architecture

- `src/lib/generator.ts` — frozen Diceborn generator core, public types, serialization helpers, and prompt output contract.
- `src/data/*` — canonical generator data and small re-export modules used by QA scripts.
- `lib/generator/index.ts` — web adapter boundary that re-exports the generator core for the Next.js app.
- `lib/storage/*` — browser-only storage placeholders for later local collection work.
- `app/*` — Next.js App Router public site foundation.
- `components/*` — brand, layout, and UI primitives for the Alpha web shell.
- `scripts/*` — generator validation, debug QA, and identity/diversity analysis scripts.

## Routes

- `/` — landing shell with hero, Choose Your Path, examples, and final CTA.
- `/generate` — generator shell with Quick Roll, Shape Your Character, and result canvas placeholders.
- `/character/[id]` — character detail shell for a serializable Diceborn result.
- `/collection` — local collection shell with empty state and filter placeholders.

## Developer Commands

```bash
npm run dev
npm run build
npm run type-check
npm run validate-data
npm run debug-check
npm run identity-analysis
```

## Generator Safety Rules

Do not change generator quality in web-foundation patches. Avoid modifying:

- generation weights;
- prompt compiler language;
- race/class plausibility behavior;
- `CharacterConcept`, `CharacterIdentityProfile`, `CharacterPerformanceDirection`, `SceneMoment`, or `MagicVisualLanguage` semantics;
- `DicebornGenerationResult` compatibility without a migration.

## Alpha Scope

This foundation intentionally does **not** include authentication, backend services, cloud storage, public gallery, API routes, or image-generation API integration. Those will be separate product phases.
