import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/endpoint";

const postVerification = async (formData) => {
  const result = await apiService({
    endpoint: endpoints.resendVerification,
    method: "POST",
    data: formData,
  });
  return result;
};

export default postVerification;