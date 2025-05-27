import mongoose from "mongoose";
import Product from "../src/models/product.model.js";
import User from "../src/models/user.model.js";

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nanotech-chemical");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const sampleProducts = [
    {
        name: "Nano Silver Particles",
        photo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
        description: "High-purity nano silver particles for antimicrobial applications in textiles and medical devices.",
        inStock: true,
        price: {
            minValue: 250,
            maxValue: 500,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    },
    {
        name: "Carbon Nanotubes",
        photo: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop",
        description: "Multi-walled carbon nanotubes for advanced composite materials and electronics applications.",
        inStock: true,
        price: {
            minValue: 150,
            maxValue: 300,
            currency: "USD",
            unit: "per 100g",
            contactForPrice: false
        }
    },
    {
        name: "Titanium Dioxide Nanoparticles",
        photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        description: "Ultra-fine TiO2 nanoparticles for photocatalytic applications and UV protection in coatings.",
        inStock: true,
        price: {
            minValue: 80,
            maxValue: 150,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    },
    {
        name: "Graphene Oxide Powder",
        photo: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=400&fit=crop",
        description: "High-quality graphene oxide powder for energy storage, water treatment, and composite materials.",
        inStock: false,
        price: {
            currency: "USD",
            unit: "per gram",
            contactForPrice: true
        }
    },
    {
        name: "Zinc Oxide Nanoparticles",
        photo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop",
        description: "Premium ZnO nanoparticles for sunscreen formulations and antimicrobial coatings.",
        inStock: true,
        price: {
            minValue: 120,
            maxValue: 200,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    },
    {
        name: "Silicon Dioxide Nanoparticles",
        photo: "https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?w=400&h=400&fit=crop",
        description: "Spherical SiO2 nanoparticles for drug delivery systems and optical applications.",
        inStock: true,
        price: {
            minValue: 90,
            maxValue: 180,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    },
    {
        name: "Iron Oxide Nanoparticles",
        photo: "https://images.unsplash.com/photo-1564131918133-0f2f2b1b5e4d?w=400&h=400&fit=crop",
        description: "Magnetic Fe2O3 nanoparticles for MRI contrast agents and magnetic separation applications.",
        inStock: true,
        price: {
            minValue: 200,
            maxValue: 350,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    },
    {
        name: "Aluminum Oxide Nanoparticles",
        photo: "https://images.unsplash.com/photo-1599148263364-bcdda33b5e8d?w=400&h=400&fit=crop",
        description: "High-purity Al2O3 nanoparticles for thermal barrier coatings and abrasive applications.",
        inStock: true,
        price: {
            minValue: 100,
            maxValue: 250,
            currency: "USD",
            unit: "per kg",
            contactForPrice: false
        }
    }
];

const addSampleProducts = async () => {
    try {
        await connectDB();
          // Find or create a test user
        let testUser = await User.findOne({ email: "testuser@example.com" });
        if (!testUser) {
            testUser = new User({
                fullName: "Test User",
                email: "testuser@example.com",
                password: "password123", // This will be hashed by the model
                role: "admin"
            });
            await testUser.save();
            console.log("Created test user");
        }
        
        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");
        
        // Add createdBy field to all sample products
        const productsWithCreator = sampleProducts.map(product => ({
            ...product,
            createdBy: testUser._id
        }));
        
        // Add sample products
        const products = await Product.insertMany(productsWithCreator);
        console.log(`Added ${products.length} sample products successfully!`);
        
        // Display added products
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.inStock ? 'In Stock' : 'Out of Stock'}`);
        });
        
    } catch (error) {
        console.error("Error adding sample products:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed");
    }
};

addSampleProducts();