import FormFields from '@/components/forms/FormFields';
import {
  getFormFields,
  getInitialFormData,
  getFormDataForSubmission,
} from './helpers';
import Button from '@/components/button';
import { Input } from '@/components/ui/input';
import { Button as ShadCnBtn } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

  // Determine mode based on API response
  useEffect(() => {
    if (formResponse) {
      if (
        formResponse.response.Apistatus === false &&
        formResponse.response.message === 'Case not found.'
      ) {
        setMode('add');
      } else if (
        formResponse.response.Apistatus &&
        formResponse.response.data
      ) {
        setMode('edit');
      } else {
        setMode('add');
      }
    } else {
      setMode('add');
    }
  }, [formResponse]);

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
    // Convert YYYY-MM-DD string to Date object for form display
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date;
  };

  // Initialize form data based on API response or defaults
  useEffect(() => {
    let initialData;

    if (
      mode === 'edit' &&
      formResponse?.response.status === 200 &&
      formResponse?.response.data
    ) {
      // Use API data if form exists
      const apiFormData = formResponse.response.data;

      // Convert date fields from API format to form format
      const processedData = {};
      Object.keys(apiFormData).forEach((key) => {
        const value = apiFormData[key];
        const field = formFields.find((f) => f.name === key);

        if (field && field.type === 'date' && value) {
          processedData[key] = formatDateForForm(value);
        } else {
          processedData[key] = value;
        }
      });

      initialData = processedData;
    } else {
      // Use default initialization for add mode or when no data
      initialData = getInitialFormData(caseType, null, mode);
    }

    setFormData(initialData);
  }, [formResponse, mode, caseType]);

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
        // Convert string to Date object for form display
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          processedValue = formatDateForAPI(date);
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: processedValue,
    }));
  };

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
        toast.success(
          mode === 'edit'
            ? 'Form updated successfully!'
            : 'Form submitted successfully!'
        );
      } else {
        const errorMessage =
          apiResponse?.data?.message || 'Form submission failed!';
        toast.error(errorMessage);
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
    if (isSubmitting) {
      return mode === 'edit' ? 'Updating...' : 'Submitting...';
    }
    return mode === 'edit' ? 'Update Form' : 'Submit Form';
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
              Object.entries(sections).map(([sectionName, sectionFields]) => (
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
                  <Grid container spacing={2}>
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
                              minHeight: isTextarea ? '100px' : '60px',
                              mt: isTextarea ? 1 : 0,
                              mb: isTextarea ? 1 : 0,
                            }}
                          >
                            <FormFields
                              label={field.label}
                              type={field.type}
                              options={field.options}
                              maxLength={field.maxLength}
                              required={field.required}
                              value={formData[field.name] || ''}
                              onChange={(value) =>
                                handleFieldChange(field.name, value)
                              }
                            />
                          </Stack>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Stack>
              ))
            )}
            <div className="flex items-end justify-end gap-2 p-2 ">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer max-w-48"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer max-w-48"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{getSubmitButtonText()}</span>
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
