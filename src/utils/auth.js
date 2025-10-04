const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Decode JWT token to get user data
const decodeToken = (token) => {
  try {
    if (!token) return null;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

const removeToken = () => {
  localStorage.removeItem('auth_token');
};

const clearAuthData = () => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('persist:root'); // Clear persisted Redux state
};

export { getToken, setToken, removeToken, clearAuthData, decodeToken };
