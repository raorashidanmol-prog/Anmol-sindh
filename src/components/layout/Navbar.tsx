import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';
import { 
  BookOpen, 
  Music, 
  Video, 
  Gamepad2, 
  Download, 
  ShieldAlert, 
  Menu, 
  X, 
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home'), icon: Sparkles },
    { id: 'library', label: t('library'), icon: BookOpen },
    { id: 'poems', label: t('poems'), icon: Music },
    { id: 'stories', label: t('stories'), icon: Video },
    { id: 'apps', label: t('gamesApps'), icon: Gamepad2 },
    { id: 'downloads', label: t('downloads'), icon: Download },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#04060a]/92 backdrop-blur-xl border-b border-[#00e599]/20 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Zone 1: Brand Wordmark (Sindhi & English in Black & Pierrot Green) */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-[#00b875] via-[#00e599] to-[#4ffec0] flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(0,229,153,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_26px_rgba(0,229,153,0.6)] transition-all">
              <span className="font-sindhi text-xl font-bold">سنڌ</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sindhi text-lg md:text-xl font-bold text-white group-hover:text-[#00e599] transition-colors">
                  انمول سنڌ
                </span>
                <span className="text-[#00e599]/60">|</span>
                <span className="text-sm md:text-base font-extrabold tracking-tight text-white group-hover:text-[#00e599] transition-colors">
                  ANMOL SINDH
                </span>
              </div>
              <span className="text-[10px] md:text-xs text-[#00e599] font-medium tracking-wide">
                Learn · Listen · Watch · Play · Grow
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 py-1.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'text-[#00e599] font-bold border-b-2 border-[#00e599] drop-shadow-[0_0_8px_rgba(0,229,153,0.4)]' 
                      : 'text-slate-300 hover:text-[#00e599]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#00e599]' : 'text-slate-400 group-hover:text-[#00e599]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Language selector & Admin Portal */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Segmented Control in Pierrot Green */}
            <div className="flex items-center p-1 bg-[#090f1a] rounded-lg border border-[#00e599]/30 shadow-inner">
              <button
                onClick={() => setLanguage('sd')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  language === 'sd'
                    ? 'bg-[#00e599] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,153,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="سنڌي"
              >
                سنڌي
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  language === 'ur'
                    ? 'bg-[#00e599] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,153,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="اردو"
              >
                اردو
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  language === 'en'
                    ? 'bg-[#00e599] text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,153,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/60 hover:bg-[#00e599]/30 shadow-[0_0_12px_rgba(0,229,153,0.3)]'
                  : 'bg-[#090f1a] text-slate-200 border border-slate-700 hover:border-[#00e599]/50 hover:text-[#00e599] shadow-sm'
              }`}
              title={isAdminLoggedIn ? 'Admin Panel Active' : 'Owner Admin Login'}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-[#00e599]' : 'text-slate-400'}`} />
              <span>{isAdminLoggedIn ? 'Dashboard' : t('admin')}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-[#00e599] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#00e599]/20 bg-[#060a12]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#00e599]/15 text-[#00e599] font-bold border border-[#00e599]/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-[#00e599]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#00e599]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
