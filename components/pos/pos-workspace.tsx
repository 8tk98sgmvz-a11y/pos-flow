import type { ReactNode } from 'react';

export function PosWorkspace({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{children}</div>;
}
