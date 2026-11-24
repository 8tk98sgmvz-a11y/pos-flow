'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FlujoDateRange } from '@/components/dashboard/flujo-date-range';
import { FlujoPageHeader } from '@/components/dashboard/flujo-page-header';
import { FlujoShell } from '@/components/dashboard/flujo-shell';
import { Badge, Button, Card, Text } from '@/components/ui';
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

      <div className="flex flex-wrap gap-ds-2 mb-ds-4">
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
            className="px-ds-3 h-9 text-caption font-medium"
            onClick={() => setFiltro(id)}
          >
            {label}
          </Button>
        ))}
      </div>

      {filtro === 'rango' && (
        <FlujoDateRange desde={desde} hasta={hasta} onDesde={setDesde} onHasta={setHasta} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-ds-3 mb-ds-5 max-w-3xl">
        <Card className="p-ds-4">
          <Text variant="caption">Entradas cobradas</Text>
          <Text as="p" variant="title" className="text-success mt-ds-1">
            S/ {totales.entradas.toFixed(2)}
          </Text>
          <Text variant="caption" className="mt-ds-2">
            {totales.cobradas} ventas
          </Text>
        </Card>
        <Card className="p-ds-4">
          <Text variant="caption">Fiados del período</Text>
          <Text as="p" variant="title" className="text-warning mt-ds-1">
            S/ {totales.fiadosMonto.toFixed(2)}
          </Text>
          <Text variant="caption" className="mt-ds-2">
            {totales.fiadosN} no entran a caja
          </Text>
        </Card>
      </div>

      <Card className="p-ds-4">
        <Text as="h2" variant="headline" className="mb-ds-3">
          Ventas
        </Text>
        {filtradas.length === 0 && !loading && (
          <Text variant="caption">No hay ventas en este período.</Text>
        )}
        {filtradas.slice(0, 50).map((v, i) => (
          <div
            key={v.id || i}
            className="flex justify-between items-center gap-ds-2 border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] py-ds-2"
          >
            <Text as="span" variant="caption" className="flex items-center gap-ds-2 min-w-0">
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
            </Text>
            <Text as="span" variant="body" className="max-w-[45%] truncate">
              {v.descripcion || 'Venta'}
            </Text>
            <Text as="span" variant="body" className={esFiado(v.canal) ? 'text-warning' : 'text-success'}>
              S/ {money(Number(v.montoTotal || 0)).toFixed(2)}
            </Text>
          </div>
        ))}
      </Card>
    </FlujoShell>
  );
}
