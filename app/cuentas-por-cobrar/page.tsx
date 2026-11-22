'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { registrarIngreso } from '@/lib/caja';
import { CxcShell } from '@/components/dashboard/cxc-shell';
import { Button, Input, Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui';
import { onLiveRefresh } from '@/lib/refresh';

type CuentaPorCobrar = {
  id: string;
  createdAt: string;
  cliente: string;
  descripcion: string;
  monto: number;
  estado: 'ABIERTA' | 'PAGADA';
  ventaId?: string;
  telefono?: string;
};

function fmt(n: number) {
  return n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function apiListarCxc(): Promise<CuentaPorCobrar[]> {
  try {
    const res = await fetch('/api/cxc?estado=ABIERTA');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function apiMarcarPagada(id: string) {
  await fetch('/api/cxc', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, estado: 'PAGADA' }),
  });
}

async function apiGuardarTelefono(id: string, telefono: string) {
  await fetch('/api/cxc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, telefono }),
  });
}

export default function CuentasPorCobrarPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<CuentaPorCobrar[]>([]);

  const cargar = async () => {
    setRows(await apiListarCxc());
  };

  useEffect(() => onLiveRefresh(() => void cargar()), []);

  const abrirWhatsApp = async (r: CuentaPorCobrar) => {
    let tel = (r.telefono || '').replace(/\D/g, '');
    if (!tel) {
      tel = (window.prompt('Número de WhatsApp (9 dígitos)') || '').replace(/\D/g, '');
      if (tel.length < 9) return;
      await apiGuardarTelefono(r.id, tel);
      await cargar();
    }
    if (tel.length === 9) tel = '51' + tel;
    const texto = `Hola ${r.cliente}, te escribo de la tienda. Tienes S/ ${fmt(Number(r.monto))} pendiente (${r.descripcion}). ¿Me confirmas el Yape?`;
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const cobrar = async (r: CuentaPorCobrar) => {
    if (r.estado === 'PAGADA') return;
    const ok = window.confirm(`¿Registrar pago de ${r.cliente} por S/ ${fmt(Number(r.monto))}?`);
    if (!ok) return;
    await apiMarcarPagada(r.id);
    try {
      await registrarIngreso({
        descripcion: `Cobro fiado ${r.cliente}`,
        monto: Number(r.monto),
        origen: 'CXC',
      });
    } catch {
      /* el fiado ya está pagado; caja es otro módulo */
    }
    await cargar();
  };

  const abiertas = useMemo(() => rows.filter((r) => r.estado === 'ABIERTA'), [rows]);
  const total = useMemo(() => abiertas.reduce((a, r) => a + Number(r.monto || 0), 0), [abiertas]);

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = s ? rows : abiertas;
    if (!s) return base;
    return base.filter(
      (r) => r.cliente.toLowerCase().includes(s) || r.descripcion.toLowerCase().includes(s)
    );
  }, [rows, abiertas, q]);

  return (
    <CxcShell>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-[13px] text-muted shrink-0">
          S/ {fmt(total)} · {abiertas.length}
        </p>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="h-9 max-w-xs" />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t-0">
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtradas.length === 0 && <TableEmpty colSpan={3}>Nadie debe.</TableEmpty>}
          {filtradas.map((r) => (
            <TableRow key={r.id} className="border-white/5">
              <TableCell>
                <p className="leading-tight">{r.cliente}</p>
                <p className="text-[11px] text-muted">{r.descripcion}</p>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap font-mono">S/ {fmt(Number(r.monto || 0))}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="primary"
                    onClick={() => cobrar(r)}
                    disabled={r.estado === 'PAGADA'}
                    className="h-8 px-2 text-[11px]"
                  >
                    Cobrar
                  </Button>
                  <Button variant="ghost" onClick={() => abrirWhatsApp(r)} className="h-8 px-2 text-[11px]">
                    WA
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CxcShell>
  );
}
