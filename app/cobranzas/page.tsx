"use client";

import { useState } from "react";
import { Bell, MessageCircle, Wallet } from "lucide-react";
import { soles, stamp } from "@/lib/format";
import { useStore } from "@/lib/store";
import { waLink } from "@/lib/whatsapp";

export default function CollectionsPage() {
  const store = useStore();
  const [pay, setPay] = useState<Record<string, string>>({});
  const pending = store.customers.filter((c) => c.balance > 0);
  const total = pending.reduce((s, c) => s + c.balance, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-300/80">Módulo 4</p>
          <h2 className="text-3xl font-semibold">Fiados y saldos pendientes</h2>
        </div>
        <div className="card px-4 py-3">
          <p className="text-xs uppercase text-slate-500">Por cobrar</p>
          <p className="text-xl font-semibold">{soles(total)}</p>
        </div>
      </header>

      <div className="space-y-3">
        {pending.map((c) => {
          const reminder = `Hola ${c.name}, te escribimos de ${store.shop.name}. Tienes un saldo pendiente de ${soles(c.balance)}. ¿Puedes regularizarlo hoy? Gracias.`;
          return (
            <article key={c.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-slate-400">
                    Última compra {stamp(c.lastPurchaseAt)}
                    {c.lastReminderAt ? ` · recordatorio ${stamp(c.lastReminderAt)}` : ""}
                  </p>
                </div>
                <p className="text-2xl font-semibold text-rose-200">{soles(c.balance)}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  className="btn-primary"
                  href={waLink(c.phone, reminder)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => store.recordReminder(c.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  Recordatorio WhatsApp
                </a>
                <input
                  className="input w-36"
                  type="number"
                  step="0.01"
                  placeholder="Abono"
                  value={pay[c.id] ?? ""}
                  onChange={(e) => setPay((p) => ({ ...p, [c.id]: e.target.value }))}
                />
                <button
                  className="btn-ghost"
                  onClick={() => {
                    const n = Number(pay[c.id]);
                    if (n > 0) {
                      store.payCredit(c.id, n);
                      setPay((p) => ({ ...p, [c.id]: "" }));
                    }
                  }}
                >
                  <Wallet className="h-4 w-4" />
                  Registrar abono
                </button>
                {c.lastReminderAt ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Bell className="h-3.5 w-3.5" />
                    Seguimiento activo
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
        {pending.length === 0 ? (
          <p className="text-slate-500">No hay saldos pendientes.</p>
        ) : null}
      </div>
    </div>
  );
}
