import { z } from 'zod';
import { format } from 'date-fns';

// Helper to compare today’s date
const today = format(new Date(), 'yyyy-MM-dd');

export const taskSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  due_date: z.string().refine(
    (val) => {
      console.log(val);
      const date = format(new Date(val), 'yyyy-MM-dd');
      console.log(date);
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
});
