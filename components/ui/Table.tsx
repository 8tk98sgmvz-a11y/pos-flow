import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface border border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] rounded-ds-xl overflow-hidden ${className}`}
    >
      <table className="w-full text-footnote text-foreground">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-surface-raised text-muted">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) {
  return (
    <tr
      className={`border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = '',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`text-left font-medium px-3 py-2.5 ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = '',
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-3 py-2.5 ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableEmpty({ children, colSpan = 1 }: { children: ReactNode; colSpan?: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-8 text-center text-subtle">
        {children}
      </td>
    </tr>
  );
}
