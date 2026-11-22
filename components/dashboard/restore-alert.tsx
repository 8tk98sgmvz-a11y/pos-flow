export function RestoreAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mx-4 mt-3 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-sm text-amber-200">
      {message}
    </div>
  );
}
