import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  getDocumentsMeta,
  getFoldersBySlug,
  getFolderItems,
  createFolderWithSlug,
  renameFolder,
  uploadFile,
  deleteItem,
} from '@/api/api_services/documents';

export const useDocuments = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract slug from URL parameters
  const slugId = searchParams.get('slugId');

  // Query for fetching documents meta data
  const { data: documentsMeta = [], isLoading: documentsMetaLoading } =
    useQuery({
      queryKey: ['documentsMeta'],
      queryFn: () => getDocumentsMeta(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  // Query for fetching folders by slug
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', slugId],
    queryFn: () => getFoldersBySlug(slugId || ''), // Always use getFoldersBySlug, pass empty string for main dashboard
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching folder contents
  const { data: folderContentsData, isLoading: contentsLoading } = useQuery({
    queryKey: ['folderContents', selectedFolder?.id, slugId],
    queryFn: () => (selectedFolder ? getFolderItems(selectedFolder.id, slugId) : null),
    enabled: !!selectedFolder,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Extract items from the new API response structure
  const folderContents = folderContentsData?.items || [];

  // Mutation for creating new folder
  const createFolderMutation = useMutation({
    mutationFn: ({ folderData, parentFolderSlug, mainSlug }) =>
      createFolderWithSlug(folderData, parentFolderSlug, mainSlug),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', slugId]);
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
      toast.success('Folder created successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to create folder';
      toast.error(errorMessage);
    },
  });

  // Mutation for renaming folder
  const renameFolderMutation = useMutation({
    mutationFn: ({ folderId, newName, type }) => renameFolder(folderId, newName, type),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', slugId]);
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
      toast.success('Item renamed successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to rename item';
      toast.error(errorMessage);
    },
  });

  // Mutation for uploading file
  const uploadFileMutation = useMutation({
    mutationFn: ({ fileData, parentFolderSlug, mainSlug }) =>
      uploadFile(fileData, parentFolderSlug, mainSlug),
    onSuccess: () => {
      // Always invalidate folders to show new files at root level
      queryClient.invalidateQueries(['folders', slugId]);
      // Also invalidate folder contents if we're in a subfolder
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to upload file';
      toast.error(errorMessage);
    },
  });

  // Mutation for deleting item
  const deleteItemMutation = useMutation({
    mutationFn: ({ itemId, itemType }) => deleteItem(itemId, itemType),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', slugId]);
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
      toast.success('Item deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete item';
      toast.error(errorMessage);
    },
  });

  // Navigate to folder
  const navigateToFolder = useCallback((folder) => {
    setSelectedFolder(folder);
    setCurrentPath((prev) => [...prev, folder]);
  }, []);

  // Get current folder slug for API calls
  const getCurrentFolderSlug = useCallback(() => {
    if (selectedFolder?.slug) {
      return selectedFolder.slug;
    }
    // If no selected folder, we're at root level - return null for root creation
    return null;
  }, [selectedFolder]);

  // Navigate back
  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length > 0) {
        const lastFolder = newPath[newPath.length - 1];
        setSelectedFolder(lastFolder);
        queryClient.invalidateQueries(['folderContents', lastFolder.id, slugId]);
      } else {
        setSelectedFolder(null);
        queryClient.invalidateQueries(['folders', slugId]);
      }
    }
  }, [currentPath, queryClient, slugId]);

  // Navigate to root
  const navigateToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedFolder(null);
    queryClient.invalidateQueries(['folders', slugId]);
  }, [queryClient, slugId]);

  // Navigate to specific path level
  const navigateToPathLevel = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= currentPath.length) {
      return;
    }
    
    const targetPath = currentPath.slice(0, targetIndex + 1);
    setCurrentPath(targetPath);
    
    const targetFolder = targetPath[targetPath.length - 1];
    setSelectedFolder(targetFolder);
    
    if (targetFolder) {
      queryClient.invalidateQueries(['folderContents', targetFolder.id, slugId]);
    } else {
      queryClient.invalidateQueries(['folders', slugId]);
    }
  }, [currentPath, queryClient, slugId]);

  // Create new folder
  const handleCreateFolder = useCallback(
    async (folderName) => {
      try {
        // Check if current folder allows editing
        if (selectedFolder && selectedFolder.is_editable === false) {
          throw new Error('Cannot create folders in this directory - permission not present');
        }

        const folderData = {
          name: folderName,
        };

        // Determine parent slug based on current context
        const parentSlug = getCurrentFolderSlug();

        await createFolderMutation.mutateAsync({
          folderData,
          parentFolderSlug: parentSlug,
          mainSlug: slugId,
        });
      } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
    },
    [getCurrentFolderSlug, createFolderMutation, slugId, selectedFolder]
  );

  // Upload file
  const handleUploadFile = useCallback(
    async (file, description = '', categoryId = '373') => {
      try {
        // Check if current folder allows editing
        if (selectedFolder && selectedFolder.is_editable === false) {
          throw new Error('Cannot upload files to this directory - permission not present');
        }

        const formData = new FormData();

        // Create the attachment structure as expected by the API
        formData.append('attachments[0][category_id]', categoryId);
        formData.append(
          'attachments[0][description]',
          description || file.name
        );
        formData.append('attachments[0][file]', file);

        // Add parent folder slug (null for root level, parent folder slug for subfolders)
        const parentFolderSlug = getCurrentFolderSlug();
        // Always include slug field - set to null if no parent folder, otherwise use parent folder slug
        formData.append('slug', parentFolderSlug || null);

        await uploadFileMutation.mutateAsync({
          fileData: formData,
          parentFolderSlug,
          mainSlug: slugId,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
    [getCurrentFolderSlug, uploadFileMutation, slugId, selectedFolder]
  );

  // Rename item (folder or file)
  const handleRenameItem = useCallback(
    async (itemId, newName, itemType = 'folder') => {
      try {
        // For folders, check if they are editable
        if (itemType === 'folder') {
          // Find the folder in current context to check its properties
          const folderToRename = selectedFolder ? 
            folderContents.find(item => item.id === itemId) : 
            folders.find(item => item.id === itemId);
          
          if (folderToRename && folderToRename.is_editable === false) {
            throw new Error('This folder cannot be renamed - permission not present');
          }
        }

        await renameFolderMutation.mutateAsync({ folderId: itemId, newName, type: itemType });
      } catch (error) {
        console.error('Error renaming item:', error);
        throw error;
      }
    },
    [renameFolderMutation, selectedFolder, folderContents, folders]
  );

  // Delete item
  const handleDeleteItem = useCallback(
    async (itemId, itemType) => {
      try {
        // For folders, check if they are deletable
        if (itemType === 'folder') {
          // Find the folder in current context to check its properties
          const folderToDelete = selectedFolder ? 
            folderContents.find(item => item.id === itemId) : 
            folders.find(item => item.id === itemId);
          
          if (folderToDelete && folderToDelete.is_deletable === false) {
            throw new Error('This folder cannot be deleted - permission not present');
          }
        }

        await deleteItemMutation.mutateAsync({ itemId, itemType });
      } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
      }
    },
    [deleteItemMutation, selectedFolder, folderContents, folders]
  );

  return {
    // State
    documentsMeta,
    folders,
    folderContents,
    currentPath,
    selectedFolder,
    slugId,

    // Loading states
    documentsMetaLoading,
    foldersLoading,
    contentsLoading,

    // Actions
    navigateToFolder,
    navigateBack,
    navigateToRoot,
    navigateToPathLevel,
    getCurrentFolderSlug,
    handleCreateFolder,
    handleUploadFile,
    handleRenameItem,
    handleDeleteItem,

    // Mutation states
    isCreatingFolder: createFolderMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isRenamingFolder: renameFolderMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
};
