import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    isCreating: false,

    // Get all products
    getAllProducts: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/products");
            set({ products: res.data });
        } catch (error) {
            console.log("Error fetching products:", error);
            toast.error(error.response?.data?.message || "Failed to fetch products");
        } finally {
            set({ isLoading: false });
        }
    },

    // Create product (admin only)
    createProduct: async (productData) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/products", productData);
            
            // Add the new product to the local state
            const products = get().products;
            set({ products: [res.data.product, ...products] });
            
            toast.success(res.data.message);
            return res.data.product;
        } catch (error) {
            console.log("Error creating product:", error);
            toast.error(error.response?.data?.message || "Failed to create product");
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    // Get product by ID
    getProductById: async (productId) => {
        try {
            const res = await axiosInstance.get(`/products/${productId}`);
            return res.data;
        } catch (error) {
            console.log("Error fetching product:", error);
            toast.error(error.response?.data?.message || "Failed to fetch product");
            return null;
        }
    },

    // Update product (admin only)
    updateProduct: async (productId, productData) => {
        try {
            const res = await axiosInstance.put(`/products/${productId}`, productData);
            
            // Update the product in local state
            const products = get().products;
            const updatedProducts = products.map(product => 
                product._id === productId ? res.data.product : product
            );
            set({ products: updatedProducts });
            
            toast.success(res.data.message);
            return res.data.product;
        } catch (error) {
            console.log("Error updating product:", error);
            toast.error(error.response?.data?.message || "Failed to update product");
            throw error;
        }
    },

    // Delete product (admin only)
    deleteProduct: async (productId) => {
        try {
            const res = await axiosInstance.delete(`/products/${productId}`);
            
            // Remove the product from local state
            const products = get().products;
            const updatedProducts = products.filter(product => product._id !== productId);
            set({ products: updatedProducts });
            
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error deleting product:", error);
            toast.error(error.response?.data?.message || "Failed to delete product");
            throw error;
        }
    }
}));