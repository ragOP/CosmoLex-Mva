import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  UploadFile, 
  InsertDriveFile, 
  Delete,
  CloudUpload
} from '@mui/icons-material';

const UploadFileDialog = ({ open, onClose, onSubmit, isLoading, currentFolderName }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    
    try {
      for (const fileItem of files) {
        await onSubmit(fileItem.file);
      }
      setFiles([]);
      onClose();
    } catch {
      setError('Error uploading files. Please try again.');
    }
  };

  const handleClose = () => {
    setFiles([]);
    setError('');
    setDragActive(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <UploadFile color="primary" />
          <Typography variant="h6">Upload Files</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {currentFolderName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Uploading to: <strong>{currentFolderName}</strong>
          </Typography>
        )}
        
        {/* Drag & Drop Area */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: dragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            mb: 2
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Drop files here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Support for multiple files
          </Typography>
        </Box>
        
        <input
          id="file-input"
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        
        {/* File List */}
        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Files ({files.length})
            </Typography>
            <List dense>
              {files.map((fileItem) => (
                <ListItem
                  key={fileItem.id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => removeFile(fileItem.id)}
                      disabled={isLoading}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText
                    primary={fileItem.name}
                    secondary={formatFileSize(fileItem.size)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {isLoading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Uploading files...
            </Typography>
            <LinearProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={isLoading || files.length === 0}
          startIcon={<UploadFile />}
        >
          {isLoading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog; 