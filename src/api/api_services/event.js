import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get event meta
export const getEventMeta = async () => {
  const response = await apiService({
    endpoint: endpoints.eventMeta,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch event meta');
  return response.response || [];
};

// Get all events
export const getEvents = async () => {
  const response = await apiService({
    endpoint: endpoints.getEvents,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch events');
  return response?.response?.events || [];
};

// Get events by slugId
export const getEventsByslugId = async (slugId = null) => {
  const response = await apiService({
    endpoint: slugId ? `${endpoints.getEvents}/${slugId}` : endpoints.getEvents,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch events');
  return response?.response?.events || [];
};

// Get event by id
export const getEventById = async (id) => {
  const response = await apiService({
    endpoint: `${endpoints.getEvent}/${id}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch event');
  return response?.response?.event || {};
};

// Search event
export const searchEvent = async (searchData) => {
  const response = await apiService({
    endpoint: endpoints.searchEvent,
    method: 'GET',
    data: searchData,
  });
  if (response.error) throw new Error('Failed to search event');
  return response.response?.data || [];
};

// Filter event
export const filterEvent = async (queryParams) => {
  const response = await apiService({
    endpoint: `${endpoints.filterEvent}?${queryParams}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to filter event');
  return response.response?.data || [];
};

// Create event
export const createEvent = async (eventData) => {
  const response = await apiService({
    endpoint: endpoints.createEvent,
    method: 'POST',
    data: eventData,
  });
  if (response.error) throw new Error('Failed to create event');
  return response.response?.data;
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  const response = await apiService({
    endpoint: `${endpoints.updateEvent}/${eventId}`,
    method: 'PUT',
    data: eventData,
  });
  if (response.error) throw new Error('Failed to update event');
  return response.response?.data;
};

// Delete event
export const deleteEvent = async (eventId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteEvent}/${eventId}`,
    method: 'DELETE',
  });
  if (response.error) throw new Error('Failed to delete event');
  return response.response?.data;
};

// Upload event file
export const uploadEventFile = async (fileData) => {
  const response = await apiService({
    endpoint: endpoints.uploadEventFile,
    method: 'POST',
    data: fileData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.error) throw new Error('Failed to upload event file');
  return response?.response;
};

// Delete event file
export const deleteEventFile = async (fileId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteEventFile}/${fileId}`,
    method: 'DELETE',
  });
  if (response.error) throw new Error('Failed to delete event file');
  return response.response;
};
