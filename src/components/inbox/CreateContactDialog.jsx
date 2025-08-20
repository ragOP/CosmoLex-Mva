import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, X } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import createContact from '@/pages/matter/intake/helpers/createContact';
import getContactMeta from '@/pages/matter/intake/helpers/getContactMeta';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';

export default function CreateContactDialog({ open, setOpen }) {
  const { data: contactMeta } = useQuery({
    queryKey: ['contactMeta'],
    queryFn: getContactMeta,
  });

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
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
    },
  });

  const {
    fields: addressFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'addresses',
  });

  const formFields = [
    {
      label: 'Nature',
      name: 'nature',
      type: 'select',
      options: [
        { id: 'Individual', name: 'Individual' },
        { id: 'Business', name: 'Business' },
      ],
    },
    {
      label: 'Contact Type',
      name: 'contact_type_id',
      type: 'select',
      options: contactMeta?.contact_type || [],
    },
    {
      label: 'Prefix',
      name: 'prefix_id',
      type: 'select',
      options: contactMeta?.prefix || [],
    },
    { label: 'First Name', name: 'first_name', type: 'text', required: true },
    { label: 'Middle Name', name: 'middle_name', type: 'text' },
    { label: 'Last Name', name: 'last_name', type: 'text', required: true },
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
    { label: 'When to Contact', name: 'when_to_contact', type: 'text' },
    { label: 'Contact Preference', name: 'contact_preference', type: 'text' },
    { label: 'Language', name: 'language', type: 'text' },
    { label: "Driver's License", name: 'drivers_license', type: 'text' },
    { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
    { label: 'Date of Death', name: 'date_of_death', type: 'date' },
    { label: 'Date of Bankruptcy', name: 'date_of_bankruptcy', type: 'date' },
    { label: 'Notes', name: 'notes', type: 'text' },
  ];

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: (res) => {
      console.log('[DEBUG] Contact created successfully:', res);
      toast.success('Contact created successfully');
      setOpen(false);
    },
    onError: (error) => {
      console.error('[DEBUG] Create contact error:', error);
      toast.error(error?.response?.data?.message || 'Failed to create contact');
    },
  });

  const onSubmit = (data) => {
    console.log('[DEBUG] Submitting contact data:', data);
    createContactMutation.mutate({ data });
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

  const handleAddAddressSubmit = () => {
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
              Create New Contact
            </h1>
            <IconButton onClick={() => setOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
            <div className="flex flex-wrap  gap-4 overflow-auto">
              {formFields.map(({ label, name, type, required, options }) => (
                <div key={name} className="w-full md:w-[49%]">
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
                          onValueChange={(val) => {
                            console.log(`[DEBUG] Setting ${name}:`, val);
                            field.onChange(isNaN(val) ? val : Number(val));
                          }}
                          value={field.value?.toString() ?? ''}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            portal={false}
                            className="z-[9999]"
                          >
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
                  ) : (
                    <Controller
                      control={control}
                      name={name}
                      render={({ field }) => <Input type={type} {...field} />}
                    />
                  )}
                </div>
              ))}

              {/* Address Section */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-1">Addresses</h3>
                {addressFields.map((addr, idx) => (
                  <div
                    key={addr.id}
                    className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                  >
                    <p className="text-sm">
                      {addr.address_1}, {addr.city}, {addr.state}
                    </p>
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
            >
              Create Contact
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
              'address_1',
              'address_2',
              'city',
              'county',
              'state',
              'zip',
              'country',
            ].map((field) => (
              <div key={field}>
                <Label className="text-[#40444D] font-semibold mb-2">
                  {field.replace('_', ' ')}
                </Label>
                <Input
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                />
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
                onChange={(e) =>
                  setNewAddress({ ...newAddress, is_primary: e.target.checked })
                }
              />
            </div>
          </div>

          <DialogActions>
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={() => setAddressDialogOpen(false)}
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
