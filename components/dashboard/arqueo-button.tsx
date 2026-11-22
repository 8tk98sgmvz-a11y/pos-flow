import type { ButtonHTMLAttributes } from 'react';

const variants = {
  ghost: 'mt-3 text-[12px] border border-white/15 rounded-lg px-3 py-1.5',
  primary: 'mt-3 w-full h-10 rounded-lg bg-white text-black text-[13px] font-medium',
};

export function ArqueoButton({
  variant,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant: keyof typeof variants }) {
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}
