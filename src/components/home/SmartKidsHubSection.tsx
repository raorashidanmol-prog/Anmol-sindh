import React, { useState } from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  Video, 
  Palette, 
  Globe2, 
  FlaskConical, 
  Calculator, 
  FileText, 
  FileCheck, 
  Sparkles, 
  Star, 
  Trophy, 
  Gift, 
  Play, 
  ArrowRight, 
  Maximize2, 
  Volume2, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { EducationalResource, AppLink } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SmartKidsHubSectionProps {
  resources: EducationalResource[];
  apps: AppLink[];
  onWatchVideo: (video: EducationalResource) => void;
  onOpenPdf: (pdf: EducationalResource) => void;
  onOpenApp: (appId: string) => void;
  onNavigateTab: (tab: string) => void;
  onSelectSubject: (subjectName: string) => void;
}

export const SmartKidsHubSection: React.FC<SmartKidsHubSectionProps> = ({
  resources,
  apps,
  onWatchVideo,
  onOpenPdf,
  onOpenApp,
  onNavigateTab,
  onSelectSubject,
}) => {
  const { language } = useLanguage();
  const [activeTabGroup, setActiveTabGroup] = useState<'primary' | 'more'>('primary');

  // Featured sample items for the 3 Learning Sections
  const featuredVideo = resources.find(r => r.content_type === 'video') || resources[0];
  const featuredPdf = resources.find(r => r.content_type === 'pdf') || resources[1];
  const mathApp = apps.find(a => a.id.includes('math') || a.title_en?.toLowerCase().includes('math')) || apps[0];
  const testApp = apps.find(a => a.id.includes('test') || a.title_en?.toLowerCase().includes('test')) || apps[1];

  // 8 Primary Subject Cards (Exact replica of reference image row)
  const primarySubjects = [
    {
      id: 'english',
      name: 'English',
      sindhiName: 'انگريزي',
      bgGradient: 'from-[#ff2a6d] to-[#e0144c]',
      borderBottom: '#990033',
      shadowColor: 'rgba(255, 42, 109, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <BookOpen className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onSelectSubject('English'),
    },
    {
      id: 'math',
      name: 'Mathematics',
      sindhiName: 'رياضي',
      bgGradient: 'from-[#10b981] to-[#059669]',
      borderBottom: '#047857',
      shadowColor: 'rgba(16, 185, 129, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner font-heading font-black text-xl text-white">
          + - × ÷
        </div>
      ),
      action: () => onSelectSubject('Mathematics'),
    },
    {
      id: 'science',
      name: 'Science',
      sindhiName: 'سائنس',
      bgGradient: 'from-[#f97316] to-[#ea580c]',
      borderBottom: '#c2410c',
      shadowColor: 'rgba(249, 115, 22, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <FlaskConical className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onSelectSubject('General Science'),
    },
    {
      id: 'gk',
      name: 'General Knowledge',
      sindhiName: 'عام معلومات',
      bgGradient: 'from-[#8b5cf6] to-[#7c3aed]',
      borderBottom: '#5b21b6',
      shadowColor: 'rgba(139, 92, 246, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <Globe2 className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onSelectSubject('Social Studies'),
    },
    {
      id: 'urdu',
      name: 'Urdu & Sindhi',
      sindhiName: 'سنڌي ۽ اردو',
      bgGradient: 'from-[#06b6d4] to-[#0891b2]',
      borderBottom: '#0e7490',
      shadowColor: 'rgba(6, 182, 212, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner font-sindhi font-black text-2xl text-white">
          اب
        </div>
      ),
      action: () => onSelectSubject('Sindhi'),
    },
    {
      id: 'art',
      name: 'Art & Craft',
      sindhiName: 'تصويرون ۽ آرٽ',
      bgGradient: 'from-[#84cc16] to-[#65a30d]',
      borderBottom: '#4d7c0f',
      shadowColor: 'rgba(132, 204, 22, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <Palette className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('stories'),
    },
    {
      id: 'games',
      name: 'Games',
      sindhiName: 'رانديون',
      bgGradient: 'from-[#f43f5e] to-[#e11d48]',
      borderBottom: '#9f1239',
      shadowColor: 'rgba(244, 63, 94, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <Gamepad2 className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('apps'),
    },
    {
      id: 'stories',
      name: 'Stories',
      sindhiName: 'ڪهاڻيون',
      bgGradient: 'from-[#2563eb] to-[#1d4ed8]',
      borderBottom: '#1e40af',
      shadowColor: 'rgba(37, 99, 235, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <BookOpen className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('stories'),
    },
  ];

  // Additional 4 Subject/Category Cards specifically requested in prompt:
  // video, PDf Books, PDf test, test Maker App
  const extraSubjects = [
    {
      id: 'videos',
      name: 'Video Gallery',
      sindhiName: 'وڊيو گيلري',
      bgGradient: 'from-[#e11d48] to-[#be123c]',
      borderBottom: '#881337',
      shadowColor: 'rgba(225, 29, 72, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <Video className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('videos'),
    },
    {
      id: 'pdf_books',
      name: 'PDF Books',
      sindhiName: 'درسي ڪتاب (PDF)',
      bgGradient: 'from-[#f59e0b] to-[#d97706]',
      borderBottom: '#b45309',
      shadowColor: 'rgba(245, 158, 11, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <BookOpen className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('downloads'),
    },
    {
      id: 'pdf_test',
      name: 'PDF Tests',
      sindhiName: 'ٽيسٽ پيپرز (PDF)',
      bgGradient: 'from-[#6366f1] to-[#4f46e5]',
      borderBottom: '#3730a3',
      shadowColor: 'rgba(99, 102, 241, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <FileCheck className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onNavigateTab('downloads'),
    },
    {
      id: 'test_maker',
      name: 'Test Maker App',
      sindhiName: 'ٽيسٽ ميڪر ايپ',
      bgGradient: 'from-[#ec4899] to-[#db2777]',
      borderBottom: '#9d174d',
      shadowColor: 'rgba(236, 72, 153, 0.4)',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
          <Sparkles className="w-7 h-7 text-white drop-shadow-md" />
        </div>
      ),
      action: () => onOpenApp('app_ra_test_maker'),
    },
  ];

  const currentCards = activeTabGroup === 'primary' ? primarySubjects : extraSubjects;

  return (
    <div id="subject-cards-row" className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-10">
      
      {/* ============================================================ */}
      {/* 1. SUBJECT CARDS (3D GLOSSY CARDS MATCHING REFERENCE IMAGE) */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Explore Subjects & Fun Learning
            </h2>
          </div>

          {/* Tab Selector between Core Subjects & Video/PDF Apps */}
          <div className="flex items-center p-1 bg-white rounded-full border-2 border-sky-100 shadow-sm">
            <button
              onClick={() => setActiveTabGroup('primary')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
                activeTabGroup === 'primary'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Core Subjects (8)
            </button>
            <button
              onClick={() => setActiveTabGroup('more')}
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition-all ${
                activeTabGroup === 'more'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Videos, PDFs & Tests (4)
            </button>
          </div>
        </div>

        {/* 3D Subject Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {currentCards.map((subj) => (
            <button
              key={subj.id}
              onClick={subj.action}
              style={{
                borderBottomColor: subj.borderBottom,
                boxShadow: `0 10px 20px -4px ${subj.shadowColor}`,
              }}
              className={`subject-card-3d bg-gradient-to-b ${subj.bgGradient} p-3.5 sm:p-4 text-white text-center flex flex-col items-center justify-between min-h-[140px] sm:min-h-[155px] cursor-pointer group`}
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                {subj.icon}
              </div>

              <div className="w-full mt-2">
                <span className="font-heading font-black text-xs sm:text-sm text-white leading-tight block drop-shadow-sm">
                  {subj.name}
                </span>
                <span className="font-sindhi text-[11px] text-white/90 leading-none block mt-0.5 opacity-90 truncate">
                  {subj.sindhiName}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. LEARNING SECTIONS (3 HERO CARDS MATCHING REFERENCE IMAGE) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Fun Learning Videos */}
        <div className="card-3d-white p-5 flex flex-col justify-between overflow-hidden relative group">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Fun Learning Videos
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('videos')}
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blackboard / Video Illustration */}
          <div 
            onClick={() => featuredVideo && onWatchVideo(featuredVideo)}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-emerald-950 border-4 border-amber-800 shadow-inner cursor-pointer group/video"
          >
            {/* Blackboard surface with teacher & "Aa" apple */}
            <div className="absolute inset-0 bg-[#163828] flex items-center justify-center p-4">
              <div className="flex items-center justify-between w-full px-2">
                {/* Chalk Text */}
                <div className="space-y-1">
                  <div className="font-heading font-black text-4xl sm:text-5xl text-yellow-100 tracking-wider">
                    Aa
                  </div>
                  <div className="text-emerald-300 font-heading text-xs font-semibold">
                    Alphabet Lesson
                  </div>
                </div>

                {/* Apple & Teacher Icon */}
                <div className="text-4xl sm:text-5xl filter drop-shadow-md animate-pulse">
                  🍎
                </div>
              </div>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover/video:bg-black/15 flex items-center justify-center transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-xl shadow-black/40 group-hover/video:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-blue-600 translate-x-0.5" />
              </div>
            </div>

            {/* Video Controls Bar Mock */}
            <div className="absolute bottom-0 inset-x-0 bg-black/80 px-3 py-1.5 flex items-center justify-between text-white text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <Play className="w-3 h-3 fill-white" />
                <span>0:00 / 5:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3" />
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-heading font-bold text-slate-700 line-clamp-1">
              {featuredVideo?.title_en || 'Primary English & Sindhi Lessons'}
            </span>
            <span className="text-rose-500 font-heading font-extrabold shrink-0">
              HD Video
            </span>
          </div>
        </div>

        {/* Card 2: Online Quiz */}
        <div className="card-3d-white p-5 flex flex-col justify-between overflow-hidden relative group">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Trophy className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Online Quiz
              </h3>
            </div>
            <button
              onClick={() => onOpenApp('app_ra_test_maker')}
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Play Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3D Golden Trophy Box */}
          <div 
            onClick={() => onOpenApp('app_ra_test_maker')}
            className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-amber-200 shadow-inner cursor-pointer group/trophy"
          >
            <img
              src="/src/assets/images/learning_quiz_trophy_1793432219345.jpg"
              alt="Online Quiz - Test Your Knowledge"
              className="w-full h-full object-cover group-hover/trophy:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            
            {/* Purple Ribbon Banner: Test Your Knowledge! */}
            <div className="absolute bottom-3 inset-x-4 flex justify-center">
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-heading font-black text-xs sm:text-sm shadow-lg shadow-purple-900/40 border-2 border-white tracking-wide">
                Test Your Knowledge! 🏆
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-heading font-bold text-slate-700">
              Interactive Quizzes & RA Test Papers
            </span>
            <span className="text-amber-600 font-heading font-black">
              Win Stars!
            </span>
          </div>
        </div>

        {/* Card 3: Daily Activity */}
        <div className="card-3d-white p-5 flex flex-col justify-between overflow-hidden relative group">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Daily Activity
              </h3>
            </div>
            <button
              onClick={() => onOpenApp('app_fun_with_math')}
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Try Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Colorful Jigsaw Puzzle & Smiling Star Box */}
          <div 
            onClick={() => onOpenApp('app_fun_with_math')}
            className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-sky-200 shadow-inner cursor-pointer group/puzzle"
          >
            <img
              src="/src/assets/images/daily_activity_puzzle_1793432220475.jpg"
              alt="Daily Activity Puzzle - Complete Fun Activities"
              className="w-full h-full object-cover group-hover/puzzle:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Overlay Banner */}
            <div className="absolute bottom-3 inset-x-4 flex justify-center">
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-heading font-black text-xs shadow-lg shadow-blue-900/40 border-2 border-white tracking-wide">
                Complete Activities & Earn Stars! ⭐
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-heading font-bold text-slate-700">
              Puzzles, Math Games & Art Exercises
            </span>
            <span className="text-emerald-600 font-heading font-black">
              Daily Challenge
            </span>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM VALUE PILLS & RAINBOW BANNER (Matches Reference Image) */}
      {/* ============================================================ */}
      <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* 4 Value Pills */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-heading font-bold shadow-xs hover:scale-105 transition-transform">
            <span>🌱</span>
            <span>Build Good Habits</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-heading font-bold shadow-xs hover:scale-105 transition-transform">
            <span>❤️</span>
            <span>Be Kind & Helpful</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 text-blue-800 text-xs font-heading font-bold shadow-xs hover:scale-105 transition-transform">
            <span>🎓</span>
            <span>Aim for Success</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-800 text-xs font-heading font-bold shadow-xs hover:scale-105 transition-transform">
            <span>😊</span>
            <span>Enjoy Learning</span>
          </div>
        </div>

        {/* Rainbow Banner */}
        <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 border-2 border-white relative overflow-hidden shrink-0">
          <span className="relative z-10">Together Towards a Brighter Future</span>
          <span className="text-base relative z-10">🌈</span>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-amber-400 to-rose-400 opacity-60"></div>
        </div>

      </div>

    </div>
  );
};
