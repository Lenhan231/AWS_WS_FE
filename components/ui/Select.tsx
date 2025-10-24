import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          // Clean select with better visibility
          'flex h-14 w-full rounded-xl border border-gray-600/50 px-5 py-4 text-base text-white ring-offset-black',
          'bg-gray-800/80 backdrop-blur-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200 cursor-pointer',
          // Focus and hover effects
          'focus:bg-gray-800 focus:border-primary-500',
          'hover:border-gray-500/70 hover:bg-gray-800/90',
          // Custom select arrow with better color
          "appearance-none bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%239ca3af%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat",
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';

export { Select };

