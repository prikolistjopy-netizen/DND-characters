import type { HTMLAttributes, ReactNode } from 'react';

type PanelVariant = 'standard' | 'elevated' | 'interactive' | 'result' | 'empty';

type PanelProps = {
  as?: 'section' | 'article' | 'div';
  variant?: PanelVariant;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function Panel({ as: Component = 'section', variant = 'standard', className, children, ...props }: PanelProps) {
  return (
    <Component className={['panel', `panel--${variant}`, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Component>
  );
}
