import type { ReactNode } from 'react';

export function ArqueoCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#0B1220] border border-white/10 rounded-2xl p-4 ${className}`}>{children}</div>
  );
}
