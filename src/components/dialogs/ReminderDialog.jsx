import React from 'react';
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
import { taskSchema } from '@/pages/tasks/schema/createTaskSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Stack, Divider, IconButton, Switch } from '@mui/material';
import { X } from 'lucide-react';
import getMetaOptions from '@/utils/getMetaFields';
import z from 'zod';

const reminderSchema = z.object({
  type_id: z.string().min(1, 'Type is required'),
  scheduled_at: z.string().min(1, 'Scheduled At is required'),
});

const ReminderDialog = ({
  metaObj,
  reminderDialogOpen,
  setReminderDialogOpen,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type_id: '',
      scheduled_at: '',
    },
    resolver: zodResolver(reminderSchema),
  });

  const handleAddReminderSubmit = (data) => {
    onSubmit(data);
    setReminderDialogOpen(false);
  };

  return (
    <Dialog
      open={reminderDialogOpen}
      onClose={() => setReminderDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <Stack className="bg-[#F5F5FA] rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-center">Add Reminder</h1>
          <IconButton onClick={() => setReminderDialogOpen(false)}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* Form Fields */}
        <div className="flex flex-wrap gap-4 p-4">
          {[
            {
              label: 'Type',
              name: 'type_id',
              type: 'select',
              metaField: 'taks_reminders_type',
            },
            {
              label: 'Scheduled At',
              name: 'scheduled_at',
              type: 'datetime-local',
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

        {/* Footer buttons */}
        <div className="flex items-center justify-end p-4 gap-2">
          <Button
            type="button"
            className="bg-gray-300 text-black hover:bg-gray-400"
            onClick={() => setReminderDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            onClick={handleSubmit(handleAddReminderSubmit)}
          >
            Save Reminder
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default ReminderDialog;
