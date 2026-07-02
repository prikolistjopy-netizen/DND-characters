# Writer Mode Comparison

Twelve fixed semantic seeds generated in local and mock_llm modes.

| Case | Local draft words | Local final words | Mock draft words | Mock final words | Mock compression | Removed details | Mock critique observations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| warlock-courtier | 182 | 182 | 182 | 171 | 6.04% | 1 | profession needs reduction; suppressed detail clear; lint conflicts clear |
| cleric-smuggler | 149 | 149 | 149 | 125 | 16.11% | 2 | profession budget respected; suppressed detail clear; lint conflicts clear |
| fighter-ferryman | 143 | 143 | 143 | 133 | 6.99% | 1 | profession budget respected; suppressed detail clear; lint conflicts clear |
| rogue-shrine | 141 | 141 | 141 | 118 | 16.31% | 2 | profession budget respected; suppressed detail clear; lint conflicts clear |
| paladin-courtier | 156 | 156 | 156 | 135 | 13.46% | 2 | profession budget respected; suppressed detail clear; lint conflicts clear |
| druid-undertaker | 159 | 158 | 159 | 148 | 6.92% | 1 | profession budget respected; suppressed detail clear; lint conflicts clear |
| artificer-lamp | 154 | 154 | 154 | 145 | 5.84% | 1 | profession budget respected; suppressed detail clear; lint conflicts clear |
| bard-tavern | 152 | 152 | 152 | 124 | 18.42% | 2 | profession budget respected; suppressed detail clear; lint conflicts clear |
| barbarian-medic | 156 | 156 | 156 | 121 | 22.44% | 3 | profession budget respected; suppressed detail clear; lint conflicts clear |
| ranger-surveyor | 141 | 141 | 141 | 120 | 14.89% | 2 | profession budget respected; suppressed detail clear; lint conflicts clear |
| monk-trapper | 163 | 163 | 163 | 153 | 6.13% | 1 | profession budget respected; suppressed detail clear; lint conflicts clear |
| wizard-archivist | 134 | 133 | 134 | 100 | 25.37% | 3 | profession budget respected; suppressed detail clear; lint conflicts clear |

## Verification

- WARNING: warlock-courtier: mock final may obscure dominant anchor
- WARNING: warlock-courtier: mock final may increase profession weight
- WARNING: rogue-shrine: mock final may obscure dominant anchor
- WARNING: paladin-courtier: mock final may obscure dominant anchor
- WARNING: bard-tavern: mock final may obscure dominant anchor
- WARNING: barbarian-medic: mock final may obscure dominant anchor
- WARNING: ranger-surveyor: mock final may obscure dominant anchor
- WARNING: wizard-archivist: mock final may obscure dominant anchor

## External LLM Readiness Gaps

The current `external_llm` path is an adapter placeholder, not an integrated provider. Remaining work before real external LLM use:

- Provider interface implementation and model/provider selection.
- API call boundary outside deterministic core.
- JSON schema validation for the expected writer response.
- Retry behavior with bounded attempts.
- Timeout handling and cancellation.
- Malformed response handling with safe local fallback.
- Prompt injection protection around semantic data and hard constraints.
- Structured logging without leaking private user content.
- Privacy policy for sending seed/prompt data to a provider.
- Deterministic limitations: external outputs will not be seed-stable unless cached or provider-determinism is guaranteed.
- Cost controls, rate limits, and feature-flag rollout.

### warlock-courtier

**Local draft (182 words)**

Full-body cinematic painted fantasy character concept: gnome warlock courtier. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. They hold the folded petition between their body and the gate official, using the lowered ceremonial blade only as a sign of rank. The sealed archive arch fills the midground; the official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The folded petition is the clear status object; the ceremonial blade remains lowered and never becomes a dueling weapon. A reflection in wet stone moves half a second later than the body. Work marks in the quiet parish room explain why this moment is happening here. Pale window light catches the petition edge and the negotiating hand, leaving the sealed arch in cooler shade. Keep the final image focused on a single decision under pressure.

**Local final (182 words)**

Full-body cinematic painted fantasy character concept: gnome warlock courtier. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. They hold the folded petition between their body and the gate official, using the lowered ceremonial blade only as a sign of rank. The sealed archive arch fills the midground. The official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The folded petition is the clear status object. The ceremonial blade remains lowered and never becomes a dueling weapon. A reflection in wet stone moves half a second later than the body. Work marks in the quiet parish room explain why this moment is happening here. Pale window light catches the petition edge and the negotiating hand, leaving the sealed arch in cooler shade. Keep the final image focused on a single decision under pressure.

**Mock critique**

- profession needs reduction
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Keep the final image focused on a single decision under pressure.

**Mock final (171 words)**

Full-body cinematic painted fantasy character concept: gnome warlock courtier. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. They hold the folded petition between their body and the gate official, using the lowered ceremonial blade only as a sign of rank. The sealed archive arch fills the midground. The official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The folded petition is the clear status object. The ceremonial blade remains lowered and never becomes a dueling weapon. A reflection in wet stone moves half a second later than the body. Work marks in the quiet parish room explain why this moment is happening here. Pale window light catches the petition edge and the negotiating hand, leaving the sealed arch in cooler shade.

### cleric-smuggler

**Local draft (149 words)**

Full-body cinematic painted fantasy character concept: tiefling cleric — Bearer of a Divided Duty. The tiefling body uses horn clearance, tail counterweight, and adjusted layers as part of the task posture. Offer aid where doctrine gives no easy answer. The character stands between the dependent figure and hostile suspicion, watching the point where the task could fail. They stand slightly off-center, drawing the eye from face to hand to obstacle. Salt marks appears as a single occupational trace, and the clothing follows class pressure and body scale. The object remains near the point of failure instead of becoming a costume accent. A dim response passes inside the false-bottom satchel, contained to the object. Useful surfaces in the market threshold keep attention on body angle, choice, and consequence. Reflected thin winter sun light touches the floor before reaching the hand. Keep nearby surfaces useful, close, and subordinate to the figure.

**Local final (149 words)**

Full-body cinematic painted fantasy character concept: tiefling cleric — Bearer of a Divided Duty. The tiefling body uses horn clearance, tail counterweight, and adjusted layers as part of the task posture. Offer aid where doctrine gives no easy answer. The character stands between the dependent figure and hostile suspicion, watching the point where the task could fail. They stand slightly off-center, drawing the eye from face to hand to obstacle. Salt marks appears as a single occupational trace, and the clothing follows class pressure and body scale. The object remains near the point of failure instead of becoming a costume accent. A dim response passes inside the false-bottom satchel, contained to the object. Useful surfaces in the market threshold keep attention on body angle, choice, and consequence. Reflected thin winter sun light touches the floor before reaching the hand. Keep nearby surfaces useful, close, and subordinate to the figure.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- The object remains near the point of failure instead of becoming a costume accent.
- Keep nearby surfaces useful, close, and subordinate to the figure.

**Mock final (125 words)**

Full-body cinematic painted fantasy character concept: tiefling cleric — Bearer of a Divided Duty. The tiefling body uses horn clearance, tail counterweight, and adjusted layers as part of the task posture. Offer aid where doctrine gives no easy answer. The character stands between the dependent figure and hostile suspicion, watching the point where the task could fail. They stand slightly off-center, drawing the eye from face to hand to obstacle. Salt marks appears as a single occupational trace, and the clothing follows class pressure and body scale. A dim response passes inside the false-bottom satchel, contained to the object. Useful surfaces in the market threshold keep attention on body angle, choice, and consequence. Reflected thin winter sun light touches the floor before reaching the hand.

### fighter-ferryman

**Local draft (143 words)**

Full-body cinematic painted fantasy character concept: dwarf fighter — Shield of the Dependent. Heavy hands, short grounded steps, and a low working center give the dwarf practical mass. Read the threat before anyone else understands its angle. The composition turns the obstacle into a physical barrier rather than a mood word. They stand slightly off-center, holding the action at the exact point before failure. A weathered ferry coat, weighted hems, and rope-polished palms show long work around moving water. The tool sits where the action needs it, between hand and obstacle. Authority shows in the way others make space around the action. A river toll table and damp cargo ropes pull the forest track back toward the crossing dispute. Soft wet leaf shadow light stays near the tool and leaves the distance muted. Keep the last note on the choice, not the costume.

**Local final (143 words)**

Full-body cinematic painted fantasy character concept: dwarf fighter — Shield of the Dependent. Heavy hands, short grounded steps, and a low working center give the dwarf practical mass. Read the threat before anyone else understands its angle. The composition turns the obstacle into a physical barrier rather than a mood word. They stand slightly off-center, holding the action at the exact point before failure. A weathered ferry coat, weighted hems, and rope-polished palms show long work around moving water. The tool sits where the action needs it, between hand and obstacle. Authority shows in the way others make space around the action. A river toll table and damp cargo ropes pull the forest track back toward the crossing dispute. Soft wet leaf shadow light stays near the tool and leaves the distance muted. Keep the last note on the choice, not the costume.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Keep the last note on the choice, not the costume.

**Mock final (133 words)**

Full-body cinematic painted fantasy character concept: dwarf fighter — Shield of the Dependent. Heavy hands, short grounded steps, and a low working center give the dwarf practical mass. Read the threat before anyone else understands its angle. The composition turns the obstacle into a physical barrier rather than a mood word. They stand slightly off-center, holding the action at the exact point before failure. A weathered ferry coat, weighted hems, and rope-polished palms show long work around moving water. The tool sits where the action needs it, between hand and obstacle. Authority shows in the way others make space around the action. A river toll table and damp cargo ropes pull the forest track back toward the crossing dispute. Soft wet leaf shadow light stays near the tool and leaves the distance muted.

### rogue-shrine

**Local draft (141 words)**

Full-body cinematic painted fantasy character concept: halfling rogue — Shield of the Dependent. Small adult proportions, steady feet, and hand-scale tools keep the halfling practical rather than childlike. Protect someone without revealing the escape route. The body partly shields the person at risk while the working hand reaches into the problem. They stand slightly off-center, making the gesture small enough to feel practiced. Candle soot appears as a single occupational trace, and the clothing follows class pressure and body scale. No trophy pose interrupts the work; the object stays close to the task. The nearest onlooker gives ground without being touched. Light and surface in the quiet parish room locate the task before any trade detail is noticed. The still indoor chill light is strongest on the hand, not the costume. Make the body angle explain the risk before decoration appears.

**Local final (141 words)**

Full-body cinematic painted fantasy character concept: halfling rogue — Shield of the Dependent. Small adult proportions, steady feet, and hand-scale tools keep the halfling practical rather than childlike. Protect someone without revealing the escape route. The body partly shields the person at risk while the working hand reaches into the problem. They stand slightly off-center, making the gesture small enough to feel practiced. Candle soot appears as a single occupational trace, and the clothing follows class pressure and body scale. No trophy pose interrupts the work. The object stays close to the task. The nearest onlooker gives ground without being touched. Light and surface in the quiet parish room locate the task before any trade detail is noticed. The still indoor chill light is strongest on the hand, not the costume. Make the body angle explain the risk before decoration appears.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- The still indoor chill light is strongest on the hand, not the costume.
- Make the body angle explain the risk before decoration appears.

**Mock final (118 words)**

Full-body cinematic painted fantasy character concept: halfling rogue — Shield of the Dependent. Small adult proportions, steady feet, and hand-scale tools keep the halfling practical rather than childlike. Protect someone without revealing the escape route. The body partly shields the person at risk while the working hand reaches into the problem. They stand slightly off-center, making the gesture small enough to feel practiced. Candle soot appears as a single occupational trace, and the clothing follows class pressure and body scale. No trophy pose interrupts the work. The object stays close to the task. The nearest onlooker gives ground without being touched. Light and surface in the quiet parish room locate the task before any trade detail is noticed.

### paladin-courtier

**Local draft (156 words)**

Full-body cinematic painted fantasy character concept: aasimar paladin — Shield of the Dependent. Human proportions carry a subtle symmetry and calm stillness, with any unusual light kept close to the scene. Hold an oath steady while a frightened crowd demands certainty. The sealed archive arch fills the midground; the official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The tool is caught mid-use, close enough to explain the next decision. A witness lowers their voice as soon as the character turns. Background details in the rain-dark doorway point back toward the dependent figure. A small pocket of cold rain light marks the place where the task could fail. Let the final image favor consequence over costume inventory.

**Local final (156 words)**

Full-body cinematic painted fantasy character concept: aasimar paladin — Shield of the Dependent. Human proportions carry a subtle symmetry and calm stillness, with any unusual light kept close to the scene. Hold an oath steady while a frightened crowd demands certainty. The sealed archive arch fills the midground. The official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The tool is caught mid-use, close enough to explain the next decision. A witness lowers their voice as soon as the character turns. Background details in the rain-dark doorway point back toward the dependent figure. A small pocket of cold rain light marks the place where the task could fail. Let the final image favor consequence over costume inventory.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Background details in the rain-dark doorway point back toward the dependent figure.
- Let the final image favor consequence over costume inventory.

**Mock final (135 words)**

Full-body cinematic painted fantasy character concept: aasimar paladin — Shield of the Dependent. Human proportions carry a subtle symmetry and calm stillness, with any unusual light kept close to the scene. Hold an oath steady while a frightened crowd demands certainty. The sealed archive arch fills the midground. The official blocks the threshold, two witnesses hold opposite sides, and the dependent stays half-hidden behind the courtier shoulder. They stand slightly off-center, measuring each witness in turn while the negotiating hand stays open. Formal court silk is repaired at the wrist, with a petition crease catching the light. The tool is caught mid-use, close enough to explain the next decision. A witness lowers their voice as soon as the character turns. A small pocket of cold rain light marks the place where the task could fail.

### druid-undertaker

**Local draft (159 words)**

Full-body cinematic painted fantasy character concept: firbolg druid — Keeper of the Last Oath. Broad hands, a gentle nonhuman face, and a careful stoop make the firbolg large without making the scene aggressive. Answer a living system under stress while people demand control. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, drawing the eye from face to hand to obstacle. Dark plain cloth, repaired cuff edges, and dust at the knees keep the work solemn and physical. Only one primary tool matters, kept low instead of displayed like a trophy. No light marks the moment; a still hand before the next move carries the strangeness. The workroom edge gives the scene pressure while the body and hands remain primary. Reflected dust in window light light touches the floor before reaching the hand. Keep the figure grounded in the moment instead of display.

**Local final (158 words)**

Full-body cinematic painted fantasy character concept: firbolg druid — Keeper of the Last Oath. Broad hands, a gentle nonhuman face, and a careful stoop make the firbolg large without making the scene aggressive. Answer a living system under stress while people demand control. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, drawing the eye from face to hand to obstacle. Dark plain cloth, repaired cuff edges, and dust at the knees keep the work solemn and physical. Only one primary tool matters, kept low instead of displayed like a trophy. No light marks the moment. A still hand before the next move carries the strangeness. The workroom edge gives the scene pressure while the body and hands remain primary. Reflected dust in window light touches the floor before reaching the hand. Keep the figure grounded in the moment instead of display.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Keep the figure grounded in the moment instead of display.

**Mock final (148 words)**

Full-body cinematic painted fantasy character concept: firbolg druid — Keeper of the Last Oath. Broad hands, a gentle nonhuman face, and a careful stoop make the firbolg large without making the scene aggressive. Answer a living system under stress while people demand control. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, drawing the eye from face to hand to obstacle. Dark plain cloth, repaired cuff edges, and dust at the knees keep the work solemn and physical. Only one primary tool matters, kept low instead of displayed like a trophy. No light marks the moment. A still hand before the next move carries the strangeness. The workroom edge gives the scene pressure while the body and hands remain primary. Reflected dust in window light touches the floor before reaching the hand.

### artificer-lamp

**Local draft (154 words)**

Full-body cinematic painted fantasy character concept: gnome artificer — Figure at the Threshold. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. Trust one field device while people demand a miracle. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, keeping the body angled toward both subject and exit. An oil-dark apron panel, reinforced cuff edges, and soot along one sleeve mark the lamp work. The grip shows familiarity without turning the tool toward the viewer. A dim response passes inside the tinder tube, contained to the object. Material cues from the rain-dark doorway explain the surface underfoot and the light in the room. A small pocket of cold rain light marks the place where the task could fail. Let the frame breathe around face, hand, and obstacle.

**Local final (154 words)**

Full-body cinematic painted fantasy character concept: gnome artificer — Figure at the Threshold. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. Trust one field device while people demand a miracle. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, keeping the body angled toward both subject and exit. An oil-dark apron panel, reinforced cuff edges, and soot along one sleeve mark the lamp work. The grip shows familiarity without turning the tool toward the viewer. A dim response passes inside the tinder tube, contained to the object. Material cues from the rain-dark doorway explain the surface underfoot and the light in the room. A small pocket of cold rain light marks the place where the task could fail. Let the frame breathe around face, hand, and obstacle.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Let the frame breathe around face, hand, and obstacle.

**Mock final (145 words)**

Full-body cinematic painted fantasy character concept: gnome artificer — Figure at the Threshold. A small adult frame, low center of gravity, tool-scaled hands, and carefully fitted sleeves make the body unmistakably gnomish. Trust one field device while people demand a miracle. A diagonal line runs from the working hand to the obstacle and then back to the person who depends on them. They stand slightly off-center, keeping the body angled toward both subject and exit. An oil-dark apron panel, reinforced cuff edges, and soot along one sleeve mark the lamp work. The grip shows familiarity without turning the tool toward the viewer. A dim response passes inside the tinder tube, contained to the object. Material cues from the rain-dark doorway explain the surface underfoot and the light in the room. A small pocket of cold rain light marks the place where the task could fail.

### bard-tavern

**Local draft (152 words)**

Full-body cinematic painted fantasy character concept: satyr bard — Keeper of a Costly Bargain. Goatlike lower-body cues, springy balance, expressive ears, and adjusted hems make the satyr read through movement. Redirect a crowd with timing instead of spectacle. The dependent figure stays within arm's reach, with the obstacle set between them and the exit. They stand slightly off-center, keeping the tool low and the attention on the failing task. Wiped apron appears as a single occupational trace, and the clothing follows class pressure and body scale. The tool's scale matches the body and keeps attention on the task. A dim reflection near the obstacle lags behind the character by a breath. Scale cues from the market threshold make the danger clear while the occupational mark stays small. Low thin winter sun light separates the face from the object in use. Let material wear and body angle do more work than decorative effects.

**Local final (152 words)**

Full-body cinematic painted fantasy character concept: satyr bard — Keeper of a Costly Bargain. Goatlike lower-body cues, springy balance, expressive ears, and adjusted hems make the satyr read through movement. Redirect a crowd with timing instead of spectacle. The dependent figure stays within arm's reach, with the obstacle set between them and the exit. They stand slightly off-center, keeping the tool low and the attention on the failing task. Wiped apron appears as a single occupational trace, and the clothing follows class pressure and body scale. The tool's scale matches the body and keeps attention on the task. A dim reflection near the obstacle lags behind the character by a breath. Scale cues from the market threshold make the danger clear while the occupational mark stays small. Low thin winter sun light separates the face from the object in use. Let material wear and body angle do more work than decorative effects.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Scale cues from the market threshold make the danger clear while the occupational mark stays small.
- Let material wear and body angle do more work than decorative effects.

**Mock final (124 words)**

Full-body cinematic painted fantasy character concept: satyr bard — Keeper of a Costly Bargain. Goatlike lower-body cues, springy balance, expressive ears, and adjusted hems make the satyr read through movement. Redirect a crowd with timing instead of spectacle. The dependent figure stays within arm's reach, with the obstacle set between them and the exit. They stand slightly off-center, keeping the tool low and the attention on the failing task. Wiped apron appears as a single occupational trace, and the clothing follows class pressure and body scale. The tool's scale matches the body and keeps attention on the task. A dim reflection near the obstacle lags behind the character by a breath. Low thin winter sun light separates the face from the object in use.

### barbarian-medic

**Local draft (156 words)**

Full-body cinematic painted fantasy character concept: dragonborn barbarian — Shield of the Dependent. Scaled hands, crest balance, and a counterweighted tail shape the dragonborn movement around the task. Carry pain without letting it decide the next action. A tight foreground hand points to the failure point while the background recedes into quiet pressure. They brace through the legs, using the nearest hand to test the obstacle before moving. Blood-washed cuffs appears as a single occupational trace, and the clothing follows class pressure and body scale. The hand treats the object as equipment, not ornament. No light marks the moment; a still hand before the next move carries the strangeness. The market threshold holds the class conflict in front of the dependent figure, leaving the old trade as a minor trace. A narrow band of thin winter sun light picks out the working hand and the obstacle. Keep the last note on the choice, not the costume.

**Local final (156 words)**

Full-body cinematic painted fantasy character concept: dragonborn barbarian — Shield of the Dependent. Scaled hands, crest balance, and a counterweighted tail shape the dragonborn movement around the task. Carry pain without letting it decide the next action. A tight foreground hand points to the failure point while the background recedes into quiet pressure. They brace through the legs, using the nearest hand to test the obstacle before moving. Blood-washed cuffs appears as a single occupational trace, and the clothing follows class pressure and body scale. The hand treats the object as equipment, not ornament. No light marks the moment. A still hand before the next move carries the strangeness. The market threshold holds the class conflict in front of the dependent figure, leaving the old trade as a minor trace. A narrow band of thin winter sun light picks out the working hand and the obstacle. Keep the last note on the choice, not the costume.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- A tight foreground hand points to the failure point while the background recedes into quiet pressure.
- The hand treats the object as equipment, not ornament.
- Keep the last note on the choice, not the costume.

**Mock final (121 words)**

Full-body cinematic painted fantasy character concept: dragonborn barbarian — Shield of the Dependent. Scaled hands, crest balance, and a counterweighted tail shape the dragonborn movement around the task. Carry pain without letting it decide the next action. They brace through the legs, using the nearest hand to test the obstacle before moving. Blood-washed cuffs appears as a single occupational trace, and the clothing follows class pressure and body scale. No light marks the moment. A still hand before the next move carries the strangeness. The market threshold holds the class conflict in front of the dependent figure, leaving the old trade as a minor trace. A narrow band of thin winter sun light picks out the working hand and the obstacle.

### ranger-surveyor

**Local draft (141 words)**

Full-body cinematic painted fantasy character concept: elf ranger — Shield of the Dependent. Long limbs, controlled reach, and clean foot placement make the elf read through precision. Choose the safe route that looks wrong to everyone else. The frame keeps subject, tool, and obstacle close enough to be read in one glance. They stand slightly off-center, leaving one hand free to react to the obstacle. Weathered field cloth, a map tube strap, and chalk at the fingertips connect clothing to measurement. The hand treats the object as equipment, not ornament. A witness lowers their voice as soon as the character turns. Survey pins and a chalked sightline connect the room to the border outside. A narrow band of cold rain light picks out the working hand and the obstacle. Leave enough negative space for the silhouette and working hand to read.

**Local final (141 words)**

Full-body cinematic painted fantasy character concept: elf ranger — Shield of the Dependent. Long limbs, controlled reach, and clean foot placement make the elf read through precision. Choose the safe route that looks wrong to everyone else. The frame keeps subject, tool, and obstacle close enough to be read in one glance. They stand slightly off-center, leaving one hand free to react to the obstacle. Weathered field cloth, a map tube strap, and chalk at the fingertips connect clothing to measurement. The hand treats the object as equipment, not ornament. A witness lowers their voice as soon as the character turns. Survey pins and a chalked sightline connect the room to the border outside. A narrow band of cold rain light picks out the working hand and the obstacle. Leave enough negative space for the silhouette and working hand to read.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- The hand treats the object as equipment, not ornament.
- Leave enough negative space for the silhouette and working hand to read.

**Mock final (120 words)**

Full-body cinematic painted fantasy character concept: elf ranger — Shield of the Dependent. Long limbs, controlled reach, and clean foot placement make the elf read through precision. Choose the safe route that looks wrong to everyone else. The frame keeps subject, tool, and obstacle close enough to be read in one glance. They stand slightly off-center, leaving one hand free to react to the obstacle. Weathered field cloth, a map tube strap, and chalk at the fingertips connect clothing to measurement. A witness lowers their voice as soon as the character turns. Survey pins and a chalked sightline connect the room to the border outside. A narrow band of cold rain light picks out the working hand and the obstacle.

### monk-trapper

**Local draft (163 words)**

Full-body cinematic painted fantasy character concept: half orc monk trapper. Heavy shoulders, a strong jaw, and work-worn hands give the half-orc weight without turning the pose into a caricature. They loosen the snare cord two fingers at a time, trying to free the hunter at the edge of the clearing before the hunters arrive. The working object anchors the foreground as the obstacle interrupts the path beyond it. They stand slightly off-center, controlling the line without tightening it further. Snagged field cloth, patched knees, and cord-burned gloves show work near brush and snares. The tool is caught mid-use, close enough to explain the next decision. The uncanny cue stays inside the body, visible only in a pause of breath and fingers. The workroom edge serves as a temporary holding place for the snare, track mud under the table. Hard doorway light cuts across the snare cord and leaves the hunters behind in shadow. Hold the scene at the moment where action still matters.

**Local final (163 words)**

Full-body cinematic painted fantasy character concept: half orc monk trapper. Heavy shoulders, a strong jaw, and work-worn hands give the half-orc weight without turning the pose into a caricature. They loosen the snare cord two fingers at a time, trying to free the hunter at the edge of the clearing before the hunters arrive. The working object anchors the foreground as the obstacle interrupts the path beyond it. They stand slightly off-center, controlling the line without tightening it further. Snagged field cloth, patched knees, and cord-burned gloves show work near brush and snares. The tool is caught mid-use, close enough to explain the next decision. The uncanny cue stays inside the body, clear only in a pause of breath and fingers. The workroom edge serves as a temporary holding place for the snare, track mud under the table. Hard doorway light cuts across the snare cord and leaves the hunters behind in shadow. Hold the scene at the moment where action still matters.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- Hold the scene at the moment where action still matters.

**Mock final (153 words)**

Full-body cinematic painted fantasy character concept: half orc monk trapper. Heavy shoulders, a strong jaw, and work-worn hands give the half-orc weight without turning the pose into a caricature. They loosen the snare cord two fingers at a time, trying to free the hunter at the edge of the clearing before the hunters arrive. The working object anchors the foreground as the obstacle interrupts the path beyond it. They stand slightly off-center, controlling the line without tightening it further. Snagged field cloth, patched knees, and cord-burned gloves show work near brush and snares. The tool is caught mid-use, close enough to explain the next decision. The uncanny cue stays inside the body, clear only in a pause of breath and fingers. The workroom edge serves as a temporary holding place for the snare, track mud under the table. Hard doorway light cuts across the snare cord and leaves the hunters behind in shadow.

### wizard-archivist

**Local draft (134 words)**

Full-body cinematic painted fantasy character concept: human wizard — Keeper of a Costly Bargain. Age, trade, and local clothing shape the human body more than any generic hero pose. Hold a fragile conclusion against public pressure. The person at risk stays offset from the main action, close enough to explain the urgency. They stand slightly off-center, drawing the eye from face to hand to obstacle. Aged paper shows at stress points, with clothing shaped by archivist. The object sits in a working grip instead of a display grip. One small mark on the tool darkens briefly, then settles. The workroom edge adds weather and scale without stealing attention from the task. Reflected dust in window light light touches the floor before reaching the hand. Keep the figure grounded in the moment instead of display.

**Local final (133 words)**

Full-body cinematic painted fantasy character concept: human wizard — Keeper of a Costly Bargain. Age, trade, and local clothing shape the human body more than any generic hero pose. Hold a fragile conclusion against public pressure. The person at risk stays offset from the main action, close enough to explain the urgency. They stand slightly off-center, drawing the eye from face to hand to obstacle. Aged paper shows at stress points, with clothing shaped by archivist. The object sits in a working grip instead of a display grip. One small mark on the tool darkens briefly, then settles. The workroom edge adds weather and scale without stealing attention from the task. Reflected dust in window light touches the floor before reaching the hand. Keep the figure grounded in the moment instead of display.

**Mock critique**

- profession budget respected
- suppressed detail clear
- lint conflicts clear

**Mock removed details**

- One small mark on the tool darkens briefly, then settles.
- The workroom edge adds weather and scale without stealing attention from the task.
- Keep the figure grounded in the moment instead of display.

**Mock final (100 words)**

Full-body cinematic painted fantasy character concept: human wizard — Keeper of a Costly Bargain. Age, trade, and local clothing shape the human body more than any generic hero pose. Hold a fragile conclusion against public pressure. The person at risk stays offset from the main action, close enough to explain the urgency. They stand slightly off-center, drawing the eye from face to hand to obstacle. Aged paper shows at stress points, with clothing shaped by archivist. The object sits in a working grip instead of a display grip. Reflected dust in window light touches the floor before reaching the hand.
