import axios from "axios"

// Determine the appropriate API URL based on the current hostname
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    // If we're on the production site
    if (hostname === 'www.nanotechchemical.com' || hostname === 'nanotechchemical.com') {
        // Use direct IP instead of domain until DNS is configured
        return 'http://31.97.49.55:5000/api';
        // Original production URL (enable when DNS is configured)
        // return 'https://api.nanotechchemical.com/api';
    }
    
    // For local development
    return 'http://localhost:5000/api';
};

export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
})