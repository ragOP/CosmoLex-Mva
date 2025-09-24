import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Stack,
  Divider,
  IconButton,
  Box,
  Typography,
  Chip,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Paper,
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Search, Shield, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '@/api/api_services/setup';
import { toast } from 'sonner';

const CreateRoleDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  editMode = false,
  editingRole = null,
}) => {
  const {
    control,
    // register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      permissions: [],
    },
  });

  // Fetch permissions data
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    enabled: open,
    select: (data) => data?.response || [],
  });

  const permissions = permissionsData?.data || [];

  // Search state for permissions
  const [permissionSearch, setPermissionSearch] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Filtered permissions based on search term
  const filteredPermissions = permissions.filter((permission) =>
    permission.name?.toLowerCase().includes(permissionSearch.toLowerCase())
  );

  // Group permissions by category (based on permission name prefix)
  const groupedPermissions = filteredPermissions.reduce(
    (groups, permission) => {
      const category = permission.name.split('.')[0] || 'general';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    },
    {}
  );

  // Reset all states when dialog opens or populate with editing data
  useEffect(() => {
    if (open) {
      if (editMode && editingRole) {
        // Populate form with editing data
        reset({
          name: editingRole.name,
          permissions: editingRole.permissions?.map((p) => p.id) || [],
        });
        setSelectedPermissions(editingRole.permissions?.map((p) => p.id) || []);
      } else {
        // Reset to default values
        reset({
          name: '',
          permissions: [],
        });
        setSelectedPermissions([]);
        setPermissionSearch('');
      }
    }
  }, [open, editMode, editingRole, reset]);

  const onFormSubmit = async (data) => {
    // Prevent multiple submissions
    if (isLoading || isSubmitting) {
      return;
    }

    try {
      const payload = {
        name: data.name,
        permissions: selectedPermissions,
      };

      await onSubmit(payload);

      // Reset form and close dialog on success
      reset();
      setSelectedPermissions([]);
      setPermissionSearch('');
      onClose();
    } catch (error) {
      console.error('Error submitting role:', error);
      toast.error(error.message || 'An error occurred while saving the role');
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) => {
      const newSelected = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];

      setValue('permissions', newSelected);
      return newSelected;
    });
  };

  const handleSelectAllInCategory = (categoryPermissions) => {
    const categoryIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      // Deselect all in category
      setSelectedPermissions((prev) =>
        prev.filter((id) => !categoryIds.includes(id))
      );
    } else {
      // Select all in category
      setSelectedPermissions((prev) => {
        const newSelected = [...prev];
        categoryIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  const handleClose = () => {
    reset();
    setSelectedPermissions([]);
    setPermissionSearch('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ p: 2, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield size={24} />
            <DialogTitle sx={{ p: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              {editMode ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Scrollable Content */}
      <DialogContent
        sx={{
          p: 3,
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <form
          noValidate
          onSubmit={handleSubmit(onFormSubmit)}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Stack spacing={3} sx={{ flex: 1 }}>
            {/* Role Name */}
            <Box>
              <Label htmlFor="name">Role Name *</Label>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: 'Role name is required',
                  minLength: {
                    value: 2,
                    message: 'Role name must be at least 2 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter role name"
                    disabled={isLoading}
                    className={`w-full ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </Box>

            {/* Permissions Section */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Users size={20} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Permissions
                </Typography>
                <Chip
                  label={`${selectedPermissions.length} selected`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>

              {/* Permission Search */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                  }}
                />
                <Input
                  placeholder="Search permissions..."
                  value={permissionSearch}
                  onChange={(e) => setPermissionSearch(e.target.value)}
                  sx={{ pl: 5 }}
                />
              </Box>

              {/* Permissions List - No internal scrolling, let parent handle it */}
              {permissionsLoading ? (
                <Typography>Loading permissions...</Typography>
              ) : (
                <Box sx={{ flex: 1 }}>
                  {Object.entries(groupedPermissions).map(
                    ([category, categoryPermissions]) => (
                      <Paper key={category} sx={{ mb: 2, p: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {category}
                          </Typography>
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleSelectAllInCategory(categoryPermissions)
                            }
                          >
                            {categoryPermissions.every((p) =>
                              selectedPermissions.includes(p.id)
                            )
                              ? 'Deselect All'
                              : 'Select All'}
                          </Button>
                        </Box>
                        <Grid container spacing={1}>
                          {categoryPermissions.map((permission) => (
                            <Grid item xs={12} sm={6} key={permission.id}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Checkbox
                                  checked={selectedPermissions.includes(
                                    permission.id
                                  )}
                                  onCheckedChange={() =>
                                    handlePermissionToggle(permission.id)
                                  }
                                />
                                <Typography variant="body2">
                                  {permission.name}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    )
                  )}
                </Box>
              )}

              {filteredPermissions.length === 0 && !permissionsLoading && (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 2 }}
                >
                  No permissions found
                </Typography>
              )}
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Fixed Footer */}
      <DialogActions sx={{ p: 2, flexShrink: 0 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleClose}
          disabled={isLoading || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isLoading || isSubmitting}
          loading={isLoading || isSubmitting}
        >
          {editMode ? 'Update Role' : 'Create Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoleDialog;
