import { FlujoFilterButton } from './flujo-filter-button';

type Filtro = 'hoy' | 'ayer' | 'mes' | 'todo' | 'rango';

const FILTERS: { id: Filtro; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'ayer', label: 'Ayer' },
  { id: 'mes', label: 'Este mes' },
  { id: 'todo', label: 'Todo' },
  { id: 'rango', label: 'Rango' },
];

export function FlujoFilters({
  filtro,
  onFiltro,
}: {
  filtro: Filtro;
  onFiltro: (f: Filtro) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTERS.map((f) => (
        <FlujoFilterButton key={f.id} active={filtro === f.id} onClick={() => onFiltro(f.id)}>
          {f.label}
        </FlujoFilterButton>
      ))}
    </div>
  );
}
