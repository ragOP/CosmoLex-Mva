import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get all folders
export const getFolders = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getFolders,
      method: 'GET'
    });
    
    if (response.error) {
      throw new Error('Failed to fetch folders');
    }
    
    return response.response?.data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

// Get folder contents (files and subfolders)
export const getFolderContents = async (folderId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getFolderContents}/${folderId}/contents`,
      method: 'GET'
    });
    
    if (response.error) {
      throw new Error('Failed to fetch folder contents');
    }
    
    return response.response?.data || { items: [] };
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
};

// Create new folder
export const createFolder = async (folderData) => {
  try {
    const response = await apiService({
      endpoint: endpoints.createFolder,
      method: 'POST',
      data: folderData
    });
    
    if (response.error) {
      throw new Error('Failed to create folder');
    }
    
    return response.response?.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

// Upload file
export const uploadFile = async (fileData) => {
  try {
    const response = await apiService({
      endpoint: endpoints.uploadFile,
      method: 'POST',
      data: fileData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.error) {
      throw new Error('Failed to upload file');
    }
    
    return response.response?.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete folder or file
export const deleteItem = async (itemId, itemType) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.deleteDocument}/${itemType}/${itemId}`,
      method: 'DELETE'
    });
    
    if (response.error) {
      throw new Error(`Failed to delete ${itemType}`);
    }
    
    return response.response?.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}; 