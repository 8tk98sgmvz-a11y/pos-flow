export function CxcAlerts({
  empty,
  title,
  detail,
}: {
  empty: boolean;
  title: string;
  detail: string;
}) {
  return (
    <div className="col-span-4 space-y-3">
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
        <p className="text-[14px] font-medium text-white mb-3">Alertas</p>
        {empty ? (
          <p className="text-[13px] text-white/60">Sin deuda abierta.</p>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#08101C] p-3">
            <p className="text-[13px] text-white font-medium">{title}</p>
            <p className="text-[12px] text-white/80 mt-1">{detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
