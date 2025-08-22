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
import {
  Dialog,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  Chip,
  TextareaAutosize,
} from '@mui/material';
import { Edit, Loader2, Paperclip, Plus, Trash2, X } from 'lucide-react';
import ReminderDialog from '@/components/dialogs/ReminderDialog';
import AssignDialog from '@/components/dialogs/AssignDialog';
import SearchDialog from '@/components/dialogs/SearchDialog';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import formatDate from '@/utils/formatDate';
import { searchTask } from '@/api/api_services/task';
import { useQuery } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import { SearchableComboBox } from '@/components/SearchableComboBox';
import { useMatter } from '@/components/inbox/MatterContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const formFields = [
  {
    label: 'Task Type',
    name: 'type_id',
    type: 'select',
    metaField: 'taks_type',
  },
  { label: 'Due Date', name: 'due_date', type: 'date' },
  { label: 'Subject', name: 'subject', type: 'text', required: true },
  { label: 'Description', name: 'description', type: 'textarea' },
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

export default function TaskDialog({
  open = false,
  onClose = () => {},
  mode = 'create', // 'create' or 'update'
  task = null, // Task object for update mode
}) {
  const [searchParams] = useSearchParams();
  const matterSlug = searchParams.get('slugId');

  let matter = null;
  if (matterSlug) {
    matter = useMatter();
  }

  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [assignedToDialogOpen, setAssignedToDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Edit states
  const [editingReminder, setEditingReminder] = useState(null);
  const [editingAssignee, setEditingAssignee] = useState(null);

  const [contact, setContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromSearchTerm, setFromSearchTerm] = useState('');

  // Upload media
  const [showUploadMediaDialog, setShowUploadMediaDialog] = useState(false);

  // Debounced search terms
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedFromSearchTerm, setDebouncedFromSearchTerm] = useState('');

  // Debounce effect for recipient search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce effect for from search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromSearchTerm(fromSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [fromSearchTerm]);

  const { data: taskSearchResults, isLoading: taskLoading } = useQuery({
    queryKey: ['task-search', debouncedSearchTerm],
    queryFn: () =>
      searchTask({ searchBar: debouncedSearchTerm, contact_type_id: '' }, 1),
    enabled: open && debouncedSearchTerm.length > 0,
  });

  const {
    tasksMeta,
    task: taskFromHook,
    createTask,
    updateTask,
    isCreating,
    isUpdating,
    handleDeleteReminder,
    isDeletingReminder,
  } = useTasks();

  // Use task prop if provided, otherwise use task from hook
  const currentTask = taskFromHook;

  // Determine if we're in update mode
  const isUpdateMode = mode === 'update' || (currentTask && currentTask.id);
  const isLoading = isCreating || isUpdating;

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
      slug: '',
      contact_id: '',
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
    replace: replaceReminders,
    update: updateReminder,
  } = useFieldArray({
    control,
    name: 'reminders',
  });

  const {
    fields: assignedToFields,
    append: appendAssignedTo,
    remove: removeAssignedTo,
    replace: replaceAssignedTo,
    update: updateAssignedTo,
  } = useFieldArray({
    control,
    name: 'assigned_to',
  });

  // Get options from meta data
  const getMetaOptions = (metaField) => {
    return tasksMeta[metaField] || [];
  };

  const handleAddReminderSubmit = (data) => {
    if (editingReminder !== null) {
      // Update existing reminder
      updateReminder(editingReminder.index, data);
      setEditingReminder(null);
    } else {
      // Add new reminder
      appendReminder(data);
    }
    setReminderDialogOpen(false);
  };

  const handleAddAssignedToSubmit = (data) => {
    if (editingAssignee !== null) {
      // Update existing assignee
      updateAssignedTo(editingAssignee.index, data);
      setEditingAssignee(null);
    } else {
      // Add new assignee
      appendAssignedTo(data);
    }
    setAssignedToDialogOpen(false);
  };

  const handleEditReminder = (reminder, index) => {
    setEditingReminder({ ...reminder, index });
    setReminderDialogOpen(true);
  };

  const handleEditAssignee = (assignee, index) => {
    setEditingAssignee({ ...assignee, index });
    setAssignedToDialogOpen(true);
  };

  const handleReminderDialogClose = () => {
    setReminderDialogOpen(false);
    setEditingReminder(null);
  };

  const handleAssignDialogClose = () => {
    setAssignedToDialogOpen(false);
    setEditingAssignee(null);
  };

  const onFormSubmit = async (data) => {
    try {
      // Format the data for API
      const formattedData = {
        ...data,
        contact_id:
          parseInt(getValues('contact_id')) || getValues('contact_id'),
        slug: getValues('slug'),
        type_id: parseInt(getValues('type_id')) || getValues('type_id'),
        reminders: reminderFields.map((reminder) => ({
          type_id: parseInt(reminder.type_id),
          scheduled_at: reminder.scheduled_at,
        })),
        assigned_to: assignedToFields.map((assignee) => ({
          user_id: parseInt(assignee.user_id),
        })),
        // Convert select values to IDs if needed
        utbms_code_id:
          parseInt(getValues('utbms_code_id')) || getValues('utbms_code_id'),
        priority_id:
          parseInt(getValues('priority_id')) || getValues('priority_id'),
        status_id: parseInt(getValues('status_id')) || getValues('status_id'),
      };
      console.log('formattedData', formattedData);

      if (isUpdateMode) {
        updateTask({ taskId: currentTask.id, taskData: formattedData });

        // Showing toast
        if (!isUpdating) {
          toast.success('Task updated successfully');
        }
      } else {
        createTask(formattedData);

        // Showing toast
        if (!isCreating) {
          toast.success('Task created successfully');
        }
      }

      onClose();
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? 'updating' : 'creating'} task:`,
        error
      );
    }
  };

  // Cleanup effect when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset states when dialog closes
      setContact(null);
      setEditingReminder(null);
      setEditingAssignee(null);
      setSearchTerm('');
      setFromSearchTerm('');
    }
  }, [open]);

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (open) {
      console.log('currentTask', currentTask);
      if (isUpdateMode && currentTask) {
        console.log('currentTask', currentTask);
        // Populate form with existing task data
        const formData = {
          ...currentTask,
          billable: currentTask.billable === 0 ? false : true,
          notify_text: currentTask.notify_text === 0 ? false : true,
          add_calendar_event:
            currentTask.add_calendar_event === 0 ? false : true,
          trigger_appointment_reminders:
            currentTask.trigger_appointment_reminders === 0 ? false : true,
          type_id: currentTask.type_id?.toString() || '',
          priority_id: currentTask.priority_id?.toString() || '',
          status_id: currentTask.status_id?.toString() || '',
          utbms_code_id: currentTask.utbms_code_id?.toString() || '',
          due_date: currentTask.due_date
            ? currentTask.due_date.split('T')[0]
            : '',
          reminders: currentTask.reminders || [],
          assigned_to:
            currentTask.assignees?.map((assignee) => ({
              user_id: assignee.id || assignee.user_id,
            })) ||
            currentTask.assigned_to ||
            [],
        };

        reset(formData);

        // Set contact if exists
        if (currentTask.contact) {
          setContact(currentTask.contact);
        } else if (currentTask.contact_id && currentTask.contact_name) {
          // Construct contact object from task data if contact object doesn't exist
          setContact({
            id: currentTask.contact_id,
            contact_name: currentTask.contact_name,
            primary_email: currentTask.contact_email || '',
            slug: currentTask.slug || '',
          });
        }

        // Set field arrays
        replaceReminders(currentTask.reminders || []);
        replaceAssignedTo(formData.assigned_to);
      } else {
        // Reset to default values for create mode
        reset({
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
        });

        setContact(null);
        replaceReminders([]);
        replaceAssignedTo([]);
      }
    }
  }, [
    open,
    currentTask,
    isUpdateMode,
    reset,
    replaceReminders,
    replaceAssignedTo,
  ]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
                {isUpdateMode ? 'Update Task' : 'Create New Task'}
              </h1>
              <IconButton onClick={onClose}>
                <X className="text-black" />
              </IconButton>
            </div>

            <Divider />

            <div className="space-y-4 flex-1 overflow-auto p-4 no-scrollbar">
              <div className="flex flex-wrap gap-4 overflow-auto">
                <div className="w-full space-y-2">
                  <Label>Contact: </Label>
                  {contact ? (
                    <>
                      <Chip
                        label={contact?.contact_name}
                        onDelete={() => {
                          setContact(null);
                          setValue('contact_id', '');
                          setValue('slug', '');
                          setSearchDialogOpen(true);
                        }}
                        deleteIcon={<X size={16} />}
                        size="small"
                        sx={{ bgcolor: '#e8f5e8', color: '#2e7d32', p: 1 }}
                      />
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSearchDialogOpen(true)}
                      className="w-fit"
                    >
                      Select Contact
                    </Button>
                  )}
                </div>
                {/* Don't show until contact is selected */}
                {contact &&
                  formFields.map(
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
                                  <SelectValue
                                    placeholder={`Select ${label}`}
                                  />
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
                        ) : type === 'textarea' ? (
                          <Controller
                            control={control}
                            name={name}
                            render={({ field }) => (
                              <Textarea
                                className="w-full bg-white"
                                minRows={3}
                                maxRows={5}
                                {...field}
                              />
                            )}
                          />
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
                      key={reminder.id || idx}
                      className="border p-4 mb-2 rounded-lg w-full bg-white flex justify-between items-center"
                    >
                      <div className="text-sm flex flex-col gap-1">
                        <span>
                          Type:{' '}
                          {getMetaOptions('taks_reminders_type').find(
                            (type) => type.id === parseInt(reminder.type_id)
                          )?.name || 'Unknown Type'}
                        </span>
                        <span>
                          Reminder: {formatDate(reminder.scheduled_at)}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Tooltip arrow title="Edit Reminder">
                          <IconButton
                            type="button"
                            onClick={() => handleEditReminder(reminder, idx)}
                            variant="ghost"
                            size="small"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Remove Reminder">
                          {isDeletingReminder ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <IconButton
                              type="button"
                              onClick={() => {
                                console.log(reminder);
                                handleDeleteReminder(reminder.id || idx);
                                removeReminder(idx);
                              }}
                              variant="ghost"
                              size="small"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </IconButton>
                          )}
                        </Tooltip>
                      </div>
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
                      key={assignedTo.id || idx}
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
                      <div className="flex gap-1">
                        <Tooltip arrow title="Edit Assignment">
                          <IconButton
                            type="button"
                            onClick={() => handleEditAssignee(assignedTo, idx)}
                            variant="ghost"
                            size="small"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Remove Assigned To">
                          <IconButton
                            type="button"
                            onClick={() => removeAssignedTo(idx)}
                            variant="ghost"
                            size="small"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </IconButton>
                        </Tooltip>
                      </div>
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

            <div className="flex items-center justify-between p-4 gap-2">
              <Stack direction="row" alignItems="center" spacing={1}>
                <label htmlFor="attachment-input">
                  <IconButton
                    onClick={() => setShowUploadMediaDialog(true)}
                    component="span"
                    size="small"
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: '#e3f2fd',
                      },
                    }}
                  >
                    <Paperclip size={18} color="#666" />
                  </IconButton>
                </label>
              </Stack>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              >
                {isLoading
                  ? isUpdateMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isUpdateMode
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
        setReminderDialogOpen={handleReminderDialogClose}
        onSubmit={handleAddReminderSubmit}
        editingReminder={editingReminder}
        handleDeleteReminder={handleDeleteReminder}
        isDeletingReminder={isDeletingReminder}
      />

      {/* Assigned To Dialog */}
      <AssignDialog
        metaObj={tasksMeta}
        assignedToDialogOpen={assignedToDialogOpen}
        setAssignedToDialogOpen={handleAssignDialogClose}
        onSubmit={handleAddAssignedToSubmit}
        editingAssignee={editingAssignee}
      />

      {/* Upload Media Dialog */}
      <UploadMediaDialog
        open={showUploadMediaDialog}
        onClose={() => setShowUploadMediaDialog(false)}
        onSubmit={(payload) => {
          console.log(payload);
        }}
      />

      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        title="Select Contact"
        searchPlaceholder="Search contacts..."
        maxWidth="sm"
        items={taskSearchResults}
        selectedItems={currentTask?.contact_id || []}
        loading={taskLoading}
        searchTerm={searchTerm}
        onSearchChange={(searchTerm) => setSearchTerm(searchTerm)}
        onItemSelect={(item) => {
          console.log(item);
          setContact(item);
          setSearchDialogOpen(false);
          setValue('contact_id', item.id);
          setValue('slug', item.slug);
        }}
        onItemDeselect={(item) => {
          console.log(item);
          setContact(null);
          setSearchDialogOpen(false);
          setValue('contact_id', item.id);
          setValue('slug', item.slug);
        }}
        getItemKey={(item, index) => item.id || index}
        getItemDisplay={(item) => ({
          primary: item.contact_name,
          secondary: item.primary_email,
          avatar: item.contact_name.charAt(0).toUpperCase(),
        })}
        emptyStateText="No contacts found"
        loadingText="Searching..."
        getEmptySearchText={(searchTerm) =>
          `No contacts found for "${searchTerm}"`
        }
        onCancel={() => setSearchDialogOpen(false)}
        onConfirm={(selectedItems) => {
          console.log(selectedItems);
          setSearchDialogOpen(false);
          setContact(selectedItems);
          setValue('contact_id', selectedItems);
          setValue('slug', selectedItems.slug);
        }}
      />
    </>
  );
}
