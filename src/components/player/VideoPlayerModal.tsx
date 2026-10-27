import React, { useState, useRef, useEffect } from 'react';
import { EducationalResource } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  X, 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Film, 
  Eye,
  AlertCircle,
  Clock,
  Share2,
  Check
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: EducationalResource | null;
  onClose: () => void;
  relatedVideos: EducationalResource[];
  onSelectVideo: (video: EducationalResource) => void;
  contextTitle?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  relatedVideos,
  onSelectVideo,
  contextTitle,
}) => {
  const { getText, language, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPipAvailable, setIsPipAvailable] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper to detect YouTube links and extract video ID
  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = video ? getYouTubeId(video.media_url) : null;

  // Browser Back Navigation and Android Mobile Back Navigation support
  useEffect(() => {
    if (!video) return;

    // Push a modal history state so Android/browser back button closes the video
    window.history.pushState({ modal: 'video_player', videoId: video.id }, '');

    const handlePopState = () => {
      // User pressed browser or mobile back button
      handleCloseCleanup();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [video]);

  // Clean up media and release resources when closed
  const handleCloseCleanup = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    setIsPlaying(false);
    onClose();
  };

  useEffect(() => {
    if (document.pictureInPictureEnabled) {
      setIsPipAvailable(true);
    }
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);

    // Increment view count on server
    if (video) {
      fetch(`/api/content/${video.id}/view`, { method: 'POST' }).catch(() => {});
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [video]);

  if (!video) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setHasError(true));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById('dedicated-video-container');
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        el.requestFullscreen().catch(() => {});
      }
    }
  };

  const handlePip = async () => {
    try {
      if (videoRef.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      }
    } catch {}
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSpeedMenuOpen(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!video.downloadable) return;
    fetch(`/api/content/${video.id}/download`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        const a = document.createElement('a');
        a.href = data.download_url || video.media_url || '#';
        a.download = data.filename || `${video.title_en || 'video'}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => {});
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  // Fallback video source if media_url is blank
  const mediaSrc = video.media_url || '/uploads/folk_story_animated.mp4';

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Dedicated Video Player"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Navigation Bar: Clear Back Button, Title, and Close Button */}
      <header className="sticky top-0 z-20 w-full bg-[#040810]/95 backdrop-blur-md border-b border-[#00e599]/25 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Clear Back Button */}
        <button
          onClick={handleCloseCleanup}
          className="px-3 sm:px-4 py-2 bg-[#091522] hover:bg-[#00e599] text-[#00e599] hover:text-slate-950 border border-[#00e599]/40 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
          title="Return to Previous Gallery / Folder"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {language === 'sd' 
              ? `واپس (${contextTitle || 'گيلري'})` 
              : language === 'ur' 
              ? `واپس (${contextTitle || 'گیلری'})` 
              : `Back to ${contextTitle || 'Gallery'}`}
          </span>
        </button>

        {/* Video Title in header (truncated on small screens) */}
        <div className="min-w-0 text-center flex-1 hidden md:block">
          <h2 className="text-white text-sm lg:text-base font-bold font-sindhi truncate">
            {getText(video, 'title')}
          </h2>
          <p className="text-[11px] text-[#00e599] font-medium truncate">
            Class {video.class_level} · {video.subject} · {video.category.replace('_', ' ')}
          </p>
        </div>

        {/* Action Controls: Share + Visible X Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="p-2 text-slate-300 hover:text-[#00e599] bg-[#091522] border border-slate-700 hover:border-[#00e599]/50 rounded-xl transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            title="Share Video Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#00e599]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Visible X Close button */}
          <button
            onClick={handleCloseCleanup}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-rose-600/80 border border-slate-700 hover:border-rose-500 rounded-xl transition-all cursor-pointer"
            title="Close Video Player"
            aria-label="Close Video Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Video View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* Dedicated Video Canvas Container */}
        <div 
          id="dedicated-video-container"
          className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#00e599]/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(0,229,153,0.18)] flex items-center justify-center group"
        >
          {youtubeId ? (
            /* YouTube Authorized Strict Embed (rel=0 & modestbranding prevent external recommendations) */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1&showinfo=0&disablekb=0`}
              title={video.title_en}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : hasError ? (
            <div className="text-center p-6 text-slate-300 space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-base font-semibold">Video preview stream connecting...</p>
              <p className="text-xs text-slate-400 max-w-md">
                Stream range request active for {video.title_en}. If using mobile, tap the play icon below.
              </p>
              <button
                onClick={() => {
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 bg-[#00e599] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                Retry Stream
              </button>
            </div>
          ) : (
            /* HTML5 Video Player */
            <>
              <video
                ref={videoRef}
                src={mediaSrc}
                poster={video.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setHasError(true)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
                playsInline
                preload="metadata"
              />

              {/* Big Center Play Button Overlay when paused */}
              {!isPlaying && !hasError && (
                <button
                  onClick={togglePlay}
                  className="absolute w-20 h-20 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,153,0.7)] transition-all transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                  aria-label="Play Video"
                >
                  <Play className="w-10 h-10 fill-current translate-x-1" />
                </button>
              )}

              {/* Controls Overlay bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 sm:p-5 pt-8 flex flex-col gap-2.5 opacity-95 group-hover:opacity-100 transition-opacity z-10">
                {/* Scrubber Range Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00e599]"
                  aria-label="Video scrubber"
                />

                <div className="flex items-center justify-between text-xs text-white">
                  {/* Left: Play/Pause, Volume, Time */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={togglePlay} 
                      className="hover:text-[#00e599] transition-colors cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={toggleMute} 
                        className="hover:text-[#00e599] cursor-pointer"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#00e599]" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setVolume(v);
                          setIsMuted(v === 0);
                          if (videoRef.current) {
                            videoRef.current.volume = v;
                            videoRef.current.muted = v === 0;
                          }
                        }}
                        className="w-16 h-1 bg-slate-700 rounded appearance-none accent-[#00e599] hidden sm:block"
                        aria-label="Volume slider"
                      />
                    </div>

                    <span className="tabular-nums text-slate-300 font-mono text-[11px] sm:text-xs">
                      <span className="text-[#00e599] font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right: Speed, PiP, Download, Fullscreen */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Speed Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                        className="px-2 py-0.5 bg-[#09121f] hover:bg-[#00e599]/20 rounded text-[#00e599] border border-[#00e599]/30 text-[11px] font-bold cursor-pointer"
                        aria-label="Playback Speed"
                      >
                        {playbackSpeed}x
                      </button>
                      {speedMenuOpen && (
                        <div className="absolute bottom-full right-0 mb-2 py-1 bg-[#09121f] border border-[#00e599]/30 rounded-lg shadow-2xl z-50">
                          {speeds.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSpeedChange(s)}
                              className={`block w-full text-left px-3 py-1 hover:bg-[#00e599]/20 text-xs ${
                                playbackSpeed === s ? 'text-[#00e599] font-bold' : 'text-slate-300'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {isPipAvailable && (
                      <button 
                        onClick={handlePip} 
                        className="hover:text-[#00e599] hidden sm:inline text-xs font-semibold cursor-pointer" 
                        title="Picture in Picture"
                      >
                        PiP
                      </button>
                    )}

                    {video.downloadable && (
                      <button 
                        onClick={handleDownload} 
                        className="hover:text-[#00e599] cursor-pointer" 
                        title="Download Video File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    <button 
                      onClick={handleFullscreen} 
                      className="hover:text-[#00e599] cursor-pointer" 
                      title="Full Screen View"
                      aria-label="Full Screen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Information & Metadata Panel */}
        <div className="mt-6 glass-3d-box rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#00e599] font-bold mb-1">
                <span>Class {video.class_level}</span>
                <span>·</span>
                <span>{video.subject}</span>
                <span>·</span>
                <span className="text-slate-400 capitalize">{video.category.replace('_', ' ')}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-sindhi leading-relaxed">
                {getText(video, 'title')}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-[#091522] border border-slate-800 px-3 py-1.5 rounded-lg">
                <Eye className="w-4 h-4 text-[#00e599]" />
                <span className="tabular-nums">{video.views_count} views</span>
              </span>

              {video.downloadable && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('download')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {getText(video, 'description')}
          </p>

          {/* Related Videos Strip */}
          {relatedVideos.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-[#00e599] uppercase tracking-wider mb-3">
                {language === 'sd' ? 'ٻيا تجويز ڪيل تعليمي سبق' : 'مزید تجویز کردہ اسباق'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedVideos.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectVideo(item)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#091522] hover:bg-[#00e599]/15 border border-[#00e599]/20 hover:border-[#00e599]/40 cursor-pointer transition-all group"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 relative">
                      <img
                        src={item.thumbnail_url || '/src/assets/images/animated_stories_1792756361819.jpg'}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-[#00e599] fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate font-sindhi group-hover:text-[#00e599]">
                        {getText(item, 'title')}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        Class {item.class_level} · {item.duration || 'Video'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Bottom Footer Back Link */}
      <footer className="w-full bg-[#040810]/95 border-t border-[#00e599]/20 py-3 text-center">
        <button
          onClick={handleCloseCleanup}
          className="text-xs text-[#00e599] hover:underline font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'sd' ? 'واپس وڃو ۽ بند ڪريو' : 'واپس جائیں اور بند کریں'}</span>
        </button>
      </footer>
    </div>
  );
};
