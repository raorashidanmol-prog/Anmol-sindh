import React, { useState, useEffect } from 'react';
import { Sparkles, Gamepad2, Play, Star, Zap } from 'lucide-react';

interface GameLoadingScreenProps {
  gameTitle: string;
  gameCategory?: string;
  logoUrl?: string;
  onFinishLoading: () => void;
  isLoading: boolean;
}

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({
  gameTitle,
  gameCategory,
  logoUrl,
  onFinishLoading,
  isLoading,
}) => {
  const [progress, setProgress] = useState(12);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingMessages = [
    'Anmol Sindh – Get Ready to Play!',
    'انمول سنڌ - راند شروع ٿيڻ واري آهي!',
    'Loading game world and interactive graphics...',
    'ٻارن لاءِ بهترين ۽ رنگين راند تيار ٿي رهي آهي...',
    'Almost ready! Have fun learning!',
  ];

  // Progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 100;
        }
        // Random incremental jump for natural game loading feeling
        const jump = Math.floor(Math.random() * 14) + 6;
        return Math.min(prev + jump, 98);
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  // Text cycling
  useEffect(() => {
    const textTimer = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => clearInterval(textTimer);
  }, []);

  // Trigger finish after progress reaches 100% or iframe reported loaded
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        onFinishLoading();
      }, 450);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onFinishLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#091b33] via-[#0c2340] to-[#061120] text-white overflow-hidden select-none animate-in fade-in duration-300">
      
      {/* Ambient background particles & glowing aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-[90px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-500/15 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-400/15 rounded-full blur-[70px]"></div>

        {/* Floating Stars */}
        <div className="absolute top-16 left-12 text-amber-300/70 text-2xl animate-bounce duration-1000">⭐</div>
        <div className="absolute top-28 right-20 text-yellow-200/80 text-xl animate-pulse">✨</div>
        <div className="absolute bottom-24 left-20 text-rose-300/70 text-2xl animate-bounce duration-700">🎈</div>
        <div className="absolute bottom-20 right-28 text-emerald-300/80 text-3xl animate-pulse">🌟</div>
        <div className="absolute top-1/2 left-8 text-sky-300/70 text-lg animate-spin duration-3000">💫</div>
        <div className="absolute top-1/2 right-10 text-purple-300/70 text-xl animate-bounce">🎮</div>
      </div>

      {/* Main Center Card */}
      <div className="relative z-10 max-w-lg w-full mx-4 p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-xl border-4 border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center flex flex-col items-center">
        
        {/* Glow Halo behind Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 via-yellow-400 to-rose-400 rounded-full blur-xl opacity-75 animate-pulse"></div>
          
          {/* Animated ANMOL SINDH Logo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 border-4 border-white shadow-2xl flex flex-col items-center justify-center p-2 transform hover:scale-105 transition-all animate-bounce duration-1000">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="ANMOL SINDH Logo"
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}

            {/* In case no custom image or error, render official glowing emblem */}
            <div className="flex flex-col items-center justify-center text-white drop-shadow-md">
              <div className="flex items-center gap-1">
                <Gamepad2 className="w-8 h-8 text-amber-300 animate-pulse" />
                <Sparkles className="w-6 h-6 text-yellow-200" />
              </div>
              <span className="font-heading font-black text-sm tracking-wider uppercase text-yellow-300 leading-tight mt-1">
                ANMOL SINDH
              </span>
              <span className="font-sindhi font-bold text-xs text-white/95 leading-none mt-0.5">
                انمول سنڌ
              </span>
            </div>
          </div>
        </div>

        {/* Title & Brand */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 border border-white/30 text-yellow-300 text-xs font-heading font-bold shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-yellow-300" />
            <span>{gameCategory || 'Online Primary Game'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight drop-shadow-md pt-2 line-clamp-1">
            {gameTitle}
          </h2>

          {/* Slogan */}
          <p className="text-sm sm:text-base font-heading font-extrabold text-sky-200 transition-all duration-300">
            {loadingMessages[loadingTextIndex]}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-heading font-bold px-1">
            <span className="text-sky-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Loading game elements...</span>
            </span>
            <span className="text-yellow-300 font-mono text-sm">{progress}%</span>
          </div>

          <div className="h-4 w-full bg-black/40 rounded-full p-1 border-2 border-white/20 overflow-hidden shadow-inner relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 transition-all duration-200 shadow-[0_0_15px_rgba(251,191,36,0.8)] relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Action Button: Launch Immediately */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={onFinishLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-heading font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/40 border-2 border-white flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Game Now →</span>
          </button>
        </div>

        {/* Bottom Child-Friendly reassurance */}
        <p className="text-[11px] text-slate-300 mt-4 opacity-80">
          🎮 Playing inside ANMOL SINDH • No popups • 100% Safe for Primary Kids
        </p>
      </div>

    </div>
  );
};
