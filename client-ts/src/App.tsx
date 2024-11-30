import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
import OTPVerification from "./pages/OTPVerification";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import Dashboard from "./pages/Dashboard.tsx"; // Assuming you have a Dashboard page
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/slices/authSlice.ts";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { status, isAuthenticated } = useSelector((state: any) => state.auth);

  React.useEffect(() => {
    if (!isAuthenticated && status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, status]);

  return (
    <Routes>
      <Route path="/" element={<LoginSignupForm />} />

      {/* Routes for phone verification and profile completion do not require ProtectedRoute */}
      <Route path="/verify-phone" element={<OTPVerification />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Protected Route: Dashboard is protected and requires phone verification and profile completion */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* <Dashboard /> */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
