import type { ReactNode } from 'react';

export function CxcStatCard({
  icon,
  iconBg,
  title,
  value,
  badge,
  footer,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: ReactNode;
  badge?: ReactNode;
  footer: string;
}) {
  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] text-white">{title}</p>
          {badge ? (
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[22px] font-bold text-white">{value}</p>
              {badge}
            </div>
          ) : (
            <p className="text-[22px] font-bold text-white mt-0.5">{value}</p>
          )}
        </div>
      </div>
      <p className="text-[12px] text-white mt-3">{footer}</p>
    </div>
  );
}
