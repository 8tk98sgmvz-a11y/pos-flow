'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listarPedidos, marcarPedidoAtendido, type Pedido } from '@/lib/pedidos';
import { onLive } from '@/lib/live';

function soles(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

export default function PedidosPage() {
  const [rows, setRows] = useState<Pedido[]>([]);

  const load = async () => setRows(await listarPedidos());

  useEffect(() => {
    void load();
    const stop = onLive(() => void load());
    const id = setInterval(() => void load(), 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  const pendientes = rows.filter((r) => r.estado === 'PENDIENTE').length;

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">← Resumen</Link>
      <h1 className="text-[24px] font-semibold mt-1">Pedidos WhatsApp</h1>
      <p className="text-[13px] text-slate-400 mb-5">
        {pendientes} pendientes · {rows.length} en total
      </p>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4 max-w-3xl">
        {rows.length === 0 && (
          <p className="text-[13px] text-slate-500">Aún no hay pedidos. Pide uno desde el catálogo.</p>
        )}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 border-t border-white/10 py-3 first:border-t-0">
            <div>
              <p className="text-[14px] font-medium">{r.producto}</p>
              <p className="text-[12px] text-slate-400">
                {r.sku} · {new Date(r.createdAt).toLocaleString('es-PE')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-mono">{soles(r.precio)}</p>
              {r.estado === 'PENDIENTE' ? (
                <button
                  onClick={() => {
                    void marcarPedidoAtendido(r.id).then(() => load());
                  }}
                  className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  Marcar atendido
                </button>
              ) : (
                <p className="text-[11px] text-slate-500">Atendido</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}