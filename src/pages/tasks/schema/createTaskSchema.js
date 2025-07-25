import { z } from 'zod';
import { format } from 'date-fns';

// Helper to compare today’s date
const today = format(new Date(), 'yyyy-MM-dd');

export const taskSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  task_type: z.string().min(1, 'Task type is required'),
  subject: z.string().min(1, 'Subject is required'),
  priority: z.string().min(1, 'Priority is required'),
  status: z.string().min(1, 'Status is required'),
  due_date: z.string().refine(
    (val) => {
      const date = val.length > 0 ? format(new Date(val), 'yyyy-MM-dd') : '';
      return date >= today;
    },
    {
      message: 'The due date must be a date after or equal to today.',
    }
  ),
  // assigned_to: z.array(z.string()).min(1, "At least one assignee is required."),
  reminders: z
    .array(
      z.object({
        scheduled_at: z.string().min(1, 'Scheduled date is required.'),
      })
    )
    .optional()
    .refine(
      (reminders) =>
        !reminders ||
        reminders.every((r) => r.scheduled_at && r.scheduled_at.trim() !== ''),
      {
        message:
          'The reminders.0.scheduled_at field is required when reminders is present.',
        path: ['reminders.0.scheduled_at'],
      }
    ),
  assigned_to: z.array(z.number()).min(1, 'At least one assignee is required.'),
});
