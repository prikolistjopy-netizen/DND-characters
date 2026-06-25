import { cloneElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'ghost';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  asChild?: false;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsChildProps = {
  children: ReactElement<{ className?: string }>;
  variant?: ButtonVariant;
  asChild: true;
};

export function Button(props: ButtonProps | ButtonAsChildProps) {
  const variant = props.variant ?? 'primary';
  const baseClassName = ['button', `button--${variant}`].join(' ');

  if (props.asChild) {
    const existingClassName = props.children.props.className;
    return cloneElement(props.children, { className: [baseClassName, existingClassName].filter(Boolean).join(' ') });
  }

  const { children, variant: _variant, asChild: _asChild, className, ...buttonProps } = props;
  return <button className={[baseClassName, className].filter(Boolean).join(' ')} type="button" {...buttonProps}>{children}</button>;
}
