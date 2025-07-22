import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const createEvent = async (payload) => {
  try {
    const res = await apiService({
      endpoint: `${endpoints.createEvent}`,
      method: 'POST',
      data: payload,
    });

    if (res.success) {
      return res?.response?.event;
    } else {
      throw new Error(res?.response?.data?.message || 'Failed to create event');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createEvent;
