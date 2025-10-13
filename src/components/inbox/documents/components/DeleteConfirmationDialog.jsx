import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  itemToDelete,
}) => {
  if (!itemToDelete) return null;

  const isFolder = itemToDelete.isDir;
  const itemName = itemToDelete.name;
  const itemType = isFolder ? 'folder' : 'file';

  const handleConfirm = () => {
    onConfirm(itemToDelete.id, itemType);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>"{itemName}"</strong>?
          </p>

          {isFolder && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Warning:</strong> This will also delete all files and
                subfolders inside this folder. This action cannot be undone.
              </p>
            </div>
          )}

          <p className="text-gray-600 text-sm">This action cannot be undone.</p>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
