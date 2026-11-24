import { Input } from '@/components/ui';

export function FlujoDateRange({
  desde,
  hasta,
  onDesde,
  onHasta,
}: {
  desde: string;
  hasta: string;
  onDesde: (v: string) => void;
  onHasta: (v: string) => void;
}) {
  return (
    <div className="flex gap-ds-2 mb-ds-4 max-w-md">
      <Input type="date" value={desde} onChange={(e) => onDesde(e.target.value)} className="h-9" />
      <Input type="date" value={hasta} onChange={(e) => onHasta(e.target.value)} className="h-9" />
    </div>
  );
}
