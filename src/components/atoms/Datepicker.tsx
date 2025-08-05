import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  addDays,
  addMonths,
  addYears,
  constructNow,
  format,
  getDay,
  getDaysInMonth,
  getDecade,
  isSameDay,
  isSameMonth,
  isWeekend,
  set,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

type Props = {
  value: string;
  onChange: (date: string | undefined) => void;
  name: string;
  initialDate?: Date;
  disableWeekendSelection?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
};

type Header = 'month-year' | 'year' | 'year-range';

export default function Datepicker({
  name,
  disableWeekendSelection = false,
  isDisabled = false,
  hasError = false,
  errorMessage = '',
  label = '',
  onChange,
}: Props) {
  const datepickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarVariant, setCalendarVariant] = useState<Header>('month-year');
  const [isVisible, setIsVisible] = useState(false);

  const [referenceDate, setReferenceDate] = useState<Date>(
    value || constructNow(new Date())
  );

  // Conditionals and consts
  const DAYS_OF_THE_WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const DATES_PER_PAGE = 42;
  const showDaysOfTheWeek = calendarVariant === 'month-year';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isVisible &&
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node) &&
        event.target !== inputRef.current
      ) {
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  function isDateDisabled(date: Date) {
    if (disableWeekendSelection && isWeekend(date)) {
      return true;
    }

    return false;
  }

  /* HEADER */
  function getFormattedHeaderLabel() {
    switch (calendarVariant) {
      case 'month-year':
        return format(referenceDate, 'LLLL yyyy', { locale: ptBR });
      case 'year':
        return format(referenceDate, 'yyyy');
      default:
        return `${getDecade(referenceDate)} - ${getDecade(referenceDate) + 9}`;
    }
  }

  function handleVariantSelection() {
    if (calendarVariant === 'month-year') {
      setCalendarVariant('year');
    } else if (calendarVariant === 'year') {
      setCalendarVariant('year-range');
    }
  }

  function handleVariantNavigation(direction: 'previous' | 'forward') {
    if (calendarVariant === 'month-year') {
      if (direction === 'previous') {
        setReferenceDate((prevState) => subMonths(prevState, 1));
      } else {
        setReferenceDate((prevState) => addMonths(prevState, 1));
      }
    } else if (calendarVariant === 'year') {
      if (direction === 'previous') {
        setReferenceDate((prevState) => subYears(prevState, 1));
      } else {
        setReferenceDate((prevState) => addYears(prevState, 1));
      }
    } else {
      if (direction === 'previous') {
        setReferenceDate((prevState) => subYears(prevState, 10));
      } else {
        setReferenceDate((prevState) => addYears(prevState, 10));
      }
    }
  }

  /* DATES SELECTOR */
  function getDates() {
    const daysInMonth = getDaysInMonth(referenceDate);
    const firstDateOfTheMonth = set(referenceDate, { date: 1 });
    const lastDateOfTheMonth = set(referenceDate, { date: daysInMonth });
    const firstWeekDayOfTheMonth = getDay(firstDateOfTheMonth);

    const dates: Date[] = [];

    // Add dates from current month
    for (let index = 0; index < daysInMonth; index++) {
      dates.push(set(referenceDate, { date: index + 1 }));
    }

    // Add dates from previous month that will be displayed on current page
    for (let index = 0; index < firstWeekDayOfTheMonth; index++) {
      dates.unshift(subDays(firstDateOfTheMonth, index + 1));
    }

    const MISSING_DATES_COUNT = DATES_PER_PAGE - dates.length;

    // Add dates from next month that will be displayed on current page
    for (let index = 0; index < MISSING_DATES_COUNT; index++) {
      dates.push(addDays(lastDateOfTheMonth, index + 1));
    }

    return dates.map((date) => ({ date, label: date.getDate() }));
  }

  function getMonths() {
    const ANNUAL_MONTHS_COUNT = 12;
    const months: Date[] = [];

    for (let index = 0; index < ANNUAL_MONTHS_COUNT; index++) {
      months.push(set(referenceDate, { date: 1, month: index }));
    }

    return months.map((month) => ({
      date: month,
      label: format(month, 'LLL.', { locale: ptBR }),
    }));
  }

  function getYears() {
    const REFERENCE_DATE_DECADE = getDecade(referenceDate);
    const DECADE_COUNT = 10;
    const years: Date[] = [];

    for (let index = 0; index < DECADE_COUNT; index++) {
      years.push(set(referenceDate, { year: REFERENCE_DATE_DECADE + index }));
    }

    return years.map((year) => ({ date: year, label: year.getFullYear() }));
  }

  function handleDateSelection(date: Date) {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
  }

  function handleMonthSelection(date: Date) {
    setCalendarVariant('month-year');
    setReferenceDate(date);
  }

  function handleYearSelection(date: Date) {
    setCalendarVariant('year');
    setReferenceDate(date);
  }

  function getVariant(date: Date) {
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isDifferentMonth = !isSameMonth(date, referenceDate);
    const isWeekendDay = isWeekend(date);

    if (isSelected && isDifferentMonth) return 'selected-dimmed';
    if (isSelected) return 'selected';
    if (isDifferentMonth) return 'dimmed';
    if (isWeekendDay) return 'weekend';

    return 'default';
  }

  function handleInputClick(event: React.MouseEvent<HTMLInputElement>) {
    if (isVisible) {
      event.stopPropagation();
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }

  function confirmAndClose() {
    if (!selectedDate) {
      setIsVisible(false);
      return;
    }

    setValue(selectedDate);
    onChange(selectedDate ? selectedDate.toISOString() : '');
    setSelectedDate(null);
    setIsVisible(false);
  }

  /* STYLES */

  const commonHeaderButtonStyles = `flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border-none bg-transparent cursor-pointer transition-all duration-100 ease-in-out hover:bg-surface select-none`;
  const commonSelectorStyles = 'w-full text-center grid gap-2 my-2';
  const commonVariantStyles = `rounded-md transition-all duration-100 ease-in-out select-none`;

  const variantModifiers: Record<string, string> = {
    default: `text-text-default hover:bg-surface ${commonVariantStyles}`,
    selected: `text-text-primary bg-primary hover:bg-primary-hover ${commonVariantStyles}`,
    'selected-dimmed': `text-text-primary bg-primary opacity-50 hover:opacity-60 hover:bg-primary-hover ${commonVariantStyles}`,
    weekend: `text-error hover:bg-surface ${commonVariantStyles}`,
    dimmed: `text-text-disabled hover:bg-surface ${commonVariantStyles}`,
  } as const;

  return (
    <>
      <div className="relative flex w-full flex-col gap-y-2">
        {label && <label htmlFor={name}>{label}</label>}

        <input
          ref={inputRef}
          name={name}
          value={value ? format(value, 'dd/MM/yyyy') : ''}
          placeholder="--/--/----"
          disabled={isDisabled}
          onClick={handleInputClick}
          readOnly
          className="border-input-border bg-input-background placeholder:text-input-placeholder focus:ring-primary min-h-11 w-full cursor-pointer rounded-md border-1 px-4 focus:ring-2 focus:outline-none"
        />

        {isVisible && (
          <div
            ref={datepickerRef}
            className={`bg-input-background border-input-border absolute left-1/2 flex -translate-x-1/2 flex-col items-center rounded-sm border-1 p-4 text-[14px] ${label ? 'top-21' : 'top-20'} w-60`}
          >
            {/* HEADER */}
            <div className="flex w-full justify-between">
              <span
                className={`${commonHeaderButtonStyles}`}
                onClick={() => handleVariantNavigation('previous')}
              >
                <ChevronLeft size={16} />
              </span>
              <span
                className={`${commonHeaderButtonStyles} w-full font-bold`}
                onClick={handleVariantSelection}
              >
                {getFormattedHeaderLabel()}
              </span>
              <span
                className={`${commonHeaderButtonStyles}`}
                onClick={() => handleVariantNavigation('forward')}
              >
                <ChevronRight size={16} />
              </span>
            </div>

            {/* DAYS OF THE WEEK */}
            {showDaysOfTheWeek && (
              <div className="mt-2 grid w-full grid-cols-7 grid-rows-1 gap-x-2">
                {DAYS_OF_THE_WEEK.map((day, index) => (
                  <span
                    className="flex min-h-6 min-w-6 items-center justify-center text-xs font-semibold select-none"
                    key={index}
                  >
                    {day}
                  </span>
                ))}
              </div>
            )}

            {/* SELECTOR */}
            {calendarVariant === 'month-year' ? (
              <div
                className={`${commonSelectorStyles} grid-cols-7 grid-rows-6`}
              >
                {getDates().map(({ date, label }, index) => (
                  /* DAY SELECTOR */
                  <span
                    key={index}
                    className={`${variantModifiers[getVariant(date)]} ${!isDateDisabled(date) && 'cursor-pointer'} flex min-h-6 min-w-6 items-center justify-center`}
                    onClick={() => handleDateSelection(date)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : calendarVariant === 'year' ? (
              <div
                className={`${commonSelectorStyles} grid-cols-3 grid-rows-4`}
              >
                {getMonths().map(({ date, label }, index) => (
                  /* MONTH SELECTOR */
                  <span
                    className="hover:bg-surface cursor-pointer rounded-md select-none"
                    key={index}
                    onClick={() => handleMonthSelection(date)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div
                className={`${commonSelectorStyles} grid-cols-3 grid-rows-4`}
              >
                {getYears().map(({ date, label }, index) => (
                  /* YEAR SELECTOR */
                  <div
                    className="hover:bg-surface cursor-pointer rounded-md select-none"
                    key={index}
                    onClick={() => handleYearSelection(date)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
            <div className="flex w-full">
              <button
                className="bg-primary hover:bg-primary-hover text-text-primary mt-2 h-9 flex-1 cursor-pointer rounded-sm text-xs font-medium"
                onClick={confirmAndClose}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {hasError && <span className="text-error text-md">{errorMessage}</span>}
    </>
  );
}
