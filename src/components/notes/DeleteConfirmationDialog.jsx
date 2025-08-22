import React from 'react';
import { Dialog, Stack, Divider, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Delete Note',
  message = 'Are you sure you want to delete this note? This action cannot be undone.'
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[400px] shadow-[0px_4px_24px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
            {title}
          </h1>
          <IconButton onClick={onClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 gap-4">
          <Button
            type="button"
            className="bg-gray-300 text-black hover:bg-gray-400"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Delete Note'}
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default DeleteConfirmationDialog; 