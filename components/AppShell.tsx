"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Landmark,
  LayoutDashboard,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
const nav = [
  { href: "/pos", label: "POS", icon: ShoppingBag },
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/arqueo", label: "Arqueo", icon: Banknote },
  { href: "/cuentas-por-cobrar", label: "Fiados", icon: Wallet },
  { href: "/cuentas-por-pagar", label: "Por pagar", icon: Wallet },
];


export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCatalogPublic = pathname === "/catalogo";

  if (isCatalogPublic) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="grid-bg min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/10 bg-night-900/90 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Retail OS</p>
            <h1 className="text-lg font-semibold">POS Flow</h1>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap ${
                  active
                    ? "bg-cyan-400/15 text-cyan-200 shadow-glow"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}

