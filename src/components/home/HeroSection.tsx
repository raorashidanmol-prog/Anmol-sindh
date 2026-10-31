import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  Calculator, 
  FileCheck, 
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onSelectClass: (lvl: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenApp: (appId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectClass,
  onNavigateTab,
  onOpenApp,
}) => {
  const { language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigateTab('library');
    }
  };

  const classes = [
    { id: '1', label: 'Class 1', color: 'from-pink-500 to-rose-600', borderColor: 'border-rose-400', desc: 'Pre-Primary & Alphabet' },
    { id: '2', label: 'Class 2', color: 'from-emerald-500 to-green-600', borderColor: 'border-green-400', desc: 'Poems & Math Basics' },
    { id: '3', label: 'Class 3', color: 'from-amber-500 to-orange-600', borderColor: 'border-amber-400', desc: 'Grammar & Multiplication' },
    { id: '4', label: 'Class 4', color: 'from-sky-500 to-blue-600', borderColor: 'border-blue-400', desc: 'Science & Literature' },
    { id: '5', label: 'Class 5', color: 'from-purple-500 to-indigo-600', borderColor: 'border-purple-400', desc: 'Past Papers & History' },
  ];

  return (
    <div className="relative overflow-hidden pt-4 pb-8 sm:pt-6 sm:pb-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ============================================================ */}
        {/* HERO PANORAMIC BANNER (Matches Reference Image) */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_16px_40px_rgba(56,189,248,0.28)] border-4 border-white bg-gradient-to-b from-[#bfe8ff] via-[#d6f0ff] to-[#a7e089]">
          
          {/* Background Illustration */}
          <div className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/hero_cartoon_classroom_kids_1793432219514.jpg"
              alt="Cartoon Kids Learning - Learn Play Grow"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Gradient Overlays for High Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-sky-900/15 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-white/40 pointer-events-none"></div>

            {/* Left Wooden Signboard: "Dream Big • Study Hard" */}
            <div className="absolute left-4 sm:left-8 top-8 sm:top-14 hidden md:block z-10 transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 text-white px-5 py-3 rounded-2xl border-4 border-amber-950 shadow-xl text-center">
                <span className="block font-heading font-black text-xs uppercase tracking-wider text-amber-200">
                  Daily Motivation
                </span>
                <span className="font-heading font-black text-base sm:text-lg text-white leading-tight block">
                  Dream Big
                </span>
                <span className="font-heading font-black text-sm sm:text-base text-yellow-300 leading-tight block">
                  Study Hard
                </span>
              </div>
              <div className="w-3 h-8 bg-amber-950 mx-auto -mt-1 rounded-b shadow-md"></div>
            </div>

            {/* Right Idea Lightbulb Floating Badge */}
            <div className="absolute right-4 sm:right-10 top-8 sm:top-12 hidden md:block z-10 animate-bounce duration-1000">
              <div className="bg-amber-400 text-amber-950 p-3 rounded-2xl border-2 border-amber-500 shadow-lg shadow-amber-300/60 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-100 fill-yellow-200" />
                <span className="font-heading font-black text-xs tracking-wider uppercase">
                  Bright Ideas!
                </span>
              </div>
            </div>

            {/* Center Main Stage Content */}
            <div className="relative z-20 text-center px-4 max-w-3xl mx-auto py-10 sm:py-16">
              
              {/* Playful Pill Pre-Title */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-sky-300 text-sky-700 text-xs sm:text-sm font-heading font-bold shadow-md mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Primary Students Learning Platform (Classes 1–5)</span>
              </div>

              {/* Catchy 3D Heading: Learn • Play • Grow */}
              <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(255,255,255,0.9)] mb-3 select-none">
                <span className="text-sky-600 drop-shadow-[0_3px_0_#0284c7]">Learn</span>
                <span className="text-amber-400 mx-2 sm:mx-3 text-3xl sm:text-5xl align-middle">•</span>
                <span className="text-rose-500 drop-shadow-[0_3px_0_#e11d48]">Play</span>
                <span className="text-amber-400 mx-2 sm:mx-3 text-3xl sm:text-5xl align-middle">•</span>
                <span className="text-emerald-500 drop-shadow-[0_3px_0_#10b981]">Grow</span>
              </h1>

              {/* Subtitle: A Fun Learning Platform for Primary Students */}
              <p className="font-heading font-extrabold text-base sm:text-xl lg:text-2xl text-slate-900 max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] mb-6">
                A Fun Learning Platform for Primary Students
              </p>

              {/* Start Learning Big 3D Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('subject-cards-row');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigateTab('library');
                  }}
                  className="btn-3d-yellow px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg flex items-center gap-3 cursor-pointer group"
                >
                  <span className="font-heading font-black">Start Learning</span>
                  <div className="w-7 h-7 rounded-full bg-amber-700/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4 text-amber-950 stroke-[3]" />
                  </div>
                </button>

                <button
                  onClick={() => onOpenApp('app_fun_with_math')}
                  className="btn-3d-blue px-6 py-3.5 rounded-full text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span className="font-heading font-bold">Play Math Games</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Trust Strip */}
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 border-t-2 border-sky-100 flex flex-wrap items-center justify-around gap-4 text-xs font-heading font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sindh & Punjab Primary Curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>100% In-App Safe & Child-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Interactive Games & Video Poems</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* GRADE / CLASS QUICK PICKER (Classes 1–5) */}
        {/* ============================================================ */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-800">
                Choose Student Grade (Classes 1–5)
              </h2>
            </div>
            <button
              onClick={() => {
                onSelectClass('all');
                onNavigateTab('library');
              }}
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Classes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectClass(c.id);
                  onNavigateTab('library');
                }}
                className="bg-white hover:bg-sky-50/50 border-2 border-sky-100 hover:border-sky-300 border-b-4 hover:border-b-sky-400 rounded-2xl p-3.5 text-left transition-all hover:-translate-y-1 shadow-sm cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-sm text-slate-800 group-hover:text-blue-600">
                    {c.label}
                  </span>
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${c.color} text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                    {c.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {c.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
