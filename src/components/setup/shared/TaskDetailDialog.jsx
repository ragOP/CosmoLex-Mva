import React, { useState } from 'react';
import {
  Stack,
  Typography,
  Chip,
  Box,
  IconButton,
  Skeleton,
  Dialog,
  Grid,
  Paper,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  Settings,
  Edit,
  Trash2,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Hash,
} from 'lucide-react';
import { 
  getTaskType, 
  deleteTaskType, 
  updateTaskType,
  getTaskStatus,
  deleteTaskStatus,
  updateTaskStatus
} from '@/api/api_services/setup';
import { toast } from 'sonner';
import CreateTaskTypeDialog from '../task-type/CreateTaskTypeDialog';
import CreateTaskStatusDialog from '../task-status/CreateTaskStatusDialog';
import { Button } from '@/components/ui/button';

const TaskDetailDialog = ({ 
  open, 
  onClose, 
  itemId, 
  type, // 'task-type' or 'task-status'
  onRefresh 
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const isTaskType = type === 'task-type';
  const queryKey = isTaskType ? 'taskTypes' : 'taskStatuses';
  const itemQueryKey = isTaskType ? 'taskType' : 'taskStatus';
  
  // API functions based on type
  const getItemFn = isTaskType ? getTaskType : getTaskStatus;
  const deleteItemFn = isTaskType ? deleteTaskType : deleteTaskStatus;
  const updateItemFn = isTaskType ? updateTaskType : updateTaskStatus;

  // Fetch item details
  const {
    data: itemResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [itemQueryKey, itemId],
    queryFn: () => getItemFn(itemId),
    enabled: !!itemId && open,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.response,
  });

  const item = itemResponse?.data;

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: deleteItemFn,
    onSuccess: () => {
      toast.success(`${isTaskType ? 'Task Type' : 'Task Status'} deleted successfully!`);
      queryClient.invalidateQueries([queryKey]);
      onRefresh?.();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error?.message || `Failed to delete ${isTaskType ? 'task type' : 'task status'}`;
      toast.error(errorMessage);
    },
  });

  // Update item mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateItemFn(id, data),
    onSuccess: () => {
      toast.success(`${isTaskType ? 'Task Type' : 'Task Status'} updated successfully!`);
      queryClient.invalidateQueries([queryKey]);
      queryClient.invalidateQueries([itemQueryKey, itemId]);
      onRefresh?.();
      setEditDialogOpen(false);
    },
    onError: (error) => {
      const errorMessage = error?.message || `Failed to update ${isTaskType ? 'task type' : 'task status'}`;
      toast.error(errorMessage);
    },
  });

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(itemId);
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = (itemData) => {
    updateMutation.mutate({ id: itemId, data: itemData });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClose = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
          }
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Settings size={24} color="#7367F0" />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151' }}>
                {isTaskType ? 'Task Type' : 'Task Status'} Details
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {item?.is_editable && (
                <IconButton
                  onClick={handleEdit}
                  sx={{
                    color: '#7367F0',
                    '&:hover': { bgcolor: 'rgba(115, 103, 240, 0.1)' },
                  }}
                >
                  <Edit size={18} />
                </IconButton>
              )}
              {item?.is_deletable && (
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    color: '#dc2626',
                    '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)' },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              )}
              <IconButton onClick={handleClose}>
                <X size={18} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {isLoading ? (
            <Stack spacing={3}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
            </Stack>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error" variant="h6">
                Error loading details
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {error.message || 'Something went wrong'}
              </Typography>
            </Box>
          ) : !item ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6">
                {isTaskType ? 'Task Type' : 'Task Status'} not found
              </Typography>
            </Box>
          ) : (
            <Stack spacing={4}>
              {/* Basic Information */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, color: '#374151', fontWeight: 600 }}
                >
                  Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Hash size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          ID
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {item.id}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <FileText size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Name
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {item.name}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <FileText size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Description
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ color: '#374151', lineHeight: 1.6 }}
                      >
                        {item.description || 'No description provided'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Status Information */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, color: '#374151', fontWeight: 600 }}
                >
                  Status & Properties
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {item.is_active ? (
                          <CheckCircle size={20} color="#16a34a" />
                        ) : (
                          <XCircle size={20} color="#dc2626" />
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Status
                        </Typography>
                      </Box>
                      <Chip
                        label={item.is_active ? 'Active' : 'Inactive'}
                        color={item.is_active ? 'success' : 'error'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Edit size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Editable
                        </Typography>
                      </Box>
                      <Chip
                        label={item.is_editable ? 'Yes' : 'No'}
                        color={item.is_editable ? 'success' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Trash2 size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Deletable
                        </Typography>
                      </Box>
                      <Chip
                        label={item.is_deletable ? 'Yes' : 'No'}
                        color={item.is_deletable ? 'success' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Timestamps */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, color: '#374151', fontWeight: 600 }}
                >
                  Timestamps
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Calendar size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Created At
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ color: '#374151' }}
                      >
                        {formatDate(item.created_at)}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Calendar size={20} color="#7367F0" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Updated At
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ color: '#374151' }}
                      >
                        {formatDate(item.updated_at)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Information */}
              {(item.slug || item.root_slug || item.model_id || item.firm_id) && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, color: '#374151', fontWeight: 600 }}
                  >
                    Additional Information
                  </Typography>

                  <Grid container spacing={3}>
                    {item.slug && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Slug
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {item.slug}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {item.model_id && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Model ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {item.model_id}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {item.firm_id && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Firm ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {item.firm_id}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {item.root_slug && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Root Slug
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {item.root_slug}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {isTaskType ? (
        <CreateTaskTypeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
          editMode={true}
          editingTaskType={item}
        />
      ) : (
        <CreateTaskStatusDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
          editMode={true}
          editingTaskStatus={item}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Trash2 size={24} color="#dc2626" />
            <Typography variant="h6" sx={{ color: '#dc2626' }}>
              Delete {isTaskType ? 'Task Type' : 'Task Status'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, color: '#374151' }}>
            Are you sure you want to delete the {isTaskType ? 'task type' : 'task status'} "{item?.name}"? 
            This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : `Delete ${isTaskType ? 'Task Type' : 'Task Status'}`}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default TaskDetailDialog;