import { Input } from '@/components/ui';

export function PosEfectivoRecibido({
  recibido,
  onRecibido,
  total,
  efectivoCorto,
  rec,
  vuelto,
}: {
  recibido: string;
  onRecibido: (v: string) => void;
  total: number;
  efectivoCorto: boolean;
  rec: number;
  vuelto: number;
}) {
  return (
    <div className="mt-3">
      <Input
        type="number"
        value={recibido}
        onChange={(e) => onRecibido(e.target.value)}
        className="h-10 font-mono"
        placeholder="Recibido (vacío = exacto)"
      />
      {total > 0 && recibido.trim() !== '' && (
        <p className={`text-[12px] mt-1 ${efectivoCorto ? 'text-danger' : 'text-success'}`}>
          {efectivoCorto ? `Faltan S/ ${(total - rec).toFixed(2)}` : `Vuelto S/ ${Math.max(0, vuelto).toFixed(2)}`}
        </p>
      )}
    </div>
  );
}
