import { forwardRef, type InputHTMLAttributes } from 'react';

export const PosInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function PosInput({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full bg-[#111113] border border-neutral-800 rounded-xl ${className}`}
        {...props}
      />
    );
  }
);
