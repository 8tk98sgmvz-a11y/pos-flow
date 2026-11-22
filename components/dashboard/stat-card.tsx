import type { ReactNode } from 'react';
import { Card, CardHeading, CardMeta } from '@/components/ui/Card';

type Tone = 'blue' | 'emerald' | 'violet' | 'amber';

export function StatCard({
  icon,
  tone,
  title,
  children,
  left,
  right,
}: {
  icon: ReactNode;
  tone: Tone;
  title: string;
  children: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <Card className="p-5 min-h-[168px] flex flex-col justify-between">
      <CardHeading icon={icon} tone={tone} title={title} />
      {children}
      <CardMeta left={left} right={right} />
    </Card>
  );
}
