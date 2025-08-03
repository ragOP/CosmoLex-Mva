import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getContacts = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.getContacts,
      method: 'GET',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response.data;
    } else {
      console.error(
        'Contacts API error:',
        result.response?.message || 'Failed to fetch contacts'
      );
      return null;
    }
  } catch (error) {
    console.error('Contacts fetch error:', error);
    return null;
  }
};

export default getContacts;
