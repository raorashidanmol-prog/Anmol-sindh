/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { EducationalResource, AppLink, SiteSettings, FolderCategory, InAppViewerItem } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FolderButtonBar } from './components/layout/FolderButtonBar';
import { InAppViewer } from './components/viewer/InAppViewer';
import { HeroSection } from './components/home/HeroSection';
import { SmartKidsHubSection } from './components/home/SmartKidsHubSection';
import { ThisWeekUpdates } from './components/home/ThisWeekUpdates';
import { AutoVideoCarousel } from './components/home/AutoVideoCarousel';
import { FolderGrid } from './components/folders/FolderGrid';
import { FolderDetailView } from './components/folders/FolderDetailView';
import { FOLDERS_CONFIG } from './components/folders/folderData';
import { AppsSection } from './components/home/AppsSection';
import { HomeMediaBoxes } from './components/home/HomeMediaBoxes';
import { ContentLibrary } from './components/content/ContentLibrary';
import { DownloadCenter } from './components/download/DownloadCenter';
import { GamesSectionFrame } from './components/games/GamesSectionFrame';
import { InteractiveVideoSection } from './components/videos/InteractiveVideoSection';
import { InteractiveGamesSection } from './components/games/InteractiveGamesSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  isStaticHosting,
  getStoredSettings,
  getStoredResources,
  getStoredApps,
  getStoredOwnerSession,
  getStoredFolders,
  resolveItemFolder,
  detectMediaType,
  safeFetchJson,
} from './utils/staticStorage';
import { 
  Folder, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Gamepad2, 
  ExternalLink, 
  Plus 
} from 'lucide-react';

function MainApp() {
  const { language } = useLanguage();
  const { playTrack } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState('home');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [apps, setApps] = useState<AppLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Folder Bar State
  const [folders, setFolders] = useState<FolderCategory[]>(() => getStoredFolders());
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  // Dedicated In-App Viewer State (All saved links open inside this viewer)
  const [viewerItem, setViewerItem] = useState<InAppViewerItem | null>(null);

  // Admin Modal
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<
    'overview' | 'manage' | 'content' | 'apps' | 'folders' | 'settings' | 'logs' | 'backup'
  >('manage');

  // Saved scroll positions for seamless Back navigation
  const savedFolderScrollYRef = useRef<number>(0);
  const savedVideoScrollYRef = useRef<number>(0);

  // Navigation Filters passed to library
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('all');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const fetchAppData = () => {
    // Refresh folders
    setFolders(getStoredFolders());

    // If running on GitHub Pages / static hosting without backend
    if (isStaticHosting()) {
      const session = getStoredOwnerSession();
      setIsAdminLoggedIn(!!session.token);

      const localSettings = getStoredSettings();
      setSiteSettings(localSettings);

      const localResources = getStoredResources();
      setResources(localResources);

      const localApps = getStoredApps();
      setApps(localApps);

      setLoading(false);
      return;
    }

    // Full-stack / server mode with safe fallback
    const token = localStorage.getItem('anmol_admin_token');
    if (token) {
      safeFetchJson('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(() => setIsAdminLoggedIn(true))
        .catch(() => {
          const session = getStoredOwnerSession();
          setIsAdminLoggedIn(!!session.token);
        });
    } else {
      setIsAdminLoggedIn(false);
    }

    // Load site settings
    safeFetchJson('/api/settings')
      .then((data) => setSiteSettings(data))
      .catch(() => setSiteSettings(getStoredSettings()));

    // Load content
    safeFetchJson('/api/content')
      .then((data) => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch(() => {
        setResources(getStoredResources());
        setLoading(false);
      });

    // Load apps
    safeFetchJson('/api/apps')
      .then((data) => setApps(data || []))
      .catch(() => setApps(getStoredApps()));
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  // Compute item counts for the Folder Button Bar
  const folderItemCounts: Record<string, number> = {
    all: resources.length + apps.length,
  };
  folders.forEach((f) => {
    if (f.id !== 'all') {
      const resCount = resources.filter((r) => resolveItemFolder(r) === f.id).length;
      const appCount = apps.filter((a) => resolveItemFolder(a) === f.id).length;
      folderItemCounts[f.id] = resCount + appCount;
    }
  });

  // Main In-App Viewer handler: Any saved link opens INSIDE the app
  const openInViewer = (item: {
    id: string;
    title: string;
    url: string;
    type?: InAppViewerItem['type'];
    description?: string;
    thumbnailUrl?: string;
    folder?: string;
  }) => {
    const computedType = item.type || detectMediaType(item.url);
    setViewerItem({
      id: item.id,
      title: item.title,
      url: item.url,
      type: computedType,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
      folder: item.folder,
    });
  };

  const handleWatchVideo = (video: EducationalResource) => {
    savedVideoScrollYRef.current = window.scrollY;
    const title = video.title_en || video.title_sd;
    const desc = video.description_en || video.description_sd;
    openInViewer({
      id: video.id,
      title: title || video.title_en,
      url: video.media_url,
      type: 'video',
      description: desc,
      thumbnailUrl: video.thumbnail_url,
      folder: resolveItemFolder(video),
    });
  };

  const handleOpenPdf = (pdf: EducationalResource) => {
    const title = pdf.title_en || pdf.title_sd;
    const desc = pdf.description_en || pdf.description_sd;
    openInViewer({
      id: pdf.id,
      title: title || pdf.title_en,
      url: pdf.media_url,
      type: 'pdf',
      description: desc,
      thumbnailUrl: pdf.thumbnail_url,
      folder: resolveItemFolder(pdf),
    });
  };

  const handleOpenApp = (appId: string) => {
    const targetApp = apps.find(
      (a) => a.id === appId || a.title_en?.toLowerCase() === appId.toLowerCase()
    );
    if (targetApp) {
      const title = targetApp.title_en || targetApp.title_sd;
      const desc = targetApp.description_en || targetApp.description_sd;
      openInViewer({
        id: targetApp.id,
        title: title || targetApp.title_en,
        url: targetApp.url,
        type: detectMediaType(targetApp.url, 'game'),
        description: desc,
        thumbnailUrl: targetApp.first_screen_image || targetApp.thumbnail_url,
        folder: resolveItemFolder(targetApp),
      });
    } else {
      let url = 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_all.html';
      let title = 'Educational Game';
      if (appId === 'math' || appId === 'FUN_WITH_MATH_URL' || appId === 'app_fun_with_math') {
        title = 'Fun with Math Game';
        url = 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_all.html';
      } else if (appId === 'test_maker' || appId === 'Anmol Ak _TEST_MAKER_URL' || appId === 'app_ra_test_maker') {
        title = 'RA Test Maker App';
        url = 'https://kahoot.it';
      }
      openInViewer({
        id: appId,
        title,
        url,
        type: 'game',
        folder: 'games',
      });
    }
  };

  const handlePlayAudio = (track: EducationalResource, playlist?: EducationalResource[]) => {
    playTrack(track, playlist);
  };

  const handleSelectCategory = (catId: string) => {
    setLibraryCategoryFilter(catId);
    setActiveFolderId(null);
    setSelectedFolder('all');
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (classId: string) => {
    setActiveFolderId(null);
    setSelectedFolder('all');
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setActiveFolderId(null);
    setSelectedFolder('all');
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open a specific folder from the visual FolderGrid
  const handleOpenFolder = (folderId: string) => {
    savedFolderScrollYRef.current = window.scrollY;
    setActiveFolderId(folderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from folder back to previous screen
  const handleBackFromFolder = () => {
    setActiveFolderId(null);
    setTimeout(() => {
      window.scrollTo({ top: savedFolderScrollYRef.current, behavior: 'smooth' });
    }, 50);
  };

  // Filtered folder resources and apps when Button Bar folder is active
  const folderResources = resources.filter((r) => resolveItemFolder(r) === selectedFolder);
  const folderApps = apps.filter((a) => resolveItemFolder(a) === selectedFolder);
  const currentSelectedFolderObj = folders.find((f) => f.id === selectedFolder);

  return (
    <div className="min-h-screen flex flex-col bg-[#eef8ff] text-slate-800 selection:bg-sky-400 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveFolderId(null);
          setSelectedFolder('all');
        }}
        onOpenAdmin={() => {
          setAdminInitialTab('manage');
          setAdminOpen(true);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        logoUrl={siteSettings?.logo_url}
        onSearch={handleSearch}
      />

      {/* Horizontal Scrollable Folder Button Bar */}
      <FolderButtonBar
        folders={folders}
        activeFolderId={selectedFolder}
        onSelectFolder={(folderId) => {
          setSelectedFolder(folderId);
          setActiveFolderId(null);
        }}
        itemCounts={folderItemCounts}
        onOpenAddFolder={() => {
          setAdminInitialTab('folders');
          setAdminOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-heading text-blue-600 font-bold text-lg">
              Smart Kids Learning Hub is loading...
            </p>
          </div>
        ) : (
          <>
            {/* ============================================================ */}
            {/* BUTTON BAR FILTERED FOLDER VIEW */}
            {/* ============================================================ */}
            {selectedFolder !== 'all' ? (
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
                {/* Folder Header Breadcrumb */}
                <div className="card-3d-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-400/25"
                      style={{ backgroundColor: currentSelectedFolderObj?.color || '#0284c7' }}
                    >
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                          {currentSelectedFolderObj?.name_en || currentSelectedFolderObj?.name_sd}
                        </h1>
                        <span className="px-3 py-0.5 rounded-full text-xs font-heading font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          {folderResources.length + folderApps.length} Items
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Dedicated saved links and educational resources in this folder
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFolder('all')}
                      className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-slate-700 rounded-full text-xs font-heading font-bold border-2 border-sky-200 flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <ArrowLeft className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                      <span>← Back to All</span>
                    </button>

                    {isAdminLoggedIn && (
                      <button
                        onClick={() => {
                          setAdminInitialTab('manage');
                          setAdminOpen(true);
                        }}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-heading font-bold border-2 border-blue-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Manage Folder</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Cards Grid */}
                {folderResources.length === 0 && folderApps.length === 0 ? (
                  <div className="card-3d-white p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-100 flex items-center justify-center text-blue-600">
                      <Folder className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-heading font-black text-slate-800">
                        No Items in this Folder Yet
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        No links or resources saved in this folder yet. Use the Admin Dashboard to save videos, PDF books, games, or apps!
                      </p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => setSelectedFolder('all')}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-heading font-bold hover:bg-slate-200 cursor-pointer"
                      >
                        Back to All Content
                      </button>
                      {isAdminLoggedIn && (
                        <button
                          onClick={() => {
                            setAdminInitialTab('manage');
                            setAdminOpen(true);
                          }}
                          className="btn-3d-blue px-5 py-2.5 rounded-full text-xs cursor-pointer"
                        >
                          + Add Content Here
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {/* Render Folder Resources */}
                    {folderResources.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.content_type === 'video') handleWatchVideo(item);
                          else if (item.content_type === 'pdf') handleOpenPdf(item);
                          else handleWatchVideo(item);
                        }}
                        className="card-3d-white overflow-hidden cursor-pointer flex flex-col justify-between group hover:-translate-y-1 transition-all"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                          <img
                            src={item.thumbnail_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80'}
                            alt={item.title_en}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-white/95 text-blue-700 shadow-xs border border-sky-100">
                              {item.content_type}
                            </span>
                            {item.class_level && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-amber-400 text-amber-950 shadow-xs">
                                Class {item.class_level}
                              </span>
                            )}
                          </div>

                          {/* Play / Open Icon overlay on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/40">
                            <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              {item.content_type === 'video' ? (
                                <Play className="w-5 h-5 ml-0.5 fill-blue-600" />
                              ) : item.content_type === 'pdf' ? (
                                <BookOpen className="w-5 h-5" />
                              ) : (
                                <ExternalLink className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="font-heading font-black text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {item.title_en}
                            </h3>
                            {item.title_sd && (
                              <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {item.title_sd}
                              </p>
                            )}
                            {(item.description_en || item.description_sd) && (
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                {item.description_en || item.description_sd}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-sky-100 text-xs text-slate-500">
                            <span className="text-blue-600 font-heading font-bold">{item.subject}</span>
                            <span className="font-heading font-bold text-slate-700 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                              Open in Viewer →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Render Folder Apps */}
                    {folderApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleOpenApp(app.id)}
                        className="card-3d-white overflow-hidden cursor-pointer flex flex-col justify-between group hover:-translate-y-1 transition-all"
                      >
                        {/* Thumbnail / First screen image */}
                        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                          <img
                            src={app.first_screen_image || app.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'}
                            alt={app.title_en}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-white/95 text-rose-600 shadow-xs border border-rose-100">
                              App
                            </span>
                            {app.badge && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black bg-amber-400 text-amber-950">
                                {app.badge}
                              </span>
                            )}
                          </div>

                          {/* Launch Icon overlay on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/40">
                            <div className="w-12 h-12 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <Gamepad2 className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="font-heading font-black text-sm text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {app.title_en}
                            </h3>
                            {app.title_sd && (
                              <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {app.title_sd}
                              </p>
                            )}
                            {(app.description_en || app.description_sd) && (
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                {app.description_en || app.description_sd}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-sky-100 text-xs text-slate-500">
                            <span className="text-rose-500 font-heading font-bold">{app.category || 'App'}</span>
                            <span className="font-heading font-bold text-slate-700 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                              Play In-App →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ============================================================ */
              /* STANDARD HOME VIEW & TABS */
              /* ============================================================ */
              <>
                {/* HOME TAB */}
                {activeTab === 'home' && (
                  <>
                    {activeFolderId ? (
                      <FolderDetailView
                        folderId={activeFolderId}
                        allResources={resources}
                        allApps={apps}
                        onBack={handleBackFromFolder}
                        onWatchVideo={handleWatchVideo}
                        onPlayAudio={handlePlayAudio}
                        onOpenPdf={handleOpenPdf}
                        onOpenApp={handleOpenApp}
                      />
                    ) : (
                      <>
                        {/* 1. HERO BANNER: Learn • Play • Grow (Panoramic Cartoon School & Kids) */}
                        <HeroSection
                          onSearch={handleSearch}
                          onSelectClass={handleSelectClass}
                          onNavigateTab={(tab) => {
                            setActiveTab(tab);
                            setActiveFolderId(null);
                            setSelectedFolder('all');
                          }}
                          onOpenApp={handleOpenApp}
                        />

                        {/* 2. SMART KIDS LEARNING HUB: 8 3D Subject Cards, 3 Learning Section Cards, Rainbow Banner */}
                        <SmartKidsHubSection
                          resources={resources}
                          apps={apps}
                          onWatchVideo={handleWatchVideo}
                          onOpenPdf={handleOpenPdf}
                          onOpenApp={handleOpenApp}
                          onNavigateTab={(tab) => {
                            setActiveTab(tab);
                            setActiveFolderId(null);
                            setSelectedFolder('all');
                          }}
                          onSelectSubject={(subjName) => {
                            handleSearch(subjName);
                          }}
                        />

                        {/* 3. NEW UPDATES THIS WEEK FRAME (Auto-scrolling with < > navigation signs) */}
                        <ThisWeekUpdates
                          resources={resources}
                          apps={apps}
                          onPlayAudio={handlePlayAudio}
                          onWatchVideo={handleWatchVideo}
                          onOpenPdf={handleOpenPdf}
                          onOpenApp={handleOpenApp}
                        />

                        {/* 4. AUTOMATIC VIDEO CAROUSEL (Every 3s, Pause/Play controls, Prev/Next, Touch Swipe) */}
                        <AutoVideoCarousel
                          videos={resources}
                          onWatchVideo={handleWatchVideo}
                          isPlayerOpen={viewerItem !== null}
                        />

                        {/* 5. INTERACTIVE PRIMARY EDUCATIONAL GAMES FRAME (Playable directly on the page!) */}
                        <GamesSectionFrame
                          initialGameId="math"
                          onOpenExternalModal={handleOpenApp}
                        />

                        {/* 6. VISUAL FOLDER SYSTEM (3D Cards) */}
                        <FolderGrid
                          resources={resources}
                          apps={apps}
                          onOpenFolder={handleOpenFolder}
                        />

                        {/* 7. APPS & GAMES SECTION (3D First-Screen Preview Cards) */}
                        <AppsSection
                          apps={apps}
                          onOpenApp={handleOpenApp}
                        />

                        {/* 8. CORE MEDIA BOXES (Video Poems, Animated Stories, Read-Only PDF Books) */}
                        <HomeMediaBoxes
                          resources={resources}
                          onWatchVideo={handleWatchVideo}
                          onOpenPdf={handleOpenPdf}
                          onNavigateTab={(tab) => {
                            setActiveTab(tab);
                            setActiveFolderId(null);
                            setSelectedFolder('all');
                          }}
                        />
                      </>
                    )}
                  </>
                )}

                {/* VIDEO GALLERY VIEW - INTERACTIVE YOUTUBE VIDEOS */}
                {activeTab === 'videos' && (
                  <div className="space-y-10 py-6">
                    <InteractiveVideoSection
                      videos={resources}
                      onWatchVideo={handleWatchVideo}
                      isAdminLoggedIn={isAdminLoggedIn}
                      onOpenAdminAdd={() => {
                        setAdminInitialTab('manage');
                        setAdminOpen(true);
                      }}
                    />
                    <AutoVideoCarousel
                      videos={resources}
                      onWatchVideo={handleWatchVideo}
                      isPlayerOpen={viewerItem !== null}
                    />
                    <ContentLibrary
                      resources={resources.filter((r) => r.content_type === 'video')}
                      onPlayAudio={handlePlayAudio}
                      onWatchVideo={handleWatchVideo}
                      onOpenPdf={handleOpenPdf}
                      onOpenGame={handleOpenApp}
                      initialCategory="all"
                    />
                  </div>
                )}

                {/* FULL LIBRARY VIEW */}
                {activeTab === 'library' && (
                  <ContentLibrary
                    resources={resources}
                    onPlayAudio={handlePlayAudio}
                    onWatchVideo={handleWatchVideo}
                    onOpenPdf={handleOpenPdf}
                    onOpenGame={handleOpenApp}
                    initialCategory={libraryCategoryFilter}
                  />
                )}

                {/* ANIMATED STORIES TAB */}
                {activeTab === 'stories' && (
                  <ContentLibrary
                    resources={resources}
                    onPlayAudio={handlePlayAudio}
                    onWatchVideo={handleWatchVideo}
                    onOpenPdf={handleOpenPdf}
                    onOpenGame={handleOpenApp}
                    initialCategory="animated_stories"
                  />
                )}

                {/* GAMES & APPS VIEW - INTERACTIVE ONLINE GAMES */}
                {activeTab === 'apps' && (
                  <div className="py-6 space-y-10">
                    <InteractiveGamesSection
                      games={apps}
                      onPlayGame={handleOpenApp}
                      isAdminLoggedIn={isAdminLoggedIn}
                      onOpenAdminAdd={() => {
                        setAdminInitialTab('apps');
                        setAdminOpen(true);
                      }}
                    />
                    <GamesSectionFrame
                      initialGameId="math"
                      onOpenExternalModal={handleOpenApp}
                    />
                    <AppsSection
                      apps={apps}
                      onOpenApp={handleOpenApp}
                    />
                  </div>
                )}

                {/* DOWNLOAD CENTER & READ-ONLY BOOKS VIEW */}
                {activeTab === 'downloads' && (
                  <DownloadCenter
                    resources={resources}
                    onPlayAudio={handlePlayAudio}
                    onWatchVideo={handleWatchVideo}
                    onOpenPdf={handleOpenPdf}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* DEDICATED IN-APP LINK VIEWER (Runs videos, PDFs, games, and website links INSIDE the app) */}
      {viewerItem && (
        <InAppViewer
          item={viewerItem}
          onClose={() => setViewerItem(null)}
          logoUrl={siteSettings?.logo_url}
        />
      )}

      {/* Owner-Only Admin Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          fetchAppData();
        }}
        onDataChanged={fetchAppData}
        initialResources={resources}
        initialApps={apps}
        initialTab={adminInitialTab}
      />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          setAdminInitialTab('manage');
          setAdminOpen(true);
        }}
        logoUrl={siteSettings?.logo_url}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setActiveFolderId(null);
          setSelectedFolder('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AudioPlayerProvider>
        <MainApp />
      </AudioPlayerProvider>
    </LanguageProvider>
  );
}
