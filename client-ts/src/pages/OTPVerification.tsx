import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../config/firebaseClient";
import { useNavigate } from "react-router-dom";

const OTPVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("+91"); // Default country code for India
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>(""); // Stores OTP entered by user
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Initialize RecaptchaVerifier
  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // Invisible captcha for seamless UX
          callback: (response: any) => {
            console.log("Recaptcha solved:", response);
          },
          "expired-callback": () => {
            console.warn("Recaptcha expired. Please try again.");
          },
        },
        auth
      );
    }
  };

  // Send OTP to the user's phone number
  const handleSendOTP = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      initializeRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        throw new Error(
          "Invalid phone number format. Use +<country_code><number>"
        );
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setVerificationId(confirmationResult.verificationId);
      setSuccessMessage("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error.message);
      setErrorMessage(error.message || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify the OTP entered by the user
  const handleVerifyOTP = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!verificationId) {
        throw new Error("No verification ID found. Please resend the OTP.");
      }

      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await auth.signInWithCredential(credential);

      console.log("Phone number verified successfully:", userCredential.user);
      setSuccessMessage("Phone number verified successfully!");
      navigate("/dashboard"); // Redirect to the dashboard or another route
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
      setErrorMessage(error.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div id="recaptcha-container"></div> {/* Required for Recaptcha */}
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

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
