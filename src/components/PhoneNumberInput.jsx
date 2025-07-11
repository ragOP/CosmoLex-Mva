import React, { useState, useEffect } from 'react';
import { formatIncompletePhoneNumber } from 'libphonenumber-js';
import { codeToCountryMap } from '../utils/countryCodeMapping';

const PhoneNumberInput = ({ 
  value, 
  onChange, 
  countryCodeId,
  countryOptions = [],
  name = "phone_number",
  placeholder = "Enter your phone number",
  className = "",
  id = "phone_number"
}) => {
  const [formattedValue, setFormattedValue] = useState(value || '');

  // Get the country code from the selected country
  const getCountryFromId = (countryCodeId) => {
    if (!countryCodeId || !countryOptions.length) return null;
    
    const countryOption = countryOptions.find(option => option.id == countryCodeId);
    if (!countryOption) return null;

    return codeToCountryMap[countryOption.code] || null;
  };

  useEffect(() => {
    if (value && countryCodeId && countryOptions.length) {
      const country = getCountryFromId(countryCodeId);
      if (country) {
        try {
          // Format the existing value
          const formatted = formatIncompletePhoneNumber(value, country);
          setFormattedValue(formatted);
        } catch {
          setFormattedValue(value);
        }
      } else {
        setFormattedValue(value);
      }
    } else {
      setFormattedValue(value || '');
    }
  }, [value, countryCodeId, countryOptions]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const country = getCountryFromId(countryCodeId);

    if (country) {
      try {
        // Format as user types
        const formatted = formatIncompletePhoneNumber(inputValue, country);
        setFormattedValue(formatted);

        // Create a synthetic event for the parent handler with formatted data
        const syntheticEvent = {
          target: {
            name,
            value: formatted, // Store formatted number
            type: 'tel'
          }
        };
        
        onChange(syntheticEvent);
      } catch {
        // If formatting fails, just use the input as is
        setFormattedValue(inputValue);
        onChange(e);
      }
    } else {
      // No country selected, just pass through
      setFormattedValue(inputValue);
      onChange(e);
    }
  };

  const baseClassName = `w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB] ${className}`;

  return (
    <input
      id={id}
      name={name}
      type="tel"
      className={baseClassName}
      placeholder={placeholder}
      value={formattedValue}
      onChange={handleInputChange}
      autoComplete="tel"
    />
  );
};

export default PhoneNumberInput; 