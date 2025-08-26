import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  Stack,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  TextareaAutosize,
} from '@mui/material';
import { Loader2, X } from 'lucide-react';
import { useUsers } from '@/components/users/hooks/useUsers';
import { toast } from 'sonner';

const formFields = [
  {
    label: 'First Name',
    name: 'first_name',
    type: 'text',
    required: true,
    maxLength: 255,
  },
  {
    label: 'Last Name',
    name: 'last_name',
    type: 'text',
    required: true,
    maxLength: 255,
  },
  {
    label: 'Role',
    name: 'role_id',
    type: 'select',
    required: true,
    metaField: 'roles',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    required: true,
  },
  {
    label: 'Phone Number',
    name: 'phone_number',
    type: 'text',
    required: false,
  },
  {
    label: 'Street Number',
    name: 'street_number',
    type: 'text',
    required: false,
  },
  {
    label: 'Street Name',
    name: 'street_name',
    type: 'text',
    required: false,
  },
  {
    label: 'Unit Number',
    name: 'unit_number',
    type: 'text',
    required: false,
  },
  {
    label: 'City',
    name: 'city',
    type: 'text',
    required: false,
  },
  {
    label: 'Province',
    name: 'province',
    type: 'text',
    required: false,
  },
  {
    label: 'Postal Code',
    name: 'postal_code',
    type: 'text',
    required: false,
  },
  {
    label: 'Country',
    name: 'country',
    type: 'text',
    required: false,
  },
];

export default function UserDialog({
  open = false,
  onClose = () => {},
  mode = 'create', // 'create' or 'update'
  user = null, // User object for update mode
}) {
  const [validationErrors, setValidationErrors] = useState({});

  const { usersMeta, createUser, updateUser, isCreating, isUpdating } =
    useUsers();

  const isUpdateMode = mode === 'update';
  const currentUser = isUpdateMode ? user : null;

  const getDefaultValues = () => {
    const baseValues = {
      role_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      street_number: '',
      street_name: '',
      unit_number: '',
      city: '',
      province: '',
      postal_code: '',
      country: '',
    };

    return baseValues;
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: getDefaultValues(),
  });

  const onFormSubmit = async (data) => {
    try {
      setValidationErrors({});

      // Prepare FormData for file upload
      const formData = new FormData();

      // Append all form fields to FormData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (isUpdateMode && currentUser) {
        // Ensure currentUser has a valid id
        if (!currentUser.id) {
          throw new Error('Invalid user data: missing user ID');
        }
        
        await updateUser({
          userId: currentUser.id,
          userData: formData,
        });
      } else {
        await createUser(formData);
      }

      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);

      // Handle validation errors
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } 
    }
  };

  // Clear validation errors when user starts typing
  const clearFieldError = (fieldName) => {
    // Clear both form errors and API validation errors
    clearErrors(fieldName);
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Populate form when in update mode
  useEffect(() => {
    if (open) {
      // Clear all errors when dialog opens
      setValidationErrors({});
      clearErrors();

      if (isUpdateMode && currentUser && typeof currentUser === 'object') {
        const formData = {
          role_id: currentUser.role_id ? currentUser.role_id.toString() : '',
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          phone_number: currentUser.phone_number || '',
          street_number: currentUser.street_number || '',
          street_name: currentUser.street_name || '',
          unit_number: currentUser.unit_number || '',
          city: currentUser.city || '',
          province: currentUser.province || '',
          postal_code: currentUser.postal_code || '',
          country: currentUser.country || '',
        };

        // Use setTimeout to ensure the form is properly reset
        setTimeout(() => {
          reset(formData);
        }, 100);
      } else {
        // Reset to default values for create mode
        setTimeout(() => {
          reset(getDefaultValues());
        }, 100);
      }
    }
  }, [open, currentUser, isUpdateMode, reset, clearErrors]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              {isUpdateMode ? 'Update User' : 'Create New User'}
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields
                .filter((field) => {
                  // Show all fields in update mode, but hide updateOnly fields in create mode
                  if (!isUpdateMode && field.updateOnly) {
                    return false;
                  }
                  return true;
                })
                .map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {/* Show required asterisk based on mode */}
                      {(isUpdateMode
                        ? field.updateRequired
                        : field.required) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>

                    <Controller
                      name={field.name}
                      control={control}
                      rules={{
                        required: (
                          isUpdateMode ? field.updateRequired : field.required
                        )
                          ? `${field.label} is required`
                          : false,
                        maxLength: field.maxLength
                          ? {
                              value: field.maxLength,
                              message: `${field.label} must be less than ${field.maxLength} characters`,
                            }
                          : undefined,
                      }}
                      render={({ field: controllerField }) =>
                        field.type === 'select' ? (
                          <Select
                            value={controllerField.value}
                            onValueChange={(value) => {
                              controllerField.onChange(value);
                              clearFieldError(field.name);
                            }}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors[field.name] ||
                                validationErrors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            >
                              <SelectValue
                                placeholder={`Select ${field.label.toLowerCase()}`}
                                className="w-full"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(usersMeta[field.metaField] || []).map(
                                (option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={option.id.toString()}
                                  >
                                    {option.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'file' ? (
                          <div className="space-y-2">
                            <Input
                              id={field.name}
                              type="file"
                              accept={field.accept}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                controllerField.onChange(file || null);
                                clearFieldError(field.name);
                              }}
                              onBlur={controllerField.onBlur}
                              className={`${
                                errors[field.name] ||
                                validationErrors[field.name]
                                  ? 'border-red-500'
                                  : ''
                              }`}
                              onFocus={() => clearFieldError(field.name)}
                            />
                            {controllerField.value && (
                              <div className="text-sm text-gray-600">
                                Selected:{' '}
                                {controllerField.value.name ||
                                  'Current profile picture'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            value={controllerField.value}
                            onChange={(e) => {
                              controllerField.onChange(e.target.value);
                              clearFieldError(field.name);
                            }}
                            onBlur={controllerField.onBlur}
                            className={`${
                              errors[field.name] || validationErrors[field.name]
                                ? 'border-red-500'
                                : ''
                            }`}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            onFocus={() => clearFieldError(field.name)}
                          />
                        )
                      }
                    />

                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name].message}
                      </p>
                    )}
                    {!errors[field.name] && validationErrors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {Array.isArray(validationErrors[field.name])
                          ? validationErrors[field.name][0]
                          : validationErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <Divider />

          <div className="flex justify-end gap-3 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isUpdateMode ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </Stack>
      </form>
    </Dialog>
  );
}
