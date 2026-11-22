import type { ReactNode } from 'react';

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 md:gap-3">{children}</div>;
}

export function DashboardSplit({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-3 items-stretch">{children}</div>
  );
}
