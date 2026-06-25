import type { ReactNode } from 'react';

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  helper?: string;
};

export function Accordion({ title, children, defaultOpen = false, helper }: AccordionProps) {
  return (
    <details className="accordion" open={defaultOpen}>
      <summary className="accordion__summary">
        <span>
          <strong>{title}</strong>
          {helper ? <small>{helper}</small> : null}
        </span>
        <span className="accordion__chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="accordion__content">{children}</div>
    </details>
  );
}
