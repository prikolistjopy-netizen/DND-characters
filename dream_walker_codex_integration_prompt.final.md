# Codex Integration Prompt — Dream Walker Content Pack v1, reviewed

Task: integrate the reviewed Dream Walker content pack as a data-only expansion for the existing D&D Character Seed Generator.

Use these files:
- `dream_walker_content_pack_v1.reviewed.json`
- `dream_walker_alias_maps.reviewed.json`
- `dream_walker_reviewed_integration_notes.md`

Context:
The generator already supports race appearance identity, clutter control, composition mode, recent similarity guard, curated multiclass, theme variants, silhouettes, armor/clothing, weapon/tool, weapon/tool language, equipment finish, equipment enchantment, poses, mood, light, FX, visual motifs, character-bound visual details, scene props, race appearance suggestions, and anti-repetition notes.

Main goal:
Improve the under-activated `dream_walker` theme with a large visual content pack while preserving existing system stability.

Important constraints:
- Data-only expansion unless a tiny adapter is required.
- Do not add new classes.
- Do not add new races.
- Do not add new build templates from raw source tags.
- Use `compatibleBuildTemplates_mapped` where present.
- Use `compatibleThemes_mapped` / `forbiddenThemes_mapped` where present.
- Use `compatiblePillars_mapped` where present.
- Keep raw tags only as notes/debug metadata.
- Do not weaken validation.

Integration steps:
1. Load / merge Theme Variants into the `dream_walker` variant pool.
2. Load Silhouettes with `dream_walker` compatibility.
3. Load Armor / Clothing as Dream Walker-compatible clothing/armor options.
4. Load Weapon / Tool options with strict `weaponTags`.
5. Load Weapon / Tool Language options with strict `baseWeaponTags`.
6. Load Equipment Finish options with mapped theme/pillar compatibility.
7. Load Equipment Enchantment options with strict intensity and weapon-tag compatibility.
8. Load Poses with weapon/silhouette compatibility where the current generator can support it.
9. Load Mood, Light, FX, and Visual Motifs into the existing pools.
10. Load Character-bound Visual Details with slot metadata preserved.
11. Load Scene Props but keep them under existing environmentDetailLevel caps.
12. Load Race Appearance Suggestions as theme-aware appearance scoring hints, not as new race profiles.
13. Load Anti-Repetition Notes as cooldown/penalty hints for iconic Dream Walker elements.

Compatibility handling:
- If a raw compatibility tag is unknown, do not create a new system category.
- Check `dream_walker_alias_maps.reviewed.json` first.
- If still unknown, keep it only in notes and exclude it from hard compatibility.

Validation targets after implementation:
- `npm run build` passes.
- `npm run debug-check` passes.
- `npm run identity-analysis` passes.
- conflict rate = 0%.
- mismatch counts = 0.
- companion activation remains 8–12%.
- legendary companion <= 1.5%.
- plain armor / weapon fallback should not worsen.
- recent visual core duplicate rate remains 0%.
- excessive clutter prompts remain < 5%.
- average scene props remains <= 1.2 in balanced mode.
- character-bound details average remains >= 4.
- no readable text appears in prompt guidance.
- Dream Walker detail diversity improves.

Output after implementation:
1. Create commit.
2. Show changed files.
3. Show short diff.
4. Show validation stats.
5. Show Dream Walker activation / usage stats.
6. Show top used Dream Walker variants, details, weapons, silhouettes, FX, and scene props.
7. Show 20 Dream Walker seed outputs.
8. Show 10 Dream Walker prompts with low clutter and strong character-bound details.
9. Show rejected/remapped compatibility tags.
10. Show any remaining concerns.

Do not make this a new architecture pass. This is content integration and stabilization only.
