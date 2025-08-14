import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const createForm = async ({ slug, formData }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.addForm}/${slug}`,
      method: 'POST',
      data: formData,
    });

    return apiResponse?.response;
  } catch (error) {
    console.error(error);
  }
};
