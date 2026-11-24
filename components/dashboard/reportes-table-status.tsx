import type { ReactNode } from 'react';
import { TableEmpty } from '@/components/ui';

export function ReportesTableStatus({ children }: { children: ReactNode }) {
  return <TableEmpty colSpan={5}>{children}</TableEmpty>;
}
