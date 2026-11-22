'use client';

import React, { useEffect, useState } from 'react';
import { ReportesShell } from '@/components/dashboard/reportes-shell';
import { Badge, Button, ButtonLink, Card } from '@/components/ui';
import { onLive } from '@/lib/live';

type Reporte = {
  producto: string;
  unidades: number;
  total: number;
  costo: number;
  margen: number;
};

function soles(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

export default function ReportesPage() {
  const [data, setData] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch('/api/reportes/productos')
        .then((r) => r.json())
        .then((d) => {
          setData(Array.isArray(d) ? d : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const stop = onLive(load);
    const id = setInterval(load, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  return (
    <ReportesShell>
      <ButtonLink href="/" variant="ghost" className="text-[12px] h-auto px-0 font-normal text-slate-400">
        ← Resumen
      </ButtonLink>
      <h1 className="text-[24px] font-semibold mt-1">Reportes por producto</h1>
      <p className="text-[13px] text-slate-400 mb-5">Qué se vende más y con qué margen</p>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-[13px]">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-right p-3">Unidades</th>
              <th className="text-right p-3">Total</th>
              <th className="text-right p-3">Costo</th>
              <th className="text-right p-3">Margen</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  Sin datos
                </td>
              </tr>
            )}
            {data.map((r, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{r.producto}</td>
                <td className="p-3 text-right">{r.unidades}</td>
                <td className="p-3 text-right">{soles(r.total)}</td>
                <td className="p-3 text-right">{soles(r.costo)}</td>
                <td className="p-3 text-right">
                  <Badge variant={r.margen >= 0 ? 'success' : 'danger'}>{soles(r.margen)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ReportesShell>
  );
}
