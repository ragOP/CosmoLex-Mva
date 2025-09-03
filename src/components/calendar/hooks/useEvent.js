import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getEventMeta,
  getEvents,
  getEventsByslugId,
  getEventById,
  searchEvent,
  filterEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventFile,
  deleteEventFile,
  updateEventTime,
} from '@/api/api_services/event';
import { toast } from 'sonner';

export const useEvents = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract eventId from URL
  const eventId = searchParams.get('eventId');
  const slugId = searchParams.get('slugId');
  const userId = searchParams.get('userId');

  // Event meta
  const { data: eventsMeta = [], isLoading: eventsMetaLoading } = useQuery({
    queryKey: ['eventsMeta'],
    queryFn: getEventMeta,
    staleTime: 5 * 60 * 1000,
  });

  // All events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', slugId, userId],
    queryFn: () => getEventsByslugId(slugId, userId),
    staleTime: 5 * 60 * 1000,
  });

  // single event
  const { data: event = null, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
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
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      console.log('error >>>', error);
      toast.error(error.message || 'Failed to upload file!');
    },
  });

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteEventFile(fileId),
    onSuccess: () => {
      toast.success('File deleted successfully!');
      queryClient.invalidateQueries(['event', eventId]);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete file!');
    },
  });

  // Update event time (for drag & drop and resize)
  const updateEventTimeMutation = useMutation({
    mutationFn: ({ eventId, timeData }) => updateEventTime(eventId, timeData),
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['event', eventId]);
      toast.success('Event time updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event time!');
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

  const handleUpdateEventTime = useCallback(({ eventId, timeData }) => {
    updateEventTimeMutation.mutateAsync({ eventId, timeData });
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

  const formFields = [
    { label: 'Title', name: 'title', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'text' },
    {
      label: 'Start Time',
      name: 'start_time',
      type: 'datetime-local',
      required: true,
    },
    {
      label: 'End Time',
      name: 'end_time',
      type: 'datetime-local',
      required: true,
    },
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

  const getValidationRules = (name) => {
    const rule = {};

    switch (name) {
      case 'title':
        rule.required = 'Title is required';
        break;
      case 'start_time':
        rule.required = 'Start time is required';
        break;
      case 'end_time':
        rule.required = 'End time is required';
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
    event,
    events,
    selectedEvent,
    currentPath,

    // Loading
    eventsMetaLoading,
    eventsLoading,
    eventLoading,

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
    handleUpdateEventTime,

    // Mutations
    searchEvents: searchEventsMutation.mutateAsync,
    filterEvents: filterEventsMutation.mutateAsync,
    createEvent: createEventMutation.mutateAsync,
    updateEvent: updateEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
    uploadEventFile: uploadFileMutation.mutateAsync,
    deleteEventFile: deleteFileMutation.mutateAsync,
    updateEventTime: updateEventTimeMutation.mutateAsync,

    // States
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isDeletingFile: deleteFileMutation.isPending,
    isUpdatingEventTime: updateEventTimeMutation.isPending,
  };
};
