import { ArqueoButton } from './arqueo-button';
import { ArqueoCard } from './arqueo-card';

export function ArqueoContadoCard({
  value,
  onChange,
  onSave,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <ArqueoCard>
      <p className="text-[13px] text-slate-400 mb-2">¿Cuánto hay en el cajón?</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="number"
        className="w-full h-11 rounded-lg bg-[#070B14] border border-white/10 px-3 font-mono"
        placeholder="0.00"
      />
      <ArqueoButton variant="primary" onClick={onSave}>
        Cerrar arqueo
      </ArqueoButton>
    </ArqueoCard>
  );
}
