export const isDev = () => {
  return import.meta.env.MODE === 'development';
};

export const BACKEND_URL = isDev()
  ? 'https://maplelawpro.com/newapp/public/api'
  : 'https://maplelawpro.com/newapp/public/api';

export const endpoints = {
  formData: 'form-data',
  firmRegister: 'firm/register',
  resendVerification: 'firm/resend-link',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  login: 'login',
  verifyOtp: 'verify-otp',
  resendOtp: 'resend-otp',

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

  // Users endpoints
  getUsersMeta: 'v2/setup/users/meta',
  getUsers: 'v2/setup/users/list',
  getUser: 'v2/setup/users/show',
  createUser: 'v2/setup/users/store',
  updateUser: 'v2/setup/users/update',
  deleteUser: 'v2/setup/users/delete',
  searchUser: 'v2/setup/users/search',
  updateUserStatus: 'v2/setup/users/status',
};
