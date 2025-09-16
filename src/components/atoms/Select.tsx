'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Control, Controller, ControllerRenderProps } from 'react-hook-form';
import { AccessibleStatus } from './AccessibleStatus';
import InputErrorMessage from './InputErrorMessage';
import InputHelperText from './InputHelperText';
import InputLabel from './InputLabel';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  placeholder?: string;
  label?: string;
  isDisabled?: boolean;
  withSearch?: boolean;
  options: Option[];
  name: string;
  errorMessage?: string;
  helperText?: string;
  control: Control<any>;
}

export default function Select({
  name,
  label = '',
  placeholder = 'Selecione uma das opções',
  options,
  isDisabled = false,
  withSearch = false,
  errorMessage = '',
  helperText = '',
  control,
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [focusedOption, setFocusedOption] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const id = `${name}-select`;
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

  // Update filtered options when search term or options change
  useEffect(() => {
    if (withSearch && searchTerm) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, withSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedOption(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // When focusedOption changes, ensure the option is visible
  useEffect(() => {
    if (focusedOption !== null) {
      const el = optionRefs.current[focusedOption];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedOption]);

  // Handle search input changes
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) => {
    const term = event.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    setFocusedOption(null);

    // Update form field with the actual typed value when withSearch is true
    if (withSearch) {
      field.onChange(term);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: Option, field: any) => {
    field.onChange(option.value);
    if (withSearch) {
      setSearchTerm(option.label);
    }
    setIsOpen(false);
    setFocusedOption(null);
  };

  // Handle keyboard navigation
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) {
    if (event.key === 'Tab') {
      setIsOpen(false);
      setFocusedOption(null);
      return;
    }

    // Don't prevent default for search mode when typing
    if (
      withSearch &&
      (event.key.length === 1 ||
        event.key === 'Backspace' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowLeft')
    ) {
      return; // Allow normal typing
    }

    event.preventDefault();

    // Open/close dropdown
    if (event.key === ' ' || event.key === 'Enter') {
      if (!isOpen) {
        setIsOpen(true);
        setFocusedOption(null);
      } else if (event.key === 'Enter' && focusedOption !== null) {
        // Select the focused option
        handleOptionSelect(filteredOptions[focusedOption], field);
      } else {
        setIsOpen(false);
        setFocusedOption(null);
      }
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setFocusedOption(null);
      if (withSearch) {
        setSearchTerm('');
      }
    }

    // Arrow key navigation
    if (event.key === 'ArrowDown') {
      if (!isOpen) {
        setIsOpen(true);
        setFocusedOption(0);
      } else {
        setFocusedOption((prev) =>
          prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1)
        );
      }
    }

    if (event.key === 'ArrowUp') {
      if (isOpen) {
        if (focusedOption === 0) {
          setIsOpen(false);
          setFocusedOption(null);
        } else {
          setFocusedOption((prev) =>
            prev === null ? filteredOptions.length - 1 : Math.max(prev - 1, 0)
          );
        }
      }
    }
  }

  // Handle chevron click - focus input and toggle dropdown
  const handleChevronClick = () => {
    if (!isDisabled) {
      inputRef.current?.focus();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-y-1">
      {label && <InputLabel id={labelId} htmlFor={id} text={label} />}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Find the selected option for display
          const selectedOption = options.find(
            (option) => option.value === field.value
          );

          // Reset search term when field value is cleared (form reset)
          useEffect(() => {
            if (withSearch && !field.value && searchTerm) {
              setSearchTerm('');
            }
          }, [field.value]);

          // Determine what to show in the input
          let displayValue = '';

          if (withSearch) {
            if (isOpen || searchTerm) {
              displayValue = searchTerm;
            } else if (selectedOption) {
              displayValue = selectedOption.label;
            }
          } else {
            displayValue = selectedOption ? selectedOption.label : '';
          }

          return (
            <>
              <div
                className={clsx('relative flex', {
                  'cursor-pointer': !isDisabled,
                })}
              >
                <input
                  ref={inputRef}
                  id={id}
                  name={name}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={isDisabled}
                  readOnly={!withSearch}
                  autoComplete="off"
                  onClick={() => !isDisabled && setIsOpen(!isOpen)}
                  onChange={
                    withSearch ? (e) => handleSearchChange(e, field) : undefined
                  }
                  onKeyDown={(e) => !isDisabled && handleKeyDown(e, field)}
                  role="combobox"
                  aria-autocomplete={withSearch ? 'list' : 'none'}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-listbox`}
                  aria-haspopup="listbox"
                  aria-activedescendant={
                    focusedOption !== null
                      ? `${id}-option-${focusedOption}`
                      : undefined
                  }
                  aria-labelledby={label ? labelId : undefined}
                  aria-describedby={describedByIds || undefined}
                  aria-invalid={hasError || undefined}
                  className={clsx(
                    'border-input-border bg-input-background placeholder:text-input-placeholder focus-visible:ring-primary mb-1 flex min-h-11 w-full cursor-pointer items-center rounded-md border-1 pr-8 pl-4 select-none focus:outline-none focus-visible:ring-2',
                    { 'cursor-not-allowed opacity-50': isDisabled }
                  )}
                />
                <button
                  type="button"
                  onClick={handleChevronClick}
                  aria-label={isOpen ? 'Fechar lista' : 'Abrir lista'}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-listbox`}
                  disabled={isDisabled}
                  className={clsx(
                    'focus-visible:ring-primary absolute top-1/2 right-2 z-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm transition-all duration-300 focus:outline-none focus-visible:ring-2',
                    {
                      'rotate-180': isOpen,
                      'cursor-not-allowed': isDisabled,
                      'cursor-pointer': !isDisabled,
                    }
                  )}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Dropdown options */}
              {isOpen && !isDisabled && (
                <ul
                  id={`${id}-listbox`}
                  role="listbox"
                  aria-labelledby={label ? labelId : undefined}
                  className={clsx(
                    'border-input-border absolute z-3 flex max-h-60.5 w-full flex-col rounded-md border-1 shadow-lg',
                    {
                      'top-20': label,
                      'top-12': !label,
                      'overflow-y-scroll': filteredOptions.length > 5,
                    }
                  )}
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <li
                        key={option.value}
                        id={`${id}-option-${index}`}
                        role="option"
                        aria-selected={field.value === option.value}
                      >
                        <div
                          role="presentation"
                          onClick={() => handleOptionSelect(option, field)}
                          ref={(element) => {
                            optionRefs.current[index] = element;
                          }}
                          className={clsx(
                            'bg-input-background placeholder:text-input-placeholder hover:bg-surface flex min-h-11 w-full cursor-pointer flex-col items-start justify-center overflow-hidden border-none px-4 text-left select-none',
                            {
                              'ring-primary bg-surface ring-2 outline-none':
                                focusedOption === index,
                              'rounded-t-md': index === 0,
                              'rounded-b-md':
                                index === filteredOptions.length - 1,
                            }
                          )}
                          data-value={option.value}
                        >
                          {option.label}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>
                      <div className="flex min-h-11 w-full items-center justify-center px-4 text-gray-500">
                        Nenhuma opção encontrada
                      </div>
                    </li>
                  )}
                </ul>
              )}
              <InputHelperText id={helperTextId} text={helperText} />
              <InputErrorMessage id={errorMessageId} message={errorMessage} />
              <AccessibleStatus label={label} value={field.value} />
            </>
          );
        }}
      />
    </div>
  );
}
