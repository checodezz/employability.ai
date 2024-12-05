// src/routes/uploadResume.ts

import express, { Request, Response, NextFunction } from "express";
import upload from "../middleware/multerConfig"; // Multer configuration
import multer from "multer";
import path, { parse } from "path";
import fs from "fs";
import { parseResumeWithOpenAI } from "../utils/parseResumeStructured"; // Import the structured parsing function
import User from "../models/user.model"; // Import User model to update user data
import { parseResume } from "../utils/parseResume";
import isAuthenticated from "../middleware/authMiddleware";

const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Authentication check middleware
// router.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req.isAuthenticated());

//   if (req.isAuthenticated()) {
//     // Adjust based on your authentication setup
//     return next();
//   }
//   res.status(401).json({ error: "Unauthorized" });
// });

router.use(isAuthenticated);

// POST /api/upload-resume
router.post(
  "/upload-resume",
  upload.single("resume"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      const userId = (req.user as any)?._id; // Adjust based on your user object structure

      if (!file) {
        res.status(400).json({ error: "No file uploaded." });
        return; // Early exit
      }

      if (!userId) {
        res.status(400).json({ error: "User ID is required." });
        return; // Early exit
      }

      // Step 1: Read the uploaded file's path
      const filePath = path.resolve(file.path);

      const parsedText = await parseResume(filePath);
      //   console.log(parsedText);

      // Step 2: Parse the resume using OpenAI's Structured Outputs
      const parsedData = await parseResumeWithOpenAI(parsedText.fullText);

      // Step 3: Save parsedData to the user profile
      await User.findByIdAndUpdate(userId, { parsedResume: parsedData });

      // Step 4: Respond with file details and parsed data
      res.status(200).json({
        message: "File uploaded and parsed successfully.",
        file: {
          originalName: file.originalname,
          fileName: file.filename,
          path: path.posix.normalize(file.path.replace(/\\/g, "/")), // Normalize path to remove backslashes
          size: file.size,
          mimeType: file.mimetype,
        },
        parsedData, // Include parsed resume data
      });
    } catch (error: any) {
      console.error("Error uploading resume:", error);

      // Handle Multer-specific errors
      if (error instanceof multer.MulterError) {
        res.status(400).json({ error: error.message });
        return;
      }

      // Handle invalid file type error
      if (error.message === "Invalid file type. Only PDF is allowed.") {
        res.status(400).json({ error: error.message });
        return;
      }

      // Handle parsing errors
      if (error.message.includes("Failed to parse resume")) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "Server error while uploading resume." });
    }
  }
);

export default router;
