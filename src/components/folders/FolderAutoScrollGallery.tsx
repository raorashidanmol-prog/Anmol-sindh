import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EducationalResource, AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Music, 
  Video, 
  FileText, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface FolderAutoScrollGalleryProps {
  folderTitle: string;
  resources: EducationalResource[];
  apps: AppLink[];
  onWatchVideo: (video: EducationalResource) => void;
  onPlayAudio?: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onOpenPdf?: (pdf: EducationalResource) => void;
  onOpenApp: (appId: string) => void;
  onDownload: (item: EducationalResource) => void;
}

export const FolderAutoScrollGallery: React.FC<FolderAutoScrollGalleryProps> = ({
  folderTitle,
  resources,
  apps,
  onWatchVideo,
  onPlayAudio,
  onOpenPdf,
  onOpenApp,
  onDownload,
}) => {
  const { getText, language } = useLanguage();

  // Combine items for the auto-scrolling image reel
  const allItems: Array<{
    id: string;
    type: 'video' | 'audio' | 'pdf' | 'app';
    title: string;
    description: string;
    imageUrl: string;
    classLevel?: string;
    duration?: string;
    rawResource?: EducationalResource;
    rawApp?: AppLink;
  }> = [];

  resources.forEach((r) => {
    allItems.push({
      id: r.id,
      type: r.content_type === 'video' ? 'video' : r.content_type === 'audio' ? 'audio' : 'pdf',
      title: getText(r, 'title'),
      description: getText(r, 'description'),
      imageUrl: r.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg',
      classLevel: r.class_level,
      duration: r.duration || r.file_size,
      rawResource: r,
    });
  });

  apps.forEach((a) => {
    allItems.push({
      id: a.id,
      type: 'app',
      title: getText(a, 'title'),
      description: getText(a, 'description'),
      imageUrl: a.first_screen_image || a.thumbnail_url || '/src/assets/images/fun_with_math_1792756361029.jpg',
      rawApp: a,
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = allItems.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  if (total === 0) return null;

  const handleCardClick = (item: typeof allItems[0]) => {
    if (item.type === 'video' && item.rawResource) {
      onWatchVideo(item.rawResource);
    } else if (item.type === 'pdf' && item.rawResource) {
      if (onOpenPdf) {
        onOpenPdf(item.rawResource);
      } else {
        onDownload(item.rawResource);
      }
    } else if (item.type === 'audio' && item.rawResource) {
      if (onPlayAudio) onPlayAudio(item.rawResource, resources.filter((r) => r.content_type === 'audio'));
    } else if (item.type === 'app' && item.rawApp) {
      if (item.rawApp.url && (item.rawApp.url.startsWith('http://') || item.rawApp.url.startsWith('https://'))) {
        window.open(item.rawApp.url, '_blank');
      } else {
        onOpenApp(item.rawApp.id);
      }
    } else if (item.rawResource) {
      onDownload(item.rawResource);
    }
  };

  return (
    <div 
      className="glass-3d-box rounded-2xl p-5 mb-8 border border-[#00e599]/30 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header with Title and < > Arrow Controls on the screen */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse"></span>
          <span className="text-xs uppercase font-black text-[#00e599] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'sd' ? 'فولڊر مواد خودڪار اسڪرول گيلري' : 'فولڈر مواد خودکار اسکرول گیلری'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-400">Auto-Scrolls Every 3s</span>
        </div>

        {/* < and > Navigation signs on screen */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#00e599]">
            {currentIndex + 1} / {total}
          </span>

          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-lg bg-[#091522] hover:bg-[#00e599] text-white hover:text-slate-950 border border-[#00e599]/35 flex items-center justify-center transition-all cursor-pointer font-bold shadow-sm"
            title="Previous (<)"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-lg bg-[#091522] hover:bg-[#00e599] text-white hover:text-slate-950 border border-[#00e599]/35 flex items-center justify-center transition-all cursor-pointer font-bold shadow-sm"
            title="Next (>)"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Single Active Slide / Gallery Window */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-[#00e599]/25 group/reel cursor-pointer">
        {allItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
              currentIndex === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover/reel:scale-103 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent flex items-center p-6 sm:p-10">
              <div className="max-w-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00e599] text-slate-950 text-[10px] font-black uppercase">
                    {item.type}
                  </span>
                  {item.classLevel && (
                    <span className="px-2 py-0.5 rounded bg-black/70 text-[#00e599] text-[10px] font-bold border border-[#00e599]/30">
                      Class {item.classLevel}
                    </span>
                  )}
                  {item.duration && (
                    <span className="text-[11px] text-slate-300 font-mono">
                      {item.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-white font-sindhi line-clamp-1 group-hover/reel:text-[#00e599] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 font-light">
                  {item.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#00e599] text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,153,0.35)]">
                    {item.type === 'video' && <Play className="w-3.5 h-3.5 fill-current" />}
                    {item.type === 'audio' && <Music className="w-3.5 h-3.5" />}
                    {item.type === 'app' && <ExternalLink className="w-3.5 h-3.5" />}
                    {item.type === 'pdf' && <FileText className="w-3.5 h-3.5" />}
                    <span>{item.type === 'video' ? 'Watch Full Screen' : item.type === 'audio' ? 'Play Audio' : item.type === 'app' ? 'Open App' : 'Download Document'}</span>
                  </span>
                  <span className="text-[11px] text-[#00e599] font-medium hidden sm:inline">
                    (Click Image to Play)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Overlay Navigation Buttons on image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#00e599] text-white hover:text-slate-950 flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer border border-[#00e599]/40"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#00e599] text-white hover:text-slate-950 flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer border border-[#00e599]/40"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Progress ticker dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {allItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`transition-all rounded-full cursor-pointer ${
              currentIndex === i 
                ? 'w-6 h-1.5 bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.6)]' 
                : 'w-1.5 h-1.5 bg-slate-800 hover:bg-slate-600'
            }`}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
