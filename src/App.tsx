/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import { EducationalResource, AppLink } from './types';
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
import { GlobalAudioPlayer } from './components/player/GlobalAudioPlayer';
import { VideoPlayerModal } from './components/player/VideoPlayerModal';
import { InteractiveGamesModal } from './components/games/InteractiveGamesModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const { language } = useLanguage();
  const { playTrack } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState('home');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [apps, setApps] = useState<AppLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<EducationalResource | null>(null);
  const [activeGameAppId, setActiveGameAppId] = useState<string | null>(null);

  // Saved scroll positions for seamless Back navigation
  const savedFolderScrollYRef = useRef<number>(0);
  const savedVideoScrollYRef = useRef<number>(0);

  // Navigation Filters passed to library
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState('all');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const fetchAppData = () => {
    // Check admin session
    const token = localStorage.getItem('anmol_admin_token');
    if (token) {
      fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setIsAdminLoggedIn(res.ok))
        .catch(() => setIsAdminLoggedIn(false));
    } else {
      setIsAdminLoggedIn(false);
    }

    // Load content
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load content:', err);
        setLoading(false);
      });

    // Load apps
    fetch('/api/apps')
      .then((res) => res.json())
      .then((data) => setApps(data || []))
      .catch((err) => console.error('Failed to load apps:', err));
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

  // Determine context title for the video player back button
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
            {/* HOME VIEW: HERO + AUTO-SCROLL CAROUSEL + FOLDERS + APPS + BOXES */}
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
                      onOpenApp={handleOpenApp}
                    />

                    {/* 1. AUTOMATIC VIDEO CAROUSEL (Every 3s, Pause/Play controls, Prev/Next, Touch Swipe) */}
                    <AutoVideoCarousel
                      videos={resources}
                      onWatchVideo={handleWatchVideo}
                      isPlayerOpen={selectedVideo !== null}
                    />

                    {/* 2. PROFESSIONAL FOLDER AND CATEGORY SYSTEM (Visual 3D Glass Folders) */}
                    <FolderGrid
                      resources={resources}
                      apps={apps}
                      onOpenFolder={handleOpenFolder}
                    />

                    {/* 3. APPS & GAMES SECTION (Separate Box with First Screen Image - Press to Open Link Direct) */}
                    <AppsSection
                      apps={apps}
                      onOpenApp={handleOpenApp}
                    />

                    {/* 4. CORE MEDIA BOXES (Audio Box, Video Box, Animated Stories Box) */}
                    <HomeMediaBoxes
                      resources={resources}
                      onPlayAudio={handlePlayAudio}
                      onWatchVideo={handleWatchVideo}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                        setActiveFolderId(null);
                      }}
                    />
                  </>
                )}
              </>
            )}

            {/* FULL LIBRARY VIEW */}
            {activeTab === 'library' && (
              <ContentLibrary
                resources={resources}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
                onOpenGame={handleOpenApp}
                initialCategory={libraryCategoryFilter}
              />
            )}

            {/* AUDIO POEMS TAB */}
            {activeTab === 'poems' && (
              <ContentLibrary
                resources={resources}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
                onOpenGame={handleOpenApp}
                initialCategory="audio_poems"
              />
            )}

            {/* ANIMATED STORIES TAB */}
            {activeTab === 'stories' && (
              <ContentLibrary
                resources={resources}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
                onOpenGame={handleOpenApp}
                initialCategory="animated_stories"
              />
            )}

            {/* GAMES & APPS VIEW */}
            {activeTab === 'apps' && (
              <div className="py-6">
                <AppsSection
                  apps={apps}
                  onOpenApp={handleOpenApp}
                />
              </div>
            )}

            {/* DOWNLOAD CENTER */}
            {activeTab === 'downloads' && (
              <DownloadCenter
                resources={resources}
                onPlayAudio={handlePlayAudio}
                onWatchVideo={handleWatchVideo}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Global Audio Player */}
      <GlobalAudioPlayer />

      {/* DEDICATED FULL-SCREEN VIDEO PLAYER MODAL */}
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
