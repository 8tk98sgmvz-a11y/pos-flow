import type { ReactNode } from 'react';
import { AppShell } from './dashboard-shell';

export function ReportesShell({ children }: { children: ReactNode }) {
  return <AppShell title="Reportes">{children}</AppShell>;
}
