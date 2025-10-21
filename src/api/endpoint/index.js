export const isDev = () => {
  return import.meta.env.MODE === 'development';
};

export const BACKEND_URL = isDev()
  ? 'https://backend.vsrlaw.ca/api'
  : 'https://backend.vsrlaw.ca/api';

export const endpoints = {
  formData: 'form-data',
  firmRegister: 'firm/register',
  resendVerification: 'firm/resend-link',
  resendUserVerification: 'user/resend-verification',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  login: 'login',
  verifyOtp: 'verify-otp',
  resendOtp: 'resend-otp',

  // Dashboard endpoint
  getDashboardSummary: 'v2/dashboard/summary',

  // Event endpoint
  eventMeta: 'v2/event/meta',
  getEvent: 'v2/event/show',
  getEvents: 'v2/event/list',
  createEvent: 'v2/event/store',
  deleteReminder: 'v2/event/deleteReminder',
  updateEvent: 'v2/event/update',
  deleteEvent: 'v2/event/delete',
  searchEvent: 'v2/event/search',
  uploadEventFile: 'v2/event/uploadAttachment',
  deleteEventFile: 'v2/event/deleteAttachment',
  updateEventTime: 'v2/event/time',

  // Task endpoint
  getTaskMeta: 'v2/task/meta',
  createTask: 'v2/task/store',
  getTasks: 'v2/task/list',
  getTask: 'v2/task/show',
  updateTask: 'v2/task/update',
  updateTaskStatus: 'v2/task/update-status',
  deleteTask: 'v2/task/delete',
  searchTask: 'v2/task/search',
  uploadTaskFile: 'v2/task/uploadAttachment',
  deleteTaskFile: 'v2/task/deleteAttachment',
  filterTask: 'v2/task/filter',
  deleteTaskReminder: 'v2/task/deleteReminder',

  // Comment endpoint
  getCommentMeta: 'v2/task/comment/meta',
  getAllComments: 'v2/task/comment/list',
  createComment: 'v2/task/comment/store',
  uploadCommentAttachment: 'v2/task/comment/uploadAttachment',

  // Matter endpoint
  getMatterMeta: 'v2/matter/meta',
  getMatters: 'v2/matter/list',
  matterIntake: 'v2/matter/intake',
  storeCaseKeyDates: 'v2/matter/case-key-dates/store',
  addForm: 'v2/matter/form/store',
  updateForm: 'v2/matter/form/update',

  // Contact endpoint
  getContacts: 'v2/matter/contacts/list',
  getContact: 'v2/matter/contacts/show',
  getContactMeta: 'v2/matter/contacts/meta',
  createContact: 'v2/matter/contacts/store',
  searchContact: 'v2/matter/contacts/search',
  updateContact: 'v2/matter/contacts/update',
  deleteContact: 'v2/matter/contacts/delete',

  // Documents endpoints
  getDocumentsMeta: 'v2/documents/meta',
  getFolders: 'v2/documents/folders',
  getFoldersBySlug: 'v2/documents/list', // New endpoint for slug-based folder listing
  getFolderContents: 'v2/documents/folders',
  getItems: 'v2/documents/getItems', // New endpoint for getting folder contents
  createFolder: 'v2/documents/folders',
  addFolder: 'v2/documents/addFolder', // New endpoint for creating folders with slug
  renameFolder: 'v2/documents/renameFolder', // New endpoint for renaming folders
  uploadFile: 'v2/documents/uploadfile',
  deleteDocument: 'v2/documents/delete', // Updated endpoint for delete operations
  // Notes endpoints
  getNotes: 'v2/matter/notes/list',
  getNote: 'v2/matter/notes/show',
  createNote: 'v2/matter/notes/store',
  updateNote: 'v2/matter/notes/update',
  deleteNote: 'v2/matter/notes/delete',
  getNotesMeta: 'v2/matter/notes/meta',
  uploadNoteAttachment: 'v2/matter/notes/uploadAttachment',
  deleteNoteAttachment: 'v2/matter/notes/deleteAttachment',

  // Setup Endpoints
  // Users endpoints
  getUsersMeta: 'v2/setup/users/meta',
  getUsers: 'v2/setup/users/list',
  getUser: 'v2/setup/users/show',
  createUser: 'v2/setup/users/store',
  updateUser: 'v2/setup/users/update',
  deleteUser: 'v2/setup/users/delete',
  searchUser: 'v2/setup/users/search',
  updateUserStatus: 'v2/setup/users/status',

  // Profile endpoints
  getProfile: 'v2/profile/show',
  updateProfile: 'v2/update-profile',
  changePassword: 'v2/profile/change-password',
  uploadProfilePicture: 'v2/profile/upload-picture',

  // Role
  getRoles: 'v2/setup/roles/list',
  showRole: 'v2/setup/roles/show',
  deleteRole: 'v2/setup/roles/delete',
  getPermissions: 'v2/setup/roles/permissions',
  storeRole: 'v2/setup/roles/store',
  updateRole: 'v2/setup/roles/update',

  // Task Type
  getTaskTypes: 'v2/setup/master/list/task-type',
  showTaskType: 'v2/setup/master/show',
  deleteTaskType: 'v2/setup/master/delete',
  storeTaskType: 'v2/setup/master/store/task-type',
  updateTaskType: 'v2/setup/master/update',
  updateTaskTypeStatus: 'v2/setup/master/updateStatus',

  // Task Status
  getTaskStatus: 'v2/setup/master/list/task-status',
  showTaskStatus: 'v2/setup/master/show',
  deleteTaskStatus: 'v2/setup/master/delete',
  storeTaskStatus: 'v2/setup/master/store/task-status',
  updateSetupTaskStatus: 'v2/setup/master/update',
  updateTaskStatusStatus: 'v2/setup/master/updateStatus',

  // Task Priority
  getTaskPriorities: 'v2/setup/master/list/task-priority',
  showTaskPriority: 'v2/setup/master/show',
  deleteTaskPriority: 'v2/setup/master/delete',
  storeTaskPriority: 'v2/setup/master/store/task-priority',
  updateTaskPriority: 'v2/setup/master/update',
  updateTaskPriorityStatus: 'v2/setup/master/updateStatus',

  // Task UTBMS Code
  getTaskUTBMSCodes: 'v2/setup/master/list/task-utbms-code',
  showTaskUTBMSCode: 'v2/setup/master/show',
  deleteTaskUTBMSCode: 'v2/setup/master/delete',
  storeTaskUTBMSCode: 'v2/setup/master/store/task-utbms-code',
  updateTaskUTBMSCode: 'v2/setup/master/update',
  updateTaskUTBMSCodeStatus: 'v2/setup/master/updateStatus',

  // Event Category
  getEventCategories: 'v2/setup/master/list/event-category-id',
  showEventCategory: 'v2/setup/master/show',
  deleteEventCategory: 'v2/setup/master/delete',
  storeEventCategory: 'v2/setup/master/store/event-category-id',
  updateEventCategory: 'v2/setup/master/update',
  updateEventCategoryStatus: 'v2/setup/master/updateStatus',

  // Event Status
  getEventStatus: 'v2/setup/master/list/event-status',
  showEventStatus: 'v2/setup/master/show',
  deleteEventStatus: 'v2/setup/master/delete',
  storeEventStatus: 'v2/setup/master/store/event-status',
  updateEventStatus: 'v2/setup/master/update',
  updateEventStatusStatus: 'v2/setup/master/updateStatus',

  // Matter Case Role
  getMatterCaseRoles: 'v2/setup/master/list/matter-case-role',
  showMatterCaseRole: 'v2/setup/master/show',
  deleteMatterCaseRole: 'v2/setup/master/delete',
  storeMatterCaseRole: 'v2/setup/master/store/matter-case-role',
  updateMatterCaseRole: 'v2/setup/master/update',
  updateMatterCaseRoleStatus: 'v2/setup/master/updateStatus',

  // Matter Case Type
  getMatterCaseTypes: 'v2/setup/master/list/matter-case-type',
  showMatterCaseType: 'v2/setup/master/show',
  deleteMatterCaseType: 'v2/setup/master/delete',
  storeMatterCaseType: 'v2/setup/master/store/matter-case-type',
  updateMatterCaseType: 'v2/setup/master/update',
  updateMatterCaseTypeStatus: 'v2/setup/master/updateStatus',

  // Matter Case Status
  getMatterCaseStatuses: 'v2/setup/master/list/matter-case-status',
  showMatterCaseStatus: 'v2/setup/master/show',
  deleteMatterCaseStatus: 'v2/setup/master/delete',
  storeMatterCaseStatus: 'v2/setup/master/store/matter-case-status',
  updateMatterCaseStatus: 'v2/setup/master/update',
  updateMatterCaseStatusStatus: 'v2/setup/master/updateStatus',

  // Matter Marketing Source
  getMatterMarketingSources: 'v2/setup/master/list/matter-marketing-source',
  showMatterMarketingSource: 'v2/setup/master/show',
  deleteMatterMarketingSource: 'v2/setup/master/delete',
  storeMatterMarketingSource: 'v2/setup/master/store/matter-marketing-source',
  updateMatterMarketingSource: 'v2/setup/master/update',
  updateMatterMarketingSourceStatus: 'v2/setup/master/updateStatus',

  // Matter Ad Campaign
  getMatterAdCampaigns: 'v2/setup/master/list/matter-ad-campaign',
  showMatterAdCampaign: 'v2/setup/master/show',
  deleteMatterAdCampaign: 'v2/setup/master/delete',
  storeMatterAdCampaign: 'v2/setup/master/store/matter-ad-campaign',
  updateMatterAdCampaign: 'v2/setup/master/update',
  updateMatterAdCampaignStatus: 'v2/setup/master/updateStatus',

  // Matter Rating
  getMatterRatings: 'v2/setup/master/list/matter-rating',
  showMatterRating: 'v2/setup/master/show',
  deleteMatterRating: 'v2/setup/master/delete',
  storeMatterRating: 'v2/setup/master/store/matter-rating',
  updateMatterRating: 'v2/setup/master/update',
  updateMatterRatingStatus: 'v2/setup/master/updateStatus',

  // Matter Call Outcome
  getMatterCallOutcomes: 'v2/setup/master/list/matter-call-outcome',
  showMatterCallOutcome: 'v2/setup/master/show',
  deleteMatterCallOutcome: 'v2/setup/master/delete',
  storeMatterCallOutcome: 'v2/setup/master/store/matter-call-outcome',
  updateMatterCallOutcome: 'v2/setup/master/update',
  updateMatterCallOutcomeStatus: 'v2/setup/master/updateStatus',

  // Matter Office Location
  getMatterOfficeLocations: 'v2/setup/master/list/matter-office-location',
  showMatterOfficeLocation: 'v2/setup/master/show',
  deleteMatterOfficeLocation: 'v2/setup/master/delete',
  storeMatterOfficeLocation: 'v2/setup/master/store/matter-office-location',
  updateMatterOfficeLocation: 'v2/setup/master/update',
  updateMatterOfficeLocationStatus: 'v2/setup/master/updateStatus',

  // Firm
  getFirmMeta: 'v2/setup/firm-meta',
  getFirmDetails: 'v2/setup/firm-update',
  updateFirmDetails: 'v2/setup/firm-update',
};
