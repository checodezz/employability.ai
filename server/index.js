// Import Statements
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import connectDB from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passport.js"; // Import Passport configuration
import otpRoutes from "./routes/otpRoutes.js";

// Load environment variables
config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret", // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
      collectionName: "sessions", // Optional, default is 'sessions'
      ttl: 14 * 24 * 60 * 60, // 14 days (optional, default)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: false, // Set to true if using HTTPS
      sameSite: "lax", // Helps protect against CSRF attacks
    },
  })
);

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
// app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api/otp", otpRoutes);
// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the internet");
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
