import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
// import OTPVerification from "./components/OTPVerification";
import OTPVerification from "./pages/OTPVerification";
import CompleteProfile from "./pages/CompleteProfile.tsx";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginSignupForm />} />
        <Route path="/verify-phone" element={<OTPVerification />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </>
  );
};

export default App;
