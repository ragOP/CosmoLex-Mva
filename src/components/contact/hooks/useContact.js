import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getContactMeta,
  getContacts,
  getContactById,
  searchContact,
  filterContact,
  createContact,
  updateContact,
  deleteContact,
} from '@/api/api_services/contact';
import { toast } from 'sonner';

export const useContact = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract contactId from URL
  const contactId = searchParams.get('contactId');

  // Contact meta
  const { data: contactsMeta = [], isLoading: contactsMetaLoading } = useQuery({
    queryKey: ['contactsMeta'],
    queryFn: getContactMeta,
    staleTime: 5 * 60 * 1000,
  });

  // All contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
    staleTime: 5 * 60 * 1000,
  });

  // Single contact
  const { data: contact = {}, isLoading: contactLoading } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContactById(contactId),
    staleTime: 5 * 60 * 1000,
    enabled: !!contactId,
  });

  // Search contacts
  const searchContactsMutation = useMutation({
    mutationFn: (searchData) => searchContact(searchData),
  });

  // Filter contacts
  const filterContactsMutation = useMutation({
    mutationFn: (queryParams) => filterContact(queryParams),
  });

  // Create
  const createContactMutation = useMutation({
    mutationFn: (contactData) => createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Contact created successfully!');
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
    },
  });

  // Update
  const updateContactMutation = useMutation({
    mutationFn: ({ contactId, contactData }) =>
      updateContact(contactId, contactData),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Contact updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    },
  });

  // Delete
  const deleteContactMutation = useMutation({
    mutationFn: (contactId) => deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      toast.success('Contact deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    },
  });

  const handleSearchContacts = useCallback((searchData) => {
    searchContactsMutation.mutateAsync(searchData);
  }, []);

  const handleFilterContacts = useCallback((queryParams) => {
    filterContactsMutation.mutateAsync(queryParams);
  }, []);

  const handleCreateContact = useCallback((contactData) => {
    createContactMutation.mutateAsync(contactData);
  }, []);

  const handleUpdateContact = useCallback(({ contactId, contactData }) => {
    updateContactMutation.mutateAsync({ contactId, contactData });
  }, []);

  const handleDeleteContact = useCallback((contactId) => {
    deleteContactMutation.mutateAsync(contactId);
  }, []);

  // Navigation (optional – mimic folder-style nav)
  const navigateToContact = useCallback((contact) => {
    setSelectedContact(contact);
    setCurrentPath((prev) => [...prev, contact]);
  }, []);

  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length > 0) {
        setSelectedTask(newPath[newPath.length - 1]);
      } else {
        setSelectedTask(null);
      }
    }
  }, [currentPath]);

  const navigateToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedTask(null);
  }, []);

  return {
    // State
    contactsMeta,
    contacts,
    contact,
    selectedContact,
    currentPath,

    // Loading
    contactsMetaLoading,
    contactsLoading,

    // Actions
    navigateToContact,
    navigateBack,
    navigateToRoot,

    // Mutations
    handleSearchContacts,
    handleFilterContacts,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,

    // States
    isCreating: createContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
};
