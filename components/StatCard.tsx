import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "cyan",
}: {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "cyan" | "mint" | "amber" | "rose";
}) {
  const tones = {
    cyan: "text-cyan-300 bg-cyan-400/10",
    mint: "text-emerald-300 bg-emerald-400/10",
    amber: "text-amber-300 bg-amber-400/10",
    rose: "text-rose-300 bg-rose-400/10",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          {hint ? <p className="mt-1 text-sm text-slate-400">{hint}</p> : null}
        </div>
        <span className={`rounded-xl p-2.5 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
