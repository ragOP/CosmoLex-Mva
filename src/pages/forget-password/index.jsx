import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Mail } from 'lucide-react';
import CustomButton from '@/components/CustomButton';
import { Alert } from '@/components/ui/alert';
import { isMobile } from '@/utils/isMobile';
import postForgotPassword from './helper/postForgotPassword';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear messages after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (info && !info.includes('Redirecting')) {
      const timer = setTimeout(() => setInfo(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [info]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await postForgotPassword({ email });

      if (
        result.response &&
        (result.response.Apistatus === true || result.response.success === true)
      ) {
        setInfo('Password reset link sent successfully! Redirecting...');

        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        let errorMessage =
          'Failed to send password reset link. Please try again.';

        if (result.response?.errors) {
          const errors = result.response.errors;
          if (typeof errors === 'object') {
            const errorMessages = Object.values(errors).flat();
            errorMessage = errorMessages.join('. ');
          } else {
            errorMessage = errors;
          }
        } else if (result.response?.message) {
          errorMessage = result.response.message;
        } else if (result.response?.data?.message) {
          errorMessage = result.response.data.message;
        } else if (result.response?.data?.errors) {
          const errors = result.response.data.errors;
          if (typeof errors === 'object') {
            errorMessage = Object.values(errors).flat().join('. ');
          } else {
            errorMessage = errors;
          }
        }

        setError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Forgot password error:', error);

      if (error.response?.status === 404) {
        setError(
          'Email not found. Please check your email address or sign up for an account.'
        );
      } else if (error.response?.status === 429) {
        setError(
          'Too many requests. Please wait a few minutes before trying again.'
        );
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(
          'An error occurred while sending the reset link. Please try again.'
        );
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
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

      {/* Back to Login Link */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-dark">
          Remember your password?
        </span>
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: '#25282D' }}
        >
          Back to Login
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Alert/Info */}
      {(error || info) && (
        <div className="absolute top-24 md:top-20 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
          <div className="flex flex-col items-center">
            {error && (
              <Alert
                severity="error"
                className="w-fit rounded-xl md:rounded-sm max-w-md"
              >
                {error}
              </Alert>
            )}
            {info && (
              <Alert
                color="success"
                className="w-fit rounded-xl md:rounded-sm px-8 max-w-md"
              >
                {info}
              </Alert>
            )}
          </div>
        </div>
      )}

      <div
        className="w-full max-w-md rounded-2xl p-10 flex flex-col items-center border border-gray-100 shadow-none md:shadow"
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
        <div className="flex flex-col items-start w-full mb-7">
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem]">
            Forgot Password
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569]">
            Enter your email address and we'll send you a code to reset your
            password
          </p>
        </div>

        <form
          className="w-full flex flex-col gap-6"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <label
              className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <CustomButton
            type="submit"
            className="mt-2"
            icon={ChevronRight}
            iconPosition="right"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Reset Code...' : 'Send Reset Code'}
          </CustomButton>

          <div className="flex items-center justify-center">
            <Link
              to="/login"
              className="text-sm text-[#475569] hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
