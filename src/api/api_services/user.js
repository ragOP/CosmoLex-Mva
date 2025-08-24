import { apiService } from '@/api/api_services';
import { endpoints } from '@/api/endpoint';

// Get users meta data (roles, etc.)
export const getUsersMeta = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getUsersMeta,
      method: 'GET',
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      console.error(
        'Users meta API error:',
        response.response?.message || 'Failed to fetch users meta'
      );
      return { roles: [] };
    }
  } catch (error) {
    console.error('Users meta fetch error:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getUsers,
      method: 'GET',
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      console.error(
        'Users API error:',
        response.response?.message || 'Failed to fetch users'
      );
      return { data: [] };
    }
  } catch (error) {
    console.error('Users fetch error:', error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getUser}/${userId}`,
      method: 'GET',
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      console.error(
        'User API error:',
        response.response?.message || 'Failed to fetch user'
      );
      return null;
    }
  } catch (error) {
    console.error('User fetch error:', error);
    throw error;
  }
};

// Search users
export const searchUser = async (searchData) => {
  try {
    const response = await apiService({
      endpoint: endpoints.searchUser,
      method: 'POST',
      data: searchData,
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      console.error(
        'User search API error:',
        response.response?.message || 'Failed to search users'
      );
      return { data: [] };
    }
  } catch (error) {
    console.error('User search error:', error);
    throw error;
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const isFormData = userData instanceof FormData;

    const response = await apiService({
      endpoint: endpoints.createUser,
      method: 'POST',
      data: userData,
      headers: isFormData
        ? {
            'Content-Type': 'multipart/form-data',
          }
        : undefined,
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      const errorMessage =
        response.response?.message || 'Failed to create user';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const isFormData = userData instanceof FormData;

    const response = await apiService({
      endpoint: `${endpoints.updateUser}/${userId}`,
      method: 'PUT',
      data: userData,
      headers: isFormData
        ? {
            'Content-Type': 'multipart/form-data',
          }
        : undefined,
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      const errorMessage =
        response.response?.message || 'Failed to update user';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('User update error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.deleteUser}/${userId}`,
      method: 'DELETE',
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      const errorMessage =
        response.response?.message || 'Failed to delete user';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('User deletion error:', error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId, is_active) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.updateUserStatus}/${userId}`,
      method: 'PATCH',
      data: { is_active },
    });

    if (response.response && response.response.Apistatus === true) {
      return response.response;
    } else {
      const errorMessage =
        response.response?.message || 'Failed to update user status';
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('User status update error:', error);
    throw error;
  }
};
