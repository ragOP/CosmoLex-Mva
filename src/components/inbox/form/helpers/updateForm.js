import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const updateForm = async ({ slug, formData }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.addForm}/${slug}`,
      method: 'PUT',
      body: formData,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
