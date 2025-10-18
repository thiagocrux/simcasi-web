'use client';

import { displayValue } from '@/utils/displayValue';
import clsx from 'clsx';

interface DetailsCardFieldProps {
  label?: string;
  value: string | number | boolean | null | undefined;
  isBordered?: boolean;
}

export default function DetailsCardField({
  label,
  value,
  isBordered = true,
}: DetailsCardFieldProps) {
  return (
    <span
      className={clsx(
        'mb-2 flex items-start justify-between gap-x-4 pb-1',
        isBordered && 'border-border border-b-1'
      )}
    >
      {label ? <p className="font-semibold">{label}</p> : null}
      <p className="text-justify font-light">{displayValue(value)}</p>
    </span>
  );
}
