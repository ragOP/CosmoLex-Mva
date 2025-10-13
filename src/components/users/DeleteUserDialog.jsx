import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteUserDialog = ({
  open = false,
  onClose = () => {},
  user = null,
  onConfirm = () => {},
  isDeleting = false,
}) => {
  if (!user) return null;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md bg-[#F5F5FA] p-6 rounded-xl shadow-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle className="text-xl font-semibold text-[#1E293B]">
              Confirm Delete
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="text-sm text-slate-700 space-y-3">
          <p>
            Are you sure you want to delete the user{' '}
            <strong className="text-red-500">"{fullName}"</strong>? This action
            cannot be undone.
          </p>
          <p className="text-muted-foreground">
            This will permanently remove the user and all associated data like
            profile information, permissions, and activity history.
          </p>
        </div>

        <DialogFooter className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Delete User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
