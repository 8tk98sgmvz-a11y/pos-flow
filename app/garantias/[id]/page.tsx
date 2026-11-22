"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { stamp } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function WarrantyTicketPage() {
  const { id } = useParams<{ id: string }>();
  const { warranties, shop } = useStore();
  const g = warranties.find((w) => w.id === id);

  if (!g) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p>Ticket no encontrado.</p>
        <Link href="/garantias" className="btn-ghost mt-4">
          Volver
        </Link>
      </div>
    );
  }

  const until = new Date(g.issuedAt);
  until.setMonth(until.getMonth() + g.months);

  return (
    <div className="mx-auto max-w-lg">
      <article className="card relative overflow-hidden p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10" />
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">{shop.name}</p>
        <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold">
          <ShieldCheck className="h-6 w-6 text-cyan-300" />
          Ticket digital de garantía
        </h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">Folio</dt>
            <dd className="font-mono">{g.id}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">Venta</dt>
            <dd className="font-mono">{g.saleId}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">Equipo</dt>
            <dd className="text-right">{g.productName}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">IMEI / Serie</dt>
            <dd className="font-mono">{g.serial}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">Titular</dt>
            <dd>{g.customerName}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/10 py-2">
            <dt className="text-slate-400">Emisión</dt>
            <dd>{stamp(g.issuedAt)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-slate-400">Vigencia</dt>
            <dd>
              {g.months} meses · hasta {until.toLocaleDateString("es-PE")}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-slate-500">
          La garantía solo cubre el IMEI/Serie impreso. Equipos intercambiados o sin coincidencia
          de serie quedan fuera de cobertura.
        </p>
      </article>
      <Link href="/garantias" className="btn-ghost mt-4">
        Volver al listado
      </Link>
    </div>
  );
}
