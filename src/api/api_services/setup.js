import { apiService } from './index';
import { endpoints } from '../endpoint';

// List - GET (Pattern based api calling, need to be usable)
export const getSetup = (endpoint) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Show - GET
export const getSetupShow = (endpoint) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Delete - DELETE
export const getSetupDelete = (endpoint) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Store - POST
export const getSetupStore = (endpoint, data) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'POST',
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Update - PUT
export const getSetupUpdate = (endpoint, data) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'PUT',
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Update Status - PATCH
export const getSetupUpdateStatus = (endpoint, data) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'PATCH',
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};
// Permission - GET
export const getSetupPermission = (endpoint) => {
  try {
    const response = apiService({
      endpoint: endpoint,
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error fetching setup:', error);
    throw error;
  }
};

// Role-specific API functions using the reusable pattern

// Get all roles
export const getRoles = () => {
  return getSetup(endpoints.getRoles);
};

// Get single role by ID
export const getRole = (id) => {
  return getSetupShow(`${endpoints.showRole}/${id}`);
};

// Create new role
export const createRole = (data) => {
  return getSetupStore(endpoints.storeRole, data);
};

// Update role
export const updateRole = (id, data) => {
  return getSetupUpdate(`${endpoints.updateRole}/${id}`, data);
};

// Delete role
export const deleteRole = (id) => {
  return getSetupDelete(`${endpoints.deleteRole}/${id}`);
};

// Get permissions for role creation/editing
export const getPermissions = () => {
  return getSetupPermission(endpoints.getPermissions);
};

// Task Type-specific API functions using the reusable pattern

// Get all task types
export const getTaskTypes = () => {
  return getSetup(endpoints.getTaskTypes);
};

// Get single task type by ID
export const getTaskType = (id) => {
  return getSetupShow(`${endpoints.showTaskType}/${id}`);
};

// Create new task type
export const createTaskType = (data) => {
  return getSetupStore(endpoints.storeTaskType, data);
};

// Update task type
export const updateTaskType = (id, data) => {
  return getSetupUpdate(`${endpoints.updateTaskType}/${id}`, data);
};

// Update task type status
export const updateTaskTypeStatus = (id, data) => {
  return getSetupUpdateStatus(`${endpoints.updateTaskTypeStatus}/${id}`, data);
};

// Delete task type
export const deleteTaskType = (id) => {
  return getSetupDelete(`${endpoints.deleteTaskType}/${id}`);
};

// Task Status-specific API functions using the reusable pattern

// Get all task statuses
export const getTaskStatuses = () => {
  return getSetup(endpoints.getTaskStatus);
};

// Get single task status by ID
export const getTaskStatus = (id) => {
  return getSetupShow(`${endpoints.showTaskStatus}/${id}`);
};

// Create new task status
export const createTaskStatus = (data) => {
  return getSetupStore(endpoints.storeTaskStatus, data);
};

// Update task status
export const updateTaskStatus = (id, data) => {
  return getSetupUpdate(`${endpoints.updateTaskStatus}/${id}`, data);
};

// Update task status status (is_active)
export const updateTaskStatusStatus = (id, data) => {
  return getSetupUpdateStatus(`${endpoints.updateTaskStatusStatus}/${id}`, data);
};

// Delete task status
export const deleteTaskStatus = (id) => {
  return getSetupDelete(`${endpoints.deleteTaskStatus}/${id}`);
};
