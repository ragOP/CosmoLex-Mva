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
  getEvent: 'v2/event/show',
  getEvents: 'v2/event/list',
  createEvent: 'v2/event/store',
  deleteReminder: 'v2/event/deleteReminder',

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

  getMatterMeta: 'v2/matter/meta',
  getMatters: 'v2/matter/list',
  matterIntake: 'v2/matter/intake',
  getContacts: 'v2/matter/contacts/list',
  getContact: 'v2/matter/contacts/show',
  getContactMeta: 'v2/matter/contacts/meta',
  createContact: 'v2/matter/contacts/store',
  searchContact: 'v2/matter/contacts/search',
  updateContact: 'v2/matter/contacts/update',
  deleteContact: 'v2/matter/contacts/delete',
  storeCaseKeyDates: 'v2/matter/case-key-dates/store',
  addForm: 'v2/matter/form/store',
  updateForm: 'v2/matter/form/update',
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
  deleteDocument: 'v2/documents',
  // Notes endpoints
  getNotes: 'v2/matter/notes/list',
  getNote: 'v2/matter/notes/show',
  createNote: 'v2/matter/notes/store',
  updateNote: 'v2/matter/notes/update',
  deleteNote: 'v2/matter/notes/delete',
  getNotesMeta: 'v2/matter/notes/meta',
};
