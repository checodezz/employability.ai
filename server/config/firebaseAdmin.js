import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newlines
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export default admin;
