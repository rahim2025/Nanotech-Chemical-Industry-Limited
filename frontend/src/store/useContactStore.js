import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const useContactStore = create((set, get) => ({
    isLoading: false,
    error: null,
    contacts: [],

    // Send contact message
    sendContactMessage: async (contactData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/contact', contactData);
            
            if (response.data.success) {
                toast.success(response.data.message);
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Get all contacts (admin only)
    getAllContacts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/contact/admin');
            
            if (response.data.success) {
                set({ contacts: response.data.data });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch contacts');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch contacts';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Mark contact as read (admin only)
    markContactAsRead: async (contactId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.patch(`/contact/admin/${contactId}/read`);
            
            if (response.data.success) {
                // Update the contact in the local state
                const { contacts } = get();
                const updatedContacts = contacts.map(contact => 
                    contact._id === contactId 
                        ? { ...contact, isRead: true }
                        : contact
                );
                set({ contacts: updatedContacts });
                toast.success('Contact marked as read');
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to mark as read');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to mark as read';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Delete contact (admin only)
    deleteContact: async (contactId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.delete(`/contact/admin/${contactId}`);
            
            if (response.data.success) {
                // Remove the contact from the local state
                const { contacts } = get();
                const updatedContacts = contacts.filter(contact => contact._id !== contactId);
                set({ contacts: updatedContacts });
                toast.success('Contact deleted successfully');
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to delete contact');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete contact';
            set({ error: errorMessage, isLoading: false });
            toast.error(errorMessage);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useContactStore;
