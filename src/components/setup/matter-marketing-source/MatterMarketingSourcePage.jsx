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
import MatterMarketingSourceTable from './MatterMarketingSourceTable';
import CreateMatterMarketingSourceDialog from './CreateMatterMarketingSourceDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterMarketingSources,
  getMatterMarketingSource,
  createMatterMarketingSource,
  updateMatterMarketingSource,
  deleteMatterMarketingSource,
  updateMatterMarketingSourceStatus,
} from '@/api/api_services/setup';

const MatterMarketingSourcePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterMarketingSource, setEditingMatterMarketingSource] =
    useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterMarketingSourceToDelete, setMatterMarketingSourceToDelete] =
    useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterMarketingSourceId, setSelectedMatterMarketingSourceId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter marketing sources
  const {
    data: matterMarketingSourcesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterMarketingSources'],
    queryFn: getMatterMarketingSources,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterMarketingSources = Array.isArray(
    matterMarketingSourcesResponse?.data
  )
    ? matterMarketingSourcesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter marketing source mutation
  const createMatterMarketingSourceMutation = useMutation({
    mutationFn: createMatterMarketingSource,
    onSuccess: () => {
      toast.success('Matter marketing source created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterMarketingSources']);
    },
    onError: (error) => {
      toast.error(
        'Failed to create matter marketing source. Please try again.'
      );
      console.error('Create matter marketing source error:', error);
    },
  });

  // Update matter marketing source mutation
  const updateMatterMarketingSourceMutation = useMutation({
    mutationFn: ({ matterMarketingSourceId, matterMarketingSourceData }) =>
      updateMatterMarketingSource(
        matterMarketingSourceId,
        matterMarketingSourceData
      ),
    onSuccess: () => {
      toast.success('Matter marketing source updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterMarketingSource(null);
      queryClient.invalidateQueries(['matterMarketingSources']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter marketing source. Please try again.'
      );
      console.error('Update matter marketing source error:', error);
    },
  });

  // Delete matter marketing source mutation
  const deleteMatterMarketingSourceMutation = useMutation({
    mutationFn: deleteMatterMarketingSource,
    onSuccess: () => {
      toast.success('Matter marketing source deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterMarketingSourceToDelete(null);
      queryClient.invalidateQueries(['matterMarketingSources']);
    },
    onError: (error) => {
      toast.error(
        'Failed to delete matter marketing source. Please try again.'
      );
      console.error('Delete matter marketing source error:', error);
    },
  });

  // Update matter marketing source status mutation
  const updateMatterMarketingSourceStatusMutation = useMutation({
    mutationFn: ({ matterMarketingSourceId, is_active }) =>
      updateMatterMarketingSourceStatus(matterMarketingSourceId, { is_active }),
    onSuccess: () => {
      toast.success('Matter marketing source status updated successfully!');
      queryClient.invalidateQueries(['matterMarketingSources']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter marketing source status. Please try again.'
      );
      console.error('Update matter marketing source status error:', error);
    },
  });

  const handleCreateMatterMarketingSource = (matterMarketingSourceData) => {
    createMatterMarketingSourceMutation.mutate(matterMarketingSourceData);
  };

  const handleUpdateMatterMarketingSource = (matterMarketingSourceData) => {
    if (!editingMatterMarketingSource?.id) {
      toast.error('No matter marketing source selected for editing');
      return;
    }
    updateMatterMarketingSourceMutation.mutate({
      matterMarketingSourceId: editingMatterMarketingSource.id,
      matterMarketingSourceData: matterMarketingSourceData,
    });
  };

  const handleEditMatterMarketingSource = (matterMarketingSource) => {
    setEditingMatterMarketingSource(matterMarketingSource);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterMarketingSource = (matterMarketingSource) => {
    setMatterMarketingSourceToDelete(matterMarketingSource);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterMarketingSource = () => {
    if (matterMarketingSourceToDelete) {
      deleteMatterMarketingSourceMutation.mutate(
        matterMarketingSourceToDelete.id
      );
    }
  };

  const handleStatusChange = (matterMarketingSourceId, is_active) => {
    updateMatterMarketingSourceStatusMutation.mutate({
      matterMarketingSourceId,
      is_active,
    });
  };

  const handleView = (matterMarketingSourceId) => {
    setSelectedMatterMarketingSourceId(matterMarketingSourceId);
    setDetailDialogOpen(true);
  };

  const filteredMatterMarketingSources = Array.isArray(matterMarketingSources)
    ? matterMarketingSources.filter(
        (matterMarketingSource) =>
          matterMarketingSource.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterMarketingSource.description
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
            Matter Marketing Source Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter marketing sources..."
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
              Add Matter Marketing Source
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterMarketingSourceTable
            matterMarketingSources={filteredMatterMarketingSources}
            isLoading={isLoading}
            handleEdit={handleEditMatterMarketingSource}
            handleDelete={handleDeleteMatterMarketingSource}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterMarketingSourceDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterMarketingSource}
        isLoading={createMatterMarketingSourceMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterMarketingSourceDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterMarketingSource(null);
        }}
        onSubmit={handleUpdateMatterMarketingSource}
        isLoading={updateMatterMarketingSourceMutation.isPending}
        editMode={true}
        editingMatterMarketingSource={editingMatterMarketingSource}
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
          Are you sure you want to delete the matter marketing source "
          {matterMarketingSourceToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterMarketingSource}
            color="error"
            variant="contained"
            disabled={deleteMatterMarketingSourceMutation.isPending}
          >
            {deleteMatterMarketingSourceMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Marketing Source Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterMarketingSourceId(null);
        }}
        itemId={selectedMatterMarketingSourceId}
        itemType="matter-marketing-source"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterMarketingSource(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterMarketingSourceToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterMarketingSourceDialog}
        updateMutation={updateMatterMarketingSourceMutation}
        deleteMutation={deleteMatterMarketingSourceMutation}
      />
    </div>
  );
};

export default MatterMarketingSourcePage;
