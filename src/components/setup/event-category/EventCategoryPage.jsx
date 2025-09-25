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
import EventCategoryTable from './EventCategoryTable';
import CreateEventCategoryDialog from './CreateEventCategoryDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getEventCategories,
  getEventCategory,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  updateEventCategoryStatus,
} from '@/api/api_services/setup';

const EventCategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEventCategory, setEditingEventCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventCategoryToDelete, setEventCategoryToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEventCategoryId, setSelectedEventCategoryId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch event categories
  const {
    data: eventCategoriesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['eventCategories'],
    queryFn: getEventCategories,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const eventCategories = Array.isArray(eventCategoriesResponse?.data)
    ? eventCategoriesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create event category mutation
  const createEventCategoryMutation = useMutation({
    mutationFn: createEventCategory,
    onSuccess: () => {
      toast.success('Event category created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['eventCategories']);
    },
    onError: (error) => {
      toast.error('Failed to create event category. Please try again.');
      console.error('Create event category error:', error);
    },
  });

  // Update event category mutation
  const updateEventCategoryMutation = useMutation({
    mutationFn: ({ eventCategoryId, eventCategoryData }) =>
      updateEventCategory(eventCategoryId, eventCategoryData),
    onSuccess: () => {
      toast.success('Event category updated successfully!');
      setEditDialogOpen(false);
      setEditingEventCategory(null);
      queryClient.invalidateQueries(['eventCategories']);
    },
    onError: (error) => {
      toast.error('Failed to update event category. Please try again.');
      console.error('Update event category error:', error);
    },
  });

  // Delete event category mutation
  const deleteEventCategoryMutation = useMutation({
    mutationFn: deleteEventCategory,
    onSuccess: () => {
      toast.success('Event category deleted successfully!');
      setDeleteConfirmOpen(false);
      setEventCategoryToDelete(null);
      queryClient.invalidateQueries(['eventCategories']);
    },
    onError: (error) => {
      toast.error('Failed to delete event category. Please try again.');
      console.error('Delete event category error:', error);
    },
  });

  // Update event category status mutation
  const updateEventCategoryStatusMutation = useMutation({
    mutationFn: ({ eventCategoryId, is_active }) =>
      updateEventCategoryStatus(eventCategoryId, { is_active }),
    onSuccess: () => {
      toast.success('Event category status updated successfully!');
      queryClient.invalidateQueries(['eventCategories']);
    },
    onError: (error) => {
      toast.error('Failed to update event category status. Please try again.');
      console.error('Update event category status error:', error);
    },
  });

  const handleCreateEventCategory = (eventCategoryData) => {
    createEventCategoryMutation.mutate(eventCategoryData);
  };

  const handleUpdateEventCategory = (eventCategoryData) => {
    if (!editingEventCategory?.id) {
      toast.error('No event category selected for editing');
      return;
    }
    updateEventCategoryMutation.mutate({ 
      eventCategoryId: editingEventCategory.id, 
      eventCategoryData: eventCategoryData 
    });
  };

  const handleEditEventCategory = (eventCategory) => {
    setEditingEventCategory(eventCategory);
    setEditDialogOpen(true);
  };

  const handleDeleteEventCategory = (eventCategory) => {
    setEventCategoryToDelete(eventCategory);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteEventCategory = () => {
    if (eventCategoryToDelete) {
      deleteEventCategoryMutation.mutate(eventCategoryToDelete.id);
    }
  };

  const handleStatusChange = (eventCategoryId, is_active) => {
    updateEventCategoryStatusMutation.mutate({ eventCategoryId, is_active });
  };

  const handleView = (eventCategoryId) => {
    setSelectedEventCategoryId(eventCategoryId);
    setDetailDialogOpen(true);
  };

  const filteredEventCategories = Array.isArray(eventCategories)
    ? eventCategories.filter(
        (eventCategory) =>
          eventCategory.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eventCategory.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Event Categories Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search event categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Event Category
            </Button>
          </Stack>
        </Stack>

        {/* Event Categories Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <EventCategoryTable
            eventCategories={filteredEventCategories}
            isLoading={isLoading}
            handleEdit={handleEditEventCategory}
            handleDelete={handleDeleteEventCategory}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
            onRowClick={(params) => {
              // Handle view functionality if needed
              console.log('View event category:', params.row);
            }}
          />
        </Box>

        {/* Create Event Category Dialog */}
        <CreateEventCategoryDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateEventCategory}
          isLoading={createEventCategoryMutation.isPending}
        />

        {/* Edit Event Category Dialog */}
        <CreateEventCategoryDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingEventCategory(null);
          }}
          onSubmit={handleUpdateEventCategory}
          isLoading={updateEventCategoryMutation.isPending}
          editingEventCategory={editingEventCategory}
          editMode={true}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the event category "
              {eventCategoryToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={executeDeleteEventCategory}
              color="error"
              variant="contained"
              disabled={deleteEventCategoryMutation.isPending}
            >
              {deleteEventCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Event Category Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedEventCategoryId(null);
          }}
          itemId={selectedEventCategoryId}
          itemType="event-category"
          fetchItem={getEventCategory}
          onEdit={(item) => {
            setDetailDialogOpen(false);
            setEditingEventCategory(item);
            setEditDialogOpen(true);
          }}
          onDelete={(item) => {
            setDetailDialogOpen(false);
            setEventCategoryToDelete(item);
            setDeleteConfirmOpen(true);
          }}
          CreateDialog={CreateEventCategoryDialog}
          updateMutation={updateEventCategoryMutation}
          deleteMutation={deleteEventCategoryMutation}
        />
      </Stack>
    </div>
  );
};

export default EventCategoryPage;