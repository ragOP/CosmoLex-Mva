import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';

const StarRating = ({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select rating',
  searchPlaceholder = 'Search...',
  className = '',
  error = false,
  disabled = false,
  displayKey = 'name',
  valueKey = 'id',
  emptyMessage = 'No ratings found',
  maxStars = 5,
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
  
  // Extract rating number from the option name (assuming format like "1 Star", "2 Stars", etc.)
  const getRatingNumber = (option) => {
    if (!option) return 0;
    const name = option[displayKey];
    // Try to extract number from the beginning of the string
    const match = name.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const selectedRating = selectedOption ? getRatingNumber(selectedOption) : 0;

  // Render stars for display
  const renderStars = (rating, isClickable = false, option = null) => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300'
          } ${isClickable ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={isClickable && option ? () => handleValueChange(option[valueKey]?.toString()) : undefined}
        />
      );
    }
    return stars;
  };

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
          {selectedOption ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(selectedRating)}
              </div>
              {/* <span className="text-sm text-gray-600">({selectedOption[displayKey]})</span> */}
            </div>
          ) : (
            placeholder
          )}
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
            filteredOptions.map((option) => {
              const rating = getRatingNumber(option);
              return (
                <SelectItem
                  key={option[valueKey]}
                  value={option[valueKey]?.toString()}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center gap-1">
                      {renderStars(rating, true, option)}
                    </div>
                    {/* <span>{option[displayKey]}</span> */}
                  </div>
                </SelectItem>
              );
            })
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

export default StarRating;