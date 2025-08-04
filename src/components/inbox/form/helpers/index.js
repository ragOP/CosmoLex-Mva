// Form field mapper for different case types
// Maps Excel field names to backend keys

// Common answer options with label and value structure
const ANSWER_OPTIONS = {
  YES_NO: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
  DRIVER_PASSENGER: [
    { label: 'Driver', value: 'Driver' },
    { label: 'Passenger', value: 'Passenger' },
  ],
  EMPLOYMENT_STATUS: [
    { label: 'Employed', value: 'Employed' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Self-employed', value: 'Self-employed' },
  ],
  MARITAL_STATUS: [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ],
  EDUCATION_LEVEL: [
    { label: 'High School', value: 'High School' },
    { label: 'College', value: 'College' },
    { label: 'Graduate School', value: 'Graduate School' },
    { label: 'Other', value: 'Other' },
  ],
  EMPLOYMENT_TYPE: [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Temporary', value: 'Temporary' },
  ],
  SALARY_TYPE: [
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Commission', value: 'Commission' },
    { label: 'Other', value: 'Other' },
  ],
};

// Grid configuration for field sizing (MUI Grid v2 system)
const GRID_CONFIG = {
  FULL_WIDTH: { size: { xs: 12 } }, // Full width (12 columns)
  HALF_WIDTH: { size: { xs: 12, sm: 6 } }, // Half width (6 columns on small+)
  QUARTER_WIDTH: { size: { xs: 12, sm: 6, md: 4 } }, // Minimum 6 columns (2 per row)
  THIRD_WIDTH: { size: { xs: 12, sm: 6, md: 4 } }, // Minimum 6 columns (2 per row)
};

// Debug grid configuration
console.log('GRID_CONFIG:', GRID_CONFIG);
console.log('QUARTER_WIDTH:', GRID_CONFIG.QUARTER_WIDTH);
console.log('HALF_WIDTH:', GRID_CONFIG.HALF_WIDTH);

// Section configuration
const SECTIONS = {
  PERSONAL_INFO: 'Personal Information',
  ACCIDENT_INFO: 'Accident Information',
  VEHICLE_INFO: 'Vehicle Information',
  INSURANCE_INFO: 'Insurance Information',
  INJURY_INFO: 'Injuries and Medical Treatment',
  WAGES_INFO: 'Lost Wages',
  REPRESENTATION_INFO: 'Representation',
};

const CASE_TYPE_FIELD_MAPPERS = {
  // Auto Accident
  'Auto Accident': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Accident Information Section
    [SECTIONS.ACCIDENT_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'When did the accident occur?': {
      key: 'accident_date',
      type: 'date',
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Where did the accident occur?': {
      key: 'accident_location',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
   
    'How did the accident occur?': {
      key: 'accident_details',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'What was your role (driver or passenger) when the incident occurred?': {
      key: 'incident_role',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.DRIVER_PASSENGER,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Who was at fault?': {
      key: 'fault_party',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Did the police respond to the scene?': {
      key: 'police_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Did the paramedics respond to the scene?': {
      key: 'paramedics_responded',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Do you have photos of the accident?': {
      key: 'has_accident_photos',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Were there witnesses?': {
      key: 'has_witnesses',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },
    'Have you spoken to anyone regarding the accident?': {
      key: 'discussed_accident',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.ACCIDENT_INFO,
    },

    // Vehicle Information Section
    [SECTIONS.VEHICLE_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'What is the make/model of your vehicle?': {
      key: 'vehicle_make_model',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'How much damage was done to your vehicle?': {
      key: 'vehicle_damage',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'What is the make/model of the other driver/At-fault vehicle?': {
      key: 'other_vehicle_make_model',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },
    'How much damage was done to the other driver/At-fault vehicle?': {
      key: 'other_vehicle_damage',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.VEHICLE_INFO,
    },

    // Insurance Information Section
    [SECTIONS.INSURANCE_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Do you have auto insurance?': {
      key: 'has_auto_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'What are your limits?': {
      key: 'insurance_limits',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Who is your auto insurance carrier?': {
      key: 'insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Do you have uninsured or underinsured motorist coverage (UM)?': {
      key: 'has_um_coverage',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Do you have health insurance?': {
      key: 'has_health_insurance',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },
    'Who is your health insurance carrier?': {
      key: 'health_insurance_carrier',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.INSURANCE_INFO,
    },

    // Injuries and Medical Treatment Section
    [SECTIONS.INJURY_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Describe your injuries': {
      key: 'injury_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: SECTIONS.INJURY_INFO,
    },
    'Have you received any treatment for your injuries?': {
      key: 'received_treatment',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.INJURY_INFO,
    },
    'Have you ever been involved in accident before where you suffered similar injuries?':
      {
        key: 'prior_similar_injury',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.HALF_WIDTH,
        section: SECTIONS.INJURY_INFO,
      },

    // Lost Wages Section
    [SECTIONS.WAGES_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Are you currently employed?': {
      key: 'currently_employed',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.WAGES_INFO,
    },
    'Have you incurred lost wages?': {
      key: 'lost_wages',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.WAGES_INFO,
    },

    // Representation Section
    [SECTIONS.REPRESENTATION_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'Have you spoken to another attorney about this case?': {
      key: 'consulted_another_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.REPRESENTATION_INFO,
    },
    'Has another attorney turned your case down?': {
      key: 'case_rejected_by_attorney',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: SECTIONS.REPRESENTATION_INFO,
    },
  },

  // Bankruptcy
  Bankruptcy: {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Case Information Section
    'Case Information': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Case Number': {
      key: 'case_number',
      type: 'text',
      maxLength: 100,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Confirmation Hearing Date': {
      key: 'hearing_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    "Judge's Name": {
      key: 'judge_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    "Judge's Room Number": {
      key: 'judge_room',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Case Information',
    },
    'Repayment Amount': {
      key: 'repayment_amount',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: 'Case Information',
    },
    'Meeting Date': {
      key: 'meeting_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
    'Meeting Time': {
      key: 'meeting_time',
      type: 'time',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Case Information',
    },
  },

  // Criminal Defense Law
  'Criminal Defense Law': {
    // Personal Information Section
    [SECTIONS.PERSONAL_INFO]: {
      type: 'section',
      gridSize: GRID_CONFIG.FULL_WIDTH,
    },
    'First Name': {
      key: 'first_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Middle Name': {
      key: 'middle_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'Last Name': {
      key: 'last_name',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },
    'What is the best cell phone number to reach you at?': {
      key: 'contact_phone',
      type: 'text',
      maxLength: 50,
      gridSize: GRID_CONFIG.QUARTER_WIDTH,
      section: SECTIONS.PERSONAL_INFO,
    },

    // Incident Details Section
    'Incident Details': { type: 'section', gridSize: GRID_CONFIG.FULL_WIDTH },
    'Date of Arrest': {
      key: 'arrest_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Which police department made the arrest?': {
      key: 'arrest_department',
      type: 'text',
      maxLength: 255,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Do you have a court date scheduled?': {
      key: 'court_date_scheduled',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'When is your court date?': {
      key: 'court_date',
      type: 'date',
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Do you already have an attorney or have you previously hired an attorney?':
      {
        key: 'has_or_had_attorney',
        type: 'dropdown',
        answerOptions: ANSWER_OPTIONS.YES_NO,
        gridSize: GRID_CONFIG.HALF_WIDTH,
        section: 'Incident Details',
      },
    'Do you have any prior convictions?': {
      key: 'prior_convictions',
      type: 'dropdown',
      answerOptions: ANSWER_OPTIONS.YES_NO,
      gridSize: GRID_CONFIG.HALF_WIDTH,
      section: 'Incident Details',
    },
    'Describe what happened:': {
      key: 'incident_description',
      type: 'textarea',
      gridSize: GRID_CONFIG.FULL_WIDTH,
      section: 'Incident Details',
    },
  },
};

/**
 * Get form fields based on case type
 * @param {string} caseType - The case type (e.g., 'Auto Accident', 'Bankruptcy', etc.)
 * @returns {Array} Array of form field configurations
 */
export const getFormFields = (caseType) => {
  const fieldMapper = CASE_TYPE_FIELD_MAPPERS[caseType];

  if (!fieldMapper) {
    console.warn(`No field mapper found for case type: ${caseType}`);
    return [];
  }

  const fields = Object.entries(fieldMapper)
    .filter(([, config]) => config.type !== 'section') // Filter out section entries
    .map(([excelField, config]) => {
      const field = {
        label: excelField,
        name: config.key,
        type: config.type,
        maxLength: config.maxLength,
        options: config.answerOptions || config.options || [],
        required: config.required || false,
        gridSize: config.gridSize || GRID_CONFIG.FULL_WIDTH, // Default to full width if not specified
        section: config.section, // Add section to the config
        ...config,
      };

      return field;
    });

  return fields;
};

/**
 * Get all available case types
 * @returns {Array} Array of case type names
 */
export const getAvailableCaseTypes = () => {
  return Object.keys(CASE_TYPE_FIELD_MAPPERS);
};

/**
 * Get field configuration by case type and field name
 * @param {string} caseType - The case type
 * @param {string} fieldName - The Excel field name
 * @returns {Object|null} Field configuration or null if not found
 */
export const getFieldConfig = (caseType, fieldName) => {
  const fieldMapper = CASE_TYPE_FIELD_MAPPERS[caseType];
  return fieldMapper ? fieldMapper[fieldName] : null;
};

/**
 * Convert Excel field name to backend key
 * @param {string} caseType - The case type
 * @param {string} excelFieldName - The Excel field name
 * @returns {string|null} Backend key or null if not found
 */
export const getBackendKey = (caseType, excelFieldName) => {
  const fieldConfig = getFieldConfig(caseType, excelFieldName);
  return fieldConfig ? fieldConfig.key : null;
};

/**
 * Convert backend key to Excel field name
 * @param {string} caseType - The case type
 * @param {string} backendKey - The backend key
 * @returns {string|null} Excel field name or null if not found
 */
export const getExcelFieldName = (caseType, backendKey) => {
  const fieldMapper = CASE_TYPE_FIELD_MAPPERS[caseType];
  if (!fieldMapper) return null;

  const entry = Object.entries(fieldMapper).find(
    ([, config]) => config.key === backendKey
  );
  return entry ? entry[0] : null;
};

/**
 * Get initial form data based on case type and matter data
 * @param {string} caseType - The case type
 * @param {object} matter - Matter data (for edit mode)
 * @param {string} mode - 'add' or 'edit'
 * @returns {object} Initial form data object
 */
export const getInitialFormData = (caseType, matter = null, mode = 'add') => {
  const fields = getFormFields(caseType);
  const initialData = {};

  fields.forEach(field => {
    // For edit mode, use existing matter data if available
    if (mode === 'edit' && matter && matter[field.name]) {
      // Handle date fields - keep in API format (YYYY-MM-DD) for storage
      if (field.type === 'date') {
        const dateValue = matter[field.name];
        if (dateValue) {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            initialData[field.name] = date.toISOString().split('T')[0];
          } else {
            initialData[field.name] = '';
          }
        } else {
          initialData[field.name] = '';
        }
      } else {
        initialData[field.name] = matter[field.name];
      }
    } 
    // For add mode, use matter data if available, otherwise use defaults
    else if (mode === 'add' && matter && matter[field.name]) {
      // Handle date fields - keep in API format (YYYY-MM-DD) for storage
      if (field.type === 'date') {
        const dateValue = matter[field.name];
        if (dateValue) {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            initialData[field.name] = date.toISOString().split('T')[0];
          } else {
            initialData[field.name] = '';
          }
        } else {
          initialData[field.name] = '';
        }
      } else {
        initialData[field.name] = matter[field.name];
      }
    }
    // Initialize with default values based on field type
    else {
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'tel':
        case 'url':
          initialData[field.name] = '';
          break;
        case 'number':
          initialData[field.name] = null;
          break;
        case 'date':
        case 'time':
        case 'datetime':
          initialData[field.name] = '';
          break;
        case 'dropdown':
        case 'radio':
          // Use first option value if available, otherwise empty string
          initialData[field.name] = field.options && field.options.length > 0 ? field.options[0].value : '';
          break;
        case 'checkbox':
          initialData[field.name] = false;
          break;
        default:
          initialData[field.name] = '';
      }
    }
  });

  return initialData;
};

/**
 * Get form data for submission (filters out empty values if needed)
 * @param {object} formData - Current form data
 * @param {string} mode - 'add' or 'edit'
 * @param {string} caseType - The case type to get field configurations
 * @returns {object} Formatted data for submission
 */
export const getFormDataForSubmission = (formData, mode = 'add', caseType = 'Auto Accident') => {
  const submissionData = { ...formData };
  const fields = getFormFields(caseType);
  
  // Process each field for submission
  Object.keys(submissionData).forEach(key => {
    const value = submissionData[key];
    const field = fields.find(f => f.name === key);
    
    // Handle date field formatting for API
    if (field && field.type === 'date' && value) {
      if (value instanceof Date) {
        // Convert Date object to YYYY-MM-DD format
        submissionData[key] = value.toISOString().split('T')[0];
      } else if (typeof value === 'string') {
        // Ensure string dates are in correct format
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          submissionData[key] = date.toISOString().split('T')[0];
        }
      }
    }
    
    // Handle time field formatting for API (H:i:s format)
    if (field && field.type === 'time' && value) {
      if (value instanceof Date) {
        // Convert Date object to H:i:s format
        const hours = value.getHours().toString().padStart(2, '0');
        const minutes = value.getMinutes().toString().padStart(2, '0');
        const seconds = value.getSeconds().toString().padStart(2, '0');
        submissionData[key] = `${hours}:${minutes}:${seconds}`;
      } else if (typeof value === 'string') {
        // Handle string time values
        if (value.includes(':')) {
          // If it's already in time format, ensure it has seconds
          const timeParts = value.split(':');
          if (timeParts.length === 2) {
            // Add seconds if missing
            submissionData[key] = `${value}:00`;
          } else if (timeParts.length === 3) {
            // Already has seconds, use as is
            submissionData[key] = value;
          }
        } else {
          // Try to parse as Date and convert
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            submissionData[key] = `${hours}:${minutes}:${seconds}`;
          }
        }
      }
    }
    
    // Handle datetime field formatting for API
    if (field && field.type === 'datetime' && value) {
      if (value instanceof Date) {
        // Convert Date object to YYYY-MM-DD H:i:s format
        const dateStr = value.toISOString().split('T')[0];
        const hours = value.getHours().toString().padStart(2, '0');
        const minutes = value.getMinutes().toString().padStart(2, '0');
        const seconds = value.getSeconds().toString().padStart(2, '0');
        submissionData[key] = `${dateStr} ${hours}:${minutes}:${seconds}`;
      } else if (typeof value === 'string') {
        // Ensure string datetimes are in correct format
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          submissionData[key] = `${dateStr} ${hours}:${minutes}:${seconds}`;
        }
      }
    }
    
    // For add mode, filter out empty values
    if (mode === 'add' && (value === '' || value === null || value === undefined)) {
      delete submissionData[key];
    }
  });
  
  return submissionData;
};

export default {
  getFormFields,
  getAvailableCaseTypes,
  getFieldConfig,
  getBackendKey,
  getExcelFieldName,
  CASE_TYPE_FIELD_MAPPERS,
};
