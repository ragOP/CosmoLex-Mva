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

  return {
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
