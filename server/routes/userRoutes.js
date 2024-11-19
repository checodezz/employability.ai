import express from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import User from "../models/user.model.js"; // Your MongoDB User model

const router = express.Router();

// Route for manual user registration
router.post("/register", async (req, res) => {
  const { email, password, name, role, resume, company } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to your database
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
      ...(role === "candidate" && { resume }),
      ...(role !== "candidate" && { company }),
    });
    await newUser.save();

    // Request a token from Auth0
    const auth0Domain = "dev-46ouvvvpqt7o5ovk.us.auth0.com";
    const clientId = "uC5YIL6246rHPbQzdYWZOP7GYB43e9dQ";
    const clientSecret =
      "1AjfzPjzNxC2qW9B_rvfVzgGv5pbd2k-C1EzX4nFX_LQGYCRC2mzOu9mMiu-hA01";
    const audience = "this is a unique identifier";

    const tokenResponse = await axios.post(
      `https://${auth0Domain}/oauth/token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        audience,
        grant_type: "client_credentials",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Return the user and token
    res.status(201).json({
      user: newUser,
      token: accessToken,
      message: "Signup successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Route for manual login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens using Auth0
    const auth0Domain = "dev-46ouvvvpqt7o5ovk.us.auth0.com";
    const clientId = "uC5YIL6246rHPbQzdYWZOP7GYB43e9dQ";
    const clientSecret =
      "1AjfzPjzNxC2qW9B_rvfVzgGv5pbd2k-C1EzX4nFX_LQGYCRC2mzOu9mMiu-hA01";
    const audience = "this is a unique identifier";

    const tokenResponse = await axios.post(
      `https://${auth0Domain}/oauth/token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        username: email,
        password, // Pass plaintext password to Auth0
        realm: "Username-Password-Authentication",
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        audience,
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    res.json({
      user,
      accessToken: access_token,
      idToken: id_token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(
      "Error during manual login:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
