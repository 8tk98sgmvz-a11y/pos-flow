import { Badge } from '@/components/ui';

export function PosToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="default" className="px-4 py-2 text-footnote bg-surface-raised shadow-ds-md">
        {message}
      </Badge>
    </div>
  );
}
