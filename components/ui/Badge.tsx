import type { HTMLAttributes, ReactNode } from 'react';

const variants = {
  default: 'bg-surface-raised text-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

export type BadgeVariant = keyof typeof variants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-ds-2 py-ds-1 rounded-ds-sm text-caption font-medium tracking-[0.01em] ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
