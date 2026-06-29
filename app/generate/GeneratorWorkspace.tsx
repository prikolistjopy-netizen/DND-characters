'use client';

import { useMemo, useState } from 'react';
import {
  generateCharacterSeed,
  serializeGenerationResult,
  type ApparentAgeBand,
  type CharacterSeed,
  type GenderPresentation,
  type GenerationOptions,
  type GenerationProfile,
  type GenerationResult,
  type ManualGenerationControls,
  type PromptCompilerMode,
  type StylePreset,
} from '@/lib/generator';
import { LOCAL_COLLECTION_KEY, type LocalCollectionRecord } from '@/lib/storage/localCollection';
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder';
import { Button } from '@/components/ui/Button';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';
import styles from './generator.module.css';

type Mode = 'random' | 'custom';

type ControlState = {
  mode: Mode;
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
  mode: 'random',
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
    generationProfile: controls.allowChaos ? 'chaos' : controls.mode === 'custom' ? 'manual_custom' : controls.generationProfile,
    promptCompilerMode: controls.promptCompilerMode,
    allowChaos: controls.allowChaos,
  };

  if (controls.mode === 'random') {
    return {
      generationProfile: controls.generationProfile,
      stylePreset: controls.stylePreset,
      promptCompilerMode: controls.promptCompilerMode,
    };
  }

  return {
    generationProfile: manualControls.generationProfile,
    stylePreset: controls.stylePreset,
    promptCompilerMode: controls.promptCompilerMode,
    manualControls,
  };
}

function storyHook(result: GenerationResult) {
  return result.dicebornResult.concept?.conceptLine
    || result.dicebornResult.sceneMoment?.narrativeIntent
    || result.seed.sceneMoment?.narrativeIntent
    || `${result.dicebornResult.character.race} ${result.dicebornResult.character.primaryClass} shaped as ${result.dicebornResult.character.archetype}.`;
}

function shortPrompt(prompt: string) {
  const words = prompt.split(/\s+/).filter(Boolean);
  return words.length > 58 ? `${words.slice(0, 58).join(' ')}…` : prompt;
}

function titleFor(result: GenerationResult) {
  return result.dicebornResult.character.title;
}

function saveToCollection(result: GenerationResult) {
  const record: LocalCollectionRecord = {
    id: result.dicebornResult.id,
    version: result.dicebornResult.version,
    generatedAt: result.dicebornResult.generatedAt,
    character: result.dicebornResult.character,
    imagePrompt: result.dicebornResult.imagePrompt,
  };
  const raw = window.localStorage.getItem(LOCAL_COLLECTION_KEY);
  const existing = raw ? JSON.parse(raw) as LocalCollectionRecord[] : [];
  const next = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 48);
  window.localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(next));
  window.localStorage.setItem(`diceborn.character.${record.id}`, serializeGenerationResult(result.dicebornResult));
}

export function GeneratorWorkspace() {
  const initial = useMemo(() => generateCharacterSeed({ generationProfile: 'classic_fantasy', stylePreset: 'cinematic_painted_fantasy' }), []);
  const [controls, setControls] = useState<ControlState>(defaultControls);
  const [generation, setGeneration] = useState<GenerationResult>(initial);
  const [status, setStatus] = useState('Your character is ready.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateControl<K extends keyof ControlState>(key: K, value: ControlState[K]) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function roll(nextControls = controls, message = 'Your character is ready.') {
    setIsGenerating(true);
    setSaved(false);
    window.setTimeout(() => {
      const next = generateCharacterSeed(controlsToOptions(nextControls));
      setGeneration(next);
      setStatus(message);
      setIsGenerating(false);
    }, 280);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generation.imagePrompt);
      setStatus('Prompt copied.');
    } catch {
      setStatus('Could not copy prompt. Select the prompt manually.');
    }
  }

  function handleSave() {
    saveToCollection(generation);
    setSaved(true);
    setStatus('Saved to your collection.');
  }

  const character = generation.dicebornResult.character;
  const hook = storyHook(generation);
  const promptPreview = shortPrompt(generation.imagePrompt);

  return (
    <section className={styles.shell} aria-labelledby="generate-title">
      <header className={styles.header}>
        <div>
          <p className="eyebrow">Generator</p>
          <h1 id="generate-title" className={styles.pageTitle}>Create a Diceborn character</h1>
        </div>
        <p className={styles.headerText}>Roll freely or shape the result. The generator core stays untouched; this screen only directs the Alpha experience.</p>
      </header>

      <div className={styles.workspace}>
        <Panel variant="standard" className={styles.createPanel} aria-labelledby="create-title">
          <div className={styles.panelHeading}>
            <Tag variant="accent">Create</Tag>
            <h2 id="create-title">Choose your path</h2>
            <p>Start fast, or lock a few essentials before the roll.</p>
          </div>

          <div className={styles.modeGrid} role="radiogroup" aria-label="Generation mode">
            <button className={controls.mode === 'random' ? styles.modeActive : styles.modeCard} type="button" role="radio" aria-checked={controls.mode === 'random'} onClick={() => updateControl('mode', 'random')}>Random<span>Fast cinematic roll</span></button>
            <button className={controls.mode === 'custom' ? styles.modeActive : styles.modeCard} type="button" role="radio" aria-checked={controls.mode === 'custom'} onClick={() => updateControl('mode', 'custom')}>Custom<span>Use selected locks</span></button>
          </div>

          <div className={styles.controlStack}>
            <label>Race<select value={controls.race} onChange={(event) => updateControl('race', event.target.value as ControlState['race'])}><option value="random">Random race</option>{raceOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label>Class<select value={controls.class} onChange={(event) => updateControl('class', event.target.value as ControlState['class'])}><option value="random">Random class</option>{classOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
            <label>Direction<select value={controls.generationProfile} onChange={(event) => updateControl('generationProfile', event.target.value as GenerationProfile)}>{profileOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
          </div>

          <details className={styles.moreOptions}>
            <summary>More Options</summary>
            <div className={styles.optionGrid}>
              <label>Gender<select value={controls.genderPresentation} onChange={(event) => updateControl('genderPresentation', event.target.value as ControlState['genderPresentation'])}><option value="random">Random</option><option value="masculine">Masculine</option><option value="feminine">Feminine</option><option value="androgynous">Androgynous</option></select></label>
              <label>Age<select value={controls.ageBand} onChange={(event) => updateControl('ageBand', event.target.value as ControlState['ageBand'])}><option value="random">Random</option><option value="young_adult">Young adult</option><option value="adult">Adult</option><option value="middle_aged">Middle-aged</option><option value="elder">Elder</option></select></label>
              <label>Body<select value={controls.bodyType} onChange={(event) => updateControl('bodyType', event.target.value)}><option value="random">Random</option>{bodyOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label>Style<select value={controls.stylePreset} onChange={(event) => updateControl('stylePreset', event.target.value as StylePreset)}>{styleOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            </div>
            <label className={styles.checkboxLine}><input type="checkbox" checked={controls.allowChaos} onChange={(event) => updateControl('allowChaos', event.target.checked)} /> Allow chaos combinations</label>
          </details>

          <div className={styles.createActions}>
            <Button loading={isGenerating} variant="primary" onClick={() => roll(controls, 'Your character is ready.')}>Roll Character</Button>
            <Button variant="glass" onClick={() => roll({ ...defaultControls, stylePreset: controls.stylePreset }, 'Surprise character ready.')}>Surprise Me</Button>
          </div>
          <p className={styles.helperText}>Custom selections are respected when possible and repaired by the existing generator rules.</p>
        </Panel>

        <Panel variant="elevated" className={styles.resultPanel} aria-labelledby="result-title">
          {isGenerating ? (
            <div className={styles.generatingState}>
              <ArtworkPlaceholder state="generating" />
              <FeedbackState tone="loading" title="The stars are aligning.">Resolving identity, action, mood, and cinematic direction.</FeedbackState>
            </div>
          ) : (
            <>
              <div className={styles.resultHeader}>
                <Tag variant={saved ? 'status' : 'standard'}>{saved ? 'Saved' : status}</Tag>
                <h2 id="result-title" className={styles.characterTitle}>{titleFor(generation)}</h2>
                <p className={styles.identityLine}>{character.race} · {character.primaryClass} · {character.archetype}</p>
              </div>

              <ArtworkPlaceholder
                title={`${character.race} ${character.primaryClass}`}
                description={`${character.archetype}. Artwork generation coming later.`}
                alt={`${character.race} ${character.primaryClass} artwork placeholder`}
              />

              <div className={styles.storyBlock}>
                <Tag>Story Hook</Tag>
                <p>{hook}</p>
              </div>

              <div className={styles.promptPreview}>
                <div className={styles.miniHeading}>Prompt Preview</div>
                <p>{promptPreview}</p>
                <details>
                  <summary>Full prompt</summary>
                  <p>{generation.imagePrompt}</p>
                </details>
              </div>

              <details className={styles.seedDetails}>
                <summary>Seed metadata</summary>
                <dl>
                  <div><dt>Profile</dt><dd>{generation.seed.generationProfile}</dd></div>
                  <div><dt>Camera</dt><dd>{generation.seed.performanceDirection.cameraAngle}</dd></div>
                  <div><dt>Prompt mode</dt><dd>{generation.seed.promptCompilerMode}</dd></div>
                </dl>
              </details>

              <div className={styles.actionBar}>
                <Button variant="primary" onClick={handleSave}>Save Character</Button>
                <Button variant="secondary" onClick={copyPrompt}>Copy Prompt</Button>
                <Button variant="ghost" onClick={() => roll(controls, 'Variation ready.')}>Roll Again</Button>
                <Button variant="ghost" disabled>Share Later</Button>
              </div>
            </>
          )}
        </Panel>

        <Panel variant="standard" className={styles.refinePanel} aria-labelledby="refine-title">
          <div className={styles.panelHeading}>
            <Tag>Refine</Tag>
            <h2 id="refine-title">Adjust the next roll</h2>
            <p>Secondary controls for the current generator state.</p>
          </div>

          <details className={styles.refineGroup} open>
            <summary>Identity</summary>
            <div className={styles.compactMeta}>{character.presentation} · {character.ageBand} · {character.bodyType}</div>
          </details>
          <details className={styles.refineGroup}>
            <summary>Scene</summary>
            <div className={styles.compactMeta}>{generation.seed.performanceDirection.actionVerb} · {generation.seed.performanceDirection.cameraAngle}</div>
          </details>
          <details className={styles.refineGroup}>
            <summary>Prompt</summary>
            <div className={styles.compactMeta}>{generation.seed.stylePreset} · {generation.seed.promptCompilerMode}</div>
          </details>

          <Button variant="secondary" onClick={() => roll({ ...controls, mode: 'custom' }, 'Regenerated with refinements.')}>Regenerate with Refinements</Button>
          <p className={styles.tip}>Tip: lock only the fields you need. Diceborn reads better when the generator can still direct the scene.</p>
        </Panel>
      </div>
    </section>
  );
}
