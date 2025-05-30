import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const useCareerStore = create((set, get) => ({
    careers: [],
    isLoading: false,
    error: null,

    // Fetch all active careers (public)
    fetchCareers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/careers');
            
            if (response.data.success) {
                set({ careers: response.data.data, isLoading: false });
            } else {
                throw new Error(response.data.message || 'Failed to fetch careers');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load career opportunities';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    // Fetch all careers for admin (including inactive)
    fetchAllCareersAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/careers/admin/all');
            
            if (response.data.success) {
                set({ careers: response.data.data, isLoading: false });
            } else {
                throw new Error(response.data.message || 'Failed to fetch careers');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load careers';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
        }
    },

    // Create new career post
    createCareer: async (careerData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/careers', careerData);
            
            if (response.data.success) {
                set(state => ({
                    careers: [response.data.data, ...state.careers],
                    isLoading: false
                }));
                toast.success('Career post created successfully!');
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to create career post');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create career post';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Update career post
    updateCareer: async (careerData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/careers/${careerData._id}`, careerData);
            
            if (response.data.success) {
                set(state => ({
                    careers: state.careers.map(career => 
                        career._id === response.data.data._id ? response.data.data : career
                    ),
                    isLoading: false
                }));
                toast.success('Career post updated successfully!');
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to update career post');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update career post';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Delete career post
    deleteCareer: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/careers/${careerId}`);
            
            if (response.data.success) {
                set(state => ({
                    careers: state.careers.filter(career => career._id !== careerId),
                    isLoading: false
                }));
                toast.success('Career post deleted successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to delete career post');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete career post';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Toggle career status (active/inactive)
    toggleCareerStatus: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.patch(`/careers/${careerId}/toggle-status`);
            
            if (response.data.success) {
                set(state => ({
                    careers: state.careers.map(career => 
                        career._id === careerId ? response.data.data : career
                    ),
                    isLoading: false
                }));
                toast.success(response.data.message);
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to toggle career status');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle career status';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Get single career by ID
    getCareerById: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/careers/${careerId}`);
            
            if (response.data.success) {
                set({ isLoading: false });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch career details');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load career details';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    // Clear errors
    clearError: () => set({ error: null }),

    // Clear careers
    clearCareers: () => set({ careers: [] })
}));

export default useCareerStore;
