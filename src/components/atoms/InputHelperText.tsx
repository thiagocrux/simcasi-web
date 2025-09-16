'use client';

interface InputHelperTextProps {
  id: string;
  text?: string;
}

export default function InputHelperText({ id, text }: InputHelperTextProps) {
  if (!text) {
    return null;
  }

  return (
    <p id={id} className="text-text-secondary text-sm">
      {text}
    </p>
  );
}
