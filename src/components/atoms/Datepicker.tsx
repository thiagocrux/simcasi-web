'use client';

import { formatStringWithMask } from '@/utils/formatStringWithMask';
import clsx from 'clsx';
import { ptBR } from 'date-fns/locale';
import { Calendar1, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { AccessibleStatus } from './AccessibleStatus';
import InputErrorMessage from './InputErrorMessage';
import InputHelperText from './InputHelperText';
import InputLabel from './InputLabel';

import {
  addDays,
  addMonths,
  addYears,
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
  name: string;
  startDate?: Date;
  disableWeekendSelection?: boolean;
  isDisabled?: boolean;
  helperText?: string;
  errorMessage?: string;
  label?: string;
  control: any;
};

type Header = 'month-year' | 'year' | 'year-range';

export default function Datepicker({
  name,
  control,
  disableWeekendSelection = false,
  isDisabled = false,
  helperText = '',
  errorMessage = '',
  label = '',
  startDate = new Date(),
}: Props) {
  const id = `${name}-datepicker`;
  const labelId = `${id}-label`;
  const helperTextId = `${id}-helper-text`;
  const errorMessageId = `${id}-error-message`;
  const hasError = Boolean(errorMessage);

  const describedByIds = [
    helperText && helperTextId,
    hasError && errorMessageId,
  ]
    .filter(Boolean)
    .join(' ');

  const datepickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(startDate);
  const [referenceDate, setReferenceDate] = useState<Date>(startDate);
  const [calendarVariant, setCalendarVariant] = useState<Header>('month-year');
  const [isVisible, setIsVisible] = useState(false);

  const DAYS_OF_THE_WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const DATES_PER_PAGE = 42;
  const PAST_DECADE_THRESHOLD = getDecade(new Date().setFullYear(1890));
  const FUTURE_DECADE_THRESHOLD = getDecade(new Date()) + 100;
  const showDaysOfTheWeek = calendarVariant === 'month-year';

  const isPreviousButtonDisabled =
    calendarVariant === 'year-range' &&
    getDecade(referenceDate) - 10 < PAST_DECADE_THRESHOLD;

  const isNextButtonDisabled =
    calendarVariant === 'year-range' &&
    getDecade(referenceDate) + 10 > FUTURE_DECADE_THRESHOLD;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isVisible &&
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node) &&
        event.target !== inputRef.current
      ) {
        resetCalendarView();
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  function isDateDisabled(date: Date) {
    return Boolean(disableWeekendSelection && isWeekend(date));
  }

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

  function resetCalendarView() {
    setReferenceDate(selectedDate!);
    setCalendarVariant('month-year');
  }

  function handleDatepickerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') {
      resetCalendarView();
      setIsVisible(false);
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
    const MONTHS_PER_YEAR = 12;
    const months: Date[] = [];

    for (let index = 0; index < MONTHS_PER_YEAR; index++) {
      months.push(set(referenceDate, { date: 1, month: index }));
    }

    return months.map((month) => ({
      date: month,
      label: format(month, 'LLL.', { locale: ptBR }),
    }));
  }

  function getYears() {
    const REFERENCE_DATE_DECADE = getDecade(referenceDate);
    const YEARS_PER_DECADE = 10;
    const years: Date[] = [];

    for (let index = 0; index < YEARS_PER_DECADE; index++) {
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

  function handleInputClick() {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }

  /* STYLES */

  const commonStyles = {
    button: `flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border-none bg-transparent cursor-pointer transition-all duration-100 ease-in-out hover:bg-surface select-none`,
    selector: 'w-full text-center grid gap-2 my-2',
    variant: `rounded-md transition-all duration-100 ease-in-out select-none`,
  };

  const variantStyles: Record<string, string> = {
    default: `text-text-default hover:bg-surface ${commonStyles.variant}`,
    selected: `text-text-primary bg-primary hover:bg-primary-hover ${commonStyles.variant}`,
    'selected-dimmed': `text-text-primary bg-primary opacity-50 hover:opacity-60 hover:bg-primary-hover ${commonStyles.variant}`,
    weekend: `text-error hover:bg-surface ${commonStyles.variant}`,
    dimmed: `text-text-disabled hover:bg-surface ${commonStyles.variant}`,
  } as const;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={''}
      render={({ field }) => {
        return (
          <>
            <div className="relative flex w-full flex-col gap-y-1">
              {label && <InputLabel id={labelId} htmlFor={id} text={label} />}
              {/* SECTION: Input */}
              <div className="relative">
                <input
                  ref={inputRef}
                  id={id}
                  name={name}
                  value={field.value || ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = formatStringWithMask(
                      event.target.value,
                      'date'
                    );

                    field.onChange(value);
                  }}
                  placeholder="dd/mm/aaaa"
                  disabled={isDisabled}
                  aria-describedby={describedByIds || undefined}
                  className={clsx(
                    'border-input-border bg-input-background placeholder:text-input-placeholder focus-visible:ring-primary mb-1 flex min-h-11 w-full items-center rounded-md border-1 pr-8 pl-4 select-none focus:outline-none focus-visible:ring-2',
                    { 'cursor-not-allowed opacity-50': isDisabled }
                  )}
                />
                <button
                  type="button"
                  onClick={handleInputClick}
                  disabled={isDisabled}
                  className={clsx(
                    'focus-visible:ring-primary absolute top-5.5 right-2 z-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm transition-all duration-300 focus:outline-none focus-visible:ring-2',
                    {
                      'cursor-not-allowed': isDisabled,
                      'cursor-pointer': !isDisabled,
                    }
                  )}
                >
                  <Calendar1 size={16} />
                </button>
              </div>
              {/* SECTION: Datepicker */}
              {isVisible && (
                <div
                  ref={datepickerRef}
                  className={clsx(
                    'bg-input-background border-input-border absolute left-1/2 z-2 flex w-60 -translate-x-1/2 flex-col items-center rounded-sm border-1 p-4 text-[14px]',
                    {
                      'top-19.5': label,
                      'top-20': !label,
                    }
                  )}
                >
                  {/* SECTION: Header */}
                  <div className="flex w-full justify-between">
                    <button
                      type="button"
                      className={clsx(commonStyles.button, {
                        'hover:bg-input-background! text-text-disabled cursor-default!':
                          isPreviousButtonDisabled,
                      })}
                      disabled={isPreviousButtonDisabled}
                      onKeyDown={handleDatepickerKeyDown}
                      onClick={() => handleVariantNavigation('previous')}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      className={clsx(commonStyles.button, 'w-full font-bold')}
                      onKeyDown={handleDatepickerKeyDown}
                      onClick={handleVariantSelection}
                    >
                      {getFormattedHeaderLabel()}
                    </button>
                    <button
                      type="button"
                      className={clsx(commonStyles.button, {
                        'hover:bg-input-background! text-text-disabled cursor-default!':
                          isNextButtonDisabled,
                      })}
                      disabled={isNextButtonDisabled}
                      onKeyDown={handleDatepickerKeyDown}
                      onClick={() => handleVariantNavigation('forward')}
                    >
                      <ChevronRight size={16} />
                    </button>
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
                  {/* SECTION: Date selection */}
                  {calendarVariant === 'month-year' ? (
                    <div
                      className={clsx(
                        commonStyles.selector,
                        'grid-cols-7 grid-rows-6'
                      )}
                    >
                      {getDates().map(({ date, label }, index) => (
                        <button
                          type="button"
                          key={index}
                          onKeyDown={handleDatepickerKeyDown}
                          onClick={() => handleDateSelection(date)}
                          className={clsx(
                            variantStyles[getVariant(date)],
                            'flex min-h-6 min-w-6 items-center justify-center',
                            { 'cursor-pointer': !isDateDisabled(date) }
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : calendarVariant === 'year' ? (
                    <div
                      className={clsx(
                        commonStyles.selector,
                        'grid-cols-3 grid-rows-4'
                      )}
                    >
                      {getMonths().map(({ date, label }, index) => (
                        <button
                          type="button"
                          className="hover:bg-surface cursor-pointer rounded-md select-none"
                          key={index}
                          onKeyDown={handleDatepickerKeyDown}
                          onClick={() => handleMonthSelection(date)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        commonStyles.selector,
                        'grid-cols-3 grid-rows-4'
                      )}
                    >
                      {getYears().map(({ date, label }, index) => (
                        <button
                          type="button"
                          className="hover:bg-surface cursor-pointer rounded-md select-none"
                          key={index}
                          onKeyDown={handleDatepickerKeyDown}
                          onClick={() => handleYearSelection(date)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* SECTION: Confirmation */}
                  <div className="flex w-full">
                    <button
                      type="button"
                      onKeyDown={handleDatepickerKeyDown}
                      onClick={() => {
                        field.onChange(format(selectedDate!, 'dd/MM/yyyy'));
                        resetCalendarView();
                        setIsVisible(false);
                      }}
                      className="bg-primary hover:bg-primary-hover text-text-primary mt-2 h-9 flex-1 cursor-pointer rounded-sm text-xs font-medium"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
              <div>
                <InputHelperText id={helperTextId} text={helperText} />
                <InputErrorMessage id={errorMessageId} message={errorMessage} />
                <AccessibleStatus label={label} value={field.value} />
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
