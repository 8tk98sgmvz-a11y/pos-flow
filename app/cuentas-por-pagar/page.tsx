'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { registrarGasto } from '@/lib/caja';
import { CxpShell } from '@/components/dashboard/cxp-shell';
import { Button, Input, Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui';
import { onLiveRefresh } from '@/lib/refresh';

type CuentaPorPagar = {
  id: string;
  createdAt: string;
  proveedor: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
};

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function apiListarCxp(): Promise<CuentaPorPagar[]> {
  try {
    const res = await fetch('/api/cxp?estado=ABIERTA');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function apiRegistrarPorPagar(input: { proveedor: string; descripcion: string; monto: number }) {
  await fetch('/api/cxp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

async function apiMarcarPagada(id: string) {
  await fetch('/api/cxp', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, estado: 'PAGADA' }),
  });
}

export default function CuentasPorPagarPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<CuentaPorPagar[]>([]);

  const cargar = async () => {
    setRows(await apiListarCxp());
  };

  useEffect(() => onLiveRefresh(() => void cargar()), []);

  const abiertas = useMemo(() => rows.filter((r) => r.estado === 'ABIERTA'), [rows]);
  const total = useMemo(() => abiertas.reduce((a, r) => a + Number(r.monto || 0), 0), [abiertas]);

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = s ? rows : abiertas;
    if (!s) return base;
    return base.filter(
      (r) => r.proveedor.toLowerCase().includes(s) || r.descripcion.toLowerCase().includes(s)
    );
  }, [rows, abiertas, q]);

  const alta = async () => {
    const proveedor = window.prompt('Proveedor') || 'Proveedor';
    const descripcion = window.prompt('Descripción') || 'Factura';
    const monto = Number(window.prompt('Monto S/') || 0);
    if (!monto) return;
    await apiRegistrarPorPagar({ proveedor, descripcion, monto });
    await cargar();
  };

  const pagar = async (r: CuentaPorPagar) => {
    if (r.estado === 'PAGADA') return;
    const ok = window.confirm(`¿Pagar a ${r.proveedor} S/ ${fmt(Number(r.monto))}? Sale de caja.`);
    if (!ok) return;
    await apiMarcarPagada(r.id);
    try {
      await registrarGasto({
        descripcion: `Pago ${r.proveedor} · ${r.descripcion}`,
        monto: Number(r.monto),
        categoria: 'Proveedores',
      });
    } catch {}
    await cargar();
  };

  return (
    <CxpShell>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-[13px] text-muted shrink-0">
          S/ {fmt(total)} · {abiertas.length}
        </p>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="h-9 max-w-xs" />
        <Button variant="primary" onClick={alta} className="h-9 px-3 text-[12px] ml-auto">
          + Deuda
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t-0">
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtradas.length === 0 && <TableEmpty colSpan={3}>Nada por pagar.</TableEmpty>}
          {filtradas.map((r) => (
            <TableRow key={r.id} className="border-white/5">
              <TableCell>
                <p className="leading-tight">{r.proveedor}</p>
                <p className="text-[11px] text-muted">{r.descripcion}</p>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap font-mono">S/ {fmt(Number(r.monto || 0))}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button
                    variant="primary"
                    onClick={() => pagar(r)}
                    disabled={r.estado === 'PAGADA'}
                    className="h-8 px-2 text-[11px]"
                  >
                    Pagar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CxpShell>
  );
}
