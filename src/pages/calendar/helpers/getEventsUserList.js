import {apiService} from "@/api/api_services";
import { endpoints } from "@/api/endpoint";

const getEventsUserList = async () => {
    try {
        const response = await apiService({
            endpoint: endpoints.getEvents,
            method: "GET",
        })
        return response.response.calendar_list || [];
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export default getEventsUserList;
