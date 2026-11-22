export function ArqueoHistoryRow({
  fecha,
  declarado,
  sistema,
  diferencia,
  ok,
}: {
  fecha: string;
  declarado: string;
  sistema: string;
  diferencia: string;
  ok: boolean;
}) {
  return (
    <div className="flex justify-between border-t border-white/10 py-2 text-[13px]">
      <span className="text-slate-400">{fecha}</span>
      <span>Decl. {declarado}</span>
      <span>Sist. {sistema}</span>
      <span className={ok ? 'text-emerald-400' : 'text-red-400'}>{diferencia}</span>
    </div>
  );
}
