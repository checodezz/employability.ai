import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // For storing hashed passwords if using custom login
  },
  auth0Id: {
    type: String, // Optional: for Auth0 users
  },
  role: {
    type: String,
    enum: ["candidate", "employer", "recruiter"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // Fields for Candidates
  resume: {
    type: String, // URL to uploaded resume
  },
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  // Fields for Employers/Recruiters
  company: {
    name: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

// Export the model
const User = mongoose.model("User", userSchema);
export default User;
