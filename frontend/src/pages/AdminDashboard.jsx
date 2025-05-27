import { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Shield, ShieldOff, Trash2, User, Crown } from "lucide-react";

const AdminDashboard = () => {
    const { users, isLoading, getAllUsers, promoteToAdmin, demoteToUser, deleteUser } = useAdminStore();
    const { authUser } = useAuthStore();
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const filteredUsers = users.filter(user => {
        if (filter === "all") return true;
        return user.role === filter;
    });

    const handlePromote = async (userId) => {
        if (window.confirm("Are you sure you want to promote this user to admin?")) {
            await promoteToAdmin(userId);
        }
    };

    const handleDemote = async (userId) => {
        if (window.confirm("Are you sure you want to demote this admin to user?")) {
            await demoteToUser(userId);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            await deleteUser(userId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="bg-base-100 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                {/* Filter Controls */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter("all")}
                        className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        All Users ({users.length})
                    </button>
                    <button
                        onClick={() => setFilter("user")}
                        className={`btn ${filter === "user" ? "btn-primary" : "btn-outline"}`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Users ({users.filter(u => u.role === "user").length})
                    </button>
                    <button
                        onClick={() => setFilter("admin")}
                        className={`btn ${filter === "admin" ? "btn-primary" : "btn-outline"}`}
                    >
                        <Crown className="w-4 h-4 mr-2" />
                        Admins ({users.filter(u => u.role === "admin").length})
                    </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={user.profilePic || "/avatar.png"}
                                                        alt={user.fullName}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.fullName}</div>
                                                {user._id === authUser?._id && (
                                                    <div className="text-sm opacity-50">You</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className={`badge ${user.role === "admin" ? "badge-error" : "badge-info"}`}>
                                            {user.role === "admin" ? (
                                                <>
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    Admin
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-3 h-3 mr-1" />
                                                    User
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            {user.role === "user" && (
                                                <button
                                                    onClick={() => handlePromote(user._id)}
                                                    className="btn btn-sm btn-success"
                                                    title="Promote to Admin"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user.role === "admin" && user._id !== authUser?._id && (
                                                <button
                                                    onClick={() => handleDemote(user._id)}
                                                    className="btn btn-sm btn-warning"
                                                    title="Demote to User"
                                                >
                                                    <ShieldOff className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user._id !== authUser?._id && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-sm btn-error"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                        <Users className="w-16 h-16 mx-auto text-base-300 mb-4" />
                        <p className="text-lg text-base-content/60">
                            No {filter === "all" ? "" : filter + " "}users found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
