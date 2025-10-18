import { MaskOptions } from '@/types/common';

export function formatStringWithMask(value: string, type: MaskOptions) {
  if (!value) {
    return '';
  }

  let string;

  switch (type) {
    case 'cpf':
      // Remove non digits and limit characters to 11 (max. CPF digits)
      string = value.replace(/\D/g, '').slice(0, 11);

      return string
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    case 'date':
      // Remove non digits and limit characters to 8 (max. date digits)
      string = value.replace(/\D/g, '').slice(0, 8);

      return string
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    case 'number':
      // Remove non digits
      return value.replace(/\D/g, '');
    case 'phone':
      // Remove non digits and limit characters to 13 (max. pnone digits)
      string = value.replace(/\D/g, '').slice(0, 13);

      return string
        .replace(/(\d{2})(\d)/, '+$1 $2')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d{5})$/, '$1$2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2');
    case 'sus-card-number':
      // Remove non digits and limit characters to 15 (max. SUS code digits)
      return value.replace(/\D/g, '').slice(0, 15);
    default:
      return value;
  }
}
