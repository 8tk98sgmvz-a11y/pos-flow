'use client';

import React, { useEffect, useState } from 'react';
import { soles } from '@/lib/pnl';
import Link from 'next/link';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const Icon = {
  Home: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1m-6 0h6" />
    </svg>
  ),
  Flow: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6l2 3h10M3 17h18" />
    </svg>
  ),
  Receive: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-8 8h10a2 2 0 002-2V8l-4-4H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Pay: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Costs: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
    </svg>
  ),
  Results: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M14 7h7v7" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
    </svg>
  ),
  Trend: () => (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 16.2c2.2-2.6 3.6-2.2 5.2-.2 1.8 2.2 3.2 2.4 5.1.1L18 10.2" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6 10.1h4.7v4.6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Box: () => (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.2L20.2 7.4 12 11.6 3.8 7.4 12 3.2z" fill="#fff" />
      <path d="M4.2 8.5L11.3 12.2V20.2L4.2 16.4V8.5z" fill="#E8E4FF" />
      <path d="M12.7 12.2L19.8 8.5V16.4L12.7 20.2V12.2z" fill="#F7F5FF" />
      <path d="M12 3.2L20.2 7.4 12 11.6 3.8 7.4 12 3.2z" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4.2 8.5L11.3 12.2V20.2" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M19.8 8.5L12.7 12.2V20.2" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Percent: () => (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
      <circle cx="7.2" cy="7.2" r="2.35" stroke="#F8E7B0" strokeWidth="2.15" />
      <circle cx="16.8" cy="16.8" r="2.35" stroke="#F8E7B0" strokeWidth="2.15" />
      <path d="M16.6 6.2L7.4 17.8" stroke="#F8E7B0" strokeWidth="2.15" strokeLinecap="round" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3.2L2.4 20.2A1.2 1.2 0 003.45 22h17.1a1.2 1.2 0 001.05-1.8L12 3.2z" />
      <path d="M12 9v5.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="17.4" r="1" fill="#fff" />
    </svg>
  ),
};

const menu = [
  { name: 'POS', href: '/pos', icon: <Icon.Home /> },
  { name: 'Resumen', href: '/', icon: <Icon.Home /> },
  { name: 'Arqueo', href: '/arqueo', icon: <Icon.Flow /> },
  { name: 'Fiados', href: '/cuentas-por-cobrar', icon: <Icon.Receive /> },
  { name: 'Por pagar', href: '/cuentas-por-pagar', icon: <Icon.Pay /> },
];

const categorias = [
  { name: 'Accesorios', ventas: 'S/ 6,320.00', costo: 'S/ 4,280.00', utilidad: 'S/ 2,040.00', margen: '32.3%', tone: 'amber' },
  { name: 'Calzado', ventas: 'S/ 5,840.00', costo: 'S/ 3,510.00', utilidad: 'S/ 2,330.00', margen: '39.9%', tone: 'green' },
  { name: 'Ropa', ventas: 'S/ 4,780.00', costo: 'S/ 2,910.00', utilidad: 'S/ 1,870.00', margen: '39.1%', tone: 'green' },
  { name: 'Hogar', ventas: 'S/ 3,920.00', costo: 'S/ 2,410.00', utilidad: 'S/ 1,510.00', margen: '38.5%', tone: 'green' },
  { name: 'Belleza', ventas: 'S/ 3,820.00', costo: 'S/ 2,310.00', utilidad: 'S/ 1,510.00', margen: '39.5%', tone: 'amber' },
];

const pieData = [
  { name: 'Ventas', value: 56, pct: '62.4%', color: '#3B82F6' },
  { name: 'Costos', value: 28, pct: '38.0%', color: '#8B5CF6' },
  { name: 'Gastos', value: 16, pct: '11.3%', color: '#2DD4BF' },
];

const trendData = [
  { mes: 'Dic', margen: 8 },
  { mes: 'Ene', margen: 14 },
  { mes: 'Feb', margen: 18 },
  { mes: 'Mar', margen: 24 },
  { mes: 'Abr', margen: 31 },
  { mes: 'May', margen: 37.5 },
];

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/15 bg-[#0B1220] px-2.5 py-1.5 text-[12px] text-white shadow-xl">
      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: item.color }} />
      {item.name}: {item.pct}
    </div>
  );
}

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/15 bg-[#0B1220] px-2.5 py-1.5 text-[12px] text-white shadow-xl">
      {label}: {payload[0].value}%
    </div>
  );
}

export default function ResultadosPage() {
  const [periodo, setPeriodo] = useState('Mes');
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [pnl, setPnl] = useState({
    ventas: 0,
    costo: 0,
    utilidadBruta: 0,
    gastos: 0,
    utilidadNeta: 0,
    margen: 0,
  });
  const periodos = ['Hoy', 'Semana', 'Mes', 'Personalizado'];

  useEffect(() => {
    const load = () => {
      import('@/lib/pnl').then(({ resumenPnl }) => resumenPnl().then(setPnl)).catch(() => {});
    };
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  const pieLive = [
    { name: 'Ventas', value: Math.max(pnl.ventas, 0.01), pct: '100%', color: '#3B82F6' },
    { name: 'Costos', value: Math.max(pnl.costo, 0), pct: `${pnl.margen ? ((pnl.costo / Math.max(pnl.ventas, 1)) * 100).toFixed(1) : '0'}%`, color: '#8B5CF6' },
    { name: 'Gastos', value: Math.max(pnl.gastos, 0), pct: `${pnl.ventas ? ((pnl.gastos / pnl.ventas) * 100).toFixed(1) : '0'}%`, color: '#2DD4BF' },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white font-sans flex">
      <aside className="hidden md:flex w-[196px] shrink-0 border-r border-white/10 bg-[#05070D] flex-col">
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">R</div>
          <p className="text-[13px] font-bold tracking-wide">RETAIL OS</p>
        </div>
        <nav className="px-3 mt-2 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-white/70 hover:bg-white/5"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-3 min-w-0">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2 mb-2">
          <div>
            <h1 className="text-[28px] leading-none font-semibold tracking-tight">Resultados y Rentabilidad</h1>
            <p className="text-[13px] text-white mt-1.5">Utilidad real del negocio · Margen y P&L del periodo</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"><Icon.Search /></span>
              <input
                placeholder="Buscar"
                className="h-9 w-[180px] pl-9 pr-3 rounded-xl bg-[#0B1220] border border-white/10 text-[12px] text-white placeholder:text-white/70 outline-none"
              />
            </div>
            <div className="h-9 rounded-xl border border-white/10 bg-[#0B1220] p-[3px] flex items-center">
              {periodos.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`h-[30px] px-3 text-[12px] whitespace-nowrap transition-colors ${
                    periodo === p ? 'rounded-lg bg-[#2563EB] text-white' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="h-9 px-3 rounded-xl bg-[#0B1220] border border-white/10 text-[12px] flex items-center gap-1.5">
              <Icon.Download /> Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-2">
          <Kpi iconBg="bg-[#2F6BFF]" icon={<Icon.Trend />} label="Ventas del mes" value={soles(pnl.ventas)} />
          <Kpi iconBg="bg-[#7C3AED]" icon={<Icon.Box />} label="Costo de venta" value={soles(pnl.costo)} />
          <Kpi iconBg="bg-[#16A34A]" icon={<Icon.Trend />} label="Utilidad bruta" value={soles(pnl.utilidadBruta)} />
          <Kpi iconBg="bg-[#C98616]" icon={<Icon.Percent />} label="Margen real" value={`${pnl.margen.toFixed(1)}%`} />
        </div>

        <div className="grid grid-cols-12 gap-2 mb-2 items-stretch">
          <section className="col-span-12 xl:col-span-4 rounded-2xl border border-white/10 bg-[#0B1220] p-3 h-full">
            <h3 className="text-[14px] font-medium mb-2">Estado de resultados</h3>
            <Row label="Ventas" value={soles(pnl.ventas)} />
            <Row label="(-) Costo de mercadería" value={soles(pnl.costo)} muted />
            <Row label="Utilidad bruta" value={soles(pnl.utilidadBruta)} />
            <Row label="(-) Gastos operativos" value={soles(pnl.gastos)} muted />
            <Row label="(-) Impuestos" value={soles(0)} muted />
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
              <span className="text-[13px] font-semibold">= Utilidad neta</span>
              <span className="text-[15px] font-semibold text-emerald-400">{soles(pnl.utilidadNeta)}</span>
            </div>
          </section>

          <section className="col-span-12 xl:col-span-4 rounded-2xl border border-white/10 bg-[#0B1220] p-3 h-full">
            <h3 className="text-[14px] font-medium mb-2">Composición del margen</h3>
            <div className="flex items-center gap-3">
              <div className="w-[140px] h-[140px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieLive}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={62}
                      paddingAngle={2}
                      stroke="none"
                      onMouseEnter={(_, i) => setActiveSlice(pieLive[i].name)}
                      onMouseLeave={() => setActiveSlice(null)}
                    >
                      {pieLive.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} opacity={!activeSlice || activeSlice === entry.name ? 1 : 0.35} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full text-[13px]">
                {pieLive.map((item, i) => (
                  <button key={item.name} type="button" onMouseEnter={() => setActiveSlice(item.name)} onMouseLeave={() => setActiveSlice(null)} className="w-full text-left">
                    <Legend color={item.color} name={item.name} pct={item.pct} last={i === pieLive.length - 1} active={!activeSlice || activeSlice === item.name} />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-12 xl:col-span-4 space-y-2 h-full flex flex-col">
            <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-3 py-2">
              <h3 className="text-[14px] font-medium mb-1">Tendencia 6 meses</h3>
              <div className="h-[92px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="margenFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 40]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<TrendTooltip />} />
                    <Area type="monotone" dataKey="margen" stroke="#22c55e" strokeWidth={2.2} fill="url(#margenFill)" activeDot={{ r: 4, fill: '#22c55e' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-3 py-2 flex-1">
              <h3 className="text-[14px] font-medium mb-1.5">Alertas de rentabilidad</h3>
              <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-2.5 py-1.5 mb-1.5 flex items-start gap-2">
                <span className="text-red-500 shrink-0 scale-90"><Icon.Alert /></span>
                <p className="text-[11.5px] leading-snug text-white">Margen de accesorios cayó 8 pts<br />Revisar precios y promociones</p>
              </div>
              <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1.5 flex items-start gap-2">
                <span className="text-amber-400 shrink-0 scale-90"><Icon.Alert /></span>
                <p className="text-[11.5px] leading-snug text-white">3 productos bajo costo<br />Revisar lista de productos</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#0B1220] overflow-hidden">
          <div className="px-4 py-2 text-[14px] font-medium">Rentabilidad por categoría</div>
          <table className="w-full text-[12px]">
            <thead className="text-white/60">
              <tr className="border-y border-white/10">
                <th className="text-left font-medium px-4 py-2">Categoría</th>
                <th className="text-right font-medium px-4 py-2">Ventas</th>
                <th className="text-right font-medium px-4 py-2">Costo</th>
                <th className="text-right font-medium px-4 py-2">Utilidad</th>
                <th className="text-right font-medium px-4 py-2">Margen</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.name} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-2 text-right text-white">{c.ventas}</td>
                  <td className="px-4 py-2 text-right text-white">{c.costo}</td>
                  <td className="px-4 py-2 text-right text-white">{c.utilidad}</td>
                  <td className="px-4 py-2 text-right">
                    <span
                      className={`inline-flex items-center justify-center min-w-[58px] h-6 px-2.5 rounded-full text-[11px] font-medium backdrop-blur-sm ${
                        c.tone === 'green'
                          ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20'
                          : 'bg-amber-500/15 text-amber-200 border border-amber-400/20'
                      }`}
                    >
                      {c.margen}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function Kpi({ iconBg, icon, label, value }: { iconBg: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-3 py-2.5 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-[14px] ${iconBg} flex items-center justify-center shrink-0 shadow-inner`}>{icon}</div>
      <div>
        <p className="text-[12px] text-white font-medium">{label}</p>
        <p className="text-[22px] leading-tight font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/10">
      <span className={`text-[13px] ${muted ? 'text-white/70' : 'text-white'}`}>{label}</span>
      <span className="text-[13px] text-white">{value}</span>
    </div>
  );
}

function Legend({ color, name, pct, last = false, active = true }: { color: string; name: string; pct: string; last?: boolean; active?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${last ? '' : 'border-b border-white/10'} ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span className="text-white">{name}</span>
      </div>
      <span className="text-white">{pct}</span>
    </div>
  );
} 