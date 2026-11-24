'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FlujoDateRange } from '@/components/dashboard/flujo-date-range';
import { FlujoPageHeader } from '@/components/dashboard/flujo-page-header';
import { FlujoShell } from '@/components/dashboard/flujo-shell';
import { Badge, Button, Card } from '@/components/ui';
import { onLive } from '@/lib/live';
import { leerPendientes } from '@/lib/optimistic';
import { cuadrarVentas, diaNegocio, esFiado, money } from '@/lib/money';

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

function diaAtras(dias: number) {
  const hoy = diaNegocio();
  const [y, m, d] = hoy.split('-').map(Number);
  return diaNegocio(new Date(Date.UTC(y, m - 1, d - dias, 17)));
}

export default function FlujoCajaPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    let seq = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cargar = async () => {
      const id = ++seq;
      const api = await leerApi();
      if (id !== seq) return;
      setVentas(api);
      setLoading(false);
    };
    const schedule = () => {
      if (leerPendientes().length) setTick((n) => n + 1);
      clearTimeout(timer);
      timer = setTimeout(() => void cargar(), 80);
    };
    void cargar();
    const stop = onLive(schedule);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  const conPendientes = useMemo(() => {
    const ids = new Set(ventas.map((v) => v.id));
    const extra = leerPendientes()
      .filter((p) => !ids.has(p.id))
      .map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        montoTotal: p.montoTotal,
        canal: p.canal,
        descripcion: p.descripcion,
      }));
    return [...extra, ...ventas].sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
  }, [ventas, tick]);

  const filtradas = useMemo(() => {
    const hoy = diaNegocio();
    const ayer = diaAtras(1);
    const mes = hoy.slice(0, 7);
    return conPendientes.filter((v) => {
      if (filtro === 'todo') return true;
      const dia = diaNegocio(v.createdAt);
      if (!dia) return false;
      if (filtro === 'hoy') return dia === hoy;
      if (filtro === 'ayer') return dia === ayer;
      if (filtro === 'mes') return dia.slice(0, 7) === mes;
      if (filtro === 'rango') return Boolean(desde && hasta && dia >= desde && dia <= hasta);
      return true;
    });
  }, [conPendientes, filtro, desde, hasta]);

  const totales = useMemo(() => cuadrarVentas(filtradas), [filtradas]);

  return (
    <FlujoShell>
      <FlujoPageHeader
        subtitle={
          loading
            ? 'Cargando…'
            : `${totales.movimientos} movimientos · ${totales.cobradas} cobradas · ${totales.fiadosN} fiados`
        }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 max-w-3xl">
        <Card className="p-4">
          <p className="text-caption text-muted">Entradas cobradas</p>
          <p className="text-[22px] font-semibold text-success mt-1">S/ {totales.entradas.toFixed(2)}</p>
          <p className="text-caption text-muted mt-2">{totales.cobradas} ventas</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-muted">Fiados del período</p>
          <p className="text-[22px] font-semibold text-warning mt-1">S/ {totales.fiadosMonto.toFixed(2)}</p>
          <p className="text-caption text-muted mt-2">{totales.fiadosN} no entran a caja</p>
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
              <Badge variant={esFiado(v.canal) ? 'warning' : 'default'}>{v.canal || '—'}</Badge>
            </span>
            <span className="max-w-[45%] truncate">{v.descripcion || 'Venta'}</span>
            <span className={esFiado(v.canal) ? 'text-warning' : 'text-success'}>
              S/ {money(Number(v.montoTotal || 0)).toFixed(2)}
            </span>
          </div>
        ))}
      </Card>
    </FlujoShell>
  );
}
