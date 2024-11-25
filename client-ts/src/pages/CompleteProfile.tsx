import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { RootState } from "../store";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CompleteProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Access user data from Redux

  console.log(user);

  const navigate = useNavigate();

  // Additional fields can be added here
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [linkedinProfile, setLinkedinProfile] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Example: Submit data to the backend or update Redux
    const profileData = {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber,
      address,
      linkedinProfile,
    };

    console.log("Profile data submitted:", profileData);

    navigate("/next-step");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 shadow-lg rounded bg-white">
        <h2 className="text-center text-lg font-semibold mb-4">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              disabled
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="+91XXXXXXXXXX"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Enter your address"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">LinkedIn Profile</label>
            <input
              type="url"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          <Button type="submit" className="w-full" variant="default">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
