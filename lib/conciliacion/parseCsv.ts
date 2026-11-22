import type { TransaccionBanco } from './types';
import { parseMontoPeru } from './money';

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && (ch === ';' || ch === ',' || ch === '\t')) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function pickIndex(headers: string[], candidates: string[]): number {
  const n = headers.map(norm);
  for (const c of candidates) {
    const i = n.findIndex((h) => h.includes(c));
    if (i >= 0) return i;
  }
  return -1;
}

function parseFechaPeru(raw: string): Date | null {
  const s = String(raw ?? '').trim();
  if (!s) return null;

  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return new Date(iso);

  const m = s.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!m) return null;

  const d = Number(m[1]);
  const mo = Number(m[2]) - 1;
  let y = Number(m[3]);
  if (y < 100) y += 2000;
  const hh = Number(m[4] ?? 12);
  const mm = Number(m[5] ?? 0);
  const ss = Number(m[6] ?? 0);

  const dt = new Date(y, mo, d, hh, mm, ss);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function parseBankCsv(csv: string, banco = 'BCP'): TransaccionBanco[] {
  const lines = csv
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]);

  const iFecha = pickIndex(headers, ['fecha', 'fechahora', 'date', 'fechadeoperacion', 'fh']);
  const iMonto = pickIndex(headers, ['monto', 'importe', 'abono', 'cargo', 'amount', 'valor']);
  const iDesc = pickIndex(headers, ['descripcion', 'glosa', 'detalle', 'concepto', 'narration']);
  const iRef = pickIndex(headers, ['referencia', 'ref', 'nrooperacion', 'operacion', 'id', 'voucher']);

  const out: TransaccionBanco[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const fecha = parseFechaPeru(cols[iFecha] ?? '');
    const monto = parseMontoPeru(cols[iMonto] ?? '');
    if (!fecha || !Number.isFinite(monto) || monto === 0) continue;

    out.push({
      id: `bank-${banco}-${i}-${fecha.getTime()}-${Math.abs(Math.round(monto * 100))}`,
      fecha,
      monto,
      descripcion: String(cols[iDesc] ?? '').trim() || 'Movimiento bancario',
      referencia: String(cols[iRef] ?? '').trim() || `ROW-${i}`,
      banco,
    });
  }

  return out;
}