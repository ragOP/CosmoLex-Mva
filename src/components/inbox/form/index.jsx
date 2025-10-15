import FormFields from '@/components/forms/FormFields';
import {
  getFormFields,
  getInitialFormData,
  getFormDataForSubmission,
} from './helpers';
import { Button } from '@/components/ui/button';

import { Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMatter } from '../MatterContext';
import { updateForm } from './helpers/updateForm';
import { createForm } from './helpers/createForm';
import { getForm } from './helpers/getForm';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import BreadCrumb from '@/components/BreadCrumb';
import { Loader2 } from 'lucide-react';

const Form = () => {
  // Get matter from context
  const { matter } = useMatter();

  const searchParams = new URLSearchParams(window.location.search);
  const slugId = searchParams.get('slugId');

  // Get case type from matter with proper default
  const caseType = matter?.case_type || 'Auto Accident';

  // Mode state that depends on API response, not slugId
  const [mode, setMode] = useState('add');

  // Get form fields based on case type
  const formFields = getFormFields(caseType);

  // Form state
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch form data using TanStack Query
  const {
    data: formResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['form', slugId],
    queryFn: () => getForm({ slugId }),
    enabled: !!slugId, // Only fetch if slugId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Date format conversion functions
  const formatDateForAPI = (dateValue) => {
    if (!dateValue) return '';
    // Convert Date object or string to YYYY-MM-DD format
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateForForm = (dateValue) => {
    if (!dateValue) return '';
    // Convert date string to YYYY-MM-DD format for HTML date input
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const formatTimeForForm = (timeValue) => {
    if (!timeValue) return '';
    // Convert time string (HH:MM:SS) to HH:MM format for HTML time input
    if (typeof timeValue === 'string' && timeValue.includes(':')) {
      return timeValue.substring(0, 5); // Extract HH:MM part
    }
    return timeValue;
  };

  // Handle mode determination and form data initialization together
  useEffect(() => {
    if (!formResponse) {
      setMode('add');
      return;
    }

    let initialData;
    let newMode;

    if (
      formResponse.Apistatus === false &&
      formResponse.message === 'Case not found.'
    ) {
      newMode = 'add';
      initialData = getInitialFormData(caseType, null, 'add');
    } else if (formResponse.Apistatus && formResponse.data) {
      newMode = 'edit';

      // Use API data for edit mode
      const apiFormData = formResponse.data;

      // Convert date fields from API format to form format
      // ONLY include fields that are actually present in the current form configuration
      const processedData = {};
      Object.keys(apiFormData).forEach((key) => {
        const value = apiFormData[key];
        const field = formFields.find((f) => f.name === key);

        // Only process fields that exist in the current form configuration
        if (field) {
          if (field.type === 'date' && value) {
            processedData[key] = formatDateForForm(value);
          } else if (field.type === 'time' && value) {
            processedData[key] = formatTimeForForm(value);
          } else {
            processedData[key] = value;
          }
        }
        // If field is not found in formFields, it gets ignored (not added to processedData)
      });

      initialData = processedData;
      console.log('Processed form data:', processedData);
    } else {
      newMode = 'add';
      initialData = getInitialFormData(caseType, null, 'add');
    }

    setMode(newMode);
    setFormData(initialData);
    // Clear any previous validation errors when switching modes or loading new data
    setValidationErrors({});
  }, [formResponse, caseType]);

  console.log('formData', formData);

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    const field = formFields.find((f) => f.name === fieldName);
    let processedValue = value;

    // Handle date field conversion
    if (field && field.type === 'date') {
      if (value instanceof Date) {
        // Convert Date object to string for storage
        processedValue = formatDateForAPI(value);
      } else if (typeof value === 'string') {
        // For HTML date input, the value is already in YYYY-MM-DD format
        // Just validate it's a valid date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          processedValue = value; // Keep the YYYY-MM-DD string format
        }
      }
    }

    // Handle time field conversion
    if (field && field.type === 'time') {
      if (value instanceof Date) {
        // Convert Date object to HH:MM:SS format for storage
        const hours = value.getHours().toString().padStart(2, '0');
        const minutes = value.getMinutes().toString().padStart(2, '0');
        const seconds = value.getSeconds().toString().padStart(2, '0');
        processedValue = `${hours}:${minutes}:${seconds}`;
      } else if (typeof value === 'string') {
        // For HTML time input, the value is already in HH:MM format
        // Convert to HH:MM:SS format for storage
        if (value.includes(':') && value.split(':').length === 2) {
          processedValue = `${value}:00`; // Add seconds
        } else {
          processedValue = value; // Keep as is if already in HH:MM:SS format
        }
      }
    }

    // Handle dropdown fields with YES_NO options - ensure numeric values
    if (
      field &&
      field.type === 'dropdown' &&
      field.options &&
      field.options.length > 0
    ) {
      // Check if this is a YES_NO dropdown by looking at the first option value
      const firstOption = field.options[0];
      if (firstOption && (firstOption.value === 1 || firstOption.value === 0)) {
        // This is a YES_NO dropdown, ensure the value is a number
        if (value !== null && value !== undefined && value !== '') {
          processedValue = Number(value);
        } else if (value === 0) {
          // Handle the case where value is 0 (which is falsy but valid)
          processedValue = 0;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: processedValue,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  console.log('formData', formData);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = getFormDataForSubmission(formData, mode, caseType);

      const apiResponse =
        mode === 'add'
          ? await createForm({ slug: slugId, formData: submissionData })
          : await updateForm({ slug: slugId, formData: submissionData });

      if (apiResponse?.Apistatus) {
        // Clear any previous validation errors on success
        setValidationErrors({});
        toast.success(
          mode === 'edit'
            ? 'Form updated successfully!'
            : 'Form submitted successfully!'
        );
      } else {
        // Handle validation errors
        if (apiResponse?.errors) {
          setValidationErrors(apiResponse.errors);
          toast.error('Please fix the validation errors below.');
        } else {
          const errorMessage =
            apiResponse?.message || 'Form submission failed!';
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Form submission failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    console.log('Form cancelled:', { mode, slugId });
    // Here you would typically navigate back
    toast.info('Form cancelled!');
  };

  // Group fields by section
  const groupFieldsBySection = (fields) => {
    const sections = {};
    fields.forEach((field) => {
      const section = field.section || 'Other';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(field);
    });
    return sections;
  };

  // Get grid size class based on field configuration
  const getGridSize = (field) => {
    if (!field.gridSize) return { xs: 12, sm: 6, md: 6 };

    switch (field.gridSize) {
      case 'FULL_WIDTH':
        return { xs: 12, sm: 12, md: 12 };
      case 'HALF_WIDTH':
        return { xs: 12, sm: 6, md: 6 };
      case 'THIRD_WIDTH':
        return { xs: 12, sm: 6, md: 4 };
      case 'QUARTER_WIDTH':
        return { xs: 12, sm: 6, md: 4 };
      default:
        return { xs: 12, sm: 6, md: 6 };
    }
  };

  // Get form title based on mode
  const getFormTitle = () => {
    if (mode === 'edit') {
      return `Edit ${caseType}`;
    }
    return caseType;
  };

  const getSubmitButtonText = () => {
    return 'Save';
  };

  // Show loading state
  if (isLoading) {
    return (
      <Stack
        spacing={2}
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader2 className="animate-spin" />
      </Stack>
    );
  }

  // Group fields by section
  const sections = groupFieldsBySection(formFields);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl overflow-hidden no-scrollbar p-4">
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          // backgroundColor: '#fff',
          borderRadius: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Form Header */}
        <Stack
          sx={{
            p: 2,
            pb: 0,
          }}
        >
          <BreadCrumb label={getFormTitle()} />
        </Stack>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <Stack
            sx={{
              m: 2,
              mt: 0,
              p: 2,
              borderRadius: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {isLoading ? (
              <Stack sx={{ textAlign: 'center', py: 4 }}>
                <Typography
                  sx={{ color: 'text.secondary', fontSize: '1.125rem', mb: 1 }}
                >
                  <Loader2 className="animate-spin" />
                </Typography>
                <Typography
                  sx={{ color: 'text.disabled', fontSize: '0.875rem' }}
                >
                  Please wait while we fetch the form data.
                </Typography>
              </Stack>
            ) : (
              <>
                {/* Validation Errors Summary */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-800 mb-3">
                      Please fix the following validation errors:
                    </h4>
                    <ul className="space-y-1">
                      {Object.entries(validationErrors).map(
                        ([fieldName, errors]) => (
                          <li key={fieldName} className="text-sm text-red-700">
                            <span className="font-medium">
                              {fieldName
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                              :
                            </span>{' '}
                            {errors[0]}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {Object.entries(sections).map(
                  ([sectionName, sectionFields]) => (
                    <Stack key={sectionName} spacing={2} sx={{ mb: 3 }}>
                      {/* Section Heading */}
                      {sectionName !== 'Other' && (
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1f2937',
                            fontSize: '1.125rem',
                          }}
                        >
                          {sectionName}
                        </Typography>
                      )}

                      {/* Section Fields */}
                      <Grid container spacing={1}>
                        {sectionFields.map((field, index) => {
                          if (field.type === 'section') {
                            return null;
                          }

                          const isTextarea = field.type === 'textarea';
                          const gridProps = isTextarea
                            ? { size: { xs: 12 } }
                            : field.gridSize || { size: { xs: 12 } };

                          return (
                            <Grid
                              key={index}
                              {...gridProps}
                              sx={{
                                ...(isTextarea
                                  ? {
                                      pageBreakBefore: 'always',
                                      breakBefore: 'always',
                                      clear: 'both',
                                      display: 'block',
                                      width: '100%',
                                    }
                                  : {}),
                                '&.MuiGrid-item': {
                                  flexBasis: 'auto',
                                },
                              }}
                            >
                              <Stack
                                sx={{
                                  height: '100%',
                                  // minHeight: isTextarea ? '100px' : '60px',
                                  mt: isTextarea ? 0.5 : 0,
                                  mb: isTextarea ? 0.5 : 0,
                                }}
                              >
                                <FormFields
                                  label={field.label}
                                  type={field.type}
                                  options={field.options}
                                  maxLength={field.maxLength}
                                  required={field.required}
                                  value={
                                    formData[field.name] !== null &&
                                    formData[field.name] !== undefined
                                      ? formData[field.name]
                                      : ''
                                  }
                                  onChange={(value) =>
                                    handleFieldChange(field.name, value)
                                  }
                                  error={
                                    validationErrors[field.name] ? true : false
                                  }
                                  helperText={
                                    validationErrors[field.name]
                                      ? validationErrors[field.name][0]
                                      : ''
                                  }
                                />
                              </Stack>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Stack>
                  )
                )}
              </>
            )}
            <div className="flex items-end justify-end gap-2 p-2 ">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer max-w-48"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  getSubmitButtonText()
                )}
              </Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </div>
  );
};

export default Form;
