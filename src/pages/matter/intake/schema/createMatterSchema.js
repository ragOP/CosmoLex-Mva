import { z } from 'zod';
export const createMatterSchema = z.object({
  case_role: z.string().min(1, 'Case role is required'),
  case_type: z.string().min(1, 'Case type is required'),
  case_status: z.string().min(1, 'Case status is required'),
  marketing_source: z.string().min(1, 'Marketing source is required'),
  owner_id: z.string().min(1, 'Owner is required'),
  ad_campaign: z.string().min(1, 'Ad campaign is required'),
  case_description: z.string().min(1, 'Case description is required'),
  contacts_id: z.string().min(1, 'Contacts is required'),
  assignee_id: z.string().min(1, 'Assignee is required'),
});
