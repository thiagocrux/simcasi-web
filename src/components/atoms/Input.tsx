'use client';

import { useFormContext } from 'react-hook-form';

interface InputProps {
  name: string;
  placeholder: string;
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
  isDisabled?: boolean;
  helperText?: string;
}

export default function Input({
  name,
  placeholder,
  hasError = false,
  errorMessage = '',
  label = '',
  isDisabled = false,
  helperText = '',
}: InputProps) {
  const { register } = useFormContext();

  return (
    <div className="flex w-full flex-col gap-y-1">
      {label && <label htmlFor={name}>{label}</label>}

      <input
        {...register(name)}
        name={name}
        className="border-input-border bg-input-background placeholder:text-input-placeholder focus:ring-primary min-h-11 rounded-md border-1 px-4 focus:ring-2 focus:outline-none"
        placeholder={placeholder}
        disabled={isDisabled}
      />
      {helperText && (
        <p className="text-text-secondary text-sm">{helperText}</p>
      )}
      {hasError && <span className="text-error leading-3">{errorMessage}</span>}
    </div>
  );
}
