import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  Divider,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Chip,
} from '@mui/material';
import { Trash2, Plus, X, Edit, Loader2, Paperclip } from 'lucide-react';
import { useEvents } from '@/components/calendar/hooks/useEvent';
import { toast } from 'sonner';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import SearchDialog from '@/components/dialogs/SearchDialog';
import { searchTask } from '@/api/api_services/task';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

// Reminder Dialog Component
export const ReminderDialog = ({
  open,
  onClose,
  onSubmit,
  editingReminder,
  eventsMeta,
}) => {
  /**
   *       "type_id": 23,
      "timing_id": 27,
      "value": 15,
      "relative_id": 31
   */
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      type_id: '',
      timing_id: '',
      relative_to_id: '',
      value: '',
    },
  });

  useEffect(() => {
    if (editingReminder) {
      reset(editingReminder);
    } else {
      reset({
        type_id: '',
        timing_id: '',
        relative_to_id: '',
        value: '',
      });
    }
  }, [editingReminder, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                Reminder Type *
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
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Timing *
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
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Relative To *
              </Label>
              <Controller
                control={control}
                name="relative_to_id"
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
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Value *
              </Label>
              <Controller
                control={control}
                name="value"
                rules={{ required: 'Value is required' }}
                render={({ field }) => (
                  <Input {...field} type="number" placeholder="Enter value" />
                )}
              />
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
              type="submit"
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
