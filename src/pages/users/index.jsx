import React, { useState, useCallback } from 'react';
import Button from '@/components/Button';
import UserDialog from '@/components/dialogs/UserDialog';
import ShowUserDialog from '@/components/users/ShowUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';
import { Loader2, Plus } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { useUsers } from '@/components/users/hooks/useUsers';
import PermissionGuard from '@/components/auth/PermissionGuard';

const UsersPage = () => {
  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const {
    users,
    usersLoading,
    deleteUser,
    isDeleting,
    fetchUser,
    isFetchingUser,
    updateUserStatus,
  } = useUsers();

  // Stable handlers to prevent re-renders
  const handleCloseView = useCallback(() => {
    setShowViewDialog(false);
    // Skip navigation for now to prevent state conflicts
    // handleNavigate(null);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setShowUpdateDialog(false);
    // Skip navigation for now to prevent state conflicts
    // handleNavigate(null);
  }, []);

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

  // Temporarily disabled to prevent modal flashing issues
  // const handleNavigate = (userId) => {
  //   if (userId) {
  //     navigate(`/dashboard/users?userId=${userId}`, {
  //       replace: false,
  //     });
  //   } else {
  //     navigate(`/dashboard/users`, {
  //       replace: false,
  //     });
  //   }
  // };

  const handleStatusChange = async (userId, status) => {
    try {
      await updateUserStatus({ userId, is_active: status ? 1 : 0 });
    } catch (error) {
      console.error('Error updating user status:', error);
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
    <PermissionGuard
      permission="users.view"
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p>You don't have permission to view users.</p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 h-full w-full overflow-auto">
        <div className="flex justify-between w-full items-center px-4 pt-4">
          <p className="text-2xl font-bold">Users ({users?.length || 0})</p>
          <PermissionGuard permission="users.create">
            <Button
              onClick={() => setOpen(true)}
              className="cursor-pointer max-w-48"
              icon={Plus}
              iconPosition="left"
            >
              Create User
            </Button>
          </PermissionGuard>
        </div>

        <UsersTable
          users={users || []}
          onRowClick={async (params) => {
            try {
              // Ensure params and params.row exist with valid id
              if (!params || !params.row || !params.row.id) {
                return;
              }

              // Fetch user details from API
              const response = await fetchUser(params.row.id);

              // Check different possible response structures
              const userData = response?.data || response;

              if (
                userData &&
                (userData.id || Object.keys(userData).length > 0)
              ) {
                setSelectedUser(userData);
                setShowViewDialog(true);
              } else {
                throw new Error('Invalid response from API');
              }
            } catch {
              // Fallback to using the table row data if API fails
              if (params && params.row && params.row.id) {
                setSelectedUser(params.row);
                setShowViewDialog(true);
              }
            }
          }}
          handleEdit={async (user) => {
            try {
              // Ensure user has valid id before proceeding
              if (!user || !user.id) {
                return;
              }

              // Fetch complete user details from API for editing
              const response = await fetchUser(user.id);

              // Check different possible response structures
              const userData = response?.data || response;

              if (
                userData &&
                (userData.id || Object.keys(userData).length > 0)
              ) {
                setSelectedUser(userData);
                setShowUpdateDialog(true);
              } else {
                throw new Error('Invalid response from API');
              }
            } catch {
              // Fallback to using the table row data if API fails
              if (user && user.id) {
                setSelectedUser(user);
                setShowUpdateDialog(true);
              }
            }
          }}
          handleDelete={(user) => {
            setSelectedUser(user);
            setShowDeleteConfirm(true);
          }}
          handleStatusChange={handleStatusChange}
        />

        {/* View */}
        <ShowUserDialog
          open={showViewDialog}
          onClose={handleCloseView}
          user={selectedUser}
          isLoading={isFetchingUser}
        />

        <UserDialog open={open} onClose={() => setOpen(false)} mode="create" />

        <UserDialog
          open={showUpdateDialog}
          onClose={handleCloseEdit}
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
    </PermissionGuard>
  );
};

export default UsersPage;
