import { create } from 'zustand';
import toast from 'react-hot-toast';

const useCareerStore = create((set, get) => ({
    careers: [],
    isLoading: false,
    error: null,

    // Fetch all active careers (public)
    fetchCareers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/careers');
            const data = await response.json();
            
            if (data.success) {
                set({ careers: data.data, isLoading: false });
            } else {
                throw new Error(data.message || 'Failed to fetch careers');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error('Failed to load career opportunities');
        }
    },

    // Fetch all careers for admin (including inactive)
    fetchAllCareersAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/careers/admin/all', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                set({ careers: data.data, isLoading: false });
            } else {
                throw new Error(data.message || 'Failed to fetch careers');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error('Failed to load careers');
        }
    },

    // Create new career post
    createCareer: async (careerData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(careerData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                set(state => ({
                    careers: [data.data, ...state.careers],
                    isLoading: false
                }));
                toast.success('Career post created successfully!');
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to create career post');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || 'Failed to create career post');
            throw error;
        }
    },

    // Update career post
    updateCareer: async (careerData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/careers/${careerData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(careerData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                set(state => ({
                    careers: state.careers.map(career => 
                        career._id === data.data._id ? data.data : career
                    ),
                    isLoading: false
                }));
                toast.success('Career post updated successfully!');
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to update career post');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || 'Failed to update career post');
            throw error;
        }
    },

    // Delete career post
    deleteCareer: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/careers/${careerId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            const data = await response.json();
            
            if (data.success) {
                set(state => ({
                    careers: state.careers.filter(career => career._id !== careerId),
                    isLoading: false
                }));
                toast.success('Career post deleted successfully!');
            } else {
                throw new Error(data.message || 'Failed to delete career post');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || 'Failed to delete career post');
            throw error;
        }
    },

    // Toggle career status (active/inactive)
    toggleCareerStatus: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/careers/${careerId}/toggle-status`, {
                method: 'PATCH',
                credentials: 'include',
            });
            
            const data = await response.json();
            
            if (data.success) {
                set(state => ({
                    careers: state.careers.map(career => 
                        career._id === careerId ? data.data : career
                    ),
                    isLoading: false
                }));
                toast.success(data.message);
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to toggle career status');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(error.message || 'Failed to toggle career status');
            throw error;
        }
    },

    // Get single career by ID
    getCareerById: async (careerId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`/api/careers/${careerId}`);
            const data = await response.json();
            
            if (data.success) {
                set({ isLoading: false });
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch career details');
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error('Failed to load career details');
            throw error;
        }
    },

    // Clear errors
    clearError: () => set({ error: null }),

    // Clear careers
    clearCareers: () => set({ careers: [] })
}));

export default useCareerStore;
