'use client';

interface InputLabelProps {
  text: string;
  id?: string;
  htmlFor?: string;
}

export default function InputLabel({
  id = undefined,
  htmlFor = undefined,
  text,
}: InputLabelProps) {
  return (
    <label id={id} htmlFor={htmlFor}>
      {text}
    </label>
  );
}
