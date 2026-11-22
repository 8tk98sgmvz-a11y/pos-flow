export function ReportesTableRow({
  producto,
  unidades,
  total,
  costo,
  margen,
  margenPositivo,
}: {
  producto: string;
  unidades: number;
  total: string;
  costo: string;
  margen: string;
  margenPositivo: boolean;
}) {
  return (
    <tr className="border-t border-white/10">
      <td className="p-3">{producto}</td>
      <td className="p-3 text-right">{unidades}</td>
      <td className="p-3 text-right">{total}</td>
      <td className="p-3 text-right">{costo}</td>
      <td className={`p-3 text-right ${margenPositivo ? 'text-emerald-400' : 'text-red-400'}`}>
        {margen}
      </td>
    </tr>
  );
}
