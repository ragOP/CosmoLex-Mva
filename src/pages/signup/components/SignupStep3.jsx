import React from 'react';

const SignupStep3 = ({ formData, handleInputChange }) => (
  <div className="flex flex-col gap-4">
    {/* Password Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
          htmlFor="password"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
      </div>
      <div>
        <label
          className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
          htmlFor="password_confirmation"
        >
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
          placeholder="Confirm your password"
          value={formData.password_confirmation}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-2">Password Requirements:</p>
      <ul className="text-xs text-gray-500 space-y-1">
        <li>• At least 8 characters long</li>
        <li>• Must match confirmation password</li>
      </ul>
    </div>

    {/* Terms and Conditions */}
    <div className="flex items-start gap-3 mt-2">
      <input
        id="terms_accepted"
        name="terms_accepted"
        type="checkbox"
        className="mt-1 h-4 w-4 text-primary-700 focus:ring-primary-700 border-gray-300 rounded"
        checked={formData.terms_accepted}
        onChange={handleInputChange}
      />
      <label htmlFor="terms_accepted" className="text-sm text-gray-dark">
        I accept the{' '}
        <a href="#" className="text-primary-700 hover:underline">
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a href="#" className="text-primary-700 hover:underline">
          Privacy Policy
        </a>
        <span className="text-red-500 ml-1">*</span>
      </label>
    </div>
  </div>
);

export default SignupStep3;
