import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getMatters = async (params = {}) => {
  try {
    const result = await apiService({
      endpoint: endpoints.getMatters,
      method: 'GET',
      params,
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response.data;
    } else {
      console.error(
        'Matter API error:',
        result.response?.message || 'Failed to fetch matters'
      );
      return null;
    }
  } catch (error) {
    console.error('Matter fetch error:', error);
    return null;
  }
};

export default getMatters;
