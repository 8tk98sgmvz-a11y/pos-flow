import { Text } from '@/components/ui';

export function PosTotals({ total }: { total: number }) {
  return (
    <div className="flex justify-between items-baseline border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] pt-ds-3">
      <Text as="span" variant="headline">
        Total
      </Text>
      <Text as="span" variant="headline" className="font-mono">
        S/ {total.toFixed(2)}
      </Text>
    </div>
  );
}
