import { endpoints } from "@/api/endpoint";
import { apiService } from "@/api/api_services";

const getFormData = async () => {
  try {
    const result = await apiService({
      endpoint: endpoints.formData.replace('/', ''), // Remove leading slash as apiService adds it
      method: 'GET'
    });
    
    console.log('Form Data API Response:', result); // Debug log
    
    // Check if request was successful - API returns Apistatus: true for success
    if (result.response && (result.response.Apistatus === true || result.response.success === true)) {
      return result.response;
    } else {
      console.error('Form data API error:', result.response?.message || 'Failed to fetch form data');
      return null;
    }
  } catch (error) {
    console.error('Form data fetch error:', error);
    return null;
  }
};

export default getFormData;
