export function PosTotals({ total }: { total: number }) {
  return (
    <div className="flex justify-between items-baseline border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] pt-3 text-body font-semibold">
      <span>Total</span>
      <span className="font-mono">S/ {total.toFixed(2)}</span>
    </div>
  );
}
