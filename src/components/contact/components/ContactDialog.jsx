import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  Chip,
} from '@mui/material';
import { useContact } from '../hooks/useContact';
import { toast } from 'sonner';

const defaultFields = {
  nature: '',
  contact_type_id: null,
  prefix_id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  gender_id: null,
  alias: '',
  marital_status_id: null,
  company_name: '',
  job_title: '',
  ssn: '',
  federal_tax_id: '',
  work_phone: '',
  home_phone: '',
  primary_phone: '',
  fax: '',
  primary_email: '',
  secondary_email: '',
  when_to_contact: '',
  contact_preference: '',
  language: '',
  drivers_license: '',
  date_of_birth: '',
  date_of_death: '',
  date_of_bankruptcy: '',
  notes: '',
  addresses: [],
};

export default function ContactDialog({ open, setOpen, mode }) {
  // const { data: contactMeta } = useQuery({
  //   queryKey: ['contactMeta'],
  //   queryFn: getContactMeta,
  // });

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(false);

  const {
    contactsMeta: contactMeta,
    contact,
    createContactMutation,
    handleCreateContact,
    handleUpdateContact,
    isCreating,
    isUpdating,
  } = useContact();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultFields,
  });

  const nature = watch('nature');

  const isLoading = isCreating || isUpdating;

  const {
    fields: addressFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  // Define validation rules for each field
  const getValidationRules = (name) => {
    const rules = {};

    switch (name) {
      case 'nature':
        rules.required = 'Nature is required';
        break;
      case 'contact_type_id':
        rules.required = 'Contact type is required';
        break;
      case 'first_name':
        if (nature === 'Individual') {
          rules.required = 'First name is required for individuals';
        }
        rules.maxLength = {
          value: 255,
          message: 'First name must be 255 characters or less',
        };
        break;
      case 'last_name':
        if (nature === 'Individual') {
          rules.required = 'Last name is required for individuals';
        }
        rules.maxLength = {
          value: 255,
          message: 'Last name must be 255 characters or less',
        };
        break;
      case 'company_name':
        if (nature === 'Business') {
          rules.required = 'Company name is required for businesses';
        }
        rules.maxLength = {
          value: 255,
          message: 'Company name must be 255 characters or less',
        };
        break;
      case 'primary_phone':
        rules.required = 'Primary phone is required';
        break;
      case 'primary_email':
        rules.required = 'Primary email is required';
        break;
      case 'addresses':
        rules.validate = (value) => {
          if (!value || value.length === 0) {
            return 'At least one address is required';
          }
          return true;
        };
        break;
      default:
        // Apply maxLength to other text fields
        if (
          [
            'middle_name',
            'suffix',
            'alias',
            'job_title',
            'ssn',
            'federal_tax_id',
            'work_phone',
            'home_phone',
            'primary_phone',
            'fax',
            'primary_email',
            'secondary_email',
            'when_to_contact',
            'contact_preference',
            'language',
            'drivers_license',
            'notes',
          ].includes(name)
        ) {
          rules.maxLength = {
            value: 255,
            message: `${name.replace('_', ' ')} must be 255 characters or less`,
          };
        }
        break;
    }

    return rules;
  };

  const formFields = [
    {
      label: 'Nature',
      name: 'nature',
      type: 'select',
      required: true,
      options: [
        { id: 'Individual', name: 'Individual' },
        { id: 'Business', name: 'Business' },
      ],
    },
    {
      label: 'Contact Type',
      name: 'contact_type_id',
      type: 'select',
      required: true,
      options: contactMeta?.contact_type || [],
    },
    {
      label: 'Prefix',
      name: 'prefix_id',
      type: 'select',
      options: contactMeta?.prefix || [],
    },
    {
      label: 'First Name',
      name: 'first_name',
      type: 'text',
      required: nature === 'Individual',
    },
    { label: 'Middle Name', name: 'middle_name', type: 'text' },
    {
      label: 'Last Name',
      name: 'last_name',
      type: 'text',
      required: nature === 'Individual',
    },
    { label: 'Suffix', name: 'suffix', type: 'text' },
    {
      label: 'Gender',
      name: 'gender_id',
      type: 'select',
      options: contactMeta?.gender || [],
    },
    { label: 'Alias', name: 'alias', type: 'text' },
    {
      label: 'Marital Status',
      name: 'marital_status_id',
      type: 'select',
      options: contactMeta?.marital_status || [],
    },
    {
      label: 'Company Name',
      name: 'company_name',
      type: 'text',
      required: nature === 'Business',
    },
    { label: 'Job Title', name: 'job_title', type: 'text' },
    { label: 'SSN', name: 'ssn', type: 'text' },
    { label: 'Federal Tax ID', name: 'federal_tax_id', type: 'text' },
    { label: 'Work Phone', name: 'work_phone', type: 'text' },
    { label: 'Home Phone', name: 'home_phone', type: 'text' },
    {
      label: 'Primary Phone',
      name: 'primary_phone',
      type: 'text',
      required: true,
    },
    { label: 'Fax', name: 'fax', type: 'text' },
    {
      label: 'Primary Email',
      name: 'primary_email',
      type: 'text',
      required: true,
    },
    { label: 'Secondary Email', name: 'secondary_email', type: 'text' },
    { label: 'When to Contact', name: 'when_to_contact', type: 'text' },
    { label: 'Contact Preference', name: 'contact_preference', type: 'text' },
    { label: 'Language', name: 'language', type: 'text' },
    { label: "Driver's License", name: 'drivers_license', type: 'text' },
    { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
    { label: 'Date of Death', name: 'date_of_death', type: 'date' },
    { label: 'Date of Bankruptcy', name: 'date_of_bankruptcy', type: 'date' },
    { label: 'Notes', name: 'notes', type: 'text' },
  ];

  // const createContactMutation = useMutation({
  //   mutationFn: createContact,
  //   onSuccess: (res) => {
  //     console.log('[DEBUG] Contact created successfully:', res);
  //     toast.success('Contact created successfully');
  //     setOpen(false);
  //     reset();
  //   },
  //   onError: (error) => {
  //     console.error('[DEBUG] Create contact error:', error);
  //     toast.error(error.message || 'Failed to create contact');
  //   },
  // });

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (open) {
      if (mode === 'update' && contact) {
        // Populate form with existing event data
        const formData = {
          ...contact,
        };

        reset(formData);
      } else {
        reset(defaultFields);
      }
      setValidationErrors({});
    } else {
      // Reset states when dialog closes
      setValidationErrors({});
    }
  }, [open, mode, reset, contact?.id]);

  const onSubmit = (data) => {
    // createContactMutation.mutate({ data });

    setValidationErrors({});

    const errors = getValidationRules(data);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      console.log('validation errors >>>', errors);
      // toast.error('Please fix the validation errors');
      return;
    }

    mode === 'create'
      ? handleCreateContact(data)
      : handleUpdateContact({
          contactId: contact.id,
          contactData: data,
        });
    setOpen(false);
    reset();
  };

  // Address state
  const [newAddress, setNewAddress] = useState({
    address_1: '',
    address_2: '',
    city: '',
    county: '',
    state: '',
    zip: '',
    country: '',
    is_primary: false,
    address_type_id: null,
  });

  const [addressErrors, setAddressErrors] = useState({});

  const validateAddress = (address) => {
    const errors = {};

    if (!address.address_1?.trim()) {
      errors.address_1 = 'Address line 1 is required';
    } else if (address.address_1.length > 255) {
      errors.address_1 = 'Address line 1 must be 255 characters or less';
    }

    if (!address.city?.trim()) {
      errors.city = 'City is required';
    } else if (address.city.length > 100) {
      errors.city = 'City must be 100 characters or less';
    }

    // Optional field validations
    if (address.address_2 && address.address_2.length > 255) {
      errors.address_2 = 'Address line 2 must be 255 characters or less';
    }

    if (address.county && address.county.length > 100) {
      errors.county = 'County must be 100 characters or less';
    }

    if (address.state && address.state.length > 100) {
      errors.state = 'State must be 100 characters or less';
    }

    if (address.zip && address.zip.length > 20) {
      errors.zip = 'ZIP code must be 20 characters or less';
    }

    if (address.country && address.country.length > 100) {
      errors.country = 'Country must be 100 characters or less';
    }

    return errors;
  };

  const handleAddAddressSubmit = () => {
    const errors = validateAddress(newAddress);
    setAddressErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log('[DEBUG] Adding new address:', newAddress);
      append(newAddress);
      setNewAddress({
        address_1: '',
        address_2: '',
        city: '',
        county: '',
        state: '',
        zip: '',
        country: '',
        is_primary: false,
        address_type_id: null,
      });
      setAddressDialogOpen(false);
      setAddressErrors({});
    }
  };

  return (
    <>
      {/* Main Contact Form */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000] ">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans ">
              {mode === 'create' ? 'Create New Contact' : 'Update Contact'}
            </h1>
            <IconButton onClick={() => setOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
            <div className="flex flex-wrap gap-4 overflow-auto">
              {formFields.map(({ label, name, type, required, options }) => (
                <div key={name} className="w-full md:w-[49%]">
                  {type !== 'checkbox' && (
                    <Label className="text-[#40444D] font-semibold mb-2">
                      {label}
                      {(required || getValidationRules(name).required) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                  )}

                  {type === 'select' ? (
                    <Controller
                      control={control}
                      name={name}
                      rules={getValidationRules(name)}
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => {
                            console.log(`[DEBUG] Setting ${name}:`, val);
                            field.onChange(isNaN(val) ? val : Number(val));
                          }}
                          value={field.value?.toString() ?? ''}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              errors[name] ? 'border-red-500' : ''
                            }`}
                          >
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            portal={false}
                            className="z-[9999]"
                          >
                            <SelectGroup>
                              {options?.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : (
                    <Controller
                      control={control}
                      name={name}
                      rules={getValidationRules(name)}
                      render={({ field }) => (
                        <Input
                          type={type}
                          {...field}
                          className={errors[name] ? 'border-red-500' : ''}
                        />
                      )}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* Address Section */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-1">
                  Addresses
                  <span className="text-red-500 ml-1">*</span>
                </h3>
                {addressFields.map((addr, idx) => (
                  <div
                    key={addr.id}
                    className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                  >
                    <Stack direction="row" spacing={1}>
                      <p className="text-sm">
                        {addr.address_1}, {addr.city}, {addr.state}
                      </p>
                      <Chip
                        label={addr.is_primary ? 'Primary' : 'Secondary'}
                        color={addr.is_primary ? 'primary' : 'secondary'}
                        size="small"
                        variant="outlined"
                        className="text-xs"
                      />
                    </Stack>
                    <Tooltip title="Remove Address">
                      <IconButton
                        onClick={() => {
                          console.log(
                            '[DEBUG] Removing address at index:',
                            idx
                          );
                          remove(idx);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => setAddressDialogOpen(true)}
                  variant="outline"
                  className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>

                {errors?.addresses?.root?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.addresses?.root?.message}
                  </p>
                )}

                {/* Hidden field to enforce address validation */}
                <Controller
                  control={control}
                  name="addresses"
                  rules={getValidationRules('addresses')}
                  render={({ field }) => (
                    <input
                      type="hidden"
                      {...field}
                      value={field.value?.length ? 'hasAddresses' : ''}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-end p-4 gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-[#6366F1] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === 'create' ? (
                'Create Contact'
              ) : (
                'Update Contact'
              )}
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Address Dialog */}
      <Dialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-center">Add Address</h1>
            <IconButton onClick={() => setAddressDialogOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { field: 'address_1', label: 'Address Line 1', required: true },
              { field: 'address_2', label: 'Address Line 2', required: false },
              { field: 'city', label: 'City', required: true },
              { field: 'county', label: 'County', required: false },
              { field: 'state', label: 'State', required: false },
              { field: 'zip', label: 'ZIP Code', required: false },
              { field: 'country', label: 'Country', required: false },
            ].map(({ field, label, required }) => (
              <div key={field}>
                <Label className="text-[#40444D] font-semibold mb-2">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className={addressErrors[field] ? 'border-red-500' : ''}
                />
                {addressErrors[field] && (
                  <p className="text-red-500 text-sm mt-1">
                    {addressErrors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* Address Type */}
            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Address Type
              </Label>
              <Select
                onValueChange={(val) =>
                  setNewAddress({ ...newAddress, address_type_id: Number(val) })
                }
                value={newAddress.address_type_id?.toString() || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Address Type" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  portal={false}
                  className="z-[9999]"
                >
                  {contactMeta?.address_type?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Is Primary:</Label>
              <Switch
                checked={newAddress.is_primary}
                onChange={(e) => {
                  if (!isPrimaryAddress) {
                    setIsPrimaryAddress(e.target.checked);
                  } else {
                    toast.error('Only one address can be primary');
                    return;
                  }
                  setNewAddress({
                    ...newAddress,
                    is_primary: e.target.checked,
                  });
                }}
              />
            </div>
          </div>

          <DialogActions>
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={() => {
                setAddressDialogOpen(false);
                setAddressErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              onClick={handleAddAddressSubmit}
            >
              Save Address
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
