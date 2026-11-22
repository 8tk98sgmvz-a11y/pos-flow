import { Button } from '@/components/ui';

const METODOS = ['Efectivo', 'Yape', 'Plin', 'Tarjeta'];

export function PosPaymentMethods({
  metodoPago,
  onMetodoPago,
  onFiado,
}: {
  metodoPago: string;
  onMetodoPago: (m: string) => void;
  onFiado: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {METODOS.map((m) => (
        <Button
          key={m}
          variant={metodoPago === m ? 'primary' : 'ghost'}
          className="h-9 text-xs"
          onClick={() => onMetodoPago(m)}
        >
          {m}
        </Button>
      ))}
      <Button variant="secondary" className="h-9 text-xs col-span-2" onClick={onFiado}>
        Fiado
      </Button>
    </div>
  );
}
