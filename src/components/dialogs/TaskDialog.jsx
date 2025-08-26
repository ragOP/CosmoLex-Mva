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
import { useMatter } from '@/components/inbox/MatterContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getContacts } from '@/api/api_services/contact';

const formFields = [
  {
    label: 'Task Type',
    name: 'type_id',
    type: 'select',
    metaField: 'taks_type',
    required: true,
  },
  {
    label: 'Due Date',
    name: 'due_date',
    type: 'date',
    required: true,
  },
  {
    label: 'Subject',
    name: 'subject',
    type: 'text',
    required: true,
    maxLength: 255,
  },
  {
    label: 'Description',
    name: 'description',
    type: 'textarea',
    required: false,
  },
  {
    label: 'UTBMS Code',
    name: 'utbms_code_id',
    type: 'select',
    metaField: 'taks_UTBMSCode',
    required: false,
  },
  {
    label: 'Priority',
    name: 'priority_id',
    type: 'select',
    metaField: 'taks_priority',
    required: true,
  },
  {
    label: 'Status',
    name: 'status_id',
    type: 'select',
    metaField: 'taks_status',
    required: true,
  },
  {
    label: 'Billable',
    name: 'billable',
    type: 'checkbox',
    required: false,
  },
  {
    label: 'Notify Text',
    name: 'notify_text',
    type: 'checkbox',
    required: false,
  },
  {
    label: 'Add Calendar Event',
    name: 'add_calendar_event',
    type: 'checkbox',
    required: false,
  },
  {
    label: 'Trigger Appointment Reminders',
    name: 'trigger_appointment_reminders',
    type: 'checkbox',
    required: false,
  },
];

// Helper function to convert backend boolean values (0/1) to actual booleans
const convertBackendBoolean = (value) => {
  if (value === 1 || value === '1' || value === true) return true;
  if (value === 0 || value === '0' || value === false) return false;
  return false; // default to false for undefined/null
};

export default function TaskDialog({
  open = false,
  onClose = () => {},
  mode = 'create', // 'create' or 'update'
  task = null, // Task object for update mode
}) {
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');

  // Get matter data if slugId is present
  let matterData = null;
  try {
    if (slugId) {
      matterData = useMatter();
    }
  } catch (error) {
    console.warn('useMatter hook not available:', error);
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

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Debounced search terms
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedFromSearchTerm, setDebouncedFromSearchTerm] = useState('');

    const { data: contacts, } = useQuery({
    queryKey: ['contacts', slugId],
    queryFn: getContacts,
    enabled: !!slugId
  })

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
    watch,
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
    mode: 'onChange',
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

  // Watch form values for validation
  const watchedValues = watch();

  // Manual validation function
  const validateForm = (data) => {
    const errors = {};

    // Required field validations
    if (!data.contact_id) {
      errors.contact_id = 'Contact is required';
    }

    if (!data.slug) {
      errors.slug = 'Contact slug is required';
    }

    if (!data.type_id) {
      errors.type_id = 'Task type is required';
    }

    if (!data.subject || data.subject.trim() === '') {
      errors.subject = 'Subject is required';
    } else if (data.subject.length > 255) {
      errors.subject = 'Subject must not exceed 255 characters';
    }

    if (!data.due_date) {
      errors.due_date = 'Due date is required';
    }

    if (data.due_date) {
      const dueDate = new Date(data.due_date);
      const today = new Date();
      if (dueDate <= today) {
        errors.due_date = 'Due date must be in the future';
      }
    }

    if (!data.status_id) {
      errors.status_id = 'Status is required';
    }

    if (!data.priority_id) {
      errors.priority_id = 'Priority is required';
    }

    // Array validations
    if (!data.assigned_to || data.assigned_to.length === 0) {
      errors.assigned_to = 'At least one assignee is required';
    } else {
      // Validate each assignee
      data.assigned_to.forEach((assignee, index) => {
        if (!assignee.user_id) {
          errors[`assigned_to_${index}`] = 'User ID is required for assignee';
        }
      });
    }

    if (!data.reminders || data.reminders.length === 0) {
      errors.reminders = 'At least one reminder is required';
    } else {
      // Validate each reminder
      data.reminders.forEach((reminder, index) => {
        if (!reminder.type_id) {
          errors[`reminder_type_${index}`] = 'Reminder type is required';
        }
        // if (!reminder.scheduled_at) {
        //   errors[`reminder_date_${index}`] = 'Reminder date is required';
        // }

        if (!reminder.scheduled_at) {
          errors[`reminder_date_${index}`] = 'Reminder date is required';
        } else {
          const now = new Date();
          const reminderDate = new Date(reminder.scheduled_at);
          if (reminderDate <= now) {
            errors[`reminder_date_${index}`] =
              'Reminder date must be in the future';
          }
        }
      });
    }

    return errors;
  };

  // Get options from meta data
  const getMetaOptions = (metaField) => {
    return tasksMeta[metaField] || [];
  };

  const handleAddReminderSubmit = (data) => {
    if (editingReminder !== null) {
      // Update existing reminder
      updateReminder(editingReminder.index, {
        ...data,
        // Preserve the dbId if it exists
        dbId: editingReminder.dbId,
      });
      setEditingReminder(null);
    } else {
      // Add new reminder (no dbId for new reminders)
      appendReminder(data);
    }
    setReminderDialogOpen(false);
    // Clear reminder validation error if exists
    setValidationErrors((prev) => ({
      ...prev,
      reminders: undefined,
    }));
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
    // Clear assignee validation error if exists
    setValidationErrors((prev) => ({
      ...prev,
      assigned_to: undefined,
    }));
  };

  const handleEditReminder = (reminder, index) => {
    setEditingReminder({
      ...reminder,
      index,
      // Make sure to pass the dbId for editing
      dbId: reminder.dbId,
    });
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
      // Clear previous validation errors
      setValidationErrors({});

      // Perform manual validation
      const errors = validateForm(data);

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix the validation errors');
        return;
      }

      // Format the data for API
      const formattedData = {
        ...data,
        contact_id: parseInt(data.contact_id) || data.contact_id,
        slug: data.slug,
        type_id: parseInt(data.type_id) || data.type_id,
        reminders: reminderFields.map((reminder, index) => ({
          // FIXED: Use dbId for existing reminders, undefined for new ones
          id: isUpdateMode ? reminder.dbId : undefined,
          type_id: parseInt(reminder.type_id),
          scheduled_at: reminder.scheduled_at,
        })),
        assigned_to: assignedToFields.map((assignee) => ({
          user_id: parseInt(assignee.user_id),
        })),
        // Convert select values to IDs if needed, handle empty values properly
        utbms_code_id: data.utbms_code_id
          ? parseInt(data.utbms_code_id) || data.utbms_code_id
          : null, // Send null instead of undefined
        priority_id: parseInt(data.priority_id) || data.priority_id,
        status_id: parseInt(data.status_id) || data.status_id,
      };

      if (isUpdateMode) {
        await updateTask({ taskId: currentTask.id, taskData: formattedData });
      } else {
        await createTask(formattedData);
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
      setValidationErrors({});
    }
  }, [open]);

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (open) {
      if (isUpdateMode && currentTask) {
        // Populate form with existing task data
        const formData = {
          ...currentTask,
          // Handle boolean conversions from backend (0/1 to false/true)
          billable: convertBackendBoolean(currentTask.billable),
          notify_text: convertBackendBoolean(currentTask.notify_text),
          add_calendar_event: convertBackendBoolean(
            currentTask.add_calendar_event
          ),
          trigger_appointment_reminders: convertBackendBoolean(
            currentTask.trigger_appointment_reminders
          ),
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
        replaceReminders(
          (currentTask.reminders || []).map((r) => {
            return {
              // Keep the original database ID as dbId
              dbId: r.id, // <-- IMPORTANT: Store original DB ID separately
              type_id: r.type_id,
              scheduled_at: r.scheduled_at,
            };
          })
        );
        replaceAssignedTo(formData.assigned_to);
      } else {
        // Reset to default values for create mode
        reset({
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
        });

        setContact(null);
        replaceReminders([]);
        replaceAssignedTo([]);
      }
      setValidationErrors({});
    }
  }, [
    open,
    currentTask.id,
    isUpdateMode,
    reset,
    replaceReminders,
    replaceAssignedTo,
  ]);

  // Auto-select contact from matter data when in matter context
  useEffect(() => {
    if (open && slugId && matterData?.matter?.contact_id && !isUpdateMode) {
          const matterContact = contacts.find((contact) => contact.id === matterData?.matter?.contact_id);
          setContact(matterContact);
          setValue('contact_id', matterContact.id);
          setValue('slug', slugId);
      
      // Clear any validation errors for contact
      setValidationErrors((prev) => ({
        ...prev,
        contact_id: undefined,
        slug: undefined,
      }));
    }
  }, [open, slugId, matterData, setValue, isUpdateMode]);

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
                  <Label className="text-[#40444D] font-semibold">
                    Contact <span className="text-red-500">*</span>
                  </Label>
                  {contact ? (
                    <div className="flex items-center gap-2">
                      <Chip
                        label={contact?.contact_name}
                        onDelete={slugId && matterData?.matter?.contact_id ? undefined : () => {
                          setContact(null);
                          setValue('contact_id', '');
                          setValue('slug', '');
                          setSearchDialogOpen(true);
                        }}
                        deleteIcon={<X size={16} />}
                        size="small"
                        sx={{ 
                          bgcolor: '#e8f5e8', 
                          color: '#2e7d32', 
                          p: 1,
                          opacity: slugId && matterData?.matter?.contact_id ? 0.7 : 1
                        }}
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Prevent opening search dialog if contact is auto-selected from matter
                        if (!(slugId && matterData?.matter?.contact_id)) {
                          setSearchDialogOpen(true);
                        }
                      }}
                      className="w-fit"
                      disabled={slugId && matterData?.matter?.contact_id}
                    >
                      Select Contact
                    </Button>
                  )}
                  {validationErrors.contact_id && (
                    <p className="text-xs text-red-500">
                      {validationErrors.contact_id}
                    </p>
                  )}
                </div>

                {/* Don't show until contact is selected */}
                {formFields.map(
                  ({ label, name, type, required, metaField, maxLength }) => (
                    <div key={name} className="w-full md:w-[49%]">
                      {type !== 'checkbox' && (
                        <Label className="text-[#40444D] font-semibold mb-2">
                          {label}
                          {required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                      )}

                      {type === 'select' ? (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Select
                              disabled={!contact}
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Clear validation error when user selects a value
                                if (validationErrors[name]) {
                                  setValidationErrors((prev) => ({
                                    ...prev,
                                    [name]: undefined,
                                  }));
                                }
                              }}
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
                                disabled={!contact}
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
                              disabled={!contact}
                              className="w-full bg-white"
                              minRows={3}
                              maxRows={5}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Clear validation error when user types
                                if (validationErrors[name]) {
                                  setValidationErrors((prev) => ({
                                    ...prev,
                                    [name]: undefined,
                                  }));
                                }
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          control={control}
                          name={name}
                          render={({ field }) => (
                            <Input
                              disabled={!contact}
                              type={type}
                              {...field}
                              maxLength={maxLength}
                              onChange={(e) => {
                                field.onChange(e);
                                // Clear validation error when user types
                                if (validationErrors[name]) {
                                  setValidationErrors((prev) => ({
                                    ...prev,
                                    [name]: undefined,
                                  }));
                                }
                              }}
                            />
                          )}
                        />
                      )}

                      {validationErrors[name] && (
                        <p className="text-xs text-red-500">
                          {validationErrors[name]}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-4 overflow-auto">
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-1">
                    Reminders <span className="text-red-500">*</span>
                  </h3>
                  {reminderFields.map((reminder, idx) => (
                    <>
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
                                  if (reminder.dbId) {
                                    // <-- FIXED: Use dbId instead of id
                                    // Existing reminder → hit backend
                                    handleDeleteReminder(reminder.dbId);
                                  }
                                  // Always remove from UI
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

                      {validationErrors[`reminder_date_${idx}`] && (
                        <p className="text-xs text-red-500 mt-1">
                          {validationErrors[`reminder_date_${idx}`]}
                        </p>
                      )}
                    </>
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

                  {validationErrors.reminders && (
                    <p className="text-xs text-red-500 mt-1">
                      {validationErrors.reminders}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-1">
                    Assigned To <span className="text-red-500">*</span>
                  </h3>
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

                  {validationErrors.assigned_to && (
                    <p className="text-xs text-red-500 mt-1">
                      {validationErrors.assigned_to}
                    </p>
                  )}
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
          setContact(item);
          setSearchDialogOpen(false);
          setValue('contact_id', item.id);
          setValue('slug', item.slug);
          // Clear validation error when contact is selected
          if (validationErrors.contact_id) {
            setValidationErrors((prev) => ({
              ...prev,
              contact_id: undefined,
              slug: undefined,
            }));
          }
        }}
        onItemDeselect={(item) => {
          console.log(item);
          setContact(null);
          setSearchDialogOpen(false);
          setValue('contact_id', '');
          setValue('slug', '');
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
          setSearchDialogOpen(false);
          setContact(selectedItems);
          setValue('contact_id', selectedItems.id);
          setValue('slug', selectedItems.slug);
          // Clear validation error when contact is selected
          if (validationErrors.contact_id) {
            setValidationErrors((prev) => ({
              ...prev,
              contact_id: undefined,
              slug: undefined,
            }));
          }
        }}
      />
    </>
  );
}
