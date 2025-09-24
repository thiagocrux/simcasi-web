import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '360px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      fontSize: {
        xxs: '0.625rem', // 10px
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        success: 'var(--color-success)',
        'success-hover': 'var(--color-success-hover)',
        warning: 'var(--color-warning)',
        'warning-hover': 'var(--color-warning-hover)',
        error: 'var(--color-error)',
        'error-hover': 'var(--color-error-hover)',
        info: 'var(--color-info)',
        'info-hover': 'var(--color-info-hover)',

        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',

        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
        'text-default': 'var(--color-text-default)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-reversed': 'var(--color-text-reversed)',
        'text-disabled': 'var(--color-text-disabled)',

        'button-background': 'var(--color-button-background)',
        'button-label': 'var(--color-button-label)',
        /* inputs */
        'input-background': 'var(--color-input-background)',
        'input-border': 'var(--color-input-border)',
        'input-placeholder': 'var(--color-input-placeholder)',
        'input-error': 'var(--color-input-error)',
        /* datepicker */
        'datepicker-highlight': 'var(--color-datepicker-highlight)',
        'datepicker-error': 'var(--color-datepicker-error)',
        'datepicker-text': 'var(--color-datepicker-text)',

        backdrop: 'var(--color-backdrop)',
      },
    },
  },
  plugins: [],
};

export default config;
