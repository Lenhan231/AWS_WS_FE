import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Simplified base styles
          'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 disabled:opacity-50 disabled:pointer-events-none',

          // Variant styles
          {
            'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800':
              variant === 'default',
            'bg-red-600 text-white hover:bg-red-700':
              variant === 'destructive',
            'border border-primary-600 text-primary-400 bg-transparent hover:bg-primary-600 hover:text-white':
              variant === 'outline',
            'bg-dark-800 text-white hover:bg-dark-700 border border-dark-700 hover:border-primary-600':
              variant === 'secondary',
            'text-gray-300 hover:bg-dark-800 hover:text-white':
              variant === 'ghost',
            'text-primary-500 underline-offset-4 hover:underline': variant === 'link',
          },

          // Size styles
          {
            'h-10 px-6 py-2': size === 'default',
            'h-9 px-4 text-xs': size === 'sm',
            'h-12 px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };

