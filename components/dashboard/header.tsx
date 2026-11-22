import { Button, ButtonLink } from '@/components/ui';

export function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="h-16 border-b border-neutral-800/70 bg-[#070708]/90 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex flex-col justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">Resumen</h2>
        <p className="text-[11px] text-muted mt-1">Caja, fiados y deudas de hoy</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onLogout} className="h-9 text-xs px-3">
          Salir
        </Button>
        <ButtonLink href="/pos" variant="primary" className="h-9 text-xs md:text-sm px-4">
          Cobrar
        </ButtonLink>
      </div>
    </header>
  );
}
