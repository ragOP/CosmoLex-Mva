// Form field mapper for different case types
// Maps Excel field names to backend keys

import {
  ANSWER_OPTIONS,
  GRID_CONFIG,
  SECTIONS,
  CASE_TYPE_FIELD_MAPPERS,
} from './caseTypeMappers.js';

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

  fields.forEach((field) => {
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
          // Initialize with null (no selection) for better UX
          initialData[field.name] = null;
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
export const getFormDataForSubmission = (
  formData,
  mode = 'add',
  caseType = 'Auto Accident'
) => {
  const submissionData = { ...formData };
  const fields = getFormFields(caseType);

  // Process each field for submission
  Object.keys(submissionData).forEach((key) => {
    const value = submissionData[key];
    const field = fields.find((f) => f.name === key);

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
    if (
      mode === 'add' &&
      (value === '' || value === null || value === undefined)
    ) {
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
