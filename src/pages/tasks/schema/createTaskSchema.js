import { z } from 'zod';
import { format } from 'date-fns';

// Helper to compare today’s date
const today = format(new Date(), 'yyyy-MM-dd');

export const taskSchema = z.object({
  type_id: z.string().min(1, 'Task type is required'),
  subject: z.string().min(1, 'Subject is required'),
  priority_id: z.string().min(1, 'Priority is required'),
  status_id: z.string().min(1, 'Status is required'),
  due_date: z.string().refine(
    (val) => {
      const date = val.length > 0 ? format(new Date(val), 'yyyy-MM-dd') : '';
      return date >= today;
    },
    {
      message: 'The due date must be a date after or equal to today.',
    }
  ),
});
