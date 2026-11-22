"use client";

import { useState } from "react";
import { Fingerprint } from "lucide-react";
import { stamp } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SeriesFraudPage() {
  const store = useStore();
  const [serial, setSerial] = useState("");

  const found = serial.trim() ? store.lookupSerial(serial) : undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm text-rose-300/80">Módulo Antifraude</p>
        <h2 className="text-3xl font-semibold">Anti-robo por serie</h2>
      </header>

      <section className="card p-5 space-y-4">
        <div className="flex items-center gap-2 text-rose-200">
          <Fingerprint className="h-5 w-5" />
          <h3 className="font-semibold">Consulta de Serie / IMEI</h3>
        </div>
        <div>
          <label className="label">Consultar IMEI / serie</label>
          <input
            className="input font-mono w-full"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="8612..."
          />
        </div>
        {serial.trim() ? (
          <div className="rounded-xl bg-night-900 p-4 text-sm">
            {found ? (
              <>
                <p className="text-emerald-300 font-semibold">Ya vendido — no aceptar devolución de otro equipo.</p>
                <p className="mt-1 text-slate-300">{found.productName}</p>
                <p className="text-slate-400">
                  Ticket {found.saleId} · {stamp(found.soldAt)}
                </p>
              </>
            ) : (
              <p className="text-amber-200">No figura en ventas. Verifica si es equipo ajeno o no registrado.</p>
            )}
          </div>
        ) : null}
        <p className="text-xs text-slate-500">
          {store.serials.length} IMEI/series bloqueados contra reingreso fraudulento.
        </p>
      </section>
    </div>
  );
}