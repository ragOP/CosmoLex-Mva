import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getContact = async ({ slug }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.getContact}/${slug}`,
      method: 'GET',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Contact API error:',
        result.response?.message || 'Failed to fetch contact'
      );
      return null;
    }
  } catch (error) {
    console.error('Contacts fetch error:', error);
    return null;
  }
};

export default getContact;
