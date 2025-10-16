import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContactMeta from '@/pages/matter/intake/helpers/getContactMeta';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import createMatter from '@/pages/matter/intake/helpers/createMatter';
import { useNavigate } from 'react-router-dom';
import CreateContactDialog from './CreateContactDialog';
import {
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Loader2,
} from 'lucide-react';
import BreadCrumb from '@/components/BreadCrumb';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { IconButton, Stack } from '@mui/material';
import { setQueryParam } from '@/utils/setQueryParam';
import { useContact } from '@/components/contact/hooks/useContact';
import { isObjectWithValues } from '@/utils/isObjectWithValues';
import { useSearchParams } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';

export default function CreateIntake() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [showContactTable, setShowContactTable] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);

  const { contact, contactsMeta, contactLoading, contactsMetaLoading } =
    useContact();

  const createMatterMutation = useMutation({
    mutationFn: createMatter,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
      console.log('DATA', data);
      toast.success(data.message || 'Intake created successfully!');
      if (data && data.slug) {
        navigate(`/dashboard/inbox/overview?slugId=${data.slug}`);
      } else {
        navigate('/dashboard/inbox');
      }
    },
    onError: (error) => {
      console.error('Create matter error:', error);
      toast.error(error.message || 'Failed to create intake');
    },
  });

  const { data: matterMeta } = useQuery({
    queryKey: ['matterMeta'],
    queryFn: getMatterMeta,
  });
  console.log('matterMeta: ', matterMeta);

  const { data: contactMeta } = useQuery({
    queryKey: ['contactMeta'],
    queryFn: getContactMeta,
  });

  const { refetch: refetchSearchContact, data: searchContactData = [] } =
    useQuery({
      queryKey: ['searchContact', searchContactQuery, selectedContactType],
      queryFn: () =>
        searchContact({
          data: {
            searchBar: searchContactQuery,
            contact_type_id: selectedContactType,
          },
        }),
      enabled: false,
    });

  const debouncedSearch = debounce((query, type) => {
    if (query || type) {
      refetchSearchContact();
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchContactQuery, selectedContactType);
    return () => debouncedSearch.cancel();
  }, [searchContactQuery, selectedContactType, debouncedSearch]);

  // Manual validation function
  const validateForm = () => {
    const errors = {};

    // Required field validation
    const contactIds = getValues('contact_ids');
    const contactId = getValues('contact_id');
    if (!contactId && (!contactIds || contactIds.length === 0)) {
      errors.contact_id = 'At least one contact is required';
    }

    if (!getValues('case_type_id')) {
      errors.case_type_id = 'Case type is required';
    }

    if (!getValues('marketing_source_id')) {
      errors.marketing_source_id = 'Marketing source is required';
    }

    // Optional field validation with constraints
    if (
      getValues('case_description') &&
      getValues('case_description').length > 1000
    ) {
      errors.case_description =
        'Case description must be 1000 characters or less';
    }

    // Number validation for ID fields
    const numericFields = [
      'case_role_id',
      'case_type_id',
      'case_status_id',
      'marketing_source_id',
      'assignee_id',
      'owner_id',
      'ad_campaign_id',
      'contact_id',
    ];

    numericFields.forEach((field) => {
      if (
        getValues(field) &&
        (isNaN(getValues(field)) || getValues(field) <= 0)
      ) {
        errors[field] = `${field.replace('_', ' ')} must be a valid selection`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      case_role_id: '',
      case_type_id: '',
      case_status_id: '',
      marketing_source_id: '',
      assignee_id: '',
      owner_id: '',
      ad_campaign_id: '',
      case_description: '',
      contact_id: '',
      contact_ids: [],
    },
    mode: 'onChange',
  });

  // UseEffect hook to set contact data after form is initialized
  useEffect(() => {
    if (
      isObjectWithValues(contact) &&
      !contactLoading &&
      !contactsMetaLoading
    ) {
      setValue('contact_id', contact.id);
      setSelectedContact({
        contact_name: contact.first_name + ' ' + contact.last_name,
        contact_type: contactsMeta?.contact_type?.find(
          (item) => item.id === contact.contact_type_id
        )?.name,
        primary_email: contact.primary_email,
        phone: contact.primary_phone,
        primary_address: contact?.addresses?.find(
          (item) => item.is_primary === 1
        )?.address_1,
        date_created: contact.date_created,
      });
    }
  }, [contact, contactLoading, contactsMeta, contactsMetaLoading, setValue]);

  const handleCreateIntake = (data) => {
    // Clear previous errors
    Object.keys(formErrors).forEach((key) => clearErrors(key));

    // Manual validation
    const validation = validateForm();

    if (!validation.isValid) {
      // Set errors for invalid fields
      Object.entries(validation.errors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });

      toast.error('Please fix the validation errors before submitting');
      return;
    }

    // Additional contact validation
    if (
      selectedContacts.length === 0 &&
      !data.contact_id &&
      (!data.contact_ids || data.contact_ids.length === 0)
    ) {
      setError('contact_id', {
        type: 'manual',
        message: 'Please select at least one contact or create a new one',
      });
      toast.error('Contact selection is required');
      return;
    }

    console.log('[DEBUG] Submitting intake data:', data);
    createMatterMutation.mutate({ data });
  };

  // Real-time validation for specific fields
  const handleFieldChange = (fieldName, value, onChange) => {
    onChange(value);

    // Clear error when user starts typing/selecting
    if (formErrors[fieldName]) {
      clearErrors(fieldName);
    }

    // Real-time validation for case description length
    if (fieldName === 'case_description' && value && value.length > 1000) {
      setError(fieldName, {
        type: 'manual',
        message: 'Case description must be 1000 characters or less',
      });
    }
  };

  const contactType = contactMeta?.contact_type || [];

  const formFields = [
    {
      label: 'Referral Source',
      name: 'case_role_id',
      type: 'select',
      required: false,
      options: matterMeta?.case_role || [],
    },
    {
      label: 'Case Type',
      name: 'case_type_id',
      type: 'select',
      required: true,
      options: matterMeta?.case_type || [],
    },
    {
      label: 'Case Status',
      name: 'case_status_id',
      type: 'select',
      required: false,
      options: matterMeta?.case_status || [],
    },
    {
      label: 'Marketing Source',
      name: 'marketing_source_id',
      type: 'select',
      required: true,
      options: matterMeta?.marketing_source || [],
    },
    {
      label: 'Assignee',
      name: 'assignee_id',
      type: 'select',
      required: false,
      options: matterMeta?.assignees || [],
    },
    {
      label: 'Owner',
      name: 'owner_id',
      type: 'select',
      required: false,
      options: matterMeta?.owners || [],
    },
    {
      label: 'Ad Campaign',
      name: 'ad_campaign_id',
      type: 'select',
      required: false,
      options: matterMeta?.ad_campaign_id || [],
    },
    {
      label: 'Case Description',
      name: 'case_description',
      type: 'textarea',
      required: false,
      maxLength: 1000,
      widthFull: true,
    },
  ];

  console.log('[DEBUG] Selected contact type:', selectedContactType);
  console.log('[DEBUG] Selected contact:', selectedContact);
  console.log('[DEBUG] contact_id:', getValues('contact_id'));
  return (
    <div className="flex p-4 w-full h-full">
      <div className="flex flex-col items-center p-4 bg-white/30 w-full rounded-2xl">
        <BreadCrumb label="Create Intake" />
        <div className="bg-white/50 rounded-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar flex-1">
          <form
            onSubmit={handleSubmit((data) => handleCreateIntake(data))}
            className="space-y-4 w-full h-full flex flex-col"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {formFields.map(
                  ({
                    label,
                    name,
                    type,
                    required,
                    options,
                    maxLength,
                    widthFull,
                  }) => (
                    <div
                      key={name}
                      className={`w-full ${
                        widthFull ? 'col-span-1 md:col-span-4' : ''
                      }`}
                    >
                      {type !== 'checkbox' && (
                        <Label className="text-[#40444D] font-semibold mb-2">
                          {label}
                          {required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                      )}

                      {type === 'select' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <SearchableSelect
                              options={options || []}
                              value={field.value}
                              onValueChange={(val) =>
                                handleFieldChange(
                                  name,
                                  Number(val),
                                  field.onChange
                                )
                              }
                              placeholder={`Select ${label}`}
                              searchPlaceholder={`Search ${label.toLowerCase()}...`}
                              className="w-full"
                              error={!!formErrors[name]}
                              displayKey="name"
                              valueKey="id"
                              emptyMessage={`No ${label.toLowerCase()} found`}
                            />
                          )}
                        />
                      ) : type === 'textarea' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <div className="space-y-1">
                              <Textarea
                                {...field}
                                className={`w-full min-h-[100px] px-3 py-2 border rounded-md resize-vertical  ${
                                  formErrors[name]
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder={`Enter ${label.toLowerCase()}...`}
                                onChange={(e) =>
                                  handleFieldChange(
                                    name,
                                    e.target.value,
                                    field.onChange
                                  )
                                }
                              />
                              {maxLength && (
                                <div className="text-xs text-gray-500 text-right">
                                  {field.value?.length || 0} / {maxLength}{' '}
                                  characters
                                </div>
                              )}
                            </div>
                          )}
                        />
                      ) : type === 'checkbox' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                handleFieldChange(name, checked, field.onChange)
                              }
                              className={`border ${
                                formErrors[name] ? 'border-red-500' : ''
                              }`}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Input
                              type={type}
                              {...field}
                              className={
                                formErrors[name] ? 'border-red-500' : ''
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  name,
                                  e.target.value,
                                  field.onChange
                                )
                              }
                            />
                          )}
                        />
                      )}

                      {formErrors[name] && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors[name].message}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Contact Selection Section */}
              <div className="space-y-4">
                <div
                  className={`flex gap-4 w-full ${
                    selectedContact ? 'hidden' : ''
                  }`}
                >
                  <div className="w-[24vw] space-y-2">
                    <Label className="text-[#40444D] w-full font-semibold block">
                      Contact Type
                    </Label>
                    <SearchableSelect
                      options={contactType}
                      value={selectedContactType}
                      onValueChange={(value) => {
                        setSelectedContactType(value);
                        // Clear contact search when type changes
                        setSearchContactQuery('');
                        setSelectedContact(null);
                        setValue('contact_id', '');
                        setShowContactTable(false);
                      }}
                      placeholder="Select Contact Type"
                      searchPlaceholder="Search contact types..."
                      className="w-full"
                      displayKey="name"
                      valueKey="name"
                      emptyMessage="No contact types found"
                    />
                  </div>

                  {/* Search Contact */}
                  <div className="w-full space-y-2 ">
                    <Label className="text-[#40444D] font-semibold block">
                      Search Contact
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="contact_id"
                      render={() => (
                        <div className="flex items-center w-full gap-3">
                          <div className="relative w-1/2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search by name or email..."
                              value={searchContactQuery}
                              onChange={(e) => {
                                setSearchContactQuery(e.target.value);
                                setShowContactTable(true);
                                setSelectedContact(null);
                                if (formErrors.contact_id) {
                                  clearErrors('contact_id');
                                }
                              }}
                              className={`bg-white pl-9 ${
                                formErrors.contact_id ? 'border-red-500' : ''
                              }`}
                            />
                          </div>
                          <CustomButton
                            type="button"
                            variant="primary"
                            icon={Plus}
                            iconPosition="left"
                            style={{
                              background:
                                'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
                              color: '#fff',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpen(true);
                            }}
                          >
                            Add new contact
                          </CustomButton>
                        </div>
                      )}
                    />
                    {/* Contact Error Display */}
                    {formErrors.contact_id && (
                      <p className="text-xs text-red-500">
                        {formErrors.contact_id.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Search Results */}
                {showContactTable && (
                  <div
                    className="flex w-full mt-4"
                    style={{ minHeight: '220px' }}
                  >
                    <div className="w-1/2 border rounded-lg bg-white shadow overflow-y-auto">
                      <div className="p-2 border-b bg-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Search Results
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowContactTable(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-4">Select</th>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-2">Case Type</th>
                            <th className="py-2 px-2">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchContactData?.length > 0 ? (
                            searchContactData
                              .filter(
                                (c) =>
                                  c.contact_name
                                    .toLowerCase()
                                    .includes(
                                      searchContactQuery.toLowerCase()
                                    ) ||
                                  c.primary_email
                                    .toLowerCase()
                                    .includes(searchContactQuery.toLowerCase())
                              )
                              .map((contact) => (
                                <tr
                                  key={contact.id}
                                  className={`hover:bg-indigo-100 transition duration-300 ease-in-out ${
                                    hoveredContact?.id === contact.id
                                      ? 'bg-indigo-50'
                                      : ''
                                  }`}
                                  onMouseEnter={() =>
                                    setHoveredContact(contact)
                                  }
                                  onMouseLeave={() => setHoveredContact(null)}
                                >
                                  <td className="py-2 px-4">
                                    <Checkbox
                                      checked={selectedContacts.some(
                                        (c) => c.id === contact.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          const newContacts = [
                                            ...selectedContacts,
                                            contact,
                                          ];
                                          setSelectedContacts(newContacts);
                                          setValue(
                                            'contact_ids',
                                            newContacts.map((c) => c.id)
                                          );
                                          // Also set single contact_id for backward compatibility
                                          setValue('contact_id', contact.id);
                                        } else {
                                          const newContacts =
                                            selectedContacts.filter(
                                              (c) => c.id !== contact.id
                                            );
                                          setSelectedContacts(newContacts);
                                          setValue(
                                            'contact_ids',
                                            newContacts.map((c) => c.id)
                                          );
                                          // Set to last selected or empty
                                          setValue(
                                            'contact_id',
                                            newContacts.length > 0
                                              ? newContacts[
                                                  newContacts.length - 1
                                                ].id
                                              : ''
                                          );
                                        }
                                        if (formErrors.contact_id) {
                                          clearErrors('contact_id');
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-2 px-4">
                                    {contact.contact_name}
                                  </td>
                                  <td className="py-2 px-2">
                                    {contact.contact_type}
                                  </td>
                                  <td className="py-2 px-2">
                                    {contact.primary_email}
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-2 px-2 text-center">
                                No contacts found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {selectedContacts.length > 0 && (
                        <div className="p-2 border-t bg-gray-50">
                          <Button
                            type="button"
                            onClick={() => setShowContactTable(false)}
                            className="w-full"
                          >
                            Done ({selectedContacts.length} selected)
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Contact Preview */}
                    <div className="w-1/2 pl-4">
                      {hoveredContact && (
                        <div className="border rounded-lg bg-white shadow p-4">
                          <h2 className="font-bold text-lg mb-2">
                            Contact Preview
                          </h2>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-semibold">Name:</span>{' '}
                              {hoveredContact?.contact_name}
                            </p>
                            <p>
                              <span className="font-semibold">Case Type:</span>{' '}
                              {hoveredContact?.contact_type}
                            </p>
                            <p>
                              <span className="font-semibold">Email:</span>{' '}
                              {hoveredContact?.primary_email}
                            </p>
                            <p>
                              <span className="font-semibold">Phone:</span>{' '}
                              {hoveredContact?.phone}
                            </p>
                            <p>
                              <span className="font-semibold">Address:</span>{' '}
                              {hoveredContact?.primary_address}
                            </p>
                            <p>
                              <span className="font-semibold">Created:</span>{' '}
                              {hoveredContact?.date_created}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Contacts Display */}
                {selectedContacts.length > 0 && (
                  <div className="w-full mt-4">
                    <div className="space-y-2">
                      <h2 className="font-bold text-lg">
                        Selected Contacts ({selectedContacts.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="relative border rounded-lg bg-white shadow p-4"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <h3 className="font-semibold text-base">
                                {contact.contact_name}
                              </h3>
                              <IconButton
                                onClick={() => {
                                  const newContacts = selectedContacts.filter(
                                    (c) => c.id !== contact.id
                                  );
                                  setSelectedContacts(newContacts);
                                  setValue(
                                    'contact_ids',
                                    newContacts.map((c) => c.id)
                                  );
                                  setValue(
                                    'contact_id',
                                    newContacts.length > 0
                                      ? newContacts[newContacts.length - 1].id
                                      : ''
                                  );
                                }}
                                size="small"
                              >
                                <X className="w-4 h-4" />
                              </IconButton>
                            </Stack>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-semibold">Type:</span>{' '}
                                {contact.contact_type || 'N/A'}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span>{' '}
                                {contact.primary_email || 'N/A'}
                              </p>
                              <p>
                                <span className="font-semibold">Phone:</span>{' '}
                                {contact.phone || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowContactTable(true)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add More Contacts
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-lg shadow p-4">
              <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsEventsCollapsed(!isEventsCollapsed)}
              >
                <span className="text-lg font-semibold text-gray-800">
                  Upcoming Events
                </span>
                <div className="text-gray-500 hover:text-gray-700 transition-colors">
                  {isEventsCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {!isEventsCollapsed && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Event
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📅</div>
                            <p className="text-sm font-medium">
                              No upcoming events
                            </p>
                            <p className="text-xs text-gray-400">
                              Events will appear here when scheduled
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-4 pb-4">
              <Button
                type="submit"
                className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
                disabled={createMatterMutation.isPending}
              >
                {createMatterMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Create Intake'
                )}
              </Button>
            </div>
          </form>
        </div>

        {open && (
          <CreateContactDialog
            open={open}
            setOpen={setOpen}
            setValueFn={(contactId) => {
              console.log('contactId >>>', contactId);
              setValue('contact_id', contactId);
              // Add the new contact to selected contacts
              const newContact = {
                id: contactId,
                contact_name: 'New Contact', // This will be updated when contact data is loaded
                contact_type: 'Unknown',
                primary_email: '',
                phone: '',
              };
              setSelectedContacts((prev) => [...prev, newContact]);
              setValue('contact_ids', [
                ...selectedContacts.map((c) => c.id),
                contactId,
              ]);
              setQueryParam(
                'contactId',
                contactId,
                setSearchParams,
                searchParams
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
