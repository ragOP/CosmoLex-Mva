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
import TaskPriorityTable from './TaskPriorityTable';
import CreateTaskPriorityDialog from './CreateTaskPriorityDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getTaskPriorities,
  getTaskPriority,
  createTaskPriority,
  updateTaskPriority,
  deleteTaskPriority,
  updateTaskPriorityStatus,
} from '@/api/api_services/setup';

const TaskPriorityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTaskPriority, setEditingTaskPriority] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskPriorityToDelete, setTaskPriorityToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTaskPriorityId, setSelectedTaskPriorityId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch task priorities
  const {
    data: taskPrioritiesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['taskPriorities'],
    queryFn: getTaskPriorities,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const taskPriorities = Array.isArray(taskPrioritiesResponse?.data)
    ? taskPrioritiesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create task priority mutation
  const createTaskPriorityMutation = useMutation({
    mutationFn: createTaskPriority,
    onSuccess: () => {
      toast.success('Task priority created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['taskPriorities']);
    },
    onError: (error) => {
      toast.error('Failed to create task priority. Please try again.');
      console.error('Create task priority error:', error);
    },
  });

  // Update task priority mutation
  const updateTaskPriorityMutation = useMutation({
    mutationFn: ({ taskPriorityId, taskPriorityData }) =>
      updateTaskPriority(taskPriorityId, taskPriorityData),
    onSuccess: () => {
      toast.success('Task priority updated successfully!');
      setEditDialogOpen(false);
      setEditingTaskPriority(null);
      queryClient.invalidateQueries(['taskPriorities']);
    },
    onError: (error) => {
      toast.error('Failed to update task priority. Please try again.');
      console.error('Update task priority error:', error);
    },
  });

  // Delete task priority mutation
  const deleteTaskPriorityMutation = useMutation({
    mutationFn: deleteTaskPriority,
    onSuccess: () => {
      toast.success('Task priority deleted successfully!');
      setDeleteConfirmOpen(false);
      setTaskPriorityToDelete(null);
      queryClient.invalidateQueries(['taskPriorities']);
    },
    onError: (error) => {
      toast.error('Failed to delete task priority. Please try again.');
      console.error('Delete task priority error:', error);
    },
  });

  // Update task priority status mutation
  const updateTaskPriorityStatusMutation = useMutation({
    mutationFn: ({ taskPriorityId, is_active }) =>
      updateTaskPriorityStatus(taskPriorityId, { is_active }),
    onSuccess: () => {
      toast.success('Task priority status updated successfully!');
      queryClient.invalidateQueries(['taskPriorities']);
    },
    onError: (error) => {
      toast.error('Failed to update task priority status. Please try again.');
      console.error('Update task priority status error:', error);
    },
  });

  const handleCreateTaskPriority = (taskPriorityData) => {
    createTaskPriorityMutation.mutate(taskPriorityData);
  };

  const handleUpdateTaskPriority = (taskPriorityData) => {
    if (!editingTaskPriority?.id) {
      toast.error('No task priority selected for editing');
      return;
    }
    updateTaskPriorityMutation.mutate({ 
      taskPriorityId: editingTaskPriority.id, 
      taskPriorityData: taskPriorityData 
    });
  };

  const handleEditTaskPriority = (taskPriority) => {
    setEditingTaskPriority(taskPriority);
    setEditDialogOpen(true);
  };

  const handleDeleteTaskPriority = (taskPriority) => {
    setTaskPriorityToDelete(taskPriority);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteTaskPriority = () => {
    if (taskPriorityToDelete) {
      deleteTaskPriorityMutation.mutate(taskPriorityToDelete.id);
    }
  };

  const handleStatusChange = (taskPriorityId, is_active) => {
    updateTaskPriorityStatusMutation.mutate({ taskPriorityId, is_active });
  };

  const handleView = (taskPriorityId) => {
    setSelectedTaskPriorityId(taskPriorityId);
    setDetailDialogOpen(true);
  };

  const filteredTaskPriorities = Array.isArray(taskPriorities)
    ? taskPriorities.filter(
        (taskPriority) =>
          taskPriority.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          taskPriority.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task Priorities Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search task priorities..."
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
              Add Task Priority
            </Button>
          </Stack>
        </Stack>

        {/* Task Priorities Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TaskPriorityTable
            taskPriorities={filteredTaskPriorities}
            isLoading={isLoading}
            handleEdit={handleEditTaskPriority}
            handleDelete={handleDeleteTaskPriority}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
            onRowClick={(params) => {
              // Handle view functionality if needed
              console.log('View task priority:', params.row);
            }}
          />
        </Box>

        {/* Create Task Priority Dialog */}
        <CreateTaskPriorityDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateTaskPriority}
          isLoading={createTaskPriorityMutation.isPending}
        />

        {/* Edit Task Priority Dialog */}
        <CreateTaskPriorityDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingTaskPriority(null);
          }}
          onSubmit={handleUpdateTaskPriority}
          isLoading={updateTaskPriorityMutation.isPending}
          editingTaskPriority={editingTaskPriority}
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
              Are you sure you want to delete the task priority "
              {taskPriorityToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={executeDeleteTaskPriority}
              color="error"
              variant="contained"
              disabled={deleteTaskPriorityMutation.isPending}
            >
              {deleteTaskPriorityMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Task Priority Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedTaskPriorityId(null);
          }}
          itemId={selectedTaskPriorityId}
          itemType="task-priority"
          fetchItem={getTaskPriority}
          onEdit={(item) => {
            setDetailDialogOpen(false);
            setEditingTaskPriority(item);
            setEditDialogOpen(true);
          }}
          onDelete={(item) => {
            setDetailDialogOpen(false);
            setTaskPriorityToDelete(item);
            setDeleteConfirmOpen(true);
          }}
          CreateDialog={CreateTaskPriorityDialog}
          updateMutation={updateTaskPriorityMutation}
          deleteMutation={deleteTaskPriorityMutation}
        />
      </Stack>
    </div>
  );
};

export default TaskPriorityPage;