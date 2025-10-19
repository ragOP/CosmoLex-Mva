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
import MatterOfficeLocationTable from './MatterOfficeLocationTable';
import CreateMatterOfficeLocationDialog from './CreateMatterOfficeLocationDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterOfficeLocations,
  getMatterOfficeLocation,
  createMatterOfficeLocation,
  updateMatterOfficeLocation,
  deleteMatterOfficeLocation,
  updateMatterOfficeLocationStatus,
} from '@/api/api_services/setup';

const MatterOfficeLocationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterOfficeLocation, setEditingMatterOfficeLocation] =
    useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterOfficeLocationToDelete, setMatterOfficeLocationToDelete] =
    useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterOfficeLocationId, setSelectedMatterOfficeLocationId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter office locations
  const {
    data: matterOfficeLocationsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterOfficeLocations'],
    queryFn: getMatterOfficeLocations,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterOfficeLocations = Array.isArray(
    matterOfficeLocationsResponse?.data
  )
    ? matterOfficeLocationsResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter office location mutation
  const createMatterOfficeLocationMutation = useMutation({
    mutationFn: createMatterOfficeLocation,
    onSuccess: () => {
      toast.success('Matter office location created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterOfficeLocations']);
    },
    onError: (error) => {
      toast.error('Failed to create matter office location. Please try again.');
      console.error('Create matter office location error:', error);
    },
  });

  // Update matter office location mutation
  const updateMatterOfficeLocationMutation = useMutation({
    mutationFn: ({ matterOfficeLocationId, matterOfficeLocationData }) =>
      updateMatterOfficeLocation(
        matterOfficeLocationId,
        matterOfficeLocationData
      ),
    onSuccess: () => {
      toast.success('Matter office location updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterOfficeLocation(null);
      queryClient.invalidateQueries(['matterOfficeLocations']);
    },
    onError: (error) => {
      toast.error('Failed to update matter office location. Please try again.');
      console.error('Update matter office location error:', error);
    },
  });

  // Delete matter office location mutation
  const deleteMatterOfficeLocationMutation = useMutation({
    mutationFn: deleteMatterOfficeLocation,
    onSuccess: () => {
      toast.success('Matter office location deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterOfficeLocationToDelete(null);
      queryClient.invalidateQueries(['matterOfficeLocations']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter office location. Please try again.');
      console.error('Delete matter office location error:', error);
    },
  });

  // Update matter office location status mutation
  const updateMatterOfficeLocationStatusMutation = useMutation({
    mutationFn: ({ matterOfficeLocationId, is_active }) =>
      updateMatterOfficeLocationStatus(matterOfficeLocationId, { is_active }),
    onSuccess: () => {
      toast.success('Matter office location status updated successfully!');
      queryClient.invalidateQueries(['matterOfficeLocations']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter office location status. Please try again.'
      );
      console.error('Update matter office location status error:', error);
    },
  });

  const handleCreateMatterOfficeLocation = (matterOfficeLocationData) => {
    createMatterOfficeLocationMutation.mutate(matterOfficeLocationData);
  };

  const handleUpdateMatterOfficeLocation = (matterOfficeLocationData) => {
    if (!editingMatterOfficeLocation?.id) {
      toast.error('No matter office location selected for editing');
      return;
    }
    updateMatterOfficeLocationMutation.mutate({
      matterOfficeLocationId: editingMatterOfficeLocation.id,
      matterOfficeLocationData: matterOfficeLocationData,
    });
  };

  const handleEditMatterOfficeLocation = (matterOfficeLocation) => {
    setEditingMatterOfficeLocation(matterOfficeLocation);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterOfficeLocation = (matterOfficeLocation) => {
    setMatterOfficeLocationToDelete(matterOfficeLocation);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterOfficeLocation = () => {
    if (matterOfficeLocationToDelete) {
      deleteMatterOfficeLocationMutation.mutate(
        matterOfficeLocationToDelete.id
      );
    }
  };

  const handleStatusChange = (matterOfficeLocationId, is_active) => {
    updateMatterOfficeLocationStatusMutation.mutate({
      matterOfficeLocationId,
      is_active,
    });
  };

  const handleView = (matterOfficeLocationId) => {
    setSelectedMatterOfficeLocationId(matterOfficeLocationId);
    setDetailDialogOpen(true);
  };

  const filteredMatterOfficeLocations = Array.isArray(matterOfficeLocations)
    ? matterOfficeLocations.filter(
        (matterOfficeLocation) =>
          matterOfficeLocation.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterOfficeLocation.description
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
            Matter Office Location Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter office locations..."
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
              Add Matter Office Location
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterOfficeLocationTable
            matterOfficeLocations={filteredMatterOfficeLocations}
            isLoading={isLoading}
            handleEdit={handleEditMatterOfficeLocation}
            handleDelete={handleDeleteMatterOfficeLocation}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterOfficeLocationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterOfficeLocation}
        isLoading={createMatterOfficeLocationMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterOfficeLocationDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterOfficeLocation(null);
        }}
        onSubmit={handleUpdateMatterOfficeLocation}
        isLoading={updateMatterOfficeLocationMutation.isPending}
        editMode={true}
        editingMatterOfficeLocation={editingMatterOfficeLocation}
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
          Are you sure you want to delete the matter office location "
          {matterOfficeLocationToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterOfficeLocation}
            color="error"
            variant="contained"
            disabled={deleteMatterOfficeLocationMutation.isPending}
          >
            {deleteMatterOfficeLocationMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Office Location Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterOfficeLocationId(null);
        }}
        itemId={selectedMatterOfficeLocationId}
        itemType="matter-office-location"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterOfficeLocation(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterOfficeLocationToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterOfficeLocationDialog}
        updateMutation={updateMatterOfficeLocationMutation}
        deleteMutation={deleteMatterOfficeLocationMutation}
      />
    </div>
  );
};

export default MatterOfficeLocationPage;
