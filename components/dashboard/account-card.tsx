import type { ReactNode } from 'react';
import { Card, CardHeading } from '@/components/ui/Card';
import { Money } from './money';

type Tone = 'blue' | 'emerald' | 'violet' | 'amber';

export function AccountCard({
  icon,
  tone,
  title,
  amount,
  subtitle,
  children,
}: {
  icon: ReactNode;
  tone: Tone;
  title: string;
  amount: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card className="lg:col-span-3 p-5 min-h-[300px] flex flex-col justify-between">
      <div>
        <CardHeading icon={icon} tone={tone} title={title} />
        <Money value={amount} />
        <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
      </div>
      {children}
    </Card>
  );
}
