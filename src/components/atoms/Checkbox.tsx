'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { AccessibleStatus } from './AccessibleStatus';
import InputErrorMessage from './InputErrorMessage';
import InputHelperText from './InputHelperText';

interface CheckboxProps {
  name: string;
  control: import('react-hook-form').Control<any>;
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
  helperText?: string;
  defaultValue?: boolean;
}

export default function Checkbox({
  name,
  control,
  label = '',
  disabled = false,
  errorMessage = '',
  helperText = '',
  defaultValue = false,
}: CheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = `${name}-checkbox`;
  const labelId = `${id}-label`;
  const helperTextId = `${id}-helper-text`;
  const errorMessageId = `${id}-error-message`;
  const hasError = Boolean(errorMessage);

  // Create aria-describedby string based on what's present
  const describedByIds = [
    helperText && helperTextId,
    hasError && errorMessageId,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <fieldset>
          <div className="flex w-full items-center gap-x-2">
            <button
              tabIndex={0}
              role="checkbox"
              type="button"
              disabled={disabled}
              aria-checked={field.value}
              aria-describedby={describedByIds || undefined}
              aria-disabled={disabled}
              aria-invalid={hasError}
              aria-labelledby={label ? labelId : undefined}
              onClick={() => !disabled && field.onChange(!field.value)}
              onKeyDown={(event) => {
                if (disabled) return;

                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault();
                  field.onChange(!field.value);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                field.onBlur();
              }}
              className={clsx('rounded-sm', {
                'cursor-not-allowed opacity-50': disabled,
                'cursor-pointer': !disabled,
                'focus-visible:ring-primary focus:outline-none focus-visible:ring-2':
                  isFocused,
              })}
            >
              <input
                id={id}
                tabIndex={-1}
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                aria-hidden={true}
                className="hidden"
              />
              <span
                className={clsx(
                  'border-border flex h-5 w-5 items-center justify-center rounded-sm border-1 text-white',
                  {
                    'bg-success': field.value,
                    'bg-transparent': !field.value,
                  }
                )}
              >
                {field.value && <Check size={15} />}
              </span>
            </button>
            {label && (
              <label
                id={labelId}
                onClick={() => !disabled && field.onChange(!field.value)}
                className={clsx('select-none', {
                  'cursor-not-allowed': disabled,
                  'cursor-pointer': !disabled,
                })}
              >
                {label}
              </label>
            )}
          </div>
          <InputHelperText id={helperTextId} text={helperText} />
          <InputErrorMessage id={errorMessageId} message={errorMessage} />
          <AccessibleStatus label={label} value={field.value} />
        </fieldset>
      )}
    />
  );
}
