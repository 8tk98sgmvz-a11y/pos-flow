import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'retailos.json');

export type EstadoServidor = Record<string, string>;

export function leerEstado(): EstadoServidor {
  try {
    if (!fs.existsSync(FILE)) return {};
    const raw = fs.readFileSync(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function guardarEstado(next: EstadoServidor) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(next));
  fs.renameSync(tmp, FILE);
}