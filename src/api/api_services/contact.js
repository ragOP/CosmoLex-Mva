import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get contact meta
export const getContactMeta = async () => {
  const response = await apiService({
    endpoint: endpoints.getContactMeta,
    method: 'GET',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response || [];
};

// Get all contacts
export const getContacts = async () => {
  const response = await apiService({
    endpoint: endpoints.getContacts,
    method: 'GET',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data || [];
};

// Get contact by id
export const getContactById = async (id) => {
  const response = await apiService({
    endpoint: `${endpoints.getContact}/${id}`,
    method: 'GET',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data || {};
};

// Search contact
export const searchContact = async (searchData) => {
  const response = await apiService({
    endpoint: endpoints.searchContact,
    method: 'POST',
    data: searchData,
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data || [];
};

// Filter contact
export const filterContact = async (queryParams) => {
  const response = await apiService({
    endpoint: `${endpoints.filterContact}?${queryParams}`,
    method: 'GET',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data || [];
};

// Create contact
export const createContact = async (contactData) => {
  const response = await apiService({
    endpoint: endpoints.createContact,
    method: 'POST',
    data: contactData,
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};

// Update contact
export const updateContact = async (contactId, contactData) => {
  const response = await apiService({
    endpoint: `${endpoints.updateContact}/${contactId}`,
    method: 'PUT',
    data: contactData,
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};

// Delete contact
export const deleteContact = async (contactId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteContact}/${contactId}`,
    method: 'DELETE',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};
