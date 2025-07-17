const getToken = () => {
  return localStorage.getItem("auth_token");
};

export { getToken };