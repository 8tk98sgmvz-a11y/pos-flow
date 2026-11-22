'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { leerNegocio } from '@/lib/negocio';
import { registrarPedido } from '@/lib/pedidos';
import { onLive } from '@/lib/live';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  sku: string;
  imagen: string;
}

function waLink(telefono: string, texto: string) {
  const digits = String(telefono || '').replace(/\D/g, '');
  const n = digits.length === 9 ? `51${digits}` : digits;
  return n
    ? `https://wa.me/${n}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

export default function CatalogoMobile() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [negocio, setNegocio] = useState({ nombre: '', whatsapp: '', yape: '' });

  useEffect(() => {
    const cargar = async () => {
      try {
        const n = await leerNegocio();
        setNegocio({ nombre: n.nombre || '', whatsapp: n.whatsapp || '', yape: n.yape || '' });
      } catch {
        setNegocio({ nombre: '', whatsapp: '', yape: '' });
      }
      try {
        const res = await fetch('/api/productos', { cache: 'no-store' });
        const parsed = res.ok ? await res.json() : [];
        const list = Array.isArray(parsed) ? parsed : [];
        setProductos(list.filter((p: Product) => Number(p.stock || 0) > 0));
      } catch {
        setProductos([]);
      }
    };

    cargar();
    const stop = onLive(() => void cargar());
    const id = setInterval(cargar, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  const pedir = (prod: Product, e: React.MouseEvent<HTMLAnchorElement>) => {
    void registrarPedido({
      producto: prod.nombre,
      sku: prod.sku,
      precio: Number(prod.precio || 0),
    });
    const texto = [
      `Hola, quiero ${prod.nombre}`,
      `SKU: ${prod.sku}`,
      `Precio: S/ ${Number(prod.precio || 0).toFixed(2)}`,
      negocio.yape ? `Yape: ${negocio.yape}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    e.currentTarget.href = waLink(negocio.whatsapp, texto);
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-neutral-100 font-sans p-4 md:p-8 selection:bg-white/20">
      <Link href="/" className="text-[12px] text-neutral-400 hover:text-white">← Resumen</Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-5 gap-4 mt-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]"></span>
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">Vitrina Sincronizada</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {negocio.nombre || 'Catálogo Móvil'}
          </h1>
          <p className="text-sm text-neutral-400 font-mono mt-1">
            {negocio.whatsapp ? `WhatsApp ${negocio.whatsapp}` : 'Guarda el WhatsApp en /negocio'}
            {negocio.yape ? ` · Yape ${negocio.yape}` : ''}
          </p>
        </div>
        <Link href="/pedidos" className="text-[12px] text-blue-400 hover:text-blue-300">
          Ver pedidos →
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.length === 0 && (
          <p className="text-neutral-500 text-sm font-mono">No hay productos con stock. Créalos en el POS.</p>
        )}
        {productos.map((prod) => {
          const texto = [
            `Hola, quiero ${prod.nombre}`,
            `SKU: ${prod.sku}`,
            `Precio: S/ ${Number(prod.precio || 0).toFixed(2)}`,
            negocio.yape ? `Yape: ${negocio.yape}` : '',
          ]
            .filter(Boolean)
            .join('\n');

          return (
            <div
              key={prod.id}
              className="bg-neutral-900/40 border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:border-white/30 transition-all backdrop-blur-xl shadow-2xl group"
            >
              <div>
                <div className="w-full h-48 bg-black/60 rounded-2xl overflow-hidden mb-4 border border-white/10 flex items-center justify-center relative">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-600 gap-1 font-mono text-xs">
                      <span>📷</span>
                      <span>SIN IMAGEN</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-xs font-mono font-bold text-emerald-400 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                    Stock: {prod.stock}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono text-neutral-300 bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                    {prod.sku}
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white tracking-wide">{prod.nombre}</h3>
                  <p className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                    S/ {Number(prod.precio || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <a
                href={waLink(negocio.whatsapp, texto)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => pedir(prod, e)}
                className="w-full bg-white/5 hover:bg-white text-white hover:text-black font-semibold text-xs uppercase tracking-wider py-3.5 rounded-2xl border border-white/15 flex items-center justify-center gap-2"
              >
                <span>Pedir por WhatsApp</span>
                <span>💬</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}