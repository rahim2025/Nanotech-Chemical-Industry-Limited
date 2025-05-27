import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Shield, Package } from "lucide-react";

export const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
            
            {/* Always visible navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/products"
                className="btn btn-sm btn-ghost gap-2"
              >
                <Package className="w-4 h-4" />
                Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Products link */}
            <Link
              to="/products"
              className="btn btn-sm gap-2 md:hidden"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </Link>

            {authUser ? (
              <>
                <Link
                  to="/settings"
                  className="btn btn-sm gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {authUser.role === "admin" && (
                  <Link to="/admin" className="btn btn-sm gap-2 btn-error">
                    <Shield className="size-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button className="btn btn-sm gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-sm btn-outline">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;