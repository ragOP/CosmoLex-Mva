import React, { useState } from 'react';
import Button from '@/components/Button';
import UserDialog from '@/components/dialogs/UserDialog';
import ShowUserDialog from '@/components/users/ShowUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';
import { Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/components/users/hooks/useUsers';

const UsersPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const { users, usersLoading, deleteUser, isDeleting, fetchUser, isFetchingUser } = useUsers();

  // Handlers
  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleNavigate = (userId) => {
    if (userId) {
      navigate(`/dashboard/users?userId=${userId}`, {
        replace: false,
      });
    } else {
      navigate(`/dashboard/users`, {
        replace: false,
      });
    }
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <div className="flex justify-between w-full items-center">
        <p className="text-2xl font-bold">
          Users ({users?.length || 0})
        </p>
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer max-w-48"
          icon={Plus}
          iconPosition="left"
        >
          Create User
        </Button>
      </div>

      <UsersTable
        users={users || []}
        onRowClick={async (params) => {
          try {
            // Fetch user details from API
            const response = await fetchUser(params.row.id);
            // Set the detailed user data from API response
            setSelectedUser(response.data);
            setShowViewDialog(true);
            // append userId to url params
            handleNavigate(params.row.id);
          } catch (error) {
            console.error('Error fetching user details:', error);
            // Fallback to using the table row data if API fails
            setSelectedUser(params.row);
            setShowViewDialog(true);
            handleNavigate(params.row.id);
          }
        }}
        handleEdit={(user) => {
          handleNavigate(user.id);
          setSelectedUser(user);
          setShowUpdateDialog(true);
        }}
        handleDelete={(user) => {
          setSelectedUser(user);
          setShowDeleteConfirm(true);
        }}
      />

      {/* View */}
      <ShowUserDialog
        open={showViewDialog}
        onClose={() => {
          // remove userId from url params
          handleNavigate(null);
          setShowViewDialog(false);
        }}
        user={selectedUser}
        isLoading={isFetchingUser}
      />

      <UserDialog open={open} onClose={() => setOpen(false)} mode="create" />

      <UserDialog
        open={showUpdateDialog}
        onClose={() => {
          setShowUpdateDialog(false);
          handleNavigate(null);
        }}
        user={selectedUser}
        mode="update"
      />

      {/* Delete */}
      <DeleteUserDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        user={selectedUser}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UsersPage;
