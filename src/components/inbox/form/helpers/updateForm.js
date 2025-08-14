import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const updateForm = async ({ slug, formData }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.updateForm}/${slug}`,
      method: 'PUT',
      data: formData,
    });

    return apiResponse?.response;
  } catch (error) {
    console.error(error);
  }
};
