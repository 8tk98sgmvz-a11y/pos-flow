'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { leerNegocio, guardarNegocio } from '@/lib/negocio';

export default function NegocioPage() {
  const [nombre, setNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [yape, setYape] = useState('');

  useEffect(() => {
    leerNegocio().then((n) => {
      setNombre(n.nombre);
      setRuc(n.ruc);
      setWhatsapp(n.whatsapp);
      setYape(n.yape);
    });
  }, []);

  const guardar = async () => {
    await guardarNegocio({ nombre, ruc, whatsapp, yape });
    alert('Datos del negocio guardados. Salen en el ticket.');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">← Resumen</Link>
      <h1 className="text-[24px] font-semibold mt-1">Negocio</h1>
      <p className="text-[13px] text-slate-400 mb-5">Estos datos salen en cada ticket.</p>

      <div className="max-w-md space-y-3 bg-[#0B1220] border border-white/10 rounded-2xl p-4">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Nombre del local</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full h-10 rounded-lg bg-[#070B14] border border-white/10 px-3 text-[13px]" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">RUC</label>
          <input value={ruc} onChange={(e) => setRuc(e.target.value)} className="w-full h-10 rounded-lg bg-[#070B14] border border-white/10 px-3 text-[13px]" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">WhatsApp</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full h-10 rounded-lg bg-[#070B14] border border-white/10 px-3 text-[13px]" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Yape</label>
          <input value={yape} onChange={(e) => setYape(e.target.value)} className="w-full h-10 rounded-lg bg-[#070B14] border border-white/10 px-3 text-[13px]" />
        </div>
        <button onClick={guardar} className="w-full h-10 rounded-lg bg-white text-black text-[13px] font-medium">
          Guardar
        </button>
      </div>
    </div>
  );
}