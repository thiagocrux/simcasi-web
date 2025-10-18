import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  id: string;
  children: React.ReactNode;
  shape?: 'round' | 'square';
  color?: 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isHidden?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  customClasses?: string;
}

export default function Button({
  id,
  children,
  // shape = 'round',
  color = 'filled',
  // size = 'small',
  isHidden = false,
  isDisabled = false,
  type = 'button',
  onClick,
  customClasses = '',
}: ButtonProps) {
  const baseClasses =
    'w-full text-white min-h-11 rounded-md cursor-pointer min-h-11 rounded-md border-1 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  // const shapeClasses = {
  //   round: '',
  //   square: '',
  // } as const;

  const colorClasses = {
    disabled: 'bg-gray-500 text-white',
    elevated: '',
    filled: 'bg-primary text-white',
    outlined: '',
    text: '',
    tonal: '',
  } as const;

  // const sizeClasses = {
  //   xs: '',
  //   sm: 'p-8',
  //   md: '',
  //   lg: '',
  //   xl: '',
  // } as const;

  if (isHidden) {
    return null;
  }

  return (
    <button
      id={id}
      tabIndex={0}
      type={type}
      className={clsx(
        baseClasses,
        isDisabled ? colorClasses['disabled'] : colorClasses[color],
        customClasses
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
