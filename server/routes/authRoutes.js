import express from "express";
import axios from "axios";
import { auth } from "express-oauth2-jwt-bearer";

const router = express.Router();

const jwtCheck = auth({
  audience: "this is a unique identifier",
  issuerBaseURL: "https://dev-46ouvvvpqt7o5ovk.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

// Middleware to enforce JWT check
router.use(jwtCheck);

// Route to fetch user info
router.get("/userinfo", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1]; // Extract Bearer token

    const userInfoResponse = await axios.get(
      "https://dev-46ouvvvpqt7o5ovk.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({
      message: "User information retrieved successfully",
      user: userInfoResponse.data,
    });
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve user information",
    });
  }
});

export default router;
