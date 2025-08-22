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
import {
  Dialog,
  Divider,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Chip,
} from '@mui/material';
import { Trash2, Plus, X, Edit, Loader2, Paperclip } from 'lucide-react';
import { useEvents } from '@/components/calendar/hooks/useEvent';
import { toast } from 'sonner';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import SearchDialog from '@/components/dialogs/SearchDialog';
import { searchTask } from '@/api/api_services/task';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

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
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      user_id: '',
      role_id: '',
      status_id: '',
      comment: '',
    },
  });

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

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              type="submit"
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
