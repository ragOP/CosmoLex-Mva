import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, IconButton, Stack } from '@mui/material';
import { X } from 'lucide-react';

// Participant Dialog Component
export const ParticipantDialog = ({
  open,
  onClose,
  onSubmit,
  editingParticipant,
  eventsMeta,
}) => {
  /**
   *       "user_id": 1,
      "role_id": 1,
      "status_id": 34,
      "comment": "Main speaker"
   */
  const [validationErrors, setValidationErrors] = useState({});
  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      user_id: '',
      role_id: '',
      status_id: '',
      comment: '',
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!getValues('user_id')) {
      errors.user_id = 'User is required';
    }
    return errors;
  };

  useEffect(() => {
    if (editingParticipant) {
      reset(editingParticipant);
    } else {
      reset({
        user_id: '',
        role_id: '',
        status_id: '',
        comment: '',
      });
    }
  }, [editingParticipant, reset]);

  const handleFormSubmit = () => {
    const errors = validateForm();
    console.log('errors >>>', errors);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const data = getValues();
    console.log('data >>>', data);

    onSubmit(data);
    reset();
  };

  console.log('validationErrors from participant >>>', validationErrors);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form>
        <Stack className="bg-[#F5F5FA] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-center">
              {editingParticipant ? 'Edit Participant' : 'Add Participant'}
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                User *
              </Label>
              <Controller
                control={control}
                name="user_id"
                rules={{ required: 'User is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Email" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.participants_email || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.email}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.user_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.user_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Role *
              </Label>
              <Controller
                control={control}
                name="role_id"
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.participants_roles || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.role_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.role_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Status *
              </Label>
              <Controller
                control={control}
                name="status_id"
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      portal={false}
                      className="z-[9999]"
                    >
                      <SelectGroup>
                        {(eventsMeta?.event_participants_status || []).map(
                          (option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {validationErrors.status_id && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.status_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label className="text-[#40444D] font-semibold mb-2">
                Comment
              </Label>
              <Controller
                control={control}
                name="comment"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter comment"
                    className="w-full bg-white"
                  />
                )}
              />
              {validationErrors.comment && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.comment}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleFormSubmit}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
            >
              {editingParticipant ? 'Update Participant' : 'Save Participant'}
            </Button>
          </div>
        </Stack>
      </form>
    </Dialog>
  );
};
