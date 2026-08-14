import { syncUserData, fetchCurrentUser, getAuthToken, clearAuthToken } from './apiService';

// Synchronize User Record to MongoDB Atlas Cloud Database
export async function saveUserToDB(userRecord) {
  if (!userRecord) return;

  const payload = {
    profileData: userRecord.profileData,
    assessmentScores: userRecord.assessmentScores,
    gamification: userRecord.gamification,
    roadmaps: userRecord.roadmaps
  };

  return await syncUserData(payload);
}

// Fetch Active User Profile & Cloud Data from MongoDB Atlas
export async function getUserFromDB(email) {
  const user = await fetchCurrentUser();
  if (user && user.email === email) {
    return user;
  }
  return null;
}

// Fetch All Users (deprecated for security: clients now only receive their own isolated cloud records)
export async function getAllUsersFromDB() {
  const user = await fetchCurrentUser();
  if (user && user.email) {
    return { [user.email]: user };
  }
  return {};
}

// Save Active Session Record (JWT token based)
export async function saveSessionToDB(sessionData) {
  if (!sessionData || !sessionData.isAuthenticated) {
    clearAuthToken();
  }
}

// Export Full User Cloud Data Backup (JSON File)
export async function exportDatabaseBackup() {
  const user = await fetchCurrentUser();
  const backup = {
    appName: 'RookX Career Decision Engine (MongoDB Cloud)',
    exportTimestamp: new Date().toISOString(),
    user: user || null
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `RookX_Cloud_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import & Restore User Cloud Backup
export async function importDatabaseBackup(jsonContent) {
  try {
    const backup = JSON.parse(jsonContent);
    if (backup && backup.user && typeof backup.user === 'object') {
      await saveUserToDB(backup.user);
      return true;
    }
  } catch (err) {
    console.error("Import Database Error:", err);
  }
  return false;
}
