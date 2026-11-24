'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/dashboard/dashboard-shell';
import { Badge, Card, Text } from '@/components/ui';
import { calcularAlertas, type Alerta } from '@/lib/alertas';
import { onLive } from '@/lib/live';

const nivelBadge: Record<Alerta['nivel'], 'danger' | 'warning' | 'success'> = {
  rojo: 'danger',
  ambar: 'warning',
  ok: 'success',
};

const nivelEtiqueta: Record<Alerta['nivel'], string> = {
  rojo: 'Atención',
  ambar: 'Revisar',
  ok: 'Al día',
};

export default function InteligenciaPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    const tick = async () => {
      const data = await calcularAlertas();
      setAlertas(Array.isArray(data) ? data : []);
    };
    tick();
    const stop = onLive(() => void tick());
    const id = setInterval(tick, 2000);
    return () => {
      stop();
      clearInterval(id);
    };
  }, []);

  return (
    <AppShell title="Inteligencia">
      <Text variant="caption" className="mb-ds-5">
        Sale de CxC, CxP, caja y el último arqueo. No se escribe a mano.
      </Text>

      <div className="space-y-ds-3 max-w-2xl">
        {alertas.length === 0 && (
          <Card className="p-ds-4">
            <Badge variant="success">Al día</Badge>
            <Text as="h2" variant="headline" className="mt-ds-2">
              Sin alertas
            </Text>
            <Text variant="caption" className="mt-ds-1">
              Fiados, deudas y arqueo están en cero.
            </Text>
          </Card>
        )}
        {alertas.map((a) => (
          <Card key={a.id} className="p-ds-4">
            <Badge variant={nivelBadge[a.nivel]}>{nivelEtiqueta[a.nivel]}</Badge>
            <Text as="h2" variant="headline" className="mt-ds-2">
              {a.titulo}
            </Text>
            <Text variant="body" className="mt-ds-1 text-muted">
              {a.detalle}
            </Text>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
