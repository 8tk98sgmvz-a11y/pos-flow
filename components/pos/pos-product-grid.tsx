import type { ReactNode } from 'react';

export function PosProductGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">{children}</div>;
}
