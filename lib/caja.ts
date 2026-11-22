export type CanalGasto = 'EFECTIVO' | 'YAPE' | 'TARJETA';

export type Gasto = {
  id: string;
  descripcion: string;
  monto: number;
  createdAt: string;
  canal: CanalGasto;
};

export type Ingreso = {
  id: string;
  descripcion: string;
  monto: number;
  createdAt: string;
};

type GastoInput = {
  descripcion: string;
  monto: number;
  canal?: CanalGasto;
  categoria?: string;
};

type IngresoInput = {
  descripcion: string;
  monto: number;
  origen?: string;
};

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function canalOf(raw?: string): CanalGasto {
  const canal = String(raw || 'EFECTIVO').toUpperCase();
  return canal === 'YAPE' || canal === 'TARJETA' ? canal : 'EFECTIVO';
}

export async function listarGastos(): Promise<Gasto[]> {
  const rows = await fetchJson<Partial<Gasto>>('/api/caja?tipo=gastos');
  return rows
    .map((g) => ({
      id: String(g.id || ''),
      descripcion: String(g.descripcion || 'Gasto'),
      monto: Number(g.monto || 0),
      createdAt: String(g.createdAt || ''),
      canal: canalOf(g.canal),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function registrarGasto(
  descripcionOrInput: string | GastoInput,
  monto?: number,
  canal: CanalGasto = 'EFECTIVO'
): Promise<Gasto> {
  const descripcion =
    typeof descripcionOrInput === 'string'
      ? descripcionOrInput
      : descripcionOrInput.descripcion;
  const valor =
    typeof descripcionOrInput === 'string' ? Number(monto || 0) : Number(descripcionOrInput.monto || 0);
  const via =
    typeof descripcionOrInput === 'string' ? canal : canalOf(descripcionOrInput.canal);

  const g: Gasto = {
    id: `g-${Date.now()}`,
    descripcion: String(descripcion || '').trim() || 'Gasto',
    monto: Math.round((valor || 0) * 100) / 100,
    createdAt: new Date().toISOString(),
    canal: via,
  };

  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/caja', 'POST', { tipo: 'gasto', ...g });

  return g;
}

export async function listarIngresos(): Promise<Ingreso[]> {
  const rows = await fetchJson<Ingreso>('/api/caja?tipo=ingresos');
  return rows.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function registrarIngreso(
  descripcionOrInput: string | IngresoInput,
  monto?: number
): Promise<Ingreso> {
  const descripcion =
    typeof descripcionOrInput === 'string'
      ? descripcionOrInput
      : descripcionOrInput.descripcion;
  const valor =
    typeof descripcionOrInput === 'string' ? Number(monto || 0) : Number(descripcionOrInput.monto || 0);

  const row: Ingreso = {
    id: `in-${Date.now()}`,
    descripcion: String(descripcion || '').trim() || 'Ingreso',
    monto: Math.round((valor || 0) * 100) / 100,
    createdAt: new Date().toISOString(),
  };

  const { apiSend } = await import('@/lib/live');
  await apiSend('/api/caja', 'POST', { tipo: 'ingreso', canal: 'EFECTIVO', ...row });

  return row;
}
