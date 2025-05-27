import React from 'react'
import { useAuthStore } from "../store/useAuthStore";
import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

export const SettingsPage = () => {
  const { authUser } = useAuthStore();

  // Show login prompt if user is not authenticated
  if (!authUser) {
    return (
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8 text-center">
            <div className="text-center">
              <Settings className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
              <h1 className="text-2xl font-bold text-base-content mb-2">
                Settings Access
              </h1>
              <p className="text-base-content/60 mb-6">
                Please log in to access your account settings.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <Settings className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold text-base-content mb-2">
              Account Settings
            </h1>
            <p className="text-base-content/60">
              Manage your account preferences and settings.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="alert alert-info">
              <Settings className="w-5 h-5" />
              <span>Settings functionality will be implemented here.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
