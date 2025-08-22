import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const createContact = async ({ data }) => {
  try {
    const { response } = await apiService({
      endpoint: endpoints.createContact,
      method: 'POST',
      data,
    });

    // Normalize API success flag
    const isSuccess =
      response?.Apistatus === true || response?.success === true;

    if (!isSuccess) {
      throw new Error(response?.message || 'Failed to create contact');
    }

    return response;
  } catch (error) {
    console.error('Create contact error:', error);
    throw error instanceof Error ? error : new Error('Unexpected error');
  }
};

export default createContact;
