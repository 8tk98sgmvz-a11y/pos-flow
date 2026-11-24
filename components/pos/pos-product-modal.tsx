import type { ChangeEvent } from 'react';
import { Button, Input, Text } from '@/components/ui';
import { PosModal } from './pos-modal';

export function PosProductModal({
  nombre,
  precio,
  costo,
  stock,
  sku,
  onNombre,
  onPrecio,
  onCosto,
  onStock,
  onSku,
  onCancel,
  onSave,
}: {
  nombre: string;
  precio: string;
  costo: string;
  stock: string;
  sku: string;
  onNombre: (v: string) => void;
  onPrecio: (v: string) => void;
  onCosto: (v: string) => void;
  onStock: (v: string) => void;
  onSku: (v: string) => void;
  onImageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <PosModal>
      <Text as="h2" variant="headline">
        Nuevo producto
      </Text>
      <div className="space-y-3 mt-4">
        <Input value={nombre} onChange={(e) => onNombre(e.target.value)} placeholder="Nombre" />
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" value={precio} onChange={(e) => onPrecio(e.target.value)} placeholder="Precio" />
          <Input type="number" value={costo} onChange={(e) => onCosto(e.target.value)} placeholder="Costo" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" value={stock} onChange={(e) => onStock(e.target.value)} placeholder="Stock" />
          <Input value={sku} onChange={(e) => onSku(e.target.value)} placeholder="SKU" />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="ghost" className="flex-1 h-10 text-xs" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" className="flex-1 h-10 text-xs" onClick={onSave}>
          Guardar
        </Button>
      </div>
    </PosModal>
  );
}
