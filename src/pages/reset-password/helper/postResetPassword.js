import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

const postResetPassword = async (formData) => {
  const result = await apiService({
    endpoint: endpoints.resetPassword,
    method: 'POST',
    data: formData,
  });
  return result;
};

export default postResetPassword;
