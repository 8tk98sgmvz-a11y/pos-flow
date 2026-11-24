'use client';

import React, { useEffect, useState } from 'react';
import { ReportesShell } from '@/components/dashboard/reportes-shell';
import { Badge, Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, Text } from '@/components/ui';
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
      <Text variant="caption" className="mb-ds-5">
        Qué se vende más y con qué margen
      </Text>

      <Table>
        <TableHeader>
          <tr>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Unidades</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Costo</TableHead>
            <TableHead className="text-right">Margen</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {loading && <TableEmpty colSpan={5}>Cargando…</TableEmpty>}
          {!loading && data.length === 0 && <TableEmpty colSpan={5}>Sin datos</TableEmpty>}
          {data.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.producto}</TableCell>
              <TableCell className="text-right">{r.unidades}</TableCell>
              <TableCell className="text-right">{soles(r.total)}</TableCell>
              <TableCell className="text-right">{soles(r.costo)}</TableCell>
              <TableCell className="text-right">
                <Badge variant={r.margen >= 0 ? 'success' : 'danger'}>{soles(r.margen)}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ReportesShell>
  );
}
