import { useState, useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { Camera, Package, FileText, ToggleLeft, ToggleRight, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const AddProductForm = ({ product, onSuccess, onCancel }) => {
    const { createProduct, updateProduct, isCreating } = useProductStore();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: {
            minValue: "",
            maxValue: "",
            currency: "USD",
            unit: "per ton",
            contactForPrice: false
        },
        inStock: true
    });
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const isEditing = !!product;
      // Initialize form data when editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price || {
                    minValue: "",
                    maxValue: "",
                    currency: "USD",
                    unit: "per item",
                    contactForPrice: false
                },
                inStock: product.inStock ?? true
            });
            setImagePreview(product.photo || null);
        }
    }, [product]);

    // Debug logging for formData changes
    useEffect(() => {
        console.log('FormData updated:', formData);
    }, [formData]);    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPEG, PNG, GIF, WebP)");
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setSelectedImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImagePreview(reader.result);
        };
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!isEditing && !selectedImageFile) {
            toast.error("Please select an image for the product");
            return;
        }
          // Create a clean price object
        let priceData = {
            currency: formData.price.currency || "USD",
            unit: formData.price.unit || "per item",
            contactForPrice: formData.price.contactForPrice
        };

        // Handle pricing validation
        if (!formData.price.contactForPrice) {
            const minValue = parseFloat(formData.price.minValue);
            
            if (isNaN(minValue) || minValue <= 0) {
                toast.error("Please enter a valid minimum price");
                return;
            }
            
            priceData.minValue = minValue;
            
            // If maxValue is provided, validate it for price range
            if (formData.price.maxValue && formData.price.maxValue.trim() !== "") {
                const maxValue = parseFloat(formData.price.maxValue);
                
                if (isNaN(maxValue) || maxValue <= 0) {
                    toast.error("Please enter a valid maximum price");
                    return;
                }
                
                if (minValue >= maxValue) {
                    toast.error("Maximum price must be greater than minimum price");
                    return;
                }
                
                priceData.maxValue = maxValue;
                console.log("Set price range:", minValue, "to", maxValue);
            } else {
                console.log("Set single price:", minValue);
            }
        } else {
            console.log("Contact for pricing enabled");
        }
        
        console.log("Price data being submitted:", priceData);        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('inStock', formData.inStock);
            submitData.append('price', JSON.stringify(priceData));
            
            // Only append photo if a new file is selected
            if (selectedImageFile) {
                submitData.append('photo', selectedImageFile);
            }
            
            if (isEditing) {
                await updateProduct(product._id, submitData);
            } else {
                await createProduct(submitData);
            }
              
            // Reset form
            setFormData({ 
                name: "", 
                description: "", 
                price: {
                    minValue: "",
                    maxValue: "",
                    currency: "USD",
                    unit: "per item",
                    contactForPrice: false
                },
                inStock: true 
            });
            setSelectedImageFile(null);
            setImagePreview(null);
            onSuccess && onSuccess();
        } catch (error) {
            // Error is handled in the store
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };    const handlePriceChange = (field, value) => {
        console.log(`handlePriceChange called with field: ${field}, value: ${value}`);
        
        setFormData(prev => {
            const newFormData = {
                ...prev,
                price: {
                    ...prev.price,
                    [field]: value
                }
            };
            console.log(`Updated formData.price after ${field} change:`, newFormData.price);
            return newFormData;
        });
    };

    const toggleStock = () => {
        setFormData(prev => ({
            ...prev,
            inStock: !prev.inStock
        }));
    };

    return (        <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">
                    {isEditing ? "Edit Product" : "Add New Product"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-base-content">
                        Product Image *
                    </label>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">                            <div className="w-32 h-32 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <Camera className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                                        <p className="text-xs text-base-content/50">Upload Image</p>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="product-image"
                                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 p-2 rounded-full cursor-pointer transition-all duration-200"
                            >
                                <Camera className="w-4 h-4 text-primary-content" />
                                <input
                                    type="file"
                                    id="product-image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isCreating}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-base-content/60 text-center">
                            {isCreating ? "Uploading..." : "Click the camera icon to upload product image"}
                        </p>
                    </div>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-base-content">
                        Product Name *
                    </label>
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input input-bordered w-full pl-10"
                            placeholder="Enter product name"
                            disabled={isCreating}
                            required
                        />
                    </div>
                </div>                {/* Product Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-base-content">
                        Description *
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-base-content/50" />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full pl-10 min-h-[100px]"
                            placeholder="Enter product description"
                            disabled={isCreating}
                            required
                        />
                    </div>
                </div>                {/* Pricing Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-base-content">
                        Pricing *
                    </label>
                    
                    {/* Contact for Price Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="contactForPrice"
                            checked={formData.price.contactForPrice}
                            onChange={(e) => handlePriceChange("contactForPrice", e.target.checked)}
                            className="checkbox checkbox-primary"
                            disabled={isCreating}
                        />
                        <label htmlFor="contactForPrice" className="text-sm font-medium">
                            Contact for pricing
                        </label>
                    </div>

                    {/* Price Fields - shown when not contact for price */}
                    {!formData.price.contactForPrice && (
                        <div className="space-y-3">
                            {/* Minimum Price (required) */}
                            <div className="space-y-1">
                                <label className="text-xs text-base-content/70">
                                    Price (or minimum price if range) *
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                        <input
                                            type="number"
                                            value={formData.price.minValue || ''}
                                            onChange={(e) => handlePriceChange("minValue", e.target.value)}
                                            className="input input-bordered w-full pl-10 text-base-content font-medium"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            disabled={isCreating}
                                            required
                                        />
                                    </div>
                                    <select
                                        value={formData.price.currency}
                                        onChange={(e) => handlePriceChange("currency", e.target.value)}
                                        className="select select-bordered"
                                        disabled={isCreating}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>

                            {/* Maximum Price (optional for range) */}
                            <div className="space-y-1">
                                <label className="text-xs text-base-content/70">
                                    Maximum price (optional - for price range)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    <input
                                        type="number"
                                        value={formData.price.maxValue || ''}
                                        onChange={(e) => handlePriceChange("maxValue", e.target.value)}
                                        className="input input-bordered w-full pl-10 text-base-content font-medium"
                                        placeholder="Leave empty for single price"
                                        min="0"
                                        step="0.01"
                                        disabled={isCreating}
                                    />
                                </div>
                            </div>

                            {/* Price Unit */}
                            <div className="space-y-1">
                                <label className="text-xs text-base-content/70">
                                    Price unit
                                </label>
                                <input
                                    type="text"
                                    value={formData.price.unit}
                                    onChange={(e) => handlePriceChange("unit", e.target.value)}
                                    className="input input-bordered w-full"
                                    placeholder="e.g., per kg, per liter, per item"
                                    disabled={isCreating}
                                />
                            </div>
                        </div>
                    )}

                    {/* Contact for Price Info */}
                    {formData.price.contactForPrice && (
                        <div className="alert alert-info">
                            <div className="text-sm">
                                Price will be displayed as "Contact for pricing"
                            </div>
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-base-content">
                        Stock Status
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleStock}
                            className="flex items-center gap-2"
                            disabled={isCreating}
                        >
                            {formData.inStock ? (
                                <ToggleRight className="w-6 h-6 text-success" />
                            ) : (
                                <ToggleLeft className="w-6 h-6 text-error" />
                            )}
                            <span className={`font-medium ${formData.inStock ? 'text-success' : 'text-error'}`}>
                                {formData.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Form Actions */}                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-outline flex-1"
                        disabled={isCreating}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                {isEditing ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                <Package className="w-4 h-4" />
                                {isEditing ? "Update Product" : "Add Product"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;