import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatusTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'error';
}

/**
 * StatusText displays state as ordinary semantic text.
 * Strictly adheres to design rules: NO badges, NO chips, NO pulsing dots.
 */
export const StatusText = React.forwardRef<HTMLSpanElement, StatusTextProps>(
  ({ className, variant = 'neutral', children, ...props }, ref) => {
    const variantStyles = {
      neutral: 'text-muted-foreground',
      success: 'text-emerald-700 font-medium',
      warning: 'text-amber-700 font-medium',
      error: 'text-rose-700 font-medium',
    }[variant];

    return (
      <span
        ref={ref}
        className={cn('inline-block text-xs uppercase tracking-wider', variantStyles, className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

StatusText.displayName = 'StatusText';
