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
import TaskStatusTable from './TaskStatusTable';
import CreateTaskStatusDialog from './CreateTaskStatusDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getTaskStatuses,
  getTaskStatus,
  createTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
  updateTaskStatusStatus,
} from '@/api/api_services/setup';

const TaskStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTaskStatus, setEditingTaskStatus] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskStatusToDelete, setTaskStatusToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTaskStatusId, setSelectedTaskStatusId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch task statuses
  const {
    data: taskStatusesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['taskStatuses'],
    queryFn: getTaskStatuses,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const taskStatuses = Array.isArray(taskStatusesResponse?.data)
    ? taskStatusesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create task status mutation
  const createTaskStatusMutation = useMutation({
    mutationFn: createTaskStatus,
    onSuccess: () => {
      toast.success('Task status created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['taskStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to create task status. Please try again.');
      console.error('Create task status error:', error);
    },
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskStatusId, taskStatusData }) =>
      updateTaskStatus(taskStatusId, taskStatusData),
    onSuccess: () => {
      toast.success('Task status updated successfully!');
      setEditDialogOpen(false);
      setEditingTaskStatus(null);
      queryClient.invalidateQueries(['taskStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to update task status. Please try again.');
      console.error('Update task status error:', error);
    },
  });

  // Delete task status mutation
  const deleteTaskStatusMutation = useMutation({
    mutationFn: deleteTaskStatus,
    onSuccess: () => {
      toast.success('Task status deleted successfully!');
      setDeleteConfirmOpen(false);
      setTaskStatusToDelete(null);
      queryClient.invalidateQueries(['taskStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to delete task status. Please try again.');
      console.error('Delete task status error:', error);
    },
  });

  // Update task status status mutation
  const updateTaskStatusStatusMutation = useMutation({
    mutationFn: ({ taskStatusId, is_active }) =>
      updateTaskStatusStatus(taskStatusId, { is_active }),
    onSuccess: () => {
      toast.success('Task status status updated successfully!');
      queryClient.invalidateQueries(['taskStatuses']);
    },
    onError: (error) => {
      toast.error('Failed to update task status status. Please try again.');
      console.error('Update task status status error:', error);
    },
  });

  const handleCreateTaskStatus = (taskStatusData) => {
    createTaskStatusMutation.mutate(taskStatusData);
  };

  const handleUpdateTaskStatus = (taskStatusData) => {
    if (!editingTaskStatus?.id) {
      toast.error('No task status selected for editing');
      return;
    }
    updateTaskStatusMutation.mutate({ 
      taskStatusId: editingTaskStatus.id, 
      taskStatusData: taskStatusData 
    });
  };

  const handleEditTaskStatus = (taskStatus) => {
    setEditingTaskStatus(taskStatus);
    setEditDialogOpen(true);
  };

  const handleDeleteTaskStatus = (taskStatus) => {
    setTaskStatusToDelete(taskStatus);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteTaskStatus = () => {
    if (taskStatusToDelete) {
      deleteTaskStatusMutation.mutate(taskStatusToDelete.id);
    }
  };

  const handleStatusChange = (taskStatusId, is_active) => {
    updateTaskStatusStatusMutation.mutate({ taskStatusId, is_active });
  };

  const handleView = (taskStatusId) => {
    setSelectedTaskStatusId(taskStatusId);
    setDetailDialogOpen(true);
  };

  const filteredTaskStatuses = Array.isArray(taskStatuses)
    ? taskStatuses.filter(
        (taskStatus) =>
          taskStatus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          taskStatus.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task Status Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search task statuses..."
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
              Add Task Status
            </Button>
          </Stack>
        </Stack>

        {/* Task Status Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TaskStatusTable
            taskStatuses={filteredTaskStatuses}
            isLoading={isLoading}
            handleEdit={handleEditTaskStatus}
            handleDelete={handleDeleteTaskStatus}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
            onRowClick={(params) => {
              // Handle view functionality if needed
              console.log('View task status:', params.row);
            }}
          />
        </Box>

        {/* Create Task Status Dialog */}
        <CreateTaskStatusDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateTaskStatus}
          isLoading={createTaskStatusMutation.isPending}
        />

        {/* Edit Task Status Dialog */}
        <CreateTaskStatusDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingTaskStatus(null);
          }}
          onSubmit={handleUpdateTaskStatus}
          isLoading={updateTaskStatusMutation.isPending}
          editingTaskStatus={editingTaskStatus}
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
              Are you sure you want to delete the task status "
              {taskStatusToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={executeDeleteTaskStatus}
              color="error"
              variant="contained"
              disabled={deleteTaskStatusMutation.isPending}
            >
              {deleteTaskStatusMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Task Status Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          itemId={selectedTaskStatusId}
          fetchItem={getTaskStatus}
          itemType="Task Status"
          onEdit={(taskStatus) => {
            setEditingTaskStatus(taskStatus);
            setEditDialogOpen(true);
            setDetailDialogOpen(false);
          }}
          onDelete={(taskStatus) => {
            setTaskStatusToDelete(taskStatus);
            setDeleteConfirmOpen(true);
            setDetailDialogOpen(false);
          }}
        />
      </Stack>
    </div>
  );
};

export default TaskStatusPage;