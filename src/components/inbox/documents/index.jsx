import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Skeleton
} from '@mui/material';
import { 
  FileBrowser, 
  FileNavbar, 
  FileToolbar, 
  FileList, 
  FileContextMenu,
  ChonkyActions,
  defineFileAction,
  ChonkyIconName,
  setChonkyDefaults
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

// Set Chonky defaults to disable DnD
setChonkyDefaults({
  disableDragAndDrop: true,
});
import BreadCrumb from "@/components/BreadCrumb";
import { useDocuments } from './hooks/useDocuments';
import CreateFolderDialog from './components/CreateFolderDialog';
import UploadFileDialog from './components/UploadFileDialog';
import RenameFolderDialog from './components/RenameFolderDialog';

// Custom file actions
const customActions = [
  defineFileAction({
    id: 'go_up',
    requiresSelection: false,
    icon: ChonkyIconName.up,
    button: {
      name: 'Up',
      toolbar: true,
      contextMenu: false,
    },
  }),
  defineFileAction({
    id: 'go_back',
    requiresSelection: false,
    icon: ChonkyIconName.left,
    button: {
      name: 'Back',
      toolbar: true,
      contextMenu: false,
    },
  }),
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
    id: 'rename_folder',
    requiresSelection: true,
    icon: ChonkyIconName.config,
    button: {
      name: 'Rename',
      toolbar: false,
      contextMenu: true,
    },
  }),
  defineFileAction({
    id: 'download_file',
    requiresSelection: true,
    icon: ChonkyIconName.download,
    button: {
      name: 'Download',
      toolbar: false,
      contextMenu: true,
    },
  }),
];

const DocumentationPage = () => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  
  const {
    folders,
    folderContents,
    currentPath,
    selectedFolder,
    foldersLoading,
    navigateToFolder,
    navigateBack,
    navigateToRoot,
    handleCreateFolder,
    handleUploadFile,
    handleRenameFolder,
    isCreatingFolder,
    isUploadingFile,
    isRenamingFolder
  } = useDocuments();

  // Dynamic file actions based on navigation state
  const dynamicActions = useMemo(() => {
    const baseActions = customActions.filter(action => 
      action.id !== 'go_back' && action.id !== 'go_up'
    );
    
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
    
    return [...navigationActions, ...baseActions];
  }, [currentPath]);

  // Transform data for Chonky
  const chonkyFiles = useMemo(() => {
    if (!selectedFolder) {
      // Show root folders when no folder is selected
      return folders.map(folder => ({
        id: folder.id || folder.slug,
        name: folder.name,
        isDir: true,
        modDate: folder.modDate || new Date(),
        size: 0,
        thumbnailUrl: null,
        folderChain: [],
        ...folder
      }));
    }
    
    // Show folder contents
    return folderContents.map(item => ({
      id: item.id,
      name: item.name,
      isDir: item.type === 'folder',
      modDate: item.modified ? new Date(item.modified) : new Date(),
      size: item.type === 'folder' ? 0 : item.size,
      thumbnailUrl: item.type !== 'folder' && item.slug.startsWith('http') ? item.slug : null,
      folderChain: currentPath.map(p => ({ id: p.id, name: p.name })),
      description: item.description || '',
      fileType: item.type,
      downloadUrl: item.type !== 'folder' ? item.slug : null,
      ...item
    }));
  }, [folders, folderContents, selectedFolder, currentPath]);

  // Handle file actions
  const handleFileAction = (data) => {
    if (data.id === ChonkyActions.OpenFiles.id) {
      const { targetFile, files } = data.payload;
      const fileToOpen = targetFile ?? files[0];
      
      if (fileToOpen && fileToOpen.isDir) {
        // Navigate to folder
        const folder = {
          id: fileToOpen.id,
          name: fileToOpen.name,
          slug: fileToOpen.slug
        };
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
      setCreateFolderOpen(true);
    } else if (data.id === 'upload_file') {
      setUploadFileOpen(true);
    } else if (data.id === 'rename_folder') {
      setFolderToRename(data.payload.targetFile);
      setRenameFolderOpen(true);
    } else if (data.id === 'download_file') {
      const fileToDownload = data.payload.targetFile;
      if (fileToDownload && fileToDownload.downloadUrl) {
        window.open(fileToDownload.downloadUrl, '_blank');
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

  const handleUploadFileSubmit = async (file) => {
    try {
      await handleUploadFile(file);
      setUploadFileOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleRenameFolderSubmit = async (folderId, newName) => {
    try {
      await handleRenameFolder(folderId, newName);
      setRenameFolderOpen(false);
      setFolderToRename(null);
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  if (foldersLoading) {
    return (
      <div className="px-4">
        <BreadCrumb label="Documents" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
      </div>
    );
  }

  return (
    <div className="px-4">
      <BreadCrumb label="Documents" />
      
      <Box sx={{ mt: 2, height: 'calc(100vh - 200px)' }}>
        <FileBrowser
          files={chonkyFiles}
          folderChain={currentPath.map(p => ({ id: p.id, name: p.name }))}
          onFileAction={handleFileAction}
          iconComponent={ChonkyIconFA}
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
        >
          <FileNavbar />
          <FileToolbar />
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
        currentFolderName={selectedFolder?.name}
      />

      <UploadFileDialog
        open={uploadFileOpen}
        onClose={() => setUploadFileOpen(false)}
        onSubmit={handleUploadFileSubmit}
        isLoading={isUploadingFile}
        currentFolderName={selectedFolder?.name}
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
    </div>
  );
};

export default DocumentationPage;