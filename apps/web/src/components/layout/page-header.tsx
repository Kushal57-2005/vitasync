import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        'flex flex-col gap-1 pb-6 md:flex-row md:items-center md:justify-between',
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 pt-2 md:pt-0">{actions}</div>}
    </header>
  );
};
