export function money(n: number) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export function pct(parte: number, total: number) {
  const t = Number(total || 0);
  if (t <= 0) return 0;
  return money((Number(parte || 0) / t) * 100);
}

export function esFiado(canal?: string) {
  return String(canal || '').toUpperCase() === 'FIADO';
}

export function esCajon(canal?: string) {
  const c = String(canal || 'EFECTIVO').toUpperCase();
  return c === 'EFECTIVO';
}

export function esDigital(canal?: string) {
  const c = String(canal || '').toUpperCase();
  return c === 'YAPE' || c === 'PLIN' || c === 'TARJETA';
}

/** Día de negocio en Lima. La misma venta cae en el mismo día en Resumen, Flujo y POS. */
export function diaNegocio(input?: string | Date | null) {
  const d = input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export type CuadreVentas = {
  movimientos: number;
  cobradas: number;
  fiadosN: number;
  entradas: number;
  fiadosMonto: number;
  efectivo: number;
  digital: number;
};

/** movimientos = cobradas + fiados. entradas = efectivo + digital. El fiado no entra a caja. */
export function cuadrarVentas(
  ventas: { montoTotal?: number; canal?: string }[]
): CuadreVentas {
  const cuadre: CuadreVentas = {
    movimientos: 0,
    cobradas: 0,
    fiadosN: 0,
    entradas: 0,
    fiadosMonto: 0,
    efectivo: 0,
    digital: 0,
  };
  for (const v of ventas) {
    const monto = money(Number(v.montoTotal || 0));
    cuadre.movimientos += 1;
    if (esFiado(v.canal)) {
      cuadre.fiadosN += 1;
      cuadre.fiadosMonto = money(cuadre.fiadosMonto + monto);
      continue;
    }
    cuadre.cobradas += 1;
    cuadre.entradas = money(cuadre.entradas + monto);
    if (esDigital(v.canal)) cuadre.digital = money(cuadre.digital + monto);
    else cuadre.efectivo = money(cuadre.efectivo + monto);
  }
  return cuadre;
}
