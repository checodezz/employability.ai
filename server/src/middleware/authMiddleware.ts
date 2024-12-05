// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

// Authentication middleware to check if the user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

export default isAuthenticated;
