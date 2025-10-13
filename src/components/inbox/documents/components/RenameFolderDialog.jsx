import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Edit } from '@mui/icons-material';

const RenameFolderDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  folderToRename,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  // Set initial folder name when dialog opens
  useEffect(() => {
    if (open && folderToRename) {
      setFolderName(folderToRename.name || '');
      setError('');
    }
  }, [open, folderToRename]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError('Name is required');
      return;
    }

    if (folderName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (folderName.trim() === folderToRename?.name) {
      setError('Please enter a different name');
      return;
    }

    setError('');
    onSubmit(folderToRename.id, folderName.trim());
  };

  const handleClose = () => {
    setFolderName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-[#F5F5FA] rounded-lg w-full max-w-md p-6 space-y-6 shadow-[0px_4px_24px_0px_#000000]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#40444D] text-center font-bold font-sans flex items-center justify-center gap-2">
            <Edit className="text-[#6366F1]" />
            Rename {folderToRename?.isDir ? 'Folder' : 'File'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="text-sm text-[#40444D] bg-white p-3 rounded-lg border">
              <span className="font-semibold">
                Renaming {folderToRename?.isDir ? 'folder' : 'file'}:{' '}
              </span>
              <span className="text-[#6366F1] font-medium">
                {folderToRename?.name}
              </span>
            </div>

            <div>
              <Label className="text-[#40444D] font-semibold mb-2 block">
                New {folderToRename?.isDir ? 'Folder' : 'File'} Name
              </Label>
              <Input
                autoFocus
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder={`Enter new ${
                  folderToRename?.isDir ? 'folder' : 'file'
                } name`}
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
              disabled={
                isLoading ||
                !folderName.trim() ||
                folderName.trim() === folderToRename?.name
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              {isLoading
                ? 'Renaming...'
                : `Rename ${folderToRename?.isDir ? 'Folder' : 'File'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolderDialog;
