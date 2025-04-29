'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ColorPickerName, colorPickerOptions } from '@/types/colorPicker';
import { Paintbrush } from 'lucide-react';

export function ColorPicker({
  color,
  setColor,
  className,
}: {
  color: string;
  setColor: (color: ColorPickerName) => void;
  className?: string;
}) {
  const hexColor = colorPickerOptions.find((s) => s.name === color)?.color;

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[320px] justify-start text-left font-normal',
            !color && 'text-muted-foreground',
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {hexColor ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background: hexColor }}
              />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {color ? color : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="mt-0 flex flex-wrap gap-1">
          {colorPickerOptions.map((s) => (
            <div
              key={s.name}
              style={{ background: s.color }}
              className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
              onClick={() => setColor(s.name)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
