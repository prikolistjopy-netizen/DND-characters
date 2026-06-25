export function BrandArtwork() {
  return (
    <figure className="brand-artwork" aria-labelledby="brand-artwork-caption">
      <div className="brand-artwork__scene" aria-hidden="true">
        <span className="brand-artwork__star" />
        <span className="brand-artwork__gate" />
        <span className="brand-artwork__wanderer" />
      </div>
      <figcaption id="brand-artwork-caption" className="visually-hidden">
        Diceborn hero artwork slot: a lone wanderer approaches a glowing gate beneath a guiding star. The original final artwork will replace this temporary visual treatment.
      </figcaption>
    </figure>
  );
}
