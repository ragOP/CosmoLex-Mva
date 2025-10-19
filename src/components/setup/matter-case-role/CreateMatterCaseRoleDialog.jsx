import React, { useEffect } from 'react';
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
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
} from '@mui/material';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X, User } from 'lucide-react';
import { toast } from 'sonner';

const CreateMatterCaseRoleDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  editMode = false,
  editingMatterCaseRole = null,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  // Reset all states when dialog opens or populate with editing data
  useEffect(() => {
    if (open) {
      if (editMode && editingMatterCaseRole) {
        // Populate form with editing data
        reset({
          name: editingMatterCaseRole.name || '',
          description: editingMatterCaseRole.description || '',
          is_active: editingMatterCaseRole.is_active ?? true,
        });
      } else {
        // Reset to default values
        reset({
          name: '',
          description: '',
          is_active: true,
        });
      }
    }
  }, [open, editMode, editingMatterCaseRole, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Error submitting matter case role:', error);
      toast.error('Failed to save matter case role. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <User className="h-5 w-5 text-[#6366F1]" />
            <Typography variant="h6" component="div" fontWeight="600">
              {editMode
                ? 'Edit Matter Case Role'
                : 'Create New Matter Case Role'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'grey.500',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <X className="h-4 w-4" />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          id="matter-case-role-form"
        >
          <Stack spacing={3}>
            {/* Matter Case Role Name */}
            <Box>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Matter Case Role Name *
              </Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Matter case role name is required',
                  minLength: {
                    value: 2,
                    message:
                      'Matter case role name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 100,
                    message:
                      'Matter case role name must not exceed 100 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter matter case role name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText error>{errors.name.message}</FormHelperText>
              )}
            </Box>

            {/* Description */}
            <Box>
              <Label
                htmlFor="description"
                className="text-sm font-medium mb-2 block"
              >
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Enter description"
                    className="min-h-[100px]"
                  />
                )}
              />
            </Box>

            {/* Active Status */}
            <Box className="flex items-center space-x-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </Label>
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outline"
          onClick={handleClose}
          className="mr-2"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" form="matter-case-role-form" disabled={isLoading}>
          {editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMatterCaseRoleDialog;
