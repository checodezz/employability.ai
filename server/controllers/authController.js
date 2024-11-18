/* import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Candidate from "../models/candidate.model.js";
import Company from "../models/company.model.js";

// Generate a JWT token
const generateToken = (id, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment variables");
  }
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Candidate
const registerCandidate = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if candidate already exists
    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
      return res.status(400).json({ message: "Candidate already exists" });
    }

    // Hash password
    console.log("Plaintext Password (Before Hashing):", password);
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    console.log("Hashed Password (Registration):", hashedPassword);

    // Save candidate
    const newCandidate = await Candidate.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone,
    });

    console.log("Saved Candidate Record:", newCandidate);

    // Generate JWT token
    const token = generateToken(newCandidate._id, newCandidate.email);

    res.status(201).json({
      message: "Candidate registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error in registerCandidate:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Register Company
const registerCompany = async (req, res) => {
  try {
    const { companyName, companyCode, email, password, phone } = req.body;

    if (!companyName || !companyCode || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if company already exists
    const companyExists = await Company.findOne({ companyCode });
    if (companyExists) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Hash password
    console.log("Plaintext Password (Before Hashing):", password);
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    console.log("Hashed Password (Registration):", hashedPassword);

    // Save company
    const newCompany = await Company.create({
      companyName,
      companyCode,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone,
    });

    console.log("Saved Company Record:", newCompany);

    // Generate JWT token
    const token = generateToken(newCompany._id, newCompany.email);

    res.status(201).json({
      message: "Company registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error in registerCompany:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User (Generic for Candidate and Company)
const loginUser = async (req, res, userType) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user (Candidate or Company)
    const user =
      userType === "candidate"
        ? await Candidate.findOne({ email: email.trim().toLowerCase() })
        : await Company.findOne({ email: email.trim().toLowerCase() });

    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User Doesn't exist with this credentials." });
    }

    // Debug Logs
    console.log("Plaintext Password (Login):", password);
    console.log("Hashed Password from DB (Login):", user.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(`Error in login${userType}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Candidate
const loginCandidate = (req, res) => loginUser(req, res, "candidate");

// Login Company
const loginCompany = (req, res) => loginUser(req, res, "company");

// Middleware to Protect Routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to the request
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

// Example Protected Route
const protectedRoute = (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
    user: req.user,
  });
};

// Export Functions
export default {
  registerCandidate,
  registerCompany,
  loginCandidate,
  loginCompany,
  protect,
  protectedRoute,
};


 */