import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getEventMeta,
  getEvents,
  getEventById,
  searchEvent,
  filterEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventFile,
  deleteEventFile,
} from '@/api/api_services/event';
import { toast } from 'sonner';

export const useEvents = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract eventId from URL
  const eventId = searchParams.get('eventId');

  // Event meta
  const { data: eventsMeta = [], isLoading: eventsMetaLoading } = useQuery({
    queryKey: ['eventsMeta'],
    queryFn: getEventMeta,
    staleTime: 5 * 60 * 1000,
  });
  console.log('eventsMeta >>>', eventsMeta);

  // All events or single event
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => (eventId ? getEventById(eventId) : getEvents()),
    staleTime: 5 * 60 * 1000,
  });

  // Search events
  const searchEventsMutation = useMutation({
    mutationFn: (searchData) => searchEvent(searchData),
  });

  // Filter events
  const filterEventsMutation = useMutation({
    mutationFn: (queryParams) => filterEvent(queryParams),
  });

  // Create
  const createEventMutation = useMutation({
    mutationFn: (eventData) => createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast.success('Event created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event!');
    },
  });

  // Update
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, eventData }) => updateEvent(eventId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast.success('Event updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event!');
    },
  });

  // Delete
  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      toast.success('Event deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete event!');
    },
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: (fileData) => uploadEventFile(fileData),
    onSuccess: () => {
      if (selectedEvent)
        queryClient.invalidateQueries(['events', selectedEvent.id]);
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload file!');
    },
  });

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteEventFile(fileId),
    onSuccess: () => {
      if (selectedEvent)
        queryClient.invalidateQueries(['events', selectedEvent.id]);
      toast.success('File deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete file!');
    },
  });

  const handleCreateEvent = useCallback((eventData) => {
    createEventMutation.mutateAsync(eventData);
  }, []);

  const handleSearchEvents = useCallback((searchData) => {
    searchEventsMutation.mutateAsync(searchData);
  }, []);

  const handleFilterEvents = useCallback((queryParams) => {
    filterEventsMutation.mutateAsync(queryParams);
  }, []);

  const handleUpdateEvent = useCallback(({ eventId, eventData }) => {
    updateEventMutation.mutateAsync({ eventId, eventData });
  }, []);

  const handleDeleteEvent = useCallback((eventId) => {
    deleteEventMutation.mutateAsync(eventId);
  }, []);

  const handleUploadFile = useCallback((fileData) => {
    uploadFileMutation.mutateAsync(fileData);
  }, []);

  const handleDeleteFile = useCallback((fileId) => {
    deleteFileMutation.mutateAsync(fileId);
  }, []);

  // Navigation helpers (optional)
  const navigateToEvent = useCallback((event) => {
    setSelectedEvent(event);
    setCurrentPath((prev) => [...prev, event]);
  }, []);

  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length > 0) {
        setSelectedEvent(newPath[newPath.length - 1]);
      } else {
        setSelectedEvent(null);
      }
    }
  }, [currentPath]);

  const navigateToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedEvent(null);
  }, []);

  const requiredFields = {
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    category_id: '',
    all_day: 0,
    priority_id: '',
    status_id: '',
    repeat_id: '',
    slug: '',
    contacts_id: '',
    reminders: [],
    participants: [],
    attachment_ids: [],
  };

  /**
   * calendar_list
: 
(2) [{…}, {…}]
document_categories
: 
(18) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
document_folders
: 
(14) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
event_categories
: 
(3) [{…}, {…}, {…}]
event_participants_status
: 
(4) [{…}, {…}, {…}, {…}]
event_priority
: 
(4) [{…}, {…}, {…}, {…}]
event_reminders_relative
: 
(2) [{…}, {…}]
event_reminders_timing
: 
(3) [{…}, {…}, {…}]
event_reminders_type
: 
(3) [{…}, {…}, {…}]
event_repeat
: 
(5) [{…}, {…}, {…}, {…}, {…}]
event_status
: 
(4) [{…}, {…}, {…}, {…}]
participants_email
: 
(2) [{…}, {…}]
participants_roles
:
   */

  const formFields = [
    { label: 'Title', name: 'title', type: 'text' },
    { label: 'Description', name: 'description', type: 'text' },
    { label: 'Start Time', name: 'start_time', type: 'datetime-local' },
    { label: 'End Time', name: 'end_time', type: 'datetime-local' },
    {
      label: 'Category',
      name: 'category_id',
      type: 'select',
      options: eventsMeta?.event_categories || [],
    },
    {
      label: 'Priority',
      name: 'priority_id',
      type: 'select',
      options: eventsMeta?.event_priority || [],
    },
    {
      label: 'Status',
      name: 'status_id',
      type: 'select',
      options: eventsMeta?.event_status || [],
    },
    {
      label: 'Repeat',
      name: 'repeat_id',
      type: 'select',
      options: eventsMeta?.event_repeat || [],
    },
    { label: 'All Day', name: 'all_day', type: 'checkbox' },
  ];

  /**const getValidationRules = (name) => {
      const rules = {};

      switch (name) {
        case 'nature':
          rules.required = 'Nature is required';
          break;
        case 'contact_type_id':
          rules.required = 'Contact type is required';
          break;
        case 'first_name':
          if (nature === 'Individual') {
            rules.required = 'First name is required for individuals';
          }
          rules.maxLength = {
            value: 255,
            message: 'First name must be 255 characters or less',
          };
          break;
        case 'last_name':
          if (nature === 'Individual') {
            rules.required = 'Last name is required for individuals';
          }
          rules.maxLength = {
            value: 255,
            message: 'Last name must be 255 characters or less',
          };
          break;
        case 'company_name':
          if (nature === 'Business') {
            rules.required = 'Company name is required for businesses';
          }
          rules.maxLength = {
            value: 255,
            message: 'Company name must be 255 characters or less',
          };
          break;
        case 'addresses':
          rules.validate = (value) => {
            if (!value || value.length === 0) {
              return 'At least one address is required';
            }
            return true;
          };
          break;
        default:
          // Apply maxLength to other text fields
          if (
            [
              'middle_name',
              'suffix',
              'alias',
              'job_title',
              'ssn',
              'federal_tax_id',
              'work_phone',
              'home_phone',
              'primary_phone',
              'fax',
              'primary_email',
              'secondary_email',
              'when_to_contact',
              'contact_preference',
              'language',
              'drivers_license',
              'notes',
            ].includes(name)
          ) {
            rules.maxLength = {
              value: 255,
              message: `${name.replace(
                '_',
                ' '
              )} must be 255 characters or less`,
            };
          }
          break;
      }

      return rules;
    }; */

  const getValidationRules = (name) => {
    const rule = {};

    switch (name) {
      case 'title':
        rule.required = 'Title is required';
        break;
      case 'description':
        rule.required = 'Description is required';
        break;
      case 'start_time':
        rule.required = 'Start time is required';
        break;
      case 'end_time':
        rule.required = 'End time is required';
        break;
      case 'category_id':
        rule.required = 'Category is required';
        break;
      case 'all_day':
        rule.required = 'All day is required';
        break;
      case 'priority_id':
        rule.required = 'Priority is required';
        break;
      case 'status_id':
        rule.required = 'Status is required';
        break;
      case 'repeat_id':
        rule.required = 'Repeat is required';
        break;
    }

    return rule;
  };

  return {
    // Form
    requiredFields,
    formFields,
    getValidationRules,

    // State
    eventsMeta,
    events,
    selectedEvent,
    currentPath,

    // Loading
    eventsMetaLoading,
    eventsLoading,

    // Actions
    navigateToEvent,
    navigateBack,
    navigateToRoot,
    handleCreateEvent,
    handleSearchEvents,
    handleFilterEvents,
    handleUpdateEvent,
    handleDeleteEvent,
    handleUploadFile,
    handleDeleteFile,

    // Mutations
    searchEvents: searchEventsMutation.mutateAsync,
    filterEvents: filterEventsMutation.mutateAsync,
    createEvent: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
    uploadEventFile: uploadFileMutation.mutateAsync,
    deleteEventFile: deleteFileMutation.mutateAsync,

    // States
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isDeletingFile: deleteFileMutation.isPending,
  };
};
