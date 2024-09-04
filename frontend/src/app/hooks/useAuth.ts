import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookie.get('authToken');
    if (token) {
      const decodedToken = jwt.decode(token) as { role: string };
      setUserRole(decodedToken.role);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const logout = () => {
    Cookie.remove('authToken');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/login';
  };

  return { isLoggedIn, userRole, logout };
};

export default useAuth;
