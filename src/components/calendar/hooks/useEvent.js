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
    onSuccess: () => queryClient.invalidateQueries(['events']),
  });

  // Update
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, eventData }) => updateEvent(eventId, eventData),
    onSuccess: () => queryClient.invalidateQueries(['events']),
  });

  // Delete
  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => deleteEvent(eventId),
    onSuccess: () => queryClient.invalidateQueries(['events']),
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: (fileData) => uploadEventFile(fileData),
    onSuccess: () => {
      if (selectedEvent)
        queryClient.invalidateQueries(['events', selectedEvent.id]);
    },
  });

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteEventFile(fileId),
    onSuccess: () => {
      if (selectedEvent)
        queryClient.invalidateQueries(['events', selectedEvent.id]);
    },
  });

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
