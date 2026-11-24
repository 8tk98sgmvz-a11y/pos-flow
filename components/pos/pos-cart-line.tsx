import { Text } from '@/components/ui';

export function PosCartLine({
  nombre,
  quantity,
  precio,
}: {
  nombre: string;
  quantity: number;
  precio: number;
}) {
  return (
    <div className="flex justify-between gap-ds-2">
      <Text as="span" variant="caption">
        {nombre} ×{quantity}
      </Text>
      <Text as="span" variant="caption" className="text-foreground">
        S/ {(precio * quantity).toFixed(2)}
      </Text>
    </div>
  );
}
