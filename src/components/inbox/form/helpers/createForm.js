import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

export const createForm = async ({ slug, formData }) => {
  try {
    console.log(">>", formData)
    const apiResponse = await apiService({
      endpoint: `${endpoints.addForm}/${slug}`,
      method: 'POST',
      data: formData,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
