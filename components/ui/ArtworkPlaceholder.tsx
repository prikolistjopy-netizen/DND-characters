import type { ReactNode } from 'react';

type ArtworkState = 'empty' | 'generating' | 'image';

type ArtworkPlaceholderProps = {
  state?: ArtworkState;
  alt?: string;
  image?: ReactNode;
  title?: string;
  description?: string;
};

export function ArtworkPlaceholder({
  state = 'empty',
  alt = 'Character artwork placeholder',
  image,
  title,
  description,
}: ArtworkPlaceholderProps) {
  const copy = {
    empty: {
      title: title ?? 'Your character will appear here',
      description: description ?? 'Artwork generation coming later',
    },
    generating: {
      title: title ?? 'The stars are aligning',
      description: description ?? 'Your character is being prepared',
    },
    image: {
      title: title ?? '',
      description: description ?? '',
    },
  }[state];

  return (
    <figure className={['artwork-placeholder', `artwork-placeholder--${state}`].join(' ')} aria-label={alt}>
      {state === 'image' && image ? image : (
        <div className="artwork-placeholder__scene" aria-hidden="true">
          <span className="artwork-placeholder__star" />
          <span className="artwork-placeholder__silhouette" />
        </div>
      )}
      {state !== 'image' ? (
        <figcaption className="artwork-placeholder__copy">
          <strong>{copy.title}</strong>
          <span>{copy.description}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
