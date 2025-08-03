import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const createForm = async ({ slug, formData }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.addForm}/${slug}`,
      method: 'POST',
      body: formData,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
