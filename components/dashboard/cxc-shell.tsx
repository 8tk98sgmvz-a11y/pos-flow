import type { ReactNode } from 'react';
import { AppShell } from './dashboard-shell';

export function CxcShell({ children }: { children: ReactNode }) {
  return <AppShell title="Fiados">{children}</AppShell>;
}
