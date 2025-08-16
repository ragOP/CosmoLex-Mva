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

const formFields = [
  { label: 'Client Name', name: 'client_name', type: 'text', required: true },
  { label: 'Task Type', name: 'task_type', type: 'text' },
  { label: 'Subject', name: 'subject', type: 'text', required: true },
  { label: 'Description', name: 'description', type: 'text' },
  { label: 'Due Date', name: 'due_date', type: 'date' },
  {
    label: 'UTBMS Code',
    name: 'utbms_code',
    type: 'select',
    options: ['A101', 'B202'],
  },
  {
    label: 'Priority',
    name: 'priority',
    type: 'select',
    options: ['High', 'Medium', 'Low'],
  },
  {
    label: 'Status',
    name: 'status',
    type: 'select',
    options: ['Pending', 'In Progress', 'Completed'],
  },
  { label: 'Billable', name: 'billable', type: 'checkbox' },
  { label: 'Notify Text', name: 'notify_text', type: 'checkbox' },
  { label: 'Add Calendar Event', name: 'add_calendar_event', type: 'checkbox' },
  {
    label: 'Trigger Appointment Reminders',
    name: 'trigger_appointment_reminders',
    type: 'checkbox',
  },
];

export default function CreateTaskDialog({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  task = {},
}) {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [assignedToDialogOpen, setAssignedToDialogOpen] = useState(false);
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getEventsUserList,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      client_name: '',
      task_type: '',
      subject: '',
      description: '',
      due_date: '',
      priority: '',
      utbms_code: '',
      billable: false,
      notify_text: false,
      add_calendar_event: false,
      trigger_appointment_reminders: false,
      status: 'Pending',
      assigned_to: [],
      reminders: [],
    },
    resolver: zodResolver(taskSchema),
  });

  const {
    fields: reminderFields,
    append: appendReminder,
    remove: removeReminder,
  } = useFieldArray({
    control,
    name: 'reminders',
  });
  const {
    fields: assignedToFields,
    append: appendAssignedTo,
    remove: removeAssignedTo,
  } = useFieldArray({
    control,
    name: 'assigned_to',
  });

  const [newReminder, setNewReminder] = useState({
    sound: '',
    value: '',
    timing: '',
    relative_to: '',
  });
  const [newAssignedTo, setNewAssignedTo] = useState({
    email: '',
    role: '',
    status: '',
    comment: '',
    address_type: '',
    is_primary: false,
  });

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

  const handleAddAssignedToSubmit = () => {
    appendAssignedTo(newAssignedTo);
    setNewAssignedTo({
      email: '',
      role: '',
      status: '',
      comment: '',
      address_type: '',
      is_primary: false,
    });
    setAssignedToDialogOpen(false);
  };

  useEffect(() => {
    if (task && task.id) {
      reset({
        ...task,
        reminders: task.reminders || [],
        assigned_to: task?.assignees?.map((assignee) => assignee.id) || [],
      });
    }
  }, [task?.id, task?.reminders, task?.assignees]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000] ">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans ">
              {task.id ? 'Update Task' : 'Create New Task'}
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
            <div className="flex flex-wrap gap-4 overflow-auto">
              {formFields.map(({ label, name, type, required, options }) => (
                <div key={name} className="w-full md:w-[49%]">
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <Label className="text-[#40444D] font-semibold">
                        {label}:{' '}
                      </Label>
                      <Controller
                        control={control}
                        name={name}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
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
            </div>

            <div className="flex flex-wrap gap-4 overflow-auto">
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
                    <Tooltip arrow title="Remove Reminder">
                      <IconButton
                        type="button"
                        onClick={() => removeReminder(idx)}
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

              <div className="w-full">
                <h3 className="text-lg font-semibold mb-1">Assigned To</h3>
                {assignedToFields.map((assignedTo, idx) => (
                  <div
                    key={assignedTo.id}
                    className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                  >
                    <p className="text-sm">
                      {assignedTo.user}, {assignedTo.role}, {assignedTo.status},{' '}
                      {assignedTo.comment}
                    </p>
                    <Tooltip arrow title="Remove Assigned To">
                      <IconButton
                        type="button"
                        onClick={() => removeAssignedTo(idx)}
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => setAssignedToDialogOpen(true)}
                  variant="outline"
                  className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Assigned To
                </Button>
              </div>
            </div>
          </div>
          <Divider />

          <div className="flex items-center justify-end p-4 gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => onSubmit()}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            >
              Create Task
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-center">Add Reminder</h1>
            <IconButton onClick={() => setReminderDialogOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <div className="flex flex-wrap gap-4 p-4">
            {[
              { label: 'Sound', name: 'sound', type: 'text' },
              { label: 'Value', name: 'value', type: 'number' },
              { label: 'Timing', name: 'timing', type: 'date' },
              { label: 'Relative To', name: 'relative_to', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="w-full md:w-[49%]">
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

          <Divider />

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

      {/* Assigned To Dialog */}
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
              { label: 'User', name: 'user', type: 'select', options: users },
              { label: 'Role', name: 'role', type: 'text' },
              { label: 'Status', name: 'status', type: 'text' },
            ].map(({ label, name, type, options }) => (
              <div key={name} className="w-full md:w-[49%]">
                <Label className="text-[#40444D] font-semibold mb-2">
                  {label}
                </Label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <>
                      {type === 'text' && (
                        <Input
                          {...field}
                          type={type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={name.replace('_', ' ')}
                        />
                      )}

                      {type === 'select' && (
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select User" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            portal={false}
                            className="z-[9999] w-full"
                          >
                            <SelectGroup>
                              {options?.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                />
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
              onClick={handleAddAssignedToSubmit}
            >
              Save Assigned To
            </Button>
          </div>
        </Stack>
      </Dialog>
    </>
  );
}
