import { getLegacyVNextComparisons } from '@/src/lib/vnext';
import styles from './vnext.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Legacy vs Semantic Core vNext',
  description: 'Internal Diceborn comparison between Legacy output style and Semantic Core vNext.',
};

export default function VNextComparisonPage() {
  const comparisons = getLegacyVNextComparisons();

  return (
    <main className={styles.shell} aria-labelledby="vnext-title">
      <section className={styles.hero}>
        <p className="eyebrow">Internal QA · Feature isolated</p>
        <h1 id="vnext-title" className={styles.title}>Diceborn Semantic Core vNext</h1>
        <p className={styles.lede}>
          Deterministic pilot comparison for Warlock Physician, Warlock Locksmith, Fighter Ferryman, Fighter Investigator, Cleric Undertaker, and Cleric Tutor. Legacy /generate remains unchanged.
        </p>
      </section>

      <section className={styles.caseGrid} aria-label="Legacy and Semantic Core vNext comparison cases">
        {comparisons.map((comparison, index) => {
          const seed = comparison.vnext.semanticSeed;
          const visual = comparison.vnext.visualDirection;
          return (
            <article className={styles.caseCard} key={comparison.id}>
              <header className={styles.caseHeader}>
                <span className={styles.caseNumber}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{seed.identity.classId} · {seed.identity.profession}</h2>
                  <p>{seed.identity.speciesId} in {seed.world.environment}</p>
                </div>
              </header>

              <dl className={styles.factGrid}>
                <div><dt>Class</dt><dd>{seed.identity.classId}</dd></div>
                <div><dt>Species</dt><dd>{seed.identity.speciesId}</dd></div>
                <div><dt>Profession</dt><dd>{seed.identity.profession}</dd></div>
                <div><dt>Power visibility</dt><dd>{seed.power.visibility}</dd></div>
                <div><dt>Current moment</dt><dd>{seed.currentMoment.currentAction}</dd></div>
                <div><dt>Contradiction</dt><dd>{seed.psychology.contradiction}</dd></div>
                <div><dt>Posture</dt><dd>{visual.embodiment.posture}</dd></div>
                <div><dt>Gesture</dt><dd>{visual.embodiment.gesture}</dd></div>
                <div><dt>Primary tool</dt><dd>{visual.life.primaryTool}</dd></div>
                <div><dt>Lived-in trace</dt><dd>{visual.life.livedInTrace}</dd></div>
                <div><dt>Manifestation</dt><dd>{visual.power.manifestation}</dd></div>
                <div><dt>Composition</dt><dd>{visual.artDirection.composition}</dd></div>
              </dl>

              <div className={styles.promptCompare}>
                <section aria-labelledby={`${comparison.id}-legacy`}>
                  <h3 id={`${comparison.id}-legacy`}>Legacy prompt</h3>
                  <p>{comparison.legacyPrompt}</p>
                </section>
                <section aria-labelledby={`${comparison.id}-vnext`}>
                  <h3 id={`${comparison.id}-vnext`}>vNext prompt</h3>
                  <p>{comparison.vnext.prompt}</p>
                  <details>
                    <summary>Negative prompt</summary>
                    <p>{comparison.vnext.negativePrompt}</p>
                  </details>
                </section>
              </div>

              <div className={styles.traceBox}>
                <strong>Score / trace summary</strong>
                <p>{comparison.scoreSummary}</p>
                <p>{comparison.vnext.trace.join(' · ')}</p>
              </div>

              <ul className={styles.flags} aria-label="QA flags">
                {comparison.vnext.qa.flags.map((flag) => <li key={flag}>{flag}</li>)}
                {comparison.vnext.qa.blockingErrors.map((flag) => <li className={styles.errorFlag} key={flag}>{flag}</li>)}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}
