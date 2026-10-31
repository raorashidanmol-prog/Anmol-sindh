import React from 'react';
import { Mail, MapPin, Shield, GraduationCap, Heart, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateTab: (tab: string) => void;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigateTab, logoUrl }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-white text-slate-700 pt-12 pb-8 border-t-4 border-sky-200 relative overflow-hidden mt-12">
      {/* Playful Rainbow Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-rose-400 via-amber-400 to-emerald-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-sky-100">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-xl object-contain shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-400/30">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-heading font-black text-lg text-blue-700 leading-tight">
                  Smart Kids Learning Hub
                </h3>
                <p className="font-heading font-bold text-xs text-rose-500">
                  Anmol Sindh Primary Platform
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              A modern, colorful, child-friendly educational platform designed for Pakistani primary school students (Classes 1–5), teachers, and parents.
            </p>

            <div className="text-xs text-blue-700 font-heading font-bold flex items-center gap-2 pt-1">
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Aligned with Sindh & Punjab Primary Curriculum</span>
            </div>
          </div>

          {/* Column 2: Learning Navigation */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Learning Sections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
              <li>
                <button onClick={() => onNavigateTab('library')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">
                  All Primary Subjects (کلاس 1 تا 5)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('videos')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">
                  Educational Videos & Lessons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('stories')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">
                  Animated Stories & Activities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('apps')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">
                  Fun with Math & RA Test Maker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('downloads')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">
                  Curriculum Books & PDF Reader
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Primary Grades */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Primary Grades
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-heading font-bold">
              <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200">Class 1</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Class 2</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">Class 3</span>
              <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-200">Class 4</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">Class 5</span>
            </div>
            <div className="pt-2">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                High-definition audio/video resources and printable materials in Sindhi (سنڌي), Urdu (اردو), and English.
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Owner Portal */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
              Contact & Portal
            </h4>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">raorashid.anmol@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Hyderabad, Sindh, Pakistan</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold bg-sky-50 hover:bg-sky-100 text-blue-700 rounded-full border-2 border-sky-200 transition-all cursor-pointer shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Owner Admin Dashboard</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Smart Kids Learning Hub · Anmol Sindh</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Primary Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
