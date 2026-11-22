import { Card } from '@/components/ui';

export function FlujoStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-[12px] text-slate-400">{label}</p>
      <p className="text-[22px] font-semibold text-emerald-400">{value}</p>
    </Card>
  );
}
