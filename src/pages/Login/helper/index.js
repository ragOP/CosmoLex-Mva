import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/endpoint";

const postLogin = async (payload) => {
    const result = await apiService({
        endpoint: endpoints.login,
        method: "POST",
        data: payload
    });
    return result;
};

export default postLogin;