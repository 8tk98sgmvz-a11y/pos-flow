import { Badge } from '@/components/ui';

export function FlujoSaleRow({
  createdAt,
  canal,
  descripcion,
  monto,
}: {
  createdAt?: string;
  canal?: string;
  descripcion?: string;
  monto?: number;
}) {
  return (
    <div className="flex justify-between items-center gap-2 border-t border-white/10 py-2 text-[13px]">
      <span className="text-slate-400 flex items-center gap-2 min-w-0">
        {createdAt
          ? new Date(createdAt).toLocaleString('es-PE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—'}
        <Badge variant="default">{canal || '—'}</Badge>
      </span>
      <span className="max-w-[45%] truncate">{descripcion || 'Venta'}</span>
      <span className="text-emerald-400">S/ {Number(monto || 0).toFixed(2)}</span>
    </div>
  );
}
