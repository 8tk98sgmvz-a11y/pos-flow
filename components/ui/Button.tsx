import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const variants = {
  primary:
    'bg-primary hover:bg-primary-hover text-white border-transparent shadow-ds-sm',
  secondary:
    'bg-secondary hover:bg-secondary-hover text-foreground border-transparent',
  ghost:
    'bg-transparent hover:bg-surface-raised text-foreground border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))]',
  danger:
    'bg-danger hover:bg-danger/90 text-white border-transparent shadow-ds-sm',
};

export type ButtonVariant = keyof typeof variants;

function classes(variant: ButtonVariant, className: string) {
  return `inline-flex items-center justify-center gap-1.5 rounded-ds-md border px-ds-4 text-footnote font-medium tracking-[-0.01em] transition-colors duration-ds ease-ds disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`;
}

export function Button({
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type={type} className={classes(variant, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = 'ghost',
  className = '',
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={classes(variant, className)}>
      {children}
    </Link>
  );
}
