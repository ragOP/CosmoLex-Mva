import { z } from 'zod';
export const createMatterSchema = z.object({
  case_role_id: z.number().min(1, 'Case role is required'),
  case_type_id: z.number().min(1, 'Case type is required'),
  case_status_id: z.number().min(1, 'Case status is required'),
  marketing_source_id: z.number().min(1, 'Marketing source is required'),
  owner_id: z.number().min(1, 'Owner is required'),
  ad_campaign_id: z.number().min(1, 'Ad campaign is required'),
  case_description: z.string().min(1, 'Case description is required'),
  contact_id: z.number().min(1, 'Contacts is required'),
  assignee_id: z.number().min(1, 'Assignee is required'),
});
