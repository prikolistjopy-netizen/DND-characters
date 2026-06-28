'use client';

import { useMemo, useState } from 'react';
import {
  generateCharacterSeed,
  type DicebornGenerationResult,
  type GenerationProfile,
  type ManualGenerationControls,
} from '@/lib/generator';
import { saveLocalCharacter } from '@/lib/storage/localCollection';
import { Accordion } from '@/components/ui/Accordion';
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder';
import { Button } from '@/components/ui/Button';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';
import styles from './generator.module.css';

type GeneratorMode = 'random' | 'custom';
type Feedback = { kind: 'empty' | 'generating' | 'result' | 'saved' | 'error'; message?: string };

const classes = [
  'artificer', 'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk',
  'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard',
] as const;

const races = [
  'human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-orc', 'tiefling',
  'dragonborn', 'aasimar', 'firbolg', 'fairy', 'satyr',
] as const;

const directions: Array<{ value: GenerationProfile | 'random'; label: string }> = [
  { value: 'random', label: 'Any direction' },
  { value: 'classic_fantasy', label: 'Classic fantasy' },
  { value: 'weird_but_good', label: 'Strange but coherent' },
  { value: 'chaos', label: 'Chaotic' },
  { value: 'balanced_gallery', label: 'Balanced' },
];

function pretty(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildTraits(result: DicebornGenerationResult): string[] {
  const seed = result.seedJson;
  return [
    seed.archetype.name,
    seed.mood.name,
    seed.narrativeMotif.label,
  ].filter(Boolean).slice(0, 3);
}

function buildStoryHook(result: DicebornGenerationResult): string {
  return result.concept.conceptLine || result.sceneMoment?.narrativeIntent || result.promptDraft;
}

export function GeneratorClient({ initialMode }: { initialMode: GeneratorMode }) {
  const [mode, setMode] = useState<GeneratorMode>(initialMode);
  const [race, setRace] = useState('random');
  const [characterClass, setCharacterClass] = useState('random');
  const [direction, setDirection] = useState<GenerationProfile | 'random'>('random');
  const [presentation, setPresentation] = useState<ManualGenerationControls['genderPresentation']>('random');
  const [ageBand, setAgeBand] = useState<ManualGenerationControls['ageBand']>('random');
  const [stylePreset, setStylePreset] = useState<ManualGenerationControls['stylePreset']>('random');
  const [result, setResult] = useState<DicebornGenerationResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'empty' });
  const [copyLabel, setCopyLabel] = useState('Copy Prompt');

  const traits = useMemo(() => result ? buildTraits(result) : [], [result]);

  function buildControls(forceRandom = false): ManualGenerationControls {
    if (forceRandom) return {
      class: 'random',
      race: 'random',
      genderPresentation: 'random',
      ageBand: 'random',
      stylePreset: 'random',
      generationProfile: 'natural_random',
    };

    return {
      class: characterClass as ManualGenerationControls['class'],
      race,
      genderPresentation: presentation,
      ageBand,
      stylePreset,
      generationProfile: direction === 'random' ? (mode === 'random' ? 'natural_random' : 'manual_custom') : direction,
      promptCompilerMode: 'artist_brief_prompt',
      allowRare: mode === 'random',
      allowChaos: direction === 'chaos',
    };
  }

  function generate(forceRandom = false) {
    setFeedback({ kind: 'generating' });
    setCopyLabel('Copy Prompt');
    try {
      const generated = generateCharacterSeed({
        useSmartPool: true,
        diversityMode: 'soft',
        compositionMode: 'full_body_character_art',
        environmentDetailLevel: 'balanced',
        manualControls: buildControls(forceRandom),
      });
      setResult(generated.dicebornResult);
      setFeedback({ kind: 'result' });
    } catch (error) {
      console.error(error);
      setFeedback({ kind: 'error' });
    }
  }

  async function copyPrompt() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.imagePrompt);
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy Prompt'), 1800);
    } catch {
      setFeedback({ kind: 'error', message: 'Could not copy the prompt.' });
    }
  }

  function saveCharacter() {
    if (!result) return;
    saveLocalCharacter(result);
    setFeedback({ kind: 'saved' });
  }

  return (
    <div className={styles.workspace}>
      <Panel className={styles.controls} aria-labelledby="create-controls-title">
        <div className={styles.panelHeading}>
          <span>1</span>
          <h2 id="create-controls-title">Choose your path</h2>
        </div>

        <div className={styles.modeGrid} role="tablist" aria-label="Generation mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'random'}
            className={mode === 'random' ? styles.modeActive : styles.modeCard}
            onClick={() => setMode('random')}
          >
            <strong>Random</strong>
            <span>Fate decides</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'custom'}
            className={mode === 'custom' ? styles.modeActive : styles.modeCard}
            onClick={() => setMode('custom')}
          >
            <strong>Custom</strong>
            <span>You guide</span>
          </button>
        </div>

        <div className={styles.panelHeading}>
          <span>2</span>
          <h2>Set your parameters</h2>
        </div>

        <div className={styles.fieldList}>
          <label>
            <span>Race</span>
            <select value={race} onChange={(event) => setRace(event.target.value)}>
              <option value="random">Any race</option>
              {races.map((item) => <option value={item} key={item}>{pretty(item)}</option>)}
            </select>
          </label>
          <label>
            <span>Class</span>
            <select value={characterClass} onChange={(event) => setCharacterClass(event.target.value)}>
              <option value="random">Any class</option>
              {classes.map((item) => <option value={item} key={item}>{pretty(item)}</option>)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select value={direction} onChange={(event) => setDirection(event.target.value as GenerationProfile | 'random')}>
              {directions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
          </label>
        </div>

        <Accordion title="More options" helper="Presentation, age and visual style">
          <div className={styles.fieldList}>
            <label>
              <span>Presentation</span>
              <select value={presentation} onChange={(event) => setPresentation(event.target.value as ManualGenerationControls['genderPresentation'])}>
                <option value="random">Any presentation</option>
                <option value="masculine">Masculine</option>
                <option value="feminine">Feminine</option>
                <option value="androgynous">Androgynous</option>
              </select>
            </label>
            <label>
              <span>Age</span>
              <select value={ageBand} onChange={(event) => setAgeBand(event.target.value as ManualGenerationControls['ageBand'])}>
                <option value="random">Any age</option>
                <option value="young_adult">Young adult</option>
                <option value="adult">Adult</option>
                <option value="middle_aged">Middle aged</option>
                <option value="elder">Elder</option>
              </select>
            </label>
            <label>
              <span>Visual style</span>
              <select value={stylePreset} onChange={(event) => setStylePreset(event.target.value as ManualGenerationControls['stylePreset'])}>
                <option value="random">Diceborn default</option>
                <option value="cinematic_painted_fantasy">Cinematic painted fantasy</option>
                <option value="painted_character_study_clean">Painted character study</option>
                <option value="clean_concept_art">Clean concept art</option>
                <option value="realistic_dark_fantasy">Realistic dark fantasy</option>
              </select>
            </label>
          </div>
        </Accordion>

        <p className={styles.helper}>Leave everything open for a fully random result, or guide the roll with your preferences.</p>
        <Button className={styles.primaryAction} loading={feedback.kind === 'generating'} onClick={() => generate(false)}>
          {mode === 'random' ? 'Roll Character' : 'Generate Character'}
        </Button>
        <Button variant="ghost" className={styles.surpriseAction} onClick={() => generate(true)}>
          Surprise Me
        </Button>
      </Panel>

      <Panel variant="result" className={styles.resultPanel} aria-labelledby="result-title">
        <header className={styles.resultHeader}>
          <div>
            <p className="eyebrow">Result</p>
            <h2 id="result-title">{result ? 'Your character is ready' : 'Your character begins here'}</h2>
          </div>
          {result ? <Tag variant="status">Seeded</Tag> : null}
        </header>

        {!result ? (
          <div className={styles.emptyResult}>
            <ArtworkPlaceholder state={feedback.kind === 'generating' ? 'generating' : 'empty'} />
            <FeedbackState kind={feedback.kind === 'generating' ? 'generating' : feedback.kind === 'error' ? 'error' : 'empty'} description={feedback.message} />
          </div>
        ) : (
          <div className={styles.resultBody}>
            <ArtworkPlaceholder state="empty" title={result.character.title} description="Artwork generation coming later" />
            <div className={styles.resultContent}>
              <div>
                <h3>{result.character.title}</h3>
                <p className={styles.identity}>{pretty(result.character.race)} · {pretty(result.character.primaryClass)}</p>
                <p className={styles.archetype}>{result.character.archetype}</p>
              </div>

              {traits.length ? (
                <div>
                  <h4>Traits</h4>
                  <div className={styles.tags}>{traits.map((trait) => <Tag key={trait}>{trait}</Tag>)}</div>
                </div>
              ) : null}

              <div>
                <h4>Story Hook</h4>
                <p>{buildStoryHook(result)}</p>
              </div>

              <div>
                <h4>Prompt Preview</h4>
                <p className={styles.promptPreview}>{result.imagePrompt}</p>
                <details className={styles.fullPrompt}>
                  <summary>View full prompt</summary>
                  <p>{result.imagePrompt}</p>
                </details>
              </div>

              <div className={styles.seedRow}>
                <span><strong>Seed</strong><small>{result.id.slice(0, 12)}</small></span>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.id)} aria-label="Copy seed">Copy</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.actions} aria-label="Character actions">
          <Button variant="primary" disabled={!result} onClick={saveCharacter}>Save Character</Button>
          <Button variant="secondary" disabled={!result} onClick={copyPrompt}>{copyLabel}</Button>
          <Button variant="ghost" disabled={!result} onClick={() => generate(false)}>Roll Again</Button>
          <Button variant="ghost" disabled title="Sharing will be added after stable character links">Share Later</Button>
        </div>
        {result && feedback.kind === 'saved' ? <FeedbackState kind="saved" /> : null}
        {result && feedback.kind === 'error' ? <FeedbackState kind="error" description={feedback.message} /> : null}
      </Panel>

      <Panel className={styles.refine} aria-labelledby="refine-title">
        <div className={styles.panelHeading}>
          <span>3</span>
          <h2 id="refine-title">Refine your character</h2>
        </div>
        <p className={styles.helper}>Optional refinements use generator-supported presentation and visual controls.</p>
        <Accordion title="Presentation" helper="Gender presentation and age">
          <p>Use the controls in More Options to preserve the same choices on the next roll.</p>
        </Accordion>
        <Accordion title="Visual Style" helper="Rendering direction">
          <p>The selected visual style is applied to the next generated prompt.</p>
        </Accordion>
        <Accordion title="Generation Direction" helper="Classic, balanced, strange or chaotic">
          <p>Direction changes the generator profile without rewriting the generated prompt in the UI.</p>
        </Accordion>
        <Button variant="secondary" disabled={!result} onClick={() => generate(false)}>Regenerate with Refinements</Button>
        <div className={styles.tip}>
          <strong>Tip</strong>
          <p>You can refine or re-roll until the character feels right.</p>
        </div>
      </Panel>
    </div>
  );
}
