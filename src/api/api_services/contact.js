import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get contact meta
export const getContactMeta = async () => {
  const response = await apiService({
    endpoint: endpoints.getContactMeta,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch contact meta');
  return response.response || [];
};

// Get all contacts
export const getContacts = async () => {
  const response = await apiService({
    endpoint: endpoints.getContacts,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch contacts');
  return response.response?.contacts || [];
};

// Get contact by id
export const getContactById = async (id) => {
  console.log('id', id);
  const response = await apiService({
    endpoint: `${endpoints.getContact}/${id}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch contact');
  return response.response?.contact || {};
};

// Search contact
export const searchContact = async (searchData) => {
  const response = await apiService({
    endpoint: endpoints.searchContact,
    method: 'POST',
    data: searchData,
  });
  if (response.error) throw new Error('Failed to search contact');
  return response.response?.data || [];
};

// Filter contact
export const filterContact = async (queryParams) => {
  const response = await apiService({
    endpoint: `${endpoints.filterContact}?${queryParams}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to filter contact');
  return response.response?.data || [];
};

// Create contact
export const createContact = async (contactData) => {
  const response = await apiService({
    endpoint: endpoints.createContact,
    method: 'POST',
    data: contactData,
  });
  if (response.error) throw new Error('Failed to create contact');
  return response.response?.data;
};

// Update contact
export const updateContact = async (contactId, contactData) => {
  const response = await apiService({
    endpoint: `${endpoints.updateContact}/${contactId}`,
    method: 'PUT',
    data: contactData,
  });
  if (response.error) throw new Error('Failed to update contact');
  return response.response?.data;
};

// Delete contact
export const deleteContact = async (contactId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteContact}/${contactId}`,
    method: 'DELETE',
  });
  if (response.error) throw new Error('Failed to delete contact');
  return response.response?.data;
};
