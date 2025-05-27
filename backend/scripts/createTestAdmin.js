import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/user.model.js";
import { connectDB } from "../src/lib/db.js";

const createTestAdmin = async () => {
    try {
        await connectDB();
        
        const testEmail = "admin@test.com";
        const testPassword = "123456";
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: testEmail });
        if (existingUser) {
            console.log(`User ${testEmail} already exists`);
            return;
        }
        
        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        
        // Create the admin user
        const adminUser = new User({
            fullName: "Test Admin",
            email: testEmail,
            password: hashedPassword,
            role: "admin"
        });
        
        await adminUser.save();
        
        console.log(`✅ Test admin created successfully:`);
        console.log(`Email: ${testEmail}`);
        console.log(`Password: ${testPassword}`);
        console.log(`Role: admin`);
        
    } catch (error) {
        console.error("Error creating test admin:", error);
    } finally {
        mongoose.connection.close();
    }
};

createTestAdmin();
