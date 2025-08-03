import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const deleteContact = async ({ id }) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.deleteContact}/${id}`,
      method: 'DELETE',
    });

    // Check if request was successful - API returns Apistatus: true for success
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Contact delete API error:',
        result.response?.message || 'Failed to delete contact'
      );
      return null;
    }
  } catch (error) {
    console.error('Contact delete error:', error);
    return null;
  }
};

export default deleteContact;
