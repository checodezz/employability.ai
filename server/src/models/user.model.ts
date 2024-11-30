import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string; // Optional, for manual signup
  name: string;
  role: "candidate" | "employer" | "recruiter";
  resume?: string; // Candidate-specific
  company?: {
    name?: string;
    website?: string;
  };
  googleId?: string;
  githubId?: string;
  linkedinId?: string;
  phoneNumber?: string;
  isPhoneVerified: boolean;
  isProfileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "employer"],
      default: "candidate",
    },
    resume: {
      type: String,
    },
    company: {
      name: { type: String },
      website: { type: String },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    linkedinId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      // unique: true,
      sparse: true,
    },
    isProfileCompleted: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
