import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
  Grid,
  Skeleton,
} from '@mui/material';
import {
  Grid3X3,
  List,
  Plus,
  Shield,
  Users,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getRoles, createRole, updateRole } from '@/api/api_services/setup';
import { toast } from 'sonner';
import CreateRoleDialog from './CreateRoleDialog';
import RoleDetail from './RoleDetail';

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch roles
  const {
    data: rolesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    select: (data) => data.response,
  });

  const roles = Array.isArray(rolesResponse?.data) ? rolesResponse.data : [];

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      setCreateDialogOpen(false);
      queryClient.invalidateQueries(['roles']);
      toast.success('Role created successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to create role';
      toast.error(errorMessage);
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: () => {
      setEditDialogOpen(false);
      setSelectedRole(null);
      queryClient.invalidateQueries(['roles']);
      toast.success('Role updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update role';
      toast.error(errorMessage);
    },
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handlers
  const handleCreateRole = () => {
    setCreateDialogOpen(true);
  };



  const handleViewRole = (role) => {
    setSelectedRole(role);
    setDetailView(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateSuccess = async (roleData) => {
    await createRoleMutation.mutateAsync(roleData);
  };

  const handleUpdateSuccess = async (roleData) => {
    await updateRoleMutation.mutateAsync({ id: selectedRole.id, data: roleData });
  };

  const handleDeleteSuccess = () => {
    setDetailView(false);
    setSelectedRole(null);
    queryClient.invalidateQueries(['roles']);
    toast.success('Role deleted successfully!');
  };

  // Loading skeleton components
  const RoleCardSkeleton = () => (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 3,
        boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton
            variant="rectangular"
            width={48}
            height={48}
            sx={{ borderRadius: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" height={16} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const RoleListItemSkeleton = () => (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        boxShadow: '0 2px 12px 0px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        mb: 1,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={40}
            sx={{ borderRadius: 1.5 }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const RoleCard = ({ role }) => (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 3,
        boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px 0px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={() => handleViewRole(role)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Shield size={24} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {role.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Users size={16} />
                <Typography variant="body2" color="text.secondary">
                  Role ID: {role.id}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  const RoleListItem = ({ role }) => (
    <Card
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        boxShadow: '0 2px 12px 0px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        mb: 1,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 20px 0px rgba(0, 0, 0, 0.12)',
        },
      }}
      onClick={() => handleViewRole(role)}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Shield size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {role.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role ID: {role.id}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  if (detailView && selectedRole) {
    return (
      <RoleDetail
        roleId={selectedRole.id}
        onBack={() => {
          setDetailView(false);
          setSelectedRole(null);
        }}
        onUpdateSuccess={handleUpdateSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <Box sx={{ px: 3, py: 2 }}>
        {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Roles Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles and permissions
          </Typography>
        </Box>
        <Box>
          <button
            onClick={handleCreateRole}
            className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} style={{ marginRight: 8 }} />
            Add Role
          </button>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                bgcolor:
                  viewMode === 'grid'
                    ? 'primary.main'
                    : 'rgba(255, 255, 255, 0.8)',
                color: viewMode === 'grid' ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor:
                    viewMode === 'grid'
                      ? 'primary.dark'
                      : 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <Grid3X3 size={20} />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              sx={{
                bgcolor:
                  viewMode === 'list'
                    ? 'primary.main'
                    : 'rgba(255, 255, 255, 0.8)',
                color: viewMode === 'list' ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor:
                    viewMode === 'list'
                      ? 'primary.dark'
                      : 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <List size={20} />
            </IconButton>
            <IconButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                '&:disabled': { 
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  color: 'rgba(0, 0, 0, 0.3)'
                },
              }}
            >
              <RotateCcw 
                size={20} 
                style={{ 
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  transformOrigin: 'center'
                }} 
              />
            </IconButton>
          </Stack>
        </Box>
      </Stack>

      {/* Content */}
      {isLoading || isRefreshing ? (
        viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <RoleCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {[...Array(6)].map((_, index) => (
              <RoleListItemSkeleton key={index} />
            ))}
          </Box>
        )
      ) : error ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Failed to load roles
          </Typography>
          <Button onClick={handleRefresh} variant="outlined">
            Try Again
          </Button>
        </Box>
      ) : filteredRoles.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 3,
          }}
        >
          <Shield size={48} style={{ color: '#ccc', marginBottom: 16 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            {searchTerm ? 'No roles found' : 'No roles yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first role'}
          </Typography>
          {!searchTerm && (
            <Button onClick={handleCreateRole} variant="contained">
              <Plus size={20} style={{ marginRight: 8 }} />
              Create Role
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredRoles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <RoleCard role={role} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          {filteredRoles.map((role) => (
            <RoleListItem key={role.id} role={role} />
          ))}
        </Box>
      )}



      {/* Dialogs */}
      <CreateRoleDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSuccess}
        isLoading={createRoleMutation.isPending}
      />

      <CreateRoleDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedRole(null);
        }}
        onSubmit={handleUpdateSuccess}
        editMode={true}
        editingRole={selectedRole}
        isLoading={updateRoleMutation.isPending}
      />
      </Box>
    </>
  );
};

export default RolesPage;
