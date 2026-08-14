const TOKEN_KEY = 'rookx_auth_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function loginUser(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    console.error("Login API Error:", err);
    return { success: false, message: 'Network error connecting to authentication server.' };
  }
}

export async function registerUser(regData) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regData)
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    console.error("Register API Error:", err);
    return { success: false, message: 'Network error connecting to registration server.' };
  }
}

export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders()
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.user;
    }
    if (res.status === 401 || res.status === 403) {
      clearAuthToken();
    }
    return null;
  } catch (err) {
    console.error("Fetch Current User Error:", err);
    return null;
  }
}

export async function syncUserData(payload) {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/user/data', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.success || false;
  } catch (err) {
    console.error("Sync User Data Error:", err);
    return false;
  }
}

export async function changePassword(currentPass, newPass) {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPass, newPass })
    });
    const data = await res.json();
    return data.success || false;
  } catch (err) {
    console.error("Change Password API Error:", err);
    return false;
  }
}
