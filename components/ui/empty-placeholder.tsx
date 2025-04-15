import { cn } from '@/lib/utils';
import * as React from 'react';

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in-50 flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlaceholderTitleProps) {
  return (
    <h2
      className={cn('mt-6 text-xl font-semibold', className)}
      {...props}
    />
  );
};

interface EmptyPlaceholderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        'text-muted-foreground mt-2 mb-8 text-center text-sm leading-6 font-normal',
        className,
      )}
      {...props}
    />
  );
};
