import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchableSelect = ({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  className = '',
  error = false,
  disabled = false,
  displayKey = 'name',
  valueKey = 'id',
  emptyMessage = 'No options found',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter((option) =>
      option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, displayKey]);

  // Get display value for selected option
  const selectedOption = options.find(
    (option) => option[valueKey]?.toString() === value?.toString()
  );
  const displayValue = selectedOption ? selectedOption[displayKey] : '';

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
    }
  };

  return (
    <Select
      value={value?.toString() || ''}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger className={`${className} ${error ? 'border-red-500' : ''}`}>
        <SelectValue placeholder={placeholder}>
          {displayValue || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {/* Search Input */}
        <div className="flex items-center px-3 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full bg-transparent placeholder:text-muted-foreground border-0 px-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Options List */}
        <div className="max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem
                key={option[valueKey]}
                value={option[valueKey]?.toString()}
                className="cursor-pointer"
              >
                {option[displayKey]}
              </SelectItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

export default SearchableSelect;
