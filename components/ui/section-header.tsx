import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-8 flex items-center justify-between', className)}>
      <div className="flex-col">
        <h1 className="font-heading pb-1 text-xl">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
