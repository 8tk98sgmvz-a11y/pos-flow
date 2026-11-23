'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FlujoDateRange } from '@/components/dashboard/flujo-date-range';
import { FlujoPageHeader } from '@/components/dashboard/flujo-page-header';
import { FlujoShell } from '@/components/dashboard/flujo-shell';
import { Badge, Button, Card } from '@/components/ui';
import { onLive } from '@/lib/live';
import { esFiado, money } from '@/lib/money';

type Venta = {
  id?: string;
  createdAt?: string;
  montoTotal?: number;
  canal?: string;
  descripcion?: string;
  estado?: string;
};

type Filtro = 'hoy' | 'ayer' | 'mes' | 'todo' | 'rango';

async function leerApi(): Promise<Venta[]> {
  try {
    const res = await fetch('/api/ventas', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function esHoy(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function esAyer(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  return (
    d.getFullYear() === ayer.getFullYear() &&
    d.getMonth() === ayer.getMonth() &&
    d.getDate() === ayer.getDate()
  );
}

function esMes(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function enRango(iso?: string, desde?: string, hasta?: string) {
  if (!iso || !desde || !hasta) return false;
  const d = new Date(iso).getTime();
  const ini = new Date(desde).getTime();
  const fin = new Date(hasta + 'T23:59:59').getTime();
  return d >= ini && d <= fin;
}

export default function FlujoCajaPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const cargar = async () => {
    const api = await leerApi();
    const ordenadas = api.sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
    setVentas(ordenadas);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
    const stop = onLive(() => void cargar());
    const id = setInterval(cargar, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  const filtradas = useMemo(() => {
    if (filtro === 'todo') return ventas;
    if (filtro === 'hoy') return ventas.filter((v) => esHoy(v.createdAt));
    if (filtro === 'ayer') return ventas.filter((v) => esAyer(v.createdAt));
    if (filtro === 'mes') return ventas.filter((v) => esMes(v.createdAt));
    if (filtro === 'rango') return ventas.filter((v) => enRango(v.createdAt, desde, hasta));
    return ventas;
  }, [ventas, filtro, desde, hasta]);

  const totales = useMemo(() => {
    const cobradas = filtradas.filter((v) => !esFiado(v.canal));
    const entradas = money(cobradas.reduce((acc, v) => acc + Number(v.montoTotal || 0), 0));
    return { entradas, count: cobradas.length };
  }, [filtradas]);

  return (
    <FlujoShell>
      <FlujoPageHeader
        subtitle={loading ? 'Cargando…' : `${totales.count} ventas · S/ ${totales.entradas.toFixed(2)}`}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ['hoy', 'Hoy'],
            ['ayer', 'Ayer'],
            ['mes', 'Este mes'],
            ['todo', 'Todo'],
            ['rango', 'Rango'],
          ] as [Filtro, string][]
        ).map(([id, label]) => (
          <Button
            key={id}
            variant={filtro === id ? 'primary' : 'ghost'}
            className="px-3 py-1.5 h-auto text-[12px] font-medium"
            onClick={() => setFiltro(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {filtro === 'rango' && (
        <FlujoDateRange desde={desde} hasta={hasta} onDesde={setDesde} onHasta={setHasta} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <Card className="p-4">
          <p className="text-[12px] text-slate-400">Entradas</p>
          <p className="text-[22px] font-semibold text-emerald-400">S/ {totales.entradas.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-4">
        <p className="text-[14px] font-medium mb-3">Ventas</p>
        {filtradas.length === 0 && !loading && (
          <p className="text-slate-500 text-sm">No hay ventas en este período.</p>
        )}
        {filtradas.slice(0, 50).map((v, i) => (
          <div
            key={v.id || i}
            className="flex justify-between items-center gap-2 border-t border-white/10 py-2 text-[13px]"
          >
            <span className="text-slate-400 flex items-center gap-2 min-w-0">
              {v.createdAt
                ? new Date(v.createdAt).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
              <Badge variant="default">{v.canal || '—'}</Badge>
            </span>
            <span className="max-w-[45%] truncate">{v.descripcion || 'Venta'}</span>
            <span className="text-emerald-400">S/ {Number(v.montoTotal || 0).toFixed(2)}</span>
          </div>
        ))}
      </Card>
    </FlujoShell>
  );
}
