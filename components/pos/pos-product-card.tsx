import { Button, Text } from '@/components/ui';

export function PosProductCard({
  nombre,
  precio,
  stock,
  onAdd,
}: {
  nombre: string;
  precio: number;
  costo?: number;
  stock: number;
  sku?: string;
  onAdd: () => void;
  onRestock?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onAdd}
      className="h-auto flex-col items-start p-3 text-left whitespace-normal"
    >
      <Text as="span" variant="headline" className="leading-tight truncate w-full">
        {nombre}
      </Text>
      <Text as="span" variant="body" className="font-mono font-semibold mt-ds-1">
        S/ {Number(precio || 0).toFixed(2)}
      </Text>
      <Text as="span" variant="caption" className="mt-ds-1">
        {stock}
      </Text>
    </Button>
  );
}
