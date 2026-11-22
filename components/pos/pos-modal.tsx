import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export function PosModal({
  children,
  panelClassName = '',
}: {
  children: ReactNode;
  panelClassName?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md p-6 ${panelClassName}`}>{children}</Card>
    </div>
  );
}
