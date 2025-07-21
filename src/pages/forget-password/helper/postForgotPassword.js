import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const postForgotPassword = async (formData) => {
  const result = await apiService({
    endpoint: endpoints.forgotPassword,
    method: 'POST',
    data: formData,
  });
  return result;
};

export default postForgotPassword;
