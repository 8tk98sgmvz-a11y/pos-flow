import type { VentaPendiente } from './types';
import { parseBankCsv } from './parseCsv';
import { conciliarMovimientos } from './match';

const csv = `Fecha,Importe,Glosa,Referencia
17/09/2026 10:02,1250.00,YAPE JUAN PEREZ,OP-1001
17/09/2026 10:08,340.50,COMISION BCP,OP-1002
17/09/2026 10:15,890.00,TRANSF MARIA LOPEZ,OP-1003`;

export function demoConciliacion() {
  const bancos = parseBankCsv(csv, 'BCP');

  const ventas: VentaPendiente[] = [
    {
      id: 'v-1',
      montoTotal: 1250,
      fechaCreacion: new Date(2026, 8, 17, 10, 3, 0),
      idempotencyKey: 'pos-v-1',
      estado: 'PENDING',
    },
    {
      id: 'v-2',
      montoTotal: 890,
      fechaCreacion: new Date(2026, 8, 17, 10, 16, 0),
      idempotencyKey: 'pos-v-2',
      estado: 'PENDING',
    },
  ];

  return conciliarMovimientos(bancos, ventas);
}