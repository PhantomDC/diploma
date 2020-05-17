import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {

  const storageName = 'auth';

  const [token, setToken] = useState(null);

  const login = loginToken => {

    setToken(loginToken);
    localStorage.setItem(storageName, JSON.stringify({
      token: loginToken
    }));

  };

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {

    const storeToken = JSON.parse(localStorage.getItem(storageName) || 'null');
    if (storeToken && storeToken.token) {
      login(storeToken.token);
    }

  }, []);

  return { token, login, logout };

}