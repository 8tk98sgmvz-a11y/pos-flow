import { ArqueoHistory } from './arqueo-history';
import { ArqueoHistoryRow } from './arqueo-history-row';

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

export function ArqueoHistoryPanel({ rows }: { rows: Arqueo[] }) {
  return (
    <ArqueoHistory empty={rows.length === 0}>
      {rows.map((r) => (
        <ArqueoHistoryRow
          key={r.id || r.createdAt}
          fecha={new Date(r.createdAt).toLocaleString('es-PE')}
          declarado={soles(r.declarado)}
          sistema={soles(r.sistema)}
          diferencia={`${r.diferencia >= 0 ? '+' : ''}${soles(r.diferencia)}`}
          ok={r.diferencia === 0}
        />
      ))}
    </ArqueoHistory>
  );
}
