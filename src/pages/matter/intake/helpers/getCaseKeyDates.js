import { apiService } from '@/api/api_services';

const getCaseKeyDates = async (slugId) => {
  try {
    const result = await apiService({
      endpoint: `v2/matter/case-key-dates/show/${slugId}`,
      method: 'GET',
    });
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response.data || result.response;
    } else {
      console.error(
        'Get case key dates error:',
        result.response?.message || 'Failed to get case key dates'
      );
      return null;
    }
  } catch (error) {
    console.error('Get case key dates error:', error);
    return null;
  }
};

export default getCaseKeyDates; 