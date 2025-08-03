import { apiService } from '@/api/api_services';

const updateCaseKeyDates = async (slugId, data) => {
  try {
    const result = await apiService({
      endpoint: `v2/matter/case-key-dates/update/${slugId}`,
      method: 'PUT',
      data,
    });
    if (
      result.response &&
      (result.response.Apistatus === true || result.response.success === true)
    ) {
      return result.response;
    } else {
      console.error(
        'Update case key dates error:',
        result.response?.message || 'Failed to update case key dates'
      );
      return null;
    }
  } catch (error) {
    console.error('Update case key dates error:', error);
    return null;
  }
};

export default updateCaseKeyDates; 