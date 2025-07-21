import React from 'react';
import DynamicDropdown from '../../../components/DynamicDropdown';
import PhoneNumberInput from '../../../components/PhoneNumberInput';

const SignupStep1 = ({ formData, handleInputChange, countryOptions }) => (
  <div className="flex flex-col gap-4">
    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
          htmlFor="first_name"
        >
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          placeholder="Enter your first name"
          value={formData.first_name}
          onChange={handleInputChange}
          autoComplete="given-name"
        />
      </div>
      <div>
        <label
          className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
          htmlFor="last_name"
        >
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          placeholder="Enter your last name"
          value={formData.last_name}
          onChange={handleInputChange}
          autoComplete="family-name"
        />
      </div>
    </div>

    <div>
      <label
        className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
        htmlFor="email"
      >
        Email <span className="text-red-500">*</span>
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        autoComplete="email"
      />
    </div>

    {/* Phone Information */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-1">
        <DynamicDropdown
          id="country_code_id"
          name="country_code_id"
          label="Country Code"
          value={formData.country_code_id}
          onChange={handleInputChange}
          dataKey="country_codes"
        />
      </div>
      <div className="md:col-span-4">
        <label
          className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
          htmlFor="phone_number"
        >
          Phone Number <span className="text-red-500">*</span>
        </label>
        <PhoneNumberInput
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          countryCodeId={formData.country_code_id}
          countryOptions={countryOptions}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  </div>
);

export default SignupStep1;
