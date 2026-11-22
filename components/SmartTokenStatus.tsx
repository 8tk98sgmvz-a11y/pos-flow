"use client";
import React, { useState } from "react";

export function SmartTokenStatus() {
  const [status, setStatus] = useState<"conectado" | "esperando" | "pagado">("esperando");

  return (
    <div className="card p-4 border border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm">Smart Token IoT (Placa Acrílica)</h3>
          <p className="text-[11px] text-slate-400">Canal inalámbrico activo con ESP32</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 ${
          status === "pagado" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
          status === "conectado" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
          "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            status === "pagado" ? "bg-emerald-400" : status === "conectado" ? "bg-cyan-400" : "bg-amber-400"
          }`} />
          {status === "pagado" ? "Pago Verificado" : status === "conectado" ? "Placa Conectada" : "Esperando Pago"}
        </span>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setStatus("conectado")}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] rounded-lg transition"
        >
          Sincronizar
        </button>
        <button 
          onClick={() => setStatus("pagado")}
          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] rounded-lg transition font-medium"
        >
          Simular Cobro
        </button>
      </div>
    </div>
  );
} 