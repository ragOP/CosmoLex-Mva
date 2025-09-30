/**
 * User Verification Page
 *
 * This page handles email verification for newly registered users.
 * It's accessed via email links sent after user registration.
 *
 * URL Parameters:
 * - token: Verification token from email link
 * - email: User's email address
 * - user_id: Optional user ID parameter
 *
 * Features:
 * - Automatic verification on page load
 * - Success/error state handling
 * - Resend verification link functionality
 * - Cooldown timer for resend requests
 * - Responsive design matching app theme
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Mail,
  RefreshCw,
  ArrowRight,
  Home,
} from 'lucide-react';
import CustomButton from '../../components/CustomButton';
import { Alert } from '../../components/ui/alert';
import { isMobile } from '@/utils/isMobile';
import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const UserVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Get verification parameters from URL
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const userId = searchParams.get('user_id');

  useEffect(() => {
    if (token && email) {
      handleVerification();
    } else {
      setVerificationStatus('error');
      setError(
        'Invalid verification link. Please check your email and try again.'
      );
      setIsVerifying(false);
    }
  }, [token, email]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    let interval;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleVerification = async () => {
    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService({
        endpoint: endpoints.verifyOtp, // Assuming this endpoint handles email verification
        method: 'POST',
        data: {
          token,
          email,
          user_id: userId,
          type: 'email_verification',
        },
      });

      if (
        response.response?.Apistatus === true ||
        response.response?.success === true
      ) {
        setVerificationStatus('success');
        setMessage(
          'Your email has been verified successfully! You can now log in to your account.'
        );

        // Clear any stored signup data
        localStorage.removeItem('signup_email');
        localStorage.removeItem('signup_data');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        let errorMessage = 'Verification failed. Please try again.';

        if (response.response?.message) {
          errorMessage = response.response.message;
        } else if (response.response?.data?.message) {
          errorMessage = response.response.data.message;
        }

        setError(errorMessage);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');

      if (error.response?.status === 400) {
        setError(
          'Invalid or expired verification link. Please request a new one.'
        );
      } else if (error.response?.status === 404) {
        setError('User not found. Please check your email address.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An error occurred during verification. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email not found. Please try signing up again.');
      return;
    }

    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService({
        endpoint: endpoints.resendUserVerification,
        method: 'POST',
        data: { email },
      });

      if (
        response.response?.Apistatus === true ||
        response.response?.success === true
      ) {
        setMessage(
          'New verification link sent! Please check your email and spam folder.'
        );
        setCooldownTime(120); // 2 minutes cooldown
      } else {
        let errorMessage =
          'Failed to resend verification link. Please try again.';

        if (response.response?.message) {
          errorMessage = response.response.message;
        } else if (response.response?.data?.message) {
          errorMessage = response.response.data.message;
        }

        setError(errorMessage);
        setCooldownTime(120);
      }
    } catch (error) {
      console.error('Resend verification error:', error);

      if (error.response?.status === 404) {
        setError(
          'Email not found. Please check your email address or sign up again.'
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
          'An error occurred while resending the verification link. Please try again.'
        );
      }
      setCooldownTime(120);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (isVerifying) {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem] mb-4">
            Verifying Your Email
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569]">
            Please wait while we verify your email address...
          </p>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem] mb-4">
            Email Verified Successfully!
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569] mb-6">
            Congratulations! Your email address has been verified. You can now
            access all features of your account.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            <CustomButton
              onClick={() => navigate('/login')}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Go to Login
            </CustomButton>
            <p className="text-sm text-gray-500">
              You will be redirected automatically in a few seconds...
            </p>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem] mb-4">
            Verification Failed
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569] mb-6">
            We couldn't verify your email address. This could be due to an
            expired or invalid link.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            {email && (
              <CustomButton
                onClick={handleResendVerification}
                disabled={isResending || cooldownTime > 0}
                className={`bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 ${
                  isResending ? 'animate-pulse' : ''
                }`}
                icon={isResending ? RefreshCw : Mail}
                iconPosition="left"
              >
                {isResending
                  ? 'Sending...'
                  : cooldownTime > 0
                  ? `Resend in ${cooldownTime}s`
                  : 'Resend Verification Link'}
              </CustomButton>
            )}
            <CustomButton
              onClick={() => navigate('/signup')}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Sign Up Again
            </CustomButton>
            <Link to="/login">
              <CustomButton
                type="button"
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                icon={Home}
                iconPosition="left"
              >
                Back to Login
              </CustomButton>
            </Link>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-8"
      style={{
        background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),
radial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`,
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
        <span className="text-xs md:text-sm text-gray-dark">Back to</span>
        <Link
          to="/login"
          className="px-3 py-1 bg-white/80 rounded shadow text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1 hover:bg-white border border-gray-200"
          style={{ color: '#25282D' }}
        >
          <Home className="w-4 h-4" />
          Login
        </Link>
      </div>

      {/* Alert/Info Messages */}
      {(error || message) && (
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
            {message && (
              <Alert
                color="success"
                className="w-fit rounded-xl md:rounded-2xl max-w-md"
              >
                {message}
              </Alert>
            )}
          </div>
        </div>
      )}

      {/* Main Card */}
      <div
        className="w-full max-w-md rounded-2xl p-10 flex flex-col items-center border border-gray-100 shadow-none md:shadow mx-4"
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
        {renderContent()}

        {/* Additional Help Text */}
        {verificationStatus === 'error' && (
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Can't find the verification email? Check your spam folder or
              contact support if you continue to have issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerifyPage;
