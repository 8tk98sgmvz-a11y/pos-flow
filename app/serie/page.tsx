'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listarUnidades, registrarUnidad, aplicarStockDesdeSeries, type Unidad } from '@/lib/imei';
import { onLive } from '@/lib/live';

export default function SeriePage() {
  const [rows, setRows] = useState<Unidad[]>([]);
  const [sku, setSku] = useState('');
  const [codigo, setCodigo] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const tick = async () => setRows(await listarUnidades());
    void tick();
    const stop = onLive(() => void tick());
    const id = setInterval(() => void tick(), 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  const enTienda = useMemo(() => rows.filter((r) => r.estado === 'EN_TIENDA').length, [rows]);

  const filtradas = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        String(r.sku || '').toLowerCase().includes(s) ||
        String(r.codigo || '').toLowerCase().includes(s)
    );
  }, [rows, q]);

  async function agregar(e?: React.FormEvent) {
    e?.preventDefault();
    const form = document.getElementById('form-serie') as HTMLFormElement | null;
    const fd = form ? new FormData(form) : null;
    const s = String(fd?.get('sku') ?? sku).trim();
    const c = String(fd?.get('codigo') ?? codigo).trim();
    if (!s || !c) {
      alert('Escribe SKU y código. El texto gris no cuenta.');
      return;
    }
    try {
      await registrarUnidad(s, c);
      setCodigo('');
      setRows(await listarUnidades());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo cargar');
    }
  }

  async function cuadrar() {
    const n = await aplicarStockDesdeSeries();
    setRows(await listarUnidades());
    alert(n === 0 ? 'Nada que cuadrar. Productos sin código no usan series.' : `Stock actualizado en ${n} producto(s).`);
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href="/" className="text-[12px] text-slate-400">← Resumen</Link>
          <h1 className="text-[24px] font-semibold mt-1">Serie / Código</h1>
          <p className="text-[13px] text-slate-400">{enTienda} en tienda · {rows.length} registradas</p>
        </div>
        <button type="button" onClick={cuadrar} className="h-9 px-4 rounded-lg border border-white/15 text-[13px]">
          Cuadrar stock = series
        </button>
      </div>

      <form id="form-serie" onSubmit={agregar} className="bg-[#0B1220] border border-white/10 rounded-2xl p-4 mb-3 flex flex-wrap gap-2 items-end">
        <div>
          <p className="text-[11px] text-slate-400 mb-1">SKU del producto</p>
          <input
            name="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="escribe el SKU"
            autoComplete="off"
            className="h-9 w-40 rounded-lg bg-[#070B14] border border-white/10 px-2 text-[13px]"
          />
        </div>
        <div>
          <p className="text-[11px] text-slate-400 mb-1">Código / IMEI / Serie</p>
          <input
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="escribe el código"
            autoComplete="off"
            className="h-9 w-56 rounded-lg bg-[#070B14] border border-white/10 px-2 text-[13px]"
          />
        </div>
        <button type="submit" className="h-9 px-4 rounded-lg bg-blue-600 text-[13px] font-medium">
          Cargar unidad
        </button>
      </form>

      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar SKU o código..."
          className="h-9 w-full max-w-md rounded-lg bg-[#0B1220] border border-white/10 px-3 text-[13px]"
        />
      </div>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
        <table className="w-full text-[13px]">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left pb-2">SKU</th>
              <th className="text-left pb-2">Código</th>
              <th className="text-left pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-slate-500 text-center">
                  {rows.length === 0 ? 'Aún no hay unidades. Carga un código.' : 'Ningún código coincide.'}
                </td>
              </tr>
            )}
            {filtradas.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-2">{r.sku}</td>
                <td className="py-2 font-mono">{r.codigo}</td>
                <td className="py-2">
                  <span className={r.estado === 'EN_TIENDA' ? 'text-emerald-400' : 'text-slate-400'}>
                    {r.estado === 'EN_TIENDA' ? 'En tienda' : 'Vendida'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}