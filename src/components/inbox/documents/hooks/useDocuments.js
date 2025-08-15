import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFolders, 
  getFolderContents, 
  createFolder, 
  uploadFile, 
  deleteItem 
} from '@/api/api_services/documents';

export const useDocuments = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const queryClient = useQueryClient();

  // Query for fetching all folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching folder contents
  const { data: folderContents, isLoading: contentsLoading } = useQuery({
    queryKey: ['folderContents', selectedFolder?.id],
    queryFn: () => selectedFolder ? getFolderContents(selectedFolder.id) : null,
    enabled: !!selectedFolder,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation for creating new folder
  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
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
      queryClient.invalidateQueries(['folders']);
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
  const handleCreateFolder = useCallback(async (folderName, parentId = null) => {
    try {
      await createFolderMutation.mutateAsync({
        name: folderName,
        parentId: parentId || selectedFolder?.id,
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }, [selectedFolder, createFolderMutation]);

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
    folderContents: folderContents?.items || [],
    currentPath,
    selectedFolder,
    
    // Loading states
    foldersLoading,
    contentsLoading,
    
    // Actions
    navigateToFolder,
    navigateBack,
    navigateToRoot,
    handleCreateFolder,
    handleUploadFile,
    handleDeleteItem,
    
    // Mutation states
    isCreatingFolder: createFolderMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
  };
}; 