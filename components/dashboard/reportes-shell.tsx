import type { ReactNode } from 'react';

export function ReportesShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#070B14] text-white p-5">{children}</div>;
}
