import type { ClassEvidencePlan, PilotClassId, ProfessionBudget, ProfessionSalience, SemanticAnchor, SemanticDirectorPlan, SemanticSeed } from './contracts';

const CLASS_EVIDENCE: Record<PilotClassId, ClassEvidencePlan> = {
  fighter: { behavioral: 'assesses threats before moving', physical: 'keeps trained weight control', social: 'places the body where others can shelter', object: 'keeps equipment economical', channels: ['behavioral', 'physical', 'social'] },
  cleric: { behavioral: 'checks who needs care before display', physical: 'uses practiced ritual handling', social: 'carries responsibility toward the community', power: 'lets mercy shape the power cue', channels: ['behavioral', 'social', 'power'] },
  warlock: { behavioral: 'hesitates around a negotiated cost', physical: 'keeps one side of the body guarded', social: 'manages pressure from an unseen bargain', power: 'shows a contained external claim', channels: ['behavioral', 'physical', 'power'] },
  rogue: { behavioral: 'reads exits and witnesses first', physical: 'uses hand precision and quiet timing', social: 'stays aware of suspicion in the room', channels: ['behavioral', 'physical', 'social'] },
  ranger: { behavioral: 'tracks terrain before people react', physical: 'keeps distance and footing adaptable', social: 'protects others through route choice', channels: ['behavioral', 'physical', 'social'] },
  paladin: { behavioral: 'chooses restraint under moral pressure', physical: 'interposes without turning heroic', social: 'is judged by a public oath', power: 'keeps oath pressure close to action', channels: ['behavioral', 'physical', 'social'] },
  wizard: { behavioral: 'tests cause and effect before acting', physical: 'handles prepared materials carefully', social: 'explains danger through measured attention', object: 'uses a prepared focus only when needed', channels: ['behavioral', 'physical', 'object'] },
  druid: { behavioral: 'reads living systems before force', physical: 'lets footing answer the environment', social: 'treats nonhuman life as part of the decision', channels: ['behavioral', 'physical', 'social'] },
  bard: { behavioral: 'uses timing and presence as leverage', physical: 'controls breath and gesture rhythm', social: 'moves attention between conflicting people', channels: ['behavioral', 'physical', 'social'] },
  monk: { behavioral: 'redirects pressure rather than meeting it directly', physical: 'keeps centerline and breath disciplined', social: 'remains calm where others escalate', channels: ['behavioral', 'physical', 'social'] },
  barbarian: { behavioral: 'withholds force until protection requires it', physical: 'turns endurance into braced restraint', social: 'draws danger away from someone weaker', channels: ['behavioral', 'physical', 'social'] },
  sorcerer: { behavioral: 'contains innate pressure before it spills out', physical: 'shows strain in breath and fingers', social: 'keeps bystanders outside the release path', power: 'lets power threaten the body before the room', channels: ['behavioral', 'physical', 'power'] },
  artificer: { behavioral: 'solves danger through repair logic', physical: 'keeps tool-first precision under stress', social: 'makes practical choices others can trust', object: 'uses one device as evidence, not clutter', channels: ['behavioral', 'physical', 'object'] },
};

export function professionBudgetFor(salience: ProfessionSalience): ProfessionBudget {
  if (salience === 'background') return { salience, maxVisualChannels: 0, allowedChannels: [], directSceneAllowed: false, environmentControlAllowed: false, compositionControlAllowed: false };
  if (salience === 'trace') return { salience, maxVisualChannels: 1, allowedChannels: ['habit', 'wear', 'material'], directSceneAllowed: false, environmentControlAllowed: false, compositionControlAllowed: false };
  if (salience === 'secondary') return { salience, maxVisualChannels: 2, allowedChannels: ['skill', 'habit', 'wear', 'material', 'social reputation'], directSceneAllowed: false, environmentControlAllowed: false, compositionControlAllowed: false };
  if (salience === 'strong') return { salience, maxVisualChannels: 4, allowedChannels: ['skill', 'habit', 'wear', 'material', 'social reputation', 'tool'], directSceneAllowed: false, environmentControlAllowed: false, compositionControlAllowed: false };
  return { salience, maxVisualChannels: 6, allowedChannels: ['skill', 'habit', 'wear', 'material', 'social reputation', 'tool', 'direct work scene'], directSceneAllowed: true, environmentControlAllowed: true, compositionControlAllowed: true };
}

function anchorFromSeed(seed: SemanticSeed): SemanticAnchor {
  if (seed.life.professionSalience === 'dominant') return 'profession';
  if (/bargain|cost|forbidden|claim/i.test(`${seed.psychology.relationshipToPower} ${seed.power.cost}`)) return 'forbidden_power';
  if (/protect|dependent|community/i.test(`${seed.currentMoment.goal} ${seed.currentMoment.dependent}`)) return 'social_duty';
  if (/contradiction|balancing|against|versus|doubt/i.test(seed.tension.roleContradiction)) return 'personal_contradiction';
  return 'current_danger';
}

export function directSemantic(seed: SemanticSeed): SemanticDirectorPlan {
  const professionBudget = professionBudgetFor(seed.life.professionSalience);
  const dominantNarrativeAnchor = seed.priorityPlan?.dominant ?? anchorFromSeed(seed);
  const supportingNarrativeAnchor = seed.priorityPlan?.supporting ?? (dominantNarrativeAnchor === 'forbidden_power' ? 'social_duty' : 'class_conflict');
  const minorEcho = seed.priorityPlan?.minor ?? (seed.life.professionSalience === 'trace' ? 'profession_trace' : 'none');
  const suppressedFacts = [...(seed.priorityPlan?.suppressed ?? [])];
  if (!professionBudget.directSceneAllowed) suppressedFacts.push('profession_scene', 'profession_environment', 'profession_composition');
  if (professionBudget.maxVisualChannels <= 1) suppressedFacts.push('profession_tool_as_primary');
  return {
    dominantNarrativeAnchor,
    supportingNarrativeAnchor,
    minorEcho,
    suppressedFacts: [...new Set(suppressedFacts)],
    professionBudget,
    classEvidencePlan: CLASS_EVIDENCE[seed.identity.classId],
    speciesMorphologyPlan: `show ${seed.identity.speciesId.replace(/_/g, ' ')} through proportions, center of gravity, reach, hand scale, and clothing fit`,
    sceneFocus: `${seed.currentMoment.goal} against ${seed.currentMoment.obstacle}`,
    emotionalFocus: seed.psychology.contradiction,
    powerBudget: seed.power.visibility === 'full_apparition' ? 'rare background manifestation only' : 'one local cue subordinate to action',
    professionAffinity: seed.life.professionAffinity,
    priorityCompliance: [
      `profession salience:${seed.life.professionSalience}`,
      `profession max channels:${professionBudget.maxVisualChannels}`,
      `dominant:${dominantNarrativeAnchor}`,
      `supporting:${supportingNarrativeAnchor}`,
    ],
  };
}
