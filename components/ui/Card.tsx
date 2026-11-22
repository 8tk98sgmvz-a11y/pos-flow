import type { HTMLAttributes, ReactNode } from 'react';

const tones = {
  blue: 'bg-primary/10 border-primary/20 text-primary',
  emerald: 'bg-success/10 border-success/20 text-success',
  violet: 'bg-primary/10 border-primary/15 text-primary-hover',
  amber: 'bg-warning/10 border-warning/20 text-warning',
};

const cardSurface =
  'bg-surface text-foreground border border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] rounded-ds-xl shadow-ds-sm';

export function Card({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`${cardSurface} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-ds-4 pt-ds-4 pb-ds-2 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={`text-headline text-foreground ${className}`}>{children}</h3>;
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-ds-4 py-ds-3 text-body text-muted ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-ds-4 pb-ds-4 pt-ds-2 border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeading({
  icon,
  tone,
  title,
}: {
  icon: ReactNode;
  tone: keyof typeof tones;
  title: string;
}) {
  return (
    <div className="flex items-center gap-ds-3 mb-ds-3">
      <div
        className={`w-8 h-8 rounded-ds-sm border flex items-center justify-center shrink-0 ${tones[tone]}`}
      >
        {icon}
      </div>
      <p className="text-footnote font-semibold text-foreground">{title}</p>
    </div>
  );
}

export function CardMeta({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-center justify-between text-caption text-muted mt-ds-4 pt-ds-3 border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))]">
      {left}
      {right}
    </div>
  );
}
