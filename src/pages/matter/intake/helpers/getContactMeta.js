import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const getContactMeta = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.getContactMeta,
      method: 'GET',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      const {
        contact_type,
        prefix,
        gender,
        marital_status,
        address_type
    } = result.response;
      return {
        contact_type,
        prefix,
        gender,
        marital_status,
        address_type
      };
    } else {
      console.error(
        'Contact Meta API error:',
        result.response?.message || 'Failed to fetch Contact meta'
      );
      return null;
    }
  } catch (error) {
    console.error('Contact Meta fetch error:', error);
    return null;
  }
};

export default getContactMeta;
