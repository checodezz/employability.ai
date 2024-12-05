// profileRoutes.ts (or in your route handler file)

import express, { Request, Response } from "express";
import Profile from "../models/profile.model"; // Import Profile model
import { IProfile } from "../models/profile.model"; // Import the interface
import isAuthenticated from "../middleware/authMiddleware";

const router = express.Router();

router.use(isAuthenticated);

// Define the route directly in the same file
router.post("/create", async (req: Request, res: Response) => {
  const { userId, profileData } = req.body;

  try {
    // Check if a profile already exists for the user
    const existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      throw new Error("Profile already exists for this user.");
    }

    // Create a new profile document
    const newProfile = new Profile({
      userId, // Use userId from the request body
      ...profileData, // Spread the profile data into the new document
    });

    // Save the new profile to the database
    await newProfile.save();

    // Return a response with the created profile
    res.status(201).json({
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error: unknown) {
    const err = error as Error; // Type assertion, assuming error is always of type Error
    console.error("Error creating profile:", err);
    res
      .status(500)
      .json({ message: "Error creating profile", error: err.message });
  }
});

export default router;
