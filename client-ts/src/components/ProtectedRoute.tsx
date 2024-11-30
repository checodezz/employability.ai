import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust the import based on your store setup

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string; // Optional redirect path (default is "/")
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = "/",
}) => {
  // Get user authentication, phone verification, and profile completion state from Redux store
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to={redirectPath} />;
  }

  // Check if phone is verified
  if (isAuthenticated && !user?.isPhoneVerified) {
    // If phone is not verified, redirect to the verify-phone page
    return <Navigate to="/verify-phone" />;
  }

  // Check if profile is completed
  if (isAuthenticated && user?.isPhoneVerified && !user?.isProfileCompleted) {
    // If profile is not completed, redirect to complete-profile page
    return <Navigate to="/complete-profile" />;
  }

  return <>{children}</>; // If authenticated, phone verified, and profile completed, render the protected route
};

export default ProtectedRoute;
