'use client';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { colorPickerOptions } from '@/types/colorPicker';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type TagContent = {
  id?: string;
  name: string;
  color?: string;
};

type TagBadgeProps = {
  tag: TagContent;
  className?: string;
  onRemove?: (tag: TagContent) => void;
  disabled?: boolean;
};

export function TagBadge({
  tag,
  className,
  disabled,
  onRemove,
}: TagBadgeProps) {
  const pickedColor = colorPickerOptions.find(
    (color) => color.name === tag.color,
  );

  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const spanElement = textRef.current;
    if (spanElement) {
      setIsTruncated(spanElement.scrollWidth > spanElement.clientWidth);
    }
  }, [tag.name]);

  const badge = (
    <Badge
      style={{ backgroundColor: pickedColor?.color }}
      className={cn(
        pickedColor?.darkText ? 'text-black' : 'text-white',
        'max-w-64',
        className,
      )}
    >
      <span
        ref={textRef}
        className="block truncate"
      >
        {tag.name}
      </span>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          'ring-offset-background focus:ring-ring ml-2 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2',
          !onRemove && 'hidden',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onRemove?.(tag);
          }
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={() => onRemove?.(tag)}
      >
        <X
          className={cn(
            'size-3',
            pickedColor?.darkText ? 'text-black' : 'text-white',
          )}
        />
      </button>
    </Badge>
  );

  return isTruncated ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>{tag.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    badge
  );
}
