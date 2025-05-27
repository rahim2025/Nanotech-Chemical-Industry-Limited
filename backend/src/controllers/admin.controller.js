import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "User is already an admin"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: "admin" },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "User promoted to admin successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in promoteToAdmin controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const demoteToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "user") {
            return res.status(400).json({
                message: "User is already a regular user"
            });
        }

        // Prevent demoting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot demote yourself"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: "user" },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "User demoted to regular user successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in demoteToUser controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserById controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot delete yourself"
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteUser controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
