import type { ReactNode } from 'react';
import { buildLegacyVNextComparisonReport } from '@/src/lib/vnext/legacyComparison';

export const dynamic = 'force-dynamic';

const cardStyle = {
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 24,
  background: 'rgba(255,255,255,0.06)',
  padding: 24,
} as const;

const labelStyle = {
  color: 'rgba(255,255,255,0.62)',
  fontSize: 12,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
} as const;

function Metric({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <strong style={{ fontSize: 28 }}>{value}{suffix}</strong>
    </div>
  );
}

function TextBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.72)' }}>{title}</h3>
      <div style={{ margin: 0, lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', fontSize: 14 }}>{children}</div>
    </section>
  );
}

export default function VNextLabPage() {
  const report = buildLegacyVNextComparisonReport();

  return (
    <main style={{ minHeight: '100vh', background: '#111018', color: 'white', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gap: 28 }}>
        <header style={{ display: 'grid', gap: 14 }}>
          <p style={labelStyle}>Internal review lab</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px, 6vw, 76px)', letterSpacing: '-0.06em' }}>Diceborn Semantic Core vNext</h1>
          <p style={{ maxWidth: 780, color: 'rgba(255,255,255,0.7)', fontSize: 18, lineHeight: 1.6 }}>
            Side-by-side review surface for the frozen legacy generator and the new Semantic Seed → Visual Director → Prompt Compiler pipeline.
            This page is intentionally deterministic enough for QA and expressive enough for visual review.
          </p>
        </header>

        <section style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          <Metric label="Cases" value={report.summary.caseCount} suffix="" />
          <Metric label="Semantic complete" value={report.summary.averageSemanticCompleteness} />
          <Metric label="Visual complete" value={report.summary.averageVisualCompleteness} />
          <Metric label="Prompt ready" value={report.summary.averagePromptReadiness} />
        </section>

        {report.summary.blockers.length ? (
          <section style={{ ...cardStyle, borderColor: 'rgba(255,180,120,0.42)' }}>
            <h2 style={{ marginTop: 0 }}>Review notes</h2>
            <ul style={{ marginBottom: 0, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7 }}>
              {report.summary.blockers.slice(0, 12).map((blocker, index) => <li key={`${blocker}-${index}`}>{blocker}</li>)}
            </ul>
          </section>
        ) : null}

        <section style={{ display: 'grid', gap: 22 }}>
          {report.cases.map((item) => {
            const seed = item.vnext.semanticSeed;
            const visual = item.vnext.visualDirection;
            return (
              <article key={item.id} style={cardStyle}>
                <div style={{ display: 'grid', gap: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <p style={labelStyle}>{item.label}</p>
                      <h2 style={{ margin: '6px 0 0', fontSize: 30 }}>{seed.identity.species.label} {seed.identity.class.label}</h2>
                      <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.64)' }}>{seed.identity.profession.label} · {seed.identity.ageBand.label}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 18 }}>
                      <Metric label="Semantic" value={item.assessment.semanticCompleteness} />
                      <Metric label="Visual" value={item.assessment.visualCompleteness} />
                      <Metric label="Prompt" value={item.assessment.promptReadiness} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
                    <TextBlock title="Legacy prompt">
                      <p style={{ margin: 0 }}>{item.legacy.imagePrompt}</p>
                    </TextBlock>
                    <TextBlock title="vNext prompt">
                      <p style={{ margin: 0 }}>{item.vnext.surfacePrompt}</p>
                    </TextBlock>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                    <TextBlock title="Semantic seed">
                      <p style={{ margin: 0 }}><strong>Contradiction:</strong> {seed.psychology.contradiction.label}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Goal:</strong> {seed.currentMoment.goal.label}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Obstacle:</strong> {seed.currentMoment.obstacle.label}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Power:</strong> {seed.power.source.label}, {seed.power.control.label}, {seed.power.visibility.label}</p>
                    </TextBlock>
                    <TextBlock title="Visual direction">
                      <p style={{ margin: 0 }}><strong>Silhouette:</strong> {visual?.readability.silhouetteFamily}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Pose:</strong> {visual?.embodiment.posture}; {visual?.embodiment.gesture}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Materials:</strong> {visual?.life.materials.join(', ')}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Scene:</strong> {visual?.scene.environment}</p>
                    </TextBlock>
                    <TextBlock title="Prompt diagnostics">
                      <p style={{ margin: 0 }}><strong>Words:</strong> {item.promptDiagnostics.wordCount}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Grammar:</strong> {item.promptDiagnostics.grammarWarnings.length || 'clear'}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Alternatives:</strong> {item.promptDiagnostics.unresolvedAlternatives.length || 'clear'}</p>
                      <p style={{ margin: '6px 0 0' }}><strong>Notes:</strong> {item.assessment.notes.join(' · ')}</p>
                    </TextBlock>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
