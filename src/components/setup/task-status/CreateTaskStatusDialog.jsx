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
import { X, FileText } from 'lucide-react';
import { toast } from 'sonner';

const CreateTaskStatusDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  editMode = false,
  editingTaskStatus = null,
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
      if (editMode && editingTaskStatus) {
        // Populate form with editing data
        reset({
          name: editingTaskStatus.name || '',
          description: editingTaskStatus.description || '',
          is_active: editingTaskStatus.is_active ?? true,
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
  }, [open, editMode, editingTaskStatus, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Error submitting task status:', error);
      toast.error('Failed to save task status. Please try again.');
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
            <FileText className="h-5 w-5 text-[#6366F1]" />
            <Typography variant="h6" component="div" fontWeight="600">
              {editMode ? 'Edit Task Status' : 'Create New Task Status'}
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
        <form onSubmit={handleSubmit(handleFormSubmit)} id="task-status-form">
          <Stack spacing={3}>
            {/* Task Status Name */}
            <Box>
              <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                Task Status Name *
              </Label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Task status name is required',
                  minLength: {
                    value: 2,
                    message: 'Task status name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Task status name must not exceed 100 characters',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter task status name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </Box>

            {/* Description */}
            <Box>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{
                  maxLength: {
                    value: 500,
                    message: 'Description must not exceed 500 characters',
                  },
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Enter task status description (optional)"
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.description && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.description.message}
                </FormHelperText>
              )}
            </Box>

            {/* Active Status */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend" className="text-sm font-medium mb-2">
                  Status
                </FormLabel>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="is_active"
                      />
                      <Label htmlFor="is_active" className="text-sm">
                        Active (Task status will be available for use)
                      </Label>
                    </Box>
                  )}
                />
              </FormControl>
            </Box>
          </Stack>
        </form>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isLoading || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="task-status-form"
          disabled={isLoading || isSubmitting}
          className="bg-[#6366F1] hover:bg-[#5855EB]"
        >
          {isLoading || isSubmitting
            ? editMode
              ? 'Updating...'
              : 'Creating...'
            : editMode
            ? 'Update Task Status'
            : 'Create Task Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskStatusDialog;