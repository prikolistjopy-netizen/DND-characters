import { useMemo, useState } from 'react';
import {
  generateCharacterSeed,
  type ApparentAgeBand,
  type CharacterSeed,
  type GenderPresentation,
  type GenerationProfile,
  type GenerationOptions,
  type GenerationResult,
  type ManualGenerationControls,
  type PromptCompilerMode,
  type StylePreset,
} from './lib/generator';

type ControlState = {
  useCustom: boolean;
  class: ManualGenerationControls['class'] | 'random';
  race: ManualGenerationControls['race'] | 'random';
  genderPresentation: GenderPresentation | 'random';
  ageBand: ApparentAgeBand | 'random';
  bodyType: string | 'random';
  stylePreset: StylePreset;
  generationProfile: GenerationProfile;
  promptCompilerMode: PromptCompilerMode;
  allowChaos: boolean;
};

const classOptions: Array<CharacterSeed['primaryClass']> = ['fighter', 'barbarian', 'paladin', 'cleric', 'wizard', 'sorcerer', 'warlock', 'bard', 'rogue', 'ranger', 'druid', 'monk', 'artificer'];
const raceOptions: Array<CharacterSeed['race']['name']> = ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-orc', 'tiefling', 'dragonborn', 'aasimar', 'satyr', 'fairy', 'firbolg'];
const bodyOptions = ['lean agile', 'compact sturdy', 'broad powerful', 'wiry', 'graceful tall', 'soft-robed', 'athletic balanced', 'heavy armored', 'small nimble', 'tiny aerial'];
const styleOptions: Array<{ id: StylePreset; label: string }> = [
  { id: 'cinematic_painted_fantasy', label: 'Cinematic Painted Fantasy' },
  { id: 'painted_character_study_clean', label: 'Painted Character Study Clean' },
  { id: 'clean_concept_art', label: 'Clean Concept Art' },
  { id: 'legacy_heroic_rpg', label: 'Legacy Heroic RPG' },
];
const profileOptions: Array<{ id: GenerationProfile; label: string }> = [
  { id: 'classic_fantasy', label: 'Classic Fantasy' },
  { id: 'balanced_gallery', label: 'Balanced Gallery' },
  { id: 'weird_but_good', label: 'Weird but Good' },
  { id: 'chaos', label: 'Chaos' },
  { id: 'manual_custom', label: 'Manual Custom' },
];

const defaultControls: ControlState = {
  useCustom: false,
  class: 'random',
  race: 'random',
  genderPresentation: 'random',
  ageBand: 'random',
  bodyType: 'random',
  stylePreset: 'cinematic_painted_fantasy',
  generationProfile: 'classic_fantasy',
  promptCompilerMode: 'artist_brief_prompt',
  allowChaos: false,
};

function controlsToOptions(controls: ControlState): GenerationOptions {
  const manualControls: ManualGenerationControls = {
    class: controls.class,
    race: controls.race,
    genderPresentation: controls.genderPresentation,
    ageBand: controls.ageBand,
    bodyType: controls.bodyType,
    stylePreset: controls.stylePreset,
    generationProfile: controls.allowChaos ? 'chaos' : controls.generationProfile,
    promptCompilerMode: controls.promptCompilerMode,
    allowChaos: controls.allowChaos,
  };
  return {
    generationProfile: manualControls.generationProfile,
    stylePreset: controls.stylePreset,
    promptCompilerMode: controls.promptCompilerMode,
    manualControls,
  };
}

function characterTitle(seed: CharacterSeed) {
  return `${seed.race.name} ${seed.primaryClass}: ${seed.characterConcept.classArchetype}`;
}

function App() {
  const initialSeed = useMemo(() => generateCharacterSeed({ generationProfile: 'classic_fantasy', stylePreset: 'cinematic_painted_fantasy' }), []);
  const [generation, setGeneration] = useState<GenerationResult>(initialSeed);
  const [controls, setControls] = useState<ControlState>(defaultControls);
  const [customOpen, setCustomOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Ready to roll.');

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied.`);
    } catch {
      setCopyStatus(`Could not copy ${label.toLowerCase()}; select the text manually.`);
    }
  }

  function generateWithOptions(options: GenerationOptions, status: string) {
    const next = generateCharacterSeed(options);
    setGeneration(next);
    setCopyStatus(status);
  }

  function handleRandom() {
    generateWithOptions({ generationProfile: 'classic_fantasy', stylePreset: controls.stylePreset }, 'Random Diceborn character created.');
  }

  function handleCustom() {
    generateWithOptions(controlsToOptions({ ...controls, useCustom: true, generationProfile: 'manual_custom' }), 'Custom character generated with locked settings.');
  }

  function handleGallery() {
    generateWithOptions({ generationProfile: 'balanced_gallery', stylePreset: controls.stylePreset }, 'Gallery-mode character generated.');
  }

  function handleChaos() {
    generateWithOptions({ generationProfile: 'chaos', stylePreset: controls.stylePreset, manualControls: { generationProfile: 'chaos', allowChaos: true, stylePreset: controls.stylePreset } }, 'Chaos-mode character generated.');
  }

  function handleRerollLook() {
    const options = controlsToOptions(controls);
    generateWithOptions({
      ...options,
      manualControls: {
        ...(options.manualControls ?? {}),
        race: seed.race.name,
        class: seed.primaryClass,
      },
    }, 'Look rerolled around locked class/race.');
  }

  function updateControl<K extends keyof ControlState>(key: K, value: ControlState[K]) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  const seed = generation.seed;

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Premium fantasy character director</p>
        <h1>Diceborn</h1>
        <p className="slogan">Every Roll Begins a Story</p>
        <p className="hero-copy">Generate visual fantasy characters for D&amp;D, concept art, and storytelling.</p>
        <div className="action-row">
          <button className="primary-button" onClick={handleRandom} type="button">Create Random Character</button>
          <button onClick={() => setCustomOpen((open) => !open)} type="button">Build Custom Character</button>
          <button onClick={() => document.getElementById('style-lab')?.scrollIntoView({ behavior: 'smooth' })} type="button">Choose Style</button>
          <button onClick={handleGallery} type="button">Gallery Mode</button>
          <button onClick={handleChaos} type="button">Chaos Mode</button>
        </div>
      </section>

      {customOpen && (
        <section className="control-panel" aria-label="Build Custom Character controls">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Build Custom Character</p>
              <h2>Lock the fantasy you want to test</h2>
            </div>
            <button className="primary-button" onClick={handleCustom} type="button">Generate with Settings</button>
          </div>
          <div className="control-grid">
            <label>Lock Class<select value={controls.class} onChange={(event) => updateControl('class', event.target.value as ControlState['class'])}><option value="random">Random class</option>{classOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label>Lock Race<select value={controls.race} onChange={(event) => updateControl('race', event.target.value as ControlState['race'])}><option value="random">Random race</option>{raceOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label>Lock Gender<select value={controls.genderPresentation} onChange={(event) => updateControl('genderPresentation', event.target.value as ControlState['genderPresentation'])}><option value="random">Random gender</option><option value="masculine">masculine</option><option value="feminine">feminine</option><option value="androgynous">androgynous</option></select></label>
            <label>Age<select value={controls.ageBand} onChange={(event) => updateControl('ageBand', event.target.value as ControlState['ageBand'])}><option value="random">Random age</option><option value="young_adult">young adult</option><option value="adult">adult</option><option value="middle_aged">middle-aged</option><option value="elder">elder</option></select></label>
            <label>Body<select value={controls.bodyType} onChange={(event) => updateControl('bodyType', event.target.value)}><option value="random">Random body</option>{bodyOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label>Lock Style<select value={controls.stylePreset} onChange={(event) => updateControl('stylePreset', event.target.value as StylePreset)}>{styleOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            <label>Profile<select value={controls.generationProfile} onChange={(event) => updateControl('generationProfile', event.target.value as GenerationProfile)}>{profileOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            <label>Prompt Mode<select value={controls.promptCompilerMode} onChange={(event) => updateControl('promptCompilerMode', event.target.value as PromptCompilerMode)}><option value="artist_brief_prompt">Artist brief prompt</option><option value="structured_seed_prompt">Legacy structured prompt</option><option value="debug_verbose_prompt">Debug verbose prompt</option></select></label>
          </div>
          <label className="toggle-line"><input type="checkbox" checked={controls.allowChaos} onChange={(event) => updateControl('allowChaos', event.target.checked)} /> Allow Chaos Mode combinations</label>
        </section>
      )}

      <section id="style-lab" className="style-lab">
        <div>
          <p className="eyebrow">Style Lab</p>
          <h2>Choose Style</h2>
        </div>
        <div className="style-options">
          {styleOptions.map((style) => (
            <button className={controls.stylePreset === style.id ? 'selected-style' : ''} key={style.id} onClick={() => updateControl('stylePreset', style.id)} type="button">
              {style.label}{style.id === 'cinematic_painted_fantasy' ? ' — Default' : ''}
            </button>
          ))}
        </div>
      </section>

      <section className="result-hero" aria-live="polite">
        <div>
          <p className="eyebrow">Character Concept</p>
          <h2>{characterTitle(seed)}</h2>
          <p>{seed.characterConcept.conceptLine} · {seed.characterConcept.styleIntent}</p>
        </div>
        <div className="result-actions">
          <button type="button" onClick={handleRerollLook}>Reroll Look</button>
          <button type="button" onClick={handleRerollLook}>Reroll Pose</button>
          <button type="button" onClick={handleRerollLook}>Reroll Background</button>
          <button type="button" onClick={() => copyToClipboard(generation.imagePrompt, 'Prompt')}>Copy Prompt</button>
          <button type="button" onClick={() => copyToClipboard(generation.seedOutput, 'Seed')}>Copy Seed</button>
        </div>
      </section>

      <section className="content-grid">
        <article className="card prompt-card image-prompt-card">
          <div className="card-header"><h2>Short Artist Prompt</h2><button type="button" onClick={() => copyToClipboard(generation.imagePrompt, 'Image prompt')}>Copy Prompt</button></div>
          <p>{generation.imagePrompt}</p>
        </article>

        <article className="card seed-card">
          <div className="card-header"><h2>Character Snapshot</h2><span>{copyStatus}</span></div>
          <p className="snapshot"><strong>{seed.primaryClass}</strong> · {seed.race.name} · {seed.characterPresentation.genderPresentation} {seed.characterPresentation.apparentAgeBand.replace('_', ' ')} · {seed.backdropLane.id} · {seed.compositionLane.id}</p>
        </article>

        <details className="card full-generation-card">
          <summary>Full seed and generation output</summary>
          <pre>{generation.fullGenerationText}</pre>
        </details>

        <details className="card draft-prompt-card">
          <summary>Prompt Draft</summary>
          <p>{generation.promptDraft}</p>
        </details>

        <details className="card trace-card">
          <summary>Debug / Generation Trace</summary>
          <ol>{generation.trace.map((traceLine, index) => <li key={`${traceLine}-${index}`}>{traceLine}</li>)}</ol>
        </details>
      </section>
    </main>
  );
}

export default App;
