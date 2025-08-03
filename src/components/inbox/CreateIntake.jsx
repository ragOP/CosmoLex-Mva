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
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMatterSchema } from '@/pages/matter/intake/schema/createMatterSchema';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContacts from '@/pages/matter/intake/helpers/getContacts';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import isArrayWithValues from '@/utils/isArrayWithValues';
import createMatter from '@/pages/matter/intake/helpers/createMatter';
import { useNavigate } from 'react-router-dom';
import CreateContactDialog from './CreateContactDialog';

export default function CreateIntake() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');

  console.log(open);
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
  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const { data: searchContactData, refetch: refetchSearchContact } = useQuery({
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
  }, [searchContactQuery, selectedContactType]);

  const handleCreateIntake = async (data) => {
    console.log(data);
    createMatterMutation.mutate({ data });
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
      case_role: '',
      case_type: '',
      case_status: '',
      marketing_source: '',
      assignee_id: '',
      owner_id: '',
      ad_campaign: '',
      case_description: '',
      contacts_id: '',
    },
    resolver: zodResolver(createMatterSchema),
  });

  const contactType = [
    { id: 1, name: 'Client' },
    { id: 2, name: 'Attorney' },
  ];

  const formFields = [
    {
      label: 'Case Role',
      name: 'case_role',
      type: 'select',
      required: true,
      options: matterMeta?.case_roles || [],
    },
    {
      label: 'Case Type',
      name: 'case_type',
      type: 'select',
      options: matterMeta?.case_types || [],
    },
    {
      label: 'Case Status',
      name: 'case_status',
      type: 'select',
      required: true,
      options: matterMeta?.case_statuses || [],
    },
    {
      label: 'Marketing Source',
      name: 'marketing_source',
      type: 'select',
      options: matterMeta?.marketing_sources || [],
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
      name: 'ad_campaign',
      type: 'select',
      options: matterMeta?.ad_campaigns || [],
    },
    { label: 'Case Description', name: 'case_description', type: 'text' },
  ];

  console.log(getValues());

  return (
    <div className="flex items-center justify-center">
      <div className="bg-[#F5F5FA] rounded-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl text-[#40444D] text-center font-bold font-sans">
            Create Intake
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(() => {
            console.log(getValues());
            handleCreateIntake(getValues());
          })}
          className="space-y-4 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {formFields.map(({ label, name, type, required, options }) => (
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="w-full"
                      >
                        <SelectTrigger>
                          <SelectValue
                            className="w-full"
                            placeholder={`Select ${label}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {options.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={
                                  name === 'assignee_id' || name === 'owner_id'
                                    ? option.id
                                    : option.name
                                }
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
                  <div className="flex items-center space-x-2">
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
                    <Label className="text-[#40444D] font-semibold">
                      {label}
                    </Label>
                  </div>
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

            <div className="relative space-y-2">
              <Label className="text-[#40444D] font-semibold block">
                Search Contact
              </Label>

              <Controller
                control={control}
                name="contacts_id"
                render={({ field }) => (
                  <>
                    <Input
                      placeholder="Search by name or email..."
                      value={searchContactQuery}
                      onChange={(e) => setSearchContactQuery(e.target.value)}
                      disabled={!selectedContactType}
                    />

                    <p className="text-[0.7rem] text-[#40444D] text-end">
                      Don't have a contact?{' '}
                      <span
                        onClick={() => setOpen(true)}
                        className="text-[#6366F1] cursor-pointer hover:underline"
                      >
                        Add a new contact
                      </span>
                    </p>

                    {searchContactQuery &&
                      isArrayWithValues(searchContactData) && (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedContactType}
                          className="w-full"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Contact" />
                          </SelectTrigger>
                          <SelectContent>
                            {searchContactData?.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.prefix} {contact.first_name}
                                {contact.middle_name} {contact.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                  </>
                )}
              />
              {errors.contacts_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.contacts_id.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-[#40444D] font-semibold mb-2 block">
                Select Contact Type
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedContactType(value);
                  setSearchContactQuery(''); // reset search when type changes
                }}
                value={selectedContactType}
                className="w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Contact Type" />
                </SelectTrigger>
                <SelectContent>
                  {contactType.map((contact) => (
                    <SelectItem key={contact.id} value={contact.name}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <div>
              <Button
                type="button"
                className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
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
