import { z } from 'zod';
export const createMatterSchema = z.object({
  case_type_id: z.number().nullable().refine((val) => val !== null, {
    message: 'Case type is required',
  }),
  marketing_source_id: z.number().nullable().refine((val) => val !== null, {
    message: 'Marketing source is required',
  }),
  contact_id: z.number().nullable().refine((val) => val !== null, {
    message: 'Contact is required',
  }),
});
