import { format } from 'date-fns';

export function displayValue(
  value: string | number | boolean | null | undefined,
  isDate?: boolean
): string {
  if (value === null || value === undefined || value === '') {
    return 'Não informado';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (isDate) {
    return format(value, 'dd/MM/yyyy');
  }

  return String(value);
}
