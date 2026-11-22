'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  listarGarantias,
  buscarGarantiaPorCodigo,
  estaVigente,
  venceEl,
  diasRestantes,
  type Garantia,
} from '@/lib/garantias';

function fmt(d: Date) {
  return d.toLocaleDateString('es-PE');
}

export default function GarantiasPage() {
  const [rows, setRows] = useState<Garantia[]>([]);
  const [q, setQ] = useState('');

  const [exacta, setExacta] = useState<Garantia | null>(null);

  useEffect(() => {
    const tick = async () => setRows(await listarGarantias());
    void tick();
    const id = setInterval(() => void tick(), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    buscarGarantiaPorCodigo(q).then(setExacta);
  }, [q, rows]);

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.codigo.toLowerCase().includes(s) ||
        r.sku.toLowerCase().includes(s) ||
        r.producto.toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">← Resumen</Link>
      <h1 className="text-[24px] font-semibold mt-1">Garantías</h1>
      <p className="text-[13px] text-slate-400 mb-4">{rows.length} registradas · 30 días al vender con código</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Pega el código / IMEI del cliente"
        className="h-10 w-full max-w-md mb-4 rounded-lg bg-[#0B1220] border border-white/10 px-3 text-[13px]"
      />

      {exacta && (
        <div className={`max-w-md mb-4 rounded-2xl border p-4 ${estaVigente(exacta) ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
          <p className="text-[11px] text-white/60">Consulta exacta</p>
          <p className="text-[16px] font-medium mt-1">{exacta.producto}</p>
          <p className="font-mono text-[13px] mt-0.5">{exacta.codigo}</p>
          <p className="text-[13px] mt-2">
            Vence {fmt(venceEl(exacta))} · {estaVigente(exacta) ? `${diasRestantes(exacta)} días` : 'vencida'}
          </p>
          <p className={`text-[14px] font-semibold mt-1 ${estaVigente(exacta) ? 'text-emerald-400' : 'text-red-400'}`}>
            {estaVigente(exacta) ? 'Vigente — cubre' : 'Vencida — no cubre'}
          </p>
        </div>
      )}

      {q.trim() && !exacta && (
        <p className="text-[13px] text-amber-400 mb-4">Ese código no tiene garantía registrada.</p>
      )}

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
        <table className="w-full text-[13px]">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left pb-2">Código</th>
              <th className="text-left pb-2">Producto</th>
              <th className="text-left pb-2">Vence</th>
              <th className="text-left pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-slate-500 text-center">
                  Aún no hay garantías. Se crean al vender un código.
                </td>
              </tr>
            )}
            {filtradas.map((g) => {
              const ok = estaVigente(g);
              return (
                <tr key={g.id} className="border-t border-white/10">
                  <td className="py-2 font-mono">{g.codigo}</td>
                  <td className="py-2">{g.producto}</td>
                  <td className="py-2">{fmt(venceEl(g))}</td>
                  <td className={ok ? 'text-emerald-400' : 'text-red-400'}>
                    {ok ? 'Vigente' : 'Vencida'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}