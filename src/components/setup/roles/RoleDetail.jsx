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
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Shield,
  Users,
  Edit,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import { getRole, deleteRole, updateRole } from '@/api/api_services/setup';
import { toast } from 'sonner';
import CreateRoleDialog from './CreateRoleDialog';
import { Button } from '@/components/ui/button';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const RoleDetail = ({ roleId, onBack }) => {
  // Permission checks
  const { hasPermission } = usePermission();
  const canShowRole = hasPermission('roles.show');
  const canUpdateRole = hasPermission('roles.update');
  const canDeleteRole = hasPermission('roles.delete');
  const canManagePermissions = hasPermission('roles.permissions.manage');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch role details
  const {
    data: roleResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.response,
  });

  const role = roleResponse?.data;

  // Delete role mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success('Role deleted successfully!');
      queryClient.invalidateQueries(['roles']);
      onBack();
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete role';
      toast.error(errorMessage);
    },
  });

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: () => {
      toast.success('Role updated successfully!');
      queryClient.invalidateQueries(['roles']);
      queryClient.invalidateQueries(['role', roleId]);
      setEditDialogOpen(false);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update role';
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
    deleteMutation.mutate(roleId);
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = (roleData) => {
    updateMutation.mutate({ id: roleId, data: roleData });
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

  if (isLoading) {
    return (
      <div className="px-4">
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="70%" />
          </Stack>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4">
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography color="error" variant="h6">
            Error loading role details
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {error.message || 'Something went wrong'}
          </Typography>
          <Button onClick={onBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="px-4">
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Role not found</Typography>
          <Button onClick={onBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <PermissionGuard
      permission="roles.show"
      fallback={
        <div className="px-4">
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="error">
              You don't have permission to view role details.
            </Typography>
          </Box>
        </div>
      }
    >
      <div className="px-4">
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={onBack} size="small">
                <ArrowLeft size={20} />
              </IconButton>
              <Shield size={24} color="#7367F0" />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: '#374151' }}
              >
                Role Details
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <PermissionGuard permission="roles.update">
                <IconButton
                  onClick={handleEdit}
                  sx={{
                    color: '#7367F0',
                    '&:hover': { bgcolor: 'rgba(115, 103, 240, 0.1)' },
                  }}
                >
                  <Edit size={18} />
                </IconButton>
              </PermissionGuard>
              <PermissionGuard permission="roles.delete">
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    color: '#dc2626',
                    '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)' },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </PermissionGuard>
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              px: 4,
              py: 2,
              maxHeight: '70vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f5f9',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: '4px',
                '&:hover': {
                  background: '#94a3b8',
                },
              },
            }}
          >
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
                        <User size={20} color="#7367F0" />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Role Name
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {role.name}
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
                        <Users size={20} color="#7367F0" />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Permissions Count
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {role.permissions?.length || 0} permissions
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
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Created At
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {formatDate(role.created_at)}
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
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          Last Updated
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: '#374151' }}
                      >
                        {formatDate(role.updated_at)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Permissions */}
              <Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}
                >
                  <Users size={20} color="#7367F0" />
                  <Typography
                    variant="h6"
                    sx={{ color: '#374151', fontWeight: 600 }}
                  >
                    Permissions
                  </Typography>
                  <Chip
                    label={`${role.permissions?.length || 0} total`}
                    size="small"
                    sx={{
                      bgcolor: '#e0e7ff',
                      color: '#3730a3',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                {role.permissions && role.permissions.length > 0 ? (
                  <Box>
                    {/* Group permissions by category */}
                    {(() => {
                      const groupedPermissions = role.permissions.reduce(
                        (groups, permission) => {
                          const category =
                            permission.name.split('.')[0] || 'general';
                          if (!groups[category]) {
                            groups[category] = [];
                          }
                          groups[category].push(permission);
                          return groups;
                        },
                        {}
                      );

                      return Object.entries(groupedPermissions).map(
                        ([category, permissions]) => (
                          <Paper
                            key={category}
                            sx={{ mb: 3, p: 3, border: '1px solid #e2e8f0' }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                color: '#374151',
                                mb: 2,
                              }}
                            >
                              {category} ({permissions.length})
                            </Typography>
                            <Grid container spacing={2}>
                              {permissions.map((permission) => (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={4}
                                  key={permission.id}
                                >
                                  <Chip
                                    label={permission.name}
                                    size="small"
                                    sx={{
                                      bgcolor: '#dcfce7',
                                      color: '#166534',
                                      fontWeight: 500,
                                      width: '100%',
                                      justifyContent: 'flex-start',
                                      '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      },
                                    }}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </Paper>
                        )
                      );
                    })()}
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <Users
                      size={48}
                      color="#94a3b8"
                      style={{ marginBottom: 16 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      No permissions assigned to this role
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Edit Role Dialog */}
        <CreateRoleDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
          editMode={true}
          editingRole={role}
        />

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
                Delete Role
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, color: '#374151' }}>
              Are you sure you want to delete the role "{role?.name}"? This
              action cannot be undone and may affect users who have this role
              assigned.
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
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Role'}
              </Button>
            </Box>
          </Box>
        </Dialog>
      </div>
    </PermissionGuard>
  );
};

export default RoleDetail;
