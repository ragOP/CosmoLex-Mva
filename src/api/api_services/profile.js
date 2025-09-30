import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get current user profile
export const getProfile = async () => {
  const response = await apiService({
    endpoint: endpoints.getProfile,
    method: 'GET',
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data || {};
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await apiService({
    endpoint: endpoints.updateProfile,
    method: 'PUT',
    data: profileData,
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};

// Change user password
export const changePassword = async (passwordData) => {
  const response = await apiService({
    endpoint: endpoints.changePassword,
    method: 'POST',
    data: passwordData,
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};

// Upload profile picture
export const uploadProfilePicture = async (fileData) => {
  const response = await apiService({
    endpoint: endpoints.uploadProfilePicture,
    method: 'POST',
    data: fileData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (response.response?.Apistatus === false)
    throw new Error(response.response.message);
  return response.response?.data;
};
