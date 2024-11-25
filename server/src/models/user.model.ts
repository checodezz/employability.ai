import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string; // Optional, for manual signup
  name: string;
  role: "candidate" | "employer" | "recruiter";
  resume?: string; // Candidate-specific
  company?: {
    name?: string; // Employer/Recruiter-specific
    website?: string;
  };
  googleId?: string; // Google OAuth
  githubId?: string; // GitHub OAuth
  linkedinId?: string; // LinkedIn OAuth
  phoneNumber?: string;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
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
      name: { type: String }, // Employer/Recruiter-specific
      website: { type: String },
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

// Define the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
