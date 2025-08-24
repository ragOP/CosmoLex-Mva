import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, error, ...props }) {
  return (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-white file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'backdrop-blur-sm bg-white border-input dark:bg-input/30 dark:hover:bg-input/50',
          error && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50',
          className
        )}
        {...props}
      />

    </div>
  );
}

export { Input };
