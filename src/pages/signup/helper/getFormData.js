import { endpoints } from "@/api/endpoint";
import { apiService } from "@/api/api_services";

const getFormData = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.formData.replace('/', ''), // Remove leading slash as apiService adds it
      method: 'GET'
    });
    return result.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getFormData;
