import Link from 'next/link';

export function BrandMark() {
  return (
    <Link className="brand-mark" href="/" aria-label="Diceborn home">
      <span className="brand-orb" aria-hidden="true" />
      <span>
        <span className="brand-name">Diceborn</span>
        <span className="brand-tagline">Every Roll Begins a Story</span>
      </span>
    </Link>
  );
}
