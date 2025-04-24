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
import { Tag } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

type TagBadgeProps = {
  tag: Tag;
  className?: string;
};

export function TagBadge({ tag, className }: TagBadgeProps) {
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
