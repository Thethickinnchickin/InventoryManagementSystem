import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

const useAuth = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State to store the user's role
  const [userRole, setUserRole] = useState<string | null>(null);

  // useEffect to run once when the component mounts
  useEffect(() => {
    // Retrieve the authentication token from cookies
    const token = Cookie.get('authToken');
    
    if (token) {
      // Decode the token to extract user role
      const decodedToken = jwt.decode(token) as { role: string };
      
      // Set the user role and logged-in state
      setUserRole(decodedToken.role);
      setIsLoggedIn(true);
    } else {
      // If no token, user is not logged in
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle user logout
  const logout = () => {
    // Remove the authentication token from cookies
    Cookie.remove('authToken');
    
    // Reset the logged-in state and user role
    setIsLoggedIn(false);
    setUserRole(null);
    
    // Redirect user to login page
    window.location.href = '/login';
  };

  // Return the authentication status, user role, and logout function
  return { isLoggedIn, userRole, logout };
};

export default useAuth;
