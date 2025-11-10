import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Plus, Trash2 } from 'lucide-react';
import { contactSchema } from '@/pages/matter/intake/schema/contactSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import getContacts from '@/pages/matter/intake/helpers/getContacts';
import searchContact from '@/pages/matter/intake/helpers/searchContact';
import isArrayWithValues from '@/utils/isArrayWithValues';
import createContact from '../intake/helpers/createContact';
import formatCanadianPhone from '@/utils/formatPhoneNo';

export default function CreateContact() {
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      nature: '',
      contact_type: '',
      prefix: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix: '',
      gender: '',
      alias: '',
      marital_status: '',
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
      firm_id: '',
      created_by: '',
      ad_campaign: '',
      addresses: [
        {
          address_1: '',
          address_2: '',
          city: '',
          county: '',
          state: '',
          zip: '',
          country: '',
          is_primary: false,
          address_type: '',
        },
      ],
    },
    resolver: zodResolver(contactSchema),
  });
  const {
    fields: addressFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  const contactType = [
    { id: 1, name: 'Client' },
    { id: 2, name: 'Attorney' },
  ];

  const formFields = [
    {
      label: 'Nature',
      name: 'nature',
      type: 'select',
      required: true,
      options: [
        { id: 1, name: 'Individual' },
        { id: 2, name: 'Business' },
      ],
    },
    {
      label: 'Contact Type',
      name: 'contact_type',
      type: 'select',
      required: true,
      options: contactType,
    },
    {
      label: 'Prefix',
      name: 'prefix',
      type: 'select',
      required: true,
      options: ['Mr', 'Mrs', 'Ms', 'Dr', 'Rev', 'Prof', 'Other'],
    },
    { label: 'First Name', name: 'first_name', type: 'text', required: true },
    { label: 'Middle Name', name: 'middle_name', type: 'text', required: true },
    { label: 'Last Name', name: 'last_name', type: 'text', required: true },
    {
      label: 'Suffix',
      name: 'suffix',
      type: 'select',
      required: true,
      options: [
        'Jr',
        'Sr',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
      ],
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      required: true,
      options: ['M', 'F', 'Other'],
    },
    { label: 'Alias', name: 'alias', type: 'text', required: false },
    {
      label: 'Marital Status',
      name: 'marital_status',
      type: 'select',
      required: false,
      options: ['Single', 'Married', 'Divorced', 'Widowed'],
    },
    { label: 'Company Name', name: 'company_name', type: 'text' },
    { label: 'Job Title', name: 'job_title', type: 'text' },
    { label: 'SSN', name: 'ssn', type: 'text' },
    { label: 'Federal Tax ID', name: 'federal_tax_id', type: 'text' },
    { label: 'Work Phone', name: 'work_phone', type: 'text' },
    { label: 'Home Phone', name: 'home_phone', type: 'text' },
    { label: 'Primary Phone', name: 'primary_phone', type: 'text' },
    { label: 'Fax', name: 'fax', type: 'text' },
    { label: 'Primary Email', name: 'primary_email', type: 'text' },
    { label: 'Secondary Email', name: 'secondary_email', type: 'text' },
    {
      label: 'When to Contact',
      name: 'when_to_contact',
      type: 'select',
      options: ['Morning', 'Afternoon', 'Evening'],
    },
    {
      label: 'Contact Preference',
      name: 'contact_preference',
      type: 'select',
      options: ['Phone', 'Email', 'SMS'],
    },
    {
      label: 'Language',
      name: 'language',
      type: 'text',
    },
    {
      label: "Driver's License",
      name: 'drivers_license',
      type: 'text',
    },
    {
      label: 'Date of Birth',
      name: 'date_of_birth',
      type: 'date',
    },
    {
      label: 'Date of Death',
      name: 'date_of_death',
      type: 'date',
    },
    {
      label: 'Date of Bankruptcy',
      name: 'date_of_bankruptcy',
      type: 'date',
    },
    {
      label: 'Notes',
      name: 'notes',
      type: 'text',
    },
    {
      label: 'Firm ID',
      name: 'firm_id',
      type: 'number',
    },
    {
      label: 'Created By',
      name: 'created_by',
      type: 'number',
    },
  ];

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success('Contact created successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create contact');
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    createContactMutation.mutate({ data });
  };

  console.log(errors);
  return (
    <div>
      <div className="bg-[#F5F5FA] rounded-lg w-full p-6 space-y-6 h-full overflow-y-auto no-scrollbar">
        <div>
          <h1 className="text-2xl text-[#40444D] text-center font-bold font-sans">
            Create New Matter
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(() => {
            onSubmit(getValues());
            reset();
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map(({ label, name, type, required, options }) => (
              <div key={name} className="w-full">
                {type != 'checkbox' && (
                  <Label className="text-[#40444D] font-semibold mb-2">
                    {label}
                  </Label>
                )}

                {type === 'select' ? (
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {options.map((option, index) => (
                                <SelectItem
                                  key={option.id || index}
                                  value={option.name || option}
                                >
                                  {option.name || option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors[name] && (
                          <p className="text-xs text-red-500">
                            {errors[name].message}
                          </p>
                        )}
                      </>
                    )}
                  />
                ) : type === 'checkbox' ? (
                  <>
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
                    {errors[name] && (
                      <p className="text-xs text-red-500">
                        {errors[name].message}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => (
                        <Input
                          type={type}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (
                              [
                                'work_phone',
                                'home_phone',
                                'primary_phone',
                                'fax',
                              ].includes(name)
                            ) {
                              value = formatCanadianPhone(value);
                            }
                            field.onChange(value);
                          }}
                          value={field.value || ''}
                        />
                      )}
                    />

                    {errors[name] && (
                      <p className="text-xs text-red-500">
                        {errors[name].message}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
            <div>
              <h3 className="text-lg font-semibold">Addresses</h3>
              {addressFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border p-4 my-2 rounded-lg space-y-2"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'address_1',
                      'address_2',
                      'city',
                      'county',
                      'state',
                      'zip',
                      'country',
                    ].map((key) => (
                      <Controller
                        key={key}
                        name={`addresses.${index}.${key}`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder={key.replace('_', ' ')}
                            {...field}
                          />
                        )}
                      />
                    ))}

                    <Controller
                      name={`addresses.${index}.address_type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Address Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Controller
                      name={`addresses.${index}.is_primary`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label>Is Primary?</Label>
                        </div>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:bg-red-100"
                    variant="ghost"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Address
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  append({
                    address_1: '',
                    address_2: '',
                    city: '',
                    county: '',
                    state: '',
                    zip: '',
                    country: '',
                    is_primary: false,
                    address_type: '',
                  })
                }
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <div>
              <Button
                type="button"
                className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
            <Button
              type="submit"
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
