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
  ChonkyIconName
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import BreadCrumb from "@/components/BreadCrumb";
import { useDocuments } from './hooks/useDocuments';
import CreateFolderDialog from './components/CreateFolderDialog';
import UploadFileDialog from './components/UploadFileDialog';

// Custom file actions
const customActions = [
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
];

const DocumentationPage = () => {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  
  const {
    folders,
    folderContents,
    currentPath,
    selectedFolder,
    foldersLoading,
    navigateToFolder,
    handleCreateFolder,
    handleUploadFile,
    isCreatingFolder,
    isUploadingFile
  } = useDocuments();

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
      id: item.id || item.slug,
      name: item.name,
      isDir: item.type === 'folder',
      modDate: item.modDate || new Date(),
      size: item.size || 0,
      thumbnailUrl: item.thumbnailUrl || null,
      folderChain: currentPath.map(p => ({ id: p.id, name: p.name })),
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
          slug: fileToOpen.slug || fileToOpen.id
        };
        navigateToFolder(folder);
      } else if (fileToOpen) {
        // Handle file opening
        console.log('File clicked:', fileToOpen);
      }
    } else if (data.id === 'create_folder') {
      setCreateFolderOpen(true);
    } else if (data.id === 'upload_file') {
      setUploadFileOpen(true);
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
            ...customActions,
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
    </div>
  );
};

export default DocumentationPage;