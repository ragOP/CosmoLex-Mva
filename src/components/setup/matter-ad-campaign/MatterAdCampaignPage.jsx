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
import MatterAdCampaignTable from './MatterAdCampaignTable';
import CreateMatterAdCampaignDialog from './CreateMatterAdCampaignDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getMatterAdCampaigns,
  getMatterAdCampaign,
  createMatterAdCampaign,
  updateMatterAdCampaign,
  deleteMatterAdCampaign,
  updateMatterAdCampaignStatus,
} from '@/api/api_services/setup';

const MatterAdCampaignPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMatterAdCampaign, setEditingMatterAdCampaign] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matterAdCampaignToDelete, setMatterAdCampaignToDelete] =
    useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMatterAdCampaignId, setSelectedMatterAdCampaignId] =
    useState(null);
  const queryClient = useQueryClient();

  // Fetch matter ad campaigns
  const {
    data: matterAdCampaignsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['matterAdCampaigns'],
    queryFn: getMatterAdCampaigns,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const matterAdCampaigns = Array.isArray(matterAdCampaignsResponse?.data)
    ? matterAdCampaignsResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create matter ad campaign mutation
  const createMatterAdCampaignMutation = useMutation({
    mutationFn: createMatterAdCampaign,
    onSuccess: () => {
      toast.success('Matter ad campaign created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['matterAdCampaigns']);
    },
    onError: (error) => {
      toast.error('Failed to create matter ad campaign. Please try again.');
      console.error('Create matter ad campaign error:', error);
    },
  });

  // Update matter ad campaign mutation
  const updateMatterAdCampaignMutation = useMutation({
    mutationFn: ({ matterAdCampaignId, matterAdCampaignData }) =>
      updateMatterAdCampaign(matterAdCampaignId, matterAdCampaignData),
    onSuccess: () => {
      toast.success('Matter ad campaign updated successfully!');
      setEditDialogOpen(false);
      setEditingMatterAdCampaign(null);
      queryClient.invalidateQueries(['matterAdCampaigns']);
    },
    onError: (error) => {
      toast.error('Failed to update matter ad campaign. Please try again.');
      console.error('Update matter ad campaign error:', error);
    },
  });

  // Delete matter ad campaign mutation
  const deleteMatterAdCampaignMutation = useMutation({
    mutationFn: deleteMatterAdCampaign,
    onSuccess: () => {
      toast.success('Matter ad campaign deleted successfully!');
      setDeleteConfirmOpen(false);
      setMatterAdCampaignToDelete(null);
      queryClient.invalidateQueries(['matterAdCampaigns']);
    },
    onError: (error) => {
      toast.error('Failed to delete matter ad campaign. Please try again.');
      console.error('Delete matter ad campaign error:', error);
    },
  });

  // Update matter ad campaign status mutation
  const updateMatterAdCampaignStatusMutation = useMutation({
    mutationFn: ({ matterAdCampaignId, is_active }) =>
      updateMatterAdCampaignStatus(matterAdCampaignId, { is_active }),
    onSuccess: () => {
      toast.success('Matter ad campaign status updated successfully!');
      queryClient.invalidateQueries(['matterAdCampaigns']);
    },
    onError: (error) => {
      toast.error(
        'Failed to update matter ad campaign status. Please try again.'
      );
      console.error('Update matter ad campaign status error:', error);
    },
  });

  const handleCreateMatterAdCampaign = (matterAdCampaignData) => {
    createMatterAdCampaignMutation.mutate(matterAdCampaignData);
  };

  const handleUpdateMatterAdCampaign = (matterAdCampaignData) => {
    if (!editingMatterAdCampaign?.id) {
      toast.error('No matter ad campaign selected for editing');
      return;
    }
    updateMatterAdCampaignMutation.mutate({
      matterAdCampaignId: editingMatterAdCampaign.id,
      matterAdCampaignData: matterAdCampaignData,
    });
  };

  const handleEditMatterAdCampaign = (matterAdCampaign) => {
    setEditingMatterAdCampaign(matterAdCampaign);
    setEditDialogOpen(true);
  };

  const handleDeleteMatterAdCampaign = (matterAdCampaign) => {
    setMatterAdCampaignToDelete(matterAdCampaign);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteMatterAdCampaign = () => {
    if (matterAdCampaignToDelete) {
      deleteMatterAdCampaignMutation.mutate(matterAdCampaignToDelete.id);
    }
  };

  const handleStatusChange = (matterAdCampaignId, is_active) => {
    updateMatterAdCampaignStatusMutation.mutate({
      matterAdCampaignId,
      is_active,
    });
  };

  const handleView = (matterAdCampaignId) => {
    setSelectedMatterAdCampaignId(matterAdCampaignId);
    setDetailDialogOpen(true);
  };

  const filteredMatterAdCampaigns = Array.isArray(matterAdCampaigns)
    ? matterAdCampaigns.filter(
        (matterAdCampaign) =>
          matterAdCampaign.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          matterAdCampaign.description
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
            Matter Ad Campaign Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search matter ad campaigns..."
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
              Add Matter Ad Campaign
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MatterAdCampaignTable
            matterAdCampaigns={filteredMatterAdCampaigns}
            isLoading={isLoading}
            handleEdit={handleEditMatterAdCampaign}
            handleDelete={handleDeleteMatterAdCampaign}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateMatterAdCampaignDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateMatterAdCampaign}
        isLoading={createMatterAdCampaignMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateMatterAdCampaignDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingMatterAdCampaign(null);
        }}
        onSubmit={handleUpdateMatterAdCampaign}
        isLoading={updateMatterAdCampaignMutation.isPending}
        editMode={true}
        editingMatterAdCampaign={editingMatterAdCampaign}
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
          Are you sure you want to delete the matter ad campaign "
          {matterAdCampaignToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteMatterAdCampaign}
            color="error"
            variant="contained"
            disabled={deleteMatterAdCampaignMutation.isPending}
          >
            {deleteMatterAdCampaignMutation.isPending
              ? 'Deleting...'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Matter Ad Campaign Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedMatterAdCampaignId(null);
        }}
        itemId={selectedMatterAdCampaignId}
        itemType="matter-ad-campaign"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingMatterAdCampaign(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setMatterAdCampaignToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateMatterAdCampaignDialog}
        updateMutation={updateMatterAdCampaignMutation}
        deleteMutation={deleteMatterAdCampaignMutation}
      />
    </div>
  );
};

export default MatterAdCampaignPage;
