export const validateStep = (step, formData) => {
  switch (step) {
    case 1: {
      const step1Fields = ['first_name', 'last_name', 'email', 'phone_number'];
      const missingStep1 = step1Fields.filter(field => !formData[field]);
      if (missingStep1.length > 0) {
        return 'Please fill in all required fields in this step';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return 'Please enter a valid email address';
      }
      break;
    }
    
    case 2: {
      if (!formData.firm_name) {
        return 'Please enter your firm name';
      }
      break;
    }
    
    case 3: {
      if (!formData.password || !formData.password_confirmation) {
        return 'Please enter both password fields';
      }
      if (formData.password !== formData.password_confirmation) {
        return 'Passwords do not match';
      }
      if (formData.password.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!formData.terms_accepted) {
        return 'Please accept the terms and conditions';
      }
      break;
    }
    
    default:
      return null;
  }
  return null;
}; 