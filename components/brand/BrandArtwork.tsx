export function BrandArtwork() {
  return (
    <figure className="brand-artwork" aria-label="Diceborn hero artwork slot awaiting final supplied artwork">
      <div className="brand-artwork__image" aria-hidden="true">
        <span className="brand-artwork__star" />
        <span className="brand-artwork__gate" />
        <span className="brand-artwork__wanderer" />
      </div>
      <figcaption className="visually-hidden">Final Diceborn hero artwork slot. Replace with /brand/diceborn-hero.webp or .jpg when the original asset is available.</figcaption>
    </figure>
  );
}
