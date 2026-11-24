export function Money({ value, color = 'text-foreground' }: { value: string; color?: string }) {
  return (
    <p className={`text-title-1 font-mono leading-none tracking-tight ${color}`}>
      <span className="mr-1 text-[0.72em] text-muted">S/</span>
      <span>{value}</span>
    </p>
  );
}
