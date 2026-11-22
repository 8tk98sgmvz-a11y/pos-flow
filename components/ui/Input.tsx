import { forwardRef, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', label, error, id, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="block text-caption font-medium text-muted mb-ds-2">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={`w-full h-10 rounded-ds-md bg-surface border px-ds-3 text-body text-foreground placeholder:text-subtle outline-none transition-shadow duration-ds ease-ds focus:border-primary focus:shadow-ds-focus ${
          error
            ? 'border-danger/70'
            : 'border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))]'
        } ${className}`}
        {...props}
      />
      {error ? <p className="mt-ds-2 text-caption text-danger">{error}</p> : null}
    </div>
  );
});
