const getToken = () => {
  return localStorage.getItem('auth_token');
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

export { getToken, setToken, removeToken, clearAuthData };
