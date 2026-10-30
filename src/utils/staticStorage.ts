import { getAppConfig } from '../config';
import { INITIAL_APPS, INITIAL_RESOURCES, INITIAL_SETTINGS } from '../data/initialData';
import { EducationalApp, EducationalResource, FolderCategory, SiteSettings } from '../types';

// Safe fetch function matching the exact user specification
export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
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
  FOLDERS: 'anmol_static_folders',
  SEEDED: 'anmol_has_seeded_v2',
};

// Default System Folders for the Horizontal Button Bar
export const DEFAULT_FOLDERS: FolderCategory[] = [
  {
    id: 'all',
    name_sd: 'سمورو مواد (All Classes)',
    name_ur: 'تمام مواد (All Classes)',
    name_en: 'All Content',
    icon: 'Layers',
    color: '#00e599',
    isSystem: true,
    sort_order: 1,
  },
  {
    id: 'books',
    name_sd: '📚 ڪتاب ۽ پي ڊي ايف (Books)',
    name_ur: 'کتب اور پی ڈی ایف',
    name_en: 'Books & PDFs',
    icon: 'BookOpen',
    color: '#38bdf8',
    isSystem: true,
    sort_order: 2,
  },
  {
    id: 'games',
    name_sd: '🎮 تعليمي رانديون (Games)',
    name_ur: 'تعلیمی کھیل',
    name_en: 'Games',
    icon: 'Gamepad2',
    color: '#c084fc',
    isSystem: true,
    sort_order: 3,
  },
  {
    id: 'videos',
    name_sd: '🎬 وڊيوز ۽ نظمون (Videos)',
    name_ur: 'ویڈیوز اور نظمیں',
    name_en: 'Videos & Poems',
    icon: 'Video',
    color: '#fbbf24',
    isSystem: true,
    sort_order: 4,
  },
  {
    id: 'apps',
    name_sd: '📱 ايپس ۽ اوزار (Apps)',
    name_ur: 'ایپس اور ٹولز',
    name_en: 'Educational Apps',
    icon: 'Smartphone',
    color: '#34d399',
    isSystem: true,
    sort_order: 5,
  },
  {
    id: 'extra',
    name_sd: '✨ اضافي مواد (Extra)',
    name_ur: 'اضافی مواد',
    name_en: 'Extra Resources',
    icon: 'Sparkles',
    color: '#f472b6',
    isSystem: true,
    sort_order: 6,
  },
];

// Helper to resolve which folder an item belongs to
export function resolveItemFolder(item: {
  folder?: string;
  content_type?: string;
  category?: string;
  url?: string;
  media_url?: string;
}): string {
  if (item.folder && item.folder.trim()) {
    return item.folder.trim();
  }
  const type = (item.content_type || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const url = (item.url || item.media_url || '').toLowerCase();

  if (type === 'video' || cat.includes('video') || cat.includes('poem') || cat.includes('story') || url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4')) {
    return 'videos';
  }
  if (type === 'pdf' || cat.includes('pdf') || cat.includes('book') || cat.includes('worksheet') || cat.includes('lesson') || url.endsWith('.pdf')) {
    return 'books';
  }
  if (cat.includes('game') || cat.includes('math') || cat.includes('quiz') || url.includes('math') || url.includes('quiz')) {
    return 'games';
  }
  if (cat.includes('app') || cat.includes('test') || cat.includes('assessment') || cat.includes('language') || url.includes('test-maker')) {
    return 'apps';
  }
  return 'extra';
}

// Detect media type for InAppViewer
export function detectMediaType(
  url: string,
  explicitType?: string
): 'youtube' | 'video' | 'pdf' | 'game' | 'app' | 'website' | 'other' {
  if (explicitType === 'youtube') return 'youtube';
  if (explicitType === 'pdf') return 'pdf';
  if (explicitType === 'video') return 'video';
  if (explicitType === 'game') return 'game';
  if (explicitType === 'app') return 'app';

  const cleanUrl = (url || '').trim().toLowerCase();

  // YouTube detection
  if (
    cleanUrl.includes('youtube.com/watch') ||
    cleanUrl.includes('youtu.be/') ||
    cleanUrl.includes('youtube.com/embed/') ||
    cleanUrl.includes('youtube.com/shorts/')
  ) {
    return 'youtube';
  }

  // PDF detection
  if (cleanUrl.endsWith('.pdf') || cleanUrl.includes('.pdf?') || cleanUrl.includes('/pdf/')) {
    return 'pdf';
  }

  // Direct video files
  if (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.mkv') ||
    cleanUrl.endsWith('.3gp') ||
    cleanUrl.endsWith('.m4v')
  ) {
    return 'video';
  }

  // Internal games & apps
  if (
    cleanUrl === 'fun_with_math_url' ||
    cleanUrl.includes('math') ||
    cleanUrl === 'internal:sindhi-alphabets' ||
    cleanUrl === 'internal:primary-quiz'
  ) {
    return 'game';
  }

  if (cleanUrl === 'anmol ak _test_maker_url' || cleanUrl.includes('test_maker')) {
    return 'app';
  }

  // Website / iframe
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return 'website';
  }

  return 'other';
}

// Extract YouTube ID safely
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match && match[1] ? match[1] : null;
}

// ==========================================
// FOLDER CATEGORIES CRUD (Stored in localStorage)
// ==========================================

export function getStoredFolders(): FolderCategory[] {
  if (typeof window === 'undefined') return DEFAULT_FOLDERS;
  const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(DEFAULT_FOLDERS));
    return DEFAULT_FOLDERS;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all system folders exist
      const existingIds = new Set(parsed.map((f: FolderCategory) => f.id));
      const missingSystem = DEFAULT_FOLDERS.filter((df) => !existingIds.has(df.id));
      if (missingSystem.length > 0) {
        const merged = [...parsed, ...missingSystem];
        localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
    return DEFAULT_FOLDERS;
  } catch {
    return DEFAULT_FOLDERS;
  }
}

export function saveStoredFolder(folderData: Partial<FolderCategory>): FolderCategory {
  const folders = getStoredFolders();
  const id = folderData.id || `folder_${Date.now()}`;
  const index = folders.findIndex((f) => f.id === id);

  const newFolder: FolderCategory = {
    id,
    name_sd: folderData.name_sd || folderData.name_en || 'نئون فولڊر',
    name_ur: folderData.name_ur || folderData.name_en || 'نیا فولڈر',
    name_en: folderData.name_en || 'New Folder',
    icon: folderData.icon || 'Folder',
    color: folderData.color || '#00e599',
    isSystem: !!folderData.isSystem,
    sort_order: folderData.sort_order || folders.length + 1,
  };

  if (index >= 0) {
    folders[index] = { ...folders[index], ...newFolder };
  } else {
    folders.push(newFolder);
  }

  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  addAuditLog('SAVE_FOLDER', `Saved folder: ${newFolder.name_sd || newFolder.name_en}`);
  return newFolder;
}

export function deleteStoredFolder(folderId: string): boolean {
  if (['all', 'books', 'games', 'videos', 'apps', 'extra'].includes(folderId)) {
    throw new Error('Default system folders cannot be deleted (بنيادي سسٽم فولڊر ڊليٽ نٿا ڪري سگهجن)');
  }

  const folders = getStoredFolders().filter((f) => f.id !== folderId);
  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));

  // Move items in this folder to 'extra'
  const resources = getStoredResources().map((r) => (r.folder === folderId ? { ...r, folder: 'extra' } : r));
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));

  const apps = getStoredApps().map((a) => (a.folder === folderId ? { ...a, folder: 'extra' } : a));
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));

  addAuditLog('DELETE_FOLDER', `Deleted folder ID: ${folderId}`);
  return true;
}

// Move any item to a target folder
export function moveItemToFolder(itemId: string, targetFolderId: string): boolean {
  // Check resources
  const resources = getStoredResources();
  const resIdx = resources.findIndex((r) => r.id === itemId);
  if (resIdx >= 0) {
    resources[resIdx].folder = targetFolderId;
    resources[resIdx].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    addAuditLog('MOVE_ITEM', `Moved resource ${itemId} to folder ${targetFolderId}`);
    return true;
  }

  // Check apps
  const apps = getStoredApps();
  const appIdx = apps.findIndex((a) => a.id === itemId);
  if (appIdx >= 0) {
    apps[appIdx].folder = targetFolderId;
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    addAuditLog('MOVE_ITEM', `Moved app ${itemId} to folder ${targetFolderId}`);
    return true;
  }

  return false;
}

// Delete ANY item (Resources or Apps) - Permanent Delete
export function deleteAnyItem(itemId: string): boolean {
  let deleted = false;

  const resources = getStoredResources();
  const filteredRes = resources.filter((r) => r.id !== itemId);
  if (filteredRes.length !== resources.length) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(filteredRes));
    deleted = true;
  }

  const apps = getStoredApps();
  const filteredApps = apps.filter((a) => a.id !== itemId);
  if (filteredApps.length !== apps.length) {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(filteredApps));
    deleted = true;
  }

  if (deleted) {
    addAuditLog('DELETE_ITEM', `Permanently deleted item ID: ${itemId}`);
  }
  return deleted;
}

// Reset data to initial defaults (Admin emergency option)
export function resetDefaultData(): void {
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(DEFAULT_FOLDERS));
  addAuditLog('RESET_DATA', 'Admin restored initial database seed data');
}

// ==========================================
// AUTHENTICATION
// ==========================================

export async function authenticateOwner(usernameOrEmail: string, passwordInput: string) {
  const config = getAppConfig();
  const inputUser = usernameOrEmail.trim().toLowerCase();
  const expectedUser = (config.adminUsername || 'admin').toLowerCase();
  const expectedEmail = (config.adminEmail || 'raorashid.anmol@gmail.com').toLowerCase();

  if (inputUser !== expectedUser && inputUser !== expectedEmail && inputUser !== 'admin') {
    throw new Error('Invalid Admin Username or Email (صحيح ايڊمن يوزرنيم يا ايميل داخل ڪريو)');
  }

  const currentPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD) || config.adminPassword || 'Pakistani1';

  if (passwordInput !== currentPassword) {
    throw new Error('Incorrect Password (غلط پاسورڊ. ٻيهر ڪوشش ڪريو)');
  }

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

// Educational Resources (Permanent Save, deletions are preserved!)
export function getStoredResources(): EducationalResource[] {
  if (typeof window === 'undefined') return INITIAL_RESOURCES;
  const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
  if (raw === null) {
    // Only seed the first time
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
    return INITIAL_RESOURCES;
  }
  try {
    const parsed = JSON.parse(raw);
    // Even if empty array (user deleted all), return empty array!
    return Array.isArray(parsed) ? parsed : [];
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
  const resolvedFolder = resourceData.folder || resolveItemFolder({
    content_type: resourceData.content_type,
    category: resourceData.category,
    media_url: resourceData.media_url,
  });

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
    folder: resolvedFolder,
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

// Educational Apps (Permanent Save, deletions are preserved!)
export function getStoredApps(): EducationalApp[] {
  if (typeof window === 'undefined') return INITIAL_APPS;
  const raw = localStorage.getItem(STORAGE_KEYS.APPS);
  if (raw === null) {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
  const resolvedFolder = appData.folder || resolveItemFolder({
    category: appData.category,
    url: appData.url,
  });

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
    folder: resolvedFolder,
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
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
}
