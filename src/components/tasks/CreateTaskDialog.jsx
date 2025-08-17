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
  Card,
} from '@mui/material';
import { Plus, Trash2, X } from 'lucide-react';
import ReminderDialog from '@/components/dialogs/ReminderDialog';
import AssignDialog from '@/components/dialogs/AssignDialog';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import formatDate from '@/utils/formatDate';

const formFields = [
  {
    label: 'Task Type',
    name: 'type_id',
    type: 'select',
    metaField: 'taks_type',
  },
  { label: 'Due Date', name: 'due_date', type: 'date' },
  { label: 'Subject', name: 'subject', type: 'text', required: true },
  { label: 'Description', name: 'description', type: 'text' },
  {
    label: 'UTBMS Code',
    name: 'utbms_code_id',
    type: 'select',
    metaField: 'taks_UTBMSCode',
  },
  {
    label: 'Priority',
    name: 'priority_id',
    type: 'select',
    metaField: 'taks_priority',
  },
  {
    label: 'Status',
    name: 'status_id',
    type: 'select',
    metaField: 'taks_status',
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
  task = {},
}) {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [assignedToDialogOpen, setAssignedToDialogOpen] = useState(false);

  const { tasksMeta, createTask, updateTask, isCreating, isUpdating } =
    useTasks();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      type_id: '',
      subject: '',
      description: '',
      due_date: '',
      priority_id: '',
      utbms_code_id: '',
      billable: false,
      notify_text: false,
      add_calendar_event: false,
      trigger_appointment_reminders: false,
      status_id: '',
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

  // Get options from meta data
  const getMetaOptions = (metaField) => {
    return tasksMeta[metaField] || [];
  };

  const handleAddReminderSubmit = (data) => {
    appendReminder(data);
    setReminderDialogOpen(false);
  };

  const handleAddAssignedToSubmit = (data) => {
    appendAssignedTo(data);
    setAssignedToDialogOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      // Format the data for API
      const formattedData = {
        ...data,
        reminders: reminderFields.map((reminder) => ({
          type_id: parseInt(reminder.type_id),
          scheduled_at: reminder.scheduled_at,
        })),
        assigned_to: assignedToFields.map((assignee) => ({
          user_id: parseInt(assignee.user_id),
        })),
        // Convert select values to IDs if needed
        task_type: parseInt(data.task_type) || data.task_type,
        utbms_code_id: parseInt(data.utbms_code_id) || data.utbms_code_id,
        priority_id: parseInt(data.priority_id) || data.priority_id,
        status_id: parseInt(data.status_id) || data.status_id,
      };
      console.log(formattedData);

      // formData.append('reminders', JSON.stringify(data.reminders));
      // formData.append('assigned_to', JSON.stringify(data.));

      // const formData = new FormData();
      // formData.append('type_id', data.type_id);
      // formData.append('subject', data.subject);
      // formData.append('priority_id', data.priority_id);
      // formData.append('status_id', data.status_id);
      // formData.append('due_date', data.due_date);
      // formData.append('billable', data.billable ? true : false);
      // formData.append('notify_text', data.notify_text ? true : false);
      // formData.append(
      //   'add_calendar_event',
      //   data.add_calendar_event ? true : false
      // );
      // formData.append(
      //   'trigger_appointment_reminders',
      //   data.trigger_appointment_reminders ? true : false
      // );
      // formData.append('utbms_code_id', data.utbms_code_id);
      // formData.append('description', data.description);

      // reminderFields.forEach((reminder, index) => {
      //   formData.append(`reminders.${index}.type_id`, reminder.type_id);
      //   formData.append(
      //     `reminders.${index}.scheduled_at`,
      //     reminder.scheduled_at
      //   );
      // });

      // // format for assign - [1, 2, 3]
      // assignedToFields.forEach((assignee, index) => {
      //   formData.append(`assigned_to[${index}]`, assignee.user_id);
      // });

      if (task.id) {
        await updateTask({ taskId: task.id, taskData: formattedData });
      } else {
        await createTask(formattedData);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  useEffect(() => {
    if (task && task.id) {
      reset({
        ...task,
        reminders: task.reminders || [],
        assigned_to: task.assigned_to || [],
      });
    }
  }, [task?.id, task?.reminders, task?.assigned_to, reset]);
  console.log('errors', errors);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                {task.id ? 'Update Task' : 'Create New Task'}
              </h1>
              <IconButton onClick={onClose}>
                <X className="text-black" />
              </IconButton>
            </div>

            <Divider />

            <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
              <div className="flex flex-wrap gap-4 overflow-auto">
                {formFields.map(
                  ({ label, name, type, required, metaField }) => (
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
                              onValueChange={field.onChange}
                              value={field.value?.toString()}
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
                                  {getMetaOptions(metaField).map((option) => (
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
                      ) : type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Label className="text-[#40444D] font-semibold">
                            {label}:
                          </Label>
                          <Controller
                            control={control}
                            name={name}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      ) : (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Input type={type} {...field} />
                          )}
                        />
                      )}
                      {errors[name] && (
                        <p className="text-xs text-red-500">
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-4 overflow-auto">
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-1">Reminders</h3>
                  {reminderFields.map((reminder, idx) => (
                    <div
                      key={idx}
                      className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                    >
                      <div className="text-sm flex flex-col gap-1">
                        <span>
                          Type:{' '}
                          {
                            getMetaOptions('taks_type').find(
                              (type) => type.id === parseInt(reminder.type_id)
                            )?.name
                          }
                        </span>
                        <span>
                          Reminder: {formatDate(reminder.scheduled_at)}
                        </span>
                      </div>
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
                      key={idx}
                      className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                    >
                      <div className="text-sm">
                        <span>
                          Name:{' '}
                          {getMetaOptions('assignees').find(
                            (u) => u.id === parseInt(assignedTo.user_id)
                          )?.name || 'Unknown User'}
                        </span>
                      </div>
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
                disabled={isCreating || isUpdating}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              >
                {isCreating || isUpdating
                  ? task.id
                    ? 'Updating...'
                    : 'Creating...'
                  : task.id
                  ? 'Update Task'
                  : 'Create Task'}
              </Button>
            </div>
          </Stack>
        </form>
      </Dialog>

      {/* Reminder Dialog */}
      <ReminderDialog
        metaObj={tasksMeta}
        reminderDialogOpen={reminderDialogOpen}
        setReminderDialogOpen={setReminderDialogOpen}
        onSubmit={handleAddReminderSubmit}
      />

      {/* Assigned To Dialog */}
      <AssignDialog
        metaObj={tasksMeta}
        assignedToDialogOpen={assignedToDialogOpen}
        setAssignedToDialogOpen={setAssignedToDialogOpen}
        onSubmit={handleAddAssignedToSubmit}
      />
    </>
  );
}
