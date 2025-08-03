import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const searchContact = async ({ data }) => {
  console.log(data);
  try {
    const result = await apiService({
      endpoint: endpoints.searchContact,
      method: 'POST',
      data,
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response.data;
    } else {
      console.error(
        'Contact search API error:',
        result.response?.message || 'Failed to search contact'
      );
      return null;
    }
  } catch (error) {
    console.error('Contact search error:', error);
    return null;
  }
};

export default searchContact;
