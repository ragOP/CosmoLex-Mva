import React from 'react';
import { numberOfUsersOptions, practiceAreaOptions, heardAboutUsOptions } from './signupData';

const SignupStep2 = ({ formData, handleInputChange }) => (
  <div className="flex flex-col gap-4">
    {/* Firm Information */}
    <div>
      <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="firm_name">
        Firm Name <span className="text-red-500">*</span>
      </label>
      <input
        id="firm_name"
        name="firm_name"
        type="text"
        className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
        placeholder="Enter your firm name"
        value={formData.firm_name}
        onChange={handleInputChange}
        autoComplete="organization"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="number_of_users">
          Number of Users
        </label>
        <select
          id="number_of_users"
          name="number_of_users"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          value={formData.number_of_users}
          onChange={handleInputChange}
        >
          {numberOfUsersOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="practice_area_id">
          Practice Area
        </label>
        <select
          id="practice_area_id"
          name="practice_area_id"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          value={formData.practice_area_id}
          onChange={handleInputChange}
        >
          {practiceAreaOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]" htmlFor="heard_about_us">
        How did you hear about us?
      </label>
      <select
        id="heard_about_us"
        name="heard_about_us"
        className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
        value={formData.heard_about_us}
        onChange={handleInputChange}
      >
        {heardAboutUsOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  </div>
);

export default SignupStep2; 