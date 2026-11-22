import { CxpRedAlertIcon, CxpSparkIcon } from './cxp-icons';

export function CxpAlerts({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-3 flex-1 flex flex-col">
      <p className="text-[13px] font-medium mb-2 flex items-center gap-2">
        <CxpSparkIcon /> Alertas inteligentes
      </p>
      <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-2.5">
        <div className="flex items-start gap-2">
          <CxpRedAlertIcon />
          <div className="flex-1">
            <p className="text-[12px] font-medium leading-tight">{title}</p>
            <p className="text-[11px] text-white/80 mt-0.5">{detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
