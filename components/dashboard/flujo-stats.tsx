import { FlujoStatCard } from './flujo-stat-card';

export function FlujoStats({ entradas }: { entradas: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      <FlujoStatCard label="Entradas" value={`S/ ${entradas.toFixed(2)}`} />
    </div>
  );
}
