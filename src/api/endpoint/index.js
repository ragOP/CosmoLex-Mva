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
  getEvent: 'v2/event/show',
  getEvents: 'v2/event/list',
  createEvent: 'v2/event/store',
  createTask: 'v2/task/store',
  getTasks: 'v2/task/list',
  getTask: 'v2/task/show',
  updateTask: 'v2/task/update',
  updateTaskStatus: 'v2/task/update-status',
  deleteTask: 'v2/task/delete',
  getMatterMeta: 'v2/matter/meta',
  getMatters: 'v2/matter/list',
  matterIntake: 'v2/matter/intake',
  getContacts: 'v2/matter/contacts/list',
  getContact: 'v2/matter/contacts/show',
  createContact: 'v2/matter/contacts/store',
  searchContact: 'v2/matter/contacts/search',
  updateContact: 'v2/matter/contacts/update',
  deleteContact: 'v2/matter/contacts/delete',
  storeCaseKeyDates: 'v2/matter/case-key-dates/store',
  addForm: 'api/v2/matter/form/store',
};
