import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/endpoint";

const postSignup = async (formData) => {
  const result = await apiService({
    endpoint: endpoints.firmRegister,
    method: "POST",
    data: formData,
  });
  return result;
};

export default postSignup;
