/**
 * ANMOL SINDH | Admin Authentication & Storage Manager
 * Compatible with GitHub Pages (Static Hosting) & Full-Stack Node.js
 */

// Safe Fetch Wrapper - Prevents "Unexpected token '<', <html> is not valid JSON" error
async function safeFetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.error || `Server returned error status ${res.status}`);
    }
    return data;
  } catch (e) {
    if (text.trim().startsWith('<') || text.includes('<html')) {
      throw new Error("Server returned HTML instead of JSON: " + text.slice(0, 100));
    }
    throw e;
  }
}

// Check if running on GitHub Pages or static host
function isStaticHost() {
  if (typeof window === 'undefined') return false;
  const config = window.APP_CONFIG || {};
  if (config.useBackend === false) return true;
  const host = window.location.hostname.toLowerCase();
  return host.includes('github.io') || window.location.protocol === 'file:';
}

/**
 * Authenticate as Owner
 * Handles both GitHub Pages static storage and optional backend API
 */
async function authenticateAsOwner(usernameOrEmail, password) {
  const config = window.APP_CONFIG || {
    adminUsername: 'admin',
    adminEmail: 'raorashid.anmol@gmail.com',
    adminPassword: 'Pakistani1',
    recoveryCode: 'ANMOL-9988-SECURE',
  };

  const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
  const targetUser = (config.adminUsername || 'admin').toLowerCase();
  const targetEmail = (config.adminEmail || 'raorashid.anmol@gmail.com').toLowerCase();

  // Validate username / email
  if (cleanUser !== targetUser && cleanUser !== targetEmail && cleanUser !== 'admin') {
    throw new Error('Invalid Admin Username or Email (صحيح ايڊمن يوزرنيم يا ايميل داخل ڪريو)');
  }

  // If Static Hosting (GitHub Pages), do NOT call /api/login which returns 404 HTML
  if (isStaticHost()) {
    const savedPassword = localStorage.getItem('anmol_admin_password') || config.adminPassword || 'Pakistani1';
    if (password !== savedPassword) {
      throw new Error('Incorrect Password (غلط پاسورڊ. ٻيهر ڪوشش ڪريو)');
    }

    const token = 'static_owner_' + Date.now();
    const user = {
      id: 'owner_1',
      name: 'Rao Rashid (Website Owner)',
      email: config.adminEmail || 'raorashid.anmol@gmail.com',
      role: 'owner',
    };

    localStorage.setItem('anmol_admin_token', token);
    localStorage.setItem('anmol_admin_user', JSON.stringify(user));
    return { token, user };
  }

  // If Backend is enabled, use safe fetch with automatic fallback
  try {
    const data = await safeFetchJson('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanUser, password }),
    });

    localStorage.setItem('anmol_admin_token', data.token);
    return data;
  } catch (err) {
    // If backend 404s with HTML or is unreachable, fallback to static auth seamlessly
    if (err.message.includes('HTML instead of JSON') || err.message.includes('404')) {
      console.warn('Backend unavailable or returned HTML 404. Falling back to static owner authentication.');
      const savedPassword = localStorage.getItem('anmol_admin_password') || config.adminPassword || 'Pakistani1';
      if (password === savedPassword) {
        const token = 'static_owner_' + Date.now();
        const user = {
          id: 'owner_1',
          name: 'Rao Rashid (Website Owner)',
          email: config.adminEmail || 'raorashid.anmol@gmail.com',
          role: 'owner',
        };
        localStorage.setItem('anmol_admin_token', token);
        localStorage.setItem('anmol_admin_user', JSON.stringify(user));
        return { token, user };
      }
    }
    throw err;
  }
}

// Export for global browser window usage
window.authenticateAsOwner = authenticateAsOwner;
window.safeFetchJson = safeFetchJson;
window.isStaticHost = isStaticHost;
