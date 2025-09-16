'use client';

import { Control, Controller } from 'react-hook-form';
import { AccessibleStatus } from './AccessibleStatus';
import InputErrorMessage from './InputErrorMessage';
import InputHelperText from './InputHelperText';
import InputLabel from './InputLabel';

interface TextAreaProps {
  name: string;
  placeholder: string;
  errorMessage?: string;
  label?: string;
  isDisabled?: boolean;
  helperText?: string;
  control: Control<any>;
}

export default function TextArea({
  name,
  placeholder,
  errorMessage = '',
  label = '',
  isDisabled = false,
  helperText = '',
  control,
}: TextAreaProps) {
  const id = `${name}-textarea`;
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
      defaultValue=""
      render={({ field }) => (
        <div className="flex w-full flex-col gap-y-1">
          {label && <InputLabel id={labelId} htmlFor={id} text={label} />}
          <textarea
            id={id}
            placeholder={placeholder}
            disabled={isDisabled}
            value={field.value || ''}
            onBlur={field.onBlur}
            onChange={field.onChange}
            aria-describedby={describedByIds || undefined}
            className="border-input-border bg-input-background placeholder:text-input-placeholder focus-visible:ring-primary min-h-24 rounded-md border-1 px-4 py-2 focus:outline-none focus-visible:ring-2"
          />
          <div>
            <InputHelperText id={helperTextId} text={helperText} />
            <InputErrorMessage id={errorMessageId} message={errorMessage} />
            <AccessibleStatus label={label} value={field.value} />
          </div>
        </div>
      )}
    />
  );
}
