import type { PuntoHora } from '@/lib/actividad';
import { Card } from '@/components/ui/Card';

export function ActivityChart({ horas, tope }: { horas: PuntoHora[]; tope: number }) {
  return (
    <Card className="lg:col-span-6 p-5 min-h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[12px] font-semibold text-neutral-200">Actividad de hoy</p>
        <div className="text-[11px] bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg text-neutral-300">
          24 horas reales
        </div>
      </div>
      <div className="h-44 flex items-end gap-[3px]">
        {horas.map((p) => (
          <div
            key={p.hora}
            className="flex-1 flex flex-col justify-end h-full"
            title={`${p.hora} · S/ ${p.total.toFixed(2)}`}
          >
            <div
              className="w-full rounded-t bg-blue-500/85"
              style={{ height: `${Math.max(3, (p.total / tope) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-neutral-400">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
    </Card>
  );
}
