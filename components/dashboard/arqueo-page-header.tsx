import Link from 'next/link';

export function ArqueoPageHeader() {
  return (
    <>
      <Link href="/" className="text-[12px] text-slate-400">
        ← Resumen
      </Link>
      <h1 className="text-[24px] font-semibold mt-1">Arqueo ciego</h1>
      <p className="text-[13px] text-slate-400 mb-5">El cajero cuenta. El sistema compara después.</p>
    </>
  );
}
