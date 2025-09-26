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
import EventStatusTable from './EventStatusTable';
import CreateEventStatusDialog from './CreateEventStatusDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getEventStatuses,
  getEventStatus,
  createEventStatus,
  updateEventStatus,
  deleteEventStatus,
  updateEventStatusStatus,
} from '@/api/api_services/setup';

const EventStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEventStatus, setEditingEventStatus] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventStatusToDelete, setEventStatusToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEventStatusId, setSelectedEventStatusId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch event statuses
  const {
    data: eventStatusesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['eventStatuses'],
    queryFn: getEventStatuses,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const eventStatuses = Array.isArray(eventStatusesResponse?.data)
    ? eventStatusesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create event status mutation
  const createEventStatusMutation = useMutation({
    mutationFn: createEventStatus,
    onSuccess: () => {
      toast.success('Event status created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['eventStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to create event status. Please try again.');
      console.error('Create event status error:', error);
    },
  });

  // Update event status mutation
  const updateEventStatusMutation = useMutation({
    mutationFn: ({ eventStatusId, eventStatusData }) =>
      updateEventStatus(eventStatusId, eventStatusData),
    onSuccess: () => {
      toast.success('Event status updated successfully!');
      setEditDialogOpen(false);
      setEditingEventStatus(null);
      queryClient.invalidateQueries(['eventStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to update event status. Please try again.');
      console.error('Update event status error:', error);
    },
  });

  // Delete event status mutation
  const deleteEventStatusMutation = useMutation({
    mutationFn: deleteEventStatus,
    onSuccess: () => {
      toast.success('Event status deleted successfully!');
      setDeleteConfirmOpen(false);
      setEventStatusToDelete(null);
      queryClient.invalidateQueries(['eventStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to delete event status. Please try again.');
      console.error('Delete event status error:', error);
    },
  });

  // Update event status status mutation
  const updateEventStatusStatusMutation = useMutation({
    mutationFn: ({ eventStatusId, is_active }) =>
      updateEventStatusStatus(eventStatusId, { is_active }),
    onSuccess: () => {
      toast.success('Event status status updated successfully!');
      queryClient.invalidateQueries(['eventStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to update event status status. Please try again.');
      console.error('Update event status status error:', error);
    },
  });

  const handleCreateEventStatus = (eventStatusData) => {
    createEventStatusMutation.mutate(eventStatusData);
  };

  const handleUpdateEventStatus = (eventStatusData) => {
    if (!editingEventStatus?.id) {
      toast.error('No event status selected for editing');
      return;
    }
    updateEventStatusMutation.mutate({ 
      eventStatusId: editingEventStatus.id, 
      eventStatusData: eventStatusData 
    });
  };

  const handleEditEventStatus = (eventStatus) => {
    setEditingEventStatus(eventStatus);
    setEditDialogOpen(true);
  };

  const handleDeleteEventStatus = (eventStatus) => {
    setEventStatusToDelete(eventStatus);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteEventStatus = () => {
    if (eventStatusToDelete) {
      deleteEventStatusMutation.mutate(eventStatusToDelete.id);
    }
  };

  const handleStatusChange = (eventStatusId, is_active) => {
    updateEventStatusStatusMutation.mutate({ eventStatusId, is_active });
  };

  const handleView = (eventStatusId) => {
    setSelectedEventStatusId(eventStatusId);
    setDetailDialogOpen(true);
  };

  const filteredEventStatuses = Array.isArray(eventStatuses)
    ? eventStatuses.filter(
        (eventStatus) =>
          eventStatus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eventStatus.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-4 h-full flex flex-col">
      <Stack spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            Event Status Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search event statuses..."
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
              Add Event Status
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <EventStatusTable
            eventStatuses={filteredEventStatuses}
            isLoading={isLoading}
            handleEdit={handleEditEventStatus}
            handleDelete={handleDeleteEventStatus}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
          />
        </Box>
      </Stack>

      {/* Create Dialog */}
      <CreateEventStatusDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateEventStatus}
        isLoading={createEventStatusMutation.isPending}
      />

      {/* Edit Dialog */}
      <CreateEventStatusDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingEventStatus(null);
        }}
        onSubmit={handleUpdateEventStatus}
        isLoading={updateEventStatusMutation.isPending}
        editMode={true}
        editingEventStatus={editingEventStatus}
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
          Are you sure you want to delete the event status "
          {eventStatusToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={executeDeleteEventStatus}
            color="error"
            variant="contained"
            disabled={deleteEventStatusMutation.isPending}
          >
            {deleteEventStatusMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Status Detail Dialog */}
      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedEventStatusId(null);
        }}
        itemId={selectedEventStatusId}
        itemType="event-status"
        onEdit={(item) => {
          setDetailDialogOpen(false);
          setEditingEventStatus(item);
          setEditDialogOpen(true);
        }}
        onDelete={(item) => {
          setDetailDialogOpen(false);
          setEventStatusToDelete(item);
          setDeleteConfirmOpen(true);
        }}
        CreateDialog={CreateEventStatusDialog}
        updateMutation={updateEventStatusMutation}
        deleteMutation={deleteEventStatusMutation}
      />
    </div>
  );
};

export default EventStatusPage;