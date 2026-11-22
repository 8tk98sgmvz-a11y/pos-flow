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
    <div className="flex justify-between text-[13px]">
      <span>
        {nombre} ×{quantity}
      </span>
      <span>S/ {(precio * quantity).toFixed(2)}</span>
    </div>
  );
}
