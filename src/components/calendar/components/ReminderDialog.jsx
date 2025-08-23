import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, IconButton, Stack } from '@mui/material';
import { X } from 'lucide-react';

// Reminder Dialog Component
export const ReminderDialog = ({
  open,
  onClose,
  onSubmit,
  editingReminder,
  eventsMeta,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      type_id: '',
      timing_id: '',
      relative_id: '',
      value: '',
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!getValues('type_id')) {
      errors.type_id = 'Reminder type is required';
    }
    if (!getValues('timing_id')) {
      errors.timing_id = 'Timing is required';
    }
    if (!getValues('relative_id')) {
      errors.relative_id = 'Relative to is required';
    }
    if (!getValues('value')) {
      errors.value = 'Value is required';
    }
    return errors;
  };

  useEffect(() => {
    if (editingReminder) {
      reset(editingReminder);
    } else {
      reset({
        type_id: '',
        timing_id: '',
        relative_id: '',
        value: '',
      });
    }
  }, [editingReminder, reset]);

  const handleFormSubmit = () => {
    const errors = validateForm();
    console.log('errors >>>', errors);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const data = getValues();
    console.log('data >>>', data);

    onSubmit(data);
    reset();
  };

  console.log('validationErrors from reminder >>>', validationErrors);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form>
        <Stack className="bg-[#F5F5FA] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-center">
              {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Reminder Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="type_id"
                rules={{ required: 'Reminder type is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Reminder Type" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.event_reminders_type || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.type_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.type_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Timing <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="timing_id"
                rules={{ required: 'Timing is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Timing" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.event_reminders_timing || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.timing_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.timing_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Relative To <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="relative_id"
                rules={{ required: 'Relative to is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Relative To" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.event_reminders_relative || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.relative_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.relative_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Value <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="value"
                rules={{ required: 'Value is required' }}
                render={({ field }) => (
                  <Input {...field} type="number" placeholder="Enter value" />
                )}
              />
              {validationErrors.value && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.value}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleFormSubmit()}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            >
              {editingReminder ? 'Update Reminder' : 'Save Reminder'}
            </Button>
          </div>
        </Stack>
      </form>
    </Dialog>
  );
};
