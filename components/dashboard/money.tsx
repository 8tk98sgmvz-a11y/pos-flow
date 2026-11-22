export function Money({ value, color = 'text-white' }: { value: string; color?: string }) {
  return (
    <h3 className={`text-[26px] md:text-[30px] font-bold tracking-tight font-mono leading-none ${color}`}>
      <span className="mr-1 text-[0.82em] opacity-90">S/</span>
      <span>{value}</span>
    </h3>
  );
}
