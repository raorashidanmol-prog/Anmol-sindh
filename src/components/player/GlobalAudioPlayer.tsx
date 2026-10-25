import React, { useState } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Download, 
  Maximize2, 
  Minimize2, 
  X, 
  Music, 
  FileText 
} from 'lucide-react';

export const GlobalAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLoop,
    togglePlay,
    seek,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    nextTrack,
    prevTrack,
    closePlayer,
    isExpanded,
    setIsExpanded,
  } = useAudioPlayer();

  const { getText, language } = useLanguage();
  const [showLyrics, setShowLyrics] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.75, 1, 1.25, 1.5, 2];

  const handleDownload = () => {
    if (!currentTrack.downloadable) return;
    fetch(`/api/content/${currentTrack.id}/download`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        const a = document.createElement('a');
        a.href = data.download_url || currentTrack.media_url || '#';
        a.download = data.filename || `${currentTrack.title_en || 'poem'}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(() => {});
  };

  return (
    <>
      {/* Mini Floating Player at screen bottom - Black & Pierrot Green */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#050811]/95 backdrop-blur-xl border-t border-[#00e599]/30 text-white shadow-[0_-8px_32px_rgba(0,0,0,0.85)] transition-all">
        {/* Progress scrubber bar */}
        <div 
          className="relative w-full h-1.5 bg-slate-900 hover:h-2.5 transition-all cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seek(clickPos * duration);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-[#00b875] via-[#00e599] to-[#4ffec0] relative shadow-[0_0_12px_rgba(0,229,153,0.6)]"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_rgba(0,229,153,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Track Information */}
          <div className="flex items-center gap-3 min-w-0 max-w-[35%] sm:max-w-[40%]">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-[#00e599]/30">
              <img 
                src={currentTrack.thumbnail_url || '/src/assets/images/rhymes_poems_1792756362325.jpg'} 
                alt="" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-ping"></div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate font-sindhi">
                {getText(currentTrack, 'title')}
              </h4>
              <p className="text-xs text-[#00e599] truncate flex items-center gap-1.5 font-medium">
                <span>Class {currentTrack.class_level}</span>
                <span aria-hidden="true">·</span>
                <span>{currentTrack.subject}</span>
              </p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Prev */}
              <button 
                onClick={prevTrack} 
                className="p-1.5 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause */}
              <button 
                onClick={togglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,153,0.45)] transition-all active:scale-95 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
              </button>

              {/* Next */}
              <button 
                onClick={nextTrack} 
                className="p-1.5 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Loop */}
              <button 
                onClick={toggleLoop} 
                className={`p-1.5 rounded transition-colors hidden sm:inline-flex cursor-pointer ${
                  isLoop ? 'text-[#00e599] bg-[#00e599]/20' : 'text-slate-400 hover:text-white'
                }`}
                title={isLoop ? 'Loop Enabled' : 'Loop Off'}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Time Stamp */}
            <div className="text-[11px] text-slate-400 tabular-nums">
              <span className="text-slate-200">{formatTime(currentTime)}</span>
              <span className="mx-1 text-[#00e599] font-bold">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Actions, Volume & Expansion */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                className="px-2 py-1 text-xs font-semibold bg-[#09121f] hover:bg-[#00e599]/20 text-[#00e599] rounded border border-[#00e599]/30 transition-colors"
                title="Playback Speed"
              >
                {playbackRate}x
              </button>
              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 py-1 bg-[#09121f] border border-[#00e599]/30 rounded-md shadow-2xl z-50 text-xs">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setPlaybackRate(s);
                        setSpeedMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 hover:bg-[#00e599]/20 ${
                        playbackRate === s ? 'text-[#00e599] font-bold' : 'text-slate-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                className="p-1 hover:text-[#00e599] transition-colors cursor-pointer"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00e599]" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00e599]"
              />
            </div>

            {/* Lyrics / Verse Viewer Button */}
            {(currentTrack.lyrics_sd || currentTrack.lyrics_ur || currentTrack.lyrics_en) && (
              <button
                onClick={() => {
                  setShowLyrics(!showLyrics);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  showLyrics ? 'bg-[#00e599] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="View Poem Verses"
              >
                <FileText className="w-4 h-4" />
              </button>
            )}

            {/* Download Audio */}
            {currentTrack.downloadable && (
              <button
                onClick={handleDownload}
                className="p-1.5 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer"
                title="Download MP3"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen / Expand Drawer */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-[#00e599] transition-colors cursor-pointer"
              title={isExpanded ? 'Minimize' : 'Expand View'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={closePlayer}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Expanded Modal / Poem Presentation Mode */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-[#04060a]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#00e599]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00b875] to-[#00e599] flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,153,0.4)]">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg font-sindhi">
                  {getText(currentTrack, 'title')}
                </h3>
                <p className="text-xs text-[#00e599]">
                  Class {currentTrack.class_level} · {currentTrack.subject}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 text-slate-400 hover:text-[#00e599] rounded-full bg-[#0a121f] border border-[#00e599]/30 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Stage: Artwork or Calligraphic Lyrics */}
          <div className="max-w-2xl mx-auto my-auto w-full text-center space-y-6">
            <div className="w-52 h-52 sm:w-64 sm:h-64 mx-auto rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(0,229,153,0.25)] border-2 border-[#00e599]/40">
              <img
                src={currentTrack.thumbnail_url || '/src/assets/images/rhymes_poems_1792756362325.jpg'}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Lyrics Card */}
            {(currentTrack.lyrics_sd || currentTrack.lyrics_ur) && (
              <div className="glass-3d-box p-6 rounded-2xl">
                <h5 className="text-xs uppercase tracking-wider text-[#00e599] mb-3 font-black">
                  {language === 'sd' ? 'نظم جا ٻول (شاعري)' : 'شاعری و ترانہ'}
                </h5>
                <p className="font-sindhi text-lg sm:text-2xl text-slate-100 whitespace-pre-line leading-relaxed sm:leading-loose">
                  {currentTrack.lyrics_sd || currentTrack.lyrics_ur}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Bar Controls for expanded view */}
          <div className="max-w-xl mx-auto w-full space-y-3 pb-8">
            <div 
              className="w-full h-2 bg-slate-900 rounded-full cursor-pointer overflow-hidden border border-[#00e599]/20"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                seek(clickPos * duration);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-[#00b875] to-[#00e599] shadow-[0_0_10px_rgba(0,229,153,0.5)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 tabular-nums">
              <span className="text-[#00e599]">{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <button onClick={prevTrack} className="p-3 text-slate-400 hover:text-[#00e599] cursor-pointer">
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#00e599] hover:bg-[#4ffec0] text-slate-950 flex items-center justify-center shadow-[0_0_24px_rgba(0,229,153,0.5)] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 translate-x-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-3 text-slate-400 hover:text-[#00e599] cursor-pointer">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
