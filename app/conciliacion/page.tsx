'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { runConciliacion } from '@/lib/conciliacion/run';
import { guardarMatchManual, marcarVentasConciliadas } from '@/lib/conciliacion/conciliadas';
import type { InformeConciliacion } from '@/lib/conciliacion';

const Icon = {
  Home: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-6 0h6" />
    </svg>
  ),
  Flow: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 11-8 0" />
    </svg>
  ),
  Pay: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Cost: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v-1" />
    </svg>
  ),
  Chart: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6V7m4 10v-3M4 19h16" />
    </svg>
  ),
  Bank: ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M6 10v8m4-8v8m4-8v8m4-8v8M3 18h18M12 4l9 5H3l9-5z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  Warn: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  Refresh: ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 00-13.5-5.8L5 8M4 12a8 8 0 0013.5 5.8L19 16M5 4v4h4M19 20v-4h-4" />
    </svg>
  ),
};

const menu = [
  { name: 'POS', href: '/pos', icon: <Icon.Home /> },
  { name: 'Resumen', href: '/', icon: <Icon.Home /> },
  { name: 'Arqueo', href: '/arqueo', icon: <Icon.Flow /> },
  { name: 'Fiados', href: '/cuentas-por-cobrar', icon: <Icon.Users /> },
  { name: 'Por pagar', href: '/cuentas-por-pagar', icon: <Icon.Pay /> },
];

function soles(n: number) {
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtFecha(d: Date) {
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) return '—';
  return x.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type BancoPick = { ref: string; monto: number; desc: string };

export default function ConciliacionPage() {
  const [periodo, setPeriodo] = useState('Mes');
  const [q, setQ] = useState('');
  const [informe, setInforme] = useState<InformeConciliacion | null>(null);
  const [archivoNombre, setArchivoNombre] = useState('');
  const [csvTexto, setCsvTexto] = useState<string | undefined>();
  const [pick, setPick] = useState<BancoPick | null>(null);

  async function correr(texto?: string) {
    const inf = await runConciliacion(texto);
    const ids = (inf.matches || [])
      .filter((m) => m.estado === 'MATCHED' && m.venta)
      .map((m) => String(m.venta!.id));
    if (ids.length) await marcarVentasConciliadas(ids);
    setInforme(inf);
  }

  useEffect(() => {
    correr();
  }, []);

  function importarExtracto(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const texto = String(reader.result ?? '');
        if (!texto.trim()) {
          alert('El archivo está vacío');
          return;
        }
        setCsvTexto(texto);
        setArchivoNombre(file.name);
        correr(texto);
      } catch (e) {
        console.error(e);
        alert('No pude leer el extracto. Usa CSV con columnas: fecha, descripcion, monto, referencia');
      }
    };
    reader.readAsText(file);
  }

  function unirConVenta(ventaId: string, monto: number) {
    if (!pick) return;
    void guardarMatchManual({ bancoRef: pick.ref, ventaId, monto }).then(() => {
      setPick(null);
      void correr(csvTexto);
    });
  }

  const engineRows = useMemo(() => {
    if (!informe) return [];

    const fromBank = informe.matches.map((m) => ({
      fecha: fmtFecha(m.banco.fecha),
      desc: m.banco.descripcion,
      ref: m.venta ? `Venta ${m.venta.id}` : m.banco.referencia,
      bancoRef: m.banco.referencia,
      origen: 'Banco' as const,
      monto: m.banco.monto,
      estado:
        m.estado === 'MATCHED'
          ? 'Listo'
          : m.estado === 'MATCHED_WITH_WARNING'
          ? 'Revisar'
          : 'Sin match',
      tone: (m.estado === 'MATCHED' ? 'green' : m.estado === 'MATCHED_WITH_WARNING' ? 'amber' : 'red') as
        | 'green'
        | 'amber'
        | 'red',
    }));

    const fromSales = (informe.ventasSinBanco ?? []).map((v) => ({
      fecha: fmtFecha(new Date(v.fechaCreacion)),
      desc: `Venta POS ${v.id}`,
      ref: v.idempotencyKey,
      bancoRef: '',
      origen: 'Libro' as const,
      monto: v.montoTotal,
      estado: 'Sin match',
      tone: 'amber' as const,
    }));

    return [...fromBank, ...fromSales];
  }, [informe]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return engineRows;
    return engineRows.filter(
      (r) =>
        r.desc.toLowerCase().includes(s) ||
        r.ref.toLowerCase().includes(s) ||
        r.origen.toLowerCase().includes(s)
    );
  }, [q, engineRows]);

  const ventasPendientes = informe?.ventasSinBanco ?? [];

  if (!informe) {
    return (
      <div className="min-h-screen bg-[#07080d] text-white flex items-center justify-center text-sm">
        Cargando conciliación…
      </div>
    );
  }

  const sinConciliar = informe.resumen.unidentified + informe.resumen.ventasHuérfanas;

  return (
    <div className="min-h-screen bg-[#07080d] text-white font-sans flex">
      <aside className="hidden md:flex w-[232px] shrink-0 border-r border-white/[0.05] bg-[#05060a] flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">R</div>
          <p className="text-[13px] font-semibold tracking-wide">RETAIL OS</p>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/70 hover:bg-white/5 hover:text-white"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-5 md:px-7 py-5">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight">Conciliación y Bancos</h1>
            <p className="text-[13px] text-white/50 mt-0.5">
              {informe.resumen.matched} matched · {informe.resumen.unidentified} banco sin venta · {informe.resumen.ventasHuérfanas} ventas sin banco
              {archivoNombre ? ` · ${archivoNombre}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Icon.Search />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar movimientos..."
                className="h-9 w-[220px] pl-9 pr-3 rounded-xl bg-[#11131a] border border-white/[0.06] text-[12px] placeholder:text-white/35 outline-none"
              />
            </div>
            <div className="flex rounded-xl border border-white/[0.06] bg-[#11131a] p-0.5">
              {['Hoy', 'Semana', 'Mes', 'Personalizado'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`h-8 px-3 text-[12px] rounded-lg ${periodo === p ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="h-9 px-3 rounded-xl border border-white/[0.06] bg-[#11131a] text-[12px] flex items-center gap-1.5">
              <Icon.Download /> Exportar
            </button>
            <input
              type="file"
              accept=".csv,text/csv,.txt,text/plain"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importarExtracto(f);
                e.target.value = '';
              }}
              className="max-w-[260px] text-[12px] text-white file:mr-3 file:h-9 file:px-3 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          <Kpi tone="blue" title="Saldo en libros" value={soles(12480.5)} icon="bank" />
          <Kpi tone="purple" title="Saldo en banco" value={soles(11940)} icon="bank" />
          <Kpi tone="amber" title="Diferencia" value={soles(540.5)} icon="warn" />
          <Kpi tone="teal" title="Movimientos sin conciliar" value={String(sinConciliar)} icon="refresh" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 mb-4">
          <section className="xl:col-span-8 rounded-2xl border border-white/[0.05] bg-[#0b0d13] p-4">
            <h2 className="text-[15px] font-semibold mb-3">Pendientes de conciliar</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="text-white/40 text-[11px]">
                    <th className="text-left font-medium pb-2">FECHA</th>
                    <th className="text-left font-medium pb-2">DESCRIPCIÓN</th>
                    <th className="text-left font-medium pb-2">ORIGEN</th>
                    <th className="text-right font-medium pb-2">MONTO</th>
                    <th className="text-right font-medium pb-2">ESTADO</th>
                    <th className="text-right font-medium pb-2">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${r.origen}-${r.ref}-${i}`} className="border-t border-white/[0.04]">
                      <td className="py-3 text-white/70 whitespace-nowrap">{r.fecha}</td>
                      <td className="py-3">
                        <p className="text-white">{r.desc}</p>
                        {r.ref && <p className="text-white/40 text-[11px]">{r.ref}</p>}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md ${
                            r.origen === 'Libro' ? 'bg-blue-500/15 text-blue-300' : 'bg-violet-500/15 text-violet-300'
                          }`}
                        >
                          {r.origen}
                        </span>
                      </td>
                      <td className="py-3 text-right text-white">{soles(r.monto)}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md ${
                            r.tone === 'green'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : r.tone === 'red'
                              ? 'bg-red-500/15 text-red-300'
                              : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {r.origen === 'Banco' && r.estado === 'Sin match' && r.monto > 0 && (
                          <button
                            onClick={() => setPick({ ref: r.bancoRef, monto: r.monto, desc: r.desc })}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500"
                          >
                            Esta es esta
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="xl:col-span-4 rounded-2xl border border-white/[0.05] bg-[#0b0d13] p-4 space-y-2.5">
            <h2 className="text-[15px] font-semibold mb-1">Cuentas bancarias</h2>
            <BankCard name="BCP" amount={8120} pct={98} kind="bcp" />
            <BankCard name="Interbank" amount={3820} pct={95} kind="interbank" />
            <BankCard name="Yape" amount={540} pct={90} kind="yape" />
          </section>
        </div>
      </main>

      {pick && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0f16] p-5">
            <p className="text-sm text-white/50">Unir movimiento de banco</p>
            <h3 className="text-lg font-semibold mt-1">{pick.desc}</h3>
            <p className="text-white/70 text-sm mt-0.5">{soles(pick.monto)}</p>
            <p className="text-[12px] text-white/40 mt-3 mb-2">Elige la venta del POS</p>
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {ventasPendientes.length === 0 && (
                <p className="text-sm text-white/40">No hay ventas pendientes</p>
              )}
              {ventasPendientes.map((v) => (
                <button
                  key={v.id}
                  onClick={() => unirConVenta(v.id, v.montoTotal)}
                  className="w-full text-left rounded-xl border border-white/10 px-3 py-2 hover:bg-white/5"
                >
                  <p className="text-sm text-white">{soles(v.montoTotal)}</p>
                  <p className="text-[11px] text-white/45">{v.id}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPick(null)}
              className="mt-4 w-full h-9 rounded-xl border border-white/10 text-sm text-white/70"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: string;
  tone: 'blue' | 'purple' | 'amber' | 'teal';
  icon: 'bank' | 'warn' | 'refresh';
}) {
  const theme = {
    blue: { card: 'bg-[#0b1220] border-white/[0.05]', ring: 'bg-[#163056] text-[#7eb6ff]' },
    purple: { card: 'bg-[#0e0b16] border-white/[0.05]', ring: 'bg-[#2a1a4a] text-[#c084fc]' },
    amber: { card: 'bg-[#12100a] border-white/[0.05]', ring: 'bg-[#3a2e12] text-[#fbbf24]' },
    teal: { card: 'bg-[#0a1214] border-white/[0.05]', ring: 'bg-[#12343a] text-[#2dd4bf]' },
  }[tone];

  return (
    <div className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3.5 ${theme.card}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${theme.ring}`}>
        {icon === 'warn' ? (
          <Icon.Warn className="w-[22px] h-[22px]" />
        ) : icon === 'refresh' ? (
          <Icon.Refresh className="w-[22px] h-[22px]" />
        ) : (
          <Icon.Bank className="w-[22px] h-[22px]" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-white/80 leading-tight">{title}</p>
        <p className="text-[22px] font-semibold tracking-tight text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function BankGlyph({ kind }: { kind: 'bcp' | 'interbank' | 'yape' }) {
  if (kind === 'bcp') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#c4453c] flex items-center justify-center text-white shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M6 10v7m3-7v7m3-7v7m3-7v7m3-7v7M3 17h18M12 4l9 5H3l9-5z" />
        </svg>
      </div>
    );
  }
  if (kind === 'interbank') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#2f4aa0] flex items-center justify-center text-white shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 11l8-6 8 6v8.5a.5.5 0 01-.5.5H16v-5H8v5H4.5a.5.5 0 01-.5-.5V11z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#2f8f86] flex items-center justify-center text-white shrink-0">
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.15 6.22 2.15 11.48c0 1.86.55 3.59 1.5 5.05L2 22l5.66-1.48a10.2 10.2 0 004.38.98c5.46 0 9.89-4.22 9.89-9.48S17.5 2 12.04 2z" />
      </svg>
    </div>
  );
}

function BankCard({
  name,
  amount,
  pct,
  kind,
}: {
  name: string;
  amount: number;
  pct: number;
  kind: 'bcp' | 'interbank' | 'yape';
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#08090e] px-3 py-2.5">
      <div className="flex items-center gap-3">
        <BankGlyph kind={kind} />
        <div className="min-w-[92px]">
          <p className="text-[13px] font-medium text-white leading-tight">{name}</p>
          <p className="text-[13px] text-white/80 mt-0.5">{soles(amount).replace('.00', '')}</p>
        </div>
        <div className="flex-1 flex flex-col items-end justify-center gap-1.5">
          <p className="text-[11px] text-white/45">Coincidencia</p>
          <div className="flex items-center gap-2 w-full max-w-[150px]">
            <div className="flex-1 h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-[#7ddea8]" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-white/50 w-8 text-right">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}