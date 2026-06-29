import { getSemanticComparisonRows } from '@/src/lib/vnext/comparison';
import styles from './vnext.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Legacy vs Semantic Core vNext',
  description: 'Internal Diceborn comparison between the Legacy generator read and Semantic Core vNext interpretation.',
};

export default function VNextComparisonPage() {
  const rows = getSemanticComparisonRows();

  return (
    <main className={styles.shell} aria-labelledby="vnext-title">
      <section className={styles.hero}>
        <p className="eyebrow">Internal QA</p>
        <h1 id="vnext-title" className={styles.title}>Diceborn Legacy vs Semantic Core vNext</h1>
        <p className={styles.lede}>
          Six deterministic comparison cases show how the current Legacy read and the vNext semantic contract express class, species, tool, posture, moment, composition, and QA flags.
        </p>
      </section>

      <section className={styles.caseGrid} aria-label="Legacy and Semantic Core vNext comparison cases">
        {rows.map((row, index) => (
          <article className={styles.caseCard} key={row.id}>
            <header className={styles.caseHeader}>
              <span className={styles.caseNumber}>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{row.species} {row.className}</h2>
                <p>{row.profession}</p>
              </div>
            </header>

            <dl className={styles.factGrid}>
              <div><dt>Class</dt><dd>{row.className}</dd></div>
              <div><dt>Species</dt><dd>{row.species}</dd></div>
              <div><dt>Profession</dt><dd>{row.profession}</dd></div>
              <div><dt>Power visibility</dt><dd>{row.powerVisibility}</dd></div>
              <div><dt>Current moment</dt><dd>{row.currentMoment}</dd></div>
              <div><dt>Contradiction</dt><dd>{row.contradiction}</dd></div>
              <div><dt>Posture</dt><dd>{row.posture}</dd></div>
              <div><dt>Primary tool</dt><dd>{row.primaryTool}</dd></div>
              <div><dt>Composition</dt><dd>{row.composition}</dd></div>
            </dl>

            <div className={styles.promptCompare}>
              <section aria-labelledby={`${row.id}-legacy`}>
                <h3 id={`${row.id}-legacy`}>Legacy prompt</h3>
                <p>{row.legacyPrompt}</p>
              </section>
              <section aria-labelledby={`${row.id}-vnext`}>
                <h3 id={`${row.id}-vnext`}>vNext prompt</h3>
                <p>{row.vnextPrompt}</p>
              </section>
            </div>

            <ul className={styles.flags} aria-label="QA flags">
              {row.qaFlags.map((flag) => <li key={flag}>{flag}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
