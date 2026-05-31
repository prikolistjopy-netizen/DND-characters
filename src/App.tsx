import { useMemo, useState } from 'react';
import { generateCharacterSeed, type GenerationResult } from './lib/generator';

function App() {
  const initialSeed = useMemo(() => generateCharacterSeed(), []);
  const [generation, setGeneration] = useState<GenerationResult>(initialSeed);
  const [copyStatus, setCopyStatus] = useState('Ready to generate.');

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied to clipboard.`);
    } catch {
      setCopyStatus(`Could not copy ${label.toLowerCase()}; select the text manually.`);
    }
  }

  function handleGenerate() {
    setGeneration(generateCharacterSeed());
    setCopyStatus('Generated a fresh seed.');
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Weighted random D&D concept builder</p>
        <h1>D&amp;D Character Seed Generator</h1>
        <p className="hero-copy">
          Generate a compact character seed with class mode, race, gear, pose, mood, lighting, and
          automatic conflict checks for D&amp;D-inspired concept art prompts.
        </p>
        <button className="primary-button" onClick={handleGenerate} type="button">
          Generate Character Seed
        </button>
      </section>

      <section className="content-grid" aria-live="polite">
        <article className="card seed-card">
          <div className="card-header">
            <h2>Seed Output</h2>
            <button type="button" onClick={() => copyToClipboard(generation.seedOutput, 'Seed')}>
              Copy Seed
            </button>
          </div>
          <pre>{generation.seedOutput}</pre>
        </article>

        <article className="card prompt-card image-prompt-card">
          <div className="card-header">
            <h2>Image Prompt</h2>
            <button type="button" onClick={() => copyToClipboard(generation.imagePrompt, 'Image Prompt')}>
              Copy Image Prompt
            </button>
          </div>
          <p>{generation.imagePrompt}</p>
        </article>

        <article className="card prompt-card draft-prompt-card">
          <div className="card-header">
            <h2>Prompt Draft</h2>
            <button type="button" onClick={() => copyToClipboard(generation.promptDraft, 'Prompt Draft')}>
              Copy Prompt Draft
            </button>
          </div>
          <p>{generation.promptDraft}</p>
        </article>

        <article className="card trace-card">
          <div className="card-header">
            <h2>Debug / Generation Trace</h2>
            <span>{copyStatus}</span>
          </div>
          <ol>
            {generation.trace.map((traceLine, index) => (
              <li key={`${traceLine}-${index}`}>{traceLine}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}

export default App;
