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
import MatterCallOutcomeTable from './MatterCallOutcomeTable';
import CreateMatterCallOutcomeDialog from './CreateMatterCallOutcomeDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterCallOutcomes,
  getMatterCallOutcome,
  createMatterCallOutcome,
  updateMatterCallOutcome,
  deleteMatterCallOutcome,
  updateMatterCallOutcomeStatus,
} from '@/api/api_services/setup';

const MatterCallOutcomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterCallOutcome, setEditingMatterCallOutcome] =
    useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterCallOutcomeToDelete, setMatterCallOutcomeToDelete] =
    useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterCallOutcomeId, setSelectedMatterCallOutcomeId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter call outcomes
  const {
    data: matterCallOutcomesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterCallOutcomes'],
    queryFn: getMatterCallOutcomes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterCallOutcomes = Array.isArray(matterCallOutcomesResponse?.data)
    ? matterCallOutcomesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter call outcome mutation
  const createMatterCallOutcomeMutation = useMutation({
    mutationFn: createMatterCallOutcome,
    onSuccess: () => {
      toast.success('Matter call outcome created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterCallOutcomes']);
    },
    onError: (error) => {
      toast.error('Failed to create matter call outcome. Please try again.');
      console.error('Create matter call outcome error:', error);
    },
  });

  // Update matter call outcome mutation
  const updateMatterCallOutcomeMutation = useMutation({
    mutationFn: ({ matterCallOutcomeId, matterCallOutcomeData }) =>
      updateMatterCallOutcome(matterCallOutcomeId, matterCallOutcomeData),
    onSuccess: () => {
      toast.success('Matter call outcome updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterCallOutcome(null);
      queryClient.invalidateQueries(['matterCallOutcomes']);
    },
    onError: (error) => {
      toast.error('Failed to update matter call outcome. Please try again.');
      console.error('Update matter call outcome error:', error);
    },
  });

  // Delete matter call outcome mutation
  const deleteMatterCallOutcomeMutation = useMutation({
    mutationFn: deleteMatterCallOutcome,
    onSuccess: () => {
      toast.success('Matter call outcome deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterCallOutcomeToDelete(null);
      queryClient.invalidateQueries(['matterCallOutcomes']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter call outcome. Please try again.');
      console.error('Delete matter call outcome error:', error);
    },
  });

  // Update matter call outcome status mutation
  const updateMatterCallOutcomeStatusMutation = useMutation({
    mutationFn: ({ matterCallOutcomeId, is_active }) =>
      updateMatterCallOutcomeStatus(matterCallOutcomeId, { is_active }),
    onSuccess: () => {
      toast.success('Matter call outcome status updated successfully!');
      queryClient.invalidateQueries(['matterCallOutcomes']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter call outcome status. Please try again.'
      );
      console.error('Update matter call outcome status error:', error);
    },
  });

  const handleCreateMatterCallOutcome = (matterCallOutcomeData) => {
    createMatterCallOutcomeMutation.mutate(matterCallOutcomeData);
  };

  const handleUpdateMatterCallOutcome = (matterCallOutcomeData) => {
    if (!editingMatterCallOutcome?.id) {
      toast.error('No matter call outcome selected for editing');
      return;
    }
    updateMatterCallOutcomeMutation.mutate({
      matterCallOutcomeId: editingMatterCallOutcome.id,
      matterCallOutcomeData: matterCallOutcomeData,
    });
  };

  const handleEditMatterCallOutcome = (matterCallOutcome) => {
    setEditingMatterCallOutcome(matterCallOutcome);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterCallOutcome = (matterCallOutcome) => {
    setMatterCallOutcomeToDelete(matterCallOutcome);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterCallOutcome = () => {
    if (matterCallOutcomeToDelete) {
      deleteMatterCallOutcomeMutation.mutate(matterCallOutcomeToDelete.id);
    }
  };

  const handleStatusChange = (matterCallOutcomeId, is_active) => {
    updateMatterCallOutcomeStatusMutation.mutate({
      matterCallOutcomeId,
      is_active,
    });
  };

  const handleView = (matterCallOutcomeId) => {
    setSelectedMatterCallOutcomeId(matterCallOutcomeId);
    setDetailDialogOpen(true);
  };

  const filteredMatterCallOutcomes = Array.isArray(matterCallOutcomes)
    ? matterCallOutcomes.filter(
        (matterCallOutcome) =>
          matterCallOutcome.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterCallOutcome.description
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
            Matter Call Outcome Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter call outcomes..."
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
              Add Matter Call Outcome
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterCallOutcomeTable
            matterCallOutcomes={filteredMatterCallOutcomes}
            isLoading={isLoading}
            handleEdit={handleEditMatterCallOutcome}
            handleDelete={handleDeleteMatterCallOutcome}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterCallOutcomeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterCallOutcome}
        isLoading={createMatterCallOutcomeMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterCallOutcomeDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterCallOutcome(null);
        }}
        onSubmit={handleUpdateMatterCallOutcome}
        isLoading={updateMatterCallOutcomeMutation.isPending}
        editMode={true}
        editingMatterCallOutcome={editingMatterCallOutcome}
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
          Are you sure you want to delete the matter call outcome "
          {matterCallOutcomeToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterCallOutcome}
            color="error"
            variant="contained"
            disabled={deleteMatterCallOutcomeMutation.isPending}
          >
            {deleteMatterCallOutcomeMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Call Outcome Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterCallOutcomeId(null);
        }}
        itemId={selectedMatterCallOutcomeId}
        itemType="matter-call-outcome"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterCallOutcome(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterCallOutcomeToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterCallOutcomeDialog}
        updateMutation={updateMatterCallOutcomeMutation}
        deleteMutation={deleteMatterCallOutcomeMutation}
      />
    </div>
  );
};

export default MatterCallOutcomePage;
