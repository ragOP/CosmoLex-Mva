import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getTask = async (id) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.getTask}/${id}`,
      method: 'GET',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response.task;
    } else {
      console.error(
        'Task API error:',
        result.response?.message || 'Failed to fetch task'
      );
      return null;
    }
  } catch (error) {
    console.error('Task fetch error:', error);
    return null;
  }
};

export default getTask;
