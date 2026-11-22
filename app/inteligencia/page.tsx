'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { calcularAlertas, type Alerta } from '@/lib/alertas';
import { onLive } from '@/lib/live';

export default function InteligenciaPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    const tick = async () => {
      const data = await calcularAlertas();
      setAlertas(Array.isArray(data) ? data : []);
    };
    tick();
    const stop = onLive(() => void tick());
    const id = setInterval(tick, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">← Resumen</Link>
      <h1 className="text-[24px] font-semibold mt-1">Inteligencia</h1>
      <p className="text-[13px] text-slate-400 mb-5">Sale de CxC, CxP, caja y el último arqueo. No se escribe a mano.</p>

      <div className="space-y-3 max-w-2xl">
        {alertas.length === 0 && (
          <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-2xl p-4">
            <p className="text-[15px] font-medium text-emerald-400">Sin alertas</p>
            <p className="text-[13px] text-slate-400 mt-1">Fiados, deudas y arqueo están en cero.</p>
          </div>
        )}
        {alertas.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl p-4 border ${
              a.nivel === 'rojo'
                ? 'border-red-500/40 bg-red-950/30'
                : a.nivel === 'ambar'
                ? 'border-amber-500/40 bg-amber-950/20'
                : 'border-emerald-500/30 bg-emerald-950/20'
            }`}
          >
            <p className="text-[15px] font-medium">{a.titulo}</p>
            <p className="text-[13px] text-slate-300 mt-1">{a.detalle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}