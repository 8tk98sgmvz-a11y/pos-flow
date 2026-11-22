export const IGV_RATE = 0.18;

export function soles(n: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(n);
}

export function stamp(iso: string | null | undefined) {
  if (!iso) return "--/--/---- --:--:--";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "--/--/---- --:--:--";

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
  }).format(date);
}

export function nowIso() {
  return new Date().toISOString();
}

export function daysSince(iso: string | null) {
  if (!iso) return 999;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86_400_000);
}

export function breakdown(amount: number) {
  const subtotal = +(amount / (1 + IGV_RATE)).toFixed(2);
  const igv = +(amount - subtotal).toFixed(2);
  return { subtotal, igv, total: +amount.toFixed(2) };
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}