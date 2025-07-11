import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialFormData } from './signupData';
import { validateStep } from './signupValidation';
import getFormData from '../helper/getFormData';
import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const useSignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch country options on mount
  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const data = await getFormData();
        if (data && data.country_codes) {
          setCountryOptions(data.country_codes);
        }
      } catch (error) {
        console.error('Error fetching country options:', error);
      }
    };

    fetchCountryOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      const result = await apiService({
        endpoint: endpoints.firmRegister,
        method: 'POST',
        data: formData
      });

      if (result.response) {
        // Store email for verification page
        localStorage.setItem('signup_email', formData.email);
        
        // Navigate to verification page
        navigate(`/verification?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(result.error?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
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
    handleSubmit
  };
}; 