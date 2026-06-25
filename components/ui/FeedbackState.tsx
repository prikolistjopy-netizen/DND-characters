import type { ReactNode } from 'react';

type FeedbackTone = 'empty' | 'loading' | 'success' | 'error' | 'saved';

type FeedbackStateProps = {
  tone?: FeedbackTone;
  title: string;
  children?: ReactNode;
};

export function FeedbackState({ tone = 'empty', title, children }: FeedbackStateProps) {
  return (
    <div className={["feedback-state", `feedback-state--${tone}`].join(' ')} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="feedback-state__mark" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}
