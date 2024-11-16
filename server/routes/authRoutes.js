import express from "express"
const router = express.Router();
// import authController from "../controllers/authController"  

import authController from "../controllers/authController.js"

// Candidate Routes
router.post('/register/candidate', authController.registerCandidate);
router.post('/login/candidate', authController.loginCandidate);

// Company Routes
router.post('/register/company', authController.registerCompany);
router.post('/login/company', authController.loginCompany);

// Protected Route
router.get('/protected', authController.protect, authController.protectedRoute);

// module.exports = router;
export default router