import { Button } from '@/components/ui';

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
      <span className="text-sm font-semibold leading-tight truncate w-full">{nombre}</span>
      <span className="text-base font-bold font-mono mt-1">S/ {Number(precio || 0).toFixed(2)}</span>
      <span className="text-caption text-muted mt-1">{stock}</span>
    </Button>
  );
}
