interface AccessibleStatusProps {
  value: string | number | boolean;
  label: string;
  message?: string;
}

/**
 * Visually hidden status message for screen readers, announcing changes in form field values.
 * @param {Object} props - Component props
 * @param {string | number | boolean} props.value - The current value of the field. If truthy, the message will be announced.
 * @param {string} props.label - The label or description of the field/value.
 * @param {string} [props.message] - Optional custom message to announce. If not provided, defaults to "Selecionado: {label}".
 * @returns {JSX.Element} A <span> element with appropriate ARIA attributes for accessibility.
 */
export function AccessibleStatus({
  value,
  label,
  message = '',
}: AccessibleStatusProps) {
  return (
    <span className="sr-only" aria-live="polite" role="status">
      {value ? (message ? message : `Selecionado: ${label ?? value}`) : ''}
    </span>
  );
}
