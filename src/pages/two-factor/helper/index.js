import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/endpoint";

const postTwoFactor = async (payload) => {
    const result = await apiService({
        endpoint: endpoints.verifyOtp,
        method: "POST",
        data: payload
    });
    return result;
};

export default postTwoFactor;