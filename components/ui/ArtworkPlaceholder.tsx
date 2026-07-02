import type { ReactNode } from 'react';

type ArtworkPlaceholderState = 'empty' | 'generating' | 'image';

type ArtworkPlaceholderProps = {
  state?: ArtworkPlaceholderState;
  alt?: string;
  src?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function ArtworkPlaceholder({
  state = 'empty',
  alt = 'Diceborn character artwork placeholder',
  src,
  title = 'Your character will appear here',
  description = 'Artwork generation coming later',
  children,
}: ArtworkPlaceholderProps) {
  if (state === 'image' && src) {
    return <img className="artwork-placeholder artwork-placeholder--image" src={src} alt={alt} />;
  }

  return (
    <figure className={["artwork-placeholder", `artwork-placeholder--${state}`].join(' ')} aria-label={alt}>
      <div className="artwork-placeholder__stage" aria-hidden="true">
        <span className="artwork-placeholder__star" />
        <span className="artwork-placeholder__sigil" />
        <span className="artwork-placeholder__silhouette" />
      </div>
      <figcaption className="artwork-placeholder__copy">
        <strong>{state === 'generating' ? 'The stars are aligning.' : title}</strong>
        <span>{state === 'generating' ? 'Preparing a cinematic character result.' : description}</span>
      </figcaption>
      {children}
    </figure>
  );
}
