'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';
import { generateDicebornVNext, type VNextResult } from '@/src/lib/vnext';
import { vnextAffordances, vnextFacts, vnextSemanticFacts } from '@/src/lib/vnext/facts';
import styles from './vnext-benchmark.module.css';

type ReviewValue = boolean | null;
type ReviewState = Record<string, Record<string, ReviewValue>>;

const reviewFields = [
  'silhouette_readable',
  'profession_visible',
  'class_evidence_visible',
  'action_visible',
  'gaze_target_visible',
  'tool_unique',
  'power_visibility_correct',
  'patron_leak',
  'prop_clutter',
  'stereotype_leak',
  'composition_matches',
  'overall_coherence',
];

const benchmarkCases = vnextAffordances.professions.slice(0, 24).map((profession, index) => ({
  seed: `benchmark-${profession.id}-${index}`,
  professionId: profession.id,
  classId: vnextFacts.classes[index % vnextFacts.classes.length].id,
  speciesId: vnextFacts.species[(index * 5) % vnextFacts.species.length].id,
}));

function titleCase(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fieldLabel(value: string) {
  return titleCase(value.replace(/_/g, ' '));
}

function resultId(result: VNextResult) {
  const seed = result.semanticSeed;
  return `${seed.deterministicSeed}:${seed.identity.classId}:${seed.identity.speciesId}:${seed.identity.professionId}`;
}

export default function VNextBenchmarkPage() {
  const [classFilter, setClassFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [professionFilter, setProfessionFilter] = useState('all');
  const [powerFilter, setPowerFilter] = useState('all');
  const [sceneFilter, setSceneFilter] = useState('all');
  const [reviews, setReviews] = useState<ReviewState>({});
  const [copyStatus, setCopyStatus] = useState('');

  const results = useMemo(() => benchmarkCases.map((item) => generateDicebornVNext({
    rngSeed: item.seed,
    classId: item.classId,
    speciesId: item.speciesId,
    professionId: item.professionId,
    noveltyMode: 'soft',
  })), []);

  useEffect(() => {
    const raw = window.localStorage.getItem('diceborn.vnext.imageReview');
    if (raw) setReviews(JSON.parse(raw) as ReviewState);
  }, []);

  function updateReview(id: string, field: string, value: ReviewValue) {
    const next = { ...reviews, [id]: { ...(reviews[id] || {}), [field]: value } };
    setReviews(next);
    window.localStorage.setItem('diceborn.vnext.imageReview', JSON.stringify(next));
  }

  async function copyPrompt(prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus('Prompt copied.');
    } catch {
      setCopyStatus('Copy failed; select the prompt manually.');
    }
  }

  const filtered = results.filter((result) => {
    const seed = result.semanticSeed;
    return (classFilter === 'all' || seed.identity.classId === classFilter)
      && (speciesFilter === 'all' || seed.identity.speciesId === speciesFilter)
      && (professionFilter === 'all' || seed.identity.professionId === professionFilter)
      && (powerFilter === 'all' || seed.power.visibility === powerFilter)
      && (sceneFilter === 'all' || seed.currentMoment.sceneArchetype === sceneFilter);
  });

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <p className="eyebrow">Internal QA</p>
        <h1>vNext visual benchmark</h1>
        <p>Twenty-four deterministic Semantic Core vNext cases for reviewing composition, pose, scene archetype, power visibility, and manual image QA.</p>
      </section>

      <Panel className={styles.filters} variant="standard" aria-label="Benchmark filters">
        <label>Class<select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="all">All classes</option>{vnextFacts.classes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label>Species<select value={speciesFilter} onChange={(event) => setSpeciesFilter(event.target.value)}><option value="all">All species</option>{vnextFacts.species.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label>Profession<select value={professionFilter} onChange={(event) => setProfessionFilter(event.target.value)}><option value="all">All professions</option>{vnextAffordances.professions.map((item) => <option key={item.id} value={item.id}>{titleCase(item.label)}</option>)}</select></label>
        <label>Power<select value={powerFilter} onChange={(event) => setPowerFilter(event.target.value)}><option value="all">All power modes</option>{vnextSemanticFacts.pilotScope.powerVisibilityModes.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}</select></label>
        <label>Scene<select value={sceneFilter} onChange={(event) => setSceneFilter(event.target.value)}><option value="all">All scene archetypes</option>{vnextFacts.sceneArchetypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      </Panel>
      {copyStatus ? <p className={styles.status}>{copyStatus}</p> : null}

      <section className={styles.grid} aria-label="vNext benchmark cases">
        {filtered.map((result) => {
          const seed = result.semanticSeed;
          const visual = result.visualDirection;
          const id = resultId(result);
          const review = reviews[id] || {};
          return (
            <article className={styles.card} key={id}>
              <div className={styles.cardHeader}>
                <Tag variant="accent">{fieldLabel(seed.currentMoment.sceneArchetype)}</Tag>
                <h2>{titleCase(seed.identity.profession)}</h2>
                <p>{titleCase(seed.identity.speciesId)} · {titleCase(seed.identity.classId)} · {titleCase(seed.identity.profession)}</p>
              </div>
              <dl className={styles.meta}>
                <div><dt>Contradiction</dt><dd>{seed.tension.roleContradiction}</dd></div>
                <div><dt>Current moment</dt><dd>{seed.currentMoment.currentAction}</dd></div>
                <div><dt>Silhouette</dt><dd>{visual.embodiment.silhouette}</dd></div>
                <div><dt>Posture</dt><dd>{visual.embodiment.posture}</dd></div>
                <div><dt>Gesture</dt><dd>{visual.embodiment.gesture}</dd></div>
                <div><dt>Tool</dt><dd>{visual.life.primaryTool}</dd></div>
                <div><dt>Manifestation</dt><dd>{visual.power.manifestation}</dd></div>
                <div><dt>Composition</dt><dd>{visual.artDirection.composition}</dd></div>
              </dl>
              <details className={styles.prompt}>
                <summary>Prompt</summary>
                <p>{result.prompt}</p>
              </details>
              <div className={styles.qaFlags}>{result.qa.flags.concat(result.qa.blockingErrors).map((flag) => <span key={flag}>{flag}</span>)}</div>
              <Button variant="secondary" onClick={() => copyPrompt(result.prompt)}>Copy prompt</Button>
              <details className={styles.review}>
                <summary>Image review fields</summary>
                <div className={styles.reviewGrid}>
                  {reviewFields.map((field) => (
                    <label key={field}>{fieldLabel(field)}
                      <select value={String(review[field] ?? 'unset')} onChange={(event) => updateReview(id, field, event.target.value === 'unset' ? null : event.target.value === 'true')}>
                        <option value="unset">Not reviewed</option>
                        <option value="true">Yes / pass</option>
                        <option value="false">No / fail</option>
                      </select>
                    </label>
                  ))}
                </div>
              </details>
            </article>
          );
        })}
      </section>
    </main>
  );
}
