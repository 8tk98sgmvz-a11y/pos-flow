import type { ReactNode } from 'react';
import { ArqueoCard } from './arqueo-card';

export function ArqueoHistory({ empty, children }: { empty: boolean; children: ReactNode }) {
  return (
    <ArqueoCard className="mt-5 max-w-3xl">
      <p className="text-[14px] font-medium mb-3">Historial</p>
      {empty && <p className="text-[13px] text-slate-500">Aún no hay arqueos.</p>}
      {children}
    </ArqueoCard>
  );
}
