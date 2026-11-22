import type { ReactNode } from 'react';

export function CxpStatCard({
  icon,
  iconBg,
  title,
  value,
  valueClassName = '',
  badge,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: ReactNode;
  valueClassName?: string;
  badge?: ReactNode;
}) {
  return (
    <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-[13px]">{title}</p>
          {badge ? (
            <div className="flex items-center gap-2 mt-0.5">
              <p className={`text-[22px] font-bold ${valueClassName}`}>{value}</p>
              {badge}
            </div>
          ) : (
            <p className={`text-[22px] font-bold mt-0.5 ${valueClassName}`}>{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
