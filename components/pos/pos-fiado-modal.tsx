import { Button, Input } from '@/components/ui';
import { PosModal } from './pos-modal';

export function PosFiadoModal({
  total,
  cliente,
  telefono,
  onCliente,
  onTelefono,
  onCancel,
  onSave,
}: {
  total: number;
  cliente: string;
  telefono: string;
  onCliente: (v: string) => void;
  onTelefono: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <PosModal>
      <h2 className="text-headline">Registrar fiado</h2>
      <p className="text-caption text-muted mt-1">S/ {total.toFixed(2)} no entra a caja</p>
      <div className="space-y-3 mt-5">
        <Input
          autoFocus
          value={cliente}
          onChange={(e) => onCliente(e.target.value)}
          placeholder="Cliente"
        />
        <Input
          value={telefono}
          onChange={(e) => onTelefono(e.target.value)}
          placeholder="WhatsApp (9 dígitos)"
        />
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" className="flex-1 h-10 text-xs" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" className="flex-1 h-10 text-xs" onClick={onSave}>
          Guardar fiado
        </Button>
      </div>
    </PosModal>
  );
}
