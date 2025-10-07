import React, { useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Button as MuiButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const TYPE_OPTIONS = [
  { value: 1, label: 'Google Graph' },
  { value: 2, label: 'Microsoft Graph' },
  { value: 3, label: 'SMTP' },
];

const defaultValues = {
  type: 1,
  email: '',
  display_name: '',
  role: '',
  password: '',
  smtp_host: '',
  smtp_port: '',
};

const UpdateServiceDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  service,
}) => {
  const { control, handleSubmit, watch, reset } = useForm({ defaultValues });
  const type = watch('type');

  const isSMTP = useMemo(() => Number(type) === 3, [type]);
  const isMicrosoft = useMemo(() => Number(type) === 2, [type]);

  useEffect(() => {
    if (service) {
      reset({
        type: Number(service.type) || 1,
        email: service.email || '',
        display_name: service.display_name || '',
        role: service.role || '',
        password: '',
        smtp_host: service.smtp_host || '',
        smtp_port: service.smtp_port || '',
      });
    } else {
      reset(defaultValues);
    }
  }, [service, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose?.();
  };

  const submit = (values) => {
    const payload = {
      type: Number(values.type),
      email: values.email || null,
      display_name: values.display_name || null,
      role: values.role || null,
      password: Number(values.type) === 3 ? values.password || null : null,
      smtp_host: Number(values.type) === 3 ? values.smtp_host || null : null,
      smtp_port: Number(values.type) === 3 ? values.smtp_port || null : null,
    };
    onSubmit?.(payload, handleClose);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Service</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField select label="Type" {...field}>
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error ? 'Email is required' : ''}
              />
            )}
          />

          <Controller
            name="display_name"
            control={control}
            render={({ field }) => (
              <TextField label="Display Name (optional)" {...field} />
            )}
          />

          {isMicrosoft && (
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField label="Role (optional)" {...field} />
              )}
            />
          )}

          {isSMTP && (
            <>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField label="SMTP Password" type="password" {...field} />
                )}
              />
              <Controller
                name="smtp_host"
                control={control}
                render={({ field }) => (
                  <TextField label="SMTP Host" {...field} />
                )}
              />
              <Controller
                name="smtp_port"
                control={control}
                render={({ field }) => (
                  <TextField label="SMTP Port" {...field} />
                )}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={handleClose} disabled={isLoading}>
          Cancel
        </MuiButton>
        <MuiButton
          onClick={handleSubmit(submit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateServiceDialog;
