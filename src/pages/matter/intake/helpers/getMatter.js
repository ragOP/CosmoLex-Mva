import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getMatter = async ({ slug }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.matterIntake}/${slug}`,
      method: 'GET',
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
        result.response?.message || 'Failed to fetch matter'
      );
      return null;
    }
  } catch (error) {
    console.error('Matter fetch error:', error);
    return null;
  }
};

export default getMatter;
