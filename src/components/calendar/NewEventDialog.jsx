import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomButton from '../CustomButton';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

const repeatOptions = ['never', 'daily', 'weekly', 'monthly', 'yearly'];

export default function NewEventDialogRHF({
  open = false,
  onClose = () => {},
  onSubmit = () => {},
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      category_id: '',
      all_day: false,
      priority: '',
      status: '',
      repeat: '',
      reminders: [],
      participants: [],
    },
  });

  const {
    fields: reminderFields,
    append: appendReminder,
    remove: removeReminder,
  } = useFieldArray({
    control,
    name: 'reminders',
  });

  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control,
    name: 'participants',
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data);
        })}
        className="bg-[#F5F5FA] rounded-lg w-full max-w-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-[0px_4px_24px_0px_#000000] no-scrollbar"
      >
        <h2 className="text-2xl text-[#40444D] text-center font-bold font-sans">
          Create New Event
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <Label>Title</Label>
            <Controller
              control={control}
              name="title"
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  className={`border ${errors.title ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  {...field}
                  className={`border ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Start Time</Label>
            <Controller
              control={control}
              name="start_time"
              rules={{ required: 'Start time is required' }}
              render={({ field }) => (
                <Input
                  type="datetime-local"
                  {...field}
                  className={`border ${
                    errors.start_time ? 'border-red-500' : ''
                  }`}
                />
              )}
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>End Time</Label>
            <Controller
              control={control}
              name="end_time"
              rules={{ required: 'End time is required' }}
              render={({ field }) => (
                <Input
                  type="datetime-local"
                  {...field}
                  className={`border ${
                    errors.end_time ? 'border-red-500' : ''
                  }`}
                />
              )}
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm">{errors.end_time.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Category ID</Label>
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  className={`border ${
                    errors.category_id ? 'border-red-500' : ''
                  }`}
                />
              )}
            />
            {errors.category_id && (
              <p className="text-red-500 text-sm">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>All Day</Label>
            <Controller
              control={control}
              name="all_day"
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select All Day Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={true}>True</SelectItem>
                      <SelectItem value={false}>False</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <Label>Repeat</Label>
            <Controller
              control={control}
              name="repeat"
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Repeat Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {repeatOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Priority</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status Option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Reminders Section */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-[#40444D]">Reminders</h3>
            <div
              onClick={() =>
                appendReminder({
                  type: 'sound',
                  timing: 'minutes_before',
                  value: 15,
                  relative_to: 'start',
                })
              }
              className="p-1 rounded-full cursor-pointer hover:bg-[#6366F1] hover:text-white transition-all duration-300 ease-in-out"
            >
              <Plus className="h-5 w-5" />
            </div>
          </div>

          {reminderFields.map((field, index) => (
            <div key={field.id} className="flex items-center justify-between">
              <div className="flex justify-around items-center gap-2">
                {/* Type */}
                <Controller
                  control={control}
                  name={`reminders.${index}.type`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="sound">Sound</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="popup">Popup</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Value */}
                <Input
                  type="number"
                  {...register(`reminders.${index}.value`)}
                  placeholder="Time"
                  min="1"
                />

                {/* Timing */}
                <Controller
                  control={control}
                  name={`reminders.${index}.timing`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="minutes_before">
                            Minutes Before
                          </SelectItem>
                          <SelectItem value="hours_before">
                            Hours Before
                          </SelectItem>
                          <SelectItem value="days_before">
                            Days Before
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Relative To */}
                <Controller
                  control={control}
                  name={`reminders.${index}.relative_to`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Relative To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Remove */}
              <div className="flex items-center justify-end w-20 ">
                <Trash2
                  onClick={() => removeReminder(index)}
                  className="text-[#6366F1] hover:text-red-500 transition-all duration-300 ease-in-out h-5 w-5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Participants Section */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-[#40444D]">
              Participants
            </h3>
            <div
              onClick={() =>
                appendParticipant({
                  email: '',
                  role: '',
                  status: 'pending',
                  comment: '',
                })
              }
              className="p-1 rounded-full cursor-pointer hover:bg-[#6366F1] hover:text-white transition-all duration-300 ease-in-out"
            >
              <Plus className="h-5 w-5" />
            </div>
          </div>

          {participantFields.map((field, index) => (
            <div key={field.id} className="flex items-center justify-between">
              <div className="flex items-center justify-between gap-2">
                <Controller
                  control={control}
                  name={`participants.${index}.email`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Email" />
                  )}
                />
                <Controller
                  control={control}
                  name={`participants.${index}.role`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Role" />
                  )}
                />

                {/* Status Dropdown */}
                <Controller
                  control={control}
                  name={`participants.${index}.status`}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Input
                  {...register(`participants.${index}.comment`)}
                  placeholder="Comment"
                />
              </div>
              {/* Remove */}
              <div className="flex items-center justify-end w-20 ">
                <Trash2
                  onClick={() => removeParticipant(index)}
                  className="text-[#6366F1] hover:text-red-500 transition-all duration-300 ease-in-out h-5 w-5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6366F1] text-white hover:bg-[#4e5564] cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
