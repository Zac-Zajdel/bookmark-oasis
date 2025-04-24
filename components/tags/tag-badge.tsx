'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { colorPickerOptions } from '@/types/colorPicker';
import { Tag } from '@prisma/client';

export function TagBadge({ tag }: { tag: Tag }) {
  const pickedColor = colorPickerOptions.find(
    (color) => color.name === tag.color,
  );

  return (
    <Badge
      variant={'default'}
      style={{ backgroundColor: pickedColor?.color }}
      className={cn(pickedColor?.darkText ? 'text-black' : 'text-white')}
    >
      {tag.name}
    </Badge>
  );
}
