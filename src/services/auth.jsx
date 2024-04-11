const setAuthorizationHeader = (token) => {
    ConnectionAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };
  