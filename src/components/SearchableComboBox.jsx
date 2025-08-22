'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export function SearchableCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyText,
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  console.log('[Combobox] render →', {
    value,
    selected,
    optionsCount: options?.length,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          onClick={() => {
            setOpen((prev) => !prev);
            console.log('[Combobox] trigger clicked', open);
          }}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <Command>
          <CommandInput
            placeholder={placeholder}
            onValueChange={(val) =>
              console.log('[Combobox] search input:', val)
            }
          />
          <CommandList>
            <CommandEmpty>{emptyText ?? 'No options found'}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={(val) => {
                    console.log('[Combobox] onSelect fired with:', val);
                    onValueChange(val); // use provided val
                  }}
                >
                  {o.label}
                  {o.value === value && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
