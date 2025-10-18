export function formatToDateString(value: string) {
  if (!value) {
    return '';
  }

  const splittedValue = value.split('/');
  return `${splittedValue[2]}-${splittedValue[1]}-${splittedValue[0]}`;
}
