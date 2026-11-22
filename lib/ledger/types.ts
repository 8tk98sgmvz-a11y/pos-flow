export type CanalPago = 'EFECTIVO' | 'YAPE' | 'TARJETA' | 'TRANSFERENCIA' | 'FIADO';

export type VentaPOS = {
  id: string;
  createdAt: string;
  montoTotal: number;
  costoTotal: number;
  canal: CanalPago;
  descripcion: string;
  idempotencyKey: string;
  estado: 'PENDING' | 'SETTLED';
};