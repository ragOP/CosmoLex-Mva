import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const createTask = async (data) => {
  try {
    const result = await apiService({
      endpoint: endpoints.createTask,
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
        'Tasks create error:',
        result.response?.message || 'Failed to create task'
      );
      return null;
    }
  } catch (error) {
    console.error('Tasks create error:', error);
    return null;
  }
};

export default createTask;
