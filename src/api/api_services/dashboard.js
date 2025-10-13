import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get Dashboard Summary
export const getDashboardSummary = async (params = {}) => {
  const response = await apiService({
    endpoint: endpoints.getDashboardSummary,
    method: 'GET',
    params,
  });
  if (response.response?.Apistatus === false) {
    throw new Error(response.response.message);
  }
  return response.response;
};


