import Link from 'next/link';

export function FlujoPageHeader({ subtitle }: { subtitle: string }) {
  return (
    <>
      <Link href="/" className="text-[12px] text-slate-400 hover:text-white">
        ← Resumen
      </Link>
      <h1 className="text-[24px] font-semibold mt-1">Flujo de Caja</h1>
      <p className="text-[13px] text-slate-400 mb-4">{subtitle}</p>
    </>
  );
}
