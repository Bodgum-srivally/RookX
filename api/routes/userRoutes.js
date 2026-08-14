import express from 'express';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { localUsersStore } from './authRoutes.js';

const router = express.Router();

// GET /api/user/data - Fetch authenticated user's complete data bundle
router.get('/data', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const isDbConnected = await connectDB();

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
      }
      return res.json({
        success: true,
        data: {
          profileData: user.profileData,
          assessmentScores: user.assessmentScores,
          gamification: user.gamification,
          roadmaps: user.roadmaps || {}
        }
      });
    } else {
      const user = localUsersStore.get(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
      }
      return res.json({
        success: true,
        data: {
          profileData: user.profileData,
          assessmentScores: user.assessmentScores,
          gamification: user.gamification,
          roadmaps: user.roadmaps || {}
        }
      });
    }
  } catch (err) {
    console.error("Fetch User Data Error:", err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user data.' });
  }
});

// PUT /api/user/data - Sync updated profile, assessment, gamification, or roadmap data to MongoDB
router.put('/data', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { profileData, assessmentScores, gamification, roadmaps } = req.body;
    const isDbConnected = await connectDB();

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
      }

      if (profileData) user.profileData = { ...user.profileData, ...profileData };
      if (assessmentScores) user.assessmentScores = { ...user.assessmentScores, ...assessmentScores };
      if (gamification) user.gamification = { ...user.gamification, ...gamification };
      if (roadmaps) user.roadmaps = { ...user.roadmaps, ...roadmaps };

      user.markModified('profileData');
      user.markModified('assessmentScores');
      user.markModified('gamification');
      user.markModified('roadmaps');

      await user.save();

      return res.json({
        success: true,
        message: 'Data successfully synced to MongoDB cloud.',
        user: user.toPublicJSON()
      });
    } else {
      const user = localUsersStore.get(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
      }

      if (profileData) user.profileData = { ...user.profileData, ...profileData };
      if (assessmentScores) user.assessmentScores = { ...user.assessmentScores, ...assessmentScores };
      if (gamification) user.gamification = { ...user.gamification, ...gamification };
      if (roadmaps) user.roadmaps = { ...user.roadmaps, ...roadmaps };

      localUsersStore.set(email, user);

      const { passwordHash: _, ...publicUser } = user;
      return res.json({
        success: true,
        message: 'Data synced to local memory store.',
        user: publicUser
      });
    }
  } catch (err) {
    console.error("Sync User Data Error:", err);
    return res.status(500).json({ success: false, message: 'Failed to sync user data.' });
  }
});

export default router;
