// Persistent IndexedDB Database Engine for RookX (Zero Data Loss Protection)

const DB_NAME = 'RookX_Career_Database';
const DB_VERSION = 1;
const STORES = {
  USERS: 'users_store',
  ASSESSMENTS: 'assessments_store',
  ROADMAPS: 'roadmaps_store',
  SESSIONS: 'sessions_store'
};

// Initialize or open IndexedDB Connection
export function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn("IndexedDB unavailable, using redundant localStorage storage.");
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'email' });
      }
      if (!db.objectStoreNames.contains(STORES.ASSESSMENTS)) {
        db.createObjectStore(STORES.ASSESSMENTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.ROADMAPS)) {
        db.createObjectStore(STORES.ROADMAPS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        db.createObjectStore(STORES.SESSIONS, { keyPath: 'key' });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.error("IndexedDB Open Error:", e.target.error);
      resolve(null);
    };
  });
}

// Save User Record to Database (IndexedDB + localStorage Double-Write Redundancy)
export async function saveUserToDB(userRecord) {
  if (!userRecord || !userRecord.email) return;

  // 1. Transactional Write to IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORES.USERS, 'readwrite');
      tx.objectStore(STORES.USERS).put(userRecord);
    }
  } catch (err) {
    console.error("IndexedDB Write Error:", err);
  }

  // 2. Redundant Mirror Write to localStorage
  try {
    const users = JSON.parse(localStorage.getItem('rookx_users_db') || '{}');
    users[userRecord.email] = userRecord;
    localStorage.setItem('rookx_users_db', JSON.stringify(users));
  } catch (e) {
    console.error("localStorage Mirror Error:", e);
  }
}

// Fetch User Record from Database
export async function getUserFromDB(email) {
  if (!email) return null;

  try {
    const db = await openDB();
    if (db) {
      const record = await new Promise((resolve) => {
        const tx = db.transaction(STORES.USERS, 'readonly');
        const req = tx.objectStore(STORES.USERS).get(email);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if (record) return record;
    }
  } catch (err) {}

  // Fallback to localStorage mirror
  const users = JSON.parse(localStorage.getItem('rookx_users_db') || '{}');
  return users[email] || null;
}

// Fetch All Users from Database
export async function getAllUsersFromDB() {
  try {
    const db = await openDB();
    if (db) {
      const list = await new Promise((resolve) => {
        const tx = db.transaction(STORES.USERS, 'readonly');
        const req = tx.objectStore(STORES.USERS).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      if (list && list.length > 0) {
        const map = {};
        list.forEach(u => { map[u.email] = u; });
        return map;
      }
    }
  } catch (err) {}

  return JSON.parse(localStorage.getItem('rookx_users_db') || '{}');
}

// Save Active Session Record
export async function saveSessionToDB(sessionData) {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORES.SESSIONS, 'readwrite');
      tx.objectStore(STORES.SESSIONS).put({ key: 'active_session', ...sessionData });
    }
  } catch (err) {}

  localStorage.setItem('rookx_session', JSON.stringify(sessionData));
}

// Export Full Database Backup (JSON File)
export async function exportDatabaseBackup() {
  const users = await getAllUsersFromDB();
  const session = localStorage.getItem('rookx_session');
  const backup = {
    appName: 'RookX Career Decision Engine',
    databaseVersion: DB_VERSION,
    exportTimestamp: new Date().toISOString(),
    users,
    session
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `RookX_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import & Restore Database Backup
export async function importDatabaseBackup(jsonContent) {
  try {
    const backup = JSON.parse(jsonContent);
    if (backup && backup.users && typeof backup.users === 'object') {
      for (const email in backup.users) {
        await saveUserToDB(backup.users[email]);
      }
      if (backup.session) {
        try {
          const sessionObj = typeof backup.session === 'string' ? JSON.parse(backup.session) : backup.session;
          await saveSessionToDB(sessionObj);
        } catch (e) {}
      }
      return true;
    }
  } catch (err) {
    console.error("Import Database Error:", err);
  }
  return false;
}
