import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '@/pages/tasks/schema/createTaskSchema';
import { useQuery } from '@tanstack/react-query';
import getEventsUserList from '@/pages/calendar/helpers/getEventsUserList';

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

export default function UpdateTaskDialog({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  task = {},
}) {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getEventsUserList,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
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

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        reminders: task.reminders || [],
        assigned_to: task?.assignees?.map((assignee) => assignee.id) || [],
      });
    }
  }, [task, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#F5F5FA] rounded-lg w-full max-w-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0px_4px_24px_0px_#000000] no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#40444D] text-center font-bold font-sans">
            Update Task
          </DialogTitle>
        </DialogHeader>

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
          </div>

          {/* Reminders */}
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-[#40444D] font-semibold">Reminders</Label>
              <div
                className="p-1 rounded-full hover:bg-[#6366F1] hover:text-white transition-all duration-300 ease-in-out"
                onClick={() =>
                  appendReminder({ type: 'email', scheduled_at: '' })
                }
              >
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {reminderFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name={`reminders.${index}.type`}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name={`reminders.${index}.scheduled_at`}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        className="w-full"
                        {...field}
                        value={field.value || ''}
                      />
                    )}
                  />

                  <div className="flex items-center justify-end w-20 ">
                    <Trash2
                      className="text-[#6366F1] hover:text-red-500 transition-all duration-300 ease-in-out h-5 w-5 cursor-pointer"
                      onClick={() => removeReminder(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start space-y-2">
                <Label className="text-[#40444D] font-semibold">
                  Assigned To
                </Label>
                {errors.assigned_to && (
                  <p className="text-xs text-red-500">
                    {errors.assigned_to.message}
                  </p>
                )}
              </div>
              <div
                className="p-1 rounded-full hover:bg-[#6366F1] hover:text-white transition-all duration-300 ease-in-out"
                onClick={() => appendAssignedTo([users[0]?.id || 0])}
              >
                <Plus className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              {assignedToFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-1 items-center space-x-2 w-full"
                >
                  <Controller
                    control={control}
                    name={`assigned_to.${index}`}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            errors.assigned_to?.message ? 'border-red-500' : ''
                          }`}
                        >
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectGroup>
                            {users?.map((user) => (
                              <SelectItem
                                key={user.id}
                                value={user.id}
                                className="w-full"
                              >
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="flex items-center justify-end w-20 ">
                    <Trash2
                      className="text-[#6366F1] hover:text-red-500 transition-all duration-300 ease-in-out h-5 w-5 cursor-pointer"
                      onClick={() => removeAssignedTo(index)}
                    />
                  </div>
                </div>
              ))}
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
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
