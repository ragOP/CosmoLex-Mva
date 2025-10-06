import React, { useMemo } from 'react';
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
import { getToken } from '@/utils/auth';

const TYPE_OPTIONS = [
  { value: 1, label: 'Google Graph' },
  { value: 2, label: 'Microsoft Graph' },
  { value: 3, label: 'SMTP' },
];

const defaultValues = {
  type: 1,
  email: '',
  token: '',
  display_name: '',
  role: '',
  password: '',
  smtp_host: '',
  smtp_port: '',
};

const CreateServiceDialog = ({ open, onClose, onSubmit, isLoading }) => {
  const { control, handleSubmit, watch, reset } = useForm({ defaultValues });
  const type = watch('type');

  const isSMTP = useMemo(() => Number(type) === 3, [type]);
  const isMicrosoft = useMemo(() => Number(type) === 2, [type]);

  const handleClose = () => {
    reset(defaultValues);
    onClose?.();
  };

  const submit = (values) => {
    const basePayload = {
      type: Number(values.type),
      email: values.email || null,
      display_name: values.display_name || null,
      role: values.role || null,
      password: isSMTP ? values.password || null : null,
      smtp_host: isSMTP ? values.smtp_host || null : null,
      smtp_port: isSMTP ? values.smtp_port || null : null,
    };

    // For Google/Microsoft (type 1/2), omit token field to avoid DB size issues;
    // Authorization header already carries JWT via interceptor.
    // For SMTP (type 3), explicitly send token as null.
    const payload =
      Number(values.type) === 3
        ? { ...basePayload, token: null }
        : { ...basePayload };

    onSubmit?.(payload, handleClose);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Service</DialogTitle>
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

          {/* Token field is intentionally hidden. Token is read from local storage during submit for type 1/2. */}

          {/* Display Name visible for all types */}
          <Controller
            name="display_name"
            control={control}
            render={({ field }) => (
              <TextField label="Display Name (optional)" {...field} />
            )}
          />

          {/* Role only relevant to Microsoft, keep optional and conditional */}
          {isMicrosoft && (
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField label="Role (optional)" {...field} />
              )}
            />
          )}

          {/* SMTP-specific fields */}
          {isSMTP && (
            <>
              <Controller
                name="password"
                control={control}
                rules={{
                  validate: (v) => !!v || 'Password is required for SMTP',
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="SMTP Password"
                    type="password"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                  />
                )}
              />
              <Controller
                name="smtp_host"
                control={control}
                rules={{
                  validate: (v) => !!v || 'SMTP host is required for SMTP',
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="SMTP Host"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                  />
                )}
              />
              <Controller
                name="smtp_port"
                control={control}
                rules={{
                  validate: (v) =>
                    (!!v && !isNaN(Number(v))) ||
                    'Valid SMTP port is required for SMTP',
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="SMTP Port"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || ''}
                  />
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

export default CreateServiceDialog;
