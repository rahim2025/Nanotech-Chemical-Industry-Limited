import axios from "axios"

// Determine the appropriate API URL based on the current hostname
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    // If we're on the production site
    if (hostname === 'www.nanotechchemical.com' || hostname === 'nanotechchemical.com') {
        // Use HTTPS and the proper API subdomain in production
        return 'https://api.nanotechchemical.com/api';
        // Fallback to direct IP if needed
        // return 'https://31.97.49.55:5000/api';
    }
    
    // For local development
    return 'http://localhost:5000/api';
};

export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
})