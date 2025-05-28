import Product from "../models/product.model.js";
import fileService from "../lib/fileService.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, inStock } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({
                message: "Name and description are required"
            });
        }

        // Check if image file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Product image is required"
            });
        }

        // Parse price data from JSON string
        let priceData;
        try {
            priceData = JSON.parse(req.body.price);
        } catch (error) {
            return res.status(400).json({
                message: "Invalid price data format"
            });        }

        // Generate image URL for uploaded file
        const imageUrl = fileService.generateFileUrl(req, req.file.filename);

        // Validate and process price values
        if (!priceData.contactForPrice) {
            // For regular pricing, we need at least minValue
            if (!priceData.minValue && priceData.minValue !== 0) {
                return res.status(400).json({
                    message: "Price is required when not using 'Contact for pricing'"
                });
            }
            
            priceData.minValue = Number(priceData.minValue);
            
            // Add maxValue if provided
            if (priceData.maxValue !== undefined && priceData.maxValue !== null && priceData.maxValue !== "") {
                priceData.maxValue = Number(priceData.maxValue);
                
                // Validate that maxValue >= minValue
                if (priceData.maxValue < priceData.minValue) {
                    return res.status(400).json({
                        message: "Maximum price must be greater than or equal to minimum price"
                    });
                }
            }
        }const newProduct = new Product({
            name,
            photo: imageUrl,
            description,
            price: priceData,
            inStock: inStock !== undefined ? inStock : true,
            createdBy: userId
        });

        await newProduct.save();

        // Populate the createdBy field for the response
        await newProduct.populate('createdBy', 'fullName email');

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error in createProduct controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getAllProducts controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId)
            .populate('createdBy', 'fullName email');
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProductById controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, inStock } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Update fields if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (inStock !== undefined) product.inStock = inStock;

        // Update price if provided
        if (req.body.price) {
            let priceData;
            try {
                priceData = JSON.parse(req.body.price);
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid price data format"
                });
            }

            // Set defaults from existing product price if not provided
            priceData = {
                currency: priceData.currency || product.price.currency || "USD",
                unit: priceData.unit || product.price.unit || "per item",
                contactForPrice: priceData.contactForPrice !== undefined ? priceData.contactForPrice : false
            };

            // Validate and add price values
            if (!priceData.contactForPrice) {
                // For regular pricing, we need at least minValue
                if (!priceData.minValue && priceData.minValue !== 0) {
                    return res.status(400).json({
                        message: "Price is required when not using 'Contact for pricing'"
                    });
                }
                
                priceData.minValue = Number(priceData.minValue);
                
                // Add maxValue if provided
                if (priceData.maxValue !== undefined && priceData.maxValue !== null && priceData.maxValue !== "") {
                    priceData.maxValue = Number(priceData.maxValue);
                    
                    // Validate that maxValue >= minValue
                    if (priceData.maxValue < priceData.minValue) {
                        return res.status(400).json({
                            message: "Maximum price must be greater than or equal to minimum price"
                        });
                    }
                }
            }

            product.price = priceData;
        }

        // Update photo if new file was uploaded
        if (req.file) {
            // Delete old image file if exists
            if (product.photo) {
                fileService.deleteFileByUrl(product.photo);
            }
            
            // Set new image URL
            product.photo = fileService.generateFileUrl(req, req.file.filename);
        }

        await product.save();
        await product.populate('createdBy', 'fullName email');

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Error in updateProduct controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Delete associated image file if exists
        if (product.photo) {
            fileService.deleteFileByUrl(product.photo);
        }

        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};