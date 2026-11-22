import { forwardRef, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui';

export const PosSearch = forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  }
>(function PosSearch({ value, onChange, onKeyDown }, ref) {
  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Buscar · Enter cobra"
      className="h-11 mb-3"
      autoFocus
    />
  );
});
