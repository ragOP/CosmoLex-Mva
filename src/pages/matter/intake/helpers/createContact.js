import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const createContact = async ({ data }) => {
  console.log(data);
  try {
    const result = await apiService({
      endpoint: endpoints.createContact,
      method: 'POST',
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
        'Contact API error:',
        result.response?.message || 'Failed to create contact'
      );
      throw new Error(
        'Contact API error:',
        result.response?.message || 'Failed to create contact'
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createContact;
