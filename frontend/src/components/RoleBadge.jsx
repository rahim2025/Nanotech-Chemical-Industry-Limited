import { Crown, User } from "lucide-react";

const RoleBadge = ({ role, size = "sm" }) => {
    const isAdmin = role === "admin";
    
    const sizeClasses = {
        xs: "badge-xs text-xs",
        sm: "badge-sm text-sm", 
        md: "badge-md",
        lg: "badge-lg"
    };

    const iconSizes = {
        xs: "w-2 h-2",
        sm: "w-3 h-3",
        md: "w-4 h-4", 
        lg: "w-5 h-5"
    };

    return (
        <div className={`badge ${isAdmin ? "badge-error" : "badge-info"} ${sizeClasses[size]} gap-1`}>
            {isAdmin ? (
                <Crown className={iconSizes[size]} />
            ) : (
                <User className={iconSizes[size]} />
            )}
            {isAdmin ? "Admin" : "User"}
        </div>
    );
};

export default RoleBadge;
