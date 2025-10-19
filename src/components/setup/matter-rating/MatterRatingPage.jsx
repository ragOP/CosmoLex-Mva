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
import MatterRatingTable from './MatterRatingTable';
import CreateMatterRatingDialog from './CreateMatterRatingDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterRatings,
  getMatterRating,
  createMatterRating,
  updateMatterRating,
  deleteMatterRating,
  updateMatterRatingStatus,
} from '@/api/api_services/setup';

const MatterRatingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterRating, setEditingMatterRating] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterRatingToDelete, setMatterRatingToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterRatingId, setSelectedMatterRatingId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch matter ratings
  const {
    data: matterRatingsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterRatings'],
    queryFn: getMatterRatings,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterRatings = Array.isArray(matterRatingsResponse?.data)
    ? matterRatingsResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter rating mutation
  const createMatterRatingMutation = useMutation({
    mutationFn: createMatterRating,
    onSuccess: () => {
      toast.success('Matter rating created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterRatings']);
    },
    onError: (error) => {
      toast.error('Failed to create matter rating. Please try again.');
      console.error('Create matter rating error:', error);
    },
  });

  // Update matter rating mutation
  const updateMatterRatingMutation = useMutation({
    mutationFn: ({ matterRatingId, matterRatingData }) =>
      updateMatterRating(matterRatingId, matterRatingData),
    onSuccess: () => {
      toast.success('Matter rating updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterRating(null);
      queryClient.invalidateQueries(['matterRatings']);
    },
    onError: (error) => {
      toast.error('Failed to update matter rating. Please try again.');
      console.error('Update matter rating error:', error);
    },
  });

  // Delete matter rating mutation
  const deleteMatterRatingMutation = useMutation({
    mutationFn: deleteMatterRating,
    onSuccess: () => {
      toast.success('Matter rating deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterRatingToDelete(null);
      queryClient.invalidateQueries(['matterRatings']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter rating. Please try again.');
      console.error('Delete matter rating error:', error);
    },
  });

  // Update matter rating status mutation
  const updateMatterRatingStatusMutation = useMutation({
    mutationFn: ({ matterRatingId, is_active }) =>
      updateMatterRatingStatus(matterRatingId, { is_active }),
    onSuccess: () => {
      toast.success('Matter rating status updated successfully!');
      queryClient.invalidateQueries(['matterRatings']);
    },
    onError: (error) => {
      toast.error('Failed to update matter rating status. Please try again.');
      console.error('Update matter rating status error:', error);
    },
  });

  const handleCreateMatterRating = (matterRatingData) => {
    createMatterRatingMutation.mutate(matterRatingData);
  };

  const handleUpdateMatterRating = (matterRatingData) => {
    if (!editingMatterRating?.id) {
      toast.error('No matter rating selected for editing');
      return;
    }
    updateMatterRatingMutation.mutate({
      matterRatingId: editingMatterRating.id,
      matterRatingData: matterRatingData,
    });
  };

  const handleEditMatterRating = (matterRating) => {
    setEditingMatterRating(matterRating);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterRating = (matterRating) => {
    setMatterRatingToDelete(matterRating);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterRating = () => {
    if (matterRatingToDelete) {
      deleteMatterRatingMutation.mutate(matterRatingToDelete.id);
    }
  };

  const handleStatusChange = (matterRatingId, is_active) => {
    updateMatterRatingStatusMutation.mutate({ matterRatingId, is_active });
  };

  const handleView = (matterRatingId) => {
    setSelectedMatterRatingId(matterRatingId);
    setDetailDialogOpen(true);
  };

  const filteredMatterRatings = Array.isArray(matterRatings)
    ? matterRatings.filter(
        (matterRating) =>
          matterRating.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matterRating.description
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
            Matter Rating Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter ratings..."
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
              Add Matter Rating
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterRatingTable
            matterRatings={filteredMatterRatings}
            isLoading={isLoading}
            handleEdit={handleEditMatterRating}
            handleDelete={handleDeleteMatterRating}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterRatingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterRating}
        isLoading={createMatterRatingMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterRatingDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterRating(null);
        }}
        onSubmit={handleUpdateMatterRating}
        isLoading={updateMatterRatingMutation.isPending}
        editMode={true}
        editingMatterRating={editingMatterRating}
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
          Are you sure you want to delete the matter rating "
          {matterRatingToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterRating}
            color="error"
            variant="contained"
            disabled={deleteMatterRatingMutation.isPending}
          >
            {deleteMatterRatingMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Rating Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterRatingId(null);
        }}
        itemId={selectedMatterRatingId}
        itemType="matter-rating"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterRating(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterRatingToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterRatingDialog}
        updateMutation={updateMatterRatingMutation}
        deleteMutation={deleteMatterRatingMutation}
      />
    </div>
  );
};

export default MatterRatingPage;
