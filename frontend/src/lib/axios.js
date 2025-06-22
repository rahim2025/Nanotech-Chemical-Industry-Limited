import axios from "axios"

// Determine the appropriate API URL based on environment
const getApiUrl = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Fallback to hostname-based detection
    const hostname = window.location.hostname;
    
    // If we're on the production site
    if (hostname === 'www.nanotechchemical.com' || hostname === 'nanotechchemical.com') {
        return 'https://api.nanotechchemical.com/api';
    }
    
    // For local development
    return 'http://localhost:5000/api';
};

// Create axios instance with default config optimized for all browsers including Brave
export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, // Send cookies with requests
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // Prevent caching issues in Brave
        'Pragma': 'no-cache'
    }
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
    
    // Add additional headers for better browser compatibility
    config.headers['Accept'] = 'application/json';
    
    return config;
}, error => {
    return Promise.reject(error);
});

// Add response interceptor to handle CORS and other errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.message && error.message.includes('CORS')) {
            console.error('CORS Error detected. This might be a browser-specific issue.');
            console.error('Try refreshing the page or clearing browser cache.');
        }
        
        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);