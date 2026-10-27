import React, { useState, useEffect } from 'react';
import { EducationalResource, AppLink, HeroBanner, SiteSettings, AuditLog } from '../../types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw, 
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
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  initialResources: EducationalResource[];
  initialApps: AppLink[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  initialResources,
  initialApps,
}) => {
  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('anmol_admin_token'));
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [loginEmail, setLoginEmail] = useState('raorashid.anmol@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Password Recovery state
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newRecoveredPassword, setNewRecoveredPassword] = useState('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'content' | 'apps' | 'settings' | 'logs' | 'backup'>('overview');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

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
  const [pwChangeStatus, setPwChangeStatus] = useState<string | null>(null);

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Verify session on open - FIXED for GitHub Pages
useEffect(() => {
  if (authToken) {
    // Local check, no API call
    const savedUser = { email: 'raorashid.anmol@gmail.com', name: 'Anmol Sindh Owner' };
    setAdminUser(savedUser as any);
    loadAdminData(authToken);
  }
}, [authToken]);
        

  const loadAdminData = (token: string) => {
  // FIXED: No API on GitHub Pages
  setStats({ totalOrders: 0, revenue: 0 } as any);
  setAuditLogs([] as any);
  setSettings({} as any);
};
    // Refresh content with admin filter
    fetch('/api/content?admin=true')
      .then((res) => res.json())
      .then((data) => setResources(data.resources || []))
      .catch(() => {});

    // Refresh apps
    fetch('/api/apps')
      .then((res) => res.json())
      .then((data) => setApps(data || []))
      .catch(() => {});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('anmol_admin_token', data.token);
      setAuthToken(data.token);
      setAdminUser(data.user);
      loadAdminData(data.token);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (authToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('anmol_admin_token');
    setAuthToken(null);
    setAdminUser(null);
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryCode, newPassword: newRecoveredPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Password reset successfully! You can now log in.');
      setShowRecovery(false);
      setLoginPassword(newRecoveredPassword);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwChangeStatus('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwChangeStatus(`Error: ${err.message}`);
    }
  };

  // High-performance direct upload helper (supports large videos, audio, PDF from Gallery or File Manager)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'media_url' | 'thumbnail_url' | 'first_screen_image',
    target: 'resource' | 'app' = 'resource'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    const sourceName = file.type.startsWith('image/') ? 'Gallery / Photos' : 'File Manager / Files';
    setUploadProgress(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) from ${sourceName}...`);

    try {
      // Use direct binary stream upload (handles 100MB+ videos smoothly without base64 overhead)
      const res = await fetch(`/api/upload-binary?fileName=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          Authorization: `Bearer ${authToken}`,
        },
        body: file,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Detect media type
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|3gp|mkv|avi|m4v)$/i.test(file.name);
      const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name);
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

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
      } else if (target === 'app') {
        setCurrentEditApp((prev) => ({
          ...prev,
          [fieldName]: data.url,
        }));
      }

      setUploadProgress(`Upload complete: ${file.name} is ready to play/view!`);
      setTimeout(() => setUploadProgress(null), 4000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadProgress(`Upload failed: ${err.message}`);
    }
  };

  // Save Content Resource
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !currentEditResource) return;

    try {
      const isNew = !currentEditResource.id;
      const url = isNew ? '/api/admin/content' : `/api/admin/content/${currentEditResource.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(currentEditResource),
      });

      if (!res.ok) throw new Error('Failed to save resource');

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
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
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
      const isNew = !currentEditApp.id;
      const url = isNew ? '/api/admin/apps' : `/api/admin/apps/${currentEditApp.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(currentEditApp),
      });

      if (!res.ok) throw new Error('Failed to save app');

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
      await fetch(`/api/admin/apps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      alert('Site settings updated successfully!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Backup Export
  const handleExportBackup = () => {
    if (!authToken) return;
    window.location.href = `/api/admin/export?token=${authToken}`;
  };

  // Backup Import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        const res = await fetch('/api/admin/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(json),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert(data.message || 'Database restored successfully!');
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter owner password"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="mt-1 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Default initial password: <strong className="text-amber-400 font-mono">AnmolSindh@2026</strong></span>
                    <button
                      type="button"
                      onClick={() => setShowRecovery(true)}
                      className="text-emerald-400 hover:underline"
                    >
                      Forgot?
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
                    type="text"
                    required
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="ANMOL-9988-SECURE"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400">System Code: <strong className="font-mono text-emerald-400">ANMOL-9988-SECURE</strong></span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Master Password</label>
                  <input
                    type="password"
                    required
                    value={newRecoveredPassword}
                    onChange={(e) => setNewRecoveredPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full text-sm px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
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

                      {/* Grade, Subject, Category, Media Type */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            value={currentEditResource?.category || 'lessons_explanations'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, category: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="audio_poems">Audio Poems</option>
                            <option value="animated_stories">Animated Stories</option>
                            <option value="educational_videos">Educational Videos</option>
                            <option value="lessons_explanations">Lessons & Explanations</option>
                            <option value="rhymes_nursery">Rhymes & Nursery</option>
                            <option value="english_vocabulary">English Vocabulary</option>
                            <option value="sindhi_learning">Sindhi Learning</option>
                            <option value="urdu_learning">Urdu Learning</option>
                            <option value="worksheets_pdf">Worksheets & PDF</option>
                            <option value="educational_games">Educational Games</option>
                            <option value="tests_quizzes">Tests & Quizzes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Content Type</label>
                          <select
                            value={currentEditResource?.content_type || 'audio'}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, content_type: e.target.value as any })}
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="audio">Audio (MP3)</option>
                            <option value="video">Video (MP4/WebM)</option>
                            <option value="pdf">Worksheet / PDF</option>
                            <option value="interactive">Interactive</option>
                          </select>
                        </div>
                      </div>

                      {/* File Uploads & URLs with Gallery & File Manager buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-300">
                            Media File (Audio MP3 / Video MP4 / PDF Worksheet)
                          </label>
                          <input
                            type="text"
                            value={currentEditResource?.media_url || ''}
                            onChange={(e) => setCurrentEditResource({ ...currentEditResource, media_url: e.target.value })}
                            placeholder="/uploads/... or https://..."
                            className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                          <div className="flex flex-wrap gap-2 pt-1">
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

                      {/* Description & Category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Website Branding & Contact Details</h3>
                    <p className="text-xs text-slate-400">Owner-only branding and footer configurations</p>
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
                  <form onSubmit={handleChangePassword} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 max-w-md">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      <span>Change Master Administrator Password</span>
                    </h4>

                    {pwChangeStatus && (
                      <div className="p-2 bg-slate-900 border border-slate-700 text-xs rounded text-emerald-300">
                        {pwChangeStatus}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">New Password (Min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Update Password
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
