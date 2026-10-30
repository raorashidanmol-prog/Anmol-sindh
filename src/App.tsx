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
    const title = language === 'sd' ? video.title_sd : language === 'ur' ? video.title_ur : video.title_en;
    const desc = language === 'sd' ? video.description_sd : language === 'ur' ? video.description_ur : video.description_en;
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
    const title = language === 'sd' ? pdf.title_sd : language === 'ur' ? pdf.title_ur : pdf.title_en;
    const desc = language === 'sd' ? pdf.description_sd : language === 'ur' ? pdf.description_ur : pdf.description_en;
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
      const title = language === 'sd' ? targetApp.title_sd : language === 'ur' ? targetApp.title_ur : targetApp.title_en;
      const desc = language === 'sd' ? targetApp.description_sd : language === 'ur' ? targetApp.description_ur : targetApp.description_en;
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
      if (appId === 'math' || appId === 'FUN_WITH_MATH_URL') {
        title = language === 'sd' ? 'رياضي سان مزو' : 'Fun with Math';
        url = 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_all.html';
      } else if (appId === 'test_maker' || appId === 'Anmol Ak _TEST_MAKER_URL') {
        title = language === 'sd' ? 'ٽيسٽ ميڪر' : 'RA Test Maker';
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
    <div className="min-h-screen flex flex-col bg-[#04060a] text-slate-100 selection:bg-[#00e599] selection:text-black">
      
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
            <div className="w-12 h-12 border-4 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-sindhi text-[#00e599] font-bold text-lg">
              انمول سنڌ پورٽل لوڊ ٿي رهيو آهي...
            </p>
          </div>
        ) : (
          <>
            {/* ============================================================ */}
            {/* BUTTON BAR FILTERED FOLDER VIEW */}
            {/* ============================================================ */}
            {selectedFolder !== 'all' ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
                {/* Folder Header Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg shadow-[#00e599]/20"
                      style={{ backgroundColor: currentSelectedFolderObj?.color || '#00e599' }}
                    >
                      <Folder className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-black text-white font-sindhi">
                          {language === 'sd' ? currentSelectedFolderObj?.name_sd : language === 'ur' ? currentSelectedFolderObj?.name_ur : currentSelectedFolderObj?.name_en}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30">
                          {folderResources.length + folderApps.length} Items
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {language === 'sd' ? 'مخصوص فائيل ۽ محفوظ ڪيل لنڪس' : language === 'ur' ? 'محفوظ کردہ لنکس اور تعلیمی مواد' : 'Dedicated saved links & educational resources in this folder'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFolder('all')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#00e599]" />
                      <span>{language === 'sd' ? '← سڀ ڪلاس ڏسو' : language === 'ur' ? '← تمام کلاسز دیکھیں' : '← View All Classes'}</span>
                    </button>

                    {isAdminLoggedIn && (
                      <button
                        onClick={() => {
                          setAdminInitialTab('manage');
                          setAdminOpen(true);
                        }}
                        className="px-3 py-2 bg-[#00e599]/15 hover:bg-[#00e599]/25 text-[#00e599] rounded-xl text-xs font-bold border border-[#00e599]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Manage Folder</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Cards Grid */}
                {folderResources.length === 0 && folderApps.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                      <Folder className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white font-sindhi">
                        هن فولڊر ۾ اڃا ڪو به مواد موجود ناهي
                      </h3>
                      <p className="text-xs text-slate-400">
                        No links or resources saved in this folder yet. Use the Admin Panel to add videos, PDFs, games, or apps!
                      </p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => setSelectedFolder('all')}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        Back to All Content
                      </button>
                      {isAdminLoggedIn && (
                        <button
                          onClick={() => {
                            setAdminInitialTab('manage');
                            setAdminOpen(true);
                          }}
                          className="px-4 py-2 bg-[#00e599] text-black font-bold rounded-xl text-xs shadow-md shadow-[#00e599]/20 cursor-pointer"
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
                        className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl border border-slate-800 hover:border-[#00e599]/70 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#00e599]/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                          <img
                            src={item.thumbnail_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80'}
                            alt={item.title_en}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#00e599] border border-[#00e599]/30">
                              {item.content_type}
                            </span>
                            {item.class_level && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
                                Class {item.class_level}
                              </span>
                            )}
                          </div>

                          {/* Play / Open Icon overlay on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <div className="w-12 h-12 rounded-full bg-[#00e599] text-black flex items-center justify-center shadow-lg shadow-[#00e599]/40 transform scale-75 group-hover:scale-100 transition-transform">
                              {item.content_type === 'video' ? (
                                <Play className="w-5 h-5 ml-0.5 fill-black" />
                              ) : item.content_type === 'pdf' ? (
                                <BookOpen className="w-5 h-5" />
                              ) : (
                                <ExternalLink className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-[#00e599] transition-colors font-sindhi">
                              {item.title_sd || item.title_en}
                            </h3>
                            {item.title_en && item.title_sd && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {item.title_en}
                              </p>
                            )}
                            {(item.description_sd || item.description_en) && (
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                                {item.description_sd || item.description_en}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <span className="text-[#00e599] font-medium">{item.subject}</span>
                            <span className="font-semibold text-slate-300 flex items-center gap-1 group-hover:text-[#00e599] transition-colors">
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
                        className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl border border-slate-800 hover:border-[#00e599]/70 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#00e599]/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                      >
                        {/* Thumbnail / First screen image */}
                        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                          <img
                            src={app.first_screen_image || app.thumbnail_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'}
                            alt={app.title_en}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#00e599] border border-[#00e599]/30">
                              Interactive App
                            </span>
                            {app.badge && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#00e599] text-black">
                                {app.badge}
                              </span>
                            )}
                          </div>

                          {/* Launch Icon overlay on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                            <div className="w-12 h-12 rounded-full bg-[#00e599] text-black flex items-center justify-center shadow-lg shadow-[#00e599]/40 transform scale-75 group-hover:scale-100 transition-transform">
                              <Gamepad2 className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-[#00e599] transition-colors font-sindhi">
                              {app.title_sd || app.title_en}
                            </h3>
                            {app.title_en && app.title_sd && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {app.title_en}
                              </p>
                            )}
                            {(app.description_sd || app.description_en) && (
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                                {app.description_sd || app.description_en}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                            <span className="text-[#00e599] font-medium">{app.category || 'App'}</span>
                            <span className="font-semibold text-slate-300 flex items-center gap-1 group-hover:text-[#00e599] transition-colors">
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
                    {/* When a specific folder is opened from FolderGrid, display ONLY that folder's contents with Back navigation */}
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
                        {/* Hero Section */}
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

                        {/* NEW UPDATES THIS WEEK FRAME (Auto-scrolling with < > navigation signs) */}
                        <ThisWeekUpdates
                          resources={resources}
                          apps={apps}
                          onPlayAudio={handlePlayAudio}
                          onWatchVideo={handleWatchVideo}
                          onOpenPdf={handleOpenPdf}
                          onOpenApp={handleOpenApp}
                        />

                        {/* 1. AUTOMATIC VIDEO CAROUSEL (Every 3s, Pause/Play controls, Prev/Next, Touch Swipe) */}
                        <AutoVideoCarousel
                          videos={resources}
                          onWatchVideo={handleWatchVideo}
                          isPlayerOpen={viewerItem !== null}
                        />

                        {/* 2. DEDICATED INTERACTIVE GAMES FRAME (Playable directly on the page!) */}
                        <GamesSectionFrame
                          initialGameId="math"
                          onOpenExternalModal={handleOpenApp}
                        />

                        {/* 3. PROFESSIONAL FOLDER AND CATEGORY SYSTEM (Visual 3D Glass Folders) */}
                        <FolderGrid
                          resources={resources}
                          apps={apps}
                          onOpenFolder={handleOpenFolder}
                        />

                        {/* 4. APPS & GAMES APPS SECTION */}
                        <AppsSection
                          apps={apps}
                          onOpenApp={handleOpenApp}
                        />

                        {/* 5. CORE MEDIA BOXES (Video Poems, Animated Stories, Read-Only PDF Books) */}
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

                {/* VIDEO GALLERY VIEW */}
                {activeTab === 'videos' && (
                  <div className="space-y-8 py-6">
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

                {/* GAMES & APPS VIEW WITH PLAYABLE FRAME */}
                {activeTab === 'apps' && (
                  <div className="py-6 space-y-8">
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
