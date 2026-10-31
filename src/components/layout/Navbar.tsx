import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Gamepad2, 
  Video, 
  Puzzle, 
  Info, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Lock, 
  Menu, 
  X, 
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  logoUrl?: string;
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdmin,
  isAdminLoggedIn,
  logoUrl,
  onSearch,
}) => {
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectsDropdownOpen, setSubjectsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setSubjectsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subjectsList = [
    { id: 'english', name: 'English', color: '#f43f5e' },
    { id: 'math', name: 'Mathematics', color: '#16a34a' },
    { id: 'science', name: 'Science', color: '#f97316' },
    { id: 'gk', name: 'General Knowledge', color: '#7c3aed' },
    { id: 'urdu', name: 'Urdu & Sindhi', color: '#0d9488' },
    { id: 'art', name: 'Art & Craft', color: '#84cc16' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 lg:px-8 pt-2.5 pb-2 transition-all">
      {/* Floating White Pill Container with Sky-Blue Glow */}
      <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(56,189,248,0.22),0_2px_8px_rgba(0,0,0,0.06)] border-2 border-sky-100 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* ============================================================ */}
        {/* 1. BRAND LOGO: Smart Kids Learning Hub */}
        {/* ============================================================ */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-400/30 group-hover:scale-105 transition-transform relative">
              {/* Rainbow Open Book with Star */}
              <div className="relative">
                <BookOpen className="w-6 h-6 text-white drop-shadow-sm" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-heading font-black text-lg sm:text-xl text-blue-600 tracking-tight leading-none">
                Smart Kids
              </span>
            </div>
            <span className="font-heading font-black text-sm sm:text-base text-rose-500 tracking-tight leading-none mt-0.5">
              Learning Hub
            </span>
          </div>
        </button>

        {/* ============================================================ */}
        {/* 2. DESKTOP NAVIGATION PILLS */}
        {/* ============================================================ */}
        <nav className="hidden xl:flex items-center gap-2">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-heading font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/35 hover:bg-blue-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-sky-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* Subjects Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSubjectsDropdownOpen(!subjectsDropdownOpen)}
              onBlur={() => setTimeout(() => setSubjectsDropdownOpen(false), 200)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all ${
                activeTab === 'library'
                  ? 'bg-blue-50 text-blue-600 font-extrabold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-sky-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Subjects</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${subjectsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {subjectsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border-2 border-sky-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-heading font-bold text-slate-400 uppercase tracking-wider">
                  Select Subject
                </div>
                {subjectsList.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (onSearch) onSearch(sub.name);
                      handleNavClick('library');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-xl text-left transition-colors"
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: sub.color }}
                    />
                    <span>{sub.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Games */}
          <button
            onClick={() => handleNavClick('apps')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all ${
              activeTab === 'apps'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/35'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${activeTab === 'apps' ? 'text-white' : 'text-rose-500'}`} />
            <span>Games</span>
          </button>

          {/* Videos */}
          <button
            onClick={() => handleNavClick('videos')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all ${
              activeTab === 'videos'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/35'
                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Video className={`w-4 h-4 ${activeTab === 'videos' ? 'text-white' : 'text-red-500'}`} />
            <span>Videos</span>
          </button>

          {/* Activities */}
          <button
            onClick={() => handleNavClick('stories')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all ${
              activeTab === 'stories'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/35'
                : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Puzzle className={`w-4 h-4 ${activeTab === 'stories' ? 'text-white' : 'text-emerald-500'}`} />
            <span>Activities</span>
          </button>

          {/* About */}
          <button
            onClick={() => handleNavClick('downloads')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all ${
              activeTab === 'downloads'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/35'
                : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <Info className="w-4 h-4 text-amber-500" />
            <span>About</span>
          </button>
        </nav>

        {/* ============================================================ */}
        {/* 3. SEARCH BAR & STUDENT AVATAR */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-sky-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-36 lg:w-48 pl-9 pr-3 py-1.5 bg-sky-50/80 hover:bg-sky-50 focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 rounded-full border border-sky-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Student Profile Avatar */}
          <div 
            className="flex items-center gap-2 p-1 bg-amber-50 rounded-full border-2 border-amber-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
            title="Student Profile"
          >
            <img
              src="/src/assets/images/kid_avatar_boy_1793432219141.jpg"
              alt="Student Avatar"
              className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
            />
          </div>

          {/* Discreet Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isAdminLoggedIn
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
            title={isAdminLoggedIn ? 'Owner Admin Active' : 'Owner Admin Login'}
          >
            {isAdminLoggedIn ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-full text-slate-600 hover:bg-sky-50 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>

        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE MENU DRAWER */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="xl:hidden max-w-7xl mx-auto mt-2 bg-white rounded-3xl shadow-xl border-2 border-sky-100 p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-sky-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons, stories, games..."
                className="w-full pl-9 pr-4 py-2 bg-sky-50 text-sm rounded-full border border-sky-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </form>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('library')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'library' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>All Subjects</span>
          </button>

          <button
            onClick={() => handleNavClick('apps')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'apps' ? 'bg-rose-500 text-white' : 'text-slate-700 hover:bg-rose-50'
            }`}
          >
            <Gamepad2 className="w-5 h-5 text-rose-500" />
            <span>Educational Games</span>
          </button>

          <button
            onClick={() => handleNavClick('videos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'videos' ? 'bg-red-500 text-white' : 'text-slate-700 hover:bg-red-50'
            }`}
          >
            <Video className="w-5 h-5 text-red-500" />
            <span>Fun Videos</span>
          </button>

          <button
            onClick={() => handleNavClick('stories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'stories' ? 'bg-emerald-500 text-white' : 'text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <Puzzle className="w-5 h-5 text-emerald-500" />
            <span>Activities & Stories</span>
          </button>

          <button
            onClick={() => handleNavClick('downloads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-heading font-bold text-left transition-colors ${
              activeTab === 'downloads' ? 'bg-amber-500 text-white' : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Info className="w-5 h-5 text-amber-500" />
            <span>About & Books</span>
          </button>
        </div>
      )}
    </header>
  );
};
