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
    case 'phone':
      // Remove non digits and limit characters to 13 (max. Phone digits)
      string = value.replace(/\D/g, '').slice(0, 13);

      return string
        .replace(/(\d{2})(\d)/, '+$1 $2')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d{5})$/, '$1$2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2');
    case 'date':
      string = value.replace(/\D/g, '').slice(0, 8);

      return string
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    default:
      return value;
  }
}
