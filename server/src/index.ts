import express, { Application, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import connectDB from "./db/db";
import authRoutes from "./routes/authRoutes";
import "./config/passport"; // Import Passport configuration
import otpRoutes from "./routes/otpRoutes";

config();

const app: Application = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret", // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "", // Your MongoDB connection string
      collectionName: "sessions", // Optional, default is 'sessions'
      ttl: 14 * 24 * 60 * 60, // 14 days (optional, default)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "lax", // Helps protect against CSRF attacks
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);
app.use("/api/otp", otpRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the internet");
});

const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
