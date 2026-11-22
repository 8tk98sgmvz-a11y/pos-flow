import Link from 'next/link';
import { Button } from '@/components/ui';

export function PosHeader({
  resumen,
  onNuevoProducto,
}: {
  resumen: string;
  onNuevoProducto: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4 gap-3">
      <div>
        <Link href="/" className="text-[12px] text-muted hover:text-foreground">
          ← Resumen
        </Link>
        <h1 className="text-xl font-semibold mt-1">Cobrar</h1>
        <p className="text-[12px] text-muted">{resumen}</p>
      </div>
      <Button variant="secondary" className="h-9 px-3 text-xs" onClick={onNuevoProducto}>
        + Producto
      </Button>
    </div>
  );
}
