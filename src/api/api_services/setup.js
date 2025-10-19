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
  return getSetupUpdate(`${endpoints.updateSetupTaskStatus}/${id}`, data);
};

// Update task status status (is_active)
export const updateTaskStatusStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateTaskStatusStatus}/${id}`,
    data
  );
};

// Delete task status
export const deleteTaskStatus = (id) => {
  return getSetupDelete(`${endpoints.deleteTaskStatus}/${id}`);
};

// Task Priority-specific API functions using the reusable pattern

// Get all task priorities
export const getTaskPriorities = () => {
  return getSetup(endpoints.getTaskPriorities);
};

// Get single task priority by ID
export const getTaskPriority = (id) => {
  return getSetupShow(`${endpoints.showTaskPriority}/${id}`);
};

// Create new task priority
export const createTaskPriority = (data) => {
  return getSetupStore(endpoints.storeTaskPriority, data);
};

// Update task priority
export const updateTaskPriority = (id, data) => {
  return getSetupUpdate(`${endpoints.updateTaskPriority}/${id}`, data);
};

// Update task priority status (is_active)
export const updateTaskPriorityStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateTaskPriorityStatus}/${id}`,
    data
  );
};

// Delete task priority
export const deleteTaskPriority = (id) => {
  return getSetupDelete(`${endpoints.deleteTaskPriority}/${id}`);
};

// Task UTBMS Code-specific API functions using the reusable pattern

// Get all task UTBMS codes
export const getTaskUTBMSCodes = () => {
  return getSetup(endpoints.getTaskUTBMSCodes);
};

// Get single task UTBMS code by ID
export const getTaskUTBMSCode = (id) => {
  return getSetupShow(`${endpoints.showTaskUTBMSCode}/${id}`);
};

// Create new task UTBMS code
export const createTaskUTBMSCode = (data) => {
  return getSetupStore(endpoints.storeTaskUTBMSCode, data);
};

// Update task UTBMS code
export const updateTaskUTBMSCode = (id, data) => {
  return getSetupUpdate(`${endpoints.updateTaskUTBMSCode}/${id}`, data);
};

// Update task UTBMS code status (is_active)
export const updateTaskUTBMSCodeStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateTaskUTBMSCodeStatus}/${id}`,
    data
  );
};

// Delete task UTBMS code
export const deleteTaskUTBMSCode = (id) => {
  return getSetupDelete(`${endpoints.deleteTaskUTBMSCode}/${id}`);
};

// Event Category-specific API functions using the reusable pattern

// Get all event categories
export const getEventCategories = () => {
  return getSetup(endpoints.getEventCategories);
};

// Get single event category by ID
export const getEventCategory = (id) => {
  return getSetupShow(`${endpoints.showEventCategory}/${id}`);
};

// Create new event category
export const createEventCategory = (data) => {
  return getSetupStore(endpoints.storeEventCategory, data);
};

// Update event category
export const updateEventCategory = (id, data) => {
  return getSetupUpdate(`${endpoints.updateEventCategory}/${id}`, data);
};

// Update event category status (is_active)
export const updateEventCategoryStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateEventCategoryStatus}/${id}`,
    data
  );
};

// Delete event category
export const deleteEventCategory = (id) => {
  return getSetupDelete(`${endpoints.deleteEventCategory}/${id}`);
};

// Event Status-specific API functions using the reusable pattern

// Get all event statuses
export const getEventStatuses = () => {
  return getSetup(endpoints.getEventStatus);
};

// Get single event status by ID
export const getEventStatus = (id) => {
  return getSetupShow(`${endpoints.showEventStatus}/${id}`);
};

// Create new event status
export const createEventStatus = (data) => {
  return getSetupStore(endpoints.storeEventStatus, data);
};

// Update event status
export const updateEventStatus = (id, data) => {
  return getSetupUpdate(`${endpoints.updateEventStatus}/${id}`, data);
};

// Update event status status (is_active)
export const updateEventStatusStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateEventStatusStatus}/${id}`,
    data
  );
};

// Delete event status
export const deleteEventStatus = (id) => {
  return getSetupDelete(`${endpoints.deleteEventStatus}/${id}`);
};

// Services (Graph/SMTP) - create/list utilities
export const createService = (data) => {
  // POST /api/v2/setup/services
  return getSetupStore('v2/setup/services', data);
};

// Delete a service by ID
export const deleteService = (id) => {
  // DELETE /api/v2/setup/services/:id
  return getSetupDelete(`v2/setup/services/${id}`);
};

// Update a service by ID
export const updateService = (id, data) => {
  // PUT /api/v2/setup/services/:id
  return getSetupUpdate(`v2/setup/services/${id}`, data);
};

// Matter Case Role-specific API functions using the reusable pattern

// Get all matter case roles
export const getMatterCaseRoles = () => {
  return getSetup(endpoints.getMatterCaseRoles);
};

// Get single matter case role by ID
export const getMatterCaseRole = (id) => {
  return getSetupShow(`${endpoints.showMatterCaseRole}/${id}`);
};

// Create new matter case role
export const createMatterCaseRole = (data) => {
  return getSetupStore(endpoints.storeMatterCaseRole, data);
};

// Update matter case role
export const updateMatterCaseRole = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterCaseRole}/${id}`, data);
};

// Update matter case role status (is_active)
export const updateMatterCaseRoleStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterCaseRoleStatus}/${id}`,
    data
  );
};

// Delete matter case role
export const deleteMatterCaseRole = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterCaseRole}/${id}`);
};

// Matter Case Type-specific API functions using the reusable pattern

// Get all matter case types
export const getMatterCaseTypes = () => {
  return getSetup(endpoints.getMatterCaseTypes);
};

// Get single matter case type by ID
export const getMatterCaseType = (id) => {
  return getSetupShow(`${endpoints.showMatterCaseType}/${id}`);
};

// Create new matter case type
export const createMatterCaseType = (data) => {
  return getSetupStore(endpoints.storeMatterCaseType, data);
};

// Update matter case type
export const updateMatterCaseType = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterCaseType}/${id}`, data);
};

// Update matter case type status (is_active)
export const updateMatterCaseTypeStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterCaseTypeStatus}/${id}`,
    data
  );
};

// Delete matter case type
export const deleteMatterCaseType = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterCaseType}/${id}`);
};

// Matter Case Status-specific API functions using the reusable pattern

// Get all matter case statuses
export const getMatterCaseStatuses = () => {
  return getSetup(endpoints.getMatterCaseStatuses);
};

// Get single matter case status by ID
export const getMatterCaseStatus = (id) => {
  return getSetupShow(`${endpoints.showMatterCaseStatus}/${id}`);
};

// Create new matter case status
export const createMatterCaseStatus = (data) => {
  return getSetupStore(endpoints.storeMatterCaseStatus, data);
};

// Update matter case status
export const updateMatterCaseStatus = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterCaseStatus}/${id}`, data);
};

// Update matter case status status (is_active)
export const updateMatterCaseStatusStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterCaseStatusStatus}/${id}`,
    data
  );
};

// Delete matter case status
export const deleteMatterCaseStatus = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterCaseStatus}/${id}`);
};

// Matter Marketing Source-specific API functions using the reusable pattern

// Get all matter marketing sources
export const getMatterMarketingSources = () => {
  return getSetup(endpoints.getMatterMarketingSources);
};

// Get single matter marketing source by ID
export const getMatterMarketingSource = (id) => {
  return getSetupShow(`${endpoints.showMatterMarketingSource}/${id}`);
};

// Create new matter marketing source
export const createMatterMarketingSource = (data) => {
  return getSetupStore(endpoints.storeMatterMarketingSource, data);
};

// Update matter marketing source
export const updateMatterMarketingSource = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterMarketingSource}/${id}`, data);
};

// Update matter marketing source status (is_active)
export const updateMatterMarketingSourceStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterMarketingSourceStatus}/${id}`,
    data
  );
};

// Delete matter marketing source
export const deleteMatterMarketingSource = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterMarketingSource}/${id}`);
};

// Matter Ad Campaign-specific API functions using the reusable pattern

// Get all matter ad campaigns
export const getMatterAdCampaigns = () => {
  return getSetup(endpoints.getMatterAdCampaigns);
};

// Get single matter ad campaign by ID
export const getMatterAdCampaign = (id) => {
  return getSetupShow(`${endpoints.showMatterAdCampaign}/${id}`);
};

// Create new matter ad campaign
export const createMatterAdCampaign = (data) => {
  return getSetupStore(endpoints.storeMatterAdCampaign, data);
};

// Update matter ad campaign
export const updateMatterAdCampaign = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterAdCampaign}/${id}`, data);
};

// Update matter ad campaign status (is_active)
export const updateMatterAdCampaignStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterAdCampaignStatus}/${id}`,
    data
  );
};

// Delete matter ad campaign
export const deleteMatterAdCampaign = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterAdCampaign}/${id}`);
};

// Matter Rating-specific API functions using the reusable pattern

// Get all matter ratings
export const getMatterRatings = () => {
  return getSetup(endpoints.getMatterRatings);
};

// Get single matter rating by ID
export const getMatterRating = (id) => {
  return getSetupShow(`${endpoints.showMatterRating}/${id}`);
};

// Create new matter rating
export const createMatterRating = (data) => {
  return getSetupStore(endpoints.storeMatterRating, data);
};

// Update matter rating
export const updateMatterRating = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterRating}/${id}`, data);
};

// Update matter rating status (is_active)
export const updateMatterRatingStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterRatingStatus}/${id}`,
    data
  );
};

// Delete matter rating
export const deleteMatterRating = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterRating}/${id}`);
};

// Matter Call Outcome-specific API functions using the reusable pattern

// Get all matter call outcomes
export const getMatterCallOutcomes = () => {
  return getSetup(endpoints.getMatterCallOutcomes);
};

// Get single matter call outcome by ID
export const getMatterCallOutcome = (id) => {
  return getSetupShow(`${endpoints.showMatterCallOutcome}/${id}`);
};

// Create new matter call outcome
export const createMatterCallOutcome = (data) => {
  return getSetupStore(endpoints.storeMatterCallOutcome, data);
};

// Update matter call outcome
export const updateMatterCallOutcome = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterCallOutcome}/${id}`, data);
};

// Update matter call outcome status (is_active)
export const updateMatterCallOutcomeStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterCallOutcomeStatus}/${id}`,
    data
  );
};

// Delete matter call outcome
export const deleteMatterCallOutcome = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterCallOutcome}/${id}`);
};

// Matter Office Location-specific API functions using the reusable pattern

// Get all matter office locations
export const getMatterOfficeLocations = () => {
  return getSetup(endpoints.getMatterOfficeLocations);
};

// Get single matter office location by ID
export const getMatterOfficeLocation = (id) => {
  return getSetupShow(`${endpoints.showMatterOfficeLocation}/${id}`);
};

// Create new matter office location
export const createMatterOfficeLocation = (data) => {
  return getSetupStore(endpoints.storeMatterOfficeLocation, data);
};

// Update matter office location
export const updateMatterOfficeLocation = (id, data) => {
  return getSetupUpdate(`${endpoints.updateMatterOfficeLocation}/${id}`, data);
};

// Update matter office location status (is_active)
export const updateMatterOfficeLocationStatus = (id, data) => {
  return getSetupUpdateStatus(
    `${endpoints.updateMatterOfficeLocationStatus}/${id}`,
    data
  );
};

// Delete matter office location
export const deleteMatterOfficeLocation = (id) => {
  return getSetupDelete(`${endpoints.deleteMatterOfficeLocation}/${id}`);
};

// Firm - setup
export const getFirmMeta = () => {
  return getSetup(endpoints.getFirmMeta);
};
export const getFirmDetails = () => {
  return getSetupShow(endpoints.getFirmDetails);
};
export const updateFirmDetails = (data) => {
  return getSetupStore(endpoints.updateFirmDetails, data);
};
