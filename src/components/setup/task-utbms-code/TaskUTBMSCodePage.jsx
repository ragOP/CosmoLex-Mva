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
import TaskUTBMSCodeTable from './TaskUTBMSCodeTable';
import CreateTaskUTBMSCodeDialog from './CreateTaskUTBMSCodeDialog';
import TaskDetailDialog from '../shared/TaskDetailDialog';
import {
  getTaskUTBMSCodes,
  getTaskUTBMSCode,
  createTaskUTBMSCode,
  updateTaskUTBMSCode,
  deleteTaskUTBMSCode,
  updateTaskUTBMSCodeStatus,
} from '@/api/api_services/setup';

const TaskUTBMSCodePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTaskUTBMSCode, setEditingTaskUTBMSCode] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskUTBMSCodeToDelete, setTaskUTBMSCodeToDelete] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTaskUTBMSCodeId, setSelectedTaskUTBMSCodeId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch task UTBMS codes
  const {
    data: taskUTBMSCodesResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['taskUTBMSCodes'],
    queryFn: getTaskUTBMSCodes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data?.response || [],
  });

  const taskUTBMSCodes = Array.isArray(taskUTBMSCodesResponse?.data)
    ? taskUTBMSCodesResponse.data
    : [];

  const handleRefresh = () => {
    refetch();
  };

  // Create task UTBMS code mutation
  const createTaskUTBMSCodeMutation = useMutation({
    mutationFn: createTaskUTBMSCode,
    onSuccess: () => {
      toast.success('Task UTBMS code created successfully!');
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['taskUTBMSCodes']);
    },
    onError: (error) => {
      toast.error('Failed to create task UTBMS code. Please try again.');
      console.error('Create task UTBMS code error:', error);
    },
  });

  // Update task UTBMS code mutation
  const updateTaskUTBMSCodeMutation = useMutation({
    mutationFn: ({ taskUTBMSCodeId, taskUTBMSCodeData }) =>
      updateTaskUTBMSCode(taskUTBMSCodeId, taskUTBMSCodeData),
    onSuccess: () => {
      toast.success('Task UTBMS code updated successfully!');
      setEditDialogOpen(false);
      setEditingTaskUTBMSCode(null);
      queryClient.invalidateQueries(['taskUTBMSCodes']);
    },
    onError: (error) => {
      toast.error('Failed to update task UTBMS code. Please try again.');
      console.error('Update task UTBMS code error:', error);
    },
  });

  // Delete task UTBMS code mutation
  const deleteTaskUTBMSCodeMutation = useMutation({
    mutationFn: deleteTaskUTBMSCode,
    onSuccess: () => {
      toast.success('Task UTBMS code deleted successfully!');
      setDeleteConfirmOpen(false);
      setTaskUTBMSCodeToDelete(null);
      queryClient.invalidateQueries(['taskUTBMSCodes']);
    },
    onError: (error) => {
      toast.error('Failed to delete task UTBMS code. Please try again.');
      console.error('Delete task UTBMS code error:', error);
    },
  });

  // Update task UTBMS code status mutation
  const updateTaskUTBMSCodeStatusMutation = useMutation({
    mutationFn: ({ taskUTBMSCodeId, is_active }) =>
      updateTaskUTBMSCodeStatus(taskUTBMSCodeId, { is_active }),
    onSuccess: () => {
      toast.success('Task UTBMS code status updated successfully!');
      queryClient.invalidateQueries(['taskUTBMSCodes']);
    },
    onError: (error) => {
      toast.error('Failed to update task UTBMS code status. Please try again.');
      console.error('Update task UTBMS code status error:', error);
    },
  });

  const handleCreateTaskUTBMSCode = (taskUTBMSCodeData) => {
    createTaskUTBMSCodeMutation.mutate(taskUTBMSCodeData);
  };

  const handleUpdateTaskUTBMSCode = (taskUTBMSCodeData) => {
    if (!editingTaskUTBMSCode?.id) {
      toast.error('No task UTBMS code selected for editing');
      return;
    }
    updateTaskUTBMSCodeMutation.mutate({ 
      taskUTBMSCodeId: editingTaskUTBMSCode.id, 
      taskUTBMSCodeData: taskUTBMSCodeData 
    });
  };

  const handleEditTaskUTBMSCode = (taskUTBMSCode) => {
    setEditingTaskUTBMSCode(taskUTBMSCode);
    setEditDialogOpen(true);
  };

  const handleDeleteTaskUTBMSCode = (taskUTBMSCode) => {
    setTaskUTBMSCodeToDelete(taskUTBMSCode);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteTaskUTBMSCode = () => {
    if (taskUTBMSCodeToDelete) {
      deleteTaskUTBMSCodeMutation.mutate(taskUTBMSCodeToDelete.id);
    }
  };

  const handleStatusChange = (taskUTBMSCodeId, is_active) => {
    updateTaskUTBMSCodeStatusMutation.mutate({ taskUTBMSCodeId, is_active });
  };

  const handleView = (taskUTBMSCodeId) => {
    setSelectedTaskUTBMSCodeId(taskUTBMSCodeId);
    setDetailDialogOpen(true);
  };

  const filteredTaskUTBMSCodes = Array.isArray(taskUTBMSCodes)
    ? taskUTBMSCodes.filter(
        (taskUTBMSCode) =>
          taskUTBMSCode.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          taskUTBMSCode.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task UTBMS Codes Management
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search task UTBMS codes..."
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
              Add Task UTBMS Code
            </Button>
          </Stack>
        </Stack>

        {/* Task UTBMS Codes Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TaskUTBMSCodeTable
            taskUTBMSCodes={filteredTaskUTBMSCodes}
            isLoading={isLoading}
            handleEdit={handleEditTaskUTBMSCode}
            handleDelete={handleDeleteTaskUTBMSCode}
            handleStatusChange={handleStatusChange}
            handleView={handleView}
            onRowClick={(params) => {
              // Handle view functionality if needed
              console.log('View task UTBMS code:', params.row);
            }}
          />
        </Box>

        {/* Create Task UTBMS Code Dialog */}
        <CreateTaskUTBMSCodeDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateTaskUTBMSCode}
          isLoading={createTaskUTBMSCodeMutation.isPending}
        />

        {/* Edit Task UTBMS Code Dialog */}
        <CreateTaskUTBMSCodeDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingTaskUTBMSCode(null);
          }}
          onSubmit={handleUpdateTaskUTBMSCode}
          isLoading={updateTaskUTBMSCodeMutation.isPending}
          editingTaskUTBMSCode={editingTaskUTBMSCode}
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
              Are you sure you want to delete the task UTBMS code "
              {taskUTBMSCodeToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={executeDeleteTaskUTBMSCode}
              color="error"
              variant="contained"
              disabled={deleteTaskUTBMSCodeMutation.isPending}
            >
              {deleteTaskUTBMSCodeMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Task UTBMS Code Detail Dialog */}
        <TaskDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedTaskUTBMSCodeId(null);
          }}
          itemId={selectedTaskUTBMSCodeId}
          itemType="task-utbms-code"
          fetchItem={getTaskUTBMSCode}
          onEdit={(item) => {
            setDetailDialogOpen(false);
            setEditingTaskUTBMSCode(item);
            setEditDialogOpen(true);
          }}
          onDelete={(item) => {
            setDetailDialogOpen(false);
            setTaskUTBMSCodeToDelete(item);
            setDeleteConfirmOpen(true);
          }}
          CreateDialog={CreateTaskUTBMSCodeDialog}
          updateMutation={updateTaskUTBMSCodeMutation}
          deleteMutation={deleteTaskUTBMSCodeMutation}
        />
      </Stack>
    </div>
  );
};

export default TaskUTBMSCodePage;