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
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);

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
    updateMatterMutation.mutate({ slug: slugId, data: getValues() });
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
      case_description: '',
      description: '',
      rating_id: null,
      call_outcome_id: null,
      office_location_id: null
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
      case_description: matter.case_description || '',
      description: matter.description || '',
      rating_id: matter.rating_id || null,
      call_outcome_id: matter.call_outcome_id || null,
      office_location_id: matter.office_location_id || null,
      contact_id: matter.contact_id || null,
    };

    reset(formData);

    if (matter.contact_id) {
      const upcomingContact = contacts.find(
        (contact) => contact.id === matter.contact_id
      );
      if (upcomingContact) {
        setSelectedContact(upcomingContact);
        setSelectedContactType(upcomingContact.contact_type);
      }
    }

    setLoading(false);
  }, [matter, contacts, contactMeta, matterMeta, reset]);

  const formFields = [
    { label: 'Description', name: 'description', type: 'textarea' },
    {
      label: 'Case Role',
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
    { label: 'Case Description', name: 'case_description', type: 'text' },
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
              <div className="w-full">
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
                  .filter(({ name }) => name !== 'description')
                  .map(({ label, name, type, options, required }) => (
                    <div key={name} className="w-full">
                      {type !== 'checkbox' && (
                        <Label className="text-[#40444D] font-semibold mb-2">
                          {label} {required && <span className="text-red-500">*</span>}
                        </Label>
                      )}
                      {type === 'select' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
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
                          )}
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
                            <Input type={type} {...field} />
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

              {/* Contact Type Select */}

              {/* Contact Type Select */}
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
                    Search Contact
                  </Label>
                  <Controller
                    control={control}
                    name="contact_id"
                    render={() => (
                      <Input
                        placeholder="Search by name or email..."
                        value={searchContactQuery}
                        onChange={(e) => {
                          setSearchContactQuery(e.target.value);
                          setShowContactTable(true);
                          setSelectedContact(null);
                        }}
                        className="w-1/2 bg-white"
                        disabled={!selectedContactType} // stays enabled as long as type is chosen
                      />
                    )}
                  />
                  <p className="text-[0.7rem] text-[#40444D] text-start w-1/2">
                    Don't have a contact?{' '}
                    <span
                      onClick={() => setOpen(true)}
                      className="text-[#6366F1] cursor-pointer hover:underline"
                    >
                      Add a new contact
                    </span>
                  </p>
                </div>
              </div>

              {searchContactQuery && showContactTable && !selectedContact && (
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
                            .map((contact) => (
                              <tr
                                key={contact.id}
                                className={`cursor-pointer hover:bg-indigo-100 transition duration-300 ease-in-out ${
                                  hoveredContact?.id === contact.id
                                    ? 'bg-indigo-50'
                                    : ''
                                }`}
                                onMouseEnter={() => setHoveredContact(contact)}
                                onMouseLeave={() => setHoveredContact(null)}
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setShowContactTable(false);
                                  setValue('contact_id', contact.id);
                                }}
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
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-2 px-2 text-center">
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

              {selectedContact && (
                <div className="w-full mt-4">
                  <div className="relative border rounded-lg bg-white shadow p-4">
                    <h2 className="font-bold text-lg mb-2">Selected Contact</h2>
                    <Button
                      variant={'ghost'}
                      type="icon"
                      className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-500 hover:text-white transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedContact(null);
                        setValue('contact_id', '');
                        setShowContactTable(true);
                      }}
                    >
                      <Edit className="w-8 h-8" />
                    </Button>
                    <p>
                      <span className="font-semibold">Name:</span>{' '}
                      {selectedContact.contact_name}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span>{' '}
                      {selectedContact.contact_type}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{' '}
                      {selectedContact.primary_email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{' '}
                      {selectedContact.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{' '}
                      {selectedContact.primary_address}
                    </p>
                    <p>
                      <span className="font-semibold">Created:</span>{' '}
                      {selectedContact.date_created}
                    </p>
                  </div>
                </div>
              )}

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
    </div>
  );
}
