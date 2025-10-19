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
import MatterCaseTypeTable from './MatterCaseTypeTable';
import CreateMatterCaseTypeDialog from './CreateMatterCaseTypeDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterCaseTypes,
  getMatterCaseType,
  createMatterCaseType,
  updateMatterCaseType,
  deleteMatterCaseType,
  updateMatterCaseTypeStatus,
} from '@/api/api_services/setup';

const MatterCaseTypePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterCaseType, setEditingMatterCaseType] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterCaseTypeToDelete, setMatterCaseTypeToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterCaseTypeId, setSelectedMatterCaseTypeId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter case types
  const {
    data: matterCaseTypesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterCaseTypes'],
    queryFn: getMatterCaseTypes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterCaseTypes = Array.isArray(matterCaseTypesResponse?.data)
    ? matterCaseTypesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter case type mutation
  const createMatterCaseTypeMutation = useMutation({
    mutationFn: createMatterCaseType,
    onSuccess: () => {
      toast.success('Matter case type created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterCaseTypes']);
    },
    onError: (error) => {
      toast.error('Failed to create matter case type. Please try again.');
      console.error('Create matter case type error:', error);
    },
  });

  // Update matter case type mutation
  const updateMatterCaseTypeMutation = useMutation({
    mutationFn: ({ matterCaseTypeId, matterCaseTypeData }) =>
      updateMatterCaseType(matterCaseTypeId, matterCaseTypeData),
    onSuccess: () => {
      toast.success('Matter case type updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterCaseType(null);
      queryClient.invalidateQueries(['matterCaseTypes']);
    },
    onError: (error) => {
      toast.error('Failed to update matter case type. Please try again.');
      console.error('Update matter case type error:', error);
    },
  });

  // Delete matter case type mutation
  const deleteMatterCaseTypeMutation = useMutation({
    mutationFn: deleteMatterCaseType,
    onSuccess: () => {
      toast.success('Matter case type deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterCaseTypeToDelete(null);
      queryClient.invalidateQueries(['matterCaseTypes']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter case type. Please try again.');
      console.error('Delete matter case type error:', error);
    },
  });

  // Update matter case type status mutation
  const updateMatterCaseTypeStatusMutation = useMutation({
    mutationFn: ({ matterCaseTypeId, is_active }) =>
      updateMatterCaseTypeStatus(matterCaseTypeId, { is_active }),
    onSuccess: () => {
      toast.success('Matter case type status updated successfully!');
      queryClient.invalidateQueries(['matterCaseTypes']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter case type status. Please try again.'
      );
      console.error('Update matter case type status error:', error);
    },
  });

  const handleCreateMatterCaseType = (matterCaseTypeData) => {
    createMatterCaseTypeMutation.mutate(matterCaseTypeData);
  };

  const handleUpdateMatterCaseType = (matterCaseTypeData) => {
    if (!editingMatterCaseType?.id) {
      toast.error('No matter case type selected for editing');
      return;
    }
    updateMatterCaseTypeMutation.mutate({
      matterCaseTypeId: editingMatterCaseType.id,
      matterCaseTypeData: matterCaseTypeData,
    });
  };

  const handleEditMatterCaseType = (matterCaseType) => {
    setEditingMatterCaseType(matterCaseType);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterCaseType = (matterCaseType) => {
    setMatterCaseTypeToDelete(matterCaseType);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterCaseType = () => {
    if (matterCaseTypeToDelete) {
      deleteMatterCaseTypeMutation.mutate(matterCaseTypeToDelete.id);
    }
  };

  const handleStatusChange = (matterCaseTypeId, is_active) => {
    updateMatterCaseTypeStatusMutation.mutate({ matterCaseTypeId, is_active });
  };

  const handleView = (matterCaseTypeId) => {
    setSelectedMatterCaseTypeId(matterCaseTypeId);
    setDetailDialogOpen(true);
  };

  const filteredMatterCaseTypes = Array.isArray(matterCaseTypes)
    ? matterCaseTypes.filter(
        (matterCaseType) =>
          matterCaseType.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterCaseType.description
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
            Matter Case Type Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter case types..."
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
              Add Matter Case Type
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterCaseTypeTable
            matterCaseTypes={filteredMatterCaseTypes}
            isLoading={isLoading}
            handleEdit={handleEditMatterCaseType}
            handleDelete={handleDeleteMatterCaseType}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterCaseTypeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterCaseType}
        isLoading={createMatterCaseTypeMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterCaseTypeDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterCaseType(null);
        }}
        onSubmit={handleUpdateMatterCaseType}
        isLoading={updateMatterCaseTypeMutation.isPending}
        editMode={true}
        editingMatterCaseType={editingMatterCaseType}
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
          Are you sure you want to delete the matter case type "
          {matterCaseTypeToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterCaseType}
            color="error"
            variant="contained"
            disabled={deleteMatterCaseTypeMutation.isPending}
          >
            {deleteMatterCaseTypeMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Case Type Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterCaseTypeId(null);
        }}
        itemId={selectedMatterCaseTypeId}
        itemType="matter-case-type"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterCaseType(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterCaseTypeToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterCaseTypeDialog}
        updateMutation={updateMatterCaseTypeMutation}
        deleteMutation={deleteMatterCaseTypeMutation}
      />
    </div>
  );
};

export default MatterCaseTypePage;
