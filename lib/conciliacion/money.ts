/** 1 céntimo = 1 unidad interna. Evita errores de punto flotante. */
export function toCents(soles: number): number {
    return Math.round(Number(soles) * 100);
  }
  
  export function fromCents(cents: number): number {
    return cents / 100;
  }
  
  export const aCentavos = toCents;
  export const deCentavos = fromCents;
  
  export function sameAmount(a: number, b: number): boolean {
    return toCents(a) === toCents(b);
  }
  
  export function parseMontoPeru(raw: string): number {
    const s = String(raw ?? '').trim().replace(/\s/g, '');
    if (!s) return NaN;
  
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
  
    let normalized = s;
  
    if (lastComma > lastDot) {
      normalized = s.replace(/\./g, '').replace(',', '.');
    } else if (lastDot > lastComma) {
      normalized = s.replace(/,/g, '');
    } else if (lastComma !== -1) {
      normalized = s.replace(',', '.');
    }
  
    const n = Number(normalized.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }