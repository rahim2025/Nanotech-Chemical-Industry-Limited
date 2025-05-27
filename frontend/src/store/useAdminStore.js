import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
    users: [],
    isLoading: false,
    
    // Get all users (admin only)
    getAllUsers: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/admin/users");
            set({ users: res.data });
        } catch (error) {
            console.log("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isLoading: false });
        }
    },

    // Promote user to admin
    promoteToAdmin: async (userId) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}/promote`);
            
            // Update the user in the local state
            const users = get().users;
            const updatedUsers = users.map(user => 
                user._id === userId ? { ...user, role: "admin" } : user
            );
            set({ users: updatedUsers });
            
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error promoting user:", error);
            toast.error(error.response?.data?.message || "Failed to promote user");
        }
    },

    // Demote admin to user
    demoteToUser: async (userId) => {
        try {
            const res = await axiosInstance.put(`/admin/users/${userId}/demote`);
            
            // Update the user in the local state
            const users = get().users;
            const updatedUsers = users.map(user => 
                user._id === userId ? { ...user, role: "user" } : user
            );
            set({ users: updatedUsers });
            
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error demoting user:", error);
            toast.error(error.response?.data?.message || "Failed to demote user");
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const res = await axiosInstance.delete(`/admin/users/${userId}`);
            
            // Remove the user from local state
            const users = get().users;
            const updatedUsers = users.filter(user => user._id !== userId);
            set({ users: updatedUsers });
            
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            const res = await axiosInstance.get(`/admin/users/${userId}`);
            return res.data;
        } catch (error) {
            console.log("Error fetching user:", error);
            toast.error(error.response?.data?.message || "Failed to fetch user");
            return null;
        }
    }
}));
