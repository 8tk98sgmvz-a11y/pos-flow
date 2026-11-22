import type { ReactNode } from 'react';

export function ReportesTableStatus({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={5} className="p-4 text-center text-slate-500">
        {children}
      </td>
    </tr>
  );
}
