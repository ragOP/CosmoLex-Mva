import React, { useState } from 'react';
import {
  Dialog,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FolderPlus, X } from 'lucide-react';

const CreateFolderDialog = ({ open, onClose, onSubmit, isLoading }) => {
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ zIndex: 9998 }}>
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans flex items-center gap-2">
            <FolderPlus className="text-[#6366F1]" />
            Create New Folder
          </h1>
          <IconButton onClick={handleClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* Scrollable Content Area */}
        <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Folder Name - Full Width */}
            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2 block">
                Folder Name
              </Label>
              <Input
                autoFocus
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                disabled={isLoading}
                className={`h-12 w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>
          </form>
        </div>

        <Divider />

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 gap-4">
          <Button
            type="button"
            className="bg-gray-300 text-black hover:bg-gray-400"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            disabled={isLoading || !folderName.trim()}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            {isLoading ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default CreateFolderDialog; 