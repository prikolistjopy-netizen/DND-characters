import Link from 'next/link';
import { BrandArtwork } from '@/components/brand/BrandArtwork';
import { Button } from '@/components/ui/Button';

const exampleCards = [
  'Storm-scarred ranger watching a trail break in the rain',
  'Moonlit warlock listening to a second shadow',
  'Dwarven druid raising roots around one hand',
];

export default function HomePage() {
  return (
    <>
      <section className="hero-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Fantasy Character Generator</p>
          <h1 id="hero-title">Every Roll Begins a Story</h1>
          <p className="hero-description">Create cinematic fantasy characters for campaigns, concept art, and stories.</p>
          <div className="hero-actions" aria-label="Primary actions">
            <Button asChild variant="primary"><Link href="/generate">Create Your Character</Link></Button>
            <Button asChild variant="glass"><Link href="#discover">Discover Diceborn</Link></Button>
          </div>
        </div>
        <BrandArtwork />
      </section>

      <section id="discover" className="section-grid" aria-labelledby="paths-title">
        <div>
          <p className="eyebrow">Choose Your Path</p>
          <h2 id="paths-title">Start fast, shape later.</h2>
        </div>
        <div className="card-grid three">
          <article className="panel-card"><h3>Quick Roll</h3><p>Generate a complete Diceborn character with the frozen generator core.</p></article>
          <article className="panel-card"><h3>Shape Your Character</h3><p>Foundation for guided class, race, style, and prompt controls.</p></article>
          <article className="panel-card"><h3>Save Locally</h3><p>Prepared for browser-only collection flows before accounts or cloud storage.</p></article>
        </div>
      </section>

      <section className="section-grid" aria-labelledby="examples-title">
        <div>
          <p className="eyebrow">Character Examples</p>
          <h2 id="examples-title">Cinematic seeds, clean prompts.</h2>
        </div>
        <div className="card-grid three">
          {exampleCards.map((example) => <article className="panel-card example-card" key={example}>{example}</article>)}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="cta-title">
        <p className="eyebrow">Diceborn Alpha</p>
        <h2 id="cta-title">Build your next character from a single spark.</h2>
        <Button asChild variant="primary"><Link href="/generate">Create Character</Link></Button>
      </section>
    </>
  );
}
