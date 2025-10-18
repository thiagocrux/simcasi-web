import { format, isValid as isValidDate } from 'date-fns';

export function formatSafeBirthDate(dateValue: string | null): string {
  if (!dateValue) return '';

  let date: Date;

  // Check if the date is already in Brazilian format (dd/MM/yyyy)
  const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const brazilianMatch = dateValue.match(brazilianDateRegex);

  if (brazilianMatch) {
    // Parse Brazilian format: dd/MM/yyyy
    const [, day, month, year] = brazilianMatch;
    // Create date object (month is 0-indexed in JS)
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    // Try standard JavaScript parsing
    date = new Date(dateValue);

    // If invalid, try ISO string parsing
    if (!isValidDate(date) && typeof dateValue === 'string') {
      const isoDate = new Date(dateValue + 'T00:00:00.000Z');
      if (isValidDate(isoDate)) {
        date = isoDate;
      }
    }
  }

  // Check if the date is valid using date-fns isValid
  if (!isValidDate(date)) {
    return '';
  }

  return format(date, 'dd/MM/yyyy');
}
