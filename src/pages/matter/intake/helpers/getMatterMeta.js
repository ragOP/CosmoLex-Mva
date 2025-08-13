import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getMatterMeta = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.getMatterMeta,
      method: 'GET',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      const {
        case_role,
        case_type,
        case_status,
        marketing_source,
        ad_campaign_id,
        assignees,
        owners,
      } = result.response;
      return {
        case_role,
        case_type,
        case_status,
        marketing_source,
        ad_campaign_id,
        assignees,
        owners,
      };
    } else {
      console.error(
        'Matter Meta API error:',
        result.response?.message || 'Failed to fetch matter meta'
      );
      return null;
    }
  } catch (error) {
    console.error('Matter Meta fetch error:', error);
    return null;
  }
};

export default getMatterMeta;
