import { ArqueoCards } from './arqueo-cards';
import { ArqueoHistoryPanel } from './arqueo-history-panel';
import { ArqueoPageHeader } from './arqueo-page-header';
import { ArqueoShell } from './arqueo-shell';

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

export function ArqueoView({
  sistema,
  mostrar,
  onToggle,
  contado,
  onContado,
  onSave,
  rows,
}: {
  sistema: number;
  mostrar: boolean;
  onToggle: () => void;
  contado: string;
  onContado: (v: string) => void;
  onSave: () => void;
  rows: Arqueo[];
}) {
  return (
    <ArqueoShell>
      <ArqueoPageHeader />
      <ArqueoCards
        sistemaLabel={soles(sistema)}
        mostrar={mostrar}
        onToggle={onToggle}
        contado={contado}
        onContado={onContado}
        onSave={onSave}
      />
      <ArqueoHistoryPanel rows={rows} />
    </ArqueoShell>
  );
}
