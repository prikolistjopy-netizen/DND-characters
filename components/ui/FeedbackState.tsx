type FeedbackKind = 'empty' | 'generating' | 'result' | 'saved' | 'error';

type FeedbackStateProps = {
  kind: FeedbackKind;
  title?: string;
  description?: string;
};

const defaults: Record<FeedbackKind, { title: string; description: string }> = {
  empty: { title: 'Choose your path', description: 'Roll a character to get started.' },
  generating: { title: 'The stars are aligning', description: 'Building your character.' },
  result: { title: 'Your character is ready', description: 'Review, save, or refine the result.' },
  saved: { title: 'Saved to your collection', description: 'This character is available on this device.' },
  error: { title: 'Something went wrong', description: 'Try again.' },
};

export function FeedbackState({ kind, title, description }: FeedbackStateProps) {
  const copy = defaults[kind];
  return (
    <div className={['feedback-state', `feedback-state--${kind}`].join(' ')} role={kind === 'error' ? 'alert' : 'status'} aria-live="polite">
      <span className="feedback-state__icon" aria-hidden="true" />
      <div>
        <strong>{title ?? copy.title}</strong>
        <p>{description ?? copy.description}</p>
      </div>
    </div>
  );
}
