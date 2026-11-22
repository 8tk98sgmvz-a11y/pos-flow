export function NoticeBox({
  variant,
  title,
  description,
}: {
  variant: 'danger' | 'warning';
  title: string;
  description: string;
}) {
  if (variant === 'danger') {
    return (
      <div className="mt-6 bg-red-500/10 border border-red-500/25 rounded-xl p-3 flex items-start gap-2.5">
        <span className="text-red-400 mt-0.5">⚠</span>
        <div>
          <p className="text-xs font-semibold text-red-300">{title}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
      <p className="text-xs text-amber-300 font-medium">{title}</p>
      <p className="text-sm font-semibold text-amber-400 mt-0.5">{description}</p>
    </div>
  );
}
