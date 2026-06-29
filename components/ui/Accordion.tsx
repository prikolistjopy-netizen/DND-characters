import type { ReactNode } from 'react';

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details className="accordion" open={defaultOpen}>
      <summary>
        <span>{title}</span>
        <span className="accordion__icon" aria-hidden="true" />
      </summary>
      <div className="accordion__content">{children}</div>
    </details>
  );
}
