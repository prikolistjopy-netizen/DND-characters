import type { HTMLAttributes, ReactNode } from 'react';

type TagVariant = 'standard' | 'accent' | 'status' | 'count';

type TagProps = {
  children: ReactNode;
  variant?: TagVariant;
} & HTMLAttributes<HTMLSpanElement>;

export function Tag({ children, variant = 'standard', className, ...props }: TagProps) {
  return <span className={['tag', `tag--${variant}`, className].filter(Boolean).join(' ')} {...props}>{children}</span>;
}
