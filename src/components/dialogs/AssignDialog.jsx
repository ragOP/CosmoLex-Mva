import React, { useState, useEffect } from 'react';
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
import { taskSchema } from '@/pages/tasks/schema/createTaskSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import getEventsUserList from '@/pages/calendar/helpers/getEventsUserList';
import {
  Dialog,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import { Plus, Trash2, X } from 'lucide-react';
import ReminderDialog from '@/components/dialogs/ReminderDialog';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import z from 'zod';
import getMetaOptions from '@/utils/getMetaFields';

const assignSchema = z.object({
  user_id: z.string().min(1, 'User is required'),
});

const AssignDialog = ({
  metaObj,
  assignedToDialogOpen,
  setAssignedToDialogOpen,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: '',
    },
    resolver: zodResolver(assignSchema),
  });

  const handleAddAssignedToSubmit = (data) => {
    onSubmit(data);
    setAssignedToDialogOpen(false);
  };

  return (
    <Dialog
      open={assignedToDialogOpen}
      onClose={() => setAssignedToDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <Stack className="bg-[#F5F5FA] rounded-lg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-center">Add Assigned To</h1>
          <IconButton onClick={() => setAssignedToDialogOpen(false)}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        <div className="flex flex-wrap gap-4 p-4">
          {[
            {
              label: 'User',
              name: 'user_id',
              type: 'select',
              metaField: 'assignees',
            },
          ].map(({ label, name, type, metaField }) => (
            <div key={name} className="w-full md:w-[49%]">
              {type !== 'checkbox' && (
                <Label
                  htmlFor={name}
                  className="text-[#40444D] font-semibold mb-2 block"
                >
                  {label}
                </Label>
              )}

              {/* Select */}
              {type === 'select' ? (
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger id={name} className="w-full">
                        <SelectValue placeholder={`Select ${label}`} />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        portal={false}
                        className="z-[9999]"
                      >
                        <SelectGroup>
                          {getMetaOptions({ metaField, metaObj }).map(
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
              ) : type === 'checkbox' ? (
                // Checkbox / Switch
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Switch
                        checked={field.value || false}
                        onChange={(_, checked) => field.onChange(checked)} // ✅ fixed binding
                      />
                    )}
                  />
                  <Label
                    htmlFor={name}
                    className="text-[#40444D] font-semibold"
                  >
                    {label}
                  </Label>
                </div>
              ) : (
                // Input (text, date, etc.)
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      id={name}
                      type={type}
                      {...field}
                      value={
                        type === 'date' && field.value
                          ? field.value.split('T')[0] // ✅ ensure correct date format
                          : field.value || ''
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              )}

              {/* Validation errors */}
              {errors[name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[name].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <Divider />

        <div className="flex items-center justify-end p-4 gap-2">
          <Button
            type="button"
            className="bg-gray-300 text-black hover:bg-gray-400"
            onClick={() => setAssignedToDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            onClick={handleSubmit(handleAddAssignedToSubmit)}
          >
            Save Assigned To
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default AssignDialog;
