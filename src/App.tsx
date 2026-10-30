/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { EducationalResource, AppLink, SiteSettings } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
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
import { VideoPlayerModal } from './components/player/VideoPlayerModal';
import { PdfReaderModal } from './components/pdf/PdfReaderModal';
import { GamesSectionFrame } from './components/games/GamesSectionFrame';
import { InteractiveGamesModal } from './components/games/InteractiveGamesModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  isStaticHosting,
  getStoredSettings,
  getStoredResources,
  getStoredApps,
  getStoredOwnerSession,
  safeFetchJson,
} from './utils/staticStorage';

function MainApp() {
  const { language } = useLanguage();
  const { playTrack } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState('home');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [apps, setApps] = useState<AppLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & Dedicated Viewers
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<EducationalResource | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<EducationalResource | null>(null);
  const [activeGameAppId, setActiveGameAppId] = useState<string | null>(null);

  // Saved scroll positions for seamless Back navigation
  const savedFolderScrollYRef = useRef<number>(0);
  const savedVideoScrollYRef = useRef<number>(0);
  const savedPdfScrollYRef = useRef<number>(0);

  // Navigation Filters passed to library
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('all');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const fetchAppData = () => {
    // If running on GitHub Pages / static hosting without backend
    if (isStaticHosting()) {
      const session = getStoredOwnerSession();
      setIsAdminLoggedIn(!!session.token);

      const localSettings = getStoredSettings();
      setSiteSettings(localSettings);

      const localResources = getStoredResources();
      setResources(localResources);
      setLoading(false);

      const localApps = getStoredApps();
      setApps(localApps);
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

  const handleSelectCategory = (catId: string) => {
    setLibraryCategoryFilter(catId);
    setActiveFolderId(null);
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClass = (classId: string) => {
    setActiveFolderId(null);
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setActiveFolderId(null);
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAudio = (track: EducationalResource, playlist?: EducationalResource[]) => {
    playTrack(track, playlist);
  };

  const handleWatchVideo = (video: EducationalResource) => {
    savedVideoScrollYRef.current = window.scrollY;
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    // Restore previous scroll position instantly
    setTimeout(() => {
      window.scrollTo({ top: savedVideoScrollYRef.current, behavior: 'instant' });
    }, 10);
  };

  const handleOpenPdf = (pdf: EducationalResource) => {
    savedPdfScrollYRef.current = window.scrollY;
    setSelectedPdf(pdf);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
    // Restore previous scroll position instantly
    setTimeout(() => {
      window.scrollTo({ top: savedPdfScrollYRef.current, behavior: 'instant' });
    }, 10);
  };

  const handleOpenApp = (appId: string) => {
    setActiveGameAppId(appId);
  };

  // Open a specific folder
  const handleOpenFolder = (folderId: string) => {
    savedFolderScrollYRef.current = window.scrollY;
    setActiveFolderId(folderId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from folder back to previous screen without losing position
  const handleBackFromFolder = () => {
    setActiveFolderId(null);
    setTimeout(() => {
      window.scrollTo({ top: savedFolderScrollYRef.current, behavior: 'smooth' });
    }, 50);
  };

  // Determine context title for player & viewer back button
  const currentFolderConfig = activeFolderId ? FOLDERS_CONFIG.find((f) => f.id === activeFolderId) : null;
  const videoContextTitle = currentFolderConfig
    ? language === 'sd'
      ? currentFolderConfig.title_sd
      : language === 'ur'
      ? currentFolderConfig.title_ur
      : currentFolderConfig.title_en
    : activeTab === 'home'
    ? (language === 'sd' ? 'گيلري' : 'گیلری')
    : activeTab;

  return (
    <div className="min-h-screen flex flex-col bg-[#04060a] text-slate-100 selection:bg-[#00e599] selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveFolderId(null);
        }}
        onOpenAdmin={() => setAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        logoUrl={siteSettings?.logo_url}
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
            {/* HOME VIEW: HERO + AUTO-SCROLL CAROUSEL + FOLDERS + GAMES + BOXES */}
            {/* ============================================================ */}
            {activeTab === 'home' && (
              <>
                {/* When a specific folder is opened, display ONLY that folder's contents with Back navigation */}
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
                      isPlayerOpen={selectedVideo !== null}
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
                  isPlayerOpen={selectedVideo !== null}
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
      </main>

      {/* DEDICATED FULL-SCREEN VIDEO PLAYER MODAL (Strict isolation: only plays target video, zero external suggestions) */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={handleCloseVideo}
          relatedVideos={resources.filter(
            (r) => r.content_type === 'video' && r.id !== selectedVideo.id
          )}
          onSelectVideo={(v) => setSelectedVideo(v)}
          contextTitle={videoContextTitle}
        />
      )}

      {/* DEDICATED READ-ONLY IN-APP PDF VIEWER MODAL */}
      {selectedPdf && (
        <PdfReaderModal
          resource={selectedPdf}
          onClose={handleClosePdf}
          contextTitle={videoContextTitle}
        />
      )}

      {/* Interactive Games & App Launchers Modal */}
      {activeGameAppId && (
        <InteractiveGamesModal
          appId={activeGameAppId}
          onClose={() => setActiveGameAppId(null)}
          mathUrl="FUN_WITH_MATH_URL"
          testMakerUrl="Anmol Ak _TEST_MAKER_URL"
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
      />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        logoUrl={siteSettings?.logo_url}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setActiveFolderId(null);
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
