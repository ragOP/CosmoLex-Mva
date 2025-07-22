import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getEvent = async (id) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getEvent}/${id}`,
      method: 'GET',
    });
    return response.response.event || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export default getEvent;
