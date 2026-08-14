import api from '../api/api';


export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        throw (
            error.response?.data || {
                success: false,
                message: "Registration failed."
            }
        );
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/auth/login', userData);
        
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        throw (
            error.response?.data ||{
                success: false,
                message:"Login failed.",
            }
        );
    }
};

export const logoutUser = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = async () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = async () => {
    const token = await getToken();
    return !!token;
};