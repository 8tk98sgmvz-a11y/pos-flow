import type { ReactNode } from 'react';
import { AppShell } from '@/components/dashboard/dashboard-shell';
import { PosToast } from './pos-toast';

export function PosShell({
  toast,
  action,
  children,
}: {
  toast: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell title="POS" action={action}>
      <PosToast message={toast} />
      {children}
    </AppShell>
  );
}
