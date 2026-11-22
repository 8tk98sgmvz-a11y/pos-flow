import Link from 'next/link';

export function ReportesPageHeader() {
  return (
    <>
      <Link href="/" className="text-[12px] text-slate-400">
        ← Resumen
      </Link>
      <h1 className="text-[24px] font-semibold mt-1">Reportes por producto</h1>
      <p className="text-[13px] text-slate-400 mb-5">Qué se vende más y con qué margen</p>
    </>
  );
}
