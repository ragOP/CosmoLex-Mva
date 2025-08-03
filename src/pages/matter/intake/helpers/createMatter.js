import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const createMatter = async ({ data }) => {
  console.log(data);
  try {
    const result = await apiService({
      endpoint: endpoints.matterIntake,
      method: 'POST',
      data,
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Matter API error:',
        result.response?.message || 'Failed to create matter'
      );
      return null;
    }
  } catch (error) {
    console.error('Matter create error:', error);
    return null;
  }
};

export default createMatter;
