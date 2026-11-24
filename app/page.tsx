'use client';

import React, { useEffect, useState } from 'react';
import { DashboardKpis } from '@/components/dashboard/dashboard-kpis';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ButtonLink } from '@/components/ui';
import { leerPendientes } from '@/lib/optimistic';
import { emptyResumen, suscribirResumen, type Resumen } from '@/lib/resumen-client';

export default function DashboardPage() {
  const [data, setData] = useState<Resumen>(emptyResumen);

  useEffect(() => {
    if (localStorage.getItem('retailos_auth') !== '1') {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => suscribirResumen(setData, leerPendientes), []);

  useEffect(() => {
    if (data.ventasHoy > 0 && !data.arqueoHoy) document.title = 'Contar caja · POS';
    else if (data.arqueoHoy && data.arqueoHoy.diferencia !== 0) document.title = 'Caja no cuadra · POS';
    else if (data.cxcN > 0) document.title = `${data.cxcN} fiados · POS`;
    else document.title = 'Resumen · POS';
    return () => {
      document.title = 'POS Flow';
    };
  }, [data.ventasHoy, data.arqueoHoy, data.cxcN]);

  return (
    <DashboardShell
      action={
        <ButtonLink href="/pos" variant="primary" className="h-9 px-4 text-sm">
          Cobrar
        </ButtonLink>
      }
    >
      <DashboardKpis
        cajon={data.cajon}
        digitalHoy={data.digitalHoy}
        ventasHoy={data.ventasHoy}
        fiadosHoy={data.fiadosHoy}
        arqueoHoy={data.arqueoHoy}
        cxcTotal={data.cxcTotal}
        cxcN={data.cxcN}
        cxpTotal={data.cxpTotal}
        cxpN={data.cxpN}
      />
    </DashboardShell>
  );
}
