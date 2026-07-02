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
import { generateDicebornVNext, generateDicebornVNextForSession, type NoveltyMode, type PilotClassId, type PilotSpeciesId, type PowerVisibility, type VNextInput, type VNextResult } from '@/src/lib/vnext';
import { vnextAffordances, vnextFacts, vnextSemanticFacts } from '@/src/lib/vnext/facts';
import styles from './generator.module.css';

type Mode = 'random' | 'custom';
type EngineMode = 'legacy' | 'vnext';
type ActiveResult = { engine: 'legacy'; legacy: GenerationResult } | { engine: 'vnext'; vnext: VNextResult };
type SessionHistory = { lastProfessions: string[]; lastProfessionSalience: Array<VNextResult['semanticSeed']['life']['professionSalience']>; lastSceneArchetypes: string[]; lastEnvironments: string[]; lastDominantAnchors: Array<VNextResult['semanticDirectorPlan']['dominantNarrativeAnchor']>; lastCompositions: string[]; lastTools: string[] };

type ControlState = {
  engine: EngineMode;
  mode: Mode;
  class: ManualGenerationControls['class'] | PilotClassId | 'random';
  race: ManualGenerationControls['race'] | PilotSpeciesId | 'random';
  genderPresentation: GenderPresentation | 'random';
  ageBand: ApparentAgeBand | 'random';
  bodyType: string | 'random';
  stylePreset: StylePreset;
  generationProfile: GenerationProfile;
  noveltyMode: NoveltyMode;
  promptCompilerMode: PromptCompilerMode;
  allowChaos: boolean;
  professionId: string | 'random';
  powerVisibility: PowerVisibility | 'random';
  seed: string;
};

const classOptions: Array<CharacterSeed['primaryClass']> = ['fighter', 'barbarian', 'paladin', 'cleric', 'wizard', 'sorcerer', 'warlock', 'bard', 'rogue', 'ranger', 'druid', 'monk', 'artificer'];
const raceOptions: Array<CharacterSeed['race']['name']> = ['human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-orc', 'tiefling', 'dragonborn', 'aasimar', 'satyr', 'fairy', 'firbolg'];
const pilotClassIds = vnextFacts.classes.map((item) => item.id);
const pilotSpeciesIds = vnextFacts.species.map((item) => item.id);
const bodyOptions = ['lean agile', 'compact sturdy', 'broad powerful', 'wiry', 'graceful tall', 'soft-robed', 'athletic balanced', 'heavy armored', 'small nimble', 'tiny aerial'];
const styleOptions: Array<{ id: StylePreset; label: string }> = [
  { id: 'cinematic_painted_fantasy', label: 'Cinematic Painted Fantasy' },
  { id: 'painted_character_study_clean', label: 'Painted Character Study Clean' },
  { id: 'clean_concept_art', label: 'Clean Concept Art' },
];
const profileOptions: Array<{ id: GenerationProfile; label: string }> = [
  { id: 'classic_fantasy', label: 'Classic Fantasy' },
  { id: 'balanced_gallery', label: 'Balanced Gallery' },
  { id: 'weird_but_good', label: 'Weird but Good' },
  { id: 'chaos', label: 'Chaos' },
  { id: 'manual_custom', label: 'Manual Custom' },
];
const noveltyOptions: Array<{ id: NoveltyMode; label: string }> = [
  { id: 'off', label: 'Grounded' },
  { id: 'soft', label: 'Balanced Novelty' },
  { id: 'strong', label: 'Stronger Novelty' },
];

const defaultControls: ControlState = {
  engine: 'vnext',
  mode: 'random',
  class: 'random',
  race: 'random',
  genderPresentation: 'random',
  ageBand: 'random',
  bodyType: 'random',
  stylePreset: 'cinematic_painted_fantasy',
  generationProfile: 'classic_fantasy',
  noveltyMode: 'soft',
  promptCompilerMode: 'artist_brief_prompt',
  allowChaos: false,
  professionId: 'random',
  powerVisibility: 'random',
  seed: 'diceborn-vnext-alpha',
};

function titleCase(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function controlsToOptions(controls: ControlState): GenerationOptions {
  const manualControls: ManualGenerationControls = {
    class: controls.class as ManualGenerationControls['class'],
    race: controls.race as ManualGenerationControls['race'],
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

function makeEphemeralSeed() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `diceborn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function vnextFingerprint(result: VNextResult) {
  const seed = result.semanticSeed;
  return hashText(JSON.stringify({
    selectedFactIds: seed.selectedFactIds,
    classId: seed.identity.classId,
    speciesId: seed.identity.speciesId,
    professionId: seed.identity.professionId,
    currentMoment: seed.currentMoment.currentAction,
    prompt: result.prompt,
  }));
}

function activeSeed(result: ActiveResult) {
  return result.engine === 'vnext' ? result.vnext.semanticSeed.deterministicSeed : result.legacy.seedOutput;
}

function activeFingerprint(result: ActiveResult) {
  return result.engine === 'vnext' ? vnextFingerprint(result.vnext) : hashText(result.legacy.imagePrompt);
}

function controlsToVNextInput(controls: ControlState, seedOverride?: string): VNextInput {
  const trimmedSeed = controls.seed.trim();
  const rngSeed = seedOverride ?? (trimmedSeed || makeEphemeralSeed());
  const input: VNextInput = {
    rngSeed,
    noveltyMode: controls.noveltyMode,
    promptOptions: { maxWords: 320 },
  };

  if (controls.mode === 'custom') {
    if (controls.class !== 'random' && pilotClassIds.includes(controls.class as PilotClassId)) input.classId = controls.class as PilotClassId;
    if (controls.race !== 'random' && pilotSpeciesIds.includes(controls.race as PilotSpeciesId)) input.speciesId = controls.race as PilotSpeciesId;
    if (controls.professionId !== 'random') input.professionId = controls.professionId;
    input.locks = {
      ...(controls.ageBand !== 'random' ? { ageBand: controls.ageBand } : {}),
      ...(controls.genderPresentation !== 'random' ? { genderPresentation: controls.genderPresentation } : {}),
      ...(controls.powerVisibility !== 'random' ? { visibility: controls.powerVisibility } : {}),
    };
  }

  return input;
}

function rollWithControls(controls: ControlState, seedOverride?: string, sessionHistory?: SessionHistory): ActiveResult {
  if (controls.engine === 'vnext') {
    const input = controlsToVNextInput(controls, seedOverride);
    const vnext = controls.mode === 'random' && sessionHistory ? generateDicebornVNextForSession(input, sessionHistory) : generateDicebornVNext(input);
    return { engine: 'vnext', vnext };
  }
  return { engine: 'legacy', legacy: generateCharacterSeed(controlsToOptions(controls)) };
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

function legacyTitle(result: GenerationResult) {
  return result.dicebornResult.character.title;
}

function vnextTitle(result: VNextResult) {
  const seed = result.semanticSeed;
  return `${titleCase(seed.identity.profession)} at ${titleCase(seed.world.environment)}`;
}

function saveLegacyToCollection(result: GenerationResult) {
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

function saveVNextToCollection(result: VNextResult) {
  const id = `vnext.${result.semanticSeed.deterministicSeed}.${result.semanticSeed.identity.classId}.${result.semanticSeed.identity.professionId}`;
  const record: LocalCollectionRecord = {
    id,
    version: result.schemaVersion,
    generatedAt: new Date().toISOString(),
    character: {
      title: vnextTitle(result),
      race: titleCase(result.semanticSeed.identity.speciesId),
      primaryClass: titleCase(result.semanticSeed.identity.classId),
      archetype: titleCase(result.semanticSeed.identity.profession),
      presentation: titleCase(result.semanticSeed.identity.genderPresentation),
      ageBand: titleCase(result.semanticSeed.identity.ageBand),
      bodyType: result.visualDirection.embodiment.proportions,
    },
    imagePrompt: result.prompt,
  };
  const raw = window.localStorage.getItem(LOCAL_COLLECTION_KEY);
  const existing = raw ? JSON.parse(raw) as LocalCollectionRecord[] : [];
  const next = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 48);
  window.localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(next));
  window.localStorage.setItem(`diceborn.character.${record.id}`, JSON.stringify(result));
}

export function GeneratorWorkspace() {
  const initial = useMemo(() => rollWithControls(defaultControls, defaultControls.seed), []);
  const [controls, setControls] = useState<ControlState>(defaultControls);
  const [generation, setGeneration] = useState<ActiveResult>(initial);
  const [status, setStatus] = useState('Semantic Core vNext result is ready.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generationCounter, setGenerationCounter] = useState(1);
  const [previousSeed, setPreviousSeed] = useState('none');
  const [generatedAt, setGeneratedAt] = useState(() => new Date().toISOString());
  const [sessionHistory, setSessionHistory] = useState<SessionHistory>({ lastProfessions: [], lastProfessionSalience: [], lastSceneArchetypes: [], lastEnvironments: [], lastDominantAnchors: [], lastCompositions: [], lastTools: [] });

  function updateControl<K extends keyof ControlState>(key: K, value: ControlState[K]) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function commitGeneration(nextControls: ControlState, seed: string, message: string) {
    setIsGenerating(true);
    setSaved(false);
    const lastSeed = activeSeed(generation);
    const controlsWithSeed = { ...nextControls, seed };
    setControls(controlsWithSeed);
    window.setTimeout(() => {
      const next = rollWithControls(controlsWithSeed, seed, sessionHistory);
      setPreviousSeed(lastSeed);
      setGeneration(next);
      if (next.engine === 'vnext' && controlsWithSeed.mode === 'random') {
        setSessionHistory((history) => ({
          lastProfessions: [...history.lastProfessions, next.vnext.semanticSeed.identity.professionId].slice(-16),
          lastProfessionSalience: [...history.lastProfessionSalience, next.vnext.semanticSeed.life.professionSalience].slice(-16),
          lastSceneArchetypes: [...history.lastSceneArchetypes, next.vnext.semanticSeed.currentMoment.sceneArchetype].slice(-16),
          lastEnvironments: [...history.lastEnvironments, next.vnext.visualDirection.scene.environment].slice(-16),
          lastDominantAnchors: [...history.lastDominantAnchors, next.vnext.semanticDirectorPlan.dominantNarrativeAnchor].slice(-16),
          lastCompositions: [...history.lastCompositions, next.vnext.visualDirection.artDirection.composition].slice(-16),
          lastTools: [...history.lastTools, next.vnext.visualDirection.life.primaryTool].slice(-16),
        }));
      }
      setGenerationCounter((count) => count + 1);
      setGeneratedAt(new Date().toISOString());
      setStatus(message);
      setIsGenerating(false);
    }, 280);
  }

  function rollCharacter(nextControls = controls) {
    const nextSeed = nextControls.mode === 'random'
      ? makeEphemeralSeed()
      : nextControls.seed.trim() || makeEphemeralSeed();
    commitGeneration(nextControls, nextSeed, nextControls.mode === 'random' ? 'New Semantic vNext character ready.' : 'Semantic vNext rebuilt from deterministic controls.');
  }

  function surpriseMe() {
    const nextSeed = makeEphemeralSeed();
    commitGeneration({ ...defaultControls, engine: 'vnext', stylePreset: controls.stylePreset, seed: nextSeed }, nextSeed, 'Semantic vNext surprise ready.');
  }

  function rollNewSeedWithCurrentLocks() {
    const nextSeed = makeEphemeralSeed();
    commitGeneration({ ...controls, engine: 'vnext', seed: nextSeed }, nextSeed, 'Semantic vNext variation ready.');
  }

  function rebuildSameSeedWithRefinements() {
    const nextControls = { ...controls, engine: 'vnext' as const, mode: 'custom' as const };
    const nextSeed = nextControls.seed.trim() || makeEphemeralSeed();
    commitGeneration(nextControls, nextSeed, 'Semantic vNext regenerated with current seed and locks.');
  }

  async function copyPrompt() {
    const prompt = generation.engine === 'vnext' ? generation.vnext.prompt : generation.legacy.imagePrompt;
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('Prompt copied.');
    } catch {
      setStatus('Could not copy prompt. Select the prompt manually.');
    }
  }

  function handleSave() {
    if (generation.engine === 'vnext') saveVNextToCollection(generation.vnext);
    else saveLegacyToCollection(generation.legacy);
    setSaved(true);
    setStatus('Saved to your collection.');
  }

  const isVNext = generation.engine === 'vnext';
  const legacy = generation.engine === 'legacy' ? generation.legacy : null;
  const vnext = generation.engine === 'vnext' ? generation.vnext : null;
  const character = legacy?.dicebornResult.character;
  const vnextSeed = vnext?.semanticSeed;
  const resultTitle = vnext ? vnextTitle(vnext) : legacyTitle(legacy!);
  const prompt = vnext?.prompt ?? legacy!.imagePrompt;
  const promptPreview = shortPrompt(prompt);

  const displayedClassOptions = controls.engine === 'vnext' ? pilotClassIds : classOptions;
  const displayedRaceOptions = controls.engine === 'vnext' ? pilotSpeciesIds : raceOptions;

  return (
    <section className={styles.shell} aria-labelledby="generate-title">
      <header className={styles.header}>
        <div>
          <p className="eyebrow">Generator</p>
          <h1 id="generate-title" className={styles.pageTitle}>Create a Diceborn character</h1>
        </div>
        <p className={styles.headerText}>Roll freely or shape the result. Semantic Core vNext now resolves identity, profession, tension, current moment, and visual direction as one grounded character system.</p>
      </header>

      <div className={styles.workspace}>
        <Panel variant="standard" className={styles.createPanel} aria-labelledby="create-title">
          <div className={styles.panelHeading}>
            <Tag variant="accent">Create</Tag>
            <h2 id="create-title">Choose your path</h2>
            <p>Start fast or lock essentials. Semantic Core vNext keeps profession, tension, scene, and visual direction connected.</p>
          </div>

          <div className={styles.modeGrid} role="radiogroup" aria-label="Generation mode">
            <button className={controls.mode === 'random' ? styles.modeActive : styles.modeCard} type="button" role="radio" aria-checked={controls.mode === 'random'} onClick={() => updateControl('mode', 'random')}>Random<span>No required locks</span></button>
            <button className={controls.mode === 'custom' ? styles.modeActive : styles.modeCard} type="button" role="radio" aria-checked={controls.mode === 'custom'} onClick={() => updateControl('mode', 'custom')}>Custom<span>Use selected locks</span></button>
          </div>

          <div className={styles.controlStack}>
            <label>{controls.engine === 'vnext' ? 'Species' : 'Race'}<select value={controls.race} onChange={(event) => updateControl('race', event.target.value as ControlState['race'])}><option value="random">Random {controls.engine === 'vnext' ? 'species' : 'race'}</option>{displayedRaceOptions.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label>
            <label>Class<select value={controls.class} onChange={(event) => updateControl('class', event.target.value as ControlState['class'])}><option value="random">Random class</option>{displayedClassOptions.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label>
            {controls.engine === 'vnext' ? (
              <label>Direction<select value={controls.noveltyMode} onChange={(event) => updateControl('noveltyMode', event.target.value as NoveltyMode)}>{noveltyOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            ) : (
              <label>Direction<select value={controls.generationProfile} onChange={(event) => updateControl('generationProfile', event.target.value as GenerationProfile)}>{profileOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            )}
          </div>

          <details className={styles.moreOptions}>
            <summary>More Options</summary>
            <div className={styles.optionGrid}>
              {controls.engine === 'vnext' ? (
                <>
                  <label>Profession<select value={controls.professionId} onChange={(event) => updateControl('professionId', event.target.value)}><option value="random">Random profession</option>{vnextAffordances.professions.map((option) => <option key={option.id} value={option.id}>{titleCase(option.label)}</option>)}</select></label>
                  <label>Power visibility<select value={controls.powerVisibility} onChange={(event) => updateControl('powerVisibility', event.target.value as ControlState['powerVisibility'])}><option value="random">Resolved by vNext</option>{vnextSemanticFacts.pilotScope.powerVisibilityModes.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label>
                  <label>Seed<input value={controls.seed} onChange={(event) => updateControl('seed', event.target.value)} placeholder="diceborn-vnext-alpha" /></label>
                </>
              ) : null}
              <label>Gender<select value={controls.genderPresentation} onChange={(event) => updateControl('genderPresentation', event.target.value as ControlState['genderPresentation'])}><option value="random">Random</option><option value="masculine">Masculine</option><option value="feminine">Feminine</option><option value="androgynous">Androgynous</option></select></label>
              <label>Age<select value={controls.ageBand} onChange={(event) => updateControl('ageBand', event.target.value as ControlState['ageBand'])}><option value="random">Random</option><option value="young_adult">Young adult</option><option value="adult">Adult</option><option value="middle_aged">Middle-aged</option><option value="elder">Elder</option></select></label>
              {controls.engine === 'legacy' ? <label>Body<select value={controls.bodyType} onChange={(event) => updateControl('bodyType', event.target.value)}><option value="random">Random</option>{bodyOptions.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label> : null}
              <label>Style<select value={controls.stylePreset} onChange={(event) => updateControl('stylePreset', event.target.value as StylePreset)}>{styleOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
            </div>
            {controls.engine === 'legacy' ? <label className={styles.checkboxLine}><input type="checkbox" checked={controls.allowChaos} onChange={(event) => updateControl('allowChaos', event.target.checked)} /> Allow chaos combinations</label> : null}
          </details>

          <div className={styles.createActions}>
            <Button loading={isGenerating} variant="primary" onClick={() => rollCharacter(controls)}>Roll Character</Button>
            <Button variant="glass" onClick={surpriseMe}>Surprise Me</Button>
          </div>
          <p className={styles.helperText}>Semantic vNext uses deterministic seeds. Same seed plus same locks produces the same result.</p>
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
                <Tag variant={isVNext ? 'accent' : saved ? 'status' : 'standard'}>{isVNext ? 'Semantic vNext' : saved ? 'Saved' : 'Legacy'}</Tag>
                <h2 id="result-title" className={styles.characterTitle}>{resultTitle}</h2>
                <p className={styles.identityLine}>{vnextSeed ? `${titleCase(vnextSeed.identity.speciesId)} · ${titleCase(vnextSeed.identity.classId)} · ${titleCase(vnextSeed.identity.profession)}` : `${character!.race} · ${character!.primaryClass} · ${character!.archetype}`}</p>
                {vnext ? (
                  <div className={styles.engineDiagnostic} aria-label="Semantic vNext diagnostics">
                    <span>Engine: <strong>Semantic vNext</strong></span>
                    <span>Schema: <strong>{vnext.schemaVersion}</strong></span>
                    <span>Seed: <strong>{vnext.semanticSeed.deterministicSeed}</strong></span>
                    <span>Previous: <strong>{previousSeed}</strong></span>
                    <span>Counter: <strong>{generationCounter}</strong></span>
                    <span>Fingerprint: <strong>{activeFingerprint(generation)}</strong></span>
                    <span>Generated: <strong>{generatedAt}</strong></span>
                    {typeof window !== 'undefined' && window.location.hostname === 'localhost' ? (
                      <>
                        <span>Dominant: <strong>{vnext.semanticDirectorPlan.dominantNarrativeAnchor}</strong></span>
                        <span>Supporting: <strong>{vnext.semanticDirectorPlan.supportingNarrativeAnchor}</strong></span>
                        <span>Profession salience: <strong>{vnext.semanticSeed.life.professionSalience}</strong></span>
                        <span>Affinity: <strong>{vnext.semanticSeed.life.professionAffinity}</strong></span>
                        <span>Budget: <strong>{vnext.semanticDirectorPlan.professionBudget.maxVisualChannels}</strong></span>
                        <span>Class evidence: <strong>{vnext.semanticDirectorPlan.classEvidencePlan.channels.join(', ')}</strong></span>
                        <span>Draft/final: <strong>{vnext.compiledPrompt.promptWriter ? `${vnext.compiledPrompt.promptWriter.draftPrompt.split(/\s+/).filter(Boolean).length}/${vnext.compiledPrompt.wordCount}` : 'n/a'}</strong></span>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <ArtworkPlaceholder
                title={vnextSeed ? `${titleCase(vnextSeed.identity.speciesId)} ${titleCase(vnextSeed.identity.classId)}` : `${character!.race} ${character!.primaryClass}`}
                description={vnextSeed ? `${titleCase(vnextSeed.identity.profession)}. Artwork generation coming later.` : `${character!.archetype}. Artwork generation coming later.`}
                alt={vnextSeed ? `${titleCase(vnextSeed.identity.speciesId)} ${titleCase(vnextSeed.identity.classId)} artwork placeholder` : `${character!.race} ${character!.primaryClass} artwork placeholder`}
              />

              {vnext ? (
                <div className={styles.storyBlock}>
                  <Tag>Current Moment</Tag>
                  <p>{vnext.semanticSeed.currentMoment.currentAction}</p>
                  <Tag>Story Hook</Tag>
                  <p>{vnext.semanticSeed.currentMoment.narrativeIntent}; if they fail, {vnext.semanticSeed.currentMoment.consequenceOfFailure}.</p>
                  <div className={styles.metaGrid}>
                    <div><dt>Power visibility</dt><dd>{titleCase(vnext.semanticSeed.power.visibility)}</dd></div>
                    <div><dt>Profession posture</dt><dd>{vnext.visualDirection.embodiment.posture}</dd></div>
                    <div><dt>Tension</dt><dd>{vnext.semanticSeed.tension.roleContradiction}</dd></div>
                    <div><dt>Primary tool</dt><dd>{vnext.visualDirection.life.primaryTool}</dd></div>
                    <div><dt>Lived-in trace</dt><dd>{vnext.visualDirection.life.livedInTrace}</dd></div>
                  </div>
                </div>
              ) : (
                <div className={styles.storyBlock}>
                  <Tag>Story Hook</Tag>
                  <p>{storyHook(legacy!)}</p>
                </div>
              )}

              <div className={styles.promptPreview}>
                <div className={styles.miniHeading}>Prompt Preview</div>
                <p>{promptPreview}</p>
                <details>
                  <summary>Full prompt</summary>
                  <p>{prompt}</p>
                </details>
                {vnext ? (
                  <details>
                    <summary>Negative prompt</summary>
                    <p>{vnext.negativePrompt}</p>
                  </details>
                ) : null}
              </div>

              <details className={styles.seedDetails}>
                <summary>{isVNext ? 'vNext QA and seed' : 'Seed metadata'}</summary>
                {vnext ? (
                  <div className={styles.qaFlags}>{vnext.qa.flags.concat(vnext.qa.blockingErrors).map((flag) => <span key={flag}>{flag}</span>)}</div>
                ) : (
                  <dl>
                    <div><dt>Profile</dt><dd>{legacy!.seed.generationProfile}</dd></div>
                    <div><dt>Camera</dt><dd>{legacy!.seed.performanceDirection.cameraAngle}</dd></div>
                    <div><dt>Prompt mode</dt><dd>{legacy!.seed.promptCompilerMode}</dd></div>
                  </dl>
                )}
              </details>

              <div className={styles.actionBar}>
                <Button variant="primary" onClick={handleSave}>Save Character</Button>
                <Button variant="secondary" onClick={copyPrompt}>Copy Prompt</Button>
                <Button variant="ghost" onClick={rollNewSeedWithCurrentLocks}>Roll Again</Button>
                <Button variant="ghost" disabled>Share Later</Button>
              </div>
            </>
          )}
        </Panel>

        <Panel variant="standard" className={styles.refinePanel} aria-labelledby="refine-title">
          <div className={styles.panelHeading}>
            <Tag>Refine</Tag>
            <h2 id="refine-title">Adjust the next roll</h2>
            <p>Locks here feed Semantic vNext directly.</p>
          </div>

          <details className={styles.refineGroup} open>
            <summary>Identity</summary>
            {controls.engine === 'vnext' ? (
              <div className={styles.refineControls}>
                <label>Species<select value={controls.race} onChange={(event) => updateControl('race', event.target.value as ControlState['race'])}><option value="random">Random</option>{pilotSpeciesIds.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label>
                <label>Class<select value={controls.class} onChange={(event) => updateControl('class', event.target.value as ControlState['class'])}><option value="random">Random</option>{pilotClassIds.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label>
              </div>
            ) : <div className={styles.compactMeta}>{character!.presentation} · {character!.ageBand} · {character!.bodyType}</div>}
          </details>
          <details className={styles.refineGroup}>
            <summary>Profession</summary>
            {controls.engine === 'vnext' ? <div className={styles.refineControls}><label>Profession<select value={controls.professionId} onChange={(event) => updateControl('professionId', event.target.value)}><option value="random">Random</option>{vnextAffordances.professions.map((option) => <option key={option.id} value={option.id}>{titleCase(option.label)}</option>)}</select></label></div> : <div className={styles.compactMeta}>Legacy archetype: {character!.archetype}</div>}
          </details>
          <details className={styles.refineGroup}>
            <summary>Scene / current moment</summary>
            <div className={styles.compactMeta}>{vnext ? vnext.semanticSeed.currentMoment.currentAction : `${legacy!.seed.performanceDirection.actionVerb} · ${legacy!.seed.performanceDirection.cameraAngle}`}</div>
          </details>
          <details className={styles.refineGroup}>
            <summary>Visual style</summary>
            <div className={styles.refineControls}><label>Style<select value={controls.stylePreset} onChange={(event) => updateControl('stylePreset', event.target.value as StylePreset)}>{styleOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label></div>
          </details>
          <details className={styles.refineGroup}>
            <summary>Power visibility</summary>
            {controls.engine === 'vnext' ? <div className={styles.refineControls}><label>Visibility<select value={controls.powerVisibility} onChange={(event) => updateControl('powerVisibility', event.target.value as ControlState['powerVisibility'])}><option value="random">Resolved by vNext</option>{vnextSemanticFacts.pilotScope.powerVisibilityModes.map((option) => <option key={option} value={option}>{titleCase(option)}</option>)}</select></label></div> : <div className={styles.compactMeta}>{legacy!.seed.magicVisualLanguage.source} · {legacy!.seed.magicVisualLanguage.palette}</div>}
          </details>

          <Button variant="secondary" onClick={rebuildSameSeedWithRefinements}>Regenerate with Refinements</Button>
          <p className={styles.tip}>Tip: Random rolls create a new seed. Custom + seed rebuilds the same character until a lock or seed changes.</p>
        </Panel>
      </div>
    </section>
  );
}
