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
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const options = Array.from({ length: 500 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Option ${i + 1}`,
}));

const DEBUG = true;
const dlog = (...args) => DEBUG && console.log('[SearchableComboBox]', ...args);

export function SearchableComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [search, setSearch] = React.useState('');

  // derived (for debug only, Command’s own fuzzy filter still runs)
  const filteredCount = React.useMemo(() => {
    if (!search) return options.length;
    const s = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(s) || o.value.toLowerCase().includes(s)
    ).length;
  }, [search]);

  React.useEffect(() => {
    dlog('mount');
    return () => dlog('unmount');
  }, []);

  React.useEffect(() => {
    dlog('open state ->', open);
  }, [open]);

  React.useEffect(() => {
    const selected = options.find((o) => o.value === value);
    dlog('value changed ->', value, 'label:', selected?.label);
  }, [value]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        dlog('onOpenChange', next);
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
          onClick={() => dlog('trigger click')}
          data-testid="combobox-trigger"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : 'Select option...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[240px] p-0"
        align="start"
        onOpenAutoFocus={(e) => {
          dlog('popover onOpenAutoFocus');
          // keep default focus behavior
        }}
        onEscapeKeyDown={() => dlog('popover escape')}
      >
        <Command>
          <CommandInput
            placeholder="Search option..."
            value={search}
            onValueChange={(v) => {
              setSearch(v);
              dlog('search change ->', v);
            }}
            data-testid="combobox-search"
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup heading="Options">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    dlog('onSelect', {
                      currentValue,
                      prevValue: value,
                      option,
                    });
                    try {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    } catch (err) {
                      console.error(
                        '[SearchableComboBox] setValue error:',
                        err
                      );
                    }
                  }}
                  data-testid={`combobox-item-${option.value}`}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {/* tiny debug footer */}
          <div className="border-t px-2 py-1 text-xs text-muted-foreground">
            debug · open: {String(open)} · selected: {value || '∅'} · search: "
            {search}" · showing ≈ {filteredCount}/{options.length}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
