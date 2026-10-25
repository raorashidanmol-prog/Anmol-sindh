import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Film, 
  Eye, 
  Clock, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface AutoVideoCarouselProps {
  videos: EducationalResource[];
  onWatchVideo: (video: EducationalResource) => void;
  isPlayerOpen: boolean;
}

export const AutoVideoCarousel: React.FC<AutoVideoCarouselProps> = ({
  videos,
  onWatchVideo,
  isPlayerOpen,
}) => {
  const { getText, language } = useLanguage();

  // Filter valid published videos
  const validVideos = videos.filter(
    (v) => v.published && (v.content_type === 'video' || v.category === 'educational_videos' || v.category === 'animated_stories')
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch and drag handling for swipe support & click protection
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const isSwipingRef = useRef(false);

  const total = validVideos.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  // 3-second auto-scroll interval with smooth tick progress
  useEffect(() => {
    if (total <= 1 || !isAutoScrolling || isHovered || isPlayerOpen) {
      return;
    }

    const intervalTime = 3000;
    const stepTime = 50;
    const increment = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [total, isAutoScrolling, isHovered, isPlayerOpen, nextSlide]);

  // Handle Touch Gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    touchDeltaXRef.current = currentX - touchStartXRef.current;
    if (Math.abs(touchDeltaXRef.current) > 10) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && isSwipingRef.current) {
      const threshold = 45; // min px for swipe
      if (touchDeltaXRef.current < -threshold) {
        nextSlide();
      } else if (touchDeltaXRef.current > threshold) {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 50);
  };

  const handleCardClick = (video: EducationalResource) => {
    if (isSwipingRef.current) return;
    onWatchVideo(video);
  };

  if (validVideos.length === 0) return null;

  return (
    <section 
      aria-label="Educational Video Carousel"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Title and Auto-Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b875] to-[#00e599] flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,153,0.35)]">
            <Film className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#00e599] font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Video Gallery
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Auto-Scrolls Every 3s</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sindhi">
              {language === 'sd' 
                ? 'وڊيو گيلري ۽ اينيميٽڊ سبق (Video Gallery)' 
                : language === 'ur' 
                ? 'ویڈیو گیلری اور اینیمیٹڈ اسباق' 
                : 'Interactive Educational Video Gallery'}
            </h2>
          </div>
        </div>

        {/* Carousel Action Controls: Prev, Play/Pause Auto-scroll, Next */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Pause / Play Auto-Scroll Toggle Button */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAutoScrolling
                ? 'bg-[#00e599]/15 text-[#00e599] border-[#00e599]/40 hover:bg-[#00e599]/25 shadow-[0_0_10px_rgba(0,229,153,0.2)]'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isAutoScrolling ? 'Pause Automatic Scrolling' : 'Play Automatic Scrolling'}
            aria-label={isAutoScrolling ? 'Pause Auto Scroll' : 'Play Auto Scroll'}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Auto: 3s</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse"></span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Previous Arrow Button */}
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-300 hover:text-slate-950 border border-[#00e599]/30 hover:border-[#00e599] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(0,229,153,0.35)]"
            title="Previous Video"
            aria-label="Previous Video Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-xl bg-[#09121f] hover:bg-[#00e599] text-slate-300 hover:text-slate-950 border border-[#00e599]/30 hover:border-[#00e599] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(0,229,153,0.35)]"
            title="Next Video"
            aria-label="Next Video Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar indicating 3-second Auto-Scroll status */}
      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-4 border border-[#00e599]/10">
        <div 
          className="h-full bg-gradient-to-r from-[#00b875] to-[#00e599] transition-all duration-75 shadow-[0_0_8px_rgba(0,229,153,0.6)]"
          style={{ width: isAutoScrolling && !isHovered && !isPlayerOpen ? `${progress}%` : '0%' }}
        />
      </div>

      {/* Responsive Gallery Viewport & Carousel Slider */}
      <div 
        className="relative overflow-hidden rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {validVideos.map((video, idx) => (
            <div
              key={video.id}
              className="w-full shrink-0 px-1"
            >
              <div 
                onClick={() => handleCardClick(video)}
                className="glass-3d-box rounded-2xl p-4 sm:p-6 cursor-pointer group hover:border-[#00e599]/60 transition-all flex flex-col lg:flex-row gap-6 items-center"
              >
                {/* Video Large Thumbnail Preview with Play Overlay */}
                <div className="relative w-full lg:w-3/5 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-[#00e599]/25 shrink-0">
                  <img
                    src={video.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                    alt={video.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:bg-black/30 transition-colors"></div>

                  {/* Big Glowing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00e599] text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,153,0.7)] group-hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#00e599]/30 text-[#00e599] text-xs font-bold">
                    Class {video.class_level}
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#00e599] text-slate-950 text-xs font-black shadow-md uppercase">
                    {video.language === 'sd' ? 'سنڌي' : video.language === 'ur' ? 'اردو' : 'English'}
                  </div>

                  {/* Bottom duration & resolution badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#00e599]" />
                      <span>{video.duration || '08:00'}</span>
                    </span>
                    <span className="bg-[#00e599]/20 border border-[#00e599]/40 text-[#00e599] px-2 py-0.5 rounded text-[11px] font-bold">
                      Click to Watch Full Screen
                    </span>
                  </div>
                </div>

                {/* Right Side Video Details */}
                <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#00e599] font-bold">
                      <span>{video.subject}</span>
                      <span>·</span>
                      <span className="text-slate-400 capitalize">{video.category.replace('_', ' ')}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-sindhi text-white group-hover:text-[#00e599] transition-colors leading-relaxed">
                      {getText(video, 'title')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {getText(video, 'description')}
                    </p>
                  </div>

                  {/* Footer metadata & Watch Button */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#00e599]" />
                        <span className="tabular-nums">{video.views_count} views</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchVideo(video);
                      }}
                      className="px-4 py-2 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,153,0.35)] transition-all cursor-pointer group-hover:shadow-[0_0_22px_rgba(0,229,153,0.5)]"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Watch Full Player</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {validVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
              setProgress(0);
            }}
            className={`transition-all rounded-full cursor-pointer ${
              currentIndex === i 
                ? 'w-7 h-2 bg-[#00e599] shadow-[0_0_10px_rgba(0,229,153,0.6)]' 
                : 'w-2 h-2 bg-slate-800 hover:bg-slate-600'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
