import React from 'react';

interface ButtonProps {
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
}

export default function Button({
  children,
  className,
  shape = 'round',
  color = 'filled',
  size = 'small',
  isHidden = false,
  isDisabled = false,
  type = 'button',
  onClick,
}: ButtonProps) {
  const baseClasses =
    'w-full bg-primary text-white min-h-11 rounded-md cursor-pointer';

  const shapeClasses = {
    round: '',
    square: '',
  };

  const colorClasses = {
    disabled: 'bg-gray-500',
    elevated: '',
    filled: 'bg-primary',
    outlined: '',
    text: '',
    tonal: '',
  };

  const sizeClasses = {
    xs: '',
    sm: 'p-8',
    md: '',
    lg: '',
    xl: '',
  };

  if (isHidden) {
    return null;
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${colorClasses[color]} ${
        isDisabled ? colorClasses['disabled'] : colorClasses[color]
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
