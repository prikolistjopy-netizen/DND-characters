import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Generate',
  description: 'Create and shape a cinematic Diceborn fantasy character.',
};

export default function GeneratePage() {
  return (
    <section className="route-shell" aria-labelledby="generate-title">
      <p className="eyebrow">Generator</p>
      <h1 id="generate-title">Create a Diceborn character</h1>
      <p className="route-lede">The frozen generator core is ready for the Alpha UI. This shell keeps Quick Roll and manual shaping separated for the next product pass.</p>

      <div className="tab-shell" role="tablist" aria-label="Generator modes">
        <button className="tab-button active" type="button" role="tab" aria-selected="true">Quick Roll</button>
        <button className="tab-button" type="button" role="tab" aria-selected="false">Shape Your Character</button>
      </div>

      <div className="generator-grid">
        <section className="panel-card" aria-labelledby="quick-roll-title">
          <h2 id="quick-roll-title">Quick Roll</h2>
          <p>Placeholder for one-click generation using the existing Diceborn generator adapter.</p>
          <Button variant="primary">Create Random Character</Button>
        </section>
        <section className="panel-card" aria-labelledby="shape-title">
          <h2 id="shape-title">Shape Your Character</h2>
          <div className="placeholder-form" aria-label="Manual controls placeholder">
            <span>Class</span><span>Race</span><span>Style</span><span>Profile</span>
          </div>
        </section>
        <section className="result-canvas" aria-labelledby="result-title">
          <h2 id="result-title">Result Canvas</h2>
          <p>Character preview, short prompt, and local save actions will land here without changing generator quality.</p>
        </section>
      </div>
    </section>
  );
}
