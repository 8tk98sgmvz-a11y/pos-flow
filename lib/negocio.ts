import { apiSend } from '@/lib/live';

export type Negocio = {
  nombre: string;
  ruc: string;
  whatsapp: string;
  yape: string;
};

const VACIO: Negocio = { nombre: '', ruc: '', whatsapp: '', yape: '' };

export async function leerNegocio(): Promise<Negocio> {
  try {
    const res = await fetch('/api/negocio', { cache: 'no-store' });
    if (!res.ok) return VACIO;
    const data = await res.json();
    return { ...VACIO, ...data };
  } catch {
    return VACIO;
  }
}

export async function guardarNegocio(n: Negocio) {
  await apiSend('/api/negocio', 'POST', {
    nombre: n.nombre.trim(),
    ruc: n.ruc.trim(),
    whatsapp: n.whatsapp.trim(),
    yape: n.yape.trim(),
  });
}
