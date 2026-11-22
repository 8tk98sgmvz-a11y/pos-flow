"use client";

import { FormEvent, useState } from "react";
import { EyeOff, ShieldAlert } from "lucide-react";
import { soles, stamp } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ArqueoPage() {
  const store = useStore();
  const [counted, setCounted] = useState("");
  const [note, setNote] = useState("");
  const [opening, setOpening] = useState("250");
  const [closeResult, setCloseResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onClose = (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const closed = store.closeCashBlind(Number(counted), note);
      setCloseResult(
        `Esperado ${soles(closed.expectedCash ?? 0)} · Contado ${soles(closed.countedAmount ?? 0)} · Diferencia ${soles(closed.difference ?? 0)}`,
      );
      setCounted("");
      setNote("");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Error al cerrar caja");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-sm text-amber-300/80">Módulo Arqueo</p>
        <h2 className="text-3xl font-semibold">Arqueo de caja ciego</h2>
      </header>

      <section className="card p-5">
        <div className="mb-4 flex items-center gap-2 text-amber-200">
          <EyeOff className="h-5 w-5" />
          <h3 className="font-semibold">Control de Efectivo</h3>
        </div>
        <p className="mb-4 max-w-3xl text-sm text-slate-400">
          El cajero cuenta el efectivo sin ver el esperado. Al cerrar se revela el descuadre.
        </p>
        {store.cashSession ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-night-900 p-4">
              <p className="text-xs uppercase text-slate-500">Caja abierta</p>
              <p className="mt-1 font-medium">{stamp(store.cashSession.openedAt)}</p>
              <p className="mt-2 text-sm text-slate-400">
                Fondo inicial oculto al conteo. Solo se usa al revelar el cierre.
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs text-amber-200">
                <ShieldAlert className="h-4 w-4" />
                El esperado se calcula después de capturar el contado.
              </p>
            </div>
            <form onSubmit={onClose} className="space-y-3">
              <div>
                <label className="label">Efectivo contado</label>
                <input
                  className="input w-full"
                  type="number"
                  step="0.01"
                  required
                  value={counted}
                  onChange={(e) => setCounted(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Observación</label>
                <input className="input w-full" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <button className="btn-primary w-full">Cerrar y revelar descuadre</button>
              {err ? <p className="text-sm text-rose-300">{err}</p> : null}
              {closeResult ? <p className="text-sm text-cyan-200 font-semibold">{closeResult}</p> : null}
            </form>
          </div>
        ) : (
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              store.openCash(Number(opening));
              setCloseResult(null);
            }}
          >
            <div>
              <label className="label">Fondo de apertura</label>
              <input
                className="input w-40"
                type="number"
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
              />
            </div>
            <button className="btn-primary">Abrir caja</button>
          </form>
        )}

        {store.cashHistory.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Cierre</th>
                  <th>Esperado</th>
                  <th>Contado</th>
                  <th>Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {store.cashHistory.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="py-2">{c.closedAt ? stamp(c.closedAt) : "—"}</td>
                    <td>{soles(c.expectedCash ?? 0)}</td>
                    <td>{soles(c.countedAmount ?? 0)}</td>
                    <td className={(c.difference ?? 0) === 0 ? "text-emerald-300" : "text-rose-300"}>
                      {soles(c.difference ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}