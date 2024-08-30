// src/hooks/useAuth.ts

import { useState, useEffect } from "react";


const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
        const cookieString = document.cookie;
        const token = cookieString
         .split('; ')
         .find(row => row.startsWith('authToken'))
         ?.split('=')[1];
      setIsLoggedIn(!!token);
    }, []);
  
    const logout = () => {
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
      setIsLoggedIn(false);
      window.location.href = '/login'
    };
  
    return { isLoggedIn, logout };
  };

  
  
  export default useAuth;
  