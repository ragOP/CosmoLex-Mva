import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CustomDropdown = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  className = "",
  items = [],
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [position, setPosition] = useState('below'); // 'above' or 'below'
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const triggerRef = useRef(null);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (item) => {
    onValueChange(item.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleToggle = () => {
    if (disabled) return;
    
    if (!isOpen) {
      // Determine position when opening
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If there's more space above, position above the field
        if (spaceAbove > spaceBelow && spaceAbove > 240) {
          setPosition('above');
        } else {
          setPosition('below');
        }
      }
      
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
    
    setIsOpen(!isOpen);
  };

  const selectedItem = items.find(item => item.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-full justify-between h-10 px-3 py-2 text-sm"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedItem ? "text-foreground" : "text-muted-foreground"}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={`fixed z-[99999] bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden ${
          position === 'above' 
            ? 'bottom-auto' 
            : 'top-auto'
        }`}
        style={{
          width: triggerRef.current?.offsetWidth || 'auto',
          left: triggerRef.current ? triggerRef.current.getBoundingClientRect().left : 0,
          [position === 'above' ? 'bottom' : 'top']: triggerRef.current 
            ? position === 'above' 
              ? window.innerHeight - triggerRef.current.getBoundingClientRect().top + 8
              : triggerRef.current.getBoundingClientRect().bottom + 8
            : 0
        }}>
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="pl-6 h-8 text-sm border-0 focus:ring-0 focus:border-0 bg-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={item.value}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  } ${item.value === value ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {item.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 