import type { SemanticSeed, SituationGraph, VisualDirection } from './contracts';

function speciesProportions(speciesId: string) {
  if (speciesId === 'dwarf') return 'compact powerful proportions with a low center of gravity and broad practical hands';
  if (speciesId === 'tiefling') return 'humanoid proportions with intentional horn silhouette, tail balance, and nonhuman eyes';
  return 'specific human proportions shaped by age, work, and culture rather than a blank template';
}

function classPosture(seed: SemanticSeed) {
  const professionHabit = seed.life.bodyHabit;
  if (seed.identity.classId === 'fighter') return `${professionHabit}, with trained weight distribution and practical threat awareness`;
  if (seed.identity.classId === 'cleric') return `${professionHabit}, protective but not prayer-posed, keeping responsibility visible through action`;
  return `${professionHabit}, asymmetric and guarded as power presses at the edge of attention`;
}

function powerManifestation(seed: SemanticSeed) {
  if (seed.power.visibility === 'none') return 'no visible magic; class evidence stays in training and action';
  if (seed.power.visibility === 'shadow') return 'one restrained shadow echo behind the working hand';
  if (seed.power.visibility === 'object') return `a low contained response in the ${seed.life.personalObject}`;
  if (seed.power.visibility === 'reflected') return 'a single impossible reflection near the action';
  if (seed.power.visibility === 'environmental') return `the ${seed.world.weather} answers the action in one localized place`;
  if (seed.power.visibility === 'full_apparition') return 'rare partial apparition kept distant and secondary';
  return `${seed.power.visibility} power expressed through behavior and focal detail`;
}

export function directVisual(seed: SemanticSeed, graph: SituationGraph): VisualDirection {
  const primaryEdge = graph.edges.find((edge) => edge.type === 'protects')?.reason ?? seed.currentMoment.goal;
  const manifestation = powerManifestation(seed);
  return {
    anchors: {
      primary: seed.visualIntent.primaryAnchor,
      primaryReason: `Current moment drives the image: ${primaryEdge}.`,
      secondary: seed.visualIntent.secondaryAnchor,
      secondaryReason: 'Profession must be visible through handling, wear, and responsibility.',
    },
    embodiment: {
      silhouette: seed.visualIntent.silhouettePrinciple,
      proportions: speciesProportions(seed.identity.speciesId),
      posture: classPosture(seed),
      gesture: `hands use ${seed.life.personalObject} with ${seed.life.dailyHabit}`,
      gaze: `attention fixed on ${seed.currentMoment.targetOfAttention}`,
      expression: `${seed.psychology.emotionalRestraint}, showing ${seed.psychology.value} under pressure`,
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
      spatialRelation: `character, ${seed.life.personalObject}, and obstacle are arranged in one readable triangle`,
      currentMoment: seed.currentMoment.currentAction,
    },
    artDirection: {
      composition: seed.visualIntent.compositionIntent,
      camera: 'front or side three-quarter camera with readable face and hands',
      lighting: `localized ${seed.world.weather} light with one focal accent`,
      paletteRoles: [seed.world.weather, seed.life.materialHistory, seed.power.visibility === 'none' ? 'no power accent' : `${seed.power.visibility} minor power accent`],
      focalOrder: seed.visualIntent.focalHierarchy,
      detailBudget: seed.visualIntent.detailBudget,
      negativeConstraints: ['no duplicate props', 'no belt clutter', 'no class-color stereotype', 'no visible patron unless selected', 'environment secondary', 'no text or logos'],
    },
  };
}
