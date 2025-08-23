import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const updateTask = async ({ id, data }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.updateTask}/${id}`,
      method: 'PUT',
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
        'Tasks update error:',
        result.response?.message || 'Failed to update task'
      );
      return null;
    }
  } catch (error) {
    console.error('Tasks update error:', error);
    return null;
  }
};

export default updateTask;
