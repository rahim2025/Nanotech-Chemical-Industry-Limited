import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useInquiryStore = create((set, get) => ({
  inquiries: [],
  isLoading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalInquiries: 0,
    hasMore: false
  },

  // Submit a new inquiry
  submitInquiry: async (inquiryData) => {
    try {
      const response = await axiosInstance.post('/inquiries', inquiryData);
      
      // Show success message
      toast.success('Your inquiry has been submitted successfully!', {
        icon: '📩',
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error(error.response?.data?.message || "Failed to submit inquiry");
      throw error;
    }
  },

  // Get all inquiries (admin only)
  getInquiries: async (page = 1, status) => {
    set({ isLoading: true });
    try {
      let url = `/inquiries?page=${page}&limit=10`;
      if (status) url += `&status=${status}`;

      const res = await axiosInstance.get(url);
      set({
        inquiries: res.data.inquiries,
        pagination: res.data.pagination
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error(error.response?.data?.message || "Failed to load inquiries");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get a specific inquiry
  getInquiryById: async (inquiryId) => {
    try {
      const res = await axiosInstance.get(`/inquiries/${inquiryId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      toast.error(error.response?.data?.message || "Failed to load inquiry");
      return null;
    }
  },

  // Update inquiry status
  updateInquiryStatus: async (inquiryId, status, isResolved) => {
    try {
      const res = await axiosInstance.patch(`/inquiries/${inquiryId}/status`, { 
        status,
        isResolved 
      });
      
      // Update the inquiry in the list
      const updatedInquiries = get().inquiries.map(inquiry => 
        inquiry._id === inquiryId ? res.data.inquiry : inquiry
      );
      
      set({ inquiries: updatedInquiries });
      toast.success(res.data.message || "Inquiry status updated");
      
      return res.data.inquiry;
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error(error.response?.data?.message || "Failed to update inquiry");
      throw error;
    }
  },

  // Clear inquiries
  clearInquiries: () => {
    set({
      inquiries: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalInquiries: 0,
        hasMore: false
      }
    });
  }
}));
