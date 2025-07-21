import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Key, Shield } from 'lucide-react';
import CustomButton from '@/components/CustomButton';
import { Alert } from '@/components/ui/alert';
import { isMobile } from '@/utils/isMobile';
import postResetPassword from './helper/postResetPassword';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    otp_code: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Redirect to forgot password if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.otp_code) {
      return 'Please enter the verification code';
    }
    if (formData.otp_code.length !== 6) {
      return 'Verification code must be 6 digits';
    }
    if (!formData.password) {
      return 'Please enter a new password';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    // Password complexity validation
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      return passwordValidation;
    }

    if (!formData.password_confirmation) {
      return 'Please confirm your password';
    }
    if (formData.password !== formData.password_confirmation) {
      return 'Passwords do not match';
    }
    return null;
  };

  const validatePassword = (password) => {
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>)';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email,
        otp_code: parseInt(formData.otp_code),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const result = await postResetPassword(payload);

      if (
        result.response &&
        (result.response.Apistatus === true || result.response.success === true)
      ) {
        setInfo('Password reset successfully! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        let errorMessage = 'Failed to reset password. Please try again.';

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
      console.error('Reset password error:', error);

      if (error.response?.status === 400) {
        setError(
          'Invalid verification code or expired link. Please try again.'
        );
      } else if (error.response?.status === 404) {
        setError('Reset link not found or expired. Please request a new one.');
      } else if (error.response?.status === 422) {
        setError('Invalid input data. Please check all fields and try again.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(
          'An error occurred while resetting your password. Please try again.'
        );
      }
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      otp_code: value,
    }));
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
          <h1 className="font-semibold text-[30px] leading-[40px] text-gray-dark tracking-[-0.01rem] text-center w-full">
            Reset Password
          </h1>
          <p className="font-normal text-[16px] leading-[22px] tracking-[-0.01em] text-[#475569] text-center">
            Enter the verification code sent to <strong>{email}</strong> and
            create a new password
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
              htmlFor="otp_code"
            >
              Verification Code
            </label>
            <input
              id="otp_code"
              name="otp_code"
              type="text"
              inputMode="numeric"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB] text-center tracking-widest text-lg"
              placeholder="000000"
              value={formData.otp_code}
              onChange={handleOtpChange}
              maxLength={6}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              className="block text-base font-medium text-gray-dark mb-1 tracking-[-0.01em]"
              htmlFor="password_confirmation"
            >
              Confirm New Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              className="w-full px-5 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-700 text-base placeholder:text-gray-400 font-normal transition-all duration-150 hover:bg-gray-lightHover hover:ring-1 hover:ring-[#4648AB]"
              placeholder="Confirm new password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          <CustomButton
            type="submit"
            className="mt-2"
            icon={Shield}
            iconPosition="right"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
