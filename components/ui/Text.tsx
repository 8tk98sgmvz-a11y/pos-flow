import type { HTMLAttributes, ReactNode } from 'react';

const styles = {
  large: 'text-large text-foreground',
  title: 'text-title-2 text-foreground',
  headline: 'text-headline text-foreground',
  body: 'text-body text-foreground',
  caption: 'text-caption text-muted',
} as const;

export type TextVariant = keyof typeof styles;

const tags = {
  large: 'p',
  title: 'h1',
  headline: 'h2',
  body: 'p',
  caption: 'p',
} as const;

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export function Text({
  variant = 'body',
  as,
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  variant?: TextVariant;
  as?: TextTag;
  children: ReactNode;
}) {
  const Tag = as || tags[variant];
  return (
    <Tag className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
