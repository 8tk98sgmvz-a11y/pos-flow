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
  return String(canal || 'EFECTIVO').toUpperCase() === 'EFECTIVO';
}
