export const countryOptions = [
  { value: 1, label: 'United States (+1)' },
  { value: 2, label: 'Canada (+1)' },
  { value: 3, label: 'United Kingdom (+44)' },
  { value: 4, label: 'India (+91)' },
  { value: 5, label: 'Australia (+61)' }
];

export const practiceAreaOptions = [
  { value: '', label: 'Select Practice Area' },
  { value: 1, label: 'Personal Injury' },
  { value: 2, label: 'Family Law' },
  { value: 3, label: 'Corporate Law' },
  { value: 4, label: 'Criminal Law' },
  { value: 5, label: 'Real Estate Law' },
  { value: 6, label: 'Immigration Law' },
  { value: 7, label: 'Employment Law' },
  { value: 8, label: 'Other' }
];

export const heardAboutUsOptions = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'A', label: 'Search Engine' },
  { value: 'B', label: 'Social Media' },
  { value: 'C', label: 'Referral' },
  { value: 'D', label: 'Advertisement' },
  { value: 'E', label: 'Other' }
];

export const numberOfUsersOptions = [
  { value: '', label: 'Select number of users' },
  { value: 1, label: '1-5 users' },
  { value: 5, label: '6-10 users' },
  { value: 10, label: '11-25 users' },
  { value: 25, label: '26-50 users' },
  { value: 50, label: '50+ users' }
];

export const stepTitles = {
  1: "Personal Information",
  2: "Firm Details", 
  3: "Account Security"
};

export const stepDescriptions = {
  1: "Let's start with your basic information",
  2: "Tell us about your firm",
  3: "Secure your account"
};

export const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  country_code_id: 1,
  phone_number: '',
  firm_name: '',
  number_of_users: '',
  practice_area_id: '',
  password: '',
  password_confirmation: '',
  heard_about_us: '',
  terms_accepted: false
}; 