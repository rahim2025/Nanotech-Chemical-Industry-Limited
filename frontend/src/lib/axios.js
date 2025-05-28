import axios from "axios"

// Determine the appropriate API URL based on the current hostname
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    // If we're on the production site
    if (hostname === 'www.nanotechchemical.com' || hostname === 'nanotechchemical.com') {
        return 'https://api.nanotechchemical.com/api';
    }
    
    // For local development
    return 'http://localhost:5000/api';
};

// Create axios instance with default config
export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, // Send cookies with requests
});

// Add token to localStorage when logging in
export const saveTokenToStorage = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
    }
};

// Remove token when logging out
export const removeTokenFromStorage = () => {
    localStorage.removeItem('authToken');
};

// Add Authorization header to all requests if token exists in localStorage
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});