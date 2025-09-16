'use client';

import clsx from 'clsx';
import { Control, Controller } from 'react-hook-form';
import { AccessibleStatus } from './AccessibleStatus';
import InputErrorMessage from './InputErrorMessage';
import InputHelperText from './InputHelperText';
import InputLabel from './InputLabel';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  options: Option[];
  control: Control<any>;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export default function RadioGroup({
  name,
  options,
  control,
  label = '',
  helperText = '',
  errorMessage = '',
  disabled = false,
}: RadioGroupProps) {
  const id = `${name}-radio-group`;
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
      render={({ field }) => (
        <fieldset id={id} disabled={disabled}>
          {label && <InputLabel id={labelId} text={label} />}
          <div
            role="radiogroup"
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={describedByIds || undefined}
            aria-invalid={hasError}
            className="flex flex-wrap items-center justify-between gap-x-4"
          >
            {options.map((option) => {
              const optionId = `${option.value.toLowerCase()}-radio-button`;
              const checked = field.value === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={optionId}
                  className="flex items-center gap-x-1"
                >
                  <input
                    id={optionId}
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={checked}
                    disabled={disabled}
                    onBlur={field.onBlur}
                    onChange={() => field.onChange(option.value)}
                    aria-describedby={describedByIds || undefined}
                    className={clsx(
                      "border-input-border focus-visible:ring-primary relative min-h-3.5 min-w-3.5 appearance-none rounded-full border-2 checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:h-2 checked:after:w-2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:transform checked:after:rounded-full checked:after:bg-white checked:after:content-[''] focus:outline-none focus-visible:ring-2",
                      {
                        'checked:gray-400 cursor-not-allowed checked:border-gray-400':
                          disabled,
                        'checked:border-success checked:bg-success cursor-pointer':
                          !disabled,
                      }
                    )}
                  />
                  <span className={clsx({ 'text-gray-400': disabled })}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
          <InputHelperText id={helperTextId} text={helperText} />
          <InputErrorMessage id={errorMessageId} message={errorMessage} />
          <AccessibleStatus label={label} value={field.value} />
        </fieldset>
      )}
    />
  );
}
