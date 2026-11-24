'use client';

import React, { useEffect, useState } from 'react';
import { ArqueoShell } from '@/components/dashboard/arqueo-shell';
import { Badge, Button, Card, Input, Text } from '@/components/ui';
import { onLiveRefresh } from '@/lib/refresh';

type Arqueo = {
  id: string;
  createdAt: string;
  declarado: number;
  sistema: number;
  diferencia: number;
};

function soles(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function ArqueoPage() {
  const [sistema, setSistema] = useState(0);
  const [ultimo, setUltimo] = useState<Arqueo | null>(null);
  const [mostrar, setMostrar] = useState(false);
  const [contado, setContado] = useState('');

  const load = async () => {
    const [arqueos, resumenRes] = await Promise.all([
      fetchJson<Arqueo>('/api/arqueo'),
      fetch('/api/resumen', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})) as Promise<{ sistema?: number }>,
    ]);
    const last = arqueos[0] || null;
    setUltimo(last);
    setSistema(Number(resumenRes.sistema || 0));
    const day = new Date().toISOString().slice(0, 10);
    if (last && last.diferencia !== 0 && String(last.createdAt).slice(0, 10) === day) setMostrar(true);
  };

  useEffect(() => onLiveRefresh(() => void load()), []);

  const guardar = async () => {
    const n = Number(contado);
    if (!Number.isFinite(n)) {
      alert('Escribe cuánto hay en caja');
      return;
    }

    const { apiSend } = await import('@/lib/live');
    await apiSend('/api/arqueo', 'POST', {
      declarado: Number(n.toFixed(2)),
      sistema,
      diferencia: Number((n - sistema).toFixed(2)),
    });

    setContado('');
    await load();
  };

  return (
    <ArqueoShell>
      <Card className="p-ds-5 max-w-md">
        <Input
          value={contado}
          onChange={(e) => setContado(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
          type="number"
          placeholder="¿Cuánto hay en el cajón?"
          className="h-12 font-mono text-lg"
          autoFocus
        />
        <Button variant="primary" className="mt-3 w-full h-11" onClick={guardar}>
          Cerrar arqueo
        </Button>
        <Button variant="ghost" className="mt-3 w-full h-9 text-xs" onClick={() => setMostrar((v) => !v)}>
          {mostrar ? `Sistema ${soles(sistema)}` : 'Mostrar sistema'}
        </Button>
        {ultimo ? (
          <div className="mt-4 pt-3 border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] flex items-center justify-between">
            <Text as="span" variant="caption">
              Último {soles(ultimo.declarado)}
            </Text>
            <Badge variant={ultimo.diferencia === 0 ? 'success' : 'danger'}>
              {ultimo.diferencia >= 0 ? '+' : ''}
              {soles(ultimo.diferencia)}
            </Badge>
          </div>
        ) : null}
      </Card>
    </ArqueoShell>
  );
}
