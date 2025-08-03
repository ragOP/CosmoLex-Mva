import { apiService } from '@/api/api_services';

export const getForm = async ({ slugId }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `v2/matter/form/show/${slugId}`,
    });

    return apiResponse;
  } catch (error) {
    console.error('Error fetching form data:', error);
  }
};
