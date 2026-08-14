import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    profileData: {
      type: Object,
      default: {
        academic: { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
        skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
        interests: ['tech', 'data'],
        preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
        constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' },
        isOnboarded: false
      }
    },
    assessmentScores: {
      type: Object,
      default: {
        skills: { aptitude: 65, coding: 60, sql: 45, mathematics: 50, communication: 70 },
        interests: { software_engineer: 80, data_scientist: 60, cybersecurity_analyst: 40, ui_ux_designer: 30 }
      }
    },
    gamification: {
      type: Object,
      default: {
        xp: 450,
        unlockedBadges: [],
        triedSimulations: [],
        completedTasks: [],
        highestSimScore: 0
      }
    },
    roadmaps: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Transform returned object to exclude passwordHash
UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
