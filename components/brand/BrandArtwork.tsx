import Image from 'next/image';

export function BrandArtwork() {
  return (
    <figure className="brand-artwork" aria-label="Diceborn hero artwork">
      <Image
        className="brand-artwork__image"
        src="/brand/diceborn-hero.svg"
        alt="Diceborn logo artwork: the O becomes a glowing gate with a star inside it and a lone wanderer approaching."
        width={1600}
        height={1000}
        priority
        sizes="(max-width: 720px) 100vw, (max-width: 1180px) 92vw, 1120px"
      />
    </figure>
  );
}
