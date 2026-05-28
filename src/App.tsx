import { useMemo, useState } from 'react';
import { generateCharacterSeed, GenerationResult } from './lib/generator';

type CopyState = 'idle' | 'seed' | 'prompt';

const seedRows: Array<[string, (result: GenerationResult) => string]> = [
  ['Mode', (result) => result.seed.mode.label],
  ['Class / Multiclass', (result) => result.seed.className],
  ['Primary Class', (result) => result.seed.primaryClass.label],
  ['Secondary Class', (result) => result.seed.secondaryClass?.label ?? '—'],
  ['Archetype', (result) => result.seed.archetype],
  ['Race', (result) => result.seed.race.label],
  ['Silhouette', (result) => result.seed.silhouette.label],
  ['Armor', (result) => result.seed.armor.label],
  ['Weapon', (result) => result.seed.weapon.label],
  ['Pose', (result) => result.seed.pose.label],
  ['Emotion', (result) => result.seed.emotion.label],
  ['Mood', (result) => result.seed.mood.label],
  ['Lighting', (result) => result.seed.lighting.label],
  ['FX', (result) => result.seed.fx.label],
];

function App() {
  const [result, setResult] = useState<GenerationResult>(() => generateCharacterSeed());
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const conflictLabel = useMemo(
    () => (result.conflicts.length ? `${result.conflicts.length} conflict(s) detected` : 'No conflicts detected'),
    [result.conflicts.length],
  );

  const generate = () => {
    setResult(generateCharacterSeed());
    setCopyState('idle');
  };

  const copyText = async (kind: Exclude<CopyState, 'idle'>, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopyState(kind);
    window.setTimeout(() => setCopyState('idle'), 1400);
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">MVP fantasy prompt helper</p>
          <h1>D&D Character Seed Generator</h1>
          <p className="subtitle">
            Нажмите одну кнопку, чтобы получить совместимое зерно персонажа и готовый английский prompt draft для fantasy art.
          </p>
        </div>
        <button className="generate-button" onClick={generate} type="button">
          Generate Character Seed
        </button>
      </section>

      <section className="content-grid">
        <article className="card seed-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Seed Output</p>
              <h2>Character Parameters</h2>
            </div>
            <button className="copy-button" onClick={() => copyText('seed', result.seedText)} type="button">
              {copyState === 'seed' ? 'Copied!' : 'Copy Seed'}
            </button>
          </div>

          <dl className="seed-list">
            {seedRows.map(([label, getValue]) => (
              <div className="seed-row" key={label}>
                <dt>{label}</dt>
                <dd>{getValue(result)}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="card prompt-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Prompt Draft</p>
              <h2>English Art Prompt</h2>
            </div>
            <button className="copy-button" onClick={() => copyText('prompt', result.promptDraft)} type="button">
              {copyState === 'prompt' ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
          <p className="prompt-text">{result.promptDraft}</p>
        </article>
      </section>

      <section className="card debug-card">
        <div className="card-header compact">
          <div>
            <p className="eyebrow">Debug / Generation Trace</p>
            <h2>{conflictLabel}</h2>
          </div>
        </div>
        <ol className="trace-list">
          {result.trace.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default App;
