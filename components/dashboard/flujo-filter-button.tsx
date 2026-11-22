import type { ReactNode } from 'react';
import { Button } from '@/components/ui';

export function FlujoFilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      variant={active ? 'primary' : 'ghost'}
      onClick={onClick}
      className="px-3 py-1.5 h-auto text-[12px] font-medium"
    >
      {children}
    </Button>
  );
}
