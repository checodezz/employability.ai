import admin from "firebase-admin";
// import admin from ""
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

/**
 * Interface for Firebase Admin credentials
 */
interface FirebaseAdminConfig {
  type: string;
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

// Validate and prepare Firebase Admin credentials
const firebaseConfig: FirebaseAdminConfig = {
  type: process.env.FIREBASE_TYPE || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"), // Replace escaped newlines
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
};

// Ensure required environment variables are present
if (
  !firebaseConfig.type ||
  !firebaseConfig.projectId ||
  !firebaseConfig.privateKey ||
  !firebaseConfig.clientEmail
) {
  throw new Error(
    "Missing Firebase Admin configuration environment variables."
  );
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export default admin;
