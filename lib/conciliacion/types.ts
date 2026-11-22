export type EstadoVenta = 'PENDING' | 'SETTLED';

export type EstadoMatch =
  | 'MATCHED'
  | 'MATCHED_WITH_WARNING'
  | 'UNIDENTIFIED'
  | 'UNMATCHED_SALE';

export type TransaccionBanco = {
  id: string;
  fecha: Date;
  monto: number;
  descripcion: string;
  referencia: string;
  banco?: string;
};

export type VentaPendiente = {
  id: string;
  montoTotal: number;
  fechaCreacion: Date;
  idempotencyKey: string;
  estado: EstadoVenta;
};

export type ResultadoMatch = {
  banco: TransaccionBanco;
  venta: VentaPendiente | null;
  estado: EstadoMatch;
  motivo: string;
};

export type InformeConciliacion = {
  matches: ResultadoMatch[];
  ventasSinBanco: VentaPendiente[];
  dineroSinIdentificar: TransaccionBanco[];
  advertencias: ResultadoMatch[];
  resumen: {
    bancos: number;
    ventasPendientes: number;
    matched: number;
    matchedConAdvertencia: number;
    unidentified: number;
    ventasHuérfanas: number;
  };
};