import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EducationalResource, AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Music, 
  Video, 
  FileText, 
  Gamepad2, 
  Clock, 
  Download,
  Calendar,
  Flame,
  Star
} from 'lucide-react';

interface ThisWeekUpdatesProps {
  resources: EducationalResource[];
  apps: AppLink[];
  onPlayAudio?: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onWatchVideo: (video: EducationalResource) => void;
  onOpenPdf?: (pdf: EducationalResource) => void;
  onOpenApp: (appId: string) => void;
}

export const ThisWeekUpdates: React.FC<ThisWeekUpdatesProps> = ({
  resources,
  apps,
  onPlayAudio,
  onWatchVideo,
  onOpenPdf,
  onOpenApp,
}) => {
  const { getText } = useLanguage();

  const publishedItems = resources.filter((r) => r.published);
  const sortedResources = [...publishedItems].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  const updatesList = sortedResources.slice(0, 10);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const total = updatesList.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const child = container.children[currentIndex] as HTMLElement;
      if (child) {
        container.scrollTo({
          left: child.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const handleItemClick = (item: EducationalResource) => {
    if (item.content_type === 'video') {
      onWatchVideo(item);
    } else if (item.content_type === 'pdf') {
      if (onOpenPdf) onOpenPdf(item);
      else onWatchVideo(item);
    } else if (item.content_type === 'audio') {
      if (onPlayAudio) onPlayAudio(item, updatesList);
      else onWatchVideo(item);
    } else {
      onWatchVideo(item);
    }
  };

  if (total === 0) return null;

  return (
    <section 
      aria-label="New Updates This Week"
      className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Cartoon Frame Container */}
      <div className="card-3d-white p-5 sm:p-7 relative overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-white">
        
        {/* Frame Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/30">
              <Star className="w-6 h-6 fill-white drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-heading font-black bg-rose-500 text-white tracking-wider uppercase shadow-xs">
                  This Week
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Auto-Scrolling Gallery</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-0.5">
                New Learning Updates — This Week
              </h2>
            </div>
          </div>

          {/* < and > Navigation Signs on the Frame Screen */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-heading font-bold text-slate-400 hidden md:inline">
              {currentIndex + 1} of {total}
            </span>

            {/* < Backward Arrow Button */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-sky-50 text-slate-800 hover:text-blue-600 border-2 border-sky-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title="Previous Update (<)"
              aria-label="Previous Update Slide"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            {/* > Forward Arrow Button */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-sky-50 text-slate-800 hover:text-blue-600 border-2 border-sky-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title="Next Update (>)"
              aria-label="Next Update Slide"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Scrolling Images Frame Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {updatesList.map((item) => {
            const isVideo = item.content_type === 'video';
            const isAudio = item.content_type === 'audio';
            const isPdf = item.content_type === 'pdf';

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="w-[85%] sm:w-[48%] lg:w-[31.5%] shrink-0 snap-start bg-white border-2 border-sky-100 hover:border-blue-400 border-b-4 hover:border-b-blue-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between shadow-xs hover:-translate-y-1"
              >
                {/* Image Header with Media Icon Badge */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Format Badge: Audio / Video / PDF */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-heading font-bold flex items-center gap-1.5 shadow-sm border border-sky-100">
                    {isVideo && <Video className="w-3.5 h-3.5 text-rose-500" />}
                    {isAudio && <Music className="w-3.5 h-3.5 text-blue-500" />}
                    {isPdf && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                    <span className="capitalize">{item.content_type}</span>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-heading font-black uppercase shadow-xs">
                    Class {item.class_level}
                  </div>

                  {/* Center Play / Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/40">
                    <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {isVideo && <Play className="w-6 h-6 fill-blue-600 translate-x-0.5" />}
                      {isAudio && <Music className="w-6 h-6" />}
                      {isPdf && <Download className="w-6 h-6" />}
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs text-blue-600 font-heading font-bold mb-1">
                      <span>{item.subject}</span>
                      {item.duration && (
                        <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.duration}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title_en}
                    </h3>
                    
                    {item.title_sd && (
                      <p className="font-sindhi text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.title_sd}
                      </p>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Primary Curriculum</span>
                    <span className="text-blue-600 font-heading font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Open Now</span>
                      <Play className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
