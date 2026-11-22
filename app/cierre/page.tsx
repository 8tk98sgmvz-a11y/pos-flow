'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { onLive } from '@/lib/live';

const RESERVA_MINIMA = 300;

function hoyISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function soles(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

function canalDe(v: { canal?: string }) {
  const c = String(v.canal || '').toUpperCase();
  if (c === 'FIADO') return 'FIADO';
  if (c.includes('YAPE') || c.includes('PLIN')) return 'YAPE';
  if (c.includes('TARJ')) return 'TARJETA';
  return 'EFECTIVO';
}

type Venta = { id: string; createdAt: string; montoTotal: number; costoTotal?: number; canal?: string };
type Mov = { monto: number; createdAt?: string; canal?: string; tipo?: string };
type Arqueo = { createdAt: string; declarado: number; sistema: number; diferencia: number };
type Cxc = { monto: number; estado: string };
type Cxp = { monto: number; estado: string };

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function CierrePage() {
  const [tick, setTick] = useState(0);
  const [ventasAll, setVentasAll] = useState<Venta[]>([]);
  const [cajaAll, setCajaAll] = useState<Mov[]>([]);
  const [arqueosAll, setArqueosAll] = useState<Arqueo[]>([]);
  const [cxcAll, setCxcAll] = useState<Cxc[]>([]);
  const [cxpAll, setCxpAll] = useState<Cxp[]>([]);

  useEffect(() => {
    const load = async () => {
      const [v, c, a, xc, xp] = await Promise.all([
        fetchJson<Venta>('/api/ventas'),
        fetchJson<Mov>('/api/caja'),
        fetchJson<Arqueo>('/api/arqueo'),
        fetchJson<Cxc>('/api/cxc'),
        fetchJson<Cxp>('/api/cxp'),
      ]);
      setVentasAll(v);
      setCajaAll(c);
      setArqueosAll(a);
      setCxcAll(xc);
      setCxpAll(xp);
    };
    load();
    const stop = onLive(() => void load());
    const id = setInterval(() => {
      load();
      setTick((n) => n + 1);
    }, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  const d = useMemo(() => {
    const day = hoyISO();
    const ventas = ventasAll.filter((v) => String(v.createdAt || '').slice(0, 10) === day);
    const gastos = cajaAll.filter((g) => String(g.createdAt || '').slice(0, 10) === day && (g.tipo === 'gasto' || !g.tipo));
    const ingresos = cajaAll.filter((i) => String(i.createdAt || '').slice(0, 10) === day && i.tipo === 'ingreso');

    const vendido = ventas.reduce((a, v) => a + Number(v.montoTotal || 0), 0);
    const costo = ventas.reduce((a, v) => a + Number(v.costoTotal || 0), 0);
    const margenSoles = vendido - costo;
    const margenPct = vendido > 0 ? (margenSoles / vendido) * 100 : 0;

    const porCanal = { EFECTIVO: 0, YAPE: 0, TARJETA: 0 };
    for (const v of ventas) {
      const c = canalDe(v);
      if (c === 'FIADO') continue;
      porCanal[c] += Number(v.montoTotal || 0);
    }

    const gastoCajon = gastos
      .filter((g) => {
        const c = String(g.canal || 'EFECTIVO').toUpperCase();
        return c !== 'YAPE' && c !== 'TARJETA';
      })
      .reduce((a, g) => a + Number(g.monto || 0), 0);
    const gastoYape = gastos
      .filter((g) => String(g.canal || '').toUpperCase() === 'YAPE')
      .reduce((a, g) => a + Number(g.monto || 0), 0);

    const extraIn = ingresos.reduce((a, i) => a + Number(i.monto || 0), 0);

    const sistema = Number((porCanal.EFECTIVO + extraIn - gastoCajon).toFixed(2));
    const yapeNeto = porCanal.YAPE - gastoYape;

    const ultimo = arqueosAll[0];
    const arqueoHoy = ultimo && String(ultimo.createdAt || '').slice(0, 10) === day ? ultimo : null;
    const cajonFisico = arqueoHoy ? Number(arqueoHoy.declarado || 0) : sistema;
    const descuadre = arqueoHoy ? Number(arqueoHoy.diferencia || 0) : 0;

    const cxcAbiertas = cxcAll.filter((c) => c.estado === 'ABIERTA');
    const cxpAbiertas = cxpAll.filter((c) => c.estado === 'ABIERTA');
    const cxc = cxcAbiertas.reduce((a, c) => a + Number(c.monto || 0), 0);
    const cxp = cxpAbiertas.reduce((a, c) => a + Number(c.monto || 0), 0);

    const tePuedesLlevar = Number((cajonFisico + Math.max(0, yapeNeto) - cxp - RESERVA_MINIMA).toFixed(2));

    return {
      day,
      n: ventas.length,
      vendido,
      costo,
      margenSoles,
      margenPct,
      porCanal,
      gastoCajon,
      gastoYape,
      extraIn,
      sistema,
      cajonFisico,
      yapeNeto,
      ultimo,
      arqueoHoy,
      descuadre,
      cxc,
      cxp,
      cxcN: cxcAbiertas.length,
      cxpN: cxpAbiertas.length,
      tePuedesLlevar,
    };
  }, [tick, ventasAll, cajaAll, arqueosAll, cxcAll, cxpAll]);

  const arqueoTxt = !d.arqueoHoy
    ? 'Hoy no hay arqueo'
    : d.descuadre === 0
      ? 'Caja cuadrada'
      : `${d.descuadre > 0 ? '+' : ''}${soles(d.descuadre)}`;

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">
        ← Resumen
      </Link>
      <h1 className="text-[24px] font-semibold mt-1">Cierre del día</h1>
      <p className="text-[13px] text-slate-400 mb-5">
        {d.day} · una pregunta: ¿cuánto te puedes llevar?
      </p>

      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 mb-4 max-w-3xl">
        <p className="text-[12px] uppercase tracking-wider text-emerald-300/80">Te puedes llevar</p>
        <p className={`text-[40px] font-semibold leading-none mt-1 ${d.tePuedesLlevar >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
          {soles(d.tePuedesLlevar)}
        </p>
        <p className="text-[12px] text-slate-400 mt-2">
          Cajón físico {soles(d.cajonFisico)} + Yape neto {soles(d.yapeNeto)} − deudas {soles(d.cxp)} − reserva {soles(RESERVA_MINIMA)}
        </p>
        {d.arqueoHoy && d.descuadre !== 0 && (
          <p className="text-[12px] text-red-400 mt-2">
            Arqueo descuadró {soles(d.descuadre)}. Se usa lo contado en el cajón, no el sistema ({soles(d.sistema)}).
          </p>
        )}
        {!d.arqueoHoy && (
          <p className="text-[12px] text-amber-400 mt-2">
            Aún no hay arqueo de hoy. Este número usa el sistema. Cierra caja para no mentirte.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mb-4">
        <Card label="Vendí" value={soles(d.vendido)} sub={`${d.n} tickets`} />
        <Card label="Costo" value={soles(d.costo)} sub="lo que pagaste vos" />
        <Card
          label="Margen real"
          value={soles(d.margenSoles)}
          sub={`${d.margenPct.toFixed(1)}%`}
          good={d.margenPct >= 20}
        />
        <Card label="Arqueo" value={arqueoTxt} sub={d.arqueoHoy ? 'contado hoy' : 'falta cerrar'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
          <p className="text-[13px] font-medium mb-3">Dónde está la plata de hoy</p>
          <Row k="Sistema (efectivo − gastos cajón)" v={soles(d.sistema)} />
          <Row k="Cajón físico (arqueo)" v={soles(d.cajonFisico)} />
          <Row k="Yape / Plin neto" v={soles(d.yapeNeto)} />
          <Row k="Tarjeta (aún no es efectivo)" v={soles(d.porCanal.TARJETA)} />
          <Row k="Gastos del cajón" v={soles(d.gastoCajon)} red />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
          <p className="text-[13px] font-medium mb-3">Lo que no es tuyo todavía</p>
          <Row k={`Fiados abiertos (${d.cxcN})`} v={soles(d.cxc)} />
          <Row k={`Por pagar (${d.cxpN})`} v={soles(d.cxp)} red />
          <Row k="Reserva mínima de caja" v={soles(RESERVA_MINIMA)} />
          <p className="text-[12px] text-slate-500 mt-3">
            Fiado no se lleva. Tarjeta no se lleva hasta que caiga. Reserva no se toca.
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-5 max-w-3xl">
        <Link href="/arqueo" className="h-10 px-4 rounded-xl border border-white/15 text-[13px] flex items-center">
          Cerrar arqueo
        </Link>
        <Link href="/pos" className="h-10 px-4 rounded-xl bg-white text-black text-[13px] flex items-center">
          Seguir cobrando
        </Link>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  good,
}: {
  label: string;
  value: string;
  sub?: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className={`text-[18px] font-semibold mt-1 ${good ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function Row({ k, v, red }: { k: string; v: string; red?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 text-[13px] border-t border-white/5 first:border-0">
      <span className="text-slate-400">{k}</span>
      <span className={red ? 'text-red-400' : 'text-white'}>{v}</span>
    </div>
  );
}