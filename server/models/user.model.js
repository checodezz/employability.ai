// server/models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String, // Only for manual signup
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "recruiter"],
      default: "candidate",
    },
    resume: {
      type: String, // Candidate-specific
    },
    company: {
      name: String, // Employer/Recruiter-specific
      website: String,
    },
    googleId: {
      type: String, // Google OAuth
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String, // GitHub OAuth
      unique: true,
      sparse: true,
    },
    linkedinId: {
      type: String, // LinkedIn OAuth
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
