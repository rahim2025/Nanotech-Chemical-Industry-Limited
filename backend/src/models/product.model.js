import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },        price: {
            minValue: {
                type: Number,
                min: 0,
                required: function() {
                    return !this.price.contactForPrice;
                }
            },
            maxValue: {
                type: Number,
                min: 0,
                validate: {
                    validator: function(value) {
                        // maxValue should be greater than minValue if both are provided
                        if (value && this.price.minValue) {
                            return value >= this.price.minValue;
                        }
                        return true;
                    },
                    message: 'Maximum price must be greater than or equal to minimum price'
                }
            },
            currency: {
                type: String,
                default: "USD"
            },
            unit: {
                type: String,
                default: "per item"
            },
            contactForPrice: {
                type: Boolean,
                default: false
            }
        },
        inStock: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;