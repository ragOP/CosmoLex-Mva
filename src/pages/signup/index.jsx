import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CustomButton from '../../components/CustomButton';
import { Alert } from '../../components/ui/alert';
import { isMobile } from '@/utils/isMobile';
import {
  useSignupForm,
  stepTitles,
  stepDescriptions,
  SignupStep1,
  SignupStep2,
  SignupStep3,
} from './components/index';

const SignupPage = () => {
  const {
    currentStep,
    formData,
    error,
    info,
    countryOptions,
    isSubmitting,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useSignupForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignupStep1
            formData={formData}
            handleInputChange={handleInputChange}
            countryOptions={countryOptions}
          />
        );
      case 2:
        return (
          <SignupStep2
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <SignupStep3
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return (
          <SignupStep1
            formData={formData}
            handleInputChange={handleInputChange}
            countryOptions={countryOptions}
          />
        );
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-8"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`,
      }}
    >
      {/* Brand Logo */}
      <div className="absolute top-6 left-8">
        <img
          src="/brand-logo.png"
          alt="Brand Logo"
          className="h-8 w-8 md:h-10 md:w-10 drop-shadow"
        />
      </div>
      {/* Login Link */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-dark">
          Already have an account?
        </span>
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: '#25282D' }}
        >
          Log In
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
      {/* Alert/Info */}
      {(error || info) && (
        <div className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert
                color="error"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {error}
              </Alert>
            )}
            {info && (
              <Alert
                color="success"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {info}
              </Alert>
            )}
          </div>
        </div>
      )}
      {/* Card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-10 flex flex-col items-center border border-gray-100 shadow-none md:shadow mx-4"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0) -9.58%, rgba(255,255,255,0.052) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: isMobile()
            ? 'none'
            : [
                '0px 10px 10px 0px #0000001A',
                '0px 4px 4px 0px #0000000D',
                '0px 1px 0px 0px #0000000D',
                '0px 20px 50px 0px #FFFFFF26 inset',
              ].join(', '),
        }}
      >
        {/* Step Header */}
        <div className="flex flex-col items-start w-full mb-7">
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem]">
            {stepTitles[currentStep]}
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569]">
            {stepDescriptions[currentStep]}
          </p>
          <p className="text-sm text-gray-400 mt-1">Step {currentStep} of 3</p>
        </div>

        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          {/* Current Step Content */}
          <div className="mb-8">{renderCurrentStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            {currentStep > 1 ? (
              <CustomButton
                type="button"
                onClick={handlePrevious}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                icon={ChevronLeft}
                iconPosition="left"
              >
                Previous
              </CustomButton>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <CustomButton
                type="button"
                onClick={handleNext}
                icon={ChevronRight}
                iconPosition="right"
              >
                Next
              </CustomButton>
            ) : (
              <CustomButton
                type="submit"
                disabled={isSubmitting}
                icon={ChevronRight}
                iconPosition="right"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </CustomButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
