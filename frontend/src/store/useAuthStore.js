import {create} from "zustand"
import { axiosInstance, saveTokenToStorage, removeTokenFromStorage } from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore = create((set) =>({    authUser:null,
    onlineUsers: [],
    isCheckingAuth:true,
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        } catch (error) {
            console.error("Error in check auth:", error);
            // Reset auth user but don't show error toast for this silent check
            set({authUser:null});
            
            // Only log detailed error info in development
            if (process.env.NODE_ENV !== 'production') {
                if (error.response) {
                    console.log('Status:', error.response.status);
                    console.log('Data:', error.response.data);
                } else if (error.request) {
                    console.log('No response received');
                }
            }
        } finally {
            set({isCheckingAuth:false});
        }
    },

    isSigningUp :false,
    signup: async(data) =>{
        set({isSigningUp:true })
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data})
            toast.success("Account created successfully")     
        } catch (error) {
            console.log("Error in signup auth",error)
            toast.error(error.response.data.message)
        }finally {
            set({ isSigningUp: false });
          }


    },    isLoggingIn:false,    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            
            // Store the JWT token in localStorage as backup
            if (res.data) {
                // The server should return the token in the response for this to work
                // You may need to modify your backend to include the token in the response
                saveTokenToStorage(res.data.token);
            }
            
            toast.success("Logged in successfully");
        } catch (error) {
            console.error("Login error:", error);
            // Handle different types of errors gracefully
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                toast.error(error.response.data.message || "Login failed");
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("Cannot connect to server. Please check your internet connection.");
            } else {
                // Something happened in setting up the request
                toast.error("Login failed. Please try again.");
            }
        } finally {
            set({isLoggingIn:false});
        }
    },    logout: async() =>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser:null});
            
            // Remove token from localStorage
            removeTokenFromStorage();
            
            toast.success("Logout successfully");   
        } catch (error) {
            console.log("Error in logout:", error)
            // Still clear local state even if server logout fails
            set({authUser:null});
            removeTokenFromStorage();
            
            toast.error(error.response?.data?.message || "Error during logout")
        }
    },updateProfile: async (file) => {
        set({ isUpdatingProfile: true });
        try {
          if (!file) {
            toast.error("No file selected");
            set({ isUpdatingProfile: false });
            return;
          }

          console.log("Uploading file:", file.name, "Size:", file.size);
          
          const formData = new FormData();
          formData.append('profilePic', file);
          
          const res = await axiosInstance.put("/auth/update-profile", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // Ensure cookies are sent
          });
          
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.error("Error in update profile:", error);
          
          // More detailed error handling
          if (error.response) {
            // The server responded with a status code outside of 2xx
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            
            if (error.response.status === 400 && error.response.data.message === "Please login first") {
              toast.error("Session expired. Please log in again.");
              set({ authUser: null }); // Clear auth state to prompt login
            } else {
              toast.error(error.response.data.message || "Failed to update profile");
            }
          } else if (error.request) {
            // The request was made but no response was received
            toast.error("No response from server. Check your connection.");
          } else {
            // Something happened in setting up the request
            toast.error("Error uploading profile photo: " + error.message);
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

}))