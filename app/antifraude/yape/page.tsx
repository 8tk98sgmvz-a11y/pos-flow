"use client";

import { Clock3 } from "lucide-react";
import { soles, stamp } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function YapeFraudPage() {
  const store = useStore();
  const yapeSales = store.sales.filter((s) => s.yapeCheck);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-sm text-cyan-300/80">Módulo Antifraude</p>
        <h2 className="text-3xl font-semibold">Verificador Yape / Plin</h2>
      </header>

      <section className="card p-5">
        <div className="mb-4 flex items-center gap-2 text-cyan-200">
          <Clock3 className="h-5 w-5" />
          <h3 className="font-semibold">Historial de Transferencias Digitales</h3>
        </div>
        <p className="mb-4 text-sm text-slate-400">
          Cada transferencia guarda los últimos 4 dígitos y la hora sellada por el POS, no la del comprobante del cliente.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Venta</th>
                <th>Canal</th>
                <th>Últimos 4</th>
                <th>Hora capturada</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {yapeSales.map((s) => (
                <tr key={s.id} className="border-t border-white/10">
                  <td className="py-2 font-mono">{s.id}</td>
                  <td className="uppercase">{s.yapeCheck?.channel}</td>
                  <td className="font-mono tracking-widest">{s.yapeCheck?.last4}</td>
                  <td>{s.yapeCheck ? stamp(s.yapeCheck.capturedAt) : "—"}</td>
                  <td>{soles(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}