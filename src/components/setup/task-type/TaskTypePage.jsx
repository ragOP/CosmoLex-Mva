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
import TaskTypeTable from './TaskTypeTable';
import CreateTaskTypeDialog from './CreateTaskTypeDialog';
import {
  getTaskTypes,
  createTaskType,
  updateTaskType,
  deleteTaskType,
  updateTaskTypeStatus,
} from '@/api/api_services/setup';

const TaskTypePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskTypeToDelete, setTaskTypeToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Fetch task types
  const {
    data: taskTypesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['taskTypes'],
    queryFn: getTaskTypes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const taskTypes = Array.isArray(taskTypesResponse?.data)
    ? taskTypesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create task type mutation
  const createTaskTypeMutation = useMutation({
    mutationFn: createTaskType,
    onSuccess: () => {
      toast.success('Task type created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['taskTypes']);
    },
    onError: (error) => {
      toast.error('Failed to create task type. Please try again.');
      console.error('Create task type error:', error);
    },
  });

  // Update task type mutation
  const updateTaskTypeMutation = useMutation({
    mutationFn: ({ taskTypeId, taskTypeData }) =>
      updateTaskType(taskTypeId, taskTypeData),
    onSuccess: () => {
      toast.success('Task type updated successfully!');
      setEditDialogOpen(false);
      setEditingTaskType(null);
      queryClient.invalidateQueries(['taskTypes']);
    },
    onError: (error) => {
      toast.error('Failed to update task type. Please try again.');
      console.error('Update task type error:', error);
    },
  });

  // Delete task type mutation
  const deleteTaskTypeMutation = useMutation({
    mutationFn: deleteTaskType,
    onSuccess: () => {
      toast.success('Task type deleted successfully!');
      setDeleteConfirmOpen(false);
      setTaskTypeToDelete(null);
      queryClient.invalidateQueries(['taskTypes']);
    },
    onError: (error) => {
      toast.error('Failed to delete task type. Please try again.');
      console.error('Delete task type error:', error);
    },
  });

  // Update task type status mutation
  const updateTaskTypeStatusMutation = useMutation({
    mutationFn: ({ taskTypeId, is_active }) =>
      updateTaskTypeStatus(taskTypeId, { is_active }),
    onSuccess: () => {
      toast.success('Task type status updated successfully!');
      queryClient.invalidateQueries(['taskTypes']);
    },
    onError: (error) => {
      toast.error('Failed to update task type status. Please try again.');
      console.error('Update task type status error:', error);
    },
  });

  const handleCreateTaskType = (taskTypeData) => {
    createTaskTypeMutation.mutate(taskTypeData);
  };

  const handleUpdateTaskType = (taskTypeData) => {
    if (!editingTaskType?.id) {
      toast.error('No task type selected for editing');
      return;
    }
    updateTaskTypeMutation.mutate({ 
      taskTypeId: editingTaskType.id, 
      taskTypeData: taskTypeData 
    });
  };

  const handleEditTaskType = (taskType) => {
    setEditingTaskType(taskType);
    setEditDialogOpen(true);
  };

  const handleDeleteTaskType = (taskType) => {
    setTaskTypeToDelete(taskType);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteTaskType = () => {
    if (taskTypeToDelete) {
      deleteTaskTypeMutation.mutate(taskTypeToDelete.id);
    }
  };

  const handleStatusChange = (taskTypeId, is_active) => {
    updateTaskTypeStatusMutation.mutate({ taskTypeId, is_active });
  };

  const filteredTaskTypes = Array.isArray(taskTypes)
    ? taskTypes.filter(
        (taskType) =>
          taskType.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          taskType.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task Types Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search task types..."
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
              Add Task Type
            </Button>
          </Stack>
        </Stack>

        {/* Task Types Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TaskTypeTable
            taskTypes={filteredTaskTypes}
            isLoading={isLoading}
            handleEdit={handleEditTaskType}
            handleDelete={handleDeleteTaskType}
            handleStatusChange={handleStatusChange}
            onRowClick={(params) => {
              // Handle view functionality if needed
              console.log('View task type:', params.row);
            }}
          />
        </Box>

        {/* Create Task Type Dialog */}
        <CreateTaskTypeDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateTaskType}
          isLoading={createTaskTypeMutation.isPending}
        />

        {/* Edit Task Type Dialog */}
        <CreateTaskTypeDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingTaskType(null);
          }}
          onSubmit={handleUpdateTaskType}
          isLoading={updateTaskTypeMutation.isPending}
          editingTaskType={editingTaskType}
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
              Are you sure you want to delete the task type "
              {taskTypeToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={executeDeleteTaskType}
              color="error"
              variant="contained"
              disabled={deleteTaskTypeMutation.isPending}
            >
              {deleteTaskTypeMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
};

export default TaskTypePage;
