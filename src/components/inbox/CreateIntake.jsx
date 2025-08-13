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
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatterSchema } from '@/pages/matter/intake/schema/createMatterSchema';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContactMeta from '@/pages/matter/intake/helpers/getContactMeta';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import createMatter from '@/pages/matter/intake/helpers/createMatter';
import { useNavigate } from 'react-router-dom';
import CreateContactDialog from './CreateContactDialog';
import { X } from 'lucide-react';
import BreadCrumb from '@/components/BreadCrumb';

export default function CreateIntake() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [showContactTable, setShowContactTable] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const createMatterMutation = useMutation({
    mutationFn: createMatter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
      navigate('/dashboard/inbox');
    },
  });

  const { data: matterMeta } = useQuery({
    queryKey: ['matterMeta'],
    queryFn: getMatterMeta,
  });

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
            globalSearchBar: searchContactQuery,
            contact_type: selectedContactType,
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

  const handleCreateIntake = (data) => {
    createMatterMutation.mutate({ data });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
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
    },
    resolver: zodResolver(createMatterSchema),
  });

  const contactType = contactMeta?.contact_type || [];

  const formFields = [
    {
      label: 'Case Role',
      name: 'case_role_id',
      type: 'select',
      required: true,
      options: matterMeta?.case_role || [],
    },
    {
      label: 'Case Type',
      name: 'case_type_id',
      type: 'select',
      options: matterMeta?.case_type || [],
    },
    {
      label: 'Case Status',
      name: 'case_status_id',
      type: 'select',
      required: true,
      options: matterMeta?.case_status || [],
    },
    {
      label: 'Marketing Source',
      name: 'marketing_source_id',
      type: 'select',
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
  ];

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-[#F5F5FA] rounded-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <h1 className="text-2xl text-[#40444D] text-center font-bold font-sans">
          Create Intake
        </h1>

        <form
          onSubmit={handleSubmit((data) => handleCreateIntake(data))}
          className="space-y-4 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {formFields.map(({ label, name, type, options }) => (
              <div key={name} className="w-full">
                {type !== 'checkbox' && (
                  <Label className="text-[#40444D] font-semibold mb-2">
                    {label}
                  </Label>
                )}
                {type === 'select' ? (
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString() ?? ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {options.map((option) => (
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
                    render={({ field }) => <Input type={type} {...field} />}
                  />
                )}
                {errors[name] && (
                  <p className="text-xs text-red-500">{errors[name].message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Type Select */}
          <div className="w-full space-y-2">
            <Label className="text-[#40444D] font-semibold block">
              Contact Type
            </Label>
            <Select onValueChange={setSelectedContactType}>
              <SelectTrigger className="w-1/4">
                <SelectValue placeholder="Select Contact Type" />
              </SelectTrigger>
              <SelectContent>
                {contactType.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Contact */}
          <div className="relative space-y-2">
            <Label className="text-[#40444D] font-semibold block">
              Search Contact
            </Label>
            <Controller
              control={control}
              name="contact_id"
              render={() => (
                <>
                  <Input
                    placeholder="Search by name or email..."
                    value={searchContactQuery}
                    onChange={(e) => {
                      setSearchContactQuery(e.target.value);
                      setShowContactTable(true);
                      setSelectedContact(null);
                    }}
                    className="w-1/2"
                    disabled={!selectedContactType}
                  />
                </>
              )}
            />
            <p className="text-[0.7rem] text-[#40444D] text-end w-1/2">
              Don't have a contact?{' '}
              <span
                onClick={() => setOpen(true)}
                className="text-[#6366F1] cursor-pointer hover:underline"
              >
                Add a new contact
              </span>
            </p>
            {searchContactQuery && showContactTable && !selectedContact && (
              <div className="flex w-full mt-4" style={{ minHeight: '220px' }}>
                <div className="w-1/2 border rounded-lg bg-transparent shadow p-2 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-2">Name</th>
                        <th className="py-2 px-2">Type</th>
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
                              <td className="py-2 px-2">
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
                    <div className="border rounded-lg bg-transparent shadow p-4">
                      <h2 className="font-bold text-lg mb-2">
                        Contact Preview
                      </h2>
                      <p>
                        <span className="font-semibold">Name:</span>{' '}
                        {hoveredContact?.contact_name}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span>{' '}
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
                <div className="relative border rounded-lg bg-transparent shadow p-4">
                  <h2 className="font-bold text-lg mb-2">Selected Contact</h2>
                  <Button
                    variant={'ghost'}
                    type="icon"
                    size={12}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedContact(null);
                      setValue('contact_id', '');
                      setShowContactTable(true);
                    }}
                  >
                    <X className="w-4 h-4" />
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

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-4">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
            >
              Create Intake
            </Button>
          </div>
        </form>
      </div>

      {open && <CreateContactDialog open={open} setOpen={setOpen} />}
    </div>
  );
}
