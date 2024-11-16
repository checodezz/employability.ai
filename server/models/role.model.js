import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      enum: ["admin", "recruiter", "employee"], // Example roles, you can add more if needed
    },
    description: {
      type: String,
      required: [true, "Role description is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;
