import {
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'ghost' | 'iconOnly';

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  asChild?: false;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsChildProps = {
  children: ReactElement<{ className?: string; 'aria-disabled'?: boolean }>;
  variant?: ButtonVariant;
  loading?: boolean;
  asChild: true;
};

export function Button(props: ButtonProps | ButtonAsChildProps) {
  const variant = props.variant ?? 'primary';
  const loading = props.loading ?? false;
  const baseClassName = ['button', `button--${variant}`, loading && 'is-loading']
    .filter(Boolean)
    .join(' ');

  if (props.asChild) {
    const existingClassName = props.children.props.className;
    return cloneElement(props.children, {
      className: [baseClassName, existingClassName].filter(Boolean).join(' '),
      'aria-disabled': loading || props.children.props['aria-disabled'],
    });
  }

  const {
    children,
    variant: _variant,
    loading: _loading,
    asChild: _asChild,
    className,
    disabled,
    ...buttonProps
  } = props;

  return (
    <button
      className={[baseClassName, className].filter(Boolean).join(' ')}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading ? <span className="button__spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
