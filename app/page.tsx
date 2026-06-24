import Link from 'next/link';
import { BrandArtwork } from '@/components/brand/BrandArtwork';
import { Button } from '@/components/ui/Button';

const paths = [
  {
    title: 'Roll a Character',
    description: 'Let fate create a complete character in one roll.',
    cta: 'Quick Roll',
    href: '/generate?mode=random',
  },
  {
    title: 'Shape Your Character',
    description: 'Choose race, class, identity, and direction before the roll.',
    cta: 'Build Character',
    href: '/generate?mode=custom',
  },
];

const steps = [
  ['01', 'Choose a Path', 'Roll freely or guide the character.'],
  ['02', 'Shape the Story', 'Diceborn resolves identity, class, action, mood, and cinematic direction.'],
  ['03', 'Begin the Journey', 'Copy the prompt, save the character, or create another variation.'],
];

const featuredCharacters = [
  {
    id: 'demo-ranger',
    title: 'Rain-Edge Warden',
    race: 'Human',
    className: 'Ranger',
    archetype: 'Frontier Archer',
    concept: 'A trail watcher aiming from wet brush as storm light cuts the trees.',
  },
  {
    id: 'demo-warlock',
    title: 'Second Shadow Heir',
    race: 'Tiefling',
    className: 'Warlock',
    archetype: 'Pact Aristocrat',
    concept: 'A velvet-cloaked occultist whose reflection answers a beat too late.',
  },
  {
    id: 'demo-druid',
    title: 'Rootsleep Oracle',
    race: 'Firbolg',
    className: 'Druid',
    archetype: 'Grove Guardian',
    concept: 'A gentle giant waking old roots under a moonlit field of flowers.',
  },
  {
    id: 'demo-bard',
    title: 'Brightknife Skald',
    race: 'Half-Orc',
    className: 'Bard',
    archetype: 'Battle Skald',
    concept: 'A laughing performer striking a chord from the edge of a ruined stage.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-shell" aria-labelledby="hero-title">
        <BrandArtwork />
        <div className="hero-copy" aria-label="Diceborn introduction">
          <p className="eyebrow">Fantasy Character Generator</p>
          <h1 id="hero-title">Every Roll Begins a Story</h1>
          <p className="hero-description">Create cinematic fantasy characters for campaigns, concept art, and stories.</p>
          <div className="hero-actions" aria-label="Primary actions">
            <Button asChild variant="primary"><Link href="/generate">Create Your Character</Link></Button>
            <Button asChild variant="glass"><Link href="#how-it-works">Discover How It Works</Link></Button>
          </div>
        </div>
      </section>

      <section className="landing-section path-section" aria-labelledby="paths-title">
        <div className="section-heading">
          <p className="eyebrow">Choose Your Path</p>
          <h2 id="paths-title">Start with fate, or shape the roll.</h2>
        </div>
        <div className="path-grid">
          {paths.map((path) => (
            <Link className="path-card" href={path.href} key={path.title}>
              <span className="path-card__glow" aria-hidden="true" />
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <span className="path-card__cta">{path.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="landing-section how-section" aria-labelledby="how-title">
        <div className="section-heading">
          <p className="eyebrow">How It Works</p>
          <h2 id="how-title">A character director behind every roll.</h2>
        </div>
        <ol className="step-list">
          {steps.map(([number, title, description]) => (
            <li className="step-card" key={number}>
              <span className="step-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="landing-section featured-section" aria-labelledby="featured-title">
        <div className="section-heading">
          <p className="eyebrow">Featured Characters</p>
          <h2 id="featured-title">Four gates into the Diceborn tone.</h2>
        </div>
        <div className="featured-grid">
          {featuredCharacters.map((character, index) => (
            <article className="character-card" key={character.id}>
              <Link href={`/character/${character.id}`} aria-label={`Open ${character.title}`}>
                <div className={`character-card__visual character-card__visual--${index + 1}`} aria-hidden="true">
                  <span className="silhouette" />
                </div>
                <div className="character-card__body">
                  <p className="character-card__meta">{character.race} · {character.className}</p>
                  <h3>{character.title}</h3>
                  <p className="character-card__archetype">{character.archetype}</p>
                  <p>{character.concept}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="cta-title">
        <span className="cta-sigil" aria-hidden="true" />
        <p className="eyebrow">Enter the Gate</p>
        <h2 id="cta-title">Your next character is waiting beyond the gate.</h2>
        <div className="hero-actions final-actions">
          <Button asChild variant="primary"><Link href="/generate">Enter the Gate</Link></Button>
          <Button asChild variant="glass"><Link href="/collection">View Your Collection</Link></Button>
        </div>
      </section>
    </>
  );
}
