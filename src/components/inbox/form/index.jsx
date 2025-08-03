import CustomField from '@/components/forms/FormFields';
import {
  getFormFields,
  getInitialFormData,
  getFormDataForSubmission,
} from './helpers';
import { Button } from '@/components/ui/button';
import { Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';

const Form = ({ matter, onSubmit, onCancel, mode = 'add', slug }) => {
  // Get case type from matter
  const caseType = matter?.case_type || 'Criminal Defense Law';

  // Get form fields based on case type
  const formFields = getFormFields(caseType);

  // Form state
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data based on mode and matter data
  useEffect(() => {
    const initialData = getInitialFormData(caseType, matter, mode);
    setFormData(initialData);
  }, [matter, mode, caseType]);

  console.log('>>>', formData);

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        const submissionData = getFormDataForSubmission(formData, mode);
        await onSubmit(submissionData, mode, slug);
      }
      console.log('Form submitted:', {
        formData: getFormDataForSubmission(formData, mode),
        mode,
        slug,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (onCancel) {
      onCancel(mode, slug);
    }
    console.log('Form cancelled:', { mode, slug });
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

    // Filter out empty sections and reorder to put "Other" at the end
    const filteredSections = {};
    const otherSection = sections['Other'] || [];
    const otherSectionKey = 'Other';

    Object.entries(sections).forEach(([sectionName, sectionFields]) => {
      if (sectionFields.length > 0 && sectionName !== 'Other') {
        filteredSections[sectionName] = sectionFields;
      }
    });

    // Add "Other" section at the end if it has fields
    if (otherSection.length > 0) {
      filteredSections[otherSectionKey] = otherSection;
    }

    return filteredSections;
  };

  const groupedFields = groupFieldsBySection(formFields);

  // Get form title based on mode
  const getFormTitle = () => {
    if (mode === 'edit') {
      return `Edit ${caseType} - Intake Form`;
    }
    return `${caseType} - Intake Form`;
  };

  // Get submit button text based on mode
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return mode === 'edit' ? 'Updating...' : 'Submitting...';
    }
    return mode === 'edit' ? 'Update Form' : 'Submit Form';
  };

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
      }}
    >
      {/* Form Header */}
      <Stack
        sx={{
          p: 2,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#1f2937',
            fontSize: '1.25rem',
          }}
        >
          {getFormTitle()}
        </Typography>
        {/* <Typography variant="body2" sx={{ 
          color: '#6b7280', 
          mt: 0.5 
        }}>
          {mode === 'edit' 
            ? 'Update the information below'
            : 'Please fill out all required fields below'
          }
        </Typography> */}
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack sx={{ p: 2 }}>
          {Object.keys(groupedFields).length > 0 ? (
            Object.entries(groupedFields).map(
              ([sectionName, sectionFields], sectionIndex) => (
                <Stack key={sectionIndex} sx={{ mb: 3 }}>
                  <Stack
                    sx={{
                      mb: 2,
                      mt: sectionIndex > 0 ? 2 : 0,
                      pb: 1,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
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
                  </Stack>

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
                            <CustomField
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
              )
            )
          ) : (
            <Stack sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                sx={{ color: 'text.secondary', fontSize: '1.125rem', mb: 1 }}
              >
                {caseType
                  ? `No form fields configured for case type: ${caseType}`
                  : 'Please select a case type to load form fields'}
              </Typography>
              <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                Contact your administrator to configure form fields for this
                case type.
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Fixed Action Buttons */}
        <Stack
          sx={{
            borderTop: '1px solid #e5e7eb',
            px: 2,
            py: 2,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
        </Stack>
      </form>
    </Stack>
  );
};

export default Form;
