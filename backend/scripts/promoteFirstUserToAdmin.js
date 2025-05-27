import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import { connectDB } from "../src/lib/db.js";

const promoteFirstUserToAdmin = async () => {
    try {
        await connectDB();
        
        // Find the first user (oldest account)
        const firstUser = await User.findOne().sort({ createdAt: 1 });
        
        if (!firstUser) {
            console.log("No users found in the database");
            return;
        }
        
        if (firstUser.role === "admin") {
            console.log(`User ${firstUser.fullName} (${firstUser.email}) is already an admin`);
            return;
        }
        
        // Update the user to admin
        firstUser.role = "admin";
        await firstUser.save();
        
        console.log(`✅ Successfully promoted ${firstUser.fullName} (${firstUser.email}) to admin`);
        console.log(`User ID: ${firstUser._id}`);
        
    } catch (error) {
        console.error("Error promoting user to admin:", error);
    } finally {
        mongoose.connection.close();
    }
};

promoteFirstUserToAdmin();
