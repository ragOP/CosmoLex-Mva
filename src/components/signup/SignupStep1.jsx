import React from 'react';
import { countryOptions } from './signupData';

const SignupStep1 = ({ formData, handleInputChange }) => (
  <div className="flex flex-col gap-4">
    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="first_name">
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
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="last_name">
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
      <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="email">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="country_code_id">
          Country Code
        </label>
        <select
          id="country_code_id"
          name="country_code_id"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          value={formData.country_code_id}
          onChange={handleInputChange}
        >
          {countryOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="phone_number">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          placeholder="Enter your phone number"
          value={formData.phone_number}
          onChange={handleInputChange}
          autoComplete="tel"
        />
      </div>
    </div>
  </div>
);

export default SignupStep1; 