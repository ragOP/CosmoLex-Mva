import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get task meta
export const getTaskMeta = async () => {
  const response = await apiService({
    endpoint: endpoints.getTaskMeta,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch task meta');
  return response.response || [];
};

// Get all tasks
export const getTasks = async () => {
  const response = await apiService({
    endpoint: endpoints.getTasks,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch tasks');
  return response.response?.tasks || [];
};

// Get task by id
export const getTaskById = async (id) => {
  console.log('id', id);
  const response = await apiService({
    endpoint: `${endpoints.getTask}/${id}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to fetch task');
  return response.response?.task || {};
};

// Search task
export const searchTask = async (searchData) => {
  const response = await apiService({
    endpoint: endpoints.searchTask,
    method: 'POST',
    data: searchData,
  });
  if (response.error) throw new Error('Failed to search task');
  return response.response?.data || [];
};

// Filter task
export const filterTask = async (queryParams) => {
  const response = await apiService({
    endpoint: `${endpoints.filterTask}?${queryParams}`,
    method: 'GET',
  });
  if (response.error) throw new Error('Failed to filter task');
  return response.response?.data || [];
};

// Create task
export const createTask = async (taskData) => {
  const response = await apiService({
    endpoint: endpoints.createTask,
    method: 'POST',
    data: taskData,
  });
  if (response.error) throw new Error('Failed to create task');
  return response.response?.data;
};

// Update task
export const updateTask = async (taskId, taskData) => {
  const response = await apiService({
    endpoint: `${endpoints.updateTask}/${taskId}`,
    method: 'PUT',
    data: taskData,
  });
  if (response.error) throw new Error('Failed to update task');
  return response.response?.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status_id) => {
  const response = await apiService({
    endpoint: `${endpoints.updateTaskStatus}/${taskId}`,
    method: 'POST',
    data: { status_id },
  });
  if (response.error) throw new Error('Failed to update task status');
  return response.response?.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteTask}/${taskId}`,
    method: 'DELETE',
  });
  if (response.error) throw new Error('Failed to delete task');
  return response.response?.data;
};

// Upload task file
export const uploadTaskFile = async (fileData) => {
  const response = await apiService({
    endpoint: endpoints.uploadTaskFile,
    method: 'POST',
    data: fileData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.error) throw new Error('Failed to upload file');
  return response.response?.data;
};

// Delete task file
export const deleteTaskFile = async (fileId) => {
  const response = await apiService({
    endpoint: `${endpoints.deleteTaskFile}/${fileId}`,
    method: 'DELETE',
  });
  if (response.error) throw new Error('Failed to delete task file');
  return response.response?.data;
};
