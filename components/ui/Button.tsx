import { cloneElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'ghost';

type BaseButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  loading?: boolean;
};

type ButtonProps = BaseButtonProps & {
  asChild?: false;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsChildProps = BaseButtonProps & {
  children: ReactElement<{ className?: string; 'aria-disabled'?: boolean; 'aria-busy'?: boolean }>;
  asChild: true;
  disabled?: boolean;
};

export function Button(props: ButtonProps | ButtonAsChildProps) {
  const variant = props.variant ?? 'primary';
  const stateClassName = [
    'button',
    `button--${variant}`,
    props.iconOnly ? 'button--icon-only' : undefined,
    props.loading ? 'button--loading' : undefined,
  ].filter(Boolean).join(' ');

  if (props.asChild) {
    const existingClassName = props.children.props.className;
    return cloneElement(props.children, {
      className: [stateClassName, existingClassName].filter(Boolean).join(' '),
      'aria-disabled': props.disabled || props.loading || undefined,
      'aria-busy': props.loading || undefined,
    });
  }

  const { children, variant: _variant, asChild: _asChild, className, iconOnly: _iconOnly, loading, disabled, ...buttonProps } = props;
  return (
    <button
      className={[stateClassName, className].filter(Boolean).join(' ')}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      <span className={props.iconOnly ? 'visually-hidden' : undefined}>{children}</span>
    </button>
  );
}
