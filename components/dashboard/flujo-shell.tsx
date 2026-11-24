import type { ReactNode } from 'react';
import { AppShell } from './dashboard-shell';

export function FlujoShell({ children }: { children: ReactNode }) {
  return <AppShell title="Flujo de Caja">{children}</AppShell>;
}
