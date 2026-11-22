import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function DecisionBanner({
  ok,
  titulo,
  detalle,
  href,
  accion,
}: {
  ok: boolean;
  titulo: string;
  detalle?: string;
  href: string;
  accion: string;
}) {
  return (
    <Card className="px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
            ok ? 'bg-emerald-500/15 border-emerald-500/35' : 'bg-red-500/15 border-red-500/35'
          }`}
        >
          <span className={`text-sm font-bold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
            {ok ? '✓' : '!'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-white/45">Decisión del día</p>
          <p className="text-sm font-medium text-white leading-snug">{titulo}</p>
          {detalle ? <p className="text-[12px] text-white/55 mt-0.5">{detalle}</p> : null}
        </div>
      </div>
      <ButtonLink
        href="/cierre"
        variant="secondary"
        className="shrink-0 text-xs font-medium px-3.5 py-2 whitespace-nowrap"
      >
        Ver cierre →
      </ButtonLink>
      <ButtonLink
        href={href}
        variant="primary"
        className="shrink-0 text-xs font-medium px-3.5 py-2 whitespace-nowrap flex items-center gap-1.5"
      >
        {accion}
        <span>→</span>
      </ButtonLink>
    </Card>
  );
}
