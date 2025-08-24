import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import FormFields from '@/components/forms/FormFields';
import { Button } from '@/components/ui/button';

const SearchForm = ({ onSearch, isSearching }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    business_name: '',
    mailing_address_1: '',
    mailing_address_2: '',
    city: '',
    state: '',
    home_phone: '',
    business_phone: '',
    cell_phone: '',
    primary_email: '',
    secondary_email: '',
    where_to_contact: '',
    when_to_contact: '',
    ssn: '',
    ein: '',
    gender: '',
    dob: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = Object.entries(formData).filter(([, value]) => value !== '');
    const searchData = Object.fromEntries(filteredData);
    // Ensure payload is at least an empty object if no parameters present
    onSearch(searchData || {});
  };

  const handleReset = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      business_name: '',
      mailing_address_1: '',
      mailing_address_2: '',
      city: '',
      state: '',
      home_phone: '',
      business_phone: '',
      cell_phone: '',
      primary_email: '',
      secondary_email: '',
      where_to_contact: '',
      when_to_contact: '',
      ssn: '',
      ein: '',
      gender: '',
      dob: ''
    });
  };

  const formFields = [
    {
      label: 'First Name',
      name: 'first_name',
      type: 'text'
    },
    {
      label: 'Middle Name',
      name: 'middle_name',
      type: 'text'
    },
    {
      label: 'Last Name',
      name: 'last_name',
      type: 'text'
    },
    {
      label: 'Suffix',
      name: 'suffix',
      type: 'text'
    },
    {
      label: 'Business Name',
      name: 'business_name',
      type: 'text'
    },
    {
      label: 'Mailing Address 1',
      name: 'mailing_address_1',
      type: 'text'
    },
    {
      label: 'Mailing Address 2',
      name: 'mailing_address_2',
      type: 'text'
    },
    {
      label: 'City',
      name: 'city',
      type: 'text'
    },
    {
      label: 'State',
      name: 'state',
      type: 'text'
    },
    {
      label: 'Home Phone',
      name: 'home_phone',
      type: 'text'
    },
    {
      label: 'Business Phone',
      name: 'business_phone',
      type: 'text'
    },
    {
      label: 'Cell Phone',
      name: 'cell_phone',
      type: 'text'
    },
    {
      label: 'Primary Email',
      name: 'primary_email',
      type: 'text'
    },
    {
      label: 'Secondary Email',
      name: 'secondary_email',
      type: 'text'
    },
    {
      label: 'Where to Contact',
      name: 'where_to_contact',
      type: 'text'
    },
    {
      label: 'When to Contact',
      name: 'when_to_contact',
      type: 'text'
    },
    {
      label: 'SSN',
      name: 'ssn',
      type: 'text'
    },
    {
      label: 'EIN',
      name: 'ein',
      type: 'text'
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'text'
    },
    {
      label: 'Date of Birth',
      name: 'dob',
      type: 'date'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="h-full w-full flex flex-col overflow-auto scrollbar-hidden">
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* All Fields */}
        <div className="flex flex-wrap gap-3">
          {formFields.map(({ label, name, type, options }) => (
            <div key={name} className="w-full md:w-[32%]">
              <FormFields
                label={label}
                type={type}
                value={formData[name]}
                onChange={(value) => handleInputChange(name, value)}
                options={options}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons - Always Visible */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <Button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Search size={16} />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSearching}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Clear Form
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm; 