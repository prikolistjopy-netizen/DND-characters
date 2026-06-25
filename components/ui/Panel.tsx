import type { HTMLAttributes, ReactNode } from 'react';

type PanelVariant = 'standard' | 'elevated' | 'interactive' | 'result' | 'empty';

type PanelProps = {
  children: ReactNode;
  variant?: PanelVariant;
} & HTMLAttributes<HTMLElement>;

export function Panel({ children, variant = 'standard', className, ...props }: PanelProps) {
  return (
    <section className={['panel', `panel--${variant}`, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </section>
  );
}
