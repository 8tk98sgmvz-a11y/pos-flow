import type { ReactNode } from 'react';
import { AppShell } from './dashboard-shell';

export function ArqueoShell({ children }: { children: ReactNode }) {
  return <AppShell title="Arqueo">{children}</AppShell>;
}
