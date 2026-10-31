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
  const { getText } = useLanguage();

  // Filter valid published videos
  const validVideos = videos.filter(
    (v) => v.published && (v.content_type === 'video' || v.category === 'educational_videos' || v.category === 'animated_stories' || v.category === 'video_poems')
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch and drag handling for swipe support
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
      const threshold = 45;
      if (touchDeltaXRef.current < -threshold) {
        nextSlide();
      } else if (touchDeltaXRef.current > threshold) {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
    isSwipingRef.current = false;
  };

  const handleCardClick = (video: EducationalResource) => {
    if (!isSwipingRef.current) {
      onWatchVideo(video);
    }
  };

  if (total === 0) {
    return null;
  }

  return (
    <section 
      aria-label="Educational Video Carousel"
      className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Title and Auto-Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/25">
            <Film className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-rose-600 font-heading font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured Video Gallery
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Auto-Scrolls Every 3s</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              Interactive Educational Video Carousel
            </h2>
          </div>
        </div>

        {/* Carousel Action Controls: Prev, Play/Pause Auto-scroll, Next */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Pause / Play Auto-Scroll Toggle Button */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
              isAutoScrolling
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
            title={isAutoScrolling ? 'Pause Automatic Scrolling' : 'Play Automatic Scrolling'}
            aria-label={isAutoScrolling ? 'Pause Auto Scroll' : 'Play Auto Scroll'}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Auto: 3s</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
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
            className="w-9 h-9 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-600 border-2 border-sky-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Previous Video"
            aria-label="Previous Video Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-600 border-2 border-sky-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Next Video"
            aria-label="Next Video Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Progress Bar indicating 3-second Auto-Scroll status */}
      <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-rose-500 transition-all duration-75"
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
          {validVideos.map((video) => (
            <div
              key={video.id}
              className="w-full shrink-0 px-1"
            >
              <div 
                onClick={() => handleCardClick(video)}
                className="card-3d-white p-4 sm:p-6 cursor-pointer group flex flex-col lg:flex-row gap-6 items-center"
              >
                {/* Video Large Thumbnail Preview with Play Overlay */}
                <div className="relative w-full lg:w-3/5 aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-sky-200 shrink-0 shadow-md">
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
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/50 group-hover:scale-110 active:scale-95 transition-all border-4 border-white">
                      <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/30 text-white text-xs font-heading font-bold">
                    Class {video.class_level}
                  </div>

                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-heading font-black shadow-md">
                    {video.subject}
                  </div>

                  {/* Bottom duration & resolution badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{video.duration || '08:00'}</span>
                    </span>
                    <span className="bg-blue-600/90 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-heading font-bold">
                      Click to Watch In-App
                    </span>
                  </div>
                </div>

                {/* Right Side Video Details */}
                <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-heading font-bold">
                      <span>{video.subject}</span>
                      <span>·</span>
                      <span className="text-slate-500 capitalize">{video.category.replace('_', ' ')}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight font-sindhi">
                      {getText(video, 'title')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-sindhi">
                      {getText(video, 'description')}
                    </p>
                  </div>

                  {/* Footer metadata & Watch Button */}
                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-sky-500" />
                        <span className="tabular-nums">{video.views_count} views</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchVideo(video);
                      }}
                      className="btn-3d-blue px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Watch in Viewer</span>
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
                ? 'w-7 h-2 bg-blue-600 shadow-sm' 
                : 'w-2 h-2 bg-sky-200 hover:bg-sky-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
