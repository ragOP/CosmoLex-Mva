import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomButton from '../CustomButton';
import { Label } from '@/components/ui/label';
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
} from '@mui/material';
import { Trash2, Plus, X } from 'lucide-react';

const repeatOptions = ['never', 'daily', 'weekly', 'monthly', 'yearly'];

export default function NewEventDialogRHF({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  selectedDateRange = null,
}) {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      category_id: '',
      all_day: false,
      priority: '',
      status: '',
      repeat: '',
      reminders: [],
      participants: [],
    },
  });

  // Auto-populate dates when selectedDateRange changes
  React.useEffect(() => {
    if (selectedDateRange && selectedDateRange.start && selectedDateRange.end) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
      const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setValue('start_time', formatDateForInput(selectedDateRange.start));
      setValue('end_time', formatDateForInput(selectedDateRange.end));
    }
  }, [selectedDateRange, setValue]);

  const {
    fields: reminderFields,
    append: appendReminder,
    remove: removeReminder,
  } = useFieldArray({
    control,
    name: 'reminders',
  });

  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control,
    name: 'participants',
  });

  const [newParticipant, setNewParticipant] = useState({
    email: '',
    role: '',
    status: '',
    comment: '',
    address_type: '',
    is_primary: false,
  });

  const handleAddParticipantSubmit = () => {
    appendParticipant(newParticipant);
    setNewParticipant({
      email: '',
      role: '',
      status: '',
      comment: '',
      address_type: '',
      is_primary: false,
    });
    setParticipantDialogOpen(false);
  };

  const handleAddReminderSubmit = () => {
    appendReminder(newReminder);
    setNewReminder({
      sound: '',
      value: '',
      timing: '',
      relative_to: '',
    });
    setReminderDialogOpen(false);
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000] ">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans ">
              Create New Event
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>Title: </Label>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={`border ${
                        errors.title ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>Description: </Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={`border ${
                        errors.description ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>Start Time: </Label>
                <Controller
                  control={control}
                  name="start_time"
                  rules={{ required: 'Start time is required' }}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      {...field}
                      className={`border ${
                        errors.start_time ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.start_time && (
                  <p className="text-red-500 text-sm">
                    {errors.start_time.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>End Time: </Label>
                <Controller
                  control={control}
                  name="end_time"
                  rules={{ required: 'End time is required' }}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      {...field}
                      className={`border ${
                        errors.end_time ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.end_time && (
                  <p className="text-red-500 text-sm">
                    {errors.end_time.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>Category ID: </Label>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      className={`border ${
                        errors.category_id ? 'border-red-500' : ''
                      }`}
                    />
                  )}
                />
                {errors.category_id && (
                  <p className="text-red-500 text-sm">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="w-full md:w-[49%] flex flex-col gap-2">
                <Label>All Day: </Label>
                <Switch
                  checked={getValues('all_day')}
                  onChange={(e) => setValue('all_day', e.target.checked)}
                />
                {/* <Controller
                control={control}
                name="all_day"
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select All Day Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={true}>True</SelectItem>
                        <SelectItem value={false}>False</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              /> */}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-[49%] flex flex-col space-y-2">
                <Label>Repeat</Label>
                <Controller
                  control={control}
                  name="repeat"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Repeat Option" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        portal={false}
                        className="z-[9999]"
                      >
                        <SelectGroup>
                          {repeatOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="w-full md:w-[49%] flex flex-col space-y-2">
                <Label>Priority</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Priority Option" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        portal={false}
                        className="z-[9999]"
                      >
                        <SelectGroup>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="w-full md:w-[49%] flex flex-col space-y-2">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status Option" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        portal={false}
                        className="z-[9999]"
                      >
                        <SelectGroup>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Reminders Section */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-1">Reminders</h3>
              {reminderFields.map((reminder, idx) => (
                <div
                  key={reminder.id}
                  className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                >
                  <p className="text-sm">
                    {reminder.sound}, {reminder.value}, {reminder.timing},{' '}
                    {reminder.relative_to}
                  </p>
                  <Tooltip arrow title="Remove Participant">
                    <IconButton
                      type="button"
                      onClick={() => remove(idx)}
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => setReminderDialogOpen(true)}
                variant="outline"
                className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </div>

            {/* Participants Section */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-1">Participants</h3>
              {participantFields.map((participant, idx) => (
                <div
                  key={participant.id}
                  className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                >
                  <p className="text-sm">
                    {participant.email}, {participant.role},{' '}
                    {participant.status}
                  </p>
                  <Tooltip arrow title="Remove Participant">
                    <IconButton
                      type="button"
                      onClick={() => remove(idx)}
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => setParticipantDialogOpen(true)}
                variant="outline"
                className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Participant
              </Button>
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-end p-4 gap-2">
            <Button
              onClick={onClose}
              className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={(data) => onSubmit(data)}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
            >
              Submit
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Dialog for Reminder */}
      <Dialog
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-center">Add Reminder</h1>
            <IconButton onClick={() => setReminderDialogOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Sound', name: 'sound', type: 'text' },
              { label: 'Value', name: 'value', type: 'number' },
              { label: 'Timing', name: 'timing', type: 'date' },
              { label: 'Relative To', name: 'relative_to', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="w-full">
                <Label className="text-[#40444D] font-semibold mb-2">
                  {label}
                </Label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={type}
                      value={field.value}
                      onChange={(e) => setValue(name, e.target.value)}
                      placeholder={name.replace('_', ' ')}
                    />
                  )}
                />
              </div>
            ))}
          </div>

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
              onClick={handleAddReminderSubmit}
            >
              Save Reminder
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Dialog for participants */}
      <Dialog
        open={participantDialogOpen}
        onClose={() => setParticipantDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-center">Add Participant</h1>
            <IconButton onClick={() => setParticipantDialogOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Role', name: 'role', type: 'text' },
              { label: 'Status', name: 'status', type: 'text' },
              { label: 'Comment', name: 'comment', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="w-full">
                <Label className="text-[#40444D] font-semibold mb-2">
                  {label}
                </Label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={type}
                      value={field.value}
                      onChange={(e) => setValue(name, e.target.value)}
                      placeholder={name.replace('_', ' ')}
                    />
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end p-4 gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={() => setParticipantDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              onClick={handleAddParticipantSubmit}
            >
              Save Participant
            </Button>
          </div>
        </Stack>
      </Dialog>
    </>
  );
}
