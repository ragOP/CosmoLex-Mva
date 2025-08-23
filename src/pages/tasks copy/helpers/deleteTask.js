import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const deleteTask = async ({ id }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.deleteTask}/${id}`,
      method: 'DELETE',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Tasks delete error:',
        result.response?.message || 'Failed to delete task'
      );
      return null;
    }
  } catch (error) {
    console.error('Tasks delete error:', error);
    return null;
  }
};

export default deleteTask;
