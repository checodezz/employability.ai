// routes/authRoutes.ts

import express, { Request, Response, NextFunction, Router } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";
const router: Router = express.Router();

// Initialize Passport strategies
import "../config/passport"; // Ensure Passport strategies are configured

interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
  role: string;
  phoneNumber?: string;
  resume?: string;
  company?: {
    name: string;
    website: string;
  };
}

router.post("/test", (req: Request, res: Response) => {
  res.json({ message: "Test route is working!" });
});

router.get("/auth/status", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

router.post(
  "/register",
  async (
    req: Request<Record<string, any>, any, RegisterRequestBody>,
    res: Response
  ): Promise<void> => {
    const { email, password, name, role, phoneNumber, resume, company } =
      req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email is already registered." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: IUser = new User({
        email,
        password: hashedPassword,
        name,
        role,
        phoneNumber,
        isPhoneVerified: false,
        ...(role === "candidate" && { resume }),
        ...(role !== "candidate" && { company }),
      });

      await newUser.save();

      // Log the user in and create a session
      req.login(newUser, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }

        res.status(201).json({
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            isPhoneVerified: newUser.isPhoneVerified,
          },
          message: "Signup successful. Phone verification required.",
        });
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Registration failed." });
    }
  }
);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (err: Error | null, user: IUser | false, info: { message?: string }) => {
      if (err) {
        console.error("Error during login:", err);
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || "Login failed." });
      }
      req.logIn(user, (err: any) => {
        if (err) {
          console.error("Error logging in user:", err);
          return next(err);
        }
        res.json({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          message: "Login successful.",
        });
      });
    }
  )(req, res, next);
});

router.post("/logout", (req: Request, res: Response) => {
  req.logout((err: any) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed." });
    }
    res.json({ message: "Logout successful." });
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect to login on failure
    failureMessage: true, // Enable failure messages
  }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "true" })
);

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

export default router;
