import React from 'react';
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
import { taskSchema } from '@/pages/tasks/schema/createTaskSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const formFields = [
  { label: 'Client Name', name: 'client_name', type: 'text', required: true },
  { label: 'Task Type', name: 'task_type', type: 'text' },
  { label: 'Subject', name: 'subject', type: 'text', required: true },
  { label: 'Description', name: 'description', type: 'text' },
  { label: 'Due Date', name: 'due_date', type: 'date' },
  { label: 'UTBMS Code', name: 'utbms_code', type: 'text' },
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
}) {
  const {
    control,
    register,
    handleSubmit,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.map(({ label, name, type, required, options }) => (
              <div key={name}>
                <Label>{label}</Label>
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
                        />
                      )}
                    />
                    <Label>{label}</Label>
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

          <div>
            <div className="flex justify-between items-center">
              <Label>Reminders</Label>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() =>
                  appendReminder({ type: 'email', scheduled_at: '' })
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
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
                        <SelectTrigger className="w-[120px]">
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
                  <Input
                    type="datetime-local"
                    {...register(`reminders.${index}.scheduled_at`)}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeReminder(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label>Assigned To</Label>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => appendAssignedTo('')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {assignedToFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input type="text" {...register(`assigned_to.${index}`)} />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeAssignedTo(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
