import { useMemo, useState } from 'react';
import { generateCharacterSeed, type GenerationResult } from './lib/generator';

function App() {
  const initialSeed = useMemo(() => generateCharacterSeed(), []);
  const [generation, setGeneration] = useState<GenerationResult>(initialSeed);
  const [copyStatus, setCopyStatus] = useState('Ready to generate.');

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(label === 'Full generation' ? 'Full generation copied' : `${label} copied to clipboard.`);
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

        <article className="card full-generation-card">
          <div className="card-header">
            <div>
              <h2>Full Generation Output</h2>
              <p className="prompt-hint">Copy this if you want to paste both the seed and the final image prompt into an image model or another chat.</p>
            </div>
            <button type="button" onClick={() => copyToClipboard(generation.fullGenerationText, 'Full generation')}>
              Copy Full Generation
            </button>
          </div>
          <pre>{generation.fullGenerationText}</pre>
        </article>

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
          <p className="prompt-hint">Use Image Prompt for image generation. Prompt Draft is for reading the seed.</p>
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
