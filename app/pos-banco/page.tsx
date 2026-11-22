"use client";

import React, { useState } from "react";

export default function PosBancoPage() {
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">POS Banco</h1>
        <p className="text-slate-400 mb-6 text-sm">Módulo de pagos y transacciones activo.</p>
        
        <div className="mb-4">
          <label className="block text-sm text-slate-300 mb-2">Monto de la Operación (S/.)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.00" 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xl text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          onClick={async () => {
            const n = Number(amount);
            if (!Number.isFinite(n) || n <= 0) return;
            try {
              const { apiSend } = await import('@/lib/live');
              const res = await apiSend('/api/ventas', 'POST', {
                montoTotal: n,
                costoTotal: 0,
                canal: 'TARJETA',
                descripcion: 'POS Banco',
              });
              if (!res.ok) throw new Error('fail');
              alert(`Operación registrada por S/. ${n.toFixed(2)}`);
              setAmount('');
            } catch {
              alert('No se pudo guardar en la base de datos');
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Procesar Pago
        </button>
      </div>
    </div>
  );
}