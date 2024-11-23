import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
// import OTPVerification from "./components/OTPVerification";
import OTPVerification from "./pages/OTPVerification";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginSignupForm />} />
        <Route path="/verify-phone" element={<OTPVerification />} />
      </Routes>
    </>
  );
};

export default App;
