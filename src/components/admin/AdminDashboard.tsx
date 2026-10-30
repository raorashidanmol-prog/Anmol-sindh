import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Camera,
  Download, 
  RefreshCw,
  RotateCw,
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Key, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  Sliders,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Folder,
  FolderPlus,
  ArrowRightLeft,
  Search,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';
import { EducationalResource, AppLink, HeroBanner, SiteSettings, AuditLog, FolderCategory } from '../../types';
import {
  isStaticHosting,
  authenticateOwner,
  getStoredOwnerSession,
  logoutOwnerSession,
  changeOwnerPassword,
  recoverOwnerPassword,
  getStoredSettings,
  saveStoredSettings,
  getStoredResources,
  saveStoredResource,
  deleteStoredResource,
  getStoredApps,
  saveStoredApp,
  deleteStoredApp,
  getStoredAuditLogs,
  getStoredFolders,
  saveStoredFolder,
  deleteStoredFolder,
  moveItemToFolder,
  deleteAnyItem,
  resolveItemFolder,
  resetDefaultData,
  safeFetchJson,
} from '../../utils/staticStorage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  initialResources: EducationalResource[];
  initialApps: AppLink[];
  initialTab?: 'overview' | 'manage' | 'content' | 'apps' | 'folders' | 'settings' | 'logs' | 'backup';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  initialResources,
  initialApps,
  initialTab,
}) => {
  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('anmol_admin_token'));
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Password Recovery state
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveredPassword, setNewRecoveredPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'manage' | 'content' | 'apps' | 'folders' | 'settings' | 'logs' | 'backup'>(initialTab || 'manage');

  useEffect(() => {
    if (initialTab && isOpen) {
      setAdminTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Folders State
  const [folders, setFolders] = useState<FolderCategory[]>(() => getStoredFolders());
  const [newFolderNameSd, setNewFolderNameSd] = useState('');
  const [newFolderNameUr, setNewFolderNameUr] = useState('');
  const [newFolderNameEn, setNewFolderNameEn] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('Folder');
  const [newFolderColor, setNewFolderColor] = useState('#00e599');

  // Unified Content Management State
  const [manageSearchQuery, setManageSearchQuery] = useState('');
  const [manageFolderFilter, setManageFolderFilter] = useState('all');

  // Content Management State
  const [resources, setResources] = useState<EducationalResource[]>(initialResources);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [currentEditResource, setCurrentEditResource] = useState<Partial<EducationalResource> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // App Links State
  const [apps, setApps] = useState<AppLink[]>(initialApps);
  const [currentEditApp, setCurrentEditApp] = useState<Partial<AppLink> | null>(null);
  const [isEditingApp, setIsEditingApp] = useState(false);

  // Site Settings State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwChangeStatus, setPwChangeStatus] = useState<string | null>(null);

  // Logo upload state
  const [logoUploadProgress, setLogoUploadProgress] = useState<string | null>(null);

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Verify session on open
  useEffect(() => {
    if (authToken) {
      const session = getStoredOwnerSession();
      setAdminUser((session.user || { email: 'raorashid.anmol@gmail.com', name: 'Rao Rashid (Website Owner)', role: 'owner' }) as any);
      loadAdminData(authToken);
    }
  }, [authToken]);

  const loadAdminData = (_token: string) => {
    const localSettings = getStoredSettings();
    setSettings(localSettings);

    const logs = getStoredAuditLogs();
    setAuditLogs(logs as any);

    const resList = getStoredResources();
    setResources(resList);

    const appList = getStoredApps();
    setApps(appList);

    const folderList = getStoredFolders();
    setFolders(folderList);

    const byType: Record<string, number> = {};
    const byClass: Record<string, number> = {};
    let totalViews = 0;
    let totalDownloads = 0;

    resList.forEach((r) => {
      byType[r.content_type] = (byType[r.content_type] || 0) + 1;
      byClass[r.class_level] = (byClass[r.class_level] || 0) + 1;
      totalViews += r.views_count || 0;
      totalDownloads += r.downloads_count || 0;
    });

    setStats({
      totalResources: resList.length + appList.length,
      publishedCount: resList.filter((r) => r.published).length + appList.filter((a) => a.is_active).length,
      totalViews,
      totalDownloads,
      storageMB: 48.6,
      byType,
      byClass,
    });
  };

  // Move Item to Another Folder Handler
  const handleMoveItem = (itemId: string, targetFolderId: string) => {
    moveItemToFolder(itemId, targetFolderId);
    loadAdminData(authToken || '');
    onDataChanged();
  };

  // Delete ANY Item (Resource or App) - Permanent Remove
  const handleDeleteAnyItem = (itemId: string) => {
    deleteAnyItem(itemId);
    setDeleteConfirmId(null);
    loadAdminData(authToken || '');
    onDataChanged();
  };

  // Create New Folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderNameEn && !newFolderNameSd) return;
    saveStoredFolder({
      name_sd: newFolderNameSd || newFolderNameEn,
      name_ur: newFolderNameUr || newFolderNameEn,
      name_en: newFolderNameEn || newFolderNameSd,
      icon: newFolderIcon,
      color: newFolderColor,
    });
    setFolders(getStoredFolders());
    setNewFolderNameSd('');
    setNewFolderNameUr('');
    setNewFolderNameEn('');
    onDataChanged();
    alert('✓ نئون فولڊر ڪاميابيءَ سان شامل ڪيو ويو ۽ بٽڻ بار ۾ ظاهر ٿي ويو! (New Folder created and added to Button Bar!)');
  };

  // Delete Folder
  const handleDeleteFolder = (folderId: string) => {
    if (confirm('ڇا توهان هي فولڊر ڊليٽ ڪرڻ چاهيو ٿا؟ ان جا مواد Extra ۾ منتقل ٿي ويندا. (Delete this folder? Its contents will move to Extra)')) {
      try {
        deleteStoredFolder(folderId);
        setFolders(getStoredFolders());
        loadAdminData(authToken || '');
        onDataChanged();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Reset to Default Seed Data
  const handleResetDefaultData = () => {
    if (confirm('ڇا توهان واقعي سڀ مواد بنيادي نصابي مواد تي ري سيٽ ڪرڻ چاهيو ٿا؟ (Reset database to default seed data?)')) {
      resetDefaultData();
      loadAdminData(authToken || '');
      onDataChanged();
      alert('Database restored to default educational items.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      // 1. GitHub Pages / Static Hosting: Authenticate client-side without relative /api/
      if (isStaticHosting()) {
        const result = await authenticateOwner(loginEmail, loginPassword);
        localStorage.setItem('anmol_admin_token', result.token);
        setAuthToken(result.token);
        setAdminUser(result.user as any);
        loadAdminData(result.token);
        return;
      }

      // 2. Full-stack mode: Attempt backend fetch with safe parsing requested by user
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned HTML instead of JSON: ' + text.slice(0, 100));
      }

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('anmol_admin_token', data.token);
      setAuthToken(data.token);
      setAdminUser(data.user);
      loadAdminData(data.token);
    } catch (err: any) {
      // If server returned HTML (e.g. GitHub Pages 404), fall back seamlessly to static owner login
      if (err.message && (err.message.includes('HTML instead of JSON') || err.message.includes('404') || err.message.includes('Failed to fetch'))) {
        try {
          const result = await authenticateOwner(loginEmail, loginPassword);
          localStorage.setItem('anmol_admin_token', result.token);
          setAuthToken(result.token);
          setAdminUser(result.user as any);
          loadAdminData(result.token);
          return;
        } catch (staticErr: any) {
          setLoginError(staticErr.message);
          return;
        }
      }
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (authToken && !isStaticHosting()) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    logoutOwnerSession();
    setAuthToken(null);
    setAdminUser(null);
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isStaticHosting()) {
        await recoverOwnerPassword(recoveryCode, newRecoveredPassword);
        alert('Password reset successfully! You can now log in.');
        setShowRecovery(false);
        setLoginPassword(newRecoveredPassword);
        return;
      }

      const res = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryCode, newPassword: newRecoveredPassword }),
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned HTML instead of JSON: ' + text.slice(0, 100));
      }
      if (!res.ok) throw new Error(data.error);
      alert('Password reset successfully! You can now log in.');
      setShowRecovery(false);
      setLoginPassword(newRecoveredPassword);
    } catch (err: any) {
      try {
        await recoverOwnerPassword(recoveryCode, newRecoveredPassword);
        alert('Password reset successfully! You can now log in.');
        setShowRecovery(false);
        setLoginPassword(newRecoveredPassword);
      } catch (staticErr: any) {
        alert(staticErr.message);
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setPwChangeStatus(null);

    if (newPassword.length < 6) {
      setPwChangeStatus('Error: نئون پاسورڊ گهٽ ۾ گهٽ 6 اکر هجڻ گهرجي (New password must be at least 6 characters).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwChangeStatus('Error: نئون پاسورڊ ۽ تصديقي پاسورڊ هڪجهڙا ناهن (New password and confirm password do not match).');
      return;
    }

    try {
      if (isStaticHosting()) {
        await changeOwnerPassword(currentPassword, newPassword);
        setPwChangeStatus('✓ پاسورڊ ڪاميابيءَ سان تبديل ٿي ويو! (Password successfully updated!)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned HTML instead of JSON: ' + text.slice(0, 100));
      }
      if (!res.ok) throw new Error(data.error);
      setPwChangeStatus('✓ پاسورڊ ڪاميابيءَ سان تبديل ٿي ويو! (Password successfully updated!)');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      try {
        await changeOwnerPassword(currentPassword, newPassword);
        setPwChangeStatus('✓ پاسورڊ ڪاميابيءَ سان تبديل ٿي ويو! (Password successfully updated in storage!)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (staticErr: any) {
        setPwChangeStatus(`Error: ${staticErr.message}`);
      }
    }
  };

  // Dedicated Website Logo Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    setLogoUploadProgress(`Uploading logo (${(file.size / 1024).toFixed(1)} KB)...`);

    // Use FileReader for instant browser-based Base64 data URL persistence on static hosts
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const logoDataUrl = reader.result as string;
        const updatedSettings = {
          ...(settings || getStoredSettings()),
          logo_url: logoDataUrl,
        };
        setSettings(updatedSettings as SiteSettings);
        saveStoredSettings(updatedSettings);

        if (!isStaticHosting()) {
          fetch('/api/admin/settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(updatedSettings),
          }).catch(() => {});
        }

        setLogoUploadProgress('✓ ويب سائيٽ جو نئون لوگو محفوظ ٿي ويو! (New Logo saved across website!)');
        setTimeout(() => setLogoUploadProgress(null), 4000);
        onDataChanged();
      } catch (err: any) {
        setLogoUploadProgress(`Upload failed: ${err.message}`);
        setTimeout(() => setLogoUploadProgress(null), 5000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Direct upload helper (supports images, videos, audio, PDF)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'media_url' | 'thumbnail_url' | 'first_screen_image',
    target: 'resource' | 'app' = 'resource'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    const sourceName = file.type.startsWith('image/') ? 'Gallery / Photos' : 'File Manager / Files';
    setUploadProgress(`Loading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) from ${sourceName}...`);

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|3gp|mkv|avi|m4v)$/i.test(file.name);
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

    // Images under 6MB encoded to Data URL for instant, permanent preview
    if (file.type.startsWith('image/') && file.size < 6 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        if (target === 'resource') {
          setCurrentEditResource((prev) => ({
            ...prev,
            [fieldName]: url,
          }));
        } else {
          setCurrentEditApp((prev) => ({
            ...prev,
            [fieldName]: url,
          }));
        }
        setUploadProgress(`✓ ${file.name} attached successfully!`);
        setTimeout(() => setUploadProgress(null), 3000);
      };
      reader.readAsDataURL(file);
      return;
    }

    // For videos, audio, PDF on static hosting, create a persistent object URL or use external link
    if (isStaticHosting()) {
      const blobUrl = URL.createObjectURL(file);
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      if (target === 'resource') {
        setCurrentEditResource((prev) => ({
          ...prev,
          [fieldName]: blobUrl,
          ...(fieldName === 'media_url' ? {
            file_size: fileSize,
            ...(isVideo ? { content_type: 'video', file_format: 'MP4' } : {}),
            ...(isAudio ? { content_type: 'audio', file_format: 'MP3' } : {}),
            ...(isPdf ? { content_type: 'pdf', file_format: 'PDF' } : {}),
          } : {}),
        }));
      } else {
        setCurrentEditApp((prev) => ({
          ...prev,
          [fieldName]: blobUrl,
        }));
      }
      setUploadProgress(`✓ ${file.name} ready! (Tip: For permanent video links across all devices, paste a YouTube or MP4 URL)`);
      setTimeout(() => setUploadProgress(null), 6000);
      return;
    }

    // Backend mode
    try {
      const res = await fetch(`/api/upload-binary?fileName=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          Authorization: `Bearer ${authToken}`,
        },
        body: file,
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Upload response was HTML: ' + text.slice(0, 100));
      }
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (target === 'resource') {
        setCurrentEditResource((prev) => ({
          ...prev,
          [fieldName]: data.url,
          ...(fieldName === 'media_url' ? {
            file_size: data.size,
            ...(isVideo ? { content_type: 'video', file_format: 'MP4' } : {}),
            ...(isAudio ? { content_type: 'audio', file_format: 'MP3' } : {}),
            ...(isPdf ? { content_type: 'pdf', file_format: 'PDF' } : {}),
          } : {}),
        }));
      } else {
        setCurrentEditApp((prev) => ({
          ...prev,
          [fieldName]: data.url,
        }));
      }
      setUploadProgress(`Upload complete: ${file.name} is ready!`);
      setTimeout(() => setUploadProgress(null), 4000);
    } catch (err: any) {
      setUploadProgress(`Upload failed: ${err.message}`);
    }
  };

  // Save Content Resource with automatic thumbnail preservation
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !currentEditResource) return;

    try {
      const mediaUrl = (currentEditResource.media_url || '').trim();
      let resolvedThumb = (currentEditResource.thumbnail_url || '').trim();

      if (!resolvedThumb) {
        const ytMatch = mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
          resolvedThumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
        } else {
          resolvedThumb = '/src/assets/images/video_gallery_1792756359556.jpg';
        }
      }

      const payload = {
        ...currentEditResource,
        thumbnail_url: resolvedThumb,
      };

      // Always save to client-side localStorage
      saveStoredResource(payload);

      // If backend is active, also sync to server
      if (!isStaticHosting()) {
        const isNew = !currentEditResource.id;
        const url = isNew ? '/api/admin/content' : `/api/admin/content/${currentEditResource.id}`;
        const method = isNew ? 'POST' : 'PUT';

        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      setIsEditingResource(false);
      setCurrentEditResource(null);
      loadAdminData(authToken);
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Resource
  const handleDeleteResource = async (id: string) => {
    if (!authToken) return;
    try {
      deleteStoredResource(id);
      if (!isStaticHosting()) {
        fetch(`/api/admin/content/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => {});
      }
      setDeleteConfirmId(null);
      loadAdminData(authToken);
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save App Link
  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !currentEditApp) return;

    try {
      saveStoredApp(currentEditApp);
      if (!isStaticHosting()) {
        const isNew = !currentEditApp.id;
        const url = isNew ? '/api/admin/apps' : `/api/admin/apps/${currentEditApp.id}`;
        const method = isNew ? 'POST' : 'PUT';
        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(currentEditApp),
        }).catch(() => {});
      }
      setIsEditingApp(false);
      setCurrentEditApp(null);
      loadAdminData(authToken);
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete App Link
  const handleDeleteApp = async (id: string) => {
    if (!authToken) return;
    try {
      deleteStoredApp(id);
      if (!isStaticHosting()) {
        fetch(`/api/admin/apps/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        }).catch(() => {});
      }
      loadAdminData(authToken);
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !settings) return;
    setSettingsSaving(true);
    try {
      saveStoredSettings(settings);
      if (!isStaticHosting()) {
        await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(settings),
        });
      }
      alert('Site settings updated successfully!');
      onDataChanged();
    } catch (err: any) {
      alert('Saved to local storage: ' + err.message);
      onDataChanged();
    } finally {
      setSettingsSaving(false);
    }
  };

  // Backup Export
  const handleExportBackup = () => {
    if (!authToken) return;
    const backupData = {
      version: '2.1.0',
      exportedAt: new Date().toISOString(),
      settings: getStoredSettings(),
      resources: getStoredResources(),
      apps: getStoredApps(),
      auditLogs: getStoredAuditLogs(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anmol_sindh_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Backup Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.settings) saveStoredSettings(json.settings);
        if (Array.isArray(json.resources)) {
          localStorage.setItem('anmol_static_resources', JSON.stringify(json.resources));
        }
        if (Array.isArray(json.apps)) {
          localStorage.setItem('anmol_static_apps', JSON.stringify(json.apps));
        }
        alert('Database restored successfully from backup file!');
        loadAdminData(authToken);
        onDataChanged();
      } catch (err: any) {
        alert(`Restore failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col my-auto max-h-[95vh] text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-sindhi">
                  مالڪ ايڊمن ڪنٽرول پينل
                </h2>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ANMOL SINDH Master Administrative System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* AUTHENTICATION VIEW (IF NOT LOGGED IN) */}
        {/* ============================================================ */}
        {!authToken ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6">
            {!showRecovery ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Owner Administrator Login</h3>
                  <p className="text-xs text-slate-400">
                    Enter the authorized credentials to manage curriculum, uploads, and site settings.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ايڊمن يوزرنيم يا ايميل (Admin Username or Email)
                  </label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin or raorashid.anmol@gmail.com"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    پاسورڊ (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm px-3.5 py-2.5 pr-11 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer transition-colors"
                      title={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-1 flex justify-end items-center text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => setShowRecovery(true)}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      پاسورڊ بحال ڪريو (Recover Password)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authenticate as Owner</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Password Recovery Form */
              <form onSubmit={handlePasswordRecovery} className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-white">Master Password Recovery</h3>
                  <p className="text-xs text-slate-400">
                    Enter your master emergency recovery code to reset the owner password.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Master Recovery Code</label>
                  <input
                    type="password"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="Enter confidential recovery code"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Master Password</label>
                  <div className="relative">
                    <input
                      type={showRecoveryPassword ? 'text' : 'password'}
                      required
                      value={newRecoveredPassword}
                      onChange={(e) => setNewRecoveredPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full text-sm px-3.5 py-2.5 pr-11 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer transition-colors"
                      title={showRecoveryPassword ? "Hide password" : "Show password"}
                    >
                      {showRecoveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(false)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* LOGGED IN DASHBOARD VIEW */
          /* ============================================================ */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-visible flex md:flex-col">
              <button
                onClick={() => setAdminTab('manage')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'manage' ? 'bg-[#00e599] text-black font-bold shadow-md shadow-[#00e599]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Manage Content (سمورو مواد)</span>
              </button>

              <button
                onClick={() => setAdminTab('folders')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'folders' ? 'bg-[#00e599] text-black font-bold shadow-md shadow-[#00e599]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Folder Bar (بٽڻ بار)</span>
              </button>

              <button
                onClick={() => setAdminTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'overview' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => setAdminTab('content')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'content' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Content & Uploads</span>
              </button>

              <button
                onClick={() => setAdminTab('apps')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'apps' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>App & Game Links</span>
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'settings' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site & Branding</span>
              </button>

              <button
                onClick={() => setAdminTab('logs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'logs' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Security & Logs</span>
              </button>

              <button
                onClick={() => setAdminTab('backup')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  adminTab === 'backup' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Backup & Export</span>
              </button>
            </div>

            {/* Main Tab Content Area */}
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto max-h-[82vh]">
              
              {/* ============================================================ */}
              {/* TAB: MANAGE ALL CONTENT (3 CONTROLS: EDIT, MOVE, DELETE)     */}
              {/* ============================================================ */}
              {adminTab === 'manage' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white font-sindhi">
                          سمورو مواد سنڀاليو (Manage All Content)
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {resources.length + apps.length} Items
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-sindhi">
                        هتي توهان سڀ ڪارڊ، وڊيو لنڪس، ڪتاب، رانديون ۽ ايپس ڏسي، تبديل (Edit)، ٻئي فولڊر ۾ منتقل (Move)، يا ڊليٽ (Delete) ڪري سگهو ٿا. ڪو به مواد لاڪ ٿيل ناهي.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentEditResource({
                            title_sd: '',
                            title_ur: '',
                            title_en: '',
                            description_sd: '',
                            description_ur: '',
                            description_en: '',
                            class_level: '1',
                            subject: 'Sindhi',
                            language: 'sd',
                            category: 'educational_videos',
                            content_type: 'video',
                            media_url: '',
                            thumbnail_url: '',
                            downloadable: true,
                            published: true,
                            folder: manageFolderFilter !== 'all' ? manageFolderFilter : 'videos',
                          });
                          setIsEditingResource(true);
                          setAdminTab('content');
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-[#00e599] hover:from-emerald-500 hover:to-[#00f7a5] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#00e599]/20 transition-all shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="font-sindhi">نئون لنڪ / وڊيو شامل ڪريو +</span>
                      </button>
                    </div>
                  </div>

                  {/* Search & Folder Filters */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search Input */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={manageSearchQuery}
                          onChange={(e) => setManageSearchQuery(e.target.value)}
                          placeholder="ٽائٽل، وڊيو لنڪ، ڪلاس يا موضوع ڳولهيو... (Search content, URL, subject...)"
                          className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00e599]"
                        />
                        {manageSearchQuery && (
                          <button
                            onClick={() => setManageSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Reset Default Seed Data Button */}
                      <button
                        onClick={handleResetDefaultData}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                        title="Restore original default items"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Reset Default Items</span>
                      </button>
                    </div>

                    {/* Folder Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-[#00e599]" />
                        <span>Filter:</span>
                      </span>
                      {folders.map((f) => {
                        const isSelected = manageFolderFilter === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setManageFolderFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-[#00e599] text-black shadow-md shadow-[#00e599]/20'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                            }`}
                          >
                            <span>{f.name_en}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Cards / Table with 3 Controls */}
                  {(() => {
                    const unified = [
                      ...resources.map((r) => ({
                        id: r.id,
                        title: r.title_sd || r.title_en,
                        titleSub: r.title_en,
                        folder: resolveItemFolder(r),
                        type: r.content_type,
                        url: r.media_url,
                        thumbnail: r.thumbnail_url,
                        classLevel: r.class_level,
                        subject: r.subject,
                        isApp: false,
                        rawItem: r,
                      })),
                      ...apps.map((a) => ({
                        id: a.id,
                        title: a.title_sd || a.title_en,
                        titleSub: a.title_en,
                        folder: resolveItemFolder(a),
                        type: 'app',
                        url: a.url,
                        thumbnail: a.thumbnail_url || a.first_screen_image,
                        classLevel: 'all',
                        subject: a.category,
                        isApp: true,
                        rawItem: a,
                      })),
                    ];

                    const filtered = unified.filter((item) => {
                      const matchesSearch =
                        !manageSearchQuery ||
                        item.title.toLowerCase().includes(manageSearchQuery.toLowerCase()) ||
                        (item.titleSub && item.titleSub.toLowerCase().includes(manageSearchQuery.toLowerCase())) ||
                        item.url.toLowerCase().includes(manageSearchQuery.toLowerCase()) ||
                        (item.subject && item.subject.toLowerCase().includes(manageSearchQuery.toLowerCase()));
                      const matchesFolder = manageFolderFilter === 'all' || item.folder === manageFolderFilter;
                      return matchesSearch && matchesFolder;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                          <p className="text-slate-300 font-bold font-sindhi">ڪو به مواد نه مليو (No matching items found)</p>
                          <p className="text-xs text-slate-500">
                            {manageSearchQuery ? 'Try a different search query or folder filter.' : 'All items in this folder have been deleted or moved.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="text-xs text-slate-400 font-mono">
                          Showing {filtered.length} of {unified.length} items
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {filtered.map((item) => {
                            const currentFolderObj = folders.find((f) => f.id === item.folder) || {
                              id: item.folder,
                              name_en: item.folder,
                              name_sd: item.folder,
                              color: '#00e599',
                            };

                            return (
                              <div
                                key={item.id}
                                className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-[#00e599]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                              >
                                {/* Left: Thumbnail & Details */}
                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative flex items-center justify-center">
                                    {item.thumbnail ? (
                                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <Layers className="w-6 h-6 text-slate-600" />
                                    )}
                                    <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[9px] font-mono font-bold text-white uppercase rounded-tl">
                                      {item.type}
                                    </span>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-bold text-white font-sindhi truncate max-w-sm">
                                        {item.title}
                                      </h4>
                                      
                                      {/* Folder Tag */}
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-900 text-[#00e599] border border-[#00e599]/30">
                                        📁 {currentFolderObj.name_en}
                                      </span>

                                      {item.classLevel && item.classLevel !== 'all' && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                                          Class {item.classLevel}
                                        </span>
                                      )}
                                    </div>

                                    {item.titleSub && (
                                      <p className="text-xs text-slate-400 truncate mt-0.5">
                                        {item.titleSub}
                                      </p>
                                    )}

                                    <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5 max-w-md">
                                      {item.url}
                                    </p>
                                  </div>
                                </div>

                                {/* Right: The 3 Requested Controls */}
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80 shrink-0">
                                  
                                  {/* CONTROL 1: EDIT */}
                                  <button
                                    onClick={() => {
                                      if (item.isApp) {
                                        setCurrentEditApp(item.rawItem as AppLink);
                                        setIsEditingApp(true);
                                        setAdminTab('apps');
                                      } else {
                                        setCurrentEditResource(item.rawItem as EducationalResource);
                                        setIsEditingResource(true);
                                        setAdminTab('content');
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-[#00e599]/20 text-slate-200 hover:text-[#00e599] rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    title="Edit this card / link"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-[#00e599]" />
                                    <span className="font-sindhi">ايڊٽ (Edit)</span>
                                  </button>

                                  {/* CONTROL 2: MOVE TO ANOTHER FOLDER */}
                                  <div className="relative">
                                    <select
                                      value={item.folder}
                                      onChange={(e) => handleMoveItem(item.id, e.target.value)}
                                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-lg text-xs font-bold border border-slate-700 cursor-pointer focus:ring-1 focus:ring-[#00e599]"
                                      title="Move to another folder in Button Bar"
                                    >
                                      <option disabled value="">Move Folder...</option>
                                      {folders.map((f) => (
                                        <option key={f.id} value={f.id}>
                                          📂 {f.name_en} ({f.name_sd})
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* CONTROL 3: DELETE / REMOVE */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`ڇا توهان واقعي هي مواد هٽائڻ چاهيو ٿا؟\n\n"${item.title}"\n\n(Are you sure you want to permanently delete this item?)`)) {
                                        handleDeleteAnyItem(item.id);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold border border-rose-800/60 flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Permanently Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="font-sindhi">ڊليٽ (Delete)</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB: FOLDER BAR SYSTEM (CREATE, VIEW, DELETE CUSTOM FOLDERS) */}
              {/* ============================================================ */}
              {adminTab === 'folders' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white font-sindhi">
                      بٽڻ بار ۽ فولڊر سسٽم (Folder Bar System)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-sindhi">
                      هتي توهان نوان فولڊر ٺاهي سگهو ٿا، جيڪي سڌو سنئون ويب سائيٽ جي مٿئين بٽڻ بار ۾ ظاهر ٿيندا. جڏهن به توهان نئون لنڪ يا وڊيو محفوظ ڪندا، توهان ان کي پنهنجي پسند جي فولڊر ۾ رکي سگهندا.
                    </p>
                  </div>

                  {/* Create New Folder Form */}
                  <form onSubmit={handleCreateFolder} className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-[#00e599]/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <FolderPlus className="w-4 h-4 text-[#00e599]" />
                      <h4 className="text-sm font-bold text-white font-sindhi">
                        نئون فولڊر شامل ڪريو (Create New Button Bar Folder)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">فولڊر جو نالو (سنڌي)</label>
                        <input
                          type="text"
                          required
                          value={newFolderNameSd}
                          onChange={(e) => setNewFolderNameSd(e.target.value)}
                          placeholder="مثال: ٻاراڻا گيت، قرآن سبق..."
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">نام فولڈر (اردو)</label>
                        <input
                          type="text"
                          value={newFolderNameUr}
                          onChange={(e) => setNewFolderNameUr(e.target.value)}
                          placeholder="مثال: بچوں کے گیت..."
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-urdu"
                          dir="rtl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Folder Name (English)</label>
                        <input
                          type="text"
                          required
                          value={newFolderNameEn}
                          onChange={(e) => setNewFolderNameEn(e.target.value)}
                          placeholder="e.g. Nursery Rhymes, Math Puzzles..."
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Icon</label>
                        <select
                          value={newFolderIcon}
                          onChange={(e) => setNewFolderIcon(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                        >
                          <option value="Folder">📁 Folder</option>
                          <option value="BookOpen">📚 BookOpen</option>
                          <option value="Gamepad2">🎮 Gamepad2</option>
                          <option value="Video">🎬 Video</option>
                          <option value="Smartphone">📱 Smartphone</option>
                          <option value="Sparkles">✨ Sparkles</option>
                          <option value="Layers">📑 Layers</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Folder Color</label>
                        <select
                          value={newFolderColor}
                          onChange={(e) => setNewFolderColor(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                        >
                          <option value="#00e599">Pierrot Green (#00e599)</option>
                          <option value="#38bdf8">Sky Blue (#38bdf8)</option>
                          <option value="#c084fc">Purple (#c084fc)</option>
                          <option value="#fbbf24">Amber (#fbbf24)</option>
                          <option value="#f472b6">Pink (#f472b6)</option>
                        </select>
                      </div>

                      <div className="col-span-2 flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 bg-gradient-to-r from-emerald-600 to-[#00e599] hover:from-emerald-500 hover:to-[#00f7a5] text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>محفوظ ڪريو ۽ بٽڻ بار ۾ لڳايو (Add to Button Bar)</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Existing Folders List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Active Button Bar Folders ({folders.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {folders.map((f) => {
                        const count = [
                          ...resources.filter((r) => resolveItemFolder(r) === f.id),
                          ...apps.filter((a) => resolveItemFolder(a) === f.id),
                        ].length;

                        return (
                          <div
                            key={f.id}
                            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 shadow-md"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-black font-bold shrink-0"
                                style={{ backgroundColor: f.color || '#00e599' }}
                              >
                                <Folder className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white font-sindhi truncate">
                                    {f.name_sd}
                                  </span>
                                  {f.isSystem && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                                      System
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {f.name_en} • <span className="text-[#00e599] font-bold">{count} items</span>
                                </p>
                              </div>
                            </div>

                            {!f.isSystem && (
                              <button
                                onClick={() => handleDeleteFolder(f.id)}
                                className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Custom Folder"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 1: OVERVIEW & STATS */}
              {/* ============================================================ */}
              {adminTab === 'overview' && stats && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">System Metrics & Dashboard</h3>
                    <p className="text-xs text-slate-400">Live analytics for Anmol Sindh portal</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-xs text-slate-400">Total Resources</span>
                      <div className="text-2xl font-bold text-white mt-1 tabular-nums">{stats.totalResources}</div>
                      <span className="text-[11px] text-emerald-400">{stats.publishedCount} Published</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-xs text-slate-400">Total Views</span>
                      <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{stats.totalViews}</div>
                      <span className="text-[11px] text-slate-400">Content impressions</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-xs text-slate-400">Total Downloads</span>
                      <div className="text-2xl font-bold text-teal-400 mt-1 tabular-nums">{stats.totalDownloads}</div>
                      <span className="text-[11px] text-slate-400">Worksheets & audio</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-xs text-slate-400">Storage Used</span>
                      <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{stats.storageMB} MB</div>
                      <span className="text-[11px] text-slate-400">Uploaded assets</span>
                    </div>
                  </div>

                  {/* Distribution breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Breakdown by Media Type</h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(stats.byType || {}).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-slate-700/60">
                            <span className="capitalize">{key}</span>
                            <span className="font-bold text-emerald-400 tabular-nums">{val as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Breakdown by Primary Grade</h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(stats.byClass || {}).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-slate-700/60">
                            <span>Class {key}</span>
                            <span className="font-bold text-teal-400 tabular-nums">{val as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 2: CONTENT & UPLOADS */}
              {/* ============================================================ */}
              {adminTab === 'content' && (
                <div className="space-y-6">
                  {!isEditingResource ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">Manage Curriculum Content</h3>
                          <p className="text-xs text-slate-400">Upload audio, video, worksheets, and edit lessons</p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentEditResource({
                              title_sd: '',
                              title_ur: '',
                              title_en: '',
                              description_sd: '',
                              description_ur: '',
                              description_en: '',
                              class_level: '1',
                              subject: 'Sindhi',
                              language: 'sd',
                              category: 'lessons_explanations',
                              content_type: 'audio',
                              media_url: '',
                              thumbnail_url: '',
                              downloadable: true,
                              published: true,
                              sort_order: resources.length + 1,
                              duration: '03:00',
                              file_size: '3.5 MB',
                              file_format: 'MP3',
                            });
                            setIsEditingResource(true);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Resource</span>
                        </button>
                      </div>

                      {/* Content Table */}
                      <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/40">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                            <tr>
                              <th className="p-3">Resource</th>
                              <th className="p-3">Class</th>
                              <th className="p-3">Subject</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {resources.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-800/40">
                                <td className="p-3">
                                  <div className="font-bold text-white font-sindhi">{item.title_sd || item.title_en}</div>
                                  <div className="text-[11px] text-slate-500">{item.title_en}</div>
                                </td>
                                <td className="p-3 font-semibold">Class {item.class_level}</td>
                                <td className="p-3 text-emerald-400">{item.subject}</td>
                                <td className="p-3 uppercase font-mono">{item.content_type}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    item.published ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {item.published ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setCurrentEditResource(item);
                                        setIsEditingResource(true);
                                      }}
                                      className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded"
                                      title="Edit"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(item.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Delete Confirmation Modal */}
                      {deleteConfirmId && (
                        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                              <span>Confirm Deletion</span>
                            </h4>
                            <p className="text-xs text-slate-300">
                              Are you sure you want to delete this resource? This will remove it from the public catalog.
                            </p>
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteResource(deleteConfirmId)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Edit / Add Resource Form */
                    <form onSubmit={handleSaveResource} className="space-y-5 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="font-bold text-white text-base">
                          {currentEditResource?.id ? 'Edit Resource' : 'Add New Curriculum Resource'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingResource(false);
                            setCurrentEditResource(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      {uploadProgress && (
                        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs rounded-lg">
                          {uploadProgress}
                        </div>
                      )}

                      {/* Multilingual Titles */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (سنڌي)</label>
                          <input
                            type="text"
                            value={currentEditResource?.title_sd || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, title_sd: e.target.value })}
                            className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (اردو)</label>
                          <input
                            type="text"
                            value={currentEditResource?.title_ur || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, title_ur: e.target.value })}
                            className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-urdu"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (English)</label>
                          <input
                            type="text"
                            required
                            value={currentEditResource?.title_en || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, title_en: e.target.value })}
                            className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      {/* Multilingual Descriptions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Description (سنڌي)</label>
                          <textarea
                            rows={2}
                            value={currentEditResource?.description_sd || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, description_sd: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Description (اردو)</label>
                          <textarea
                            rows={2}
                            value={currentEditResource?.description_ur || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, description_ur: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-urdu"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Description (English)</label>
                          <textarea
                            rows={2}
                            value={currentEditResource?.description_en || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, description_en: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      {/* Grade, Subject, Category, Media Type, Folder */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Class</label>
                          <select
                            value={currentEditResource?.class_level || '1'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, class_level: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="1">Class 1</option>
                            <option value="2">Class 2</option>
                            <option value="3">Class 3</option>
                            <option value="4">Class 4</option>
                            <option value="5">Class 5</option>
                            <option value="all">All Classes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                          <select
                            value={currentEditResource?.subject || 'Sindhi'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, subject: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="Sindhi">Sindhi</option>
                            <option value="Urdu">Urdu</option>
                            <option value="English">English</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="General Science">General Science</option>
                            <option value="Social Studies">Social Studies</option>
                            <option value="Islamiat & Ethics">Islamiat & Ethics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                          <select
                            value={currentEditResource?.category || 'educational_videos'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, category: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="animated_stories">Animated Stories & Folk Tales</option>
                            <option value="video_poems">Video Poems & Rhymes</option>
                            <option value="educational_videos">Educational Videos & Lessons</option>
                            <option value="lessons_explanations">Lessons & History Explanations</option>
                            <option value="worksheets_pdf">Worksheets & Curriculum Books (PDF)</option>
                            <option value="educational_games">Educational Games & Quizzes</option>
                            <option value="tests_quizzes">RA Tests & Assessment Papers</option>
                            <option value="sindhi_learning">Sindhi Learning & Language</option>
                            <option value="urdu_learning">Urdu Learning & Grammar</option>
                            <option value="english_vocabulary">English Vocabulary & Phonics</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#00e599] mb-1">Content Format</label>
                          <select
                            value={currentEditResource?.content_type || 'video'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, content_type: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-[#00e599]/40 rounded-lg text-white font-semibold"
                          >
                            <option value="video">Video (MP4 / WebM / YouTube)</option>
                            <option value="pdf">Worksheet / Book (Read PDF)</option>
                            <option value="interactive">Interactive Game</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#00e599] mb-1">Target Folder (بٽڻ بار)</label>
                          <select
                            value={currentEditResource?.folder || resolveItemFolder(currentEditResource || {})}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, folder: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-[#00e599]/40 rounded-lg text-white font-semibold"
                          >
                            {folders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.icon} {f.name_en} ({f.name_sd})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* File Uploads & URLs with Gallery & File Manager buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-300">
                              Permanent Video Link or Media File (YouTube URL / Direct MP4 / PDF)
                            </label>
                            <span className="text-[10px] text-emerald-400 font-mono">Link & Thumbnail Saved Permanently</span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={currentEditResource?.media_url || ''}
                              onChange={(e) => {
                                const newUrl = e.target.value;
                                const ytMatch = newUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                                const autoThumb = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : currentEditResource?.thumbnail_url;
                                setCurrentEditResource({ 
                                  ...currentEditResource, 
                                  media_url: newUrl,
                                  thumbnail_url: (!currentEditResource?.thumbnail_url || currentEditResource.thumbnail_url.includes('youtube.com')) && autoThumb ? autoThumb : currentEditResource?.thumbnail_url,
                                  content_type: ytMatch ? 'video' : currentEditResource?.content_type || 'video',
                                });
                              }}
                              placeholder="/uploads/... or https://www.youtube.com/watch?v=... or direct MP4 link"
                              className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono focus:border-[#00e599] focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {/* Auto extract thumbnail from YouTube link */}
                            {currentEditResource?.media_url && (
                              <button
                                type="button"
                                onClick={() => {
                                  const ytMatch = (currentEditResource.media_url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                                  if (ytMatch && ytMatch[1]) {
                                    setCurrentEditResource({
                                      ...currentEditResource,
                                      thumbnail_url: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
                                      content_type: 'video',
                                    });
                                  } else {
                                    alert('لنڪ مان ٿمب نيل نه ملي سگهيو. توهان هيٺ ڏنل بٽڻ سان تصوير چونڊي سگهو ٿا.');
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-[#00e599]/20 hover:bg-[#00e599]/30 text-[#00e599] border border-[#00e599]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Fetch Video Thumbnail</span>
                              </button>
                            )}

                            {/* Upload from File Manager */}
                            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors">
                              <Folder className="w-3.5 h-3.5 text-amber-400" />
                              <span>📁 From File Manager</span>
                              <input
                                type="file"
                                accept="audio/*,video/*,application/pdf,*/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'media_url', 'resource')}
                              />
                            </label>

                            {/* Upload from Gallery / Photos */}
                            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>🖼️ From Gallery / Photos</span>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'media_url', 'resource')}
                              />
                            </label>
                          </div>

                          {/* Live Video / Audio playback preview */}
                          {currentEditResource?.media_url && (
                            <div className="pt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                              {currentEditResource.content_type === 'video' || /\.(mp4|webm|mov|3gp|mkv|m4v)$/i.test(currentEditResource.media_url) ? (
                                <div>
                                  <span className="text-[11px] text-[#00e599] font-semibold block mb-1">
                                    ▶ Video File Ready - Test Playback:
                                  </span>
                                  <video
                                    src={currentEditResource.media_url}
                                    controls
                                    className="w-full max-h-36 rounded-lg bg-black border border-slate-700"
                                    preload="metadata"
                                  />
                                </div>
                              ) : currentEditResource.content_type === 'audio' || /\.(mp3|wav|ogg|m4a|aac)$/i.test(currentEditResource.media_url) ? (
                                <div>
                                  <span className="text-[11px] text-[#00e599] font-semibold block mb-1">
                                    🎵 Audio Track Ready - Test Playback:
                                  </span>
                                  <audio src={currentEditResource.media_url} controls className="w-full h-8" />
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">File attached: {currentEditResource.media_url}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-300">
                            Cover / Thumbnail Image
                          </label>
                          <input
                            type="text"
                            value={currentEditResource?.thumbnail_url || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, thumbnail_url: e.target.value })}
                            placeholder="/src/assets/images/... or url"
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                          <div className="flex flex-wrap gap-2 pt-1">
                            {/* Upload from Gallery */}
                            <label className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg cursor-pointer text-xs font-semibold border border-emerald-800 flex items-center gap-1.5 transition-colors">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>🖼️ Upload from Gallery</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'thumbnail_url', 'resource')}
                              />
                            </label>

                            {/* Upload from File Manager */}
                            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors">
                              <Folder className="w-3.5 h-3.5 text-amber-400" />
                              <span>📁 From File Manager</span>
                              <input
                                type="file"
                                accept="*/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'thumbnail_url', 'resource')}
                              />
                            </label>
                          </div>

                          {/* Thumbnail preview */}
                          {currentEditResource?.thumbnail_url && (
                            <div className="flex items-center gap-2 pt-1">
                              <img
                                src={currentEditResource.thumbnail_url}
                                alt="Preview"
                                className="w-12 h-10 object-cover rounded border border-slate-700"
                              />
                              <span className="text-[11px] text-emerald-400">Preview ready</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Checkboxes & Duration */}
                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(currentEditResource?.downloadable)}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, downloadable: e.target.checked })}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Allow Public Downloads</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(currentEditResource?.published)}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, published: e.target.checked })}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Published (Visible to Students)</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(currentEditResource?.featured)}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, featured: e.target.checked })}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Feature on Homepage Spotlight</span>
                        </label>
                      </div>

                      {/* Poem Verses (Optional) */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Poem Lyrics (نظم جا ٻول)</label>
                        <textarea
                          rows={3}
                          value={currentEditResource?.lyrics_sd || ''}
                          onChange={(e) => setCurrentEditResource({ ...currentEditResource, lyrics_sd: e.target.value })}
                          placeholder="Poem verses in Sindhi / Urdu"
                          className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                          dir="rtl"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingResource(false);
                            setCurrentEditResource(null);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Save Resource
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 3: APP & GAME LINKS */}
              {/* ============================================================ */}
              {adminTab === 'apps' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">Configurable App & Game Links</h3>
                      <p className="text-xs text-slate-400">
                        Upload App First Screen Image from Gallery or File Manager, and set direct URL for each app box.
                      </p>
                    </div>

                    {!isEditingApp && (
                      <button
                        onClick={() => {
                          setCurrentEditApp({
                            title_sd: '',
                            title_ur: '',
                            title_en: '',
                            description_sd: '',
                            description_ur: '',
                            description_en: '',
                            category: 'Mathematics',
                            icon: 'Calculator',
                            url: '',
                            first_screen_image: '',
                            is_active: true,
                            sort_order: apps.length + 1,
                            badge: 'New App',
                          });
                          setIsEditingApp(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New App Box</span>
                      </button>
                    )}
                  </div>

                  {uploadProgress && (
                    <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs rounded-lg">
                      {uploadProgress}
                    </div>
                  )}

                  {/* App Edit / Add Form */}
                  {isEditingApp && currentEditApp ? (
                    <form onSubmit={handleSaveApp} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h4 className="font-bold text-white text-sm">
                          {currentEditApp.id ? `Edit App: ${currentEditApp.title_en || currentEditApp.title_sd}` : 'Create App Box'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingApp(false);
                            setCurrentEditApp(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (Sindhi)</label>
                          <input
                            type="text"
                            value={currentEditApp.title_sd || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, title_sd: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (Urdu)</label>
                          <input
                            type="text"
                            value={currentEditApp.title_ur || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, title_ur: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-urdu"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Title (English)</label>
                          <input
                            type="text"
                            required
                            value={currentEditApp.title_en || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, title_en: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      {/* Direct URL */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Direct App Link URL (Opens immediately when user presses on the image)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={currentEditApp.url || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, url: e.target.value })}
                            placeholder="https://... or FUN_WITH_MATH_URL or Anmol Ak _TEST_MAKER_URL"
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                          />
                          {currentEditApp.url && (
                            <button
                              type="button"
                              onClick={() => {
                                if (currentEditApp.url?.startsWith('http')) {
                                  window.open(currentEditApp.url, '_blank');
                                } else {
                                  alert(`Configured URL value is: ${currentEditApp.url}`);
                                }
                              }}
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Test Link</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* First Screen Image Upload */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="block text-xs font-semibold text-slate-300">
                          App First Screen Image (Screenshot / Preview shown in app box)
                        </label>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <input
                            type="text"
                            value={currentEditApp.first_screen_image || currentEditApp.thumbnail_url || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, first_screen_image: e.target.value })}
                            placeholder="/src/assets/images/... or uploaded URL"
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                          />

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Upload from Gallery / Photos */}
                            <label className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg cursor-pointer text-xs font-semibold border border-emerald-800 flex items-center gap-1.5 transition-colors">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>🖼️ From Gallery</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'first_screen_image', 'app')}
                              />
                            </label>

                            {/* Upload from File Manager */}
                            <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors">
                              <Folder className="w-3.5 h-3.5 text-amber-400" />
                              <span>📁 From Files</span>
                              <input
                                type="file"
                                accept="*/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'first_screen_image', 'app')}
                              />
                            </label>
                          </div>
                        </div>

                        {/* First Screen Preview */}
                        {(currentEditApp.first_screen_image || currentEditApp.thumbnail_url) && (
                          <div className="mt-2 p-2 bg-slate-900 rounded-xl border border-slate-800 inline-flex items-center gap-3">
                            <img
                              src={currentEditApp.first_screen_image || currentEditApp.thumbnail_url}
                              alt="First Screen Preview"
                              className="w-24 h-16 object-cover rounded-lg border border-slate-700 shadow-sm"
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-white block">First Screen Image Loaded</span>
                              <span className="text-slate-400 text-[11px]">User taps this image to open link directly</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description, Category & Folder */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Description (English)</label>
                          <textarea
                            rows={2}
                            value={currentEditApp.description_en || ''}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, description_en: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Category & Badge</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={currentEditApp.category || 'Mathematics'}
                              onChange={(e) => setCurrentEditApp({ ...currentEditApp, category: e.target.value })}
                              placeholder="Category"
                              className="w-1/2 text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            />
                            <input
                              type="text"
                              value={currentEditApp.badge || ''}
                              onChange={(e) => setCurrentEditApp({ ...currentEditApp, badge: e.target.value })}
                              placeholder="Badge (e.g. Popular)"
                              className="w-1/2 text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#00e599] mb-1">Target Folder (فولڊر بار ڪيٽيگري)</label>
                          <select
                            value={currentEditApp.folder || resolveItemFolder(currentEditApp)}
                            onChange={(e) => setCurrentEditApp({ ...currentEditApp, folder: e.target.value })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-[#00e599]/40 rounded-lg text-white font-semibold"
                          >
                            {folders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.icon} {f.name_en} ({f.name_sd})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingApp(false);
                            setCurrentEditApp(null);
                          }}
                          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Save App Box
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* App Cards List */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {apps.map((app) => {
                        const screenImg = app.first_screen_image || app.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg';
                        return (
                          <div key={app.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-3">
                            <div className="flex gap-3">
                              {/* Screen Thumbnail */}
                              <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                                <img
                                  src={screenImg}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-white text-sm font-sindhi truncate">{app.title_sd || app.title_en}</h4>
                                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">{app.category}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1">{app.description_en}</p>
                                <div className="mt-1 text-[11px] font-mono text-amber-300 truncate">
                                  Target: {app.url}
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-700 flex items-center justify-between gap-2">
                              <button
                                onClick={() => {
                                  setCurrentEditApp(app);
                                  setIsEditingApp(true);
                                }}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Box & Screen</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    if (app.url?.startsWith('http')) {
                                      window.open(app.url, '_blank');
                                    } else {
                                      alert(`Direct link target: ${app.url}`);
                                    }
                                  }}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded text-xs"
                                  title="Test Direct Link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    fetch(`/api/admin/apps/${app.id}`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${authToken}`,
                                      },
                                      body: JSON.stringify({ ...app, is_active: !app.is_active }),
                                    })
                                      .then(() => loadAdminData(authToken))
                                      .then(onDataChanged);
                                  }}
                                  className={`px-2 py-1 rounded text-[11px] font-mono ${
                                    app.is_active ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-700 text-slate-400'
                                  }`}
                                >
                                  {app.is_active ? 'Active' : 'Disabled'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 4: SITE & BRANDING */}
              {/* ============================================================ */}
              {adminTab === 'settings' && settings && (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Website Branding & Contact Details</h3>
                    <p className="text-xs text-slate-400">Owner-only branding, logo and footer configurations</p>
                  </div>

                  {/* Dedicated 3D Glassy Website Logo & Branding Control */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-[#00e599]/30 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-[#00e599]" />
                          <h4 className="text-base font-bold text-white font-sindhi">
                            ويب سائيٽ جو لوگو ۽ برانڊنگ (Website Logo & Branding)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          جڏهن توهان وٽ نئون لوگو هجي، هتي تصوير چونڊيو. اهو پاڻمرادو محفوظ ٿي سڄي سائيٽ تي نظر ايندو.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/30 self-start sm:self-auto">
                        Navbar & Footer Logo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Logo Live Preview Frame */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-[#00e599]/30 shadow-inner text-center">
                        <span className="text-[11px] text-slate-400 font-medium mb-2">
                          موجوده لوگو (Current Live Logo)
                        </span>
                        <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-[#00e599] shadow-[0_0_20px_rgba(0,229,153,0.35)] flex items-center justify-center overflow-hidden p-1.5 transition-transform hover:scale-105">
                          {settings.logo_url ? (
                            <img
                              src={settings.logo_url}
                              alt="Website Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#00b875] via-[#00e599] to-[#4ffec0] flex items-center justify-center text-slate-950 font-bold font-sindhi text-2xl shadow-inner">
                              سنڌ
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono mt-2">
                          {settings.logo_url ? 'Custom Brand Logo Active' : 'Default Sindh Emblem Active'}
                        </span>
                      </div>

                      {/* Uploader & Input Options */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                          <label className="block text-xs font-semibold text-slate-200">
                            1. نئون لوگو اپلوڊ ڪريو (Upload Logo from Device / Gallery):
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-4 py-2 bg-[#00e599] hover:bg-[#00c985] text-slate-950 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,153,0.35)] transition-all cursor-pointer">
                              <Camera className="w-4 h-4 text-slate-950" />
                              <span>🖼️ Choose Logo Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                              />
                            </label>
                            {settings.logo_url && (
                              <button
                                type="button"
                                onClick={() => setSettings({ ...settings, logo_url: '' })}
                                className="px-3 py-2 bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                              >
                                Revert to Default Emblem
                              </button>
                            )}
                          </div>
                          {logoUploadProgress && (
                            <div className="text-xs font-medium text-[#00e599] bg-[#00e599]/10 border border-[#00e599]/30 p-2 rounded-lg">
                              {logoUploadProgress}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-semibold text-slate-300">
                            2. يا لوگو جي لنڪ داخل ڪريو (Or Paste Image URL):
                          </label>
                          <input
                            type="text"
                            value={settings.logo_url || ''}
                            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                            placeholder="https://.../logo.png or /uploads/..."
                            className="w-full text-xs px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:border-[#00e599] focus:outline-none"
                          />
                          <p className="text-[11px] text-slate-400">
                            (توهان جڏهن به لوگو جي تصوير ڏيو، هتي اپلوڊ ڪري سگهو ٿا يا لنڪ رکي محفوظ ڪري سگهو ٿا)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name (Sindhi)</label>
                      <input
                        type="text"
                        value={settings.site_name_sd}
                        onChange={(e) => setSettings({ ...settings, site_name_sd: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name (Urdu)</label>
                      <input
                        type="text"
                        value={settings.site_name_ur}
                        onChange={(e) => setSettings({ ...settings, site_name_ur: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-urdu"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name (English)</label>
                      <input
                        type="text"
                        value={settings.site_name_en}
                        onChange={(e) => setSettings({ ...settings, site_name_en: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={settings.contact_phone}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">About Text (Sindhi)</label>
                    <textarea
                      rows={2}
                      value={settings.about_sd}
                      onChange={(e) => setSettings({ ...settings, about_sd: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-sindhi"
                      dir="rtl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    {settingsSaving ? 'Saving...' : 'Save Site Settings'}
                  </button>
                </form>
              )}

              {/* ============================================================ */}
              {/* TAB 5: SECURITY & AUDIT LOGS */}
              {/* ============================================================ */}
              {adminTab === 'logs' && (
                <div className="space-y-6">
                  {/* Change Password Panel */}
                  <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-[#00e599]/30 space-y-4 max-w-lg shadow-xl">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#00e599]" />
                        <span>پاسورڊ سيڪيورٽي ۽ تبديلي (Change Master Password)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        پاسورڊ مڪمل طور تي محفوظ آهي ۽ اسڪرين تي ڪنهن کي به ظاهر نه ٿيندو.
                      </p>
                    </div>

                    {pwChangeStatus && (
                      <div className={`p-2.5 rounded-xl text-xs font-medium border ${
                        pwChangeStatus.startsWith('✓') 
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                          : 'bg-rose-950/80 border-rose-800 text-rose-200'
                      }`}>
                        {pwChangeStatus}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">موجوده پاسورڊ (Current Password)</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full text-xs px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-[#00e599] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">نئون پاسورڊ (New Password - Min 6 chars)</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new strong password"
                          className="w-full text-xs px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-[#00e599] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">نئين پاسورڊ جي تصديق (Confirm New Password)</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full text-xs px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-white focus:border-[#00e599] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                    >
                      پاسورڊ تبديل ۽ محفوظ ڪريو (Update & Save Password)
                    </button>
                  </form>

                  {/* Audit Logs */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Owner Action Audit History</h4>
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                          <tr>
                            <th className="p-2.5">Timestamp</th>
                            <th className="p-2.5">Action</th>
                            <th className="p-2.5">Target</th>
                            <th className="p-2.5">Details</th>
                            <th className="p-2.5">User</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/30">
                              <td className="p-2.5 font-mono text-[11px] text-slate-400">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="p-2.5 font-bold text-emerald-400 font-mono text-[11px]">{log.action}</td>
                              <td className="p-2.5">{log.resource_type}</td>
                              <td className="p-2.5 text-slate-300 max-w-xs truncate">{log.details}</td>
                              <td className="p-2.5 text-slate-400">{log.user_email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* TAB 6: BACKUP & EXPORT */}
              {/* ============================================================ */}
              {adminTab === 'backup' && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-lg font-bold text-white">Database Backup & Disaster Recovery</h3>
                    <p className="text-xs text-slate-400">
                      Export full JSON database snapshot and restore anytime.
                    </p>
                  </div>

                  {/* Export */}
                  <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Export JSON Database Backup</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Downloads complete database records including resources, categories, apps, settings, and logs into a timestamped JSON file.
                    </p>
                    <button
                      onClick={handleExportBackup}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Database Backup</span>
                    </button>
                  </div>

                  {/* Import / Restore */}
                  <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Restore Database from Backup</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Upload a previously exported backup file to restore curriculum resources and configurations.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select JSON Backup File</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportBackup}
                      />
                    </label>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
