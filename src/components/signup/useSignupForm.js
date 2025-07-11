import { useState } from 'react';
import { initialFormData } from './signupData';
import { validateStep } from './signupValidation';

export const useSignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    
    const validationError = validateStep(3, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    console.log(formData, "formData");

    setTimeout(() => {
      setInfo('Account created! Please log in.');
    }, 800);
  };

  return {
    currentStep,
    formData,
    error,
    info,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit
  };
}; 