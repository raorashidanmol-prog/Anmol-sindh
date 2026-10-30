import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  FileText, 
  Play, 
  Gamepad2, 
  BookOpen, 
  Globe, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { InAppViewerItem } from '../../types';
import { getYouTubeVideoId, detectMediaType } from '../../utils/staticStorage';
import { useLanguage } from '../../context/LanguageContext';

interface InAppViewerProps {
  item: InAppViewerItem | null;
  onClose: () => void;
  onSelectRelated?: (item: InAppViewerItem) => void;
}

export const InAppViewer: React.FC<InAppViewerProps> = ({ item, onClose }) => {
  const { language } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [pdfMode, setPdfMode] = useState<'google' | 'direct'>('google');
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with browser history for clean Android and mobile Back navigation
  useEffect(() => {
    if (!item) return;

    // Push hash so device back button closes viewer
    window.location.hash = 'viewer';

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      if (window.location.hash === '#viewer') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
  }, [item, onClose]);

  // Reset loading whenever URL changes
  useEffect(() => {
    setIframeLoading(true);
    setIframeError(false);
    const timer = setTimeout(() => {
      setIframeLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [item?.url, iframeKey]);

  if (!item) return null;

  const detectedType = detectMediaType(item.url, item.type);
  const ytId = getYouTubeVideoId(item.url);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Resolve correct viewer URL
  const getEmbedUrl = (): string => {
    if (ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1`;
    }

    if (detectedType === 'pdf') {
      const fullUrl = item.url.startsWith('http')
        ? item.url
        : `${window.location.origin}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
      if (pdfMode === 'google') {
        return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(fullUrl)}`;
      }
      return item.url;
    }

    return item.url;
  };

  const resolvedUrl = getEmbedUrl();

  // Type badge info
  const getTypeBadge = () => {
    switch (detectedType) {
      case 'youtube':
        return { label: 'YouTube Video', icon: Play, color: 'bg-red-950 text-red-400 border-red-800' };
      case 'video':
        return { label: 'Video Player', icon: Play, color: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'pdf':
        return { label: 'PDF Document', icon: BookOpen, color: 'bg-blue-950 text-blue-400 border-blue-800' };
      case 'game':
        return { label: 'Educational Game', icon: Gamepad2, color: 'bg-purple-950 text-purple-400 border-purple-800' };
      case 'app':
        return { label: 'In-App Tool', icon: Sparkles, color: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      default:
        return { label: 'Website / Game', icon: Globe, color: 'bg-slate-800 text-[#00e599] border-slate-700' };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#04060a] flex flex-col text-slate-100 overflow-hidden animate-in fade-in duration-200"
    >
      {/* ======================================================== */}
      {/* TOP VIEWER HEADER                                       */}
      {/* ======================================================== */}
      <header className="h-16 px-3 sm:px-6 bg-slate-950/95 border-b border-[#00e599]/30 backdrop-blur-md flex items-center justify-between shrink-0 shadow-xl shadow-black/50 z-30">
        
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden pr-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-[#00e599] hover:from-emerald-500 hover:to-[#00f7a5] text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-[#00e599]/20 transition-all transform active:scale-95 shrink-0"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="hidden xs:inline font-sindhi">واپس موٽيو</span>
            <span className="xs:hidden">Back</span>
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md md:max-w-xl font-sindhi">
                {item.title}
              </h1>
              <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>
            {item.folder && (
              <p className="text-[11px] text-[#00e599] font-mono truncate">
                فولڊر: {item.folder}
              </p>
            )}
          </div>
        </div>

        {/* Right: Controls & X Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* PDF Viewer Toggle Mode (Only for PDF) */}
          {detectedType === 'pdf' && (
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setPdfMode('google')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pdfMode === 'google' ? 'bg-[#00e599] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Docs Reader
              </button>
              <button
                onClick={() => setPdfMode('direct')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  pdfMode === 'direct' ? 'bg-[#00e599] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct PDF
              </button>
            </div>
          )}

          {/* Refresh / Reload */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors"
            title="Reload content"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors hidden sm:flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Details toggle */}
          {item.description && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-xl border transition-colors ${
                showDetails ? 'bg-[#00e599] text-black border-[#00e599]' : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
              title="Show info"
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          {/* Direct External Link Fallback */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-[#00e599] rounded-xl border border-slate-800 transition-colors"
            title="Open externally if frame blocked by site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* X Close Button */}
          <button
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors ml-1"
            title="Close viewer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* COLLAPSIBLE DETAILS BAR                                  */}
      {/* ======================================================== */}
      {showDetails && item.description && (
        <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-3 text-xs text-slate-300 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 font-sindhi">
            <span className="text-[#00e599] font-bold">وضاحت:</span>
            <span>{item.description}</span>
          </div>
          <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN IN-APP VIEWER CANVAS                               */}
      {/* ======================================================== */}
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
        
        {/* Loading Spinner */}
        {iframeLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
            <div className="w-12 h-12 border-4 border-[#00e599] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-[#00e599] font-bold text-sm font-sindhi">
              مواد اندروني فريم ۾ هلڻ لاءِ تيار ٿي رهيو آهي...
            </p>
          </div>
        )}

        {/* 1. YOUTUBE EMBED PLAYER */}
        {detectedType === 'youtube' && ytId ? (
          <div className="w-full h-full max-w-6xl flex items-center justify-center p-2 sm:p-4">
            <div className="w-full h-full max-h-[85vh] aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <iframe
                key={iframeKey}
                src={resolvedUrl}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </div>
        ) : detectedType === 'video' ? (
          /* 2. DIRECT HTML5 VIDEO PLAYER */
          <div className="w-full h-full max-w-5xl flex items-center justify-center p-2 sm:p-6">
            <div className="w-full max-h-[85vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
              <video
                key={iframeKey}
                src={item.url}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] object-contain rounded-xl"
                onLoadedData={() => setIframeLoading(false)}
              >
                توهان جو برائوزر وڊيو ٽيگ کي سپورٽ نٿو ڪري.
              </video>
            </div>
          </div>
        ) : (
          /* 3. GAMES, WEBSITES, APPS, AND PDF VIEWER */
          <div className="w-full h-full flex flex-col">
            <iframe
              key={iframeKey}
              src={resolvedUrl}
              title={item.title}
              className="w-full h-full border-0 flex-1 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-pointer-lock"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              onLoad={() => setIframeLoading(false)}
              onError={() => {
                setIframeLoading(false);
                setIframeError(true);
              }}
            />

            {/* In-Frame Security Notice Banner */}
            <div className="h-8 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Running securely inside Anmol Sindh In-App Viewer</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-slate-500">
                  جيڪڏهن ڪا سائيٽ ايمبيڊ بند رکي، ته سڄي پاسي External بٽڻ ڪلڪ ڪريو
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00e599] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Open Full Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
