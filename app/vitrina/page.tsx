"use client";

import { MessageCircle, Package } from "lucide-react";
import { soles } from "@/lib/format";
import { useStore } from "@/lib/store";
import { waLink } from "@/lib/whatsapp";

export default function VitrinaPage() {
  const { products, shop } = useStore();

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">
        {shop.name}
      </p>
      <h1 className="mt-2 text-center text-3xl font-semibold text-white">Catálogo</h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Stock en tiempo real · pide por WhatsApp
      </p>
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <article key={p.id} className="card p-4">
            <div className="flex gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-white">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.sku} · {p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-mint">{soles(p.price)}</span>
                  <a
                    href={waLink(
                      shop.whatsapp,
                      `Hola, quiero ${p.name} por ${soles(p.price)}`,
                    )}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-night-950"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
