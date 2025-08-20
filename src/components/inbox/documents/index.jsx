import React, { useState, useMemo } from 'react';
import { Box, Skeleton } from '@mui/material';
import {
  FileBrowser,
  FileNavbar,
  FileToolbar,
  FileList,
  FileContextMenu,
  ChonkyActions,
  defineFileAction,
  ChonkyIconName,
  setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

// Set Chonky defaults to disable DnD and configure icons
setChonkyDefaults({
  disableDragAndDrop: true,
  iconComponent: ChonkyIconFA,
});

import BreadCrumb from '@/components/BreadCrumb';
import { useDocuments } from './hooks/useDocuments';
import CreateFolderDialog from './components/CreateFolderDialog';
import UploadFileDialog from './components/UploadFileDialog';
import RenameFolderDialog from './components/RenameFolderDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const DocumentationPage = () => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');
  const isFromInbox = !!slugId;

  const {
    folders,
    folderContents,
    currentPath,
    selectedFolder,
    foldersLoading,
    documentsMeta,
    navigateToFolder,
    navigateBack,
    navigateToRoot,
    handleCreateFolder,
    handleUploadFile,
    handleRenameItem,
    handleDeleteItem,
    isCreatingFolder,
    isUploadingFile,
    isRenamingFolder,
    isDeletingItem,
  } = useDocuments();

  // Dynamic file actions based on navigation state
  const dynamicActions = useMemo(() => {
    // Add navigation actions based on current state
    const navigationActions = [];

    if (currentPath.length > 0) {
      // Show "Up" button when not at root
      navigationActions.push(
        defineFileAction({
          id: 'go_up',
          requiresSelection: false,
          icon: ChonkyIconName.up,
          button: {
            name: 'Up',
            toolbar: true,
            contextMenu: false,
          },
        })
      );

      // Show "Back" button when there's navigation history
      navigationActions.push(
        defineFileAction({
          id: 'go_back',
          requiresSelection: false,
          icon: ChonkyIconName.left,
          button: {
            name: 'Back',
            toolbar: true,
            contextMenu: false,
          },
        })
      );
    }

    // Always include upload and create folder actions (even at root level)
    const alwaysAvailableActions = [
      defineFileAction({
        id: 'create_folder',
        requiresSelection: false,
        icon: ChonkyIconName.folderCreate,
        button: {
          name: 'New Folder',
          toolbar: true,
          contextMenu: false,
        },
      }),
      defineFileAction({
        id: 'upload_file',
        requiresSelection: false,
        icon: ChonkyIconName.upload,
        button: {
          name: 'Upload File',
          toolbar: true,
          contextMenu: false,
        },
      }),
      defineFileAction({
        id: 'rename_item',
        requiresSelection: true,
        selectionConstraint: (files) => files.length === 1,
        hotkeys: ['f2'],
        button: {
          name: 'Rename',
          toolbar: false,
          contextMenu: true,
          icon: ChonkyIconName.config,
        },
      }),
      defineFileAction({
        id: 'delete_item',
        requiresSelection: true,
        selectionConstraint: (files) => files.length > 0,
        hotkeys: ['delete'],
        button: {
          name: 'Delete',
          toolbar: false,
          contextMenu: true,
          icon: ChonkyIconName.trash,
        },
      }),
    ];

    return [...navigationActions, ...alwaysAvailableActions];
  }, [currentPath]);

  // Transform data for Chonky
  const chonkyFiles = useMemo(() => {
    if (!selectedFolder) {
      // Show root folders and files when no folder is selected
      // The folders data from getFoldersBySlug should contain both folders and files
      return folders.map((item) => {
        const isDirectory = item.type === 'folder' || item.isDir || !item.type;

        if (isDirectory) {
          // This is a folder
          return {
            id: item.id || item.slug,
            name: item.name,
            isDir: true,
            modDate: item.modDate || new Date(),
            size: 0,
            thumbnailUrl: null,
            folderChain: [],
            ...item,
          };
        } else {
          // This is a file
          return {
            id: item.id,
            name: item.name,
            isDir: false,
            modDate: item.modified ? new Date(item.modified) : new Date(),
            size: item.size || 0,
            thumbnailUrl: item.slug?.startsWith('http') ? item.slug : null,
            folderChain: [],
            description: item.description || '',
            fileType: item.type,
            downloadUrl: item.slug,
            ...item,
          };
        }
      });
    }

    // Show folder contents
    return folderContents.map((item) => ({
      id: item.id,
      name: item.name,
      isDir: item.type === 'folder',
      modDate: item.modified ? new Date(item.modified) : new Date(),
      size: item.type === 'folder' ? 0 : item.size,
      thumbnailUrl:
        item.type !== 'folder' && item.slug.startsWith('http')
          ? item.slug
          : null,
      folderChain: currentPath.map((p) => ({ id: p.id, name: p.name })),
      description: item.description || '',
      fileType: item.type,
      downloadUrl: item.type !== 'folder' ? item.slug : null,
      ...item,
    }));
  }, [folders, folderContents, selectedFolder, currentPath]);

    // Handle file actions
  const handleFileAction = (data) => {
    console.log('Main action handler:', data, data.id, data.payload, data.state);
    
    if (data.id === ChonkyActions.OpenFiles.id) {
      // Try to get file from different possible sources
      let fileToOpen = null;
      
      if (data.payload?.targetFile) {
        fileToOpen = data.payload.targetFile;
      } else if (data.payload?.files && data.payload.files.length > 0) {
        fileToOpen = data.payload.files[0];
      } else if (data.state?.selectedFiles && data.state.selectedFiles.length > 0) {
        fileToOpen = data.state.selectedFiles[0];
      }

      console.log('File to open:', fileToOpen);

      if (fileToOpen && fileToOpen.isDir) {
        // Navigate to folder
        const folder = {
          id: fileToOpen.id,
          name: fileToOpen.name,
          slug: fileToOpen.slug || fileToOpen.id, // Fallback to id if slug is not available
        };
        console.log('Navigating to folder:', folder);
        console.log('Current selectedFolder before navigation:', selectedFolder);
        console.log('Current currentPath before navigation:', currentPath);
        navigateToFolder(folder);
      } else if (fileToOpen) {
        // Handle file opening/download
        console.log('File clicked:', fileToOpen);
        if (fileToOpen.downloadUrl) {
          // Open file in new tab or download
          window.open(fileToOpen.downloadUrl, '_blank');
        }
      }
    } else if (data.id === 'go_back') {
      navigateBack();
    } else if (data.id === 'go_up') {
      if (currentPath.length > 1) {
        // Go to parent folder
        navigateBack();
      } else {
        // Go to root
        navigateToRoot();
      }
    } else if (data.id === 'create_folder') {
      // Check if current folder allows editing
      if (selectedFolder && selectedFolder.is_editable === false) {
        toast.error('Cannot create folders in this directory - permission not present');
        return;
      }
      setCreateFolderOpen(true);
    } else if (data.id === 'upload_file') {
      // Check if current folder allows editing
      if (selectedFolder && selectedFolder.is_editable === false) {
        toast.error('Cannot upload files to this directory - permission not present');
        return;
      }
      setUploadFileOpen(true);
    } else if (data.id === 'rename_item') {
      const files = data.state?.selectedFiles || [];
      console.log('Rename action in main handler', files);
      if (files.length === 1) {
        const file = files[0];
        // Check if item is editable
        if (file.isDir && file.is_editable === false) {
          toast.error('This folder cannot be renamed - permission not present');
          return;
        }
        setFolderToRename(file);
        setRenameFolderOpen(true);
      }
    } else if (data.id === 'delete_item') {
      console.log('Delete action in main handler');
      const files = data.state?.selectedFiles || [];
      if (files.length > 0) {
        // Check if any selected item is not deletable
        for (const file of files) {
          if (file.isDir && file.is_deletable === false) {
            toast.error('This folder cannot be deleted - permission not present');
            return;
          }
        }
        setItemToDelete(files[0]);
        setDeleteDialogOpen(true);
      }
    }
  };

  const handleCreateFolderSubmit = async (folderName) => {
    try {
      await handleCreateFolder(folderName);
      setCreateFolderOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleUploadFileSubmit = async (file, categoryId) => {
    try {
      await handleUploadFile(file, '', categoryId);
      setUploadFileOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleRenameFolderSubmit = async (itemId, newName) => {
    try {
      const itemType = folderToRename?.isDir ? 'folder' : 'file';
      await handleRenameItem(itemId, newName, itemType);
      setRenameFolderOpen(false);
      setFolderToRename(null);
    } catch (error) {
      console.error('Error renaming item:', error);
      // Error toast is now handled in the mutation
    }
  };

  const handleDeleteItemSubmit = async (itemId, itemType) => {
    try {
      await handleDeleteItem(itemId, itemType);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Error toast is now handled in the mutation
    }
  };

  if (foldersLoading) {
    return (
      <div className="px-4">
        <BreadCrumb label={isFromInbox ? "Documents" : "Documentation"} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </div>
    );
  }

  return (
    <div className="px-4">


      <BreadCrumb label={isFromInbox ? "Documents" : "Documentation"} />

      <Box sx={{ mt: 2, height: 'calc(100vh - 200px)' }}>
        <FileBrowser
          files={chonkyFiles}
          folderChain={[
            { id: 'root', name: isFromInbox ? 'Documents' : 'Documentation' },
            ...currentPath.map((p) => ({ id: p.id, name: p.name }))
          ]}
          onFileAction={handleFileAction}
          fileActions={[
            ...dynamicActions,
            ChonkyActions.OpenFiles,
            ChonkyActions.SelectAllFiles,
            ChonkyActions.ClearSelection,
            ChonkyActions.EnableListView,
            ChonkyActions.EnableGridView,
            ChonkyActions.SortFilesByName,
            ChonkyActions.SortFilesBySize,
            ChonkyActions.SortFilesByDate,
          ]}
          defaultFileViewActionId={ChonkyActions.EnableListView.id}
          disableDefaultFileActions={false}
        >
          <FileNavbar />
          <FileToolbar className="border-b border-gray-200 bg-white" />
          <FileList />
          <FileContextMenu />
        </FileBrowser>
      </Box>

      {/* Dialogs */}
      <CreateFolderDialog
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onSubmit={handleCreateFolderSubmit}
        isLoading={isCreatingFolder}
      />

      <UploadFileDialog
        open={uploadFileOpen}
        onClose={() => setUploadFileOpen(false)}
        onSubmit={handleUploadFileSubmit}
        isLoading={isUploadingFile}
        categories={documentsMeta}
      />

      <RenameFolderDialog
        open={renameFolderOpen}
        onClose={() => {
          setRenameFolderOpen(false);
          setFolderToRename(null);
        }}
        onSubmit={handleRenameFolderSubmit}
        isLoading={isRenamingFolder}
        folderToRename={folderToRename}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteItemSubmit}
        itemToDelete={itemToDelete}
        isLoading={isDeletingItem}
      />
    </div>
  );
};

export default DocumentationPage;
