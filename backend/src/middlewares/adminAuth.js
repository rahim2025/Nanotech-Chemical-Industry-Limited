export const requireAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        console.error("Error in admin auth middleware:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const requireUserOrAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const requestedUserId = req.params.userId || req.params.id;
        const isOwnProfile = req.user._id.toString() === requestedUserId;
        const isAdmin = req.user.role === "admin";

        if (!isOwnProfile && !isAdmin) {
            return res.status(403).json({
                message: "Access denied. You can only access your own profile or must be an admin"
            });
        }

        next();
    } catch (error) {
        console.error("Error in user or admin auth middleware:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
