import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getUserEvents = async (userId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getEvents}/${userId}`,
      method: 'GET',
      params: { user_id: userId },
    });
    return response.response.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export default getUserEvents;
