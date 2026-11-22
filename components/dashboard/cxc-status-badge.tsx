const statusStyle: Record<string, string> = {
  Vencida: 'bg-[#7F1D1D] text-white',
  Pendiente: 'bg-[#1E3A8A] text-white',
  Pagada: 'bg-[#166534] text-white',
};

export function CxcStatusBadge({ estado }: { estado: string }) {
  return (
    <span className={`inline-block text-[11px] px-2.5 py-1 rounded-md font-medium ${statusStyle[estado]}`}>
      {estado}
    </span>
  );
}
