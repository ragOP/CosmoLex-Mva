import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
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
import { useQuery } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContacts from '@/pages/matter/intake/helpers/getContacts';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import isArrayWithValues from '@/utils/isArrayWithValues';

export default function UpdateMatterDialog({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  slug = '',
}) {
  const [selectedContactType, setSelectedContactType] = useState(null);
  const [searchContactQuery, setSearchContactQuery] = useState('');

  const { data: matter, isLoading } = useQuery({
    queryKey: ['matter', slug],
    queryFn: () => getMatter({ slug }),
    enabled: !!slug,
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

  useEffect(() => {
    if (matter) {
      reset({
        ...matter,
      });
    }
  }, [matter, reset]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#F5F5FA] rounded-lg w-full max-w-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0px_4px_24px_0px_#000000] no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#40444D] text-center font-bold font-sans">
            Update Task
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(() => {
              onSubmit(getValues());
              onClose();
            })}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map(({ label, name, type, required, options }) => (
                <div key={name}>
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
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {options.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={
                                    name === 'assignee_id' ||
                                    name === 'owner_id'
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
                    <p className="text-xs text-red-500">
                      {errors[name].message}
                    </p>
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

                      {searchContactQuery &&
                        isArrayWithValues(searchContactData) && (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedContactType}
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

            <DialogFooter className="pt-4 flex justify-end gap-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
              >
                Update Matter
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
