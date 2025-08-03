import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const updateContact = async ({ id, data }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.updateContact}/${id}`,
      method: 'PUT',
      data,
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Contact update API error:',
        result.response?.message || 'Failed to update contact'
      );
      return null;
    }
  } catch (error) {
    console.error('Contact update error:', error);
    return null;
  }
};

export default updateContact;
