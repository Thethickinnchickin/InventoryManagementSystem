// Retrieve the authentication token from localStorage
const getToken = () => {
    return localStorage.getItem('authToken') || null;
  };
  
  export default getToken;
  