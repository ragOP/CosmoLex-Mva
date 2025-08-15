import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { CreateNewFolder } from '@mui/icons-material';

const CreateFolderDialog = ({ open, onClose, onSubmit, isLoading, currentFolderName }) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }
    
    if (folderName.trim().length < 2) {
      setError('Folder name must be at least 2 characters long');
      return;
    }
    
    setError('');
    onSubmit(folderName.trim());
    setFolderName('');
  };

  const handleClose = () => {
    setFolderName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CreateNewFolder color="primary" />
          <Typography variant="h6">Create New Folder</Typography>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {currentFolderName && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Creating folder in: <strong>{currentFolderName}</strong>
            </Typography>
          )}
          
          <TextField
            autoFocus
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
            placeholder="Enter folder name"
            disabled={isLoading}
          />
          
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
            type="submit" 
            variant="contained" 
            disabled={isLoading || !folderName.trim()}
            startIcon={<CreateNewFolder />}
          >
            {isLoading ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateFolderDialog; 