import type { CompiledPrompt, PromptCritique, PromptPlan, PromptWriterAdapter, PromptWriterInput, PromptWriterMode, PromptWriterOutput, PromptWriterResult, SemanticDirectorPlan, SemanticSeed, VisualDirection } from './contracts';
import { directSemantic } from './semanticDirector';

const TARGET_WORDS = 230;
const HARD_MAX_WORDS = 270;
const INTERNAL_LANGUAGE = [
  /expected to perform a class stereotype/gi,
  /courtier work requires/gi,
  /power supports/gi,
  /power stays below/gi,
  /profession influences/gi,
  /shows contradiction/gi,
  /narrative intent/gi,
  /visual consequence/gi,
  /focal hierarchy should/gi,
  /the scene must/gi,
  /attention stays on negotiate status/gi,
  /class stereotype/gi,
  /social gesture/gi,
  /witness relation/gi,
  /status material/gi,
  /threshold composition/gi,
  /affected subject/gi,
  /active space/gi,
  /profession read/gi,
  /species read/gi,
  /supernatural read/gi,
  /current duty/gi,
  /class evidence/gi,
  /material base/gi,
  /dominant environment/gi,
];

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function label(value: string) {
  return value.replace(/[_-]+/g, ' ');
}

function compact(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/;\s*;/g, ';')
    .replace(/\.\s*\./g, '.')
    .replace(/\s+,/g, ',')
    .trim();
}

function hashText(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function choose<T>(seed: SemanticSeed, salt: string, options: T[]) {
  return options[hashText(`${seed.deterministicSeed}:${seed.identity.classId}:${seed.identity.speciesId}:${seed.identity.professionId}:${salt}`) % options.length];
}

function professionInTitle(seed: SemanticSeed) {
  return seed.life.professionSalience === 'strong' || seed.life.professionSalience === 'dominant';
}

function anchorTitle(anchor: string) {
  const labels: Record<string, string> = {
    forbidden_power: 'Keeper of a Costly Bargain',
    social_duty: 'Keeper of the Last Oath',
    personal_contradiction: 'Bearer of a Divided Duty',
    current_danger: 'Watcher at the Breaking Point',
    class_conflict: 'Witness Under Pressure',
    relationship: 'Shield of the Dependent',
    species_presence: 'Figure at the Threshold',
    profession: 'At Work Under Judgment',
  };
  return labels[anchor] ?? 'Figure Under Pressure';
}

function promptTitle(seed: SemanticSeed, plan: SemanticDirectorPlan) {
  const identity = `${label(seed.identity.speciesId)} ${label(seed.identity.classId)}`;
  return professionInTitle(seed) ? `${identity} ${seed.identity.profession}` : `${identity} — ${anchorTitle(plan.dominantNarrativeAnchor)}`;
}

function stripInternalLanguage(text: string) {
  let next = text;
  for (const pattern of INTERNAL_LANGUAGE) next = next.replace(pattern, '');
  return compact(next);
}

function sentenceCase(text: string) {
  const cleaned = compact(text);
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : cleaned;
}

function splitSentences(text: string) {
  return text.split(/(?<=[.!?])\s+/).map((item) => compact(item)).filter(Boolean);
}

function clauseKey(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\b(the|a|an|and|or|to|of|in|on|with|while|as|by|for|from|at|their|his|her|they|them)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function professionSubject(seed: SemanticSeed) {
  if (seed.life.professionSalience === 'background' || seed.life.professionSalience === 'trace') {
    return seed.currentMoment.dependent || seed.currentMoment.targetOfAttention || 'person depending on them';
  }
  const subjects: Record<string, string[]> = {
    physician: ['injured traveler', 'patient on a low cot', 'feverish villager'],
    ferryman: ['river passenger', 'cargo owner', 'nervous child near the gangplank'],
    shrine_keeper: ['petitioner', 'mourner at the roadside altar', 'pilgrim clutching an offering'],
    battlefield_medic: ['wounded ally', 'bleeding scout', 'soldier waiting for triage'],
    surveyor: ['disputed boundary marker', 'landowner at the measuring line', 'tilted marker stone'],
    trapper: ['snared animal', 'wrong creature caught in the cord', 'hunter at the edge of the clearing'],
    undertaker: ['covered body', 'mourner beside the bier', 'unquiet corpse under a plain cloth'],
    courtier: ['harmed dependent', 'person harmed by the sealed order', 'dependent waiting behind them'],
    lamplighter: ['darkened alley', 'last unlit lamp', 'resident waiting below the ladder'],
    tavern_keeper: ['frightened guest', 'argument at the counter', 'patron reaching for the door'],
    smuggler: ['hidden parcel', 'suspicious guard', 'marked crate'],
    investigator: ['physical trace', 'contradictory reflection', 'silent witness'],
    locksmith: ['sealed lock', 'reliquary latch', 'door mechanism'],
    gravedigger: ['open grave edge', 'waiting family', 'muddy coffin rope'],
  };
  return choose(seed, 'subject', subjects[seed.identity.professionId] ?? [seed.currentMoment.dependent || seed.currentMoment.targetOfAttention || 'person depending on them']);
}

function environmentBridge(seed: SemanticSeed) {
  const subject = professionSubject(seed);
  const environment = seed.world.environment;
  const obstacle = seed.currentMoment.obstacle;
  if (seed.life.professionSalience === 'background' || seed.life.professionSalience === 'trace') {
    return choose(seed, 'environment-low-salience', [
      `The ${environment} holds the class conflict in front of the dependent figure, leaving the old trade as a minor trace.`,
      `Near edges of the ${environment} place the obstacle and dependent figure in the same pressure line.`,
      `Useful surfaces in the ${environment} keep attention on body angle, choice, and consequence.`,
      `Scale cues from the ${environment} make the danger clear while the occupational mark stays small.`,
      `The ${environment} narrows around the class decision instead of becoming a workplace vignette.`,
      `Blocked movement in the ${environment} explains why the character has to act now.`,
      `The ${environment} gives the dependent figure a place in the frame without turning into trade scenery.`,
      `Weather and hard surfaces in the ${environment} push attention toward the choice in the foreground.`,
      `The ${environment} stays close to the obstacle, not to the character's former routine.`,
      `A few hard edges in the ${environment} point back to the dependent figure and the risk.`,
      `The ${environment} supports the class-led scene through blocked movement and near-space pressure.`,
      `Only the necessary parts of the ${environment} appear, enough to place the body, obstacle, and subject.`,
      `The ${environment} gives practical footing for the scene while the profession remains only a residue.`,
      `Foreground pressure in the ${environment} keeps the visual story on the current danger.`,
      `The ${environment} sets distance between safety and consequence without becoming a worksite.`,
      `Light and surface in the ${environment} locate the task before any trade detail is noticed.`,
    ]);
  }
  if (seed.identity.professionId === 'ferryman') {
    return choose(seed, 'ferry-bridge', [
      `A river toll table and damp cargo ropes pull the ${environment} back toward the crossing dispute.`,
      `Passenger bundles and a wet mooring line make the ${obstacle} part of a river crossing, not a generic doorway.`,
      `The scene keeps the boat just out of frame through dripping ropes, fare tokens, and river light on the ground.`,
    ]);
  }
  if (seed.identity.professionId === 'battlefield_medic') {
    return choose(seed, 'medic-bridge', [
      `The ${environment} has been turned into a triage corner, with the ${subject} between a blood-dark cloth and the exit.`,
      `Aftermath enters the quiet room through muddy bandages, weapon dents, and a patient waiting for treatment.`,
      `A low cot, torn sleeve, and watched doorway make the calm interior part of the battlefield's aftermath.`,
    ]);
  }
  if (seed.identity.professionId === 'surveyor') {
    return choose(seed, 'surveyor-bridge', [
      `The ${environment} becomes a boundary hearing, with a marked cord running from the doorway to the disputed stone.`,
      `Survey pins and a chalked sightline connect the room to the border outside.`,
      `A rolled map, mud on the floor, and the ${subject} keep the scene tied to land measurement.`,
    ]);
  }
  if (seed.identity.professionId === 'trapper') {
    return choose(seed, 'trapper-bridge', [
      `The ${environment} serves as a temporary holding place for the snare, track mud under the table.`,
      `A bent trap spring, torn grass, and the ${subject} bring the field problem indoors.`,
      `Hunters wait near the doorway while the snare line crosses the floor toward the ${subject}.`,
    ]);
  }
  if (seed.identity.professionId === 'shrine_keeper') {
    return choose(seed, 'shrine-bridge', [
      `A small roadside altar, candle wax, and prayer ribbons make the ${environment} visibly sacred.`,
      `The path bends around a shrine stone, putting the ${subject} between offering bowl and weathered marker.`,
      `Broken votive cups and a hanging charm turn the track into a guarded place of devotion.`,
    ]);
  }
  return choose(seed, 'environment-bridge', [
    `The ${environment} adds weather and scale without stealing attention from the task.`,
    `A few objects in the ${environment} frame the work instead of becoming decoration.`,
    `The ${environment} links foreground, midground, and background to the same immediate problem.`,
    `Edges of the ${environment} press inward, making the action feel close and necessary.`,
    `The ${environment} appears through useful surfaces rather than broad atmosphere.`,
    `Work marks in the ${environment} explain why this moment is happening here.`,
    `The ${environment} gives the scene pressure while the body and hands remain primary.`,
    `Only the nearest parts of the ${environment} are described, enough to locate the task.`,
    `The ${environment} frames the obstacle in practical space, not decorative haze.`,
    `Weather from the ${environment} touches the clothing and tool but leaves the action clear.`,
    `The ${environment} narrows around the task so the viewer can track cause and effect.`,
    `Background details in the ${environment} point back toward the dependent figure.`,
    `The ${environment} works like a stage edge around the subject, tool, and obstacle.`,
    `Material cues from the ${environment} explain the surface underfoot and the light in the room.`,
    `The ${environment} remains quiet enough for the immediate decision to lead.`,
    `The ${environment} supports the current action through scale, weather, and blocked movement.`,
    `Nearby objects in the ${environment} create depth without adding extra story noise.`,
    `The ${environment} is present as pressure on the task, not as a separate landscape study.`,
  ]);
}

function morphologySentence(seed: SemanticSeed, visual: VisualDirection) {
  const species: Record<string, string[]> = {
    gnome: ['A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish', 'Short reach, low balance, and tool-fitted cuffs make the gnome body feel built for close work'],
    dwarf: ['A compact adult build, grounded stance, broad hands, and weight carried through the heels make the dwarf feel physically anchored', 'Heavy hands, short grounded steps, and a low working center give the dwarf practical mass'],
    tiefling: [
      'Horns, tail balance, fitted shoulder layers, and nonhuman eyes are integrated into the working posture rather than treated as decoration',
      'The tiefling body uses horn clearance, tail counterweight, and adjusted layers as part of the task posture',
      'Curved horns, a balanced tail, and cutaway collar layers shape the tiefling silhouette around the work',
      'The tail steadies the stance while sleeves and shoulder layers are cut to leave horns and hands clear',
    ],
    elf: ['A long-lined adult frame, narrow reach, and precise foot placement give the elf a measured physical presence', 'Long limbs, controlled reach, and clean foot placement make the elf read through precision'],
    half_elf: ['Human warmth and elven length meet in an adaptable stance, careful grooming, and sleeves cut for social movement', 'Mixed human and elven proportions show in a flexible stance and socially precise clothing'],
    halfling: ['Small adult proportions, steady feet, and hand-scale tools keep the halfling practical rather than childlike', 'A compact adult scale, sure footing, and close-held tools make the halfling physically credible'],
    half_orc: ['Heavy shoulders, a strong jaw, and work-worn hands give the half-orc weight without turning the pose into a caricature', 'Broad shoulders and worn hands give the half-orc mass, but the stance stays task-focused'],
    dragonborn: ['A draconic head silhouette, scaled hands, crest line, and balanced tail mass shape the body mechanics', 'Scaled hands, crest balance, and a counterweighted tail shape the dragonborn movement around the task'],
    aasimar: ['Human proportions carry a subtle symmetry and calm stillness, with any unusual light kept close to the scene', 'A composed humanlike frame and quiet symmetry make the aasimar presence clear without spectacle'],
    firbolg: ['A large pastoral frame, soft nonhuman face, broad hands, and careful stoop make the firbolg gentle but substantial', 'Broad hands, a gentle nonhuman face, and a careful stoop make the firbolg large without making the scene aggressive'],
    satyr: ['Goatlike lower-body cues, springy balance, expressive ears, and adjusted hems make the satyr read through movement', 'Springy legs, expressive ears, and hems cut around goatlike movement shape the satyr silhouette'],
    human: ['The human body is specific to age, work, and culture, with no blank heroic template', 'Age, trade, and local clothing shape the human body more than any generic hero pose'],
  };
  return `${choose(seed, 'morphology', species[seed.identity.speciesId] ?? [visual.embodiment.proportions])}.`;
}

function courtierStatusObject(seed: SemanticSeed) {
  return /signet/i.test(seed.life.personalObject) ? 'signet ribbon' : 'folded petition';
}

function naturalAction(seed: SemanticSeed) {
  const tool = seed.life.personalObject;
  const subject = professionSubject(seed);
  const action = seed.currentMoment.currentAction.toLowerCase();
  if (seed.identity.professionId === 'courtier' && (seed.life.professionSalience === 'strong' || seed.life.professionSalience === 'dominant')) return `They hold the ${courtierStatusObject(seed)} between their body and the gate official, using the lowered ceremonial blade only as a sign of rank.`;
  if (/keep streets lit/.test(action)) return `They relight the last street lamp as a nearby resident watches from the edge of the street.`;
  if (/prepare the dead/.test(action)) return `They straighten the funeral cloth over the ${subject} while watching for the sign that the rite is not finished.`;
  if (/mark a border/.test(action)) return `They set the measuring line against the ${subject}, checking the angle before anyone can move the marker.`;
  if (/choose who needs care first/.test(action)) return `They choose the ${subject} first, setting ${tool} within reach before the next shout from the doorway.`;
  if (/avoid maiming the wrong creature|trapper/.test(`${action} ${seed.identity.professionId}`)) return `They loosen the snare cord two fingers at a time, trying to free the ${subject} before the hunters arrive.`;
  if (/open|lock/.test(action)) return `They angle ${tool} toward the ${subject}, listening for the smallest change inside the obstruction.`;
  if (/move|carry/.test(action) && seed.identity.professionId === 'ferryman') return `They brace one foot toward the crossing, keeping ${tool} taut while the ${subject} waits behind the cargo line.`;
  if (/repositions around/.test(action)) return `They shift around ${tool} as ${seed.currentMoment.pressure || 'the room changes around them'}.`;
  const dutyMatch = seed.currentMoment.currentAction.match(/^uses (.+?) to keep the duty to (.+?) from failing under pressure/i);
  if (dutyMatch) {
    const purpose = dutyMatch[2]
      .replace(/protect a petitioner/i, `protect ${subject}`)
      .replace(/settle conflict/i, 'settle the argument')
      .replace(/keep accomplices unnamed/i, 'keep the hidden names from being exposed')
      .replace(/avoid maiming the wrong creature/i, 'free the wrong creature without maiming it');
    return `They work the ${tool} through a careful ${seed.identity.profession.replace(/ /g, '-')} exchange so they can ${purpose}.`;
  }
  return `${sentenceCase(seed.currentMoment.currentAction.replace(/uses ([^ ]+)/i, `uses ${tool}`))}.`;
}

function postureGestureSentence(seed: SemanticSeed, visual: VisualDirection) {
  const subject = professionSubject(seed);
  const posture = visual.embodiment.posture.toLowerCase();
  const gesture = visual.embodiment.gesture.toLowerCase();
  const posturePhrase = posture.includes('crouched') ? 'crouch close to the work' :
    posture.includes('balanced') ? 'keep a balanced stance' :
      posture.includes('protective') ? 'turn at a protective angle' :
        posture.includes('upright') ? 'stay upright but ready to move' :
          posture.includes('braced') ? 'brace through the legs' : 'stand slightly off-center';
  if (seed.identity.professionId === 'courtier') return `They ${posturePhrase}, measuring each witness in turn while the negotiating hand stays open.`;
  if (gesture.includes('inspection') || seed.identity.professionId === 'physician') return `They ${posturePhrase}, reading the person's condition through hand placement and close assessment.`;
  if (gesture.includes('listening') || seed.identity.professionId === 'locksmith') return `They ${posturePhrase}, listening through the hand set against the mechanism.`;
  if (gesture.includes('binding') || seed.identity.professionId === 'trapper') return `They ${posturePhrase}, controlling the line without tightening it further.`;
  return choose(seed, 'gesture-sentence', [
    `They ${posturePhrase}, letting the working hand lead the viewer to the problem.`,
    `They ${posturePhrase}, keeping the tool low and the attention on the failing task.`,
    `They ${posturePhrase}, using the nearest hand to test the obstacle before moving.`,
    `They ${posturePhrase}, setting the object between the dependent figure and the threat.`,
    `They ${posturePhrase}, drawing the eye from face to hand to obstacle.`,
    `They ${posturePhrase}, making the gesture small enough to feel practiced.`,
    `They ${posturePhrase}, holding the action at the exact point before failure.`,
    `They ${posturePhrase}, keeping the body angled toward both subject and exit.`,
    `They ${posturePhrase}, turning the hand position into the clearest sign of skill.`,
    `They ${posturePhrase}, letting the task shape the arm line instead of a heroic pose.`,
    `They ${posturePhrase}, leaving one hand free to react to the obstacle.`,
    `They ${posturePhrase}, using a short controlled motion rather than display.`,
  ]);
}

function spatialSentence(seed: SemanticSeed) {
  const subject = professionSubject(seed);
  if (seed.identity.professionId === 'courtier') {
    return 'The sealed archive arch fills the midground; the official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder.';
  }
  return choose(seed, 'spatial', [
    `The dependent figure stays within arm's reach, with the obstacle set between them and the exit.`,
    `Foreground hands lead toward the task, the obstacle holds the midground, and the background stays quiet.`,
    `The character stands between the dependent figure and ${seed.currentMoment.obstacle}, watching the point where the task could fail.`,
    `The tool sits in the foreground, the dependent figure waits to one side, and ${seed.currentMoment.obstacle} blocks the next step.`,
    `A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them.`,
    `The scene places the character at the hinge between ${seed.currentMoment.obstacle} and the waiting subject.`,
    `The dependent figure stays just behind the working shoulder as the obstacle occupies the center of the frame.`,
    `The task unfolds in close space: hand in front, obstacle at mid-distance, witness pressure behind.`,
    `The body partly shields the person at risk while the working hand reaches into the problem.`,
    `The frame keeps subject, tool, and obstacle close enough to be read in one glance.`,
    `The character occupies the narrow gap where the obstacle, dependent figure, and exit meet.`,
    `A tight foreground hand points to the failure point while the background recedes into quiet pressure.`,
    `The composition turns the obstacle into a physical barrier rather than a mood word.`,
    `The person at risk stays offset from the main action, close enough to explain the urgency.`,
    `The dependent figure waits near the edge of the action, close enough to make the stakes clear.`,
    `The working object anchors the foreground as the obstacle interrupts the path beyond it.`,
    `The gaze line runs across the tool, through the obstacle, and back to the person waiting for the result.`,
  ]);
}

function clothingSentence(seed: SemanticSeed) {
  if (seed.life.professionSalience === 'background') return `${sentenceCase(seed.life.materialHistory)} and species-fitted layers show only the wear needed by the current danger.`;
  if (seed.life.professionSalience === 'trace') return `${sentenceCase(seed.life.livedInTrace)} appears as a single occupational trace, and the clothing follows class pressure and body scale.`;
  if (seed.identity.professionId === 'courtier') {
    const statusDetail = courtierStatusObject(seed) === 'signet ribbon' ? 'a signet cord catching the light' : 'a petition crease catching the light';
    return `Formal court silk is repaired at the wrist, with ${statusDetail}.`;
  }
  const byProfession: Record<string, string[]> = {
    physician: ['Shortened sleeves, clean-but-mended cuffs, and a narrow apron panel leave the hands clear for assessment'],
    ferryman: ['A weathered ferry coat, weighted hems, and rope-polished palms show long work around moving water'],
    smuggler: ['Layered travel cloth hides reinforced seams, with one worn strap shaped by repeated inspections'],
    shrine_keeper: ['Wax-stiff cuffs, an offering pouch, and worn knees tie the clothing to daily shrine care'],
    undertaker: ['Dark plain cloth, repaired cuff edges, and dust at the knees keep the work solemn and physical'],
    lamplighter: ['An oil-dark apron panel, reinforced cuff edges, and soot along one sleeve mark the lamp work'],
    tavern_keeper: ['Rolled sleeves, heat-worn fabric, and a key cord at the waist show work behind a busy counter'],
    battlefield_medic: ['Bandage lint, torn cuff edges, and stained reinforced sleeves keep the role visible without extra gear'],
    surveyor: ['Weathered field cloth, a map tube strap, and chalk at the fingertips connect clothing to measurement'],
    trapper: ['Snagged field cloth, patched knees, and cord-burned gloves show work near brush and snares'],
  };
  return `${choose(seed, 'clothing', byProfession[seed.identity.professionId] ?? [`${sentenceCase(seed.life.materialHistory)} shows at stress points, with clothing shaped by ${seed.identity.profession}`])}.`;
}

function toolSentence(seed: SemanticSeed) {
  if (seed.identity.professionId === 'courtier' && (seed.life.professionSalience === 'strong' || seed.life.professionSalience === 'dominant')) return `The ${courtierStatusObject(seed)} is the clear status object; the ceremonial blade remains lowered and never becomes a dueling weapon.`;
  return choose(seed, 'tool', [
    `No trophy pose interrupts the work; the object stays close to the task.`,
    `Only one primary tool matters, kept low instead of displayed like a trophy.`,
    `The working object points the viewer back to the immediate problem.`,
    `The hand treats the object as equipment, not ornament.`,
    `The grip keeps the object useful rather than ornamental.`,
    `The object sits in a working grip instead of a display grip.`,
    `The tool is caught mid-use, close enough to explain the next decision.`,
    `The next decision is clear from how the object sits between hand and obstacle.`,
    `A single object carries the work, leaving no room for duplicate props.`,
    `The object remains near the point of failure instead of becoming a costume accent.`,
    `The grip shows familiarity without turning the tool toward the viewer.`,
    `The tool sits where the action needs it, between hand and obstacle.`,
    `A single handled object keeps the task clear without crowding the outline.`,
    `The object gives the hand a purpose and leaves the outline simple.`,
    `The working hand makes the tool feel necessary rather than decorative.`,
    `The object is placed for use, not display, and stays subordinate to face and action.`,
    `The tool's scale matches the body and keeps attention on the task.`,
    `The held object creates a clear line from hand to obstacle.`,
    `The tool is the practical bridge between intention and risk.`,
    `The object remains close to the dependent figure, tying equipment to responsibility.`,
  ]);
}

function powerSentence(seed: SemanticSeed, visual: VisualDirection) {
  const subject = professionSubject(seed);
  if (seed.identity.professionId === 'courtier' && seed.power.visibility === 'shadow') return 'A faint shadow echo curls once beside the negotiating hand, barely darker than the archway shade.';
  if (seed.power.visibility === 'none') return choose(seed, 'no-power', [
    'No glow appears because skill, timing, and responsibility carry the tension.',
    'Nothing supernatural is shown, leaving trained hands and public consequence to carry the pressure.',
    'The scene stays non-magical, relying on posture, tool use, and urgent attention.',
    `No visible effect appears, leaving the character's choices to carry the moment.`,
    'The uncanny is absent; only discipline and responsibility shape the image.',
    'No shimmer interrupts the physical action.',
  ]);
  if (seed.power.visibility === 'latent') return choose(seed, 'latent-power', [
    `No glow appears as their breath pauses unnaturally before the dependent figure shifts.`,
    `Nothing shines, and the only strange sign is a held breath just before the obstacle gives.`,
    `The uncanny cue stays inside the body, visible only in a pause of breath and fingers.`,
    `No light marks the moment; a still hand before the next move carries the strangeness.`,
    `The hidden force reads as a tiny interruption in breathing, not a spectacle.`,
    `The scene offers only a brief unnatural quiet around the working hand.`,
  ]);
  if (seed.power.visibility === 'behavioral') return choose(seed, 'behavioral-power', [
    'The room falls silent a beat before they speak, as though timing itself carries pressure.',
    'A pause moves through the witnesses before the character lifts a hand.',
    'The strange pressure appears as perfect timing rather than a visible effect.',
    'Everyone nearby hesitates at once, making the silence part of the action.',
    'The only uncanny sign is how the moment waits for their next breath.',
    'People react a heartbeat early, before the character changes expression.',
    'The behavior of the room shifts first, quieting around the working hand.',
    'A small delay in every observer turns the gesture into the unsettling cue.',
  ]);
  if (seed.power.visibility === 'social') return choose(seed, 'social-power', [
    'People nearby step back before any command is given.',
    'A witness lowers their voice as soon as the character turns.',
    'The nearest onlooker gives ground without being touched.',
    'The crowd response changes first, before the character says a word.',
    'A hush moves through the room faster than any visible sign.',
    'Authority shows in the way others make space around the action.',
    'The social pressure is visible in averted eyes and a widened path.',
  ]);
  if (seed.power.visibility === 'relational') return `The ${subject} reacts before the character moves, sensing a bargain in the pause.`;
  if (seed.power.visibility === 'reflected') return choose(seed, 'reflected-power', [
    'A reflection in wet stone moves half a second later than the body.',
    'The wet floor shows the hand arriving a heartbeat after it actually moves.',
    'A dim reflection near the obstacle lags behind the character by a breath.',
    'In the nearest puddle, the tool angle changes a moment too late.',
    'A reflected outline in the stone answers the gesture after the hand has stopped.',
    'Only the floor reflection misbehaves, delayed just enough to feel wrong.',
  ]);
  if (seed.power.visibility === 'object') return `A dim response passes inside the ${seed.life.personalObject}, contained to the object.`;
  if (seed.power.visibility === 'shadow') return `A small shadow gathers beside the working hand and stops before it becomes a second figure.`;
  if (seed.power.visibility === 'environmental') return `The nearby ${seed.world.weather} answers in one localized place around the task.`;
  if (seed.power.visibility === 'bodily') return 'Breath, skin tension, and finger pressure carry the strain without spectacle.';
  if (seed.power.visibility === 'symbolic') return 'One small mark on the tool darkens briefly, then settles.';
  if (seed.power.visibility === 'partial') return 'A partial sign appears at the obstacle and stays behind the face and hands.';
  if (seed.power.visibility === 'full_apparition') return 'A distant apparition remains far behind the action, faint and subordinate to the body.';
  return `${sentenceCase(visual.power.manifestation)}.`;
}

function lightingSentence(seed: SemanticSeed) {
  const byProfession: Record<string, string[]> = {
    courtier: ['Pale window light catches the petition edge and the negotiating hand, leaving the sealed arch in cooler shade'],
    physician: ['One cold lamp catches the physician hands while the patient remains partly in shadow'],
    ferryman: ['Reflected river light moves across the coat hem and the wet rope'],
    shrine_keeper: ['Small altar light warms the offering bowl while the path behind stays dim'],
    battlefield_medic: ['Hard doorway light separates the medic hands from the wounded body and the waiting figures'],
    surveyor: ['Thin side light catches the measuring line and the disputed mark'],
    trapper: ['Hard doorway light cuts across the snare cord and leaves the hunters behind in shadow'],
    lamplighter: ['The new flame lights the lamp glass first, then the small working hands below it'],
    tavern_keeper: ['Low hearth light catches the counter edge and leaves the doorway colder'],
    undertaker: ['Soft grey light rests on the funeral cloth and leaves the room edges quiet'],
  };
  const professionLighting = (seed.life.professionSalience === 'strong' || seed.life.professionSalience === 'dominant') ? byProfession[seed.identity.professionId] : undefined;
  return `${choose(seed, 'lighting', professionLighting ?? [
    `${sentenceCase(seed.world.weather)} light catches the tool and hands while the background stays quiet`,
    `A narrow band of ${seed.world.weather} light picks out the working hand and the obstacle`,
    `Low ${seed.world.weather} light separates the face from the object in use`,
    `Reflected ${seed.world.weather} light touches the floor before reaching the hand`,
    `A small pocket of ${seed.world.weather} light marks the place where the task could fail`,
    `Soft ${seed.world.weather} light stays near the tool and leaves the distance muted`,
    `The ${seed.world.weather} light is strongest on the hand, not the costume`,
    `A practical edge of ${seed.world.weather} light clarifies the body angle and obstacle`,
  ])}.`;
}

function closingSentence(seed: SemanticSeed) {
  return choose(seed, 'closing', [
    'Let the face, hands, and immediate task carry the image before the environment.',
    'Keep extra props out of the frame so the single action remains clear.',
    'Use grounded surfaces and calm spacing around the body.',
    'The background should support the task without competing for attention.',
    'Leave enough negative space for the silhouette and working hand to read.',
    'Hold detail at the cuffs, tool, and obstacle rather than spreading it everywhere.',
    'Avoid ornamental clutter so the scene stays grounded and usable for concept art.',
    'Let material wear and body angle do more work than decorative effects.',
    'Keep the image legible at full-body scale, with the immediate task first.',
    'Use simple material planes and a quiet background to preserve the action.',
    'Let the staging explain the character before any costume detail does.',
    'Keep the final image focused on a single decision under pressure.',
    'Let the obstacle, body angle, and tool carry the last note of the brief.',
    'Hold the scene at the moment where action still matters.',
    'Keep nearby surfaces useful, close, and subordinate to the figure.',
    'Let the subject, obstacle, and hand position remain easy to parse.',
    'Keep the last note on the choice, not the costume.',
    'Let the frame breathe around face, hand, and obstacle.',
    'Hold extra material outside the frame so the decision leads.',
    'Make the body angle explain the risk before decoration appears.',
    'Keep the nearest subject and obstacle clear at thumbnail scale.',
    'End the brief with one readable action and no ornamental noise.',
    'Let the scene stay close enough for the viewer to understand the stakes.',
    'Use empty space around the hand to protect the main action.',
    'Keep the figure grounded in the moment instead of display.',
    'Let the final image favor consequence over costume inventory.',
  ]);
}

function buildPromptSections(seed: SemanticSeed, visual: VisualDirection, plan: SemanticDirectorPlan) {
  return [
    `Full-body cinematic painted fantasy character concept: ${promptTitle(seed, plan)}.`,
    morphologySentence(seed, visual),
    naturalAction(seed),
    spatialSentence(seed),
    postureGestureSentence(seed, visual),
    clothingSentence(seed),
    toolSentence(seed),
    powerSentence(seed, visual),
    environmentBridge(seed),
    lightingSentence(seed),
    closingSentence(seed),
  ];
}

function dedupeSentences(sentences: string[]) {
  const seen = new Set<string>();
  const removed: string[] = [];
  const kept: string[] = [];
  for (const sentence of sentences) {
    const cleaned = stripInternalLanguage(sentence);
    if (!cleaned) continue;
    const key = clauseKey(cleaned);
    if (key && seen.has(key)) {
      removed.push(cleaned);
      continue;
    }
    seen.add(key);
    kept.push(sentenceCase(cleaned).replace(/([^.!?])$/, '$1.'));
  }
  return { kept, removed };
}

function compressPrompt(sentences: string[]) {
  const trace: string[] = [];
  const deduped = dedupeSentences(sentences);
  if (deduped.removed.length) trace.push(`removed duplicates:${deduped.removed.length}`);
  let kept = deduped.kept;
  let prompt = kept.join(' ');
  if (countWords(prompt) > TARGET_WORDS) {
    const before = kept.length;
    kept = kept.filter((sentence) => !/background secondary|surfaces calm|detail restrained/i.test(sentence));
    if (kept.length !== before) trace.push(`trimmed closing clauses:${before - kept.length}`);
    prompt = kept.join(' ');
  }
  while (countWords(prompt) > HARD_MAX_WORDS && kept.length > 6) {
    kept.splice(-2, 1);
    trace.push('word-count trim:removed secondary sentence');
    prompt = kept.join(' ');
  }
  return { prompt: compact(prompt), trace };
}

function repeatedLongPhraseCount(prompt: string) {
  const words = prompt.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  const ignored = new Set(['and', 'the', 'of', 'to', 'a', 'as', 'with', 'in', 'or', 'is', 'on', 'while', 'through', 'for', 'by', 'from', 'at', 'into', 'they', 'their']);
  const seen = new Set<string>();
  let repeats = 0;
  for (let index = 0; index <= words.length - 4; index += 1) {
    const chunk = words.slice(index, index + 4);
    if (chunk.some((word) => ignored.has(word))) continue;
    const phrase = chunk.join(' ');
    if (seen.has(phrase)) repeats += 1;
    seen.add(phrase);
  }
  return repeats;
}

function hasInternalLanguage(prompt: string) {
  return INTERNAL_LANGUAGE.some((pattern) => { pattern.lastIndex = 0; return pattern.test(prompt); });
}

function hasFragmentSentence(sentence: string) {
  const cleaned = sentence.replace(/[.!?]$/, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length < 4) return true;
  if (/^(measures every witness|guarded asymmetry|balanced step into pressure|quiet lateral repositioning|controlled turn toward the threat)$/i.test(cleaned)) return true;
  return false;
}

export function lintPrompt(prompt: string, negativePrompt: string) {
  const warnings: string[] = [];
  if (/blue or violet|red or gold|staff or sword/i.test(prompt)) warnings.push('unresolved alternative');
  if (/\b[a-z][a-z-]+\s+or\s+[a-z][a-z-]+\b/i.test(prompt)) warnings.push('unresolved or alternative');
  if (/\b[a-z][a-z-]+\/[a-z][a-z-]+\b/i.test(prompt)) warnings.push('unresolved slash alternative');
  if (/\([^)]*(?:\bor\b|\/)[^)]*\)/i.test(prompt)) warnings.push('unresolved parenthetical alternative');
  const lower = prompt.toLowerCase();
  const sentences = splitSentences(prompt);
  const keys = new Set<string>();
  for (const sentence of sentences) {
    const key = clauseKey(sentence);
    if (key && keys.has(key)) warnings.push('duplicated clause');
    keys.add(key);
    if (sentence.split(/\s+/).length > 45) warnings.push('sentence over 45 words');
    if (hasFragmentSentence(sentence) && !/^No glow appears because/i.test(sentence)) warnings.push('fragment sentence');
  }
  if (repeatedLongPhraseCount(prompt) > 0) warnings.push('repeated 4 word phrase');
  const openings = new Map<string, number>();
  for (const sentence of sentences) {
    const opening = sentence.toLowerCase().split(/\s+/).slice(0, 4).join(' ');
    if (!opening) continue;
    openings.set(opening, (openings.get(opening) || 0) + 1);
  }
  if ([...openings.values()].some((count) => count > 1)) warnings.push('repeated sentence opening');
  if (/failure would mean if|if [^.]{0,80} if /i.test(prompt)) warnings.push('malformed conditional');
  if (/attention stays on\s+(negotiate|protect|avoid|settle|notice|keep)\b/i.test(prompt)) warnings.push('unresolved infinitive target');
  if (/uses [^.]{0,80} to keep the duty|remains in the active space|The risk is|Gaze goes to|Rendering constraints:|Localized [^.]+ light using/i.test(prompt)) warnings.push('unnatural compiler phrase');
  if ((prompt.match(/;/g) || []).length > 3) warnings.push('excessive semicolon chains');
  if ((prompt.match(/\bwhile\b/gi) || []).length > 2) warnings.push('too many while clauses');
  if ((prompt.match(/\bwith\b/gi) || []).length > 4) warnings.push('too many with clauses');
  for (const adjective of ['controlled', 'restrained', 'practical', 'readable', 'visible', 'secondary']) {
    if ((lower.match(new RegExp(`\\b${adjective}\\b`, 'g')) || []).length > 3) warnings.push(`repeated adjective:${adjective}`);
  }
  if (hasInternalLanguage(prompt)) warnings.push('internal taxonomy leakage');
  if (/id:|schemaVersion|deterministicSeed|class\.|profession\.|species\./i.test(prompt)) warnings.push('internal id leakage');
  if (/visible demon|towering patron|patron in the sky/i.test(prompt) && !/visible patron unless explicitly selected/i.test(negativePrompt)) warnings.push('patron visibility leak');
  if (/aura|floating rune|magical glow|generic purple|purple smoke|purple warlock|readable runes/i.test(prompt)) warnings.push('forbidden power/color wording');
  if (countWords(prompt) > HARD_MAX_WORDS) warnings.push('prompt over 270 words');
  return [...new Set(warnings)];
}


export function planPrompt(seed: SemanticSeed, visual: VisualDirection, semanticPlan: SemanticDirectorPlan, targetWordCount = TARGET_WORDS): PromptPlan {
  return {
    title: promptTitle(seed, semanticPlan),
    essentialFacts: [semanticPlan.dominantNarrativeAnchor, semanticPlan.supportingNarrativeAnchor, seed.identity.classId, seed.identity.speciesId, seed.currentMoment.obstacle, visual.life.primaryTool],
    suppressedFacts: semanticPlan.suppressedFacts,
    targetWordCount,
    stylePreset: 'cinematic grounded character concept',
  };
}

export function writeDraftPrompt(seed: SemanticSeed, visual: VisualDirection, semanticPlan: SemanticDirectorPlan) {
  return compressPrompt(buildPromptSections(seed, visual, semanticPlan).flatMap((section) => splitSentences(section)));
}

export function critiquePrompt(draftPrompt: string, plan: PromptPlan, seed: SemanticSeed): PromptCritique {
  const professionMentions = (draftPrompt.toLowerCase().match(new RegExp(`\\b${seed.identity.profession.toLowerCase()}\\b`, 'g')) || []).length;
  const draftLower = draftPrompt.toLowerCase();
  const conflicts = lintPrompt(draftPrompt, '').filter((warning) => /internal|unresolved|duplicated|malformed/.test(warning));
  const redundantDetails = plan.suppressedFacts.filter((fact) => draftLower.includes(fact.replace(/_/g, ' ')));
  const professionOverweight = seed.life.professionSalience !== 'dominant' && professionMentions > 1;
  const observations = [
    professionOverweight ? 'profession needs reduction' : 'profession budget respected',
    redundantDetails.length ? 'suppressed detail found' : 'suppressed detail clear',
    conflicts.length ? 'lint conflicts require rewrite' : 'lint conflicts clear',
  ];
  return {
    dominantAnchorClear: draftLower.includes(plan.essentialFacts[0].replace(/_/g, ' ')) || draftLower.includes(seed.currentMoment.obstacle.toLowerCase()) || draftLower.includes(seed.power.cost.toLowerCase().split(' ')[0]),
    anchorInterpretationVisible: draftLower.includes(seed.priorityPlan.anchorInterpretation.split(' ')[0]),
    classReadable: draftLower.includes(seed.identity.classId.replace(/_/g, ' ')) || draftLower.includes(seed.psychology.relationshipToPower.split(' ')[0].toLowerCase()),
    speciesReadable: draftLower.includes(seed.identity.speciesId.replace(/_/g, ' ')) || draftLower.includes('proportions'),
    professionOverweight,
    sceneClear: draftLower.includes(seed.currentMoment.obstacle.toLowerCase().split(' ')[0]) || draftLower.includes('dependent'),
    actionTimingClear: draftLower.includes(seed.priorityPlan.sceneStrategy.split('_')[0]) || draftLower.includes('action') || draftLower.includes('moment'),
    subjectRoleClear: draftLower.includes('dependent') || draftLower.includes(seed.currentMoment.dependent.toLowerCase().split(' ')[0]),
    obstacleRoleClear: draftLower.includes(seed.currentMoment.obstacle.toLowerCase().split(' ')[0]),
    conflictCarrierVisible: draftLower.includes(seed.priorityPlan.conflictCarrier.replace(/_/g, ' ').split(' ')[0]),
    visualHierarchyCoherent: true,
    redundantDetails,
    conflicts,
    promptTooLiteral: /must|should|requires/.test(draftLower),
    promptTooAbstract: !/(hand|body|face|obstacle|threshold|tool|object|witness|dependent)/.test(draftLower),
    professionDominates: professionOverweight,
    classStereotypeLeakage: /purple warlock|white-gold cleric|red tiefling/.test(draftLower),
    unresolvedAlternatives: /\bor\b|\//.test(draftLower) && /petition or|blue or|staff or|sword or|\//.test(draftLower),
    imageModelAmbiguity: conflicts.length > 0,
    observations,
    compressionRatio: 0,
  };
}

export function rewritePrompt(draftPrompt: string, critique: PromptCritique, targetWordCount = TARGET_WORDS) {
  const sentences = splitSentences(stripInternalLanguage(draftPrompt));
  const kept: string[] = [];
  const removed: string[] = [];
  for (const sentence of sentences) {
    if (/profession scene|profession tool|profession title|profession environment|profession composition/i.test(sentence)) {
      removed.push(sentence);
      continue;
    }
    kept.push(sentence);
  }
  while (countWords(kept.join(' ')) > targetWordCount && kept.length > 7) {
    const removedSentence = kept.splice(-2, 1)[0];
    removed.push(removedSentence);
  }
  return { finalPrompt: compact(kept.join(' ')), removedDetails: removed };
}


function buildWriterInput(seed: SemanticSeed, visual: VisualDirection, semanticPlan: SemanticDirectorPlan, maxWords: number): PromptWriterInput {
  return {
    semanticSeed: seed,
    semanticDirectorPlan: semanticPlan,
    situationGraph: { nodes: [], edges: [] },
    visualDirection: visual,
    hardConstraints: visual.artDirection.negativeConstraints,
    targetWordCount: Math.min(maxWords, HARD_MAX_WORDS),
    stylePreset: 'cinematic grounded character concept',
    forbiddenPatterns: INTERNAL_LANGUAGE.map((pattern) => pattern.source),
    priorityPlan: seed.priorityPlan,
  };
}

export class LocalHeuristicPromptWriter implements PromptWriterAdapter {
  mode: PromptWriterMode = 'local';
  plan(input: PromptWriterInput) { return planPrompt(input.semanticSeed, input.visualDirection, input.semanticDirectorPlan, input.targetWordCount); }
  draft(input: PromptWriterInput, plan: PromptPlan) { return writeDraftPrompt(input.semanticSeed, input.visualDirection, input.semanticDirectorPlan).prompt; }
  critique(input: PromptWriterInput, draftPrompt: string) { return critiquePrompt(draftPrompt, this.plan(input), input.semanticSeed); }
  rewrite(input: PromptWriterInput, draftPrompt: string, critique: PromptCritique): PromptWriterOutput {
    const rewritten = rewritePrompt(draftPrompt, critique, input.targetWordCount);
    const negativePrompt = buildNegativePrompt();
    return { promptPlan: this.plan(input), draftPrompt, critique, finalPrompt: rewritten.finalPrompt, negativePrompt, removedDetails: rewritten.removedDetails, priorityCompliance: input.semanticDirectorPlan.priorityCompliance, warnings: lintPrompt(rewritten.finalPrompt, negativePrompt) };
  }
}

export class MockLlmPromptWriter extends LocalHeuristicPromptWriter {
  mode: PromptWriterMode = 'mock_llm';
  rewrite(input: PromptWriterInput, draftPrompt: string, critique: PromptCritique): PromptWriterOutput {
    const sentences = splitSentences(stripInternalLanguage(draftPrompt));
    const removedDetails: string[] = [];
    const kept = sentences.filter((sentence, index) => {
      const removable = index > 1 && /background|extra props|environment|costume|ornament|material wear|subordinate|without competing|frame breathe|final image|brief|let the|make the|end the|keep nearby|clean silhouette|natural materials|without stealing|weather and scale|light clarifies/i.test(sentence);
      if (removable || (index > 7 && index % 3 === 1) || (index > 8 && index % 4 === 2)) {
        removedDetails.push(sentence);
        return false;
      }
      return true;
    });
    while (countWords(kept.join(' ')) > input.targetWordCount * 0.78 && kept.length > 6) {
      removedDetails.push(kept.splice(-2, 1)[0]);
    }
    const finalPrompt = compact(kept.join(' '));
    const negativePrompt = buildNegativePrompt();
    const promptPlan = this.plan(input);
    const observations = [...critique.observations, `mock rewrite removed ${removedDetails.length} secondary details`, 'dominant anchor preserved during mock rewrite'];
    return { promptPlan, draftPrompt, critique: { ...critique, observations }, finalPrompt, negativePrompt, removedDetails, priorityCompliance: input.semanticDirectorPlan.priorityCompliance, warnings: lintPrompt(finalPrompt, negativePrompt) };
  }
}

export class LlmPromptWriterAdapter extends LocalHeuristicPromptWriter {
  mode: PromptWriterMode = 'external_llm';
  rewrite(input: PromptWriterInput, draftPrompt: string, critique: PromptCritique): PromptWriterOutput {
    const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env;
    if (!env?.DICEBORN_LLM_PROMPT_WRITER) {
      return new LocalHeuristicPromptWriter().rewrite(input, draftPrompt, { ...critique, observations: [...critique.observations, 'external LLM not configured; local fallback used'] });
    }
    return new LocalHeuristicPromptWriter().rewrite(input, draftPrompt, { ...critique, observations: [...critique.observations, 'external LLM adapter contract ready; provider implementation not invoked in repository'] });
  }
}

function selectPromptWriter(mode: PromptWriterMode): PromptWriterAdapter {
  if (mode === 'mock_llm') return new MockLlmPromptWriter();
  if (mode === 'external_llm') return new LlmPromptWriterAdapter();
  return new LocalHeuristicPromptWriter();
}

function buildNegativePrompt() {
  return 'No text, logos, duplicate props, no extra props, no decorative clutter, no duplicate tools, belt clutter, noisy microdetail, tiled/checker/rhombus artifacts, all-over surface noise, generic heroic stance, class-color stereotype, visible patron unless explicitly selected, aura, floating runes, generic purple.';
}

export function compilePrompt(seed: SemanticSeed, visual: VisualDirection, maxWords = HARD_MAX_WORDS, semanticPlan = directSemantic(seed), writerMode: PromptWriterMode = 'local'): CompiledPrompt {
  const writer = selectPromptWriter(writerMode);
  const writerInput = buildWriterInput(seed, visual, semanticPlan, maxWords);
  const promptPlan = writer.plan(writerInput);
  const compressed = writeDraftPrompt(seed, visual, semanticPlan);
  const draftPrompt = writer.draft(writerInput, promptPlan);
  const critique = writer.critique(writerInput, draftPrompt);
  const writerOutput = writer.rewrite(writerInput, draftPrompt, critique);
  let prompt = writerOutput.finalPrompt;
  const effectiveMax = Math.min(maxWords, HARD_MAX_WORDS);
  let trace = ['natural sections:identity,morphology,scene,spatial staging,profession evidence,tool,power,environment,lighting', ...compressed.trace];
  if (countWords(prompt) > effectiveMax) {
    const sentences = splitSentences(prompt);
    while (countWords(sentences.join(' ')) > effectiveMax && sentences.length > 6) {
      sentences.splice(-2, 1);
      trace.push('final trim:removed low-priority sentence');
    }
    prompt = compact(sentences.join(' '));
  }
  prompt = stripInternalLanguage(prompt);
  prompt = prompt.replace(/; /g, '. ').replace(/\bvisible\b/g, 'clear');
  prompt = prompt.replace(/(light) light\b/gi, '$1');
  prompt = splitSentences(prompt).map((sentence) => sentenceCase(sentence).replace(/([^.!?])$/, '$1.')).join(' ');
  const negativePrompt = writerOutput.negativePrompt;
  const warnings = lintPrompt(prompt, negativePrompt);
  trace = [...trace, 'removed internal taxonomy during normalization', `final word count:${countWords(prompt)}`, `lint warnings:${warnings.length}`];
  const promptWriter: PromptWriterResult = {
    promptPlan,
    draftPrompt,
    critique: { ...critique, compressionRatio: draftPrompt ? 1 - (countWords(prompt) / countWords(draftPrompt)) : 0 },
    finalPrompt: prompt,
    writerMode,
    negativePrompt,
    warnings,
    removedDetails: writerOutput.removedDetails,
    priorityCompliance: semanticPlan.priorityCompliance,
  };
  return {
    prompt,
    negativePrompt,
    wordCount: countWords(prompt),
    lintWarnings: warnings,
    compilerTrace: [...trace, `draft word count:${countWords(draftPrompt)}`, `rewrite removed:${writerOutput.removedDetails.length}`, `writer mode:${writerMode}`],
    promptWriter,
  };
}
