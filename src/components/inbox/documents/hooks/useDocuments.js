import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { 
  getFolders, 
  getFoldersBySlug,
  getFolderItems,
  createFolderWithSlug,
  renameFolder,
  uploadFile, 
  deleteItem 
} from '@/api/api_services/documents';

export const useDocuments = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract slug from URL parameters
  const slugId = searchParams.get('slugId');

  // Query for fetching folders by slug
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', slugId],
    queryFn: () => slugId ? getFoldersBySlug(slugId) : getFolders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching folder contents
  const { data: folderContentsData, isLoading: contentsLoading } = useQuery({
    queryKey: ['folderContents', selectedFolder?.id],
    queryFn: () => selectedFolder ? getFolderItems(selectedFolder.id) : null,
    enabled: !!selectedFolder,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Extract items from the new API response structure
  const folderContents = folderContentsData?.items || [];

  // Mutation for creating new folder
  const createFolderMutation = useMutation({
    mutationFn: ({ folderData, parentSlug }) => createFolderWithSlug(folderData, parentSlug || slugId),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', slugId]);
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
    },
  });

  // Mutation for renaming folder
  const renameFolderMutation = useMutation({
    mutationFn: ({ folderId, newName }) => renameFolder(folderId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders', slugId]);
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
    },
  });

  // Mutation for uploading file
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      if (selectedFolder) {
        queryClient.invalidateQueries(['folderContents', selectedFolder.id]);
      }
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
    },
  });

  // Navigate to folder
  const navigateToFolder = useCallback((folder) => {
    setSelectedFolder(folder);
    setCurrentPath(prev => [...prev, folder]);
  }, []);

  // Navigate back
  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      
      if (newPath.length > 0) {
        const lastFolder = newPath[newPath.length - 1];
        setSelectedFolder(lastFolder);
      } else {
        setSelectedFolder(null);
      }
    }
  }, [currentPath]);

  // Navigate to root
  const navigateToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedFolder(null);
  }, []);

  // Create new folder
  const handleCreateFolder = useCallback(async (folderName, parentSlug = null) => {
    try {
      const folderData = {
        name: folderName,
        slug: parentSlug || selectedFolder?.slug || null
      };
      
      await createFolderMutation.mutateAsync({
        folderData,
        parentSlug: parentSlug || selectedFolder?.slug
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }, [selectedFolder, createFolderMutation, slugId]);

  // Upload file
  const handleUploadFile = useCallback(async (file, parentId = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parentId', parentId || selectedFolder?.id);
      
      await uploadFileMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [selectedFolder, uploadFileMutation]);

  // Rename folder
  const handleRenameFolder = useCallback(async (folderId, newName) => {
    try {
      await renameFolderMutation.mutateAsync({ folderId, newName });
    } catch (error) {
      console.error('Error renaming folder:', error);
      throw error;
    }
  }, [renameFolderMutation]);

  // Delete item
  const handleDeleteItem = useCallback(async (itemId, itemType) => {
    try {
      await deleteItemMutation.mutateAsync({ itemId, itemType });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }, [deleteItemMutation]);

  return {
    // State
    folders,
    folderContents,
    currentPath,
    selectedFolder,
    slugId,
    
    // Loading states
    foldersLoading,
    contentsLoading,
    
    // Actions
    navigateToFolder,
    navigateBack,
    navigateToRoot,
    handleCreateFolder,
    handleUploadFile,
    handleRenameFolder,
    handleDeleteItem,
    
    // Mutation states
    isCreatingFolder: createFolderMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isRenamingFolder: renameFolderMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
}; 