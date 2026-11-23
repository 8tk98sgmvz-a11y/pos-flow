"use client";

import React, { useEffect, useRef } from "react";

interface SerialTrackerProps {
  quantity: number;
  serials: string[];
  onChange: (serials: string[]) => void;
}

export function SerialTracker({ quantity, serials, onChange }: SerialTrackerProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Ajustar el tamaño del array de series cuando cambia la cantidad
  useEffect(() => {
    if (serials.length !== quantity) {
      const newSerials = Array.from({ length: quantity }, (_, i) => serials[i] || "");
      onChange(newSerials);
    }
  }, [quantity]);

  const handleChange = (index: number, value: string) => {
    const updated = [...serials];
    updated[index] = value;
    onChange(updated);

    // Salto automático al siguiente input al completar o escanear (p. ej., longitud típica de IMEI es 15)
    if (value.length >= 15 && index < quantity - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  if (quantity <= 0) return null;

  return (
    <div className="space-y-3 mt-4 p-4 rounded-2xl apple-glass-card border border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Registro de Series / IMEIs Únicos
        </label>
        <span className="text-xs text-slate-400">
        {serials.filter(Boolean).length}
        
        </span>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
        {Array.from({ length: quantity }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-16">U. {index + 1}</span>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              value={serials[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Escanee o ingrese IMEI Unidad ${index + 1}`}
              className="w-full bg-slate-900/80 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}