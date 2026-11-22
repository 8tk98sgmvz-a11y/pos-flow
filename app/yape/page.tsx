'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { leerNegocio } from '@/lib/negocio';

function digits(raw: string) {
  return String(raw || '').replace(/\D/g, '');
}

export default function YapePage() {
  const [negocio, setNegocio] = useState({ nombre: '', whatsapp: '', yape: '' });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const load = async () => {
    try {
      const n = await leerNegocio();
      setNegocio({
        nombre: n.nombre || 'Tu negocio',
        whatsapp: n.whatsapp || '',
        yape: n.yape || '',
      });
    } catch {
      /* ignore */
    }
    };
    void load();
  }, []);

  const yapeNum = digits(negocio.yape);
  const wa = digits(negocio.whatsapp);
  const waLink = wa
    ? `https://wa.me/${wa.length === 9 ? '51' + wa : wa}`
    : '';

  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      alert(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-5">
      <Link href="/" className="text-[12px] text-slate-400">
        ← Resumen
      </Link>
      <h1 className="text-[24px] font-semibold mt-1">Yape / Plin</h1>
      <p className="text-[13px] text-slate-400 mb-5">
        El cajero cobra aquí. El dueño concilia después. No es efectivo del cajón.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
          <p className="text-[12px] text-slate-400">Cobrar a este Yape</p>
          <p className="text-[28px] font-semibold tracking-wide mt-1">
            {yapeNum || 'Sin número'}
          </p>
          <p className="text-[13px] text-slate-400 mt-1">{negocio.nombre}</p>
          <button
            disabled={!yapeNum}
            onClick={() => copy(yapeNum, 'yape')}
            className="mt-4 h-10 px-4 rounded-xl bg-white text-black text-[13px] font-medium disabled:opacity-40"
          >
            {copied === 'yape' ? 'Copiado' : 'Copiar número'}
          </button>
          <p className="text-[12px] text-slate-500 mt-3">
            Cámbialo en{' '}
            <Link href="/negocio" className="text-blue-400">
              Negocio
            </Link>
            .
          </p>
        </div>

        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
          <p className="text-[13px] font-medium mb-2">Regla de oro</p>
          <ul className="text-[13px] text-slate-300 space-y-2">
            <li>1. El cliente Yapea este número.</li>
            <li>2. En el POS eliges <b>Yape</b>, no Efectivo.</li>
            <li>3. Ese sol no entra al cajón. Va a Digital.</li>
            <li>4. Si el cajero lo mete como efectivo, el arqueo descuadra.</li>
          </ul>
        </div>

        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
          <p className="text-[13px] font-medium mb-2">WhatsApp del local</p>
          <p className="text-[18px] font-mono">{wa || 'Sin WhatsApp'}</p>
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-3 h-10 px-4 rounded-xl border border-white/15 text-[13px] items-center"
            >
              Abrir WhatsApp
            </a>
          ) : (
            <Link href="/negocio" className="inline-block mt-3 text-[13px] text-blue-400">
              Cargar WhatsApp en Negocio →
            </Link>
          )}
        </div>

        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
          <p className="text-[13px] font-medium mb-2">Siguiente paso</p>
          <p className="text-[13px] text-slate-300">
            Cuando cierre el día, sube el movimiento del banco o Yape en Conciliación.
            Ahí se cierra el círculo: POS → Digital → Banco.
          </p>
          <Link
            href="/conciliacion"
            className="inline-flex mt-3 h-10 px-4 rounded-xl bg-blue-600 text-[13px] items-center"
          >
            Ir a conciliación →
          </Link>
        </div>
      </div>
    </div>
  );
}