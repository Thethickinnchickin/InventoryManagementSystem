const getToken = () => {
    const token = localStorage.getItem('authToken');
    if(token) {
        return token
    } else {
        return null;
    }
}



export default getToken;