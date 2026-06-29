import { generateCharacterSeed, resetSmartCandidatePoolMemory } from '../../lib/generator';
import { generateDicebornVNext } from '../../lib/vnext/generateVNext';

type ComparisonCase = {
  label: string;
  seed: string;
  legacyClass: string;
  classId: 'class.warlock' | 'class.fighter' | 'class.cleric';
  legacyRace: string;
  speciesId: 'species.human' | 'species.dwarf' | 'species.tiefling';
  professionId: string;
};

const cases: ComparisonCase[] = [
  { label: 'Warlock Physician', seed: 'compare-warlock-physician', legacyClass: 'warlock', classId: 'class.warlock', legacyRace: 'human', speciesId: 'species.human', professionId: 'profession.physician' },
  { label: 'Warlock Locksmith', seed: 'compare-warlock-locksmith', legacyClass: 'warlock', classId: 'class.warlock', legacyRace: 'dwarf', speciesId: 'species.dwarf', professionId: 'profession.locksmith' },
  { label: 'Fighter Ferryman', seed: 'compare-fighter-ferryman', legacyClass: 'fighter', classId: 'class.fighter', legacyRace: 'human', speciesId: 'species.human', professionId: 'profession.ferryman' },
  { label: 'Fighter Investigator', seed: 'compare-fighter-investigator', legacyClass: 'fighter', classId: 'class.fighter', legacyRace: 'tiefling', speciesId: 'species.tiefling', professionId: 'profession.investigator' },
  { label: 'Cleric Undertaker', seed: 'compare-cleric-undertaker', legacyClass: 'cleric', classId: 'class.cleric', legacyRace: 'dwarf', speciesId: 'species.dwarf', professionId: 'profession.undertaker' },
  { label: 'Cleric Tutor', seed: 'compare-cleric-tutor', legacyClass: 'cleric', classId: 'class.cleric', legacyRace: 'tiefling', speciesId: 'species.tiefling', professionId: 'profession.tutor' },
];

function legacyPromptFor(item: ComparisonCase): string {
  try {
    const result = generateCharacterSeed({
      useSmartPool: true,
      diversityMode: 'soft',
      compositionMode: 'full_body_character_art',
      environmentDetailLevel: 'balanced',
      manualControls: {
        class: item.legacyClass,
        race: item.legacyRace,
        generationProfile: 'natural_random',
        genderPresentation: 'random',
        ageBand: 'random',
        stylePreset: 'cinematic_painted_fantasy',
        promptCompilerMode: 'artist_brief_prompt',
      },
      rngSeed: item.seed,
    } as never) as unknown as { dicebornResult?: { imagePrompt?: string; character?: { title?: string } } };
    return result.dicebornResult?.imagePrompt ?? 'Legacy prompt was not produced.';
  } catch (error) {
    return `Legacy generation failed: ${error instanceof Error ? error.message : String(error)}`;
  }
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: '1px solid #2d3340', borderRadius: 10, padding: '10px 12px', background: '#151922' }}>
      <div style={{ color: '#8e99aa', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#f4f6f8', fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function VNextComparisonPage() {
  resetSmartCandidatePoolMemory?.();

  const comparisons = cases.map((item) => {
    const legacyPrompt = legacyPromptFor(item);
    const vnext = generateDicebornVNext({
      rngSeed: item.seed,
      classId: item.classId,
      speciesId: item.speciesId,
      professionId: item.professionId,
      novelty: 'balanced',
      beamWidth: 18,
      branchFactor: 5,
      prompt: { style: 'cinematic-painted-fantasy', maxWords: 280 },
    });
    return { item, legacyPrompt, vnext };
  });

  return (
    <main style={{ minHeight: '100vh', background: '#0c0f14', color: '#f4f6f8', padding: '40px 24px 80px', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto' }}>
        <header style={{ marginBottom: 32 }}>
          <div style={{ color: '#9aa7ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Internal review · vNext</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 56px)', lineHeight: 1.05, margin: '10px 0 14px' }}>Legacy / Semantic comparison</h1>
          <p style={{ maxWidth: 900, color: '#aeb7c5', fontSize: 17, lineHeight: 1.6, margin: 0 }}>
            The same class, species, and deterministic seed are shown side by side. vNext additionally uses profession, semantic situation, visual direction, and controlled power visibility.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 28 }}>
          <Metric label="Comparison cases" value={comparisons.length} />
          <Metric label="vNext schema" value="diceborn-vnext-0.1" />
          <Metric label="Primary anchors" value="maximum 2" />
          <Metric label="Legacy modified" value="No" />
        </section>

        <div style={{ display: 'grid', gap: 28 }}>
          {comparisons.map(({ item, legacyPrompt, vnext }) => {
            const semantic = vnext.semanticSeed;
            const visual = vnext.visualDirection!;
            return (
              <article key={item.seed} style={{ border: '1px solid #29303b', borderRadius: 18, overflow: 'hidden', background: '#11151c' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #29303b', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 750 }}>{item.label}</div>
                    <div style={{ marginTop: 5, color: '#929dad', fontSize: 13 }}>Seed: {item.seed}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    {[semantic.identity.species.label, semantic.identity.class.label, semantic.identity.profession.label, visual.power.visibility].map((tag) => (
                      <span key={tag} style={{ border: '1px solid #3a4350', background: '#181d26', borderRadius: 999, padding: '6px 10px', fontSize: 12, color: '#cbd2dc' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
                  <section style={{ padding: 20, borderRight: '1px solid #29303b' }}>
                    <div style={{ color: '#8e99aa', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 12 }}>Legacy prompt</div>
                    <p style={{ color: '#c1c8d2', lineHeight: 1.65, fontSize: 14, whiteSpace: 'pre-wrap', margin: 0 }}>{legacyPrompt}</p>
                  </section>

                  <section style={{ padding: 20 }}>
                    <div style={{ color: '#9aa7ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 12 }}>vNext prompt</div>
                    <p style={{ color: '#edf0f5', lineHeight: 1.65, fontSize: 14, whiteSpace: 'pre-wrap', margin: 0 }}>{vnext.surfacePrompt}</p>
                  </section>
                </div>

                <div style={{ borderTop: '1px solid #29303b', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, background: '#0f1319' }}>
                  <Metric label="Current moment" value={`${semantic.currentMoment.action.label} · ${semantic.currentMoment.goal.label}`} />
                  <Metric label="Contradiction" value={semantic.psychology.contradiction.label} />
                  <Metric label="Visual posture" value={visual.embodiment.posture} />
                  <Metric label="Primary tool" value={visual.life.primaryTool} />
                  <Metric label="Composition" value={visual.artDirection.composition} />
                  <Metric label="QA flags" value={semantic.qaFlags.length ? semantic.qaFlags.join(', ') : 'none'} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
