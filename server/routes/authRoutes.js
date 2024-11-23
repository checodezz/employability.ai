// server/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/user.model.js"; // Adjust the path as needed

const router = express.Router();

// Initialize Passport strategies
import "../config/passport.js"; // Ensure Passport strategies are configured

/**
 * Manual Authentication Routes
 */

// Route for manual user registration
router.post("/register", async (req, res) => {
  const { email, password, name, role, phoneNumber, resume, company } =
    req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
      phoneNumber,
      isPhoneVerified: false, // Default to false
      ...(role === "candidate" && { resume }),
      ...(role !== "candidate" && { company }),
    });

    await newUser.save();

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
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration failed." });
  }
});

// Route for manual login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during login:", err);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Login failed." });
    }
    req.logIn(user, (err) => {
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
  })(req, res, next);
});

// Route for logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed." });
    }
    res.json({ message: "Logout successful." });
  });
});

/**
 * OAuth Authentication Routes
 */

// Initiate Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect to login on failure
    successRedirect: "/dashboard", // Redirect to dashboard on success
    session: true, // Maintain session
  })
);

// Initiate GitHub OAuth
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Handle GitHub OAuth callback
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login", // Redirect to login on failure
    successRedirect: "/dashboard", // Redirect to dashboard on success
    session: true, // Maintain session
  })
);

// Initiate LinkedIn OAuth flow
router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    scope: ["r_liteprofile", "r_emailaddress"],
  })
);

// Handle LinkedIn OAuth callback
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    failureRedirect: "/login", // Redirect to login on failure
    successRedirect: "/dashboard", // Redirect to dashboard on success
    session: true, // Maintain session
  })
);

export default router;
