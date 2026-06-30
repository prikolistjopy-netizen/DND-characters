import type { SemanticSeed, SituationGraph, VisualDirection } from './contracts';

function speciesProportions(speciesId: string) {
  const proportions: Record<string, string> = {
    dwarf: 'compact powerful proportions with a low center of gravity and broad practical hands',
    tiefling: 'humanoid proportions with intentional horn silhouette, tail balance, and nonhuman eyes',
    elf: 'long-lined frame with refined movement and age-readable features',
    half_elf: 'blended human and elven features with socially adaptive styling',
    halfling: 'small compact scale with clear adult proportions, practical hands, and environmental scale cues',
    half_orc: 'powerful shoulders, heavy jaw structure, and lived-in strength without caricature',
    gnome: 'small nimble proportions with tool-scaled hands and investigative focus',
    dragonborn: 'draconic head silhouette, coherent crest, scaled hands, and balanced tail mass',
    aasimar: 'human-readable body with subtle otherworldly symmetry and controlled luminous undertone',
    firbolg: 'large pastoral frame, broad gentle nonhuman face, and soft animal-like nose and ears',
    satyr: 'springy posture with goatlike lower-body cues and expressive ears',
    human: 'specific adult human build informed by age, work, and culture rather than a blank template',
  };
  return proportions[speciesId] ?? proportions.human;
}

function classEvidence(seed: SemanticSeed) {
  const habit = seed.life.bodyHabit;
  const byClass: Record<string, string> = {
    fighter: 'trained weight distribution and practical threat awareness',
    cleric: 'protective responsibility visible through action rather than a default prayer pose',
    warlock: 'guarded asymmetry as pressure presses at the edge of attention',
    rogue: 'exit awareness and quiet precision without generic assassin styling',
    ranger: 'terrain-aware stance and distance control shaped by the scene',
    paladin: 'interposing body language that reads as oath under public pressure',
    wizard: 'careful pattern control and cause-and-effect attention rather than holy symbolism',
    druid: 'earth-aware footing and reciprocal attention to the living environment',
    bard: 'timed social presence and breath control used as practical leverage',
    monk: 'balanced centerline, breath discipline, and economical redirection',
    barbarian: 'endurance and protective force held in purposeful restraint',
    sorcerer: 'contained bodily pressure and emotional regulation before release',
    artificer: 'tool-first posture and repair logic under pressure',
  };
  return `${habit}, with ${byClass[seed.identity.classId] ?? 'class evidence grounded in action'}`;
}

function powerManifestation(seed: SemanticSeed) {
  if (seed.power.visibility === 'none') return 'no visible magic; class evidence stays in training, duty, and action';
  if (seed.power.visibility === 'shadow') return 'one restrained shadow echo near the working hand, not a patron apparition';
  if (seed.power.visibility === 'object') return `a low contained response in the ${seed.life.personalObject}`;
  if (seed.power.visibility === 'reflected') return 'a single impossible reflection close to the immediate task';
  if (seed.power.visibility === 'environmental') return `the ${seed.world.weather} answers the action in one localized place`;
  if (seed.power.visibility === 'bodily') return 'subtle bodily pressure visible in breath, skin tension, or hand restraint';
  if (seed.power.visibility === 'symbolic') return 'one small symbol or mark responding to the current duty';
  if (seed.power.visibility === 'relational') return 'power implied through how another person reacts to the character';
  if (seed.power.visibility === 'social') return 'authority or reputation visible through the crowd response rather than glow';
  if (seed.power.visibility === 'partial') return 'a partial manifestation kept secondary and tied to the obstacle';
  if (seed.power.visibility === 'full_apparition') return 'rare distant apparition kept behind the action and never dominating the face';
  return `${seed.power.visibility} power expressed through behavior and focal detail`;
}

function paletteRoles(seed: SemanticSeed) {
  const focal = seed.power.visibility === 'none' ? seed.life.materialHistory : `${seed.power.visibility} accent restrained to ${seed.power.manifestationCarrier}`;
  return [
    `dominant environment: ${seed.world.weather}`,
    `material base: ${seed.life.materialHistory}`,
    `species read: ${seed.identity.speciesId.replace(/_/g, ' ')}`,
    `focal accent: ${focal}`,
    `pressure accent: ${seed.currentMoment.hiddenPressure}`,
  ];
}

export function directVisual(seed: SemanticSeed, graph: SituationGraph): VisualDirection {
  const primaryEdge = graph.edges.find((edge) => edge.type === 'protects')?.reason ?? seed.currentMoment.goal;
  const manifestation = powerManifestation(seed);
  return {
    anchors: {
      primary: seed.visualIntent.primaryAnchor,
      primaryReason: `Current moment drives the image: ${primaryEdge}.`,
      secondary: seed.visualIntent.secondaryAnchor,
      secondaryReason: 'Profession must be visible through handling, wear, posture, and responsibility.',
    },
    embodiment: {
      silhouette: seed.visualIntent.silhouettePrinciple,
      proportions: speciesProportions(seed.identity.speciesId),
      posture: `${classEvidence(seed)}; ${seed.currentMoment.visualConsequence}; energy state is ${seed.currentMoment.motionEnergy}`,
      gesture: `hands use ${seed.life.personalObject} with ${seed.life.learnedSkill}; ${seed.currentMoment.sceneArchetype} shapes the gesture, revealing ${seed.tension.professionClassFriction}`,
      gaze: `attention fixed on ${seed.currentMoment.targetOfAttention} while aware of ${seed.currentMoment.hiddenPressure}`,
      expression: `${seed.psychology.emotionalRestraint}, showing ${seed.psychology.value} against ${seed.tension.innerConflict}`,
    },
    life: {
      clothing: `practical ${seed.world.culture} clothing adapted for a ${seed.identity.profession}`,
      materials: `${seed.life.materialHistory}, ${seed.world.architecture}, and restrained cloth or leather masses`,
      primaryTool: seed.life.personalObject,
      handling: `${seed.life.dailyHabit}; no decorative duplicate tools`,
      personalObject: seed.life.personalObject,
      wear: seed.life.livedInTrace,
      repairs: 'visible repairs only where work would cause stress',
      stains: seed.life.livedInTrace,
      livedInTrace: seed.life.livedInTrace,
    },
    power: {
      visibility: seed.power.visibility,
      manifestation,
      carrier: seed.power.manifestationCarrier,
      intensity: seed.power.intensity,
      cost: seed.power.cost,
      integrationWithAction: `power supports ${seed.currentMoment.currentAction} without overtaking tool, face, or scene`,
      patronVisibility: seed.power.sourcePhysicallyVisible,
    },
    scene: {
      environment: seed.world.environment,
      activeObstacle: seed.currentMoment.obstacle,
      subjectOfAction: seed.currentMoment.targetOfAttention,
      spatialRelation: `character, ${seed.life.personalObject}, ${seed.currentMoment.obstacle}, and dependent are arranged in one readable triangle`,
      currentMoment: seed.currentMoment.currentAction,
      narrativeIntent: seed.currentMoment.narrativeIntent,
      stakes: seed.currentMoment.stakes,
    },
    artDirection: {
      composition: `${seed.visualIntent.compositionIntent}; frame the ${seed.currentMoment.sceneArchetype} failure point (${seed.currentMoment.failurePoint}) without adding extra props`,
      camera: 'front or side three-quarter camera with readable face and hands',
      lighting: `localized ${seed.world.weather} light with one focal accent and clean material planes`,
      paletteRoles: paletteRoles(seed),
      focalOrder: seed.visualIntent.focalHierarchy,
      detailBudget: seed.visualIntent.detailBudget,
      negativeConstraints: ['no duplicate props', 'no belt clutter', 'no class-color stereotype', 'no visible patron unless selected', 'environment secondary', 'no text or logos'],
    },
  };
}
