import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialFormData } from './signupData';
import { validateStep } from './signupValidation';
import getFormData from '../helper/getFormData';
import postSignup from '../helper/postSignup';

export const useSignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const data = await getFormData();
        if (data && data.country_codes) {
          setCountryOptions(data.country_codes);
        } else {
          setError('Failed to load country options. Please refresh the page.');
        }
      } catch (error) {
        console.error('Error fetching country options:', error);
        setError(
          'Unable to load form data. Please check your connection and refresh.'
        );
      }
    };

    fetchCountryOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    setError('');
    setInfo('');

    const validationError = validateStep(currentStep, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
      setInfo('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const validationError = validateStep(3, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await postSignup(formData);

      if (
        result.response &&
        (result.response.Apistatus === true || result.response.success === true)
      ) {
        localStorage.setItem('signup_email', formData.email);

        setInfo('Account created successfully! Redirecting...');

        setTimeout(() => {
          navigate(`/verification?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      } else {
        let errorMessage = 'Registration failed. Please try again.';

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
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response?.status === 422) {
        setError('Please check your input data. Some fields may be invalid.');
      } else if (error.response?.status === 409) {
        setError('An account with this email already exists.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
