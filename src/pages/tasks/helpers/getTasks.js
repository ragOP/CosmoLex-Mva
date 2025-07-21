import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getTasks = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.getTasks,
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
        'Tasks API error:',
        result.response?.message || 'Failed to fetch tasks'
      );
      return null;
    }
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return null;
  }
};

export default getTasks;
