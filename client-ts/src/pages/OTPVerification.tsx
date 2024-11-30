import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Assuming the store setup

const OTPVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("+91");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Get the user state from the store to determine if profile is completed
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If the user is authenticated but their profile is already complete, redirect them to the dashboard
    if (isAuthenticated && user?.isProfileCompleted) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSendOTP = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Simulate OTP sending
      setVerificationId("dummyVerificationId"); // Fake verification ID for demo
      setSuccessMessage("OTP sent successfully!");
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Simulate OTP verification
      setSuccessMessage("Phone number verified successfully!");

      // Assuming verification is successful, navigate to complete profile
      navigate("/complete-profile");
    } catch (error) {
      setErrorMessage("Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipForNow = () => {
    // If the user skips OTP, navigate to /complete-profile or /dashboard depending on profile status
    if (user?.isProfileCompleted) {
      // navigate("/dashboard"); // Redirect to dashboard if profile is already completed
    } else {
      navigate("/complete-profile"); // Otherwise, navigate to profile completion page
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md p-4 shadow-lg rounded bg-white">
        <h2 className="text-center text-lg font-semibold mb-4">
          Phone Number Verification
        </h2>

        {!verificationId ? (
          <div>
            <label htmlFor="phoneNumber" className="block mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="+91XXXXXXXXXX"
            />
            <Button
              onClick={handleSendOTP}
              className="w-full"
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="otp" className="block mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Submit"}
            </Button>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </div>
        )}

        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        {/* Skip for now button to proceed without OTP */}
        <Button
          onClick={handleSkipForNow}
          className="w-full mt-4"
          variant="outline"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
