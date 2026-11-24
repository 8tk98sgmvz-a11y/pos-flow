import { Button, Card, Text } from '@/components/ui';
import { PosCartLine } from './pos-cart-line';
import { PosEfectivoRecibido } from './pos-efectivo-recibido';
import { PosPaymentMethods } from './pos-payment-methods';
import { PosTotals } from './pos-totals';

type CartLine = { id: string; nombre: string; quantity: number; precio: number };

export function PosCart({
  carrito,
  total,
  metodoPago,
  onMetodoPago,
  onFiado,
  recibido,
  onRecibido,
  efectivoCorto,
  rec,
  vuelto,
  onCobrar,
  showReprint,
  onReprint,
}: {
  carrito: CartLine[];
  total: number;
  metodoPago: string;
  onMetodoPago: (m: string) => void;
  onFiado: () => void;
  recibido: string;
  onRecibido: (v: string) => void;
  efectivoCorto: boolean;
  rec: number;
  vuelto: number;
  onCobrar: () => void;
  showReprint: boolean;
  onReprint: () => void;
}) {
  return (
    <Card className="p-4 lg:sticky lg:top-[4.5rem]">
      {carrito.length === 0 ? (
        <Text variant="caption" className="mb-ds-3">
          Toca un producto
        </Text>
      ) : (
        <div className="space-y-2 mb-4">
          {carrito.map((item) => (
            <PosCartLine
              key={item.id}
              nombre={item.nombre}
              quantity={item.quantity}
              precio={item.precio}
            />
          ))}
        </div>
      )}

      <PosTotals total={total} />
      <PosPaymentMethods metodoPago={metodoPago} onMetodoPago={onMetodoPago} onFiado={onFiado} />

      {metodoPago === 'Efectivo' && (
        <PosEfectivoRecibido
          recibido={recibido}
          onRecibido={onRecibido}
          total={total}
          efectivoCorto={efectivoCorto}
          rec={rec}
          vuelto={vuelto}
        />
      )}

      <Button
        variant="primary"
        className="w-full h-11 mt-4"
        onClick={onCobrar}
        disabled={carrito.length === 0 || efectivoCorto}
      >
        {efectivoCorto ? 'Falta efectivo' : 'Cobrar'}
      </Button>
      {showReprint && (
        <Button variant="ghost" className="w-full h-9 mt-2 text-xs" onClick={onReprint}>
          Reimprimir
        </Button>
      )}
    </Card>
  );
}
