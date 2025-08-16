import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get all folders (original function for backward compatibility)
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

// Get folders by slug (new function for the updated API)
export const getFoldersBySlug = async (slug) => {
  try {
    const endpoint = slug 
      ? `${endpoints.getFoldersBySlug}/${slug}` 
      : endpoints.getFoldersBySlug;
      
    const response = await apiService({
      endpoint,
      method: 'GET'
    });
    
    if (response.error) {
      throw new Error('Failed to fetch folders by slug');
    }
    
    // Return folders array from the API response structure
    return response.response?.folders || [];
  } catch (error) {
    console.error('Error fetching folders by slug:', error);
    throw error;
  }
};

// Get folder contents (files and subfolders) - original function
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

// Get folder items (new function for updated API)
export const getFolderItems = async (folderId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getItems}/${folderId}`,
      method: 'GET'
    });
    
    if (response.error) {
      throw new Error('Failed to fetch folder items');
    }
    
    // Return the items array and folder name from the new API structure
    return {
      items: response.response?.items || [],
      folderName: response.response?.folder || ''
    };
  } catch (error) {
    console.error('Error fetching folder items:', error);
    throw error;
  }
};

// Create new folder (original function for backward compatibility)
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

// Create new folder with slug (new function for the updated API)
export const createFolderWithSlug = async (folderData, parentFolderSlug, mainSlug) => {
  try {
    // Both root and subfolder creation use the same endpoint pattern
    const endpoint = `${endpoints.addFolder}/${mainSlug}`;
    
    const requestData = {
      ...folderData,
      slug: parentFolderSlug // null for root level, parent slug for subfolders
    };
      
    const response = await apiService({
      endpoint,
      method: 'POST',
      data: requestData
    });
    
    if (response.error) {
      throw new Error('Failed to create folder');
    }
    
    return response.response?.data;
  } catch (error) {
    console.error('Error creating folder with slug:', error);
    throw error;
  }
};

// Upload file
export const uploadFile = async (fileData, parentFolderSlug, mainSlug) => {
  try {
    const endpoint = `${endpoints.uploadFile}/${mainSlug}`;
    
    const response = await apiService({
      endpoint,
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

// Rename folder
export const renameFolder = async (folderId, newName) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.renameFolder}/${folderId}`,
      method: 'PUT',
      data: { name: newName }
    });
    
    if (response.error) {
      throw new Error('Failed to rename folder');
    }
    
    return response.response?.data;
  } catch (error) {
    console.error('Error renaming folder:', error);
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