import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
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


    },    isLoggingIn:false,
    login: async(data)=>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
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
    },
    logout: async() =>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logout successfully");   
        } catch (error) {
            console.log("Error in signup auth",error)
            toast.error(error.response.data.errors)
        }
        
    },    updateProfile: async (file) => {
        set({ isUpdatingProfile: true });
        try {
          const formData = new FormData();
          formData.append('profilePic', file);
          
          const res = await axiosInstance.put("/auth/update-profile", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

}))