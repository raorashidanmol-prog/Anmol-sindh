import { getAppConfig } from '../config';
import { INITIAL_APPS, INITIAL_RESOURCES, INITIAL_SETTINGS } from '../data/initialData';
import { EducationalApp, EducationalResource, SiteSettings } from '../types';

// Safe fetch function matching the exact user specification
export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server returned HTML instead of JSON: ' + text.slice(0, 100));
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// Detect if running on GitHub Pages or static hosting without Node.js backend
export function isStaticHosting(): boolean {
  if (typeof window === 'undefined') return false;
  const config = getAppConfig();
  if (config.useBackend === false) return true;
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.includes('github.io') || window.location.protocol === 'file:') {
    return true;
  }
  return false;
}

const STORAGE_KEYS = {
  TOKEN: 'anmol_admin_token',
  USER: 'anmol_admin_user',
  PASSWORD: 'anmol_admin_password',
  RESOURCES: 'anmol_static_resources',
  SETTINGS: 'anmol_static_settings',
  APPS: 'anmol_static_apps',
  LOGS: 'anmol_audit_logs',
};

// Owner Authentication for Static Hosting (GitHub Pages)
export async function authenticateOwner(usernameOrEmail: string, passwordInput: string) {
  const config = getAppConfig();
  const inputUser = usernameOrEmail.trim().toLowerCase();
  const expectedUser = (config.adminUsername || 'admin').toLowerCase();
  const expectedEmail = (config.adminEmail || 'raorashid.anmol@gmail.com').toLowerCase();

  // Accept "admin", the owner email, or any username defined in config.js
  if (inputUser !== expectedUser && inputUser !== expectedEmail && inputUser !== 'admin') {
    throw new Error('Invalid Admin Username or Email (صحيح ايڊمن يوزرنيم يا ايميل داخل ڪريو)');
  }

  // Check against stored password or config password (default "Pakistani1")
  const currentPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD) || config.adminPassword || 'Pakistani1';

  if (passwordInput !== currentPassword) {
    throw new Error('Incorrect Password (غلط پاسورڊ. ٻيهر ڪوشش ڪريو)');
  }

  // Issue static session token
  const token = `static_owner_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const user = {
    id: 'owner_1',
    name: 'Rao Rashid (Website Owner)',
    email: config.adminEmail || 'raorashid.anmol@gmail.com',
    role: 'owner',
  };

  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  addAuditLog('ADMIN_LOGIN', 'Owner logged in successfully on GitHub Pages static storage');

  return { token, user };
}

// Session check
export function getStoredOwnerSession(): { token: string | null; user: any | null } {
  if (typeof window === 'undefined') return { token: null, user: null };
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  if (!token) return { token: null, user: null };
  try {
    const user = userJson ? JSON.parse(userJson) : { email: 'raorashid.anmol@gmail.com', name: 'Owner' };
    return { token, user };
  } catch {
    return { token, user: null };
  }
}

export function logoutOwnerSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// Password change
export async function changeOwnerPassword(currentPassword: string, newPassword: string) {
  const config = getAppConfig();
  const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD) || config.adminPassword || 'Pakistani1';

  if (currentPassword !== savedPassword) {
    throw new Error('Current password does not match (موجوده پاسورڊ غلط آهي)');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters (نئون پاسورڊ گهٽ ۾ گهٽ 6 اکر هجڻ گهرجي)');
  }

  localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
  addAuditLog('PASSWORD_CHANGED', 'Administrator updated master password in static storage');
  return true;
}

// Password recovery
export async function recoverOwnerPassword(recoveryCode: string, newPassword: string) {
  const config = getAppConfig();
  const validCode = config.recoveryCode || 'ANMOL-9988-SECURE';

  if (recoveryCode.trim() !== validCode) {
    throw new Error('Invalid Recovery Security Code (غلط سيڪيورٽي ڪوڊ)');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters (نئون پاسورڊ گهٽ ۾ گهٽ 6 اکر هجڻ گهرجي)');
  }

  localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
  addAuditLog('PASSWORD_RECOVERED', 'Administrator recovered master password using emergency key');
  return true;
}

// Site Settings
export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) return INITIAL_SETTINGS;
  try {
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  const current = getStoredSettings();
  const merged = { ...current, ...newSettings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  addAuditLog('SETTINGS_UPDATED', 'Updated website settings and branding in static storage');
  return merged;
}

// Educational Resources
export function getStoredResources(): EducationalResource[] {
  if (typeof window === 'undefined') return INITIAL_RESOURCES;
  const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  if (!raw) {
    // Seed initial resources into localStorage
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RESOURCES;
  } catch {
    return INITIAL_RESOURCES;
  }
}

export function saveStoredResource(resourceData: Partial<EducationalResource>): EducationalResource {
  const resources = getStoredResources();
  const now = new Date().toISOString();

  if (resourceData.id) {
    // Update existing
    const index = resources.findIndex((r) => r.id === resourceData.id);
    if (index >= 0) {
      const updated = {
        ...resources[index],
        ...resourceData,
        updated_at: now,
      } as EducationalResource;
      resources[index] = updated;
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
      addAuditLog('UPDATE_RESOURCE', `Updated resource: ${updated.title_sd || updated.title_en}`);
      return updated;
    }
  }

  // Create new
  const newId = `res_${Date.now()}`;
  const newResource: EducationalResource = {
    id: newId,
    title_sd: resourceData.title_sd || 'نئون مواد',
    title_ur: resourceData.title_ur || 'نیا مواد',
    title_en: resourceData.title_en || 'New Resource',
    description_sd: resourceData.description_sd || '',
    description_ur: resourceData.description_ur || '',
    description_en: resourceData.description_en || '',
    class_level: resourceData.class_level || '1',
    subject: resourceData.subject || 'Sindhi',
    language: resourceData.language || 'sd',
    category: resourceData.category || 'educational_videos',
    content_type: resourceData.content_type || 'video',
    thumbnail_url: resourceData.thumbnail_url || '/src/assets/images/video_gallery_1792756359556.jpg',
    media_url: resourceData.media_url || '',
    download_url: resourceData.download_url || resourceData.media_url || '',
    duration: resourceData.duration || '03:00',
    file_size: resourceData.file_size || '10 MB',
    file_format: resourceData.file_format || 'MP4',
    downloadable: resourceData.downloadable !== false,
    published: resourceData.published !== false,
    status: resourceData.status || 'published',
    views_count: 0,
    downloads_count: 0,
    sort_order: resources.length + 1,
    featured: !!resourceData.featured,
    created_at: now,
    updated_at: now,
    lyrics_sd: resourceData.lyrics_sd,
    lyrics_ur: resourceData.lyrics_ur,
    lyrics_en: resourceData.lyrics_en,
  };

  resources.unshift(newResource);
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  addAuditLog('CREATE_RESOURCE', `Created resource: ${newResource.title_sd || newResource.title_en}`);
  return newResource;
}

export function deleteStoredResource(id: string): boolean {
  const resources = getStoredResources();
  const filtered = resources.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(filtered));
  addAuditLog('DELETE_RESOURCE', `Deleted resource ID: ${id}`);
  return true;
}

// Educational Apps
export function getStoredApps(): EducationalApp[] {
  if (typeof window === 'undefined') return INITIAL_APPS;
  const raw = localStorage.getItem(STORAGE_KEYS.APPS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_APPS;
  } catch {
    return INITIAL_APPS;
  }
}

export function saveStoredApp(appData: Partial<EducationalApp>): EducationalApp {
  const apps = getStoredApps();

  if (appData.id) {
    const index = apps.findIndex((a) => a.id === appData.id);
    if (index >= 0) {
      const updated = { ...apps[index], ...appData } as EducationalApp;
      apps[index] = updated;
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
      addAuditLog('UPDATE_APP', `Updated app: ${updated.title_sd || updated.title_en}`);
      return updated;
    }
  }

  const newId = `app_${Date.now()}`;
  const newApp: EducationalApp = {
    id: newId,
    title_sd: appData.title_sd || 'نئين راند / ايپ',
    title_ur: appData.title_ur || 'نئی گیم / ایپ',
    title_en: appData.title_en || 'New App',
    description_sd: appData.description_sd || '',
    description_ur: appData.description_ur || '',
    description_en: appData.description_en || '',
    category: appData.category || 'General',
    icon: appData.icon || 'Gamepad2',
    thumbnail_url: appData.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg',
    first_screen_image: appData.first_screen_image || appData.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg',
    url: appData.url || '#',
    is_internal: appData.is_internal !== false,
    embeddable: appData.embeddable !== false,
    is_active: appData.is_active !== false,
    sort_order: apps.length + 1,
    badge: appData.badge || 'New',
  };

  apps.push(newApp);
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  addAuditLog('CREATE_APP', `Added app: ${newApp.title_sd || newApp.title_en}`);
  return newApp;
}

export function deleteStoredApp(id: string): boolean {
  const apps = getStoredApps();
  const filtered = apps.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(filtered));
  addAuditLog('DELETE_APP', `Deleted app ID: ${id}`);
  return true;
}

// Audit Logs
export function getStoredAuditLogs(): any[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAuditLog(action: string, details: string, resourceType: string = 'System') {
  if (typeof window === 'undefined') return;
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    resource_type: resourceType,
    details,
    user_email: getAppConfig().adminEmail || 'raorashid.anmol@gmail.com',
  };
  logs.unshift(newLog);
  // Keep last 100 logs
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
}
