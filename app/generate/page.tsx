import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder';
import { Button } from '@/components/ui/Button';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';

export const metadata = {
  title: 'Generate',
  description: 'Create and shape a cinematic Diceborn fantasy character.',
};

export default function GeneratePage() {
  return (
    <section className="route-shell" aria-labelledby="generate-title">
      <div className="route-heading">
        <p className="eyebrow">Generator</p>
        <h1 id="generate-title" className="type-display">Create a Diceborn character</h1>
        <p className="route-lede">The Alpha generator UI will connect to the frozen Diceborn core without changing generation weights, prompt behavior, or data.</p>
      </div>

      <div className="tab-shell" role="tablist" aria-label="Generator modes">
        <button className="tab-button active" type="button" role="tab" aria-selected="true">Quick Roll</button>
        <button className="tab-button" type="button" role="tab" aria-selected="false">Shape Your Character</button>
      </div>

      <div className="generator-grid">
        <Panel variant="elevated" aria-labelledby="quick-roll-title">
          <Tag variant="accent">Fast path</Tag>
          <h2 id="quick-roll-title">Quick Roll</h2>
          <p>Choose your path and roll your character.</p>
          <Button variant="primary">Create Random Character</Button>
        </Panel>

        <Panel variant="standard" aria-labelledby="shape-title">
          <Tag>Manual controls</Tag>
          <h2 id="shape-title">Shape Your Character</h2>
          <div className="placeholder-form" aria-label="Manual controls placeholder">
            <label><span>Class</span><select disabled><option>Coming soon</option></select></label>
            <label><span>Race</span><select disabled><option>Coming soon</option></select></label>
            <label><span>Style</span><select disabled><option>Cinematic Painted Fantasy</option></select></label>
            <label><span>Profile</span><select disabled><option>Balanced Gallery</option></select></label>
          </div>
        </Panel>

        <Panel variant="result" className="result-canvas" aria-labelledby="result-title">
          <div>
            <Tag variant="status">Empty</Tag>
            <h2 id="result-title">Result Canvas</h2>
            <FeedbackState title="Choose your path and roll your character.">Your character is ready state will appear here in the Generator UX patch.</FeedbackState>
          </div>
          <ArtworkPlaceholder />
        </Panel>
      </div>
    </section>
  );
}
