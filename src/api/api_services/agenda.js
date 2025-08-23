import { apiService } from './index';

// Get Agenda Data
export const getAgenda = async () => {
  try {
    const response = await apiService({
      endpoint: 'v2/agenda',
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching agenda:', error);
    throw error;
  }
}; 