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
    <div className="flex gap-2 mb-4">
      <input
        type="date"
        value={desde}
        onChange={(e) => onDesde(e.target.value)}
        className="bg-[#0B1220] border border-white/10 rounded-lg px-3 py-1.5 text-[13px]"
      />
      <input
        type="date"
        value={hasta}
        onChange={(e) => onHasta(e.target.value)}
        className="bg-[#0B1220] border border-white/10 rounded-lg px-3 py-1.5 text-[13px]"
      />
    </div>
  );
}
