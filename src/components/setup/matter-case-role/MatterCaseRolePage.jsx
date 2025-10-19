import React, { useState } from 'react';
import {
  Stack,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MatterCaseRoleTable from './MatterCaseRoleTable';
import CreateMatterCaseRoleDialog from './CreateMatterCaseRoleDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterCaseRoles,
  getMatterCaseRole,
  createMatterCaseRole,
  updateMatterCaseRole,
  deleteMatterCaseRole,
  updateMatterCaseRoleStatus,
} from '@/api/api_services/setup';

const MatterCaseRolePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterCaseRole, setEditingMatterCaseRole] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterCaseRoleToDelete, setMatterCaseRoleToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterCaseRoleId, setSelectedMatterCaseRoleId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter case roles
  const {
    data: matterCaseRolesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterCaseRoles'],
    queryFn: getMatterCaseRoles,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterCaseRoles = Array.isArray(matterCaseRolesResponse?.data)
    ? matterCaseRolesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter case role mutation
  const createMatterCaseRoleMutation = useMutation({
    mutationFn: createMatterCaseRole,
    onSuccess: () => {
      toast.success('Matter case role created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterCaseRoles']);
    },
    onError: (error) => {
      toast.error('Failed to create matter case role. Please try again.');
      console.error('Create matter case role error:', error);
    },
  });

  // Update matter case role mutation
  const updateMatterCaseRoleMutation = useMutation({
    mutationFn: ({ matterCaseRoleId, matterCaseRoleData }) =>
      updateMatterCaseRole(matterCaseRoleId, matterCaseRoleData),
    onSuccess: () => {
      toast.success('Matter case role updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterCaseRole(null);
      queryClient.invalidateQueries(['matterCaseRoles']);
    },
    onError: (error) => {
      toast.error('Failed to update matter case role. Please try again.');
      console.error('Update matter case role error:', error);
    },
  });

  // Delete matter case role mutation
  const deleteMatterCaseRoleMutation = useMutation({
    mutationFn: deleteMatterCaseRole,
    onSuccess: () => {
      toast.success('Matter case role deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterCaseRoleToDelete(null);
      queryClient.invalidateQueries(['matterCaseRoles']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter case role. Please try again.');
      console.error('Delete matter case role error:', error);
    },
  });

  // Update matter case role status mutation
  const updateMatterCaseRoleStatusMutation = useMutation({
    mutationFn: ({ matterCaseRoleId, is_active }) =>
      updateMatterCaseRoleStatus(matterCaseRoleId, { is_active }),
    onSuccess: () => {
      toast.success('Matter case role status updated successfully!');
      queryClient.invalidateQueries(['matterCaseRoles']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter case role status. Please try again.'
      );
      console.error('Update matter case role status error:', error);
    },
  });

  const handleCreateMatterCaseRole = (matterCaseRoleData) => {
    createMatterCaseRoleMutation.mutate(matterCaseRoleData);
  };

  const handleUpdateMatterCaseRole = (matterCaseRoleData) => {
    if (!editingMatterCaseRole?.id) {
      toast.error('No matter case role selected for editing');
      return;
    }
    updateMatterCaseRoleMutation.mutate({
      matterCaseRoleId: editingMatterCaseRole.id,
      matterCaseRoleData: matterCaseRoleData,
    });
  };

  const handleEditMatterCaseRole = (matterCaseRole) => {
    setEditingMatterCaseRole(matterCaseRole);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterCaseRole = (matterCaseRole) => {
    setMatterCaseRoleToDelete(matterCaseRole);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterCaseRole = () => {
    if (matterCaseRoleToDelete) {
      deleteMatterCaseRoleMutation.mutate(matterCaseRoleToDelete.id);
    }
  };

  const handleStatusChange = (matterCaseRoleId, is_active) => {
    updateMatterCaseRoleStatusMutation.mutate({ matterCaseRoleId, is_active });
  };

  const handleView = (matterCaseRoleId) => {
    setSelectedMatterCaseRoleId(matterCaseRoleId);
    setDetailDialogOpen(true);
  };

  const filteredMatterCaseRoles = Array.isArray(matterCaseRoles)
    ? matterCaseRoles.filter(
        (matterCaseRole) =>
          matterCaseRole.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterCaseRole.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-4 h-full flex flex-col">
      <Stack
        spacing={3}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <Typography
            variant="h5"
            component="h2"
            className="text-xl font-semibold text-gray-900"
          >
            Matter Case Role Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter case roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => setCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary-dark"
            >
              Add Matter Case Role
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterCaseRoleTable
            matterCaseRoles={filteredMatterCaseRoles}
            isLoading={isLoading}
            handleEdit={handleEditMatterCaseRole}
            handleDelete={handleDeleteMatterCaseRole}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterCaseRoleDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterCaseRole}
        isLoading={createMatterCaseRoleMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterCaseRoleDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterCaseRole(null);
        }}
        onSubmit={handleUpdateMatterCaseRole}
        isLoading={updateMatterCaseRoleMutation.isPending}
        editMode={true}
        editingMatterCaseRole={editingMatterCaseRole}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the matter case role "
          {matterCaseRoleToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterCaseRole}
            color="error"
            variant="contained"
            disabled={deleteMatterCaseRoleMutation.isPending}
          >
            {deleteMatterCaseRoleMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Case Role Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterCaseRoleId(null);
        }}
        itemId={selectedMatterCaseRoleId}
        itemType="matter-case-role"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterCaseRole(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterCaseRoleToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterCaseRoleDialog}
        updateMutation={updateMatterCaseRoleMutation}
        deleteMutation={deleteMatterCaseRoleMutation}
      />
    </div>
  );
};

export default MatterCaseRolePage;
