import { Text } from '@/components/ui';

export function FlujoPageHeader({ subtitle }: { subtitle: string }) {
  return (
    <Text variant="caption" className="mb-ds-4">
      {subtitle}
    </Text>
  );
}
