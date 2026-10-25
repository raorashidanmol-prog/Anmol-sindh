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
  Flame
} from 'lucide-react';

interface ThisWeekUpdatesProps {
  resources: EducationalResource[];
  apps: AppLink[];
  onPlayAudio: (track: EducationalResource, playlist?: EducationalResource[]) => void;
  onWatchVideo: (video: EducationalResource) => void;
  onOpenApp: (appId: string) => void;
}

export const ThisWeekUpdates: React.FC<ThisWeekUpdatesProps> = ({
  resources,
  apps,
  onPlayAudio,
  onWatchVideo,
  onOpenApp,
}) => {
  const { getText, language } = useLanguage();

  // Combine latest resources & featured apps for "This Week" frame
  const publishedItems = resources.filter((r) => r.published);
  
  // Sort by latest created date or sort_order
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

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3200);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  // Sync scroll position with currentIndex
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth > 768 ? container.offsetWidth / 3 : container.offsetWidth * 0.85;
      container.scrollTo({
        left: currentIndex * (cardWidth + 16),
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const handleItemClick = (item: EducationalResource) => {
    if (item.content_type === 'video') {
      onWatchVideo(item);
    } else if (item.content_type === 'audio') {
      onPlayAudio(item, updatesList.filter((r) => r.content_type === 'audio'));
    } else if (item.content_type === 'pdf') {
      // Trigger download
      const a = document.createElement('a');
      a.href = item.download_url || item.media_url || '#';
      a.download = `${item.title_en || 'worksheet'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (updatesList.length === 0) return null;

  return (
    <section 
      aria-label="This Week Updates"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Dedicated "This Week" Frame with 3D Glassy Border */}
      <div className="glass-3d-box rounded-3xl p-5 sm:p-7 relative overflow-hidden border-2 border-[#00e599]/35 shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(0,229,153,0.15)]">
        
        {/* Decorative Top Accent Tag: "THIS WEEK" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {/* Prominent "This Week" Badge */}
            <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#00e599] to-[#4ffec0] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_18px_rgba(0,229,153,0.4)] shrink-0">
              <Flame className="w-4 h-4 fill-current text-slate-950 animate-bounce" />
              <span>This Week</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sindhi leading-snug">
                {language === 'sd' 
                  ? 'هن هفتي جون نيون اپڊيٽس (New Updates This Week)' 
                  : language === 'ur' 
                  ? 'اس ہفتے کی نئی اپڈیٹس (This Week Updates)' 
                  : 'New Learning Updates — This Week'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'sd'
                  ? 'سڀ نيون آڊيو نظمون، تعليمي وڊيوز ۽ درسي ورڪ شيٽس خودڪار اسڪرول ۾ ڏسو.'
                  : 'Latest audio poems, video lessons, and worksheets updated this week.'}
              </p>
            </div>
          </div>

          {/* < and > Navigation Signs on the Frame Screen */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono text-[#00e599] hidden md:inline">
              {currentIndex + 1} / {total}
            </span>

            {/* < Backward Arrow Button */}
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-xl bg-[#091522] hover:bg-[#00e599] text-white hover:text-slate-950 border border-[#00e599]/40 hover:border-[#00e599] flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.4)] active:scale-95 text-base font-bold"
              title="Previous Update (<)"
              aria-label="Previous Update Slide"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            {/* > Forward Arrow Button */}
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-xl bg-[#091522] hover:bg-[#00e599] text-white hover:text-slate-950 border border-[#00e599]/40 hover:border-[#00e599] flex items-center justify-center transition-all cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(0,229,153,0.4)] active:scale-95 text-base font-bold"
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
          {updatesList.map((item, idx) => {
            const isVideo = item.content_type === 'video';
            const isAudio = item.content_type === 'audio';
            const isPdf = item.content_type === 'pdf';

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="w-[85%] sm:w-[48%] lg:w-[31.5%] shrink-0 snap-start glass-3d-card rounded-2xl overflow-hidden cursor-pointer group hover:border-[#00e599]/60 transition-all flex flex-col justify-between"
              >
                {/* Image Header with Media Icon Badge */}
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnail_url || '/src/assets/images/anmol_sindh_hero_1792756358994.jpg'}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  {/* Format Badge: Audio / Video / PDF */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/85 border border-[#00e599]/40 text-[#00e599] text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    {isVideo && <Video className="w-3.5 h-3.5 text-[#00e599]" />}
                    {isAudio && <Music className="w-3.5 h-3.5 text-[#00e599]" />}
                    {isPdf && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                    <span className="capitalize">{item.content_type}</span>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-[#00e599] text-slate-950 text-[10px] font-black uppercase shadow-md">
                    Class {item.class_level}
                  </div>

                  {/* Center Play / Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,153,0.7)] group-hover:scale-110 transition-transform">
                      {isVideo && <Play className="w-6 h-6 fill-current translate-x-0.5" />}
                      {isAudio && <Music className="w-6 h-6" />}
                      {isPdf && <Download className="w-6 h-6" />}
                    </div>
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[11px] text-white">
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-black/70 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-[#00e599]" />
                      <span>{item.duration || item.file_size || 'Updated'}</span>
                    </span>
                    <span className="text-[10px] text-[#00e599] font-bold">
                      {isVideo ? 'Watch Video' : isAudio ? 'Play Audio' : 'Download PDF'}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#00e599] block">
                      {item.subject}
                    </span>
                    <h3 className="font-sindhi font-bold text-base text-white group-hover:text-[#00e599] transition-colors line-clamp-1">
                      {getText(item, 'title')}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {getText(item, 'description')}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.language === 'sd' ? 'سنڌي ٻولي' : item.language === 'ur' ? 'اردو زبان' : 'English'}
                    </span>
                    <span className="text-[#00e599] font-bold group-hover:underline">
                      {isVideo ? 'Play Now →' : isAudio ? 'Listen →' : 'Download →'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {updatesList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === i 
                  ? 'w-6 h-1.5 bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.6)]' 
                  : 'w-1.5 h-1.5 bg-slate-800 hover:bg-slate-600'
              }`}
              aria-label={`Go to update ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
