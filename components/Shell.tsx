"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Banknote,
  LayoutDashboard,
  MessageCircle,
  ScanLine,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";

const nav = [
  { href: "/pos", label: "POS", icon: ShoppingCart },
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/arqueo", label: "Arqueo", icon: Banknote },
  { href: "/cuentas-por-cobrar", label: "Fiados", icon: Wallet },
  { href: "/cuentas-por-pagar", label: "Por pagar", icon: Wallet },
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const store = useStore();
  const shop = store?.shop || { name: "Master Apple Peru", whatsapp: "999999999" };
  const cart = store?.cart || [];
  const cashSession = store?.cashSession || null;
  
  const vitrina = path.startsWith("/vitrina") || path.startsWith("/ticket");

  if (vitrina) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/10 bg-night-900/90 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent shadow-glow">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Retail OS</p>
            <h1 className="text-lg font-semibold text-white">POS Flow</h1>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-3">
          {nav.map((item) => {
            const active = path === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-white/10 text-white shadow-glow"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-4 pb-6 lg:block">
          <div className="card p-4 text-xs text-slate-400">
            <p className="font-medium text-slate-200">{shop.name}</p>
            <p className="mt-1">WhatsApp {shop.whatsapp}</p>
            <p className="mt-2 flex items-center gap-1 text-mint">
              <MessageCircle className="h-3.5 w-3.5" />
              Catálogo sincronizado
            </p>
            <p className="mt-2 text-slate-500">
              Caja: {cashSession ? "abierta" : "cerrada"} · {cart.length} en carrito
            </p>
          </div>
        </div>
      </aside>
      <main className="min-h-screen px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}