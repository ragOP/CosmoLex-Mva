import React, { useState, useEffect } from 'react';
import getFormData from '../pages/signup/helper/getFormData';

const DynamicDropdown = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  required = false,
  dataKey, // Key to extract specific data from API response
  className = "",
  id
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const data = await getFormData();
        
        if (data && dataKey) {
          // Extract specific data using the dataKey
          const extractedOptions = data[dataKey] || [];
          setOptions(extractedOptions);
        } else if (data) {
          // If no dataKey provided, use the entire response
          setOptions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching dropdown data:', err);
        setError('Failed to load options');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [dataKey]);

  const baseClassName = `w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB] ${className}`;

  if (loading) {
    return (
      <div>
        {label && (
          <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select className={baseClassName} disabled>
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {label && (
          <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select className={baseClassName} disabled>
          <option>{error}</option>
        </select>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        className={baseClassName}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={option.id || option.value || index} value={option.id || option.value}>
            {option.name || option.code || option.label || option.text || option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicDropdown; 