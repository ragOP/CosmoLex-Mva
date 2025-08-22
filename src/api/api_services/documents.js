import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get all document meta data
export const getDocumentsMeta = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getDocumentsMeta,
      method: 'GET',
    });

    if (response.error) {
      throw new Error('Failed to fetch document meta data');
    }

    return response.response?.document_categories || [];
  } catch (error) {
    console.error('Error fetching document meta data:', error);
    throw error;
  }
};

// Get all folders (original function for backward compatibility)
export const getFolders = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getFolders,
      method: 'GET',
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
      method: 'GET',
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
      method: 'GET',
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
export const getFolderItems = async (folderId, mainSlug = null) => {
  try {
    let endpoint;
    
    if (mainSlug) {
      // Matter-specific context - use slug-based endpoint
      endpoint = `${endpoints.getItems}/${folderId}?slugId=${mainSlug}`;
    } else {
      // Main dashboard context - use general endpoint
      endpoint = `${endpoints.getItems}/${folderId}`;
    }

    const response = await apiService({
      endpoint,
      method: 'GET',
    });

    if (response.error) {
      throw new Error('Failed to fetch folder items');
    }

    // Return the items array and folder name from the new API structure
    return {
      items: response.response?.items || [],
      folderName: response.response?.folder || '',
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
      data: folderData,
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
export const createFolderWithSlug = async (
  folderData,
  parentFolderSlug,
  mainSlug
) => {
  try {
    let endpoint;
    let requestData;

    if (mainSlug) {
      // Matter-specific context - use slug-based endpoint
      endpoint = `${endpoints.addFolder}/${mainSlug}`;
      requestData = {
        ...folderData,
        slug: parentFolderSlug, // null for root level, parent slug for subfolders
      };
    } else {
      // Main dashboard context - use addFolder endpoint without slug
      endpoint = endpoints.addFolder;
      requestData = {
        ...folderData,
        slug: parentFolderSlug, // null for root level, parent slug for subfolders
      };
    }

    const response = await apiService({
      endpoint,
      method: 'POST',
      data: requestData,
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
    let endpoint;

    if (mainSlug) {
      // Matter-specific context - use slug-based endpoint
      endpoint = `${endpoints.uploadFile}/${mainSlug}`;
    } else {
      // Main dashboard context - use upload endpoint without slug
      endpoint = endpoints.uploadFile;
    }

    const response = await apiService({
      endpoint,
      method: 'POST',
      data: fileData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the API call failed
    if (response.error) {
      throw new Error('Failed to upload file');
    }

    // Check API status from response data
    if (response.response && response.response.Apistatus === false) {
      const errorMessage = response.response.message || 'Failed to upload file';
      throw new Error(errorMessage);
    }

    return response.response?.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Rename folder
export const renameFolder = async (folderId, newName, type = 'folder') => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.renameFolder}/${type}/${folderId}`,
      method: 'PUT',
      data: { name: newName },
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
      method: 'DELETE',
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
