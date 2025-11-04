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
import StarRating from '@/components/ui/StarRating';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatterSchema } from '@/pages/matter/intake/schema/createMatterSchema';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContacts from '@/pages/matter/intake/helpers/getContacts';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import formatDate from '@/utils/formatDate';
import updateMatter from '@/pages/matter/intake/helpers/updateMatter';
import { useNavigate } from 'react-router-dom';
import CreateContactDialog from './CreateContactDialog';
import ContactDialog from '@/components/contact/components/ContactDialog';
import CustomButton from '@/components/CustomButton';
import BreadCrumb from '@/components/BreadCrumb';
import getContactMeta from '@/pages/matter/intake/helpers/getContactMeta';
import { toast } from 'sonner';
import {
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Loader2,
} from 'lucide-react';
import isArrayWithValues from '@/utils/isArrayWithValues';

export default function Overview() {
  const _navigate = useNavigate();
  // fetch query params
  const searchParams = new URLSearchParams(window.location.search);
  const slugId = searchParams.get('slugId');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [showContactTable, setShowContactTable] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
  const [isContactsCollapsed, setIsContactsCollapsed] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [contactsToDelete, setContactsToDelete] = useState([]);
  const [contactToUpdate, setContactToUpdate] = useState(null);
  const [updateContactDialogOpen, setUpdateContactDialogOpen] = useState(false);

  const updateMatterMutation = useMutation({
    mutationFn: updateMatter,
    onSuccess: () => {
      console.log('Matter updated successfully');
      toast.success('Matter overview updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['matters'] });
    },
    onError: (error) => {
      console.error('Matter update failed:', error);
      toast.error('Failed to update matter overview. Please try again.');
    },
  });

  const handleUpdateMatter = () => {
    const formData = getValues();
    // Set the first selected contact as the primary contact_id
    if (selectedContacts.length > 0) {
      formData.contact_id = selectedContacts[0].id;
    }
    updateMatterMutation.mutate({ slug: slugId, data: formData });
  };

  const { data: matter, isLoading } = useQuery({
    queryKey: ['matters', slugId],
    queryFn: () => getMatter({ slug: slugId }),
    enabled: !!slugId,
  });
  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
  const { data: matterMeta } = useQuery({
    queryKey: ['matterMeta'],
    queryFn: getMatterMeta,
  });
  const { data: contactMeta } = useQuery({
    queryKey: ['contactMeta'],
    queryFn: getContactMeta,
  });

  const { data: searchContactData, refetch: refetchSearchContact } = useQuery({
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
    if (query && type) {
      refetchSearchContact();
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchContactQuery, selectedContactType);
    return () => debouncedSearch.cancel();
  }, [searchContactQuery, selectedContactType, debouncedSearch]);

  // Add contact to selected contacts list
  const handleAddContact = (contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
      setValue('contact_id', Number(contact.id), { shouldValidate: true });
      toast.success(`${contact.contact_name} added to contacts`);
    } else {
      toast.info(`${contact.contact_name} is already added`);
    }
    setSearchContactQuery('');
    setShowContactTable(false);
  };

  // Handle delete mode toggle
  const handleDeleteModeToggle = () => {
    if (deleteMode) {
      // Cancel delete mode
      setDeleteMode(false);
      setContactsToDelete([]);
    } else {
      // Enter delete mode
      setDeleteMode(true);
      setUpdateMode(false);
      setContactToUpdate(null);
    }
  };

  // Handle update mode toggle
  const handleUpdateModeToggle = () => {
    if (updateMode) {
      // Cancel update mode
      setUpdateMode(false);
      setContactToUpdate(null);
    } else {
      // Enter update mode
      setUpdateMode(true);
      setDeleteMode(false);
      setContactsToDelete([]);
    }
  };

  // Toggle contact selection for deletion
  const toggleDeleteSelection = (contactId) => {
    setContactsToDelete((prev) => {
      if (prev.includes(contactId)) {
        return prev.filter((id) => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  // Execute delete
  const executeDelete = () => {
    if (contactsToDelete.length === 0) {
      toast.error('Please select at least one contact to delete');
      return;
    }
    const deletedNames = selectedContacts
      .filter((c) => contactsToDelete.includes(c.id))
      .map((c) => c.contact_name);

    setSelectedContacts((prev) =>
      prev.filter((c) => !contactsToDelete.includes(c.id))
    );
    // Update form contact_id to the first remaining contact or null
    const remaining = selectedContacts.filter(
      (c) => !contactsToDelete.includes(c.id)
    );
    setValue('contact_id', remaining[0]?.id ? Number(remaining[0].id) : null, {
      shouldValidate: true,
    });
    setContactsToDelete([]);
    setDeleteMode(false);
    toast.success(`Deleted: ${deletedNames.join(', ')}`);
  };

  // Handle contact selection for update
  const handleSelectForUpdate = (contact) => {
    setContactToUpdate(contact);
    setUpdateContactDialogOpen(true);
  };

  // Handle contact update success
  const handleContactUpdateSuccess = (updatedContact) => {
    // Update the contact in the selectedContacts array
    setSelectedContacts((prev) =>
      prev.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
    setUpdateContactDialogOpen(false);
    setContactToUpdate(null);
    setUpdateMode(false);
    toast.success(`${updatedContact.contact_name} updated successfully!`);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      case_role_id: null,
      case_type_id: null,
      case_status_id: null,
      marketing_source_id: null,
      assignee_id: null,
      owner_id: null,
      ad_campaign_id: null,
      created_at: null,
      case_description: '',
      description: '',
      rating_id: null,
      call_outcome_id: null,
      office_location_id: null,
      contact_id: null,
    },
    resolver: zodResolver(createMatterSchema),
  });

  const contactType = contactMeta?.contact_type || [];

  useEffect(() => {
    const isAllDataLoaded = matter && contacts && contactMeta && matterMeta;

    if (!isAllDataLoaded) return;

    setLoading(true);

    const formData = {
      case_role_id: matter.case_role_id || null,
      case_type_id: matter.case_type_id || null,
      case_status_id: matter.case_status_id || null,
      marketing_source_id: matter.marketing_source_id || null,
      assignee_id: matter.assignee_id || null,
      owner_id: matter.owner_id || null,
      ad_campaign_id: matter.ad_campaign_id || null,
      created_at: matter.created_at || null,
      case_description: matter.case_description || '',
      description: matter.description || '',
      rating_id: matter.rating_id || null,
      call_outcome_id: matter.call_outcome_id || null,
      office_location_id: matter.office_location_id || null,
      contact_id: matter.contact_id || null,
      estimated_case_value: matter.estimated_case_value || '',
    };

    reset(formData);

    if (matter.contact_id && contacts) {
      const upcomingContact = contacts.find(
        (contact) => contact.id === matter.contact_id
      );
      if (upcomingContact) {
        setSelectedContacts((prev) => {
          if (prev.length === 0 || prev[0]?.id !== upcomingContact.id) {
            return [upcomingContact];
          }
          return prev;
        });
        setSelectedContactType(upcomingContact.contact_type);
        setValue('contact_id', Number(upcomingContact.id), {
          shouldValidate: true,
        });
      }
    }

    setLoading(false);
  }, [matter, contacts, contactMeta, matterMeta, reset]);

  const formFields = [
    // { label: 'Description', name: 'description', type: 'textarea' },
    {
      label: 'Description',
      name: 'description',
      type: 'text',
      required: false,
      className: 'w-full ',
    },
    {
      label: 'Referral Source',
      name: 'case_role_id',
      type: 'select',
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
      options: matterMeta?.assignees || [],
    },
    {
      label: 'Owner',
      name: 'owner_id',
      type: 'select',
      options: matterMeta?.owners || [],
    },
    {
      label: 'Ad Campaign',
      name: 'ad_campaign_id',
      type: 'select',
      options: matterMeta?.ad_campaign_id || [],
    },
    {
      label: 'Created At',
      name: 'created_at',
      type: 'date',
      required: false,
    },
    // { label: 'Description', name: 'description', type: 'text' },
    // { label: 'Contact ID', name: 'contact_id', type: 'text' },
    {
      label: 'Rating',
      name: 'rating_id',
      type: 'select',
      options: matterMeta?.rating || [],
    },
    {
      label: 'Call Outcome',
      name: 'call_outcome_id',
      type: 'select',
      options: matterMeta?.call_outcome || [],
    },
    {
      label: 'Office Location',
      name: 'office_location_id',
      type: 'select',
      options: matterMeta?.office_location || [],
    },
    {
      label: 'Estimated Case Value',
      name: 'estimated_case_value',
      type: 'text',
      readOnly: true,
    },
    {
      label: 'Case Description',
      name: 'case_description',
      type: 'textarea',
      required: false,
      widthFull: true,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-white/30 m-4 rounded-2xl overflow-hidden no-scrollbar p-4">
      <BreadCrumb label="Overview" />
      <div className="backdrop-blur-sm bg-white/40 rounded-lg p-4 w-full space-y-6 overflow-hidden">
        {loading || isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(() => {
              handleUpdateMatter();
            })}
            className="space-y-4 w-full flex flex-col justify-between overflow-hidden p-2"
          >
            <div className="space-y-4">
              {/* Description field - full width */}
              <div className="w-full ">
                <Label className="text-[#40444D] font-semibold mb-2">
                  Description
                </Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Enter description..."
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {formFields
                  .filter(
                    ({ name }) =>
                      name !== 'description' && name !== 'case_description'
                  )
                  .map(({ label, name, type, options, required }) => (
                    <div key={name} className="w-full">
                      {type !== 'checkbox' && (
                        <Label className="text-[#40444D] font-semibold mb-2">
                          {label}{' '}
                          {required && <span className="text-red-500">*</span>}
                        </Label>
                      )}
                      {type === 'select' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) =>
                            name === 'rating_id' ? (
                              <StarRating
                                options={options}
                                value={field.value}
                                onValueChange={(val) =>
                                  field.onChange(Number(val))
                                }
                                placeholder={`Select ${label}`}
                                searchPlaceholder={`Search ${label}...`}
                                className="w-full"
                                error={!!errors[name]}
                              />
                            ) : (
                              <SearchableSelect
                                options={options}
                                value={field.value}
                                onValueChange={(val) =>
                                  field.onChange(Number(val))
                                }
                                placeholder={`Select ${label}`}
                                searchPlaceholder={`Search ${label}...`}
                                className="w-full"
                                error={!!errors[name]}
                              />
                            )
                          }
                        />
                      ) : type === 'checkbox' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className={`border ${
                                errors[name] ? 'border-red-500' : ''
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
                              readOnly={
                                formFields.find((f) => f.name === name)
                                  ?.readOnly || false
                              }
                              className={
                                formFields.find((f) => f.name === name)
                                  ?.readOnly
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : ''
                              }
                            />
                          )}
                        />
                      )}
                      {errors[name] && (
                        <p className="text-xs text-red-500">
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {/* Case Description field - full width */}
              <div className="w-full">
                <Label className="text-[#40444D] font-semibold mb-2">
                  Case Description
                </Label>
                <Controller
                  control={control}
                  name="case_description"
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Enter case description..."
                    />
                  )}
                />
                {errors.case_description && (
                  <p className="text-xs text-red-500">
                    {errors.case_description.message}
                  </p>
                )}
              </div>

              {/* Contact Type Select */}
              <div className="flex gap-4 w-full">
                <div className="w-[24vw] space-y-2">
                  <Label className="text-[#40444D] w-full font-semibold block">
                    Contact Type
                  </Label>
                  <SearchableSelect
                    options={contactType}
                    value={selectedContactType}
                    onValueChange={(value) =>
                      setSelectedContactType(Number(value))
                    }
                    placeholder="Select Contact Type"
                    searchPlaceholder="Search contact types..."
                    className="w-full"
                  />
                </div>

                {/* Search Contact */}
                <div className="w-full space-y-2">
                  <Label className="text-[#40444D] font-semibold block">
                    Search & Add Contacts
                  </Label>
                  <div className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name="contact_id"
                      render={() => (
                        <Input
                          placeholder="Search by name or email to add..."
                          value={searchContactQuery}
                          onChange={(e) => {
                            setSearchContactQuery(e.target.value);
                            setShowContactTable(true);
                          }}
                          className="flex-1 bg-white"
                        />
                      )}
                    />
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
                </div>
              </div>

              {searchContactQuery && showContactTable && (
                <div
                  className="flex w-full mt-4"
                  style={{ minHeight: '220px' }}
                >
                  <div className="w-1/2 border rounded-lg bg-white shadow overflow-y-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4">Name</th>
                          <th className="py-2 px-2">Case Type</th>
                          <th className="py-2 px-2">Email</th>
                          <th className="py-2 px-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchContactData?.length > 0 ? (
                          searchContactData
                            .filter(
                              (c) =>
                                c.contact_name
                                  .toLowerCase()
                                  .includes(searchContactQuery.toLowerCase()) ||
                                c.primary_email
                                  .toLowerCase()
                                  .includes(searchContactQuery.toLowerCase())
                            )
                            .map((contact) => {
                              const isAlreadyAdded = selectedContacts.find(
                                (c) => c.id === contact.id
                              );
                              return (
                                <tr
                                  key={contact.id}
                                  className={`${
                                    hoveredContact?.id === contact.id
                                      ? 'bg-indigo-50'
                                      : ''
                                  } ${isAlreadyAdded ? 'opacity-50' : ''}`}
                                  onMouseEnter={() =>
                                    setHoveredContact(contact)
                                  }
                                  onMouseLeave={() => setHoveredContact(null)}
                                >
                                  <td className="py-2 px-4">
                                    {contact.contact_name}
                                  </td>
                                  <td className="py-2 px-2">
                                    {contact.contact_type}
                                  </td>
                                  <td className="py-2 px-2">
                                    {contact.primary_email}
                                  </td>
                                  <td className="py-2 px-2">
                                    {isAlreadyAdded ? (
                                      <span className="text-xs text-gray-500">
                                        Added
                                      </span>
                                    ) : (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          handleAddContact(contact)
                                        }
                                        className="h-7 px-2 text-xs bg-indigo-500 text-white hover:bg-indigo-600"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-2 px-2 text-center">
                              No contacts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="w-1/2 pl-4">
                    {hoveredContact && (
                      <div className="border rounded-lg bg-white shadow p-4">
                        <h2 className="font-bold text-lg mb-2">
                          Contact Preview
                        </h2>
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
                    )}
                  </div>
                </div>
              )}

              {/* Selected Contacts Management Section */}
              <div className="w-full mt-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setIsContactsCollapsed(!isContactsCollapsed)
                      }
                    >
                      <h2 className="text-lg font-semibold text-gray-800">
                        Selected Contacts ({selectedContacts.length})
                      </h2>
                      <div className="text-gray-500 hover:text-gray-700 transition-colors">
                        {isContactsCollapsed ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!isContactsCollapsed && selectedContacts.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleUpdateModeToggle}
                          className={`h-8 px-3 text-xs ${
                            updateMode
                              ? 'bg-gray-500 text-white hover:bg-gray-600'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {updateMode ? 'Cancel Update' : 'Update'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleDeleteModeToggle}
                          className={`h-8 px-3 text-xs ${
                            deleteMode
                              ? 'bg-gray-500 text-white hover:bg-gray-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {deleteMode ? 'Cancel' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {!isContactsCollapsed && (
                    <>
                      {/* Delete Mode Actions */}
                      {deleteMode && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                          <p className="text-sm text-red-700">
                            <span className="font-semibold">Delete Mode:</span>{' '}
                            Select contacts to delete ({contactsToDelete.length}{' '}
                            selected)
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            onClick={executeDelete}
                            disabled={contactsToDelete.length === 0}
                            className="h-8 px-3 text-xs bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete Selected ({contactsToDelete.length})
                          </Button>
                        </div>
                      )}

                      {/* Update Mode Info */}
                      {updateMode && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <span className="font-semibold">Update Mode:</span>{' '}
                            Click on a contact to update
                          </p>
                        </div>
                      )}

                      {isArrayWithValues(selectedContacts) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          {selectedContacts.map((contact, index) => (
                            <div
                              key={contact.id}
                              className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                                updateMode
                                  ? 'cursor-pointer hover:border-blue-300'
                                  : ''
                              } ${
                                contactsToDelete.includes(contact.id)
                                  ? 'border-red-300 bg-red-50'
                                  : 'border-gray-200'
                              }`}
                              onClick={() =>
                                updateMode && handleSelectForUpdate(contact)
                              }
                            >
                              {/* Card Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {deleteMode && (
                                    <Checkbox
                                      checked={contactsToDelete.includes(
                                        contact.id
                                      )}
                                      onCheckedChange={() =>
                                        toggleDeleteSelection(contact.id)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="mt-1"
                                    />
                                  )}
                                  {updateMode && !deleteMode && (
                                    <Edit className="w-4 h-4 text-blue-500 mt-1" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {index === 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                      Primary
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Contact Name */}
                              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {contact.contact_name}
                              </h3>

                              {/* Contact Details */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-16">
                                    Type:
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {contact.contact_type || '-'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-16">
                                    Email:
                                  </span>
                                  <span className="text-sm text-gray-700 truncate">
                                    {contact.primary_email || '-'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-16">
                                    Phone:
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {contact.phone || '-'}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-16 mt-0.5">
                                    Address:
                                  </span>
                                  <span className="text-sm text-gray-700 line-clamp-2">
                                    {contact.primary_address || '-'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-16">
                                    Created:
                                  </span>
                                  <span className="text-sm text-gray-700">
                                    {formatDate(contact.date_created)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden mt-2 p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">👥</div>
                            <p className="text-sm font-medium">
                              No contacts selected yet
                            </p>
                            <p className="text-xs text-gray-400">
                              Search and add contacts using the form above
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {errors.contact_id && (
                <p className="text-xs text-red-500">
                  {errors.contact_id.message || 'Contact is required.'}
                </p>
              )}
            </div>

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
                      {isArrayWithValues(matter?.upcoming_event) ? (
                        matter?.upcoming_event.map((event) => (
                          <tr key={event.id}>
                            <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                              {event.title}
                            </td>
                            <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                              {formatDate(event.start_time)}
                            </td>
                            <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                              {formatDate(event.end_time)}
                            </td>
                            <td className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                              {event.priority}
                            </td>
                          </tr>
                        ))
                      ) : (
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
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Button
                type="submit"
                className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
              >
                {updateMatterMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {open && <CreateContactDialog open={open} setOpen={setOpen} />}

      {updateContactDialogOpen && contactToUpdate && (
        <ContactDialog
          open={updateContactDialogOpen}
          setOpen={setUpdateContactDialogOpen}
          mode="update"
          contact={contactToUpdate}
          onSuccess={handleContactUpdateSuccess}
        />
      )}
    </div>
  );
}
