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
import MatterCaseStatusTable from './MatterCaseStatusTable';
import CreateMatterCaseStatusDialog from './CreateMatterCaseStatusDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterCaseStatuses,
  getMatterCaseStatus,
  createMatterCaseStatus,
  updateMatterCaseStatus,
  deleteMatterCaseStatus,
  updateMatterCaseStatusStatus,
} from '@/api/api_services/setup';

const MatterCaseStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterCaseStatus, setEditingMatterCaseStatus] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterCaseStatusToDelete, setMatterCaseStatusToDelete] =
    useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterCaseStatusId, setSelectedMatterCaseStatusId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter case statuses
  const {
    data: matterCaseStatusesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterCaseStatuses'],
    queryFn: getMatterCaseStatuses,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterCaseStatuses = Array.isArray(matterCaseStatusesResponse?.data)
    ? matterCaseStatusesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter case status mutation
  const createMatterCaseStatusMutation = useMutation({
    mutationFn: createMatterCaseStatus,
    onSuccess: () => {
      toast.success('Matter case status created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterCaseStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to create matter case status. Please try again.');
      console.error('Create matter case status error:', error);
    },
  });

  // Update matter case status mutation
  const updateMatterCaseStatusMutation = useMutation({
    mutationFn: ({ matterCaseStatusId, matterCaseStatusData }) =>
      updateMatterCaseStatus(matterCaseStatusId, matterCaseStatusData),
    onSuccess: () => {
      toast.success('Matter case status updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterCaseStatus(null);
      queryClient.invalidateQueries(['matterCaseStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to update matter case status. Please try again.');
      console.error('Update matter case status error:', error);
    },
  });

  // Delete matter case status mutation
  const deleteMatterCaseStatusMutation = useMutation({
    mutationFn: deleteMatterCaseStatus,
    onSuccess: () => {
      toast.success('Matter case status deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterCaseStatusToDelete(null);
      queryClient.invalidateQueries(['matterCaseStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter case status. Please try again.');
      console.error('Delete matter case status error:', error);
    },
  });

  // Update matter case status status mutation
  const updateMatterCaseStatusStatusMutation = useMutation({
    mutationFn: ({ matterCaseStatusId, is_active }) =>
      updateMatterCaseStatusStatus(matterCaseStatusId, { is_active }),
    onSuccess: () => {
      toast.success('Matter case status status updated successfully!');
      queryClient.invalidateQueries(['matterCaseStatuses']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter case status status. Please try again.'
      );
      console.error('Update matter case status status error:', error);
    },
  });

  const handleCreateMatterCaseStatus = (matterCaseStatusData) => {
    createMatterCaseStatusMutation.mutate(matterCaseStatusData);
  };

  const handleUpdateMatterCaseStatus = (matterCaseStatusData) => {
    if (!editingMatterCaseStatus?.id) {
      toast.error('No matter case status selected for editing');
      return;
    }
    updateMatterCaseStatusMutation.mutate({
      matterCaseStatusId: editingMatterCaseStatus.id,
      matterCaseStatusData: matterCaseStatusData,
    });
  };

  const handleEditMatterCaseStatus = (matterCaseStatus) => {
    setEditingMatterCaseStatus(matterCaseStatus);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterCaseStatus = (matterCaseStatus) => {
    setMatterCaseStatusToDelete(matterCaseStatus);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterCaseStatus = () => {
    if (matterCaseStatusToDelete) {
      deleteMatterCaseStatusMutation.mutate(matterCaseStatusToDelete.id);
    }
  };

  const handleStatusChange = (matterCaseStatusId, is_active) => {
    updateMatterCaseStatusStatusMutation.mutate({
      matterCaseStatusId,
      is_active,
    });
  };

  const handleView = (matterCaseStatusId) => {
    setSelectedMatterCaseStatusId(matterCaseStatusId);
    setDetailDialogOpen(true);
  };

  const filteredMatterCaseStatuses = Array.isArray(matterCaseStatuses)
    ? matterCaseStatuses.filter(
        (matterCaseStatus) =>
          matterCaseStatus.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterCaseStatus.description
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
            Matter Case Status Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter case statuses..."
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
              Add Matter Case Status
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterCaseStatusTable
            matterCaseStatuses={filteredMatterCaseStatuses}
            isLoading={isLoading}
            handleEdit={handleEditMatterCaseStatus}
            handleDelete={handleDeleteMatterCaseStatus}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterCaseStatusDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterCaseStatus}
        isLoading={createMatterCaseStatusMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterCaseStatusDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterCaseStatus(null);
        }}
        onSubmit={handleUpdateMatterCaseStatus}
        isLoading={updateMatterCaseStatusMutation.isPending}
        editMode={true}
        editingMatterCaseStatus={editingMatterCaseStatus}
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
          Are you sure you want to delete the matter case status "
          {matterCaseStatusToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterCaseStatus}
            color="error"
            variant="contained"
            disabled={deleteMatterCaseStatusMutation.isPending}
          >
            {deleteMatterCaseStatusMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Case Status Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterCaseStatusId(null);
        }}
        itemId={selectedMatterCaseStatusId}
        itemType="matter-case-status"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterCaseStatus(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterCaseStatusToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterCaseStatusDialog}
        updateMutation={updateMatterCaseStatusMutation}
        deleteMutation={deleteMatterCaseStatusMutation}
      />
    </div>
  );
};

export default MatterCaseStatusPage;
