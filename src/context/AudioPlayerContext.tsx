import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { EducationalResource } from '../types';

interface AudioPlayerContextType {
  currentTrack: EducationalResource | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoop: boolean;
  playlist: EducationalResource[];
  isExpanded: boolean;
  playTrack: (track: EducationalResource, playlistContext?: EducationalResource[]) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setIsExpanded: (expanded: boolean) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Web Audio API synthesizer for pleasant melodic backup audio for primary poems
class PrimaryMelodySynth {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;
  private isPlaying = false;
  private currentStep = 0;

  // Delightful pentatonic Sindhi & folk inspired learning melody
  private notes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00,
    349.23, 329.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33,
    523.25, 440.00, 392.00, 329.63, 293.66, 261.63, 293.66, 261.63
  ];

  start(rate: number, onTick: (time: number) => void) {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx || this.ctx.state === 'suspended') {
        this.ctx = new AudioCtx();
      }
      this.isPlaying = true;
      let tickSec = 0;
      const speedMs = 450 / rate;

      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const noteFreq = this.notes[this.currentStep % this.notes.length];
        this.playPluck(noteFreq);
        this.currentStep++;
        tickSec += 0.45;
        onTick(tickSec);
      }, speedMs);
    } catch {
      // AudioContext not allowed before user interaction
    }
  }

  playPluck(freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm bell-like envelope
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentStep = 0;
  }

  pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<EducationalResource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // default fallback 3 mins
  const [volume, setVolumeState] = useState(0.85);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [playlist, setPlaylist] = useState<EducationalResource[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<PrimaryMelodySynth>(new PrimaryMelodySynth());
  const usingSynthRef = useRef<boolean>(false);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!usingSynthRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isLoop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    const handleError = () => {
      // If external media fails to load or is placeholder, seamlessly switch to primary melodic synth
      usingSynthRef.current = true;
      if (isPlaying) {
        synthRef.current.start(playbackRate, (t) => {
          setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.45));
        });
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      synthRef.current.stop();
    };
  }, [isLoop, playbackRate, isPlaying, duration]);

  const playTrack = (track: EducationalResource, playlistContext?: EducationalResource[]) => {
    setCurrentTrack(track);
    if (playlistContext && playlistContext.length > 0) {
      setPlaylist(playlistContext);
    } else if (!playlist.some((t) => t.id === track.id)) {
      setPlaylist((prev) => [...prev, track]);
    }

    setCurrentTime(0);
    // Parse duration string e.g. "03:45"
    if (track.duration) {
      const parts = track.duration.split(':');
      if (parts.length === 2) {
        const secs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (!isNaN(secs)) setDuration(secs);
      }
    }

    if (audioRef.current) {
      synthRef.current.stop();
      usingSynthRef.current = false;

      // Resolve audio source URL, with local valid fallback if empty
      const sourceUrl = track.media_url && track.media_url.trim() !== ''
        ? track.media_url
        : '/uploads/sample_poem_sur_kalyan.mp3';

      audioRef.current.src = sourceUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = volume;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // fallback to audio synth
          usingSynthRef.current = true;
          setIsPlaying(true);
          synthRef.current.start(playbackRate, () => {
            setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.45));
          });
        });
    }

    // Call server to increment view counter
    fetch(`/api/content/${track.id}/view`, { method: 'POST' }).catch(() => {});
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      if (usingSynthRef.current) {
        synthRef.current.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (usingSynthRef.current) {
        synthRef.current.start(playbackRate, () => {
          setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.45));
        });
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {
          usingSynthRef.current = true;
          synthRef.current.start(playbackRate, () => {
            setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.45));
          });
        });
      }
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (!usingSynthRef.current && audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    if (usingSynthRef.current && isPlaying) {
      synthRef.current.stop();
      synthRef.current.start(rate, () => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.45));
      });
    }
  };

  const toggleLoop = () => {
    setIsLoop((prev) => !prev);
  };

  const nextTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
      playTrack(playlist[currentIndex + 1], playlist);
    } else if (isLoop && playlist.length > 0) {
      playTrack(playlist[0], playlist);
    } else {
      setIsPlaying(false);
      synthRef.current.stop();
    }
  };

  const prevTrack = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist[currentIndex - 1], playlist);
    } else {
      seek(0);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    synthRef.current.stop();
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsExpanded(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        isLoop,
        playlist,
        isExpanded,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        setPlaybackRate,
        toggleLoop,
        nextTrack,
        prevTrack,
        setIsExpanded,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
