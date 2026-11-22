import type { ButtonHTMLAttributes } from 'react';

const variants = {
  outline: 'h-9 px-3 rounded-xl border border-white/15 text-xs',
  add: 'flex-1 h-9 rounded-xl border border-white/15 text-xs hover:bg-white hover:text-black',
  methodOn: 'h-9 rounded-xl text-xs border bg-white text-black border-white',
  methodOff: 'h-9 rounded-xl text-xs border border-white/15',
  fiado: 'h-9 rounded-xl text-xs border border-amber-500/40 text-amber-300 col-span-2',
  charge: 'w-full h-11 mt-4 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed',
  reprint: 'w-full h-9 mt-2 rounded-xl border border-white/15 text-xs',
  arqueo: 'w-full h-10 rounded-xl border border-white/15 text-xs text-white hover:bg-white/5',
  cancel: 'flex-1 bg-neutral-900 text-neutral-400 py-3 rounded-xl text-xs',
  save: 'flex-1 bg-white text-black py-3 rounded-xl text-xs',
  saveFiado: 'flex-1 bg-amber-500 text-black font-medium py-3 rounded-xl text-xs',
};

export type PosButtonVariant = keyof typeof variants;

export function PosButton({
  variant,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant: PosButtonVariant }) {
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}
