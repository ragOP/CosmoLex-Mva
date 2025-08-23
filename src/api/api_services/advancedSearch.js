import { apiService } from './index';

// Get Advanced Search Meta Data
export const getAdvancedSearchMeta = async () => {
  try {
    const response = await apiService({
      endpoint: 'v2/advanced-search',
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching advanced search meta:', error);
    throw error;
  }
};

// Perform Advanced Search
export const performAdvancedSearch = async (searchData) => {
  try {
    const response = await apiService({
      endpoint: 'v2/advanced-search',
      method: 'POST',
      data: searchData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error performing advanced search:', error);
    throw error;
  }
}; 