export type SemanticComparisonCase = {
  id: string;
  className: string;
  species: string;
  profession: string;
  powerVisibility: string;
  currentMoment: string;
  contradiction: string;
  posture: string;
  primaryTool: string;
  composition: string;
};

export type SemanticComparisonRow = SemanticComparisonCase & {
  legacyPrompt: string;
  vnextPrompt: string;
  qaFlags: string[];
};

export const semanticComparisonCases: SemanticComparisonCase[] = [
  {
    id: 'warden-ranger',
    className: 'Ranger',
    species: 'Firbolg',
    profession: 'storm trail warden',
    powerVisibility: 'subtle weather sense visible through rain-light and branch movement',
    currentMoment: 'kneels beside a fresh trail before looking up toward movement in the trees',
    contradiction: 'none: tracking action, ranger tool, and woodland species markers agree',
    posture: 'side-on kneel with one shoulder turned toward the path',
    primaryTool: 'longbow held low with one arrow ready',
    composition: 'side three-quarter full-body character concept with readable face',
  },
  {
    id: 'oath-paladin',
    className: 'Paladin',
    species: 'Dragonborn',
    profession: 'gate oath guardian',
    powerVisibility: 'controlled radiant edge-light on shield and sword',
    currentMoment: 'plants both feet before an unseen strike at a broken threshold',
    contradiction: 'none: oath light is tied to paladin defense, not generic caster magic',
    posture: 'grounded frontal guard with shield forward',
    primaryTool: 'shield and longsword treated as one defensive read',
    composition: 'front three-quarter heroic character study',
  },
  {
    id: 'archive-wizard',
    className: 'Wizard',
    species: 'Human',
    profession: 'academy anomaly scholar',
    powerVisibility: 'cold blue geometric spell structure outside the body',
    currentMoment: 'closes a dangerous book while stabilizing a floating diagram',
    contradiction: 'none: arcane geometry avoids holy-book or cleric drift',
    posture: 'upright profile stance braced against arcane pressure',
    primaryTool: 'weathered spellbook supported in one hand',
    composition: 'profile-to-three-quarter study with clear hands and face',
  },
  {
    id: 'pact-warlock',
    className: 'Warlock',
    species: 'Tiefling',
    profession: 'pact witness',
    powerVisibility: 'ink-violet second shadow behind the cloak',
    currentMoment: 'listens to a patron whisper from just outside the frame',
    contradiction: 'none: patron hint is singular and does not become a second character',
    posture: 'asymmetric stance with chin angled toward the unseen voice',
    primaryTool: 'pact-marked hand held open under restrained pressure',
    composition: 'low side three-quarter portrait-body hybrid',
  },
  {
    id: 'stage-bard',
    className: 'Bard',
    species: 'Gnome',
    profession: 'moonlit street performer',
    powerVisibility: 'warm stage light and sound-like ribbon glow from the instrument',
    currentMoment: 'laughs toward an implied audience while striking a bright chord',
    contradiction: 'none: performance behavior leads, with no grimoire or wizard pose',
    posture: 'seated sideways on a low barrel with face fully visible',
    primaryTool: 'small lute held against the torso with hands on neck and strings',
    composition: 'front three-quarter performance card with compact scale cues',
  },
  {
    id: 'forge-artificer',
    className: 'Artificer',
    species: 'Dwarf',
    profession: 'field mechanism repairer',
    powerVisibility: 'contained amber seam-light inside a compact device',
    currentMoment: 'tightens one sparking mechanism while stepping away from recoil',
    contradiction: 'none: tool-bound magic and compact device stay within artificer read',
    posture: 'forward lean with elbows close and stable footing',
    primaryTool: 'single active mechanism gripped with one adjusting tool',
    composition: 'slight high-angle workshop-edge character concept',
  },
];

function buildLegacyPrompt(testCase: SemanticComparisonCase) {
  return [
    `Legacy Diceborn baseline: full-body ${testCase.species} ${testCase.className}, ${testCase.profession}.`,
    `Primary read uses ${testCase.primaryTool}; posture is ${testCase.posture}.`,
    `Scene moment: ${testCase.currentMoment}.`,
    `Composition: ${testCase.composition}.`,
    `Cinematic painted fantasy style, readable silhouette, controlled detail, uncluttered background.`,
  ].join(' ');
}

function buildVnextPrompt(testCase: SemanticComparisonCase) {
  return [
    `Semantic Core vNext: ${testCase.species} ${testCase.className} interpreted as a ${testCase.profession}.`,
    `Power visibility is resolved as ${testCase.powerVisibility}.`,
    `The current moment is specific: ${testCase.currentMoment}.`,
    `Posture, tool, and composition remain linked: ${testCase.posture}; ${testCase.primaryTool}; ${testCase.composition}.`,
    `Contradiction check: ${testCase.contradiction}.`,
  ].join(' ');
}

function buildQaFlags(testCase: SemanticComparisonCase) {
  return [
    `class:${testCase.className.toLowerCase()}`,
    `species:${testCase.species.toLowerCase()}`,
    'tool-aligned',
    'posture-aligned',
    testCase.contradiction.startsWith('none') ? 'no-contradiction' : 'review-contradiction',
  ];
}

export function getSemanticComparisonRows(): SemanticComparisonRow[] {
  return semanticComparisonCases.map((testCase) => ({
    ...testCase,
    legacyPrompt: buildLegacyPrompt(testCase),
    vnextPrompt: buildVnextPrompt(testCase),
    qaFlags: buildQaFlags(testCase),
  }));
}
