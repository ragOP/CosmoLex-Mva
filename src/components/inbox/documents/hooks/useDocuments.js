import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
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

  // Navigate to specific path level
  const navigateToPathLevel = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= currentPath.length) return;
    
    const targetPath = currentPath.slice(0, targetIndex + 1);
    setCurrentPath(targetPath);
    setSelectedFolder(targetPath[targetPath.length - 1]);
  }, [currentPath]);

  // Create new folder
  const handleCreateFolder = useCallback(
    async (folderName) => {
      try {
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
    [getCurrentFolderSlug, createFolderMutation, slugId]
  );

  // Upload file
  const handleUploadFile = useCallback(
    async (file, description = '', categoryId = '373') => {
      try {
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
    [getCurrentFolderSlug, uploadFileMutation, slugId]
  );

  // Rename item (folder or file)
  const handleRenameItem = useCallback(
    async (itemId, newName, itemType = 'folder') => {
      try {
        await renameFolderMutation.mutateAsync({ folderId: itemId, newName, type: itemType });
      } catch (error) {
        console.error('Error renaming item:', error);
        throw error;
      }
    },
    [renameFolderMutation]
  );

  // Delete item
  const handleDeleteItem = useCallback(
    async (itemId, itemType) => {
      try {
        await deleteItemMutation.mutateAsync({ itemId, itemType });
      } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
      }
    },
    [deleteItemMutation]
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
