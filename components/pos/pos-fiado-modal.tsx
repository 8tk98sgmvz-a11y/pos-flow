import { Button, Input, Text } from '@/components/ui';
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
      <Text as="h2" variant="headline">
        Registrar fiado
      </Text>
      <Text variant="caption" className="mt-ds-1">
        S/ {total.toFixed(2)} no entra a caja
      </Text>
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
