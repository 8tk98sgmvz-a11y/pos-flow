import type { ReactNode } from 'react';
import { AppShell } from './dashboard-shell';

export function CxpShell({ children }: { children: ReactNode }) {
  return <AppShell title="Por pagar">{children}</AppShell>;
}
