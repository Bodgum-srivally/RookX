import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'rookx_super_secret_jwt_key_2026_change_in_production';

// Memory fallback store if MongoDB Atlas is not yet connected locally
const localUsersStore = new Map();

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id || user.email, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, academic } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDbConnected = await connectDB();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isDbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const initialProfile = {
        fullName: fullName.trim(),
        email: normalizedEmail,
        isOnboarded: false,
        academic: academic || { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
        skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
        interests: ['tech', 'data'],
        preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
        constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
      };

      const newUser = new User({
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        profileData: initialProfile
      });

      await newUser.save();
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        token,
        user: newUser.toPublicJSON()
      });
    } else {
      // Memory Store Fallback for offline local dev without MongoDB Atlas credentials
      if (localUsersStore.has(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const userRecord = {
        _id: 'local_' + Date.now(),
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        profileData: {
          fullName: fullName.trim(),
          email: normalizedEmail,
          isOnboarded: false,
          academic: academic || { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
          skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
          interests: ['tech', 'data'],
          preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
          constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
        },
        assessmentScores: {
          skills: { aptitude: 65, coding: 60, sql: 45, mathematics: 50, communication: 70 },
          interests: { software_engineer: 80, data_scientist: 60, cybersecurity_analyst: 40, ui_ux_designer: 30 }
        },
        gamification: {
          xp: 450,
          unlockedBadges: [],
          triedSimulations: [],
          completedTasks: [],
          highestSimScore: 0
        },
        roadmaps: {}
      };

      localUsersStore.set(normalizedEmail, userRecord);
      const token = generateToken(userRecord);
      const { passwordHash: _, ...publicUser } = userRecord;

      return res.status(201).json({
        success: true,
        token,
        user: publicUser
      });
    }
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDbConnected = await connectDB();

    if (isDbConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: user.toPublicJSON()
      });
    } else {
      // Memory Store Fallback
      const user = localUsersStore.get(normalizedEmail);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      const token = generateToken(user);
      const { passwordHash: _, ...publicUser } = user;
      return res.json({
        success: true,
        token,
        user: publicUser
      });
    }
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const isDbConnected = await connectDB();

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User record not found.' });
      }
      return res.json({
        success: true,
        user: user.toPublicJSON()
      });
    } else {
      const user = localUsersStore.get(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User record not found.' });
      }
      const { passwordHash: _, ...publicUser } = user;
      return res.json({
        success: true,
        user: publicUser
      });
    }
  } catch (err) {
    console.error("Auth Me Error:", err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { currentPass, newPass } = req.body;

    if (!currentPass || !newPass || newPass.length < 4) {
      return res.status(400).json({ success: false, message: 'Valid current and new password are required.' });
    }

    const isDbConnected = await connectDB();

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPass, salt);
      await user.save();

      return res.json({ success: true, message: 'Password updated successfully.' });
    } else {
      const user = localUsersStore.get(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPass, salt);
      localUsersStore.set(email, user);

      return res.json({ success: true, message: 'Password updated successfully.' });
    }
  } catch (err) {
    console.error("Change Password Error:", err);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

export { localUsersStore };
export default router;
