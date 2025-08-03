import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const storeCaseKeyDates = async (slugId, data) => {
  try {
    const result = await apiService({
      endpoint: `${endpoints.storeCaseKeyDates}/${slugId}`,
      method: 'POST',
      data,
    });
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Store case key dates error:',
        result.response?.message || 'Failed to store case key dates'
      );
      return null;
    }
  } catch (error) {
    console.error('Store case key dates error:', error);
    return null;
  }
};

export default storeCaseKeyDates; 